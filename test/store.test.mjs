/**
 * NotesStore 单测（契约 docs/STORE-CONTRACT.md v2：blocks JSON 真源 + Markdown 镜像）
 *
 * 覆盖：树结构、保存往返、rev 409、外部改动冲突副本、回收站、索引损坏重建、
 * 外部新增/改页、.md → .json 迁移、搜索（含 NFKC）、附件内容寻址、工作区绑定、
 * 413（blocks JSON 口径）、写操作串行化。
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

// CJS 存储层在 ESM 测试里用 createRequire 载入
const require = createRequire(import.meta.url)
const { NotesStore, StoreError, normalizeWorkspacePath, plainText, DEFAULT_OPTIONS } = require(
  '../src/host/store.js',
)
const { markdownToBlocks, blocksToMarkdown } = require('../src/host/markdown-blocks.js')

/* ------------------------------------------------------------------ *
 * 脚手架
 * ------------------------------------------------------------------ */

/** 每个用例一个独立 rootDir，结束删除。 */
function makeStore(t, options = {}) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'))
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }))
  return { store: new NotesStore({ rootDir, ...options }), rootDir }
}

/** 建一个真实存在的工作区目录（realpath 归一化需要它存在），结束删除。 */
function makeWorkspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  return dir
}

/** 断言 err 是 StoreError 且 status 匹配。 */
function isStoreError(status) {
  return (err) => {
    assert.ok(err instanceof StoreError, `应为 StoreError，实际: ${err && err.name}`)
    assert.equal(err.status, status)
    return true
  }
}

/** 同步版断言谓词（assetPath 是同步方法）。 */
function isStoreErrorSync(status) {
  return (err) => {
    assert.ok(err instanceof StoreError)
    assert.equal(err.status, status)
    return true
  }
}

/** blocks 数组的序列化字节数（索引 size / maxPageBytes 口径）。 */
function blocksSize(blocks) {
  return Buffer.byteLength(JSON.stringify(blocks), 'utf8')
}

/** 单段纯文本段落块（测试里自己造 blocks 用）。 */
function para(text) {
  return markdownToBlocks(text)[0]
}

/** 镜像文件里 `---\n\n` 之后的正文（逐字）。 */
function bodyOfMirror(raw) {
  const at = raw.indexOf('\n---\n\n')
  assert.notEqual(at, -1, 'frontmatter 与正文之间应恰好一个空行')
  return raw.slice(at + '\n---\n\n'.length)
}

/** 解析 frontmatter 的 key 顺序。 */
function frontmatterKeys(raw) {
  const lines = raw.split('\n')
  assert.equal(lines[0], '---')
  const end = lines.indexOf('---', 1)
  assert.notEqual(end, -1, 'frontmatter 必须闭合')
  return lines.slice(1, end).map((line) => line.slice(0, line.indexOf(':')))
}

/* ------------------------------------------------------------------ *
 * 1. 树结构
 * ------------------------------------------------------------------ */

test('1. 父子笔记本 + 建页 + tree() 结构与 counts 累加', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()

  const nbRoot = await store.createNotebook({ title: '工作笔记' })
  const nbChild = await store.createNotebook({ parentId: nbRoot.id, title: '子笔记本' })
  const nbChild2 = await store.createNotebook({ parentId: nbChild.id, title: '孙笔记本' })

  assert.match(nbRoot.id, /^nb_[0-9a-z]{12}$/)
  assert.equal(nbRoot.parentId, null)
  assert.equal(nbChild.parentId, nbRoot.id)

  const p1 = await store.createPage({ notebookId: nbRoot.id, title: 'A', markdown: '# A' })
  const p2 = await store.createPage({ notebookId: nbChild.id, title: 'B', markdown: 'B' })
  await store.createPage({ notebookId: nbChild2.id, title: 'C', markdown: 'C' })
  assert.match(p1.id, /^p_[0-9a-z]{12}$/)
  assert.equal(p1.rev, 1)
  assert.equal(p1.notebookId, nbRoot.id)
  // 详情带 blocks 与 markdown；markdown 由 blocks 重新生成（单一生成器）
  assert.ok(Array.isArray(p1.blocks))
  assert.equal(p1.blocks[0].type, 'heading')
  assert.equal(p1.blocks[0].props.level, 1)
  assert.equal(p1.markdown, '# A\n')
  assert.match(p1.path, /\.json$/)

  const tree = store.tree()
  assert.equal(tree.rootDir, path.resolve(rootDir))
  assert.equal(tree.notebooks.length, 3)
  // 先父后子
  assert.deepEqual(
    tree.notebooks.map((n) => n.id),
    [nbRoot.id, nbChild.id, nbChild2.id],
  )
  // 页面按 notebookId/order 排好，不含正文
  assert.equal(tree.pages.length, 3)
  assert.equal(tree.pages.some((p) => 'markdown' in p), false)
  assert.equal(tree.pages.some((p) => 'blocks' in p), false)
  // counts 含子笔记本累加
  assert.deepEqual(tree.counts, {
    [nbRoot.id]: 3,
    [nbChild.id]: 2,
    [nbChild2.id]: 1,
  })

  // 顶层页面行字段与契约一致
  const row = tree.pages.find((p) => p.id === p2.id)
  assert.deepEqual(Object.keys(row), [
    'id',
    'notebookId',
    'title',
    'order',
    'rev',
    'createdAt',
    'updatedAt',
    'size',
  ])
  assert.equal(row.size, blocksSize(p2.blocks), 'size = blocks JSON 字节数')
  // 磁盘布局：<rootDir>/<notebookId>/<pageId>.json + 同名 .md
  assert.ok(fs.existsSync(path.join(rootDir, nbChild.id, `${p2.id}.json`)))
  assert.ok(fs.existsSync(path.join(rootDir, nbChild.id, `${p2.id}.md`)))
})

/* ------------------------------------------------------------------ *
 * 2. savePage 往返（blocks JSON 真源 + Markdown 镜像）
 * ------------------------------------------------------------------ */

test('2. savePage：写 .json 真源 + .md 镜像、rev 自增、只改标题不动正文', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '周会记录', markdown: '## 议题\n\n- 甲' })

  assert.equal(page.rev, 1)
  const blocks = markdownToBlocks('## 议题\n\n- 第一行\n- 第二行\n\n```js\nconst a = 1\n```')
  const saved = await store.savePage({ id: page.id, title: '会议: 周会\n第二行', blocks, rev: page.rev })

  assert.equal(saved.conflictFile, undefined)
  assert.deepEqual(saved.page.blocks, blocks, 'blocks 原样存取')
  assert.equal(saved.page.markdown, blocksToMarkdown(blocks), '镜像由 blocks 统一生成')
  assert.equal(saved.page.rev, 2, 'rev 每次保存 +1')
  assert.equal(saved.page.size, blocksSize(blocks), 'size = blocks JSON 字节数')
  assert.equal(saved.page.title, '会议: 周会 第二行', '标题里的换行替换为空格')
  assert.match(saved.page.path, /\.json$/)

  // .json 真源：字段顺序固定
  const rawJson = fs.readFileSync(saved.page.path, 'utf8')
  const parsed = JSON.parse(rawJson)
  assert.deepEqual(Object.keys(parsed), ['id', 'title', 'created', 'updated', 'tags', 'blocks'])
  assert.equal(parsed.id, page.id)
  assert.equal(parsed.title, '会议: 周会 第二行')
  assert.match(parsed.created, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  assert.match(parsed.updated, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  assert.deepEqual(parsed.tags, [])
  assert.deepEqual(parsed.blocks, blocks)

  // .md 镜像：frontmatter 与 .json 字段一致，正文由 blocks 生成
  const mirrorPath = saved.page.path.replace(/\.json$/, '.md')
  assert.ok(fs.existsSync(mirrorPath), '同一目录下应有 .md 镜像')
  const rawMirror = fs.readFileSync(mirrorPath, 'utf8')
  assert.deepEqual(frontmatterKeys(rawMirror), ['id', 'title', 'created', 'updated', 'tags'])
  assert.equal(rawMirror.split('\n')[2], 'title: 会议: 周会 第二行', '含冒号的标题不加引号')
  assert.equal(bodyOfMirror(rawMirror), saved.page.markdown)

  // 镜像干净：不允许 BlockNote lossy 序列化那种 4 空格悬挂缩进
  for (const line of saved.page.markdown.split('\n')) {
    assert.equal(/^ {4,}/.test(line), false, `镜像不应有 4 空格缩进: ${JSON.stringify(line)}`)
  }
  // 列表/代码围栏保持 GFM
  assert.ok(saved.page.markdown.includes('## 议题'))
  assert.ok(saved.page.markdown.includes('- 第一行'))
  assert.ok(saved.page.markdown.includes('```js\nconst a = 1\n```'))
  assert.ok(saved.page.markdown.endsWith('\n'))

  // 读回一致
  const again = await store.readPage(page.id)
  assert.deepEqual(again.blocks, blocks)
  assert.equal(again.markdown, saved.page.markdown)
  assert.equal(again.rev, 2)
  assert.equal(again.path, saved.page.path)
  assert.equal(typeof again.mtimeMs, 'number')

  // 只改标题：blocks 省略 = 不动正文
  const retitled = await store.savePage({ id: page.id, title: '只改标题', rev: 2 })
  assert.equal(retitled.page.title, '只改标题')
  assert.deepEqual(retitled.page.blocks, blocks, '只改标题时正文不动')
  assert.equal(retitled.page.markdown, saved.page.markdown)
  assert.equal(retitled.page.rev, 3)

  // 再次保存（带 blocks）→ 4
  const saved2 = await store.savePage({ id: page.id, blocks: [para('换掉了')], rev: 3 })
  assert.equal(saved2.page.rev, 4)
  assert.equal(saved2.page.markdown, '换掉了\n')
})

/* ------------------------------------------------------------------ *
 * 3. rev 冲突
 * ------------------------------------------------------------------ */

test('3. rev 不匹配 → 409，payload 是当前内容（含 blocks）', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '初始内容' })
  await store.savePage({ id: page.id, blocks: [para('第一版')], rev: 1 })

  await assert.rejects(
    () => store.savePage({ id: page.id, blocks: [para('过期写入')], rev: 1 }),
    (err) => {
      isStoreError(409)(err)
      assert.equal(err.payload.id, page.id)
      assert.equal(err.payload.markdown, '第一版\n', 'payload 必须是当前内容')
      assert.ok(Array.isArray(err.payload.blocks))
      assert.equal(err.payload.blocks[0].content[0].text, '第一版')
      assert.equal(err.payload.rev, 2)
      assert.equal(typeof err.payload.mtimeMs, 'number')
      assert.equal(typeof err.payload.path, 'string')
      assert.match(err.message, /[\u4e00-\u9fa5]/, '错误信息用中文')
      return true
    },
  )
  // 冲突写入不得落盘
  const now = await store.readPage(page.id)
  assert.equal(now.markdown, '第一版\n')
  assert.equal(now.blocks[0].content[0].text, '第一版')
})

/* ------------------------------------------------------------------ *
 * 4. 外部改动 → conflict 副本（整份 .json）
 * ------------------------------------------------------------------ */

test('4. baseMtimeMs/baseSize 不匹配 → 生成 .conflict-<ts>.json 并照常写入', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '原始正文' })
  const before = await store.readPage(page.id)

  // 模拟外部编辑器改了真源（.json）
  const tampered = JSON.parse(fs.readFileSync(before.path, 'utf8'))
  tampered.title = '外部改标题'
  tampered.blocks = markdownToBlocks('外部手改的内容')
  const tamperedRaw = `${JSON.stringify(tampered, null, 2)}\n`
  fs.writeFileSync(before.path, tamperedRaw, 'utf8')

  const res = await store.savePage({
    id: page.id,
    blocks: [para('我的新内容')],
    rev: before.rev,
    baseMtimeMs: before.mtimeMs,
    baseSize: before.size,
  })

  assert.ok(res.conflictFile, '应返回 conflictFile')
  assert.equal(path.dirname(res.conflictFile), path.dirname(before.path), '副本与页面同目录')
  assert.match(path.basename(res.conflictFile), /^p_[0-9a-z]{12}\.conflict-\d+\.json$/)
  assert.equal(fs.readFileSync(res.conflictFile, 'utf8'), tamperedRaw, '副本是磁盘整份 .json 原样')
  assert.equal(res.page.markdown, '我的新内容\n')
  assert.equal((await store.readPage(page.id)).markdown, '我的新内容\n', '新内容已落盘')
  assert.equal(store.tree().pages.length, 1, '冲突副本不进索引')

  // size 不匹配（mtime 正确）也判定为冲突
  const second = await store.readPage(page.id)
  const rawNow = fs.readFileSync(second.path, 'utf8')
  const res2 = await store.savePage({
    id: page.id,
    blocks: [para('第二次')],
    rev: second.rev,
    baseMtimeMs: second.mtimeMs,
    baseSize: second.size + 999,
  })
  assert.ok(res2.conflictFile)
  assert.equal(fs.readFileSync(res2.conflictFile, 'utf8'), rawNow, '副本是冲突前的整份 .json')
  assert.equal((await store.readPage(page.id)).markdown, '第二次\n')
})

/* ------------------------------------------------------------------ *
 * 5. 删除进回收站
 * ------------------------------------------------------------------ */

test('5. deletePage / deleteNotebook → 进 .trash，tree() 里消失', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: '待删' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '内容' })

  const pageRes = await store.deletePage(page.id)
  assert.ok(fs.existsSync(pageRes.trashed))
  assert.ok(pageRes.trashed.startsWith(path.join(rootDir, '.trash') + path.sep))
  assert.equal(path.extname(pageRes.trashed), '.json')
  assert.equal(store.tree().pages.length, 0)
  assert.equal(fs.existsSync(page.path), false, '.json 应被移走')
  assert.equal(fs.existsSync(page.path.replace(/\.json$/, '.md')), false, '.md 也应被移走')

  await store.createPage({ notebookId: nb.id, title: '又一页', markdown: 'x' })
  const nbRes = await store.deleteNotebook(nb.id)
  assert.ok(fs.existsSync(nbRes.trashed))
  assert.ok(nbRes.trashed.startsWith(path.join(rootDir, '.trash') + path.sep))
  assert.equal(nbRes.removedPages, 1)
  assert.equal(store.tree().notebooks.length, 0)
  assert.equal(store.tree().pages.length, 0)

  // 回收站清单：桶按名字降序；页面桶里 .json 与 .md 都在
  const trash = await store.listTrash()
  assert.equal(trash.length, 2)
  assert.ok(trash[0].bucket >= trash[1].bucket)
  assert.ok(trash.every((b) => Array.isArray(b.entries) && typeof b.size === 'number'))
  const pageBucket = trash.find((b) => b.entries.includes(`${page.id}.json`))
  assert.ok(pageBucket, '页面以 <pageId>.json 落在桶里')
  assert.ok(pageBucket.entries.includes(`${page.id}.md`), '镜像也进同一个桶')
  assert.ok(trash.some((b) => b.entries.includes(nb.id)), '笔记本整目录进桶')
  assert.ok(trash.every((b) => b.size > 0))

  await assert.rejects(() => store.deletePage('p_nope'), isStoreError(404))
  await assert.rejects(() => store.deleteNotebook('nb_nope'), isStoreError(404))
})

test('5b. listTrash：.trash 不存在返回 []', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  // init 会建回收站；这里删掉它模拟“应用刚装好、从没删过东西”
  fs.rmSync(path.join(rootDir, '.trash'), { recursive: true, force: true })
  assert.deepEqual(await store.listTrash(), [])
  fs.mkdirSync(path.join(rootDir, '.trash'), { recursive: true })
})

/* ------------------------------------------------------------------ *
 * 6. index.json 损坏
 * ------------------------------------------------------------------ */

test('6. index.json 损坏 → init() 不抛错、备份 .corrupt-*、按磁盘重建', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: '重建我' })
  const page = await store.createPage({ notebookId: nb.id, title: '一页', markdown: '正文内容' })

  fs.writeFileSync(path.join(rootDir, 'index.json'), '{', 'utf8')

  const store2 = new NotesStore({ rootDir })
  await store2.init() // 不抛错

  const backups = fs.readdirSync(rootDir).filter((name) => name.startsWith('index.json.corrupt-'))
  assert.equal(backups.length, 1)

  const tree = store2.tree()
  assert.equal(tree.notebooks.length, 1)
  // index 丢了标题，按目录名重建（目录名就是 notebook id）
  assert.equal(tree.notebooks[0].id, nb.id)
  assert.equal(tree.notebooks[0].title, nb.id)
  assert.equal(tree.pages.length, 1)
  assert.equal(tree.pages[0].id, page.id)
  assert.equal(tree.pages[0].title, '一页')
  const fresh = await store2.readPage(page.id)
  assert.equal(fresh.markdown, '正文内容\n')
  assert.equal(fresh.blocks[0].content[0].text, '正文内容')
  // index.json 已被重写回合法 JSON
  assert.equal(JSON.parse(fs.readFileSync(path.join(rootDir, 'index.json'), 'utf8')).version, 1)
})

/* ------------------------------------------------------------------ *
 * 7. 外部新增页面（.json）与 v1 迁移（只有 .md）
 * ------------------------------------------------------------------ */

test('7. 外部新增 .json 被索引；只有 .md 的旧页迁移出 .json', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  await store.createNotebook({ title: '已有' })

  const dir = path.join(rootDir, 'nb_x')
  fs.mkdirSync(dir, { recursive: true })
  const iso = new Date('2026-11-03T05:00:00.000Z').toISOString()

  // 外部直接写 v2 页面（只有 .json，没有 .md 镜像）
  fs.writeFileSync(
    path.join(dir, 'p_y.json'),
    `${JSON.stringify(
      {
        id: 'p_y',
        title: '外部页',
        created: iso,
        updated: iso,
        tags: ['a', 'b'],
        blocks: markdownToBlocks('外部正文'),
      },
      null,
      2,
    )}\n`,
    'utf8',
  )

  // v1 遗留：只有 .md，没有 .json
  fs.writeFileSync(
    path.join(dir, 'p_z.md'),
    `---\nid: p_z\ntitle: 旧页\ncreated: ${iso}\nupdated: ${iso}\ntags: [c]\n---\n\n旧正文`,
    'utf8',
  )

  const store2 = new NotesStore({ rootDir })
  await store2.init()

  const tree = store2.tree()
  const nb = tree.notebooks.find((n) => n.id === 'nb_x')
  assert.ok(nb, '孤儿目录应补一条同名笔记本')
  assert.equal(nb.title, 'nb_x')
  assert.equal(nb.parentId, null)

  const row = tree.pages.find((p) => p.id === 'p_y')
  assert.ok(row, '外部 .json 应被索引')
  assert.equal(row.title, '外部页')
  assert.equal(row.notebookId, 'nb_x')
  assert.equal(row.rev, 1)
  assert.equal(row.createdAt, Date.parse(iso))
  assert.equal(row.size, blocksSize(markdownToBlocks('外部正文')))
  const external = await store2.readPage('p_y')
  assert.equal(external.markdown, '外部正文\n', '没有 .md 镜像时由 blocks 生成')
  assert.equal(external.blocks[0].content[0].text, '外部正文')

  // 迁移：.json 被建出来，正文转成块，索引可见
  const legacyRow = tree.pages.find((p) => p.id === 'p_z')
  assert.ok(legacyRow, '只有 .md 的旧页应被迁移并索引')
  assert.equal(legacyRow.title, '旧页')
  assert.equal(legacyRow.createdAt, Date.parse(iso))
  assert.ok(fs.existsSync(path.join(dir, 'p_z.json')), '迁移后应有 .json')
  const migrated = await store2.readPage('p_z')
  assert.equal(migrated.markdown, '旧正文', '.md 镜像仍可读')
  assert.equal(migrated.blocks[0].type, 'paragraph')
  assert.equal(migrated.blocks[0].content[0].text, '旧正文')
})

/* ------------------------------------------------------------------ *
 * 8. 外部改真源
 * ------------------------------------------------------------------ */

test('8. 外部改 .json 正文 → 重新 init() 后 readPage 返回新 blocks/markdown', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '原文' })
  const detail = await store.readPage(page.id)

  // 外部编辑器改真源，并把旧镜像删掉（镜像不读回）
  const parsed = JSON.parse(fs.readFileSync(detail.path, 'utf8'))
  parsed.blocks = markdownToBlocks('外部改写')
  fs.writeFileSync(detail.path, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')
  fs.rmSync(detail.path.replace(/\.json$/, '.md'), { force: true })

  const store2 = new NotesStore({ rootDir })
  await store2.init()

  const fresh = await store2.readPage(page.id)
  assert.equal(fresh.markdown, '外部改写\n')
  assert.equal(fresh.blocks[0].content[0].text, '外部改写')
  assert.equal(fresh.rev, page.rev, '外部改正文不改 rev')
  assert.equal(fresh.size, blocksSize(fresh.blocks))
  // 索引里的 size / mtime 也跟着校正
  const row = store2.tree().pages.find((p) => p.id === page.id)
  assert.equal(row.size, blocksSize(fresh.blocks))
})

/* ------------------------------------------------------------------ *
 * 9. 搜索 / plainText
 * ------------------------------------------------------------------ */

test('9. 搜索：标题、正文、NFKC、大小写；plainText 不含 markdown 标记', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: '搜索' })

  const byTitle = await store.createPage({ notebookId: nb.id, title: '项目 ＡＢＣ 计划', markdown: '普通正文' })
  const byBody = await store.createPage({ notebookId: nb.id, title: '随手记', markdown: '这里提到 abc 的正文' })
  await store.createPage({ notebookId: nb.id, title: '无关', markdown: '毫不相干' })

  // 全角 ＡＢＣ + 小写 abc 都能命中同一批
  const hits = store.search('abc')
  assert.ok(hits.some((h) => h.id === byTitle.id), '标题里全角ＡＢＣ应被半角 abc 命中')
  assert.ok(hits.some((h) => h.id === byBody.id), '正文命中')
  assert.equal(hits.length, 2)
  // 标题权重 3 > 正文权重 1
  assert.equal(hits[0].id, byTitle.id)
  assert.ok(hits[0].score > hits[1].score)

  const bodyHit = hits.find((h) => h.id === byBody.id)
  assert.ok(bodyHit.snippet.includes('abc'), '有命中时 snippet 非空')
  assert.equal(hits.find((h) => h.id === byTitle.id).snippet, '', '只有标题命中时 snippet 为空串')

  // 大小写
  assert.equal(store.search('ABC').length, 2)
  assert.equal(store.search('  ').length, 0)
  assert.equal(store.search('').length, 0)
  // 空查询/纯空白
  assert.deepEqual(store.search('   '), [])

  // limit
  assert.equal(store.search('abc', 1).length, 1)

  // plainText：去掉 markdown 标记但保留内容
  const markdown = [
    '# 标题行',
    '',
    '**粗体** 和 *斜体* 与 ~~删除线~~ 还有 `行内代码`',
    '',
    '[链接文字](https://example.com) 和 ![图片说明](a.png)',
    '',
    '- 列表项',
    '* 星号项',
    '1. 有序项',
    '- [ ] 未完成项',
    '- [x] 已完成项',
    '',
    '```js',
    'const a = 1',
    '```',
    '',
    '> 引用行',
    '',
    '| 甲 | 乙 |',
  ].join('\n')
  const text = plainText(markdown)
  assert.equal(text.includes('\n'), false, '纯文本应折叠成单行')
  for (const marker of ['#', '**', '~~', '[', ']', '(', ')', '|', '`']) {
    assert.equal(text.includes(marker), false, `纯文本不应含 ${marker}`)
  }
  for (const keeps of ['标题行', '粗体', '斜体', '删除线', '行内代码', '链接文字', '图片说明', '列表项', '星号项', '有序项', '已完成项', '未完成项', 'const a = 1', '引用行', '甲', '乙']) {
    assert.ok(text.includes(keeps), `纯文本应保留 ${keeps}`)
  }
  // frontmatter 也要去掉
  assert.equal(plainText('---\ntitle: x\n---\n\n正文'), '正文')
})

/* ------------------------------------------------------------------ *
 * 10. 附件
 * ------------------------------------------------------------------ */

test('10. putAsset 内容寻址 + assetPath 拒绝穿越与非法 sha', async (t) => {
  const { store, rootDir } = makeStore(t, { maxAssetBytes: 16 })
  await store.init()

  const buf = Buffer.from('hello png', 'utf8')
  const first = await store.putAsset(buf, { ext: 'png', mime: 'image/png' })
  const second = await store.putAsset(buf, { ext: 'png' })

  assert.match(first.sha, /^[0-9a-f]{64}$/)
  assert.equal(first.ext, 'png')
  assert.equal(first.size, buf.length)
  assert.equal(first.sha, second.sha)
  assert.deepEqual(Object.keys(first).sort(), ['ext', 'sha', 'size'])

  const files = fs.readdirSync(path.join(rootDir, 'assets'))
  assert.equal(files.length, 1, '同一内容只落一个文件')
  assert.equal(files[0], `${first.sha}.png`)
  assert.deepEqual(fs.readFileSync(store.assetPath(first.sha, 'png')), buf)
  assert.equal(store.assetUrl(first.sha, 'png'), `/-/notes/asset?sha=${first.sha}&ext=png`)

  // 路径穿越 / 非法 sha / 非法后缀
  assert.throws(() => store.assetPath('../evil', 'png'), isStoreErrorSync(400))
  assert.throws(() => store.assetPath('zzz', 'png'), isStoreErrorSync(400))
  assert.throws(() => store.assetPath(first.sha.toUpperCase(), 'png'), isStoreErrorSync(400))
  assert.throws(() => store.assetPath(first.sha, '../x'), isStoreErrorSync(400))
  assert.throws(() => store.assetPath(first.sha, 'exe'), isStoreErrorSync(400))

  // 空 buffer / 白名单 / 413
  await assert.rejects(() => store.putAsset(Buffer.alloc(0), { ext: 'png' }), isStoreError(400))
  await assert.rejects(() => store.putAsset(buf, { ext: 'exe' }), isStoreError(400))
  await assert.rejects(() => store.putAsset(Buffer.alloc(17), { ext: 'png' }), isStoreError(413))
  // 恰好等于上限可以通过
  const edge = await store.putAsset(Buffer.alloc(16), { ext: 'webp' })
  assert.equal(edge.size, 16)
})

/* ------------------------------------------------------------------ *
 * 11. 工作区绑定
 * ------------------------------------------------------------------ */

test('11. bindWorkspace 幂等 + 同名追加 (2)', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const ws1 = makeWorkspace(t)
  const ws2 = makeWorkspace(t)
  const ws3 = makeWorkspace(t)

  const a = await store.bindWorkspace({ workspacePath: ws1, title: 'ask' })
  assert.equal(a.title, 'ask')
  assert.equal(a.parentId, null)
  assert.equal(a.workspacePath, fs.realpathSync(ws1))

  // 幂等：同一个工作区（尾部带斜杠）返回同一个笔记本
  const b = await store.bindWorkspace({ workspacePath: `${ws1}/`, title: 'ask' })
  assert.equal(b.id, a.id)
  assert.equal(store.tree().notebooks.length, 1)

  assert.equal(store.findByWorkspace(ws1).id, a.id)
  assert.equal(store.findByWorkspace(`${ws1}/`).id, a.id)
  assert.equal(store.findByWorkspace(ws2), null)

  // 另一个工作区同名 → ask (2)
  const c = await store.bindWorkspace({ workspacePath: ws2, title: 'ask' })
  assert.notEqual(c.id, a.id)
  assert.equal(c.title, 'ask (2)')
  const d = await store.bindWorkspace({ workspacePath: ws3, title: 'ask' })
  assert.equal(d.title, 'ask (3)')

  // 路径归一化
  assert.equal(normalizeWorkspacePath(ws1), fs.realpathSync(ws1))
  assert.equal(normalizeWorkspacePath(`${ws1}/`), fs.realpathSync(ws1))
  assert.equal(normalizeWorkspacePath('   '), null)
  assert.equal(normalizeWorkspacePath(''), null)
  assert.equal(normalizeWorkspacePath(undefined), null)

  await assert.rejects(() => store.bindWorkspace({ workspacePath: '   ' }), isStoreError(400))

  // 子笔记本也算“已有绑定”（换一个还没绑过的工作区）
  const ws4 = makeWorkspace(t)
  const child = await store.createNotebook({ parentId: a.id, title: '子', workspacePath: ws4 })
  assert.equal(store.findByWorkspace(ws4).id, child.id)
  // 已绑定的工作区仍然返回先绑定的那个
  assert.equal(store.findByWorkspace(ws2).id, c.id)
})

/* ------------------------------------------------------------------ *
 * 12. 体积上限（blocks JSON 口径）
 * ------------------------------------------------------------------ */

test('12. blocks JSON 超过 maxPageBytes → 413（边界值恰好通过）', async (t) => {
  const maxPageBytes = 400
  const { store } = makeStore(t, { maxPageBytes })
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })

  // 造一个「恰好 maxPageBytes 字节」的块：以单字符段落为基准加长 text
  const base = para('x')
  const baseSize = blocksSize([base])
  const textLen = maxPageBytes - (baseSize - 1)
  assert.ok(textLen > 0, '测试预算要大于块本身的开销')
  const exact = para('x'.repeat(textLen))
  assert.equal(blocksSize([exact]), maxPageBytes)

  const page = await store.createPage({ notebookId: nb.id, title: '小', blocks: [exact] })
  assert.equal(page.size, maxPageBytes, '恰好等于上限应通过')

  // 多 1 字节 → 413，且不落盘
  const over = para('x'.repeat(textLen + 1))
  await assert.rejects(
    () => store.savePage({ id: page.id, blocks: [over], rev: page.rev }),
    (err) => {
      isStoreError(413)(err)
      assert.match(err.message, /上限/)
      return true
    },
  )
  assert.equal((await store.readPage(page.id)).size, maxPageBytes)

  // 新建页面同样受限制
  await assert.rejects(() => store.createPage({ notebookId: nb.id, title: '大', blocks: [over] }), isStoreError(413))

  // 中文按 UTF-8 字节算（3 字节/字）
  const chinese = para('中'.repeat(textLen))
  assert.ok(blocksSize([chinese]) > maxPageBytes)
  await assert.rejects(() => store.savePage({ id: page.id, blocks: [chinese], rev: page.rev }), isStoreError(413))
})

/* ------------------------------------------------------------------ *
 * 13. 附加：追加 / 排序 / 笔记本维护 / 404
 * ------------------------------------------------------------------ */

test('13. appendPage / reorder / updateNotebook / setTitle / 404 边界', async (t) => {
  const { store } = makeStore(t)
  await store.init()

  const nb = await store.createNotebook({ title: 'nb' })
  await assert.rejects(() => store.createNotebook({ title: '   ' }), isStoreError(400))
  await assert.rejects(() => store.createNotebook({ title: 'x', parentId: 'nb_nope' }), isStoreError(404))
  await assert.rejects(() => store.createPage({ notebookId: 'nb_nope', title: 'x' }), isStoreError(404))
  await assert.rejects(() => store.readPage('p_nope'), isStoreError(404))

  // append：markdown 转块后追加，镜像由全部 blocks 重新生成
  const page = await store.createPage({ notebookId: nb.id, title: '日志', markdown: '第一行' })
  const appended = await store.appendPage({ id: page.id, markdown: '第二行' })
  assert.equal(appended.blocks.length, 2)
  assert.equal(appended.markdown, '第一行\n\n第二行\n')
  assert.equal(appended.rev, 2)
  const appended2 = await store.appendPage({ id: page.id, markdown: '第三行' })
  assert.equal(appended2.blocks.length, 3)
  assert.equal(appended2.markdown, '第一行\n\n第二行\n\n第三行\n')

  // 追加也受 blocks JSON 体积上限约束
  const tiny = makeStore(t, { maxPageBytes: 200 })
  await tiny.store.init()
  const tinyNb = await tiny.store.createNotebook({ title: 'tiny' })
  const tinyPage = await tiny.store.createPage({ notebookId: tinyNb.id, title: 'p', blocks: [para('a')] })
  await assert.rejects(() => tiny.store.appendPage({ id: tinyPage.id, markdown: 'x'.repeat(500) }), isStoreError(413))

  // reorderPages：ids 为全序，未列出的按原顺序跟在后面
  const p1 = await store.createPage({ notebookId: nb.id, title: '1', markdown: '1' })
  const p2 = await store.createPage({ notebookId: nb.id, title: '2', markdown: '2' })
  const p3 = await store.createPage({ notebookId: nb.id, title: '3', markdown: '3' })
  const ordered = await store.reorderPages({ notebookId: nb.id, ids: [p3.id, p1.id] })
  assert.deepEqual(
    ordered.map((p) => p.id),
    [p3.id, p1.id, page.id, p2.id],
  )
  assert.deepEqual(
    ordered.map((p) => p.order),
    [0, 1, 2, 3],
  )
  assert.deepEqual(
    store.tree().pages.filter((p) => p.notebookId === nb.id).map((p) => p.id),
    [p3.id, p1.id, page.id, p2.id],
  )

  // reorderNotebooks
  const a = await store.createNotebook({ title: 'A' })
  const b = await store.createNotebook({ title: 'B' })
  const orderedNb = await store.reorderNotebooks({ parentId: null, ids: [b.id, a.id] })
  assert.deepEqual(
    orderedNb.map((n) => n.id),
    [b.id, a.id, nb.id],
  )

  // updateNotebook：只改传入字段 + 禁止挂到子孙下
  const renamed = await store.updateNotebook({ id: nb.id, title: '改名了' })
  assert.equal(renamed.title, '改名了')
  assert.equal(renamed.parentId, null)
  const child = await store.createNotebook({ parentId: nb.id, title: '子' })
  const grandChild = await store.createNotebook({ parentId: child.id, title: '孙' })
  await assert.rejects(() => store.updateNotebook({ id: nb.id, parentId: grandChild.id }), isStoreError(400))
  await assert.rejects(() => store.updateNotebook({ id: nb.id, parentId: nb.id }), isStoreError(400))
  await assert.rejects(() => store.updateNotebook({ id: 'nb_nope', title: 'x' }), isStoreError(404))
  const moved = await store.updateNotebook({ id: grandChild.id, parentId: null })
  assert.equal(moved.parentId, null)

  // 解绑 / 重新绑定
  const ws = makeWorkspace(t)
  const bound = await store.updateNotebook({ id: nb.id, workspacePath: ws })
  assert.equal(bound.workspacePath, fs.realpathSync(ws))
  const unbound = await store.updateNotebook({ id: nb.id, workspacePath: null })
  assert.equal(unbound.workspacePath, null)

  // rebuildIndex 返回计数
  const counts = await store.rebuildIndex()
  assert.equal(counts.notebooks, store.tree().notebooks.length)
  assert.equal(counts.pages, store.tree().pages.length)

  // setTitle 只改标题：blocks 与镜像不变
  const before = await store.readPage(page.id)
  const retitled = await store.setTitle(page.id, '新标题')
  assert.equal(retitled.title, '新标题')
  assert.deepEqual(retitled.blocks, before.blocks)
  assert.equal(retitled.markdown, before.markdown)

  // DEFAULT_OPTIONS 形状
  assert.equal(DEFAULT_OPTIONS.maxPageBytes, 2 * 1024 * 1024)
  assert.equal(DEFAULT_OPTIONS.maxAssetBytes, 16 * 1024 * 1024)
  assert.equal(typeof DEFAULT_OPTIONS.rootDir, 'string')
})

/* ------------------------------------------------------------------ *
 * 14. 附加：写操作串行（并发不丢索引）
 * ------------------------------------------------------------------ */

test('14. 并发写串行化：init 幂等、并发建页/保存不丢索引', async (t) => {
  const { store, rootDir } = makeStore(t)
  // 并发 init 共享同一个初始化过程
  await Promise.all([store.init(), store.init(), store.init()])

  const nb = await store.createNotebook({ title: '并发' })
  const pages = await Promise.all(
    Array.from({ length: 8 }, (_, i) => store.createPage({ notebookId: nb.id, title: `p${i}`, markdown: `${i}` })),
  )
  assert.equal(new Set(pages.map((p) => p.id)).size, 8, 'id 不能重复')
  assert.equal(store.tree().pages.length, 8)

  // 同一批页面并发保存（各自 rev 正确）
  await Promise.all(
    pages.map((p, i) => store.savePage({ id: p.id, blocks: markdownToBlocks(`第 ${i} 版`), rev: p.rev })),
  )
  const tree = store.tree()
  assert.equal(tree.pages.length, 8)
  assert.deepEqual(new Set(tree.pages.map((p) => p.rev)), new Set([2]))
  assert.equal(tree.pages.every((p) => 'markdown' in p), false)

  // index.json 是完整的合法 JSON
  const disk = JSON.parse(fs.readFileSync(path.join(rootDir, 'index.json'), 'utf8'))
  assert.equal(disk.version, 1)
  assert.equal(disk.notebooks.length, 1)
  assert.equal(disk.pages.length, 8)

  // 重新 init 后与内存视图一致
  const store2 = new NotesStore({ rootDir })
  await store2.init()
  assert.equal(store2.tree().pages.length, 8)
  assert.deepEqual(
    store2.tree().pages.map((p) => p.id).sort(),
    tree.pages.map((p) => p.id).sort(),
  )
})

/* ------------------------------------------------------------------ *
 * 15. 附加：真源损坏跳过、blocks 直接写入
 * ------------------------------------------------------------------ */

test('15. .json 解析失败 → init 跳过该页不抛错；createPage 可直接吃 blocks', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const good = await store.createPage({ notebookId: nb.id, title: '好的', markdown: '正常' })
  const broken = await store.createPage({ notebookId: nb.id, title: '坏的', markdown: '待损坏' })

  fs.writeFileSync(broken.path, '{ 这不是 JSON', 'utf8')

  const store2 = new NotesStore({ rootDir })
  await store2.init() // 不抛错

  const tree = store2.tree()
  assert.deepEqual(
    tree.pages.map((p) => p.id),
    [good.id],
    '损坏页被跳过，其它页正常',
  )
  assert.equal((await store2.readPage(good.id)).markdown, '正常\n')

  // 直接吃 BlockNote 块（客户端保存路径）
  const blocks = [
    {
      id: 'b_aaaaaaaaaaaa',
      type: 'heading',
      props: {
        level: 2,
        isToggleable: false,
        textAlignment: 'left',
        backgroundColor: 'default',
        textColor: 'default',
      },
      content: [{ type: 'text', text: '客户端标题', styles: {} }],
      children: [],
    },
  ]
  const created = await store.createPage({ notebookId: nb.id, title: '块页', blocks })
  assert.deepEqual(created.blocks, blocks, 'blocks 原样存取')
  assert.equal(created.markdown, '## 客户端标题\n')
})
