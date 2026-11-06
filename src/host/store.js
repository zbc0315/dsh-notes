'use strict'

/**
 * @tom2012/dsh-notes — 存储层（Host 侧唯一读写入口）
 *
 * 设计要点（与 docs/STORE-CONTRACT.md 一一对应）：
 *
 *  - **BlockNote blocks JSON 是真源**：正文写在 `<rootDir>/<notebookId>/<pageId>.json`
 *    （`{ id, title, created, updated, tags, blocks }`），旁边 `<pageId>.md` 是每次保存
 *    重写的 Markdown 镜像（YAML frontmatter + blocksToMarkdown(blocks)），供搜索/导出/
 *    Agent 读，不读回（迁移除外）。`index.json` 只是缓存，init() 时按磁盘校正。
 *  - 单写者：所有写操作走 `_serial()` 的 Promise 链，进程内天然串行。
 *  - 原子写：临时文件 → fh.sync() → close → rename，断电不会留下半个文件。
 *  - 页面级乐观锁：savePage 比对 rev；比对 baseMtimeMs/baseSize 发现外部改动时，
 *    先把磁盘上的整份 `.json` 复制成 `.conflict-<ts>.json`，再照常写入。
 *  - 删除进回收站：`.trash/<YYYYMMDD-HHmmss-SSS>/` 下整块移入（.json 与 .md 都进）。
 *
 * 依赖：只用 node:fs / node:path / node:os / node:crypto（外加同目录的 markdown-blocks）。
 */

const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const crypto = require('node:crypto')

const { markdownToBlocks, blocksToMarkdown } = require('./markdown-blocks')

// 用 fs.promises 而不是再 require('node:fs/promises')，保持依赖面只有 node:fs。
const fsp = fs.promises

/* ------------------------------------------------------------------ *
 * 常量
 * ------------------------------------------------------------------ */

/** index.json 的格式版本。 */
const INDEX_VERSION = 1

/** 附件后缀白名单（也是路径穿越的第一道闸：不在表内直接 400）。 */
const ASSET_EXTS = Object.freeze(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'])

/** 生成 id 用的字符表（base36）。 */
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

/** sha256 的合法形态：64 位小写 hex。 */
const SHA_RE = /^[0-9a-f]{64}$/

/**
 * 镜像 mtime 与 `.json` mtime 的比较容差（毫秒）。
 *
 * 保存时会把 `.md` 的 mtime 对齐到 `.json`（见 `_syncMirrorMtime`），但文件系统
 * 精度可能差不到 1ms，所以这里留 2ms：小于 = 镜像陈旧，大于 = 有人手改过镜像。
 */
const MIRROR_MTIME_TOLERANCE_MS = 2

const DEFAULT_OPTIONS = Object.freeze({
  // 数据根；trashDir 为 null 时取 `<rootDir>/.trash`
  rootDir: path.join(os.homedir(), '.dsh', 'notes'),
  trashDir: null,
  maxPageBytes: 2 * 1024 * 1024,
  maxAssetBytes: 16 * 1024 * 1024,
})

/* ------------------------------------------------------------------ *
 * 错误
 * ------------------------------------------------------------------ */

/**
 * 存储层统一错误。
 *
 * `status` 直接作为 HTTP 状态码使用（400 参数错、404 不存在、409 版本冲突、
 * 413 体积超限）；409 的 `payload` 带当前 Page 详情，方便前端直接展示。
 */
class StoreError extends Error {
  constructor(status, message, payload) {
    super(message)
    this.name = 'StoreError'
    this.status = status
    this.payload = payload
  }
}

/** 400：调用方参数不合法。 */
function badRequest(message) {
  return new StoreError(400, message)
}

/** 404：对象不存在。 */
function notFound(message) {
  return new StoreError(404, message)
}

/** 413：内容超过上限。 */
function tooLarge(message) {
  return new StoreError(413, message)
}

/* ------------------------------------------------------------------ *
 * 纯函数工具
 * ------------------------------------------------------------------ */

/** 12 位 base36 随机串。 */
function shortId() {
  const bytes = crypto.randomBytes(12)
  let out = ''
  for (let i = 0; i < 12; i++) out += ID_ALPHABET[bytes[i] % 36]
  return out
}

/** `p_xxx` / `nb_xxx`。 */
function newId(prefix) {
  return prefix + shortId()
}

/** 标题归一：换行替换为空格、去首尾空白。 */
function cleanTitle(value, fallback = '') {
  if (typeof value !== 'string') return fallback
  const text = value.replace(/[\r\n\u2028\u2029]+/g, ' ').trim()
  return text || fallback
}

/** 目录名兜底标题：去掉 `.md` 之类后缀不影响使用，这里只兜空串。 */
function cleanName(value, fallback) {
  const text = cleanTitle(value)
  return text || fallback
}

/** 时间戳归一：number 直接用，ISO 字符串走 Date.parse，其余回落。 */
function toMs(value, fallback) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value) {
    const ms = Date.parse(value)
    if (Number.isFinite(ms)) return ms
  }
  return fallback
}

/** 归一化文本：NFKC + 小写 + 折叠空白。搜索匹配统一走这里。 */
function normalizeText(value) {
  if (typeof value !== 'string' || !value) return ''
  let text = value
  try {
    text = text.normalize('NFKC')
  } catch {
    /* 个别老环境没有 normalize，忽略 */
  }
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** 转义正则元字符。 */
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 统计 needle 在 hay 中出现的次数（needle 为空返回 0）。 */
function countOccurrences(hay, needle) {
  if (!hay || !needle) return 0
  let count = 0
  let from = 0
  for (;;) {
    const at = hay.indexOf(needle, from)
    if (at === -1) return count
    count++
    from = at + needle.length
  }
}

/**
 * 工作区路径归一化。
 *
 * trim → 去掉尾部路径分隔符 → path.resolve → realpath（路径还不存在时用 resolve 结果）。
 * 传入空串/非字符串返回 null，方便调用方判定“没有工作区”。
 */
function normalizeWorkspacePath(p) {
  if (typeof p !== 'string') return null
  let raw = p.trim()
  if (!raw) return null
  // 只去掉尾部斜杠/反斜杠；根目录 '/' 特判保留，避免变成空串。
  raw = raw.replace(/[\\/]+$/, '')
  if (!raw) raw = path.parse(path.resolve('/')).root
  let resolved
  try {
    resolved = path.resolve(raw)
  } catch {
    return null
  }
  try {
    return fs.realpathSync(resolved)
  } catch {
    return resolved
  }
}

/* ------------------------------------------------------------------ *
 * frontmatter / 纯文本
 * ------------------------------------------------------------------ */

/**
 * 解析页面文件。
 *
 * frontmatter 是简单 `key: value`（值取第一个冒号之后全部内容并 trim），
 * 不追求完整 YAML；解析不到就整份当正文，绝不因为格式问题丢数据。
 *
 * @returns {{ data: object, body: string, hasFrontmatter: boolean }}
 */
function parsePageFile(text) {
  const src = typeof text === 'string' ? text : ''
  const source = src.charCodeAt(0) === 0xfeff ? src.slice(1) : src
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(source)
  if (!match) return { data: {}, body: source, hasFrontmatter: false }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at <= 0) continue
    const key = line.slice(0, at).trim()
    if (!key) continue
    const value = line.slice(at + 1).trim()
    data[key] = key === 'tags' ? parseTags(value) : value
  }

  let body = source.slice(match[0].length)
  // 写入时 `---` 后固定一个空行；读回时去掉这一个换行，保证正文逐字往返。
  if (body.startsWith('\r\n')) body = body.slice(2)
  else if (body.startsWith('\n')) body = body.slice(1)
  return { data, body, hasFrontmatter: true }
}

/** `[]` / `[a, b]` / `a, b` → string[]。 */
function parseTags(value) {
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  let text = value.trim()
  if (text.startsWith('[') && text.endsWith(']')) text = text.slice(1, -1)
  if (!text.trim()) return []
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

/** string[] → `[]` / `[a, b]`。 */
function formatTags(tags) {
  const list = Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : []
  return list.length ? `[${list.join(', ')}]` : '[]'
}

/**
 * 组装页面 JSON（真源）。字段顺序固定：id/title/created/updated/tags/blocks。
 */
function buildPageJson(meta, blocks) {
  const payload = {
    id: meta.id,
    title: cleanTitle(meta.title),
    created: new Date(meta.created).toISOString(),
    updated: new Date(meta.updated).toISOString(),
    tags: Array.isArray(meta.tags) ? meta.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    // rev 落进真源：两个进程（UI 与 Agent）各自读盘后，过期 rev 能真正撞上 409。
    rev: Number.isFinite(meta.rev) && meta.rev > 0 ? meta.rev : 1,
    blocks: Array.isArray(blocks) ? blocks : [],
  }
  return `${JSON.stringify(payload, null, 2)}\n`
}

/**
 * 组装 Markdown 镜像。frontmatter 字段与 `.json` 保持一致
 * （id/title/created/updated/tags），`---` 之后恰好一个空行接正文。
 */
function buildMirrorFile(meta, markdown) {
  const head = [
    '---',
    `id: ${meta.id}`,
    `title: ${cleanTitle(meta.title)}`,
    `created: ${new Date(meta.created).toISOString()}`,
    `updated: ${new Date(meta.updated).toISOString()}`,
    `tags: ${formatTags(meta.tags)}`,
    '---',
    '',
  ].join('\n')
  return `${head}\n${markdown === undefined || markdown === null ? '' : String(markdown)}`
}

/**
 * 解析 `<pageId>.json`。解析失败返回 null，由调用方决定跳过（reconcile）或回退。
 *
 * @returns {{ id: string, title: string, created: number|undefined,
 *   updated: number|undefined, tags: string[], blocks: object[] }|null}
 */
function parsePageJson(raw) {
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  return {
    id: typeof parsed.id === 'string' ? parsed.id : '',
    title: typeof parsed.title === 'string' ? parsed.title : '',
    created: toMs(parsed.created, undefined),
    updated: toMs(parsed.updated, undefined),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    rev: Number.isFinite(parsed.rev) && parsed.rev > 0 ? parsed.rev : undefined,
    blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
  }
}

/** blocks 数组的序列化字节数：索引 `size` 与 `maxPageBytes` 都用这个口径。 */
function blocksSize(blocks) {
  return Buffer.byteLength(JSON.stringify(Array.isArray(blocks) ? blocks : []), 'utf8')
}

/** blocks 优先；只给 markdown 时转块；都没有则空文档。 */
function normalizeBlocks(blocks, markdown) {
  if (Array.isArray(blocks)) return blocks
  if (typeof markdown === 'string' && markdown) return markdownToBlocks(markdown)
  return []
}

/**
 * 取 markdown 的近似纯文本（供子串搜索与摘要），输出是单行。
 *
 * 规则见契约 §4.6：去 frontmatter、去代码围栏行但保留代码内容、去行首块级标记、
 * 去行内标记（链接只留 text、图片只留 alt）、表格竖线换空格、折叠连续空白。
 */
function plainText(markdown) {
  if (typeof markdown !== 'string' || !markdown) return ''
  const parsed = parsePageFile(markdown)
  const text = parsed.hasFrontmatter ? parsed.body : markdown

  const out = []
  let fenced = false
  for (const raw of text.split(/\r?\n/)) {
    // 围栏行本身（``` 与 ```lang）丢掉，围栏内的代码内容原样保留。
    if (/^[ \t]{0,3}(?:```|~~~)/.test(raw)) {
      fenced = !fenced
      continue
    }
    if (fenced) {
      out.push(raw)
      continue
    }
    let line = raw
    line = line.replace(/^[ \t]*#{1,6}[ \t]+/, '') // 标题
    line = line.replace(/^[ \t]*>+[ \t]?/, '') // 引用
    line = line.replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+\[[ xX]\][ \t]*/, '') // 任务列表
    line = line.replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/, '') // 普通/有序列表
    line = line.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // 图片 → alt
    line = line.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接 → text
    line = line.replace(/(\*\*|__|~~|\*|_|`)/g, '') // 行内强调与代码标记
    line = line.replace(/\|/g, ' ') // 表格竖线
    out.push(line)
  }
  return out.join(' ').trim()
}

/* ------------------------------------------------------------------ *
 * 磁盘工具
 * ------------------------------------------------------------------ */

/** 临时文件序号（同一进程内自增，避免并发撞名）。 */
let tmpSeq = 0

/**
 * 原子写：`<file>.tmp-<pid>-<n>` → fh.sync() → close → rename。
 * 目标目录不存在会先建出来。
 */
async function writeFileAtomic(file, content) {
  await fsp.mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp-${process.pid}-${++tmpSeq}`
  const handle = await fsp.open(tmp, 'w')
  try {
    await handle.writeFile(content)
    await handle.sync()
  } finally {
    await handle.close().catch(() => {})
  }
  try {
    await fsp.rename(tmp, file)
  } catch (err) {
    await fsp.rm(tmp, { force: true }).catch(() => {})
    throw err
  }
}

/**
 * 移动文件/目录，目标父目录自动创建。
 * 跨设备（EXDEV）时退化为 cp + rm；源不存在返回 false。
 */
async function movePath(src, dest) {
  await fsp.mkdir(path.dirname(dest), { recursive: true })
  try {
    await fsp.rename(src, dest)
    return true
  } catch (err) {
    const code = err && err.code
    if (code === 'ENOENT') return false
    if (code === 'EXDEV') {
      await fsp.cp(src, dest, { recursive: true })
      await fsp.rm(src, { recursive: true, force: true })
      return true
    }
    throw err
  }
}

/** 回收站桶名：`YYYYMMDD-HHmmss-SSS`（本地时间）。 */
function stampName(ms = Date.now()) {
  const d = new Date(ms)
  const p2 = (n) => String(n).padStart(2, '0')
  const p3 = (n) => String(n).padStart(3, '0')
  return (
    `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}` +
    `-${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}` +
    `-${p3(d.getMilliseconds())}`
  )
}

/** 递归统计目录/文件字节数（读不到按 0 计）。 */
async function dirSize(target) {
  let stat
  try {
    stat = await fsp.stat(target)
  } catch {
    return 0
  }
  if (!stat.isDirectory()) return stat.size
  let total = 0
  let entries = []
  try {
    entries = await fsp.readdir(target, { withFileTypes: true })
  } catch {
    return 0
  }
  for (const ent of entries) {
    total += await dirSize(path.join(target, ent.name))
  }
  return total
}

/* ------------------------------------------------------------------ *
 * 行 → 对外对象（严格按契约字段与顺序，内部字段一律不外泄）
 * ------------------------------------------------------------------ */

function toNotebook(row) {
  return {
    id: row.id,
    parentId: row.parentId ?? null,
    title: row.title,
    workspacePath: row.workspacePath ?? null,
    workspaceLabel: row.workspaceLabel ?? null,
    icon: row.icon ?? null,
    order: row.order ?? 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toPageRow(row) {
  return {
    id: row.id,
    notebookId: row.notebookId,
    title: row.title,
    order: row.order ?? 0,
    rev: row.rev ?? 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    size: row.size ?? 0,
  }
}

/** Page 详情：`{ ...Page行, blocks, markdown, mtimeMs, path }`（契约 §1.3）。 */
function toPageDetail(row, blocks, markdown, mtimeMs, file) {
  return {
    ...toPageRow(row),
    blocks: Array.isArray(blocks) ? blocks : [],
    markdown: typeof markdown === 'string' ? markdown : '',
    mtimeMs,
    path: file,
  }
}

function byOrderThenCreated(a, b) {
  return (a.order ?? 0) - (b.order ?? 0) || (a.createdAt ?? 0) - (b.createdAt ?? 0) || (a.id < b.id ? -1 : 1)
}

/* ------------------------------------------------------------------ *
 * NotesStore
 * ------------------------------------------------------------------ */

class NotesStore {
  constructor(options) {
    const opts = { ...DEFAULT_OPTIONS, ...(options || {}) }

    const rootDir = path.resolve(String(opts.rootDir || DEFAULT_OPTIONS.rootDir))
    Object.defineProperty(this, 'rootDir', { value: rootDir, enumerable: true, writable: false })

    this.trashDir = path.resolve(String(opts.trashDir || path.join(rootDir, '.trash')))
    this.assetsDir = path.join(rootDir, 'assets')
    this.indexFile = path.join(rootDir, 'index.json')
    this.maxPageBytes = Number.isFinite(Number(opts.maxPageBytes)) && Number(opts.maxPageBytes) > 0
      ? Number(opts.maxPageBytes)
      : DEFAULT_OPTIONS.maxPageBytes
    this.maxAssetBytes = Number.isFinite(Number(opts.maxAssetBytes)) && Number(opts.maxAssetBytes) > 0
      ? Number(opts.maxAssetBytes)
      : DEFAULT_OPTIONS.maxAssetBytes

    // 非致命错误（镜像自愈失败等）只提示、不中断：注入的 warn 优先，否则打到 console。
    this._warn =
      typeof opts.warn === 'function' ? opts.warn : (msg) => console.warn(`[dsh-notes] ${msg}`)

    // 内存索引（真源的缓存视图）
    this._notebooks = []
    this._pages = []
    this._tags = new Map() // pageId → string[]（正文文件里有、索引行里没有，写回时保留）
    this._plain = new Map() // pageId → 纯文本缓存（搜索用，懒加载）

    this._ready = false
    this._queue = Promise.resolve() // 写操作串行链
    this._initPromise = null
  }

  /* ---------------- 初始化 ---------------- */

  /**
   * 建目录、加载/重建索引。幂等：重复调用（含并发）复用同一个 Promise。
   */
  async init() {
    if (this._ready) return this
    if (!this._initPromise) {
      this._initPromise = this._serial(async () => {
        await fsp.mkdir(this.rootDir, { recursive: true })
        await fsp.mkdir(this.assetsDir, { recursive: true })
        await fsp.mkdir(this.trashDir, { recursive: true })
        const start = await this._loadIndex()
        this._tags.clear()
        this._plain.clear()
        await this._reconcile(start)
        this._ready = true
        return this
      }).catch((err) => {
        // 初始化失败允许重试，不要把失败的 Promise 永久缓存。
        this._initPromise = null
        throw err
      })
    }
    return this._initPromise
  }

  /** 把 fn 追加到写队列尾部；前一个失败不影响后一个。 */
  _serial(fn) {
    const run = this._queue.then(fn, fn)
    // 队列自身永远保持 resolved，避免一次失败让后续写操作连锁失败。
    this._queue = run.then(
      () => {},
      () => {},
    )
    return run
  }

  /**
   * 读 index.json 作为起点。
   * 不存在返回 null；损坏（JSON.parse 抛错）先备份成 `index.json.corrupt-<ts>` 再返回 null。
   */
  async _loadIndex() {
    let raw
    try {
      raw = await fsp.readFile(this.indexFile, 'utf8')
    } catch (err) {
      if (err && err.code === 'ENOENT') return null
      throw err
    }
    try {
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') throw new Error('index.json 不是对象')
      const notebooks = Array.isArray(parsed.notebooks) ? parsed.notebooks.filter(isNotebookRow) : []
      const pages = Array.isArray(parsed.pages) ? parsed.pages.filter(isPageRow) : []
      return { notebooks, pages }
    } catch {
      // 损坏不抛错：留一份现场，然后按磁盘重建（§3 崩溃安全）。
      const backup = `${this.indexFile}.corrupt-${Date.now()}`
      await fsp.rename(this.indexFile, backup).catch(async () => {
        await fsp.copyFile(this.indexFile, backup).catch(() => {})
      })
      return null
    }
  }

  /**
   * 按磁盘校正索引（§5）。
   * @param {{notebooks: object[], pages: object[]}|null} start null = 全新重建
   * @returns {Promise<boolean>} 是否发生了变更
   */
  async _reconcile(start) {
    const nbMap = new Map()
    const pageMap = new Map()
    for (const nb of (start && start.notebooks) || []) nbMap.set(String(nb.id), this._rowFromNotebook(nb))
    for (const row of (start && start.pages) || []) pageMap.set(String(row.id), this._rowFromPage(row))

    let changed = !start
    const seenNotebooks = new Set()
    const seenPages = new Set()

    const nextNbOrder = (parentId) => {
      let max = -1
      for (const nb of nbMap.values()) if ((nb.parentId ?? null) === (parentId ?? null)) max = Math.max(max, nb.order ?? 0)
      return max + 1
    }
    const nextPageOrder = (notebookId) => {
      let max = -1
      for (const row of pageMap.values()) if (row.notebookId === notebookId) max = Math.max(max, row.order ?? 0)
      return max + 1
    }

    let entries = []
    try {
      entries = await fsp.readdir(this.rootDir, { withFileTypes: true })
    } catch (err) {
      if (!err || err.code !== 'ENOENT') throw err
    }

    for (const ent of entries) {
      const name = ent.name
      if (!ent.isDirectory()) continue
      // 跳过 assets / .trash / 其它点开头目录（与契约 §5 一致）
      if (name.startsWith('.') || name === 'assets') continue
      const dir = path.join(this.rootDir, name)
      seenNotebooks.add(name)

      let nb = nbMap.get(name)
      if (!nb) {
        const now = Date.now()
        nb = {
          id: name,
          parentId: null,
          title: cleanName(name, '笔记本'),
          workspacePath: null,
          workspaceLabel: null,
          icon: null,
          order: nextNbOrder(null),
          createdAt: now,
          updatedAt: now,
        }
        nbMap.set(name, nb)
        changed = true
      }

      let files = []
      try {
        files = await fsp.readdir(dir, { withFileTypes: true })
      } catch {
        continue
      }

      // .json 是真源；.md 是镜像（旧版页面可能只有 .md，需要迁移）
      const jsonNames = []
      const mdNames = []
      for (const f of files) {
        if (!f.isFile()) continue
        // 冲突副本 / 写盘残留不纳入索引
        if (f.name.includes('.conflict-') || f.name.includes('.tmp-')) continue
        if (f.name.endsWith('.json')) jsonNames.push(f.name)
        else if (f.name.endsWith('.md')) mdNames.push(f.name)
      }

      // v1 遗留：只有 .md 没有 .json → markdownToBlocks 迁出 .json（只迁一次）
      const jsonSet = new Set(jsonNames)
      for (const mdName of mdNames) {
        const pageId = mdName.slice(0, -3)
        if (!pageId || jsonSet.has(`${pageId}.json`)) continue
        const mdFile = path.join(dir, mdName)
        let raw = ''
        let mdStat = null
        try {
          raw = await fsp.readFile(mdFile, 'utf8')
          mdStat = await fsp.stat(mdFile)
        } catch {
          continue
        }
        const parsed = parsePageFile(raw)
        const created = toMs(parsed.data.created, (mdStat && (mdStat.birthtimeMs || mdStat.mtimeMs)) || Date.now())
        const updated = toMs(parsed.data.updated, (mdStat && mdStat.mtimeMs) || created)
        const title = cleanName(parsed.data.title, pageId)
        const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags : []
        const blocks = markdownToBlocks(parsed.body)
        const meta = { id: pageId, title, created, updated, tags, rev: 1 }
        // 迁移后把 .md 归一成标准镜像（frontmatter + blocksToMarkdown），并让 mtime 与 .json 对齐。
        try {
          await writeFileAtomic(path.join(dir, `${pageId}.json`), buildPageJson(meta, blocks))
          await writeFileAtomic(mdFile, buildMirrorFile(meta, blocksToMarkdown(blocks)))
          const jsonStat = await fsp.stat(path.join(dir, `${pageId}.json`))
          await this._syncMirrorMtime(mdFile, jsonStat)
        } catch {
          continue // 迁移失败就当这页不存在，下次 init 再试
        }
        jsonSet.add(`${pageId}.json`)
        jsonNames.push(`${pageId}.json`)
        changed = true
      }

      for (const jsonName of jsonNames) {
        const pageId = jsonName.slice(0, -5)
        if (!pageId) continue

        const file = path.join(dir, jsonName)
        let stat
        try {
          stat = await fsp.stat(file)
        } catch {
          continue
        }

        const mirrorFile = path.join(dir, `${pageId}.md`)
        let mirrorStat = null
        try {
          mirrorStat = await fsp.stat(mirrorFile)
        } catch (err) {
          if (err && err.code !== 'ENOENT') this._warn(`读取镜像状态失败 ${mirrorFile}: ${err.message || err}`)
          mirrorStat = null
        }
        // 镜像状态：缺失 / 比真源旧 = 自愈；比真源新 = 有人手改了镜像，先备份再重写。
        const mirrorState =
          mirrorStat === null
            ? 'missing'
            : mirrorStat.mtimeMs < stat.mtimeMs - MIRROR_MTIME_TOLERANCE_MS
              ? 'stale'
              : mirrorStat.mtimeMs > stat.mtimeMs + MIRROR_MTIME_TOLERANCE_MS
                ? 'external'
                : 'ok'

        const row = pageMap.get(pageId)
        const sameFile = row && row.notebookId === name && row.mtimeMs === stat.mtimeMs
        if (sameFile && mirrorState === 'ok') {
          seenPages.add(pageId)
          continue // 索引记录与磁盘一致，且镜像正常，不读文件
        }

        let raw = ''
        try {
          raw = await fsp.readFile(file, 'utf8')
        } catch {
          continue
        }
        const parsed = parsePageJson(raw)
        // 解析失败：跳过该页，不抛错（契约 §2）
        if (!parsed) continue

        const created = toMs(parsed.created, (row && row.createdAt) ?? stat.birthtimeMs ?? stat.mtimeMs)
        const updated = toMs(parsed.updated, row ? row.updatedAt ?? stat.mtimeMs : stat.mtimeMs)
        const title = cleanName(parsed.title, row ? row.title : pageId)
        // 镜像的权威内容永远由 blocks 生成（真源是 .json）。
        const markdown = blocksToMarkdown(parsed.blocks)

        if (mirrorState !== 'ok') {
          const meta = { id: pageId, title: title || pageId, created, updated, tags: parsed.tags }
          if (mirrorState === 'external') {
            // JSON 是真源，但用户手改镜像的痕迹不能静默丢：先整份备份。
            const backup = path.join(dir, `${pageId}.md.external-${Date.now()}`)
            try {
              await fsp.copyFile(mirrorFile, backup)
            } catch (err) {
              this._warn(`备份外部改动的镜像失败 ${mirrorFile}: ${err.message || err}`)
            }
          }
          try {
            await writeFileAtomic(mirrorFile, buildMirrorFile(meta, markdown))
            await this._syncMirrorMtime(mirrorFile, stat)
          } catch (err) {
            // 自愈失败不影响索引：这次先用生成的内容喂搜索，下次 init 再试。
            this._warn(`镜像自愈失败 ${mirrorFile}: ${err.message || err}`)
          }
        }

        const nextRow = {
          id: pageId,
          notebookId: name,
          title: title || pageId,
          order: row ? row.order ?? 0 : nextPageOrder(name),
          rev: Number.isFinite(parsed.rev) ? parsed.rev : row ? row.rev ?? 1 : 1,
          createdAt: created,
          updatedAt: updated,
          size: blocksSize(parsed.blocks),
          mtimeMs: stat.mtimeMs,
        }
        pageMap.set(pageId, nextRow)
        seenPages.add(pageId)
        this._tags.set(pageId, parsed.tags)
        this._plain.set(pageId, plainText(markdown))
        changed = true
      }
    }

    // 索引有、磁盘没有的页 → 删掉（文件被外部删除）
    for (const id of [...pageMap.keys()]) {
      if (!seenPages.has(id)) {
        pageMap.delete(id)
        this._tags.delete(id)
        this._plain.delete(id)
        changed = true
      }
    }
    // 索引有、磁盘没有的笔记本 → 删掉
    for (const id of [...nbMap.keys()]) {
      if (!seenNotebooks.has(id)) {
        nbMap.delete(id)
        changed = true
      }
    }
    // 页面指向不存在的笔记本 → 删掉
    for (const [id, row] of [...pageMap.entries()]) {
      if (!nbMap.has(row.notebookId)) {
        pageMap.delete(id)
        this._tags.delete(id)
        this._plain.delete(id)
        changed = true
      }
    }

    this._notebooks = [...nbMap.values()]
    this._pages = [...pageMap.values()]
    if (changed) await this._persist()
    return changed
  }

  /** 归一化 index.json 里的 Notebook 行（容忍缺字段/类型不对）。 */
  _rowFromNotebook(row) {
    const now = Date.now()
    return {
      id: String(row.id),
      parentId: row.parentId === undefined || row.parentId === null ? null : String(row.parentId),
      title: cleanName(row.title, String(row.id)),
      workspacePath: typeof row.workspacePath === 'string' && row.workspacePath ? row.workspacePath : null,
      workspaceLabel: typeof row.workspaceLabel === 'string' && row.workspaceLabel ? row.workspaceLabel : null,
      icon: typeof row.icon === 'string' && row.icon ? row.icon : null,
      order: Number.isFinite(Number(row.order)) ? Number(row.order) : 0,
      createdAt: toMs(row.createdAt, now),
      updatedAt: toMs(row.updatedAt, now),
    }
  }

  /** 归一化 index.json 里的 Page 行。 */
  _rowFromPage(row) {
    const now = Date.now()
    return {
      id: String(row.id),
      notebookId: String(row.notebookId),
      title: cleanName(row.title, String(row.id)),
      order: Number.isFinite(Number(row.order)) ? Number(row.order) : 0,
      rev: Number.isFinite(Number(row.rev)) && Number(row.rev) > 0 ? Math.floor(Number(row.rev)) : 1,
      createdAt: toMs(row.createdAt, now),
      updatedAt: toMs(row.updatedAt, now),
      size: Number.isFinite(Number(row.size)) ? Number(row.size) : 0,
      // 内部字段：用于判断「磁盘与索引是否一致」，对外一律不返回。
      mtimeMs: Number.isFinite(Number(row.mtimeMs)) ? Number(row.mtimeMs) : undefined,
    }
  }

  /** 原子写回 index.json。 */
  async _persist() {
    const payload = {
      version: INDEX_VERSION,
      notebooks: this._notebooks.map((nb) => ({ ...nb })),
      pages: this._pages.map((row) => ({ ...row })),
    }
    await writeFileAtomic(this.indexFile, `${JSON.stringify(payload, null, 2)}\n`)
  }

  /* ---------------- 内部小工具 ---------------- */

  _pageFile(notebookId, pageId) {
    return path.join(this.rootDir, String(notebookId), `${pageId}.json`)
  }

  /** Markdown 镜像：与 `.json` 同名同目录。 */
  _mirrorFile(notebookId, pageId) {
    return path.join(this.rootDir, String(notebookId), `${pageId}.md`)
  }

  _findNotebook(id) {
    return this._notebooks.find((nb) => nb.id === id) || null
  }

  _findPage(id) {
    return this._pages.find((row) => row.id === id) || null
  }

  _replacePage(row) {
    const idx = this._pages.findIndex((p) => p.id === row.id)
    if (idx === -1) this._pages.push(row)
    else this._pages[idx] = row
  }

  /** 含自己在内的子树 id 集合。 */
  _subtreeIds(rootId) {
    const ids = new Set([rootId])
    let grew = true
    while (grew) {
      grew = false
      for (const nb of this._notebooks) {
        if (nb.parentId && ids.has(nb.parentId) && !ids.has(nb.id)) {
          ids.add(nb.id)
          grew = true
        }
      }
    }
    return ids
  }

  /** 显示顺序：先父后子、同级 order 升序（DFS 先序）。 */
  _trail() {
    const children = new Map()
    for (const nb of this._notebooks) {
      const parent = nb.parentId && this._findNotebook(nb.parentId) ? nb.parentId : null
      if (!children.has(parent)) children.set(parent, [])
      children.get(parent).push(nb)
    }
    for (const list of children.values()) list.sort(byOrderThenCreated)

    const out = []
    const seen = new Set()
    const walk = (parent) => {
      for (const nb of children.get(parent) || []) {
        if (seen.has(nb.id)) continue
        seen.add(nb.id)
        out.push(nb)
        walk(nb.id)
      }
    }
    walk(null)
    // 环（parentId 互指）里的节点也要露出来，别让它们从树上消失。
    const rest = this._notebooks.filter((nb) => !seen.has(nb.id)).sort(byOrderThenCreated)
    for (const nb of rest) {
      if (seen.has(nb.id)) continue
      seen.add(nb.id)
      out.push(nb)
      walk(nb.id)
    }
    return out
  }

  /** 每个 notebook 的页面数（含子 notebook 累加）。 */
  _counts() {
    const own = new Map()
    for (const row of this._pages) own.set(row.notebookId, (own.get(row.notebookId) || 0) + 1)
    const children = new Map()
    for (const nb of this._notebooks) {
      const parent = nb.parentId && this._findNotebook(nb.parentId) ? nb.parentId : null
      if (!children.has(parent)) children.set(parent, [])
      children.get(parent).push(nb.id)
    }
    const counts = {}
    const seen = new Set()
    const walk = (id) => {
      if (seen.has(id)) return counts[id] ?? 0
      seen.add(id)
      let total = own.get(id) || 0
      for (const child of children.get(id) || []) total += walk(child)
      counts[id] = total
      return total
    }
    for (const nb of this._notebooks) walk(nb.id)
    return counts
  }

  /** 体积上限作用在 blocks JSON 上（契约 §4.4）。 */
  _assertPageSize(blocks) {
    const size = blocksSize(blocks)
    if (size > this.maxPageBytes) {
      throw tooLarge(`页面内容超过上限（${size} > ${this.maxPageBytes} 字节）`)
    }
    return size
  }

  /** 建一个不重名的回收站桶目录。 */
  async _trashBucket() {
    await fsp.mkdir(this.trashDir, { recursive: true })
    const base = stampName()
    for (let i = 0; i < 100; i++) {
      const dir = path.join(this.trashDir, i === 0 ? base : `${base}-${i}`)
      try {
        await fsp.mkdir(dir)
        return dir
      } catch (err) {
        if (!err || err.code !== 'EEXIST') throw err
      }
    }
    // 极端情况（同一毫秒内上百次删除）用随机后缀兜底。
    const dir = path.join(this.trashDir, `${base}-${shortId().slice(0, 4)}`)
    await fsp.mkdir(dir, { recursive: true })
    return dir
  }

  /** 读 `.md` 镜像的正文（不含 frontmatter）；文件不存在返回 null。 */
  async _readMirror(file) {
    let raw = null
    try {
      raw = await fsp.readFile(file, 'utf8')
    } catch (err) {
      if (!err || err.code !== 'ENOENT') throw err
    }
    if (raw === null) return null
    return parsePageFile(raw).body
  }

  /**
   * 把镜像的 mtime 对齐到 `.json` 的 mtime。
   *
   * 这样 `_reconcile` 才能用 mtime 判断「镜像是我们自己写的（相等）」「json 更新了
   * （镜像陈旧）」「有人手改了镜像（镜像更新）」，而不会把我们刚写的镜像误判成外部改动。
   * 失败只是少了一次自愈判据，warn 后继续。
   */
  async _syncMirrorMtime(mirrorFile, jsonStat) {
    if (!jsonStat) return
    try {
      await fsp.utimes(mirrorFile, jsonStat.atime, jsonStat.mtime)
    } catch (err) {
      this._warn(`对齐镜像 mtime 失败 ${mirrorFile}: ${(err && err.message) || err}`)
    }
  }

  /**
   * 读取磁盘上的页面现状。
   *
   *  - `.json` 是真源，`blocks` 从它读；
   *  - `markdown` 取 `.md` 镜像，镜像不存在就由 `blocksToMarkdown(blocks)` 生成；
   *  - `stat` / `mtimeMs` 一律用 `.json` 的（保存时先写 .json 再写镜像）。
   */
  async _readDiskPage(row) {
    const file = this._pageFile(row.notebookId, row.id)
    const mirrorFile = this._mirrorFile(row.notebookId, row.id)

    let raw = null
    try {
      raw = await fsp.readFile(file, 'utf8')
    } catch (err) {
      if (!err || err.code !== 'ENOENT') throw err
    }
    let stat = null
    if (raw !== null) {
      try {
        stat = await fsp.stat(file)
      } catch {
        stat = null
      }
    }

    const parsed = raw === null ? null : parsePageJson(raw)
    const blocks = parsed ? parsed.blocks : []
    const mirror = await this._readMirror(mirrorFile)
    const markdown = mirror === null ? blocksToMarkdown(blocks) : mirror
    return {
      file,
      mirrorFile,
      raw,
      stat,
      data: parsed || {},
      blocks,
      markdown,
      hasJson: raw !== null,
      hasMirror: mirror !== null,
      corrupt: raw !== null && parsed === null,
    }
  }

  /* ---------------- 树 ---------------- */

  /** 同步读内存索引（init 之后可用）。 */
  tree() {
    const notebooks = this._trail().map(toNotebook)
    const pages = [...this._pages].sort((a, b) => {
      if (a.notebookId !== b.notebookId) return a.notebookId < b.notebookId ? -1 : 1
      return byOrderThenCreated(a, b)
    })
    return {
      notebooks,
      pages: pages.map(toPageRow),
      counts: this._counts(),
      rootDir: this.rootDir,
    }
  }

  /* ---------------- 工作区绑定 ---------------- */

  /** 按规范化路径找工作区笔记本；找不到返回 null。 */
  findByWorkspace(workspacePath) {
    const normalized = normalizeWorkspacePath(workspacePath)
    if (!normalized) return null
    const found = this._notebooks.find((nb) => nb.workspacePath === normalized)
    return found ? toNotebook(found) : null
  }

  /**
   * 绑定工作区：已有绑定直接返回；否则在根下新建一个同名（去重后）笔记本。
   */
  async bindWorkspace(args = {}) {
    await this.init()
    const normalized = normalizeWorkspacePath(args.workspacePath)
    if (!normalized) throw badRequest('工作区路径无效')
    const hit = this._notebooks.find((nb) => nb.workspacePath === normalized)
    if (hit) return toNotebook(hit)

    return this._serial(async () => {
      const again = this._notebooks.find((nb) => nb.workspacePath === normalized)
      if (again) return toNotebook(again)

      const labelSource = cleanTitle(args.title) || cleanTitle(args.workspaceLabel) || path.basename(normalized) || '笔记本'
      const used = new Set(this._notebooks.filter((nb) => (nb.parentId ?? null) === null).map((nb) => nb.title))
      let title = labelSource
      for (let i = 2; used.has(title); i++) title = `${labelSource} (${i})`

      const now = Date.now()
      const nb = {
        id: newId('nb_'),
        parentId: null,
        title,
        workspacePath: normalized,
        workspaceLabel: labelSource,
        icon: null,
        order: this._nextSiblingOrder(null),
        createdAt: now,
        updatedAt: now,
      }
      this._notebooks.push(nb)
      await this._persist()
      return toNotebook(nb)
    })
  }

  _nextSiblingOrder(parentId) {
    let max = -1
    for (const nb of this._notebooks) if ((nb.parentId ?? null) === (parentId ?? null)) max = Math.max(max, nb.order ?? 0)
    return max + 1
  }

  _nextPageOrder(notebookId) {
    let max = -1
    for (const row of this._pages) if (row.notebookId === notebookId) max = Math.max(max, row.order ?? 0)
    return max + 1
  }

  /* ---------------- 页面 ---------------- */

  /** 读页面详情：`{ ...Page行, blocks, markdown, mtimeMs, path }`。 */
  async readPage(id) {
    await this.init()
    const pageId = String(id ?? '')
    const row = this._findPage(pageId)
    if (!row) throw notFound(`页面不存在: ${pageId}`)
    const disk = await this._readDiskPage(row)
    if (!disk.hasJson && !disk.hasMirror) throw notFound(`页面文件不存在: ${pageId}`)
    if (disk.data.tags && disk.data.tags.length) this._tags.set(pageId, disk.data.tags)
    this._plain.set(pageId, plainText(disk.markdown))
    const currentRev = Number.isFinite(disk.data.rev) ? disk.data.rev : row.rev ?? 1
    return toPageDetail({ ...row, rev: currentRev }, disk.blocks, disk.markdown, disk.stat ? disk.stat.mtimeMs : row.mtimeMs ?? 0, disk.file)
  }

  /**
   * 新建页面。
   *
   * blocks 优先；只给 markdown 时先 markdownToBlocks 转块，镜像统一由
   * `blocksToMarkdown(blocks)` 生成（单一生成器，契约 §4.4）。
   */
  async createPage(args = {}) {
    await this.init()
    return this._serial(async () => {
      const notebookId = String(args.notebookId ?? '')
      const nb = this._findNotebook(notebookId)
      if (!nb) throw notFound(`笔记本不存在: ${notebookId}`)

      const title = cleanTitle(args.title, '无标题')
      const blocks = normalizeBlocks(args.blocks, args.markdown)
      this._assertPageSize(blocks)
      const markdown = blocksToMarkdown(blocks)

      const now = Date.now()
      const id = newId('p_')
      const order = args.order === undefined || args.order === null ? this._nextPageOrder(notebookId) : Number(args.order)
      const row = {
        id,
        notebookId,
        title,
        order: Number.isFinite(order) ? order : this._nextPageOrder(notebookId),
        rev: 1,
        createdAt: now,
        updatedAt: now,
        size: blocksSize(blocks),
        mtimeMs: now,
      }

      const meta = { id, title, created: now, updated: now, tags: [], rev: 1 }
      const file = this._pageFile(notebookId, id)
      await writeFileAtomic(file, buildPageJson(meta, blocks))
      await writeFileAtomic(this._mirrorFile(notebookId, id), buildMirrorFile(meta, markdown))
      const stat = await fsp.stat(file)
      await this._syncMirrorMtime(this._mirrorFile(notebookId, id), stat)
      row.mtimeMs = stat.mtimeMs

      this._pages.push(row)
      this._tags.set(id, [])
      this._plain.set(id, plainText(markdown))
      nb.updatedAt = now
      await this._persist()
      return toPageDetail(row, blocks, markdown, stat.mtimeMs, file)
    })
  }

  /**
   * 保存页面。
   *
   *  - blocks 省略 = 不动正文（只改标题）；
   *  - 不接受外部 markdown：镜像**始终**由 `blocksToMarkdown(blocks)` 生成
   *    （BlockNote 0.57 的 blocksToMarkdownLossy 会带 4 空格悬挂缩进，不能用）；
   *  - rev 不匹配 → 409，payload = 当前 Page 详情；
   *  - baseMtimeMs/baseSize 与磁盘 `.json` 不一致 → 先把整份 `.json` 原样复制成
   *    `<pageId>.conflict-<ts>.json`，再照常写入，返回里带 conflictFile。
   */
  async savePage(args = {}) {
    await this.init()
    return this._serial(async () => {
      const pageId = String(args.id ?? '')
      const row = this._findPage(pageId)
      if (!row) throw notFound(`页面不存在: ${pageId}`)

      const hasBlocks = Array.isArray(args.blocks)
      const disk = await this._readDiskPage(row)
      if (!disk.hasJson) throw notFound(`页面文件不存在: ${pageId}`)

      const currentBlocks = disk.blocks
      const mtimeMs = disk.stat ? disk.stat.mtimeMs : row.mtimeMs ?? Date.now()

      // 文件损坏时只有在显式给 blocks（= 整篇重写）时才敢覆盖正文。
      if (disk.corrupt && !hasBlocks) {
        const current = toPageDetail(row, currentBlocks, disk.markdown, mtimeMs, disk.file)
        throw new StoreError(409, '页面文件损坏，需整篇重写才能保存', current)
      }

      const nextBlocks = hasBlocks ? args.blocks : currentBlocks
      if (hasBlocks) this._assertPageSize(nextBlocks)
      const nextMarkdown = blocksToMarkdown(nextBlocks)
      const nextSize = blocksSize(nextBlocks)

      // 乐观锁（页面级）：以磁盘里的 rev 为准，跨进程（UI / Agent）也能撞上。
      const rev = args.rev === undefined || args.rev === null ? null : Number(args.rev)
      const currentRev = Number.isFinite(disk.data.rev) ? disk.data.rev : row.rev ?? 1
      if (rev !== null && rev !== currentRev) {
        const current = toPageDetail({ ...row, rev: currentRev }, currentBlocks, disk.markdown, mtimeMs, disk.file)
        throw new StoreError(409, '页面已在别处被修改，请重新读取后再保存', current)
      }

      // 外部改动检测：不一致时先把磁盘现状（整份 .json）留一份，不打断本次写入。
      let conflictFile
      if (disk.stat) {
        const currentSize = blocksSize(currentBlocks)
        const mtimeChanged =
          args.baseMtimeMs !== undefined &&
          args.baseMtimeMs !== null &&
          Number(args.baseMtimeMs) !== disk.stat.mtimeMs
        const sizeChanged =
          args.baseSize !== undefined && args.baseSize !== null && Number(args.baseSize) !== currentSize
        if (mtimeChanged || sizeChanged) {
          conflictFile = path.join(path.dirname(disk.file), `${row.id}.conflict-${Date.now()}.json`)
          await writeFileAtomic(conflictFile, disk.raw === null ? '' : disk.raw)
        }
      }

      const nextTitle =
        args.title === undefined || args.title === null ? cleanName(disk.data.title, row.title) : cleanTitle(args.title, '无标题')
      const tags = disk.data.tags ?? this._tags.get(row.id) ?? []
      const now = Date.now()

      const nextRow = {
        ...row,
        title: nextTitle,
        rev: currentRev + 1,
        createdAt: row.createdAt,
        updatedAt: now,
        size: nextSize,
      }
      const meta = { id: row.id, title: nextTitle, created: row.createdAt, updated: now, tags, rev: nextRow.rev }
      await writeFileAtomic(disk.file, buildPageJson(meta, nextBlocks))
      await writeFileAtomic(disk.mirrorFile, buildMirrorFile(meta, nextMarkdown))
      const stat = await fsp.stat(disk.file)
      await this._syncMirrorMtime(disk.mirrorFile, stat)
      nextRow.mtimeMs = stat.mtimeMs

      this._replacePage(nextRow)
      this._tags.set(row.id, tags)
      this._plain.set(row.id, plainText(nextMarkdown))
      await this._persist()

      const page = toPageDetail(nextRow, nextBlocks, nextMarkdown, stat.mtimeMs, disk.file)
      return conflictFile ? { page, conflictFile } : { page }
    })
  }

  /** 在正文末尾追加：markdown 转块后追加，镜像由全部 blocks 重新生成。 */
  async appendPage(args = {}) {
    await this.init()
    return this._serial(async () => {
      const pageId = String(args.id ?? '')
      const row = this._findPage(pageId)
      if (!row) throw notFound(`页面不存在: ${pageId}`)
      const disk = await this._readDiskPage(row)
      if (!disk.hasJson) throw notFound(`页面文件不存在: ${pageId}`)

      const chunk = args.markdown === undefined || args.markdown === null ? '' : String(args.markdown)
      const appended = Array.isArray(args.blocks) ? args.blocks : markdownToBlocks(chunk)
      const nextBlocks = [...disk.blocks, ...appended]
      this._assertPageSize(nextBlocks)
      const nextMarkdown = blocksToMarkdown(nextBlocks)

      const tags = disk.data.tags ?? this._tags.get(row.id) ?? []
      const title = cleanName(disk.data.title, row.title)
      const now = Date.now()
      const currentRev = Number.isFinite(disk.data.rev) ? disk.data.rev : row.rev ?? 1
      const nextRow = {
        ...row,
        title,
        rev: currentRev + 1,
        updatedAt: now,
        size: blocksSize(nextBlocks),
      }
      const meta = { id: row.id, title, created: row.createdAt, updated: now, tags, rev: nextRow.rev }
      await writeFileAtomic(disk.file, buildPageJson(meta, nextBlocks))
      await writeFileAtomic(disk.mirrorFile, buildMirrorFile(meta, nextMarkdown))
      const stat = await fsp.stat(disk.file)
      await this._syncMirrorMtime(disk.mirrorFile, stat)
      nextRow.mtimeMs = stat.mtimeMs
      this._replacePage(nextRow)
      this._tags.set(row.id, tags)
      this._plain.set(row.id, plainText(nextMarkdown))
      await this._persist()
      return toPageDetail(nextRow, nextBlocks, nextMarkdown, stat.mtimeMs, disk.file)
    })
  }

  /** 删除页面：`.json` 与 `.md` 一起进回收站（一个桶里两个文件）。 */
  async deletePage(id) {
    await this.init()
    return this._serial(async () => {
      const pageId = String(id ?? '')
      const row = this._findPage(pageId)
      if (!row) throw notFound(`页面不存在: ${pageId}`)
      const bucket = await this._trashBucket()
      // 页面按 `<pageId>.json` / `<pageId>.md` 落在桶里（与契约 listTrash 的例子一致）；
      // 笔记本删除则是整个目录进桶。
      const destJson = path.join(bucket, `${row.id}.json`)
      const destMd = path.join(bucket, `${row.id}.md`)
      const movedJson = await movePath(this._pageFile(row.notebookId, row.id), destJson)
      const movedMd = await movePath(this._mirrorFile(row.notebookId, row.id), destMd)
      // 磁盘上本来就没有这两个文件：别在回收站里留空桶
      if (!movedJson && !movedMd) await fsp.rmdir(bucket).catch(() => {})
      this._pages = this._pages.filter((p) => p.id !== pageId)
      this._tags.delete(pageId)
      this._plain.delete(pageId)
      await this._persist()
      return { trashed: movedJson ? destJson : movedMd ? destMd : destJson }
    })
  }

  /** 页面排序：ids 为全序，未列出的按原顺序跟在后面。 */
  async reorderPages(args = {}) {
    await this.init()
    return this._serial(async () => {
      const notebookId = String(args.notebookId ?? '')
      const nb = this._findNotebook(notebookId)
      if (!nb) throw notFound(`笔记本不存在: ${notebookId}`)
      const siblings = this._pages.filter((p) => p.notebookId === notebookId).sort(byOrderThenCreated)
      const byId = new Map(siblings.map((p) => [p.id, p]))
      const ordered = []
      for (const raw of Array.isArray(args.ids) ? args.ids : []) {
        const row = byId.get(String(raw))
        if (row && !ordered.includes(row)) ordered.push(row)
      }
      for (const row of siblings) if (!ordered.includes(row)) ordered.push(row)
      ordered.forEach((row, i) => {
        row.order = i
      })
      await this._persist()
      return ordered.map(toPageRow)
    })
  }

  /* ---------------- 笔记本 ---------------- */

  async createNotebook(args = {}) {
    await this.init()
    return this._serial(async () => {
      const parentId = args.parentId === undefined || args.parentId === null ? null : String(args.parentId)
      if (parentId !== null && !this._findNotebook(parentId)) throw notFound(`父笔记本不存在: ${parentId}`)
      const title = cleanTitle(args.title)
      if (!title) throw badRequest('笔记本标题不能为空')

      const now = Date.now()
      const nb = {
        id: newId('nb_'),
        parentId,
        title,
        workspacePath: normalizeWorkspacePath(args.workspacePath),
        workspaceLabel: cleanTitle(args.workspaceLabel) || null,
        icon: cleanTitle(args.icon) || null,
        order: this._nextSiblingOrder(parentId),
        createdAt: now,
        updatedAt: now,
      }
      this._notebooks.push(nb)
      await this._persist()
      return toNotebook(nb)
    })
  }

  async updateNotebook(args = {}) {
    await this.init()
    return this._serial(async () => {
      const id = String(args.id ?? '')
      const nb = this._findNotebook(id)
      if (!nb) throw notFound(`笔记本不存在: ${id}`)

      if (args.title !== undefined) {
        const title = cleanTitle(args.title)
        if (!title) throw badRequest('笔记本标题不能为空')
        nb.title = title
      }
      if (args.icon !== undefined) nb.icon = cleanTitle(args.icon) || null
      if (args.workspaceLabel !== undefined) nb.workspaceLabel = cleanTitle(args.workspaceLabel) || null
      if (args.workspacePath !== undefined) {
        if (args.workspacePath === null || args.workspacePath === '') {
          nb.workspacePath = null
        } else {
          const normalized = normalizeWorkspacePath(args.workspacePath)
          if (!normalized) throw badRequest('工作区路径无效')
          nb.workspacePath = normalized
        }
      }
      if (args.parentId !== undefined) {
        const parentId = args.parentId === null || args.parentId === '' ? null : String(args.parentId)
        if (parentId !== null) {
          // 逐级向上检查：不能挂到自己或自己的子孙下。
          const seen = new Set()
          let cursor = parentId
          while (cursor !== null) {
            if (cursor === id) throw badRequest('不能把笔记本移到它自己的子笔记本下')
            if (seen.has(cursor)) break
            seen.add(cursor)
            const parent = this._findNotebook(cursor)
            if (!parent) throw notFound(`父笔记本不存在: ${parentId}`)
            cursor = parent.parentId ?? null
          }
        }
        nb.parentId = parentId
      }
      if (args.order !== undefined && args.order !== null && Number.isFinite(Number(args.order))) {
        nb.order = Number(args.order)
      }
      nb.updatedAt = Date.now()
      await this._persist()
      return toNotebook(nb)
    })
  }

  /** 删除笔记本（含子孙与全部页面），整块进回收站。 */
  async deleteNotebook(id) {
    await this.init()
    return this._serial(async () => {
      const nid = String(id ?? '')
      const nb = this._findNotebook(nid)
      if (!nb) throw notFound(`笔记本不存在: ${nid}`)
      const ids = this._subtreeIds(nid)
      const removed = this._pages.filter((row) => ids.has(row.notebookId))

      const bucket = await this._trashBucket()
      const dest = path.join(bucket, nid)
      const moved = await movePath(path.join(this.rootDir, nid), dest)
      if (!moved) await fsp.rmdir(bucket).catch(() => {})

      this._notebooks = this._notebooks.filter((n) => !ids.has(n.id))
      this._pages = this._pages.filter((row) => !ids.has(row.notebookId))
      for (const row of removed) {
        this._tags.delete(row.id)
        this._plain.delete(row.id)
      }
      await this._persist()
      return { trashed: dest, removedPages: removed.length }
    })
  }

  /** 笔记本排序（同一父级下）。 */
  async reorderNotebooks(args = {}) {
    await this.init()
    return this._serial(async () => {
      const parentId = args.parentId === undefined || args.parentId === null ? null : String(args.parentId)
      if (parentId !== null && !this._findNotebook(parentId)) throw notFound(`父笔记本不存在: ${parentId}`)
      const siblings = this._notebooks
        .filter((nb) => (nb.parentId ?? null) === parentId)
        .sort(byOrderThenCreated)
      const byId = new Map(siblings.map((nb) => [nb.id, nb]))
      const ordered = []
      for (const raw of Array.isArray(args.ids) ? args.ids : []) {
        const nb = byId.get(String(raw))
        if (nb && !ordered.includes(nb)) ordered.push(nb)
      }
      for (const nb of siblings) if (!ordered.includes(nb)) ordered.push(nb)
      ordered.forEach((nb, i) => {
        nb.order = i
      })
      await this._persist()
      return ordered.map(toNotebook)
    })
  }

  /* ---------------- 搜索 ---------------- */

  /**
   * 内存搜索：标题权重 3，正文权重 1，按 score 降序、updatedAt 降序。
   * 同步方法；正文纯文本按需从磁盘读一次并缓存。
   */
  search(query, limit = 50) {
    const needle = normalizeText(query)
    if (!needle) return []
    const max = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Math.floor(Number(limit)) : 50

    const hits = []
    for (const row of this._pages) {
      const title = normalizeText(row.title)
      const titleHits = countOccurrences(title, needle)
      let plain = this._plain.get(row.id)
      if (plain === undefined) {
        plain = this._syncPlain(row)
        this._plain.set(row.id, plain)
      }
      const bodyNorm = normalizeText(plain)
      const bodyHits = countOccurrences(bodyNorm, needle)
      if (!titleHits && !bodyHits) continue

      let snippet = ''
      if (bodyHits) {
        // 摘要取原文，避免把大小写/空白替换后的归一化文本展示给用户。
        const raw = String(plain || '')
        let at = -1
        let length = needle.length
        try {
          const pattern = new RegExp(escapeRegExp(String(query).trim()), 'i')
          const match = pattern.exec(raw)
          if (match) {
            at = match.index
            length = match[0].length
          }
        } catch {
          /* 正则不可用就退回归一化文本 */
        }
        if (at < 0) {
          const atNorm = bodyNorm.indexOf(needle)
          const from = Math.max(0, atNorm - 40)
          const to = Math.min(bodyNorm.length, atNorm + needle.length + 40)
          snippet = bodyNorm.slice(from, to).trim()
        } else {
          const from = Math.max(0, at - 40)
          const to = Math.min(raw.length, at + length + 40)
          snippet = raw.slice(from, to).trim()
        }
      }
      hits.push({
        id: row.id,
        notebookId: row.notebookId,
        title: row.title,
        snippet,
        updatedAt: row.updatedAt,
        score: titleHits * 3 + bodyHits,
      })
    }

    hits.sort((a, b) => b.score - a.score || b.updatedAt - a.updatedAt || (a.id < b.id ? -1 : 1))
    return hits.slice(0, max)
  }

  /**
   * 同步取一页的纯文本（搜索的懒加载兜底）。
   * 优先读 `.md` 镜像；镜像缺失时用 `.json` 的 blocks 现场生成 Markdown。
   */
  _syncPlain(row) {
    try {
      const raw = fs.readFileSync(this._mirrorFile(row.notebookId, row.id), 'utf8')
      return plainText(parsePageFile(raw).body)
    } catch {
      /* 镜像不存在，退到 .json */
    }
    try {
      const raw = fs.readFileSync(this._pageFile(row.notebookId, row.id), 'utf8')
      const parsed = parsePageJson(raw)
      return plainText(parsed ? blocksToMarkdown(parsed.blocks) : '')
    } catch {
      return ''
    }
  }

  /* ---------------- 附件 ---------------- */

  /**
   * 内容寻址存附件：同一份内容两次只落一个文件。
   * @returns {{ sha: string, ext: string, size: number }}
   */
  async putAsset(buffer, options = {}) {
    await this.init()
    const ext = String(options.ext ?? '')
      .toLowerCase()
      .replace(/^\./, '')
      .trim()
    if (!ASSET_EXTS.includes(ext)) throw badRequest(`不支持的附件类型: ${options.ext ?? ''}`)

    let buf
    if (Buffer.isBuffer(buffer)) buf = buffer
    else if (ArrayBuffer.isView(buffer)) buf = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    else if (buffer instanceof ArrayBuffer) buf = Buffer.from(buffer)
    else if (typeof buffer === 'string') buf = Buffer.from(buffer, 'utf8')
    else throw badRequest('附件内容必须是 Buffer 或 Uint8Array')

    if (!buf.length) throw badRequest('附件内容为空')
    if (buf.length > this.maxAssetBytes) {
      throw tooLarge(`附件超过上限（${buf.length} > ${this.maxAssetBytes} 字节）`)
    }

    const sha = crypto.createHash('sha256').update(buf).digest('hex')
    const file = path.join(this.assetsDir, `${sha}.${ext}`)

    return this._serial(async () => {
      let exists = true
      try {
        await fsp.access(file)
      } catch {
        exists = false
      }
      if (!exists) await writeFileAtomic(file, buf)
      return { sha, ext, size: buf.length }
    })
  }

  /** 附件的绝对路径（只校验、不检查存在）。 */
  assetPath(sha, ext) {
    const key = String(sha ?? '')
    if (!SHA_RE.test(key)) throw badRequest('附件 sha 非法（需 64 位小写十六进制）')
    const suffix = String(ext ?? '')
      .toLowerCase()
      .replace(/^\./, '')
      .trim()
    if (!ASSET_EXTS.includes(suffix)) throw badRequest(`不支持的附件类型: ${ext ?? ''}`)
    return path.join(this.assetsDir, `${key}.${suffix}`)
  }

  /** 附件 URL（同源路由用）。 */
  assetUrl(sha, ext) {
    return `/-/notes/asset?sha=${encodeURIComponent(String(sha ?? ''))}&ext=${encodeURIComponent(String(ext ?? ''))}`
  }

  /* ---------------- 维护 ---------------- */

  /** 按磁盘重建索引，返回计数。 */
  async rebuildIndex() {
    await this.init()
    return this._serial(async () => {
      this._tags.clear()
      this._plain.clear()
      const start = this._notebooks.length || this._pages.length
        ? { notebooks: this._notebooks.map((nb) => ({ ...nb })), pages: this._pages.map((row) => ({ ...row })) }
        : null
      // 强制全量重扫：把所有 mtimeMs 抹掉，保证每个文件都被重读一遍。
      if (start) for (const row of start.pages) row.mtimeMs = undefined
      await this._reconcile(start)
      await this._persist()
      return { notebooks: this._notebooks.length, pages: this._pages.length }
    })
  }

  /** 建回收站目录（幂等）。 */
  async ensureTrash() {
    await fsp.mkdir(this.trashDir, { recursive: true })
    return this.trashDir
  }

  /** 内部：只改 frontmatter 里的标题，正文不动。 */
  async setTitle(id, title) {
    await this.init()
    return this._serial(async () => {
      const pageId = String(id ?? '')
      const row = this._findPage(pageId)
      if (!row) throw notFound(`页面不存在: ${pageId}`)
      const nextTitle = cleanTitle(title, '无标题')
      const disk = await this._readDiskPage(row)
      const now = Date.now()
      const tags = disk.data.tags ?? this._tags.get(row.id) ?? []
      const blocks = disk.blocks
      const markdown = blocksToMarkdown(blocks)
      const currentRev = Number.isFinite(disk.data.rev) ? disk.data.rev : row.rev ?? 1
      const meta = { id: row.id, title: nextTitle, created: row.createdAt, updated: now, tags, rev: currentRev + 1 }
      await writeFileAtomic(disk.file, buildPageJson(meta, blocks))
      await writeFileAtomic(disk.mirrorFile, buildMirrorFile(meta, markdown))
      const stat = await fsp.stat(disk.file)
      await this._syncMirrorMtime(disk.mirrorFile, stat)
      const nextRow = {
        ...row,
        title: nextTitle,
        rev: currentRev + 1,
        updatedAt: now,
        size: blocksSize(blocks),
        mtimeMs: stat.mtimeMs,
      }
      this._replaceRowAndCache(nextRow, tags, markdown)
      await this._persist()
      return toPageDetail(nextRow, blocks, markdown, stat.mtimeMs, disk.file)
    })
  }

  _replaceRowAndCache(row, tags, markdown) {
    this._replacePage(row)
    this._tags.set(row.id, tags)
    this._plain.set(row.id, plainText(markdown))
  }

  /**
   * 回收站清单：每个桶一条，entries 是桶内直接子项名，size 是递归字节数。
   * 桶按名字降序（越新越前）；`.trash` 不存在返回 []。
   */
  async listTrash() {
    let entries = []
    try {
      entries = await fsp.readdir(this.trashDir, { withFileTypes: true })
    } catch (err) {
      if (!err || err.code === 'ENOENT') return []
      throw err
    }
    const buckets = []
    for (const ent of entries) {
      if (!ent.isDirectory()) continue
      const dir = path.join(this.trashDir, ent.name)
      let children = []
      try {
        children = await fsp.readdir(dir, { withFileTypes: true })
      } catch {
        children = []
      }
      buckets.push({
        bucket: ent.name,
        entries: children.map((child) => child.name),
        size: await dirSize(dir),
      })
    }
    buckets.sort((a, b) => (a.bucket < b.bucket ? 1 : a.bucket > b.bucket ? -1 : 0))
    return buckets
  }
}

/** index.json 里 Notebook 行的最小校验。 */
function isNotebookRow(row) {
  return !!row && typeof row === 'object' && typeof row.id === 'string' && row.id !== ''
}

/** index.json 里 Page 行的最小校验。 */
function isPageRow(row) {
  return !!row && typeof row === 'object' && typeof row.id === 'string' && row.id !== '' && typeof row.notebookId === 'string' && row.notebookId !== ''
}

module.exports = {
  NotesStore,
  StoreError,
  normalizeWorkspacePath,
  plainText,
  DEFAULT_OPTIONS,
}
