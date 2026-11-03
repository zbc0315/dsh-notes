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

/** 页面文件里 `---\n\n` 之后的正文（逐字）。 */
function bodyOf(raw) {
  const at = raw.indexOf('\n---\n\n')
  assert.notEqual(at, -1, 'frontmatter 与正文之间应恰好一个空行')
  return raw.slice(at + '\n---\n\n'.length)
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
  assert.equal(row.size, Buffer.byteLength('B', 'utf8'))
})

/* ------------------------------------------------------------------ *
 * 2. savePage 往返
 * ------------------------------------------------------------------ */

test('2. savePage 往返：frontmatter 顺序、正文逐字、rev 自增', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '周会记录', markdown: '## 议题\n- 1' })

  assert.equal(page.rev, 1)
  const markdown =
    '## 议题\n\n- 第一行\n- 第二行\n\n```js\nconst a = 1\n```\n\n结尾带两个空格  '
  const saved = await store.savePage({ id: page.id, title: '会议: 周会\n第二行', markdown, rev: page.rev })

  assert.equal(saved.conflictFile, undefined)
  assert.equal(saved.page.markdown, markdown, '正文必须逐字不变')
  assert.equal(saved.page.rev, 2, 'rev 每次保存 +1')
  assert.equal(saved.page.size, Buffer.byteLength(markdown, 'utf8'))
  assert.equal(saved.page.title, '会议: 周会 第二行', '标题里的换行替换为空格')

  const raw = fs.readFileSync(saved.page.path, 'utf8')
  const lines = raw.split('\n')
  assert.equal(lines[0], '---')
  // frontmatter 字段顺序固定
  assert.deepEqual(
    lines.slice(1, 6).map((line) => line.slice(0, line.indexOf(':'))),
    ['id', 'title', 'created', 'updated', 'tags'],
  )
  assert.equal(lines[1], `id: ${page.id}`)
  assert.equal(lines[2], 'title: 会议: 周会 第二行', '含冒号的标题不加引号')
  assert.match(lines[3], /^created: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  assert.match(lines[4], /^updated: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  assert.equal(lines[5], 'tags: []')
  assert.equal(lines[6], '---')
  assert.equal(lines[7], '', '`---` 之后恰好一个空行')
  assert.equal(bodyOf(raw), markdown)

  // 读回一致
  const again = await store.readPage(page.id)
  assert.equal(again.markdown, markdown)
  assert.equal(again.rev, 2)
  assert.equal(again.path, saved.page.path)
  assert.equal(typeof again.mtimeMs, 'number')

  // 再次保存 → 3
  const saved2 = await store.savePage({ id: page.id, markdown: markdown, rev: 2 })
  assert.equal(saved2.page.rev, 3)
})

/* ------------------------------------------------------------------ *
 * 3. rev 冲突
 * ------------------------------------------------------------------ */

test('3. rev 不匹配 → 409，payload 是当前内容', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '初始内容' })
  await store.savePage({ id: page.id, markdown: '第一版', rev: 1 })

  await assert.rejects(
    () => store.savePage({ id: page.id, markdown: '过期写入', rev: 1 }),
    (err) => {
      isStoreError(409)(err)
      assert.equal(err.payload.id, page.id)
      assert.equal(err.payload.markdown, '第一版', 'payload 必须是当前内容')
      assert.equal(err.payload.rev, 2)
      assert.equal(typeof err.payload.mtimeMs, 'number')
      assert.equal(typeof err.payload.path, 'string')
      assert.match(err.message, /[\u4e00-\u9fa5]/, '错误信息用中文')
      return true
    },
  )
  // 冲突写入不得落盘
  assert.equal((await store.readPage(page.id)).markdown, '第一版')
})

/* ------------------------------------------------------------------ *
 * 4. 外部改动 → conflict 副本
 * ------------------------------------------------------------------ */

test('4. baseMtimeMs/baseSize 不匹配 → 生成 .conflict-<ts>.md 并照常写入', async (t) => {
  const { store } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '原始正文' })
  const before = await store.readPage(page.id)

  // 模拟外部编辑器改了文件
  fs.writeFileSync(before.path, '外部手改的内容', 'utf8')

  const res = await store.savePage({
    id: page.id,
    markdown: '我的新内容',
    rev: before.rev,
    baseMtimeMs: before.mtimeMs,
    baseSize: before.size,
  })

  assert.ok(res.conflictFile, '应返回 conflictFile')
  assert.equal(path.dirname(res.conflictFile), path.dirname(before.path), '副本与页面同目录')
  assert.match(path.basename(res.conflictFile), /^p_[0-9a-z]{12}\.conflict-\d+\.md$/)
  assert.equal(fs.readFileSync(res.conflictFile, 'utf8'), '外部手改的内容', '副本是磁盘现状')
  assert.equal(res.page.markdown, '我的新内容')
  assert.equal((await store.readPage(page.id)).markdown, '我的新内容', '新内容已落盘')
  assert.equal(store.tree().pages.length, 1, '冲突副本不进索引')

  // size 不匹配（mtime 正确）也判定为冲突
  const second = await store.readPage(page.id)
  const res2 = await store.savePage({
    id: page.id,
    markdown: '第二次',
    rev: second.rev,
    baseMtimeMs: second.mtimeMs,
    baseSize: second.size + 999,
  })
  assert.ok(res2.conflictFile)
  // 冲突副本是磁盘文件原样（含 frontmatter），正文仍是上一版
  assert.equal(bodyOf(fs.readFileSync(res2.conflictFile, 'utf8')), '我的新内容')
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
  assert.equal(store.tree().pages.length, 0)
  assert.equal(fs.existsSync(page.path), false, '物理文件应被移走')

  await store.createPage({ notebookId: nb.id, title: '又一页', markdown: 'x' })
  const nbRes = await store.deleteNotebook(nb.id)
  assert.ok(fs.existsSync(nbRes.trashed))
  assert.ok(nbRes.trashed.startsWith(path.join(rootDir, '.trash') + path.sep))
  assert.equal(nbRes.removedPages, 1)
  assert.equal(store.tree().notebooks.length, 0)
  assert.equal(store.tree().pages.length, 0)

  // 回收站清单：桶按名字降序
  const trash = await store.listTrash()
  assert.equal(trash.length, 2)
  assert.ok(trash[0].bucket >= trash[1].bucket)
  assert.ok(trash.every((b) => Array.isArray(b.entries) && typeof b.size === 'number'))
  // 页面以 `<pageId>.md` 直接落在桶里；笔记本整目录进桶
  assert.ok(trash.some((b) => b.entries.includes(`${page.id}.md`)))
  assert.ok(trash.some((b) => b.entries.includes(nb.id)))
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
  // 清理测试目录，避免 t.after 的 rmSync 因目录已删而报错（force 已兜底，这里仅示意）
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
  // index 丢了标题，按 §5.1 从目录名重建（目录名就是 notebook id）
  assert.equal(tree.notebooks[0].id, nb.id)
  assert.equal(tree.notebooks[0].title, nb.id)
  assert.equal(tree.pages.length, 1)
  assert.equal(tree.pages[0].id, page.id)
  assert.equal(tree.pages[0].title, '一页')
  assert.equal((await store2.readPage(page.id)).markdown, '正文内容')
  // index.json 已被重写回合法 JSON
  assert.equal(JSON.parse(fs.readFileSync(path.join(rootDir, 'index.json'), 'utf8')).version, 1)
})

/* ------------------------------------------------------------------ *
 * 7. 外部新增页面文件
 * ------------------------------------------------------------------ */

test('7. 外部新增 nb_x/p_y.md → 重新 init() 后被索引到', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  await store.createNotebook({ title: '已有' })

  const dir = path.join(rootDir, 'nb_x')
  fs.mkdirSync(dir, { recursive: true })
  const iso = new Date('2026-11-03T05:00:00.000Z').toISOString()
  fs.writeFileSync(
    path.join(dir, 'p_y.md'),
    `---\nid: p_y\ntitle: 外部页\ncreated: ${iso}\nupdated: ${iso}\ntags: [a, b]\n---\n\n外部正文`,
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
  assert.ok(row, '外部 .md 应被索引')
  assert.equal(row.title, '外部页')
  assert.equal(row.notebookId, 'nb_x')
  assert.equal(row.rev, 1)
  assert.equal(row.createdAt, Date.parse(iso))
  assert.equal((await store2.readPage('p_y')).markdown, '外部正文')
})

/* ------------------------------------------------------------------ *
 * 8. 外部改正文
 * ------------------------------------------------------------------ */

test('8. 外部改正文 → 重新 init() 后 readPage 返回新正文', async (t) => {
  const { store, rootDir } = makeStore(t)
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '页', markdown: '原文' })
  const detail = await store.readPage(page.id)

  const raw = fs.readFileSync(detail.path, 'utf8')
  fs.writeFileSync(detail.path, raw.replace('原文', '外部改写'), 'utf8')

  const store2 = new NotesStore({ rootDir })
  await store2.init()

  const fresh = await store2.readPage(page.id)
  assert.equal(fresh.markdown, '外部改写')
  assert.equal(fresh.rev, page.rev, '外部改正文不改 rev')
  assert.equal(fresh.size, Buffer.byteLength('外部改写', 'utf8'))
  // 索引里的 size / mtime 也跟着校正
  const row = store2.tree().pages.find((p) => p.id === page.id)
  assert.equal(row.size, Buffer.byteLength('外部改写', 'utf8'))
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

/** 同步版断言谓词（assetPath 是同步方法）。 */
function isStoreErrorSync(status) {
  return (err) => {
    assert.ok(err instanceof StoreError)
    assert.equal(err.status, status)
    return true
  }
}

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
 * 12. 体积上限
 * ------------------------------------------------------------------ */

test('12. 超过 maxPageBytes → 413（边界值恰好通过）', async (t) => {
  const { store } = makeStore(t, { maxPageBytes: 64 })
  await store.init()
  const nb = await store.createNotebook({ title: 'nb' })
  const page = await store.createPage({ notebookId: nb.id, title: '小', markdown: 'x' })

  await assert.rejects(
    () => store.savePage({ id: page.id, markdown: 'x'.repeat(65), rev: page.rev }),
    (err) => {
      isStoreError(413)(err)
      assert.match(err.message, /上限/)
      return true
    },
  )
  // 超限内容不得落盘
  assert.equal((await store.readPage(page.id)).markdown, 'x')

  const ok = await store.savePage({ id: page.id, markdown: 'x'.repeat(64), rev: page.rev })
  assert.equal(ok.page.size, 64)

  // 中文按 UTF-8 字节算
  await assert.rejects(
    () => store.savePage({ id: page.id, markdown: '中'.repeat(22), rev: ok.page.rev }),
    isStoreError(413),
  )
  // 新建页面同样受限制
  await assert.rejects(
    () => store.createPage({ notebookId: nb.id, title: '大', markdown: 'y'.repeat(65) }),
    isStoreError(413),
  )
})

/* ------------------------------------------------------------------ *
 * 13. 附加：追加 / 排序 / 笔记本维护 / 404
 * ------------------------------------------------------------------ */

test('13. appendPage / reorder / updateNotebook / 404 边界', async (t) => {
  const { store } = makeStore(t)
  await store.init()

  const nb = await store.createNotebook({ title: 'nb' })
  await assert.rejects(() => store.createNotebook({ title: '   ' }), isStoreError(400))
  await assert.rejects(() => store.createNotebook({ title: 'x', parentId: 'nb_nope' }), isStoreError(404))
  await assert.rejects(() => store.createPage({ notebookId: 'nb_nope', title: 'x' }), isStoreError(404))
  await assert.rejects(() => store.readPage('p_nope'), isStoreError(404))

  // append
  const page = await store.createPage({ notebookId: nb.id, title: '日志', markdown: '第一行' })
  const appended = await store.appendPage({ id: page.id, markdown: '第二行' })
  assert.equal(appended.markdown, '第一行\n第二行')
  assert.equal(appended.rev, 2)
  // 结尾已有换行时不再多补一个
  const appended2 = await store.appendPage({ id: page.id, markdown: '第三行' })
  assert.equal(appended2.markdown, '第一行\n第二行\n第三行')

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

  // setTitle 只改 frontmatter 标题
  const retitled = await store.setTitle(page.id, '新标题')
  assert.equal(retitled.title, '新标题')
  assert.equal(retitled.markdown, '第一行\n第二行\n第三行')

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
    Array.from({ length: 8 }, (_, i) =>
      store.createPage({ notebookId: nb.id, title: `p${i}`, markdown: `${i}` }),
    ),
  )
  assert.equal(new Set(pages.map((p) => p.id)).size, 8, 'id 不能重复')
  assert.equal(store.tree().pages.length, 8)

  // 同一批页面并发保存（各自 rev 正确）
  await Promise.all(pages.map((p, i) => store.savePage({ id: p.id, markdown: `第 ${i} 版`, rev: p.rev })))
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
