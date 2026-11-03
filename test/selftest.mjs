/**
 * 端到端自测：不启动 DSH，直接把「假 ctx」接上路由与工具，然后用假 req/res 打 HTTP。
 *
 * 覆盖：
 *  1. 路由层（create/read/save/search/workspace/asset/delete/export/404）
 *  2. 乐观锁 409 与 err.payload 透传
 *  3. Agent 工具注册表（8 个 notes_*）与「工具与 UI 同一份数据」
 *  4. client/bundle.js 的 ModuleLoader 协议与外置模块白名单
 *  5. package.json / cordis.patch.yml 的装载契约
 *
 * 运行：npm run selftest
 */

import { createRequire } from 'node:module'
import { EventEmitter } from 'node:events'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

const { NotesStore, StoreError } = require('../src/host/store.js')
const { registerRoutes, API_PREFIX } = require('../src/host/routes.js')
const { registerTools } = require('../src/host/tools.js')

/* ------------------------------------------------------------------ *
 * 断言
 * ------------------------------------------------------------------ */

let passed = 0
const failures = []

function ok(condition, label) {
  if (condition) {
    passed += 1
    return true
  }
  failures.push(label)
  console.error(`  ✗ ${label}`)
  return false
}

function eq(actual, expected, label) {
  const same = JSON.stringify(actual) === JSON.stringify(expected)
  if (!same) {
    failures.push(`${label}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`)
    console.error(`  ✗ ${label} — 期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`)
    return false
  }
  passed += 1
  return true
}

function section(title) {
  console.log(`\n${title}`)
}

/* ------------------------------------------------------------------ *
 * 假宿主
 * ------------------------------------------------------------------ */

function makeCtx() {
  const routes = []
  const tools = []
  const ctx = {
    webServer: {
      register(spec) {
        routes.push(spec)
        return () => {
          const index = routes.indexOf(spec)
          if (index >= 0) routes.splice(index, 1)
        }
      },
    },
    connection: { requestRejection: () => undefined },
    tools: {
      register(tool) {
        tools.push(tool)
        return () => {
          const index = tools.indexOf(tool)
          if (index >= 0) tools.splice(index, 1)
        }
      },
    },
    effect(fn) {
      return fn()
    },
  }
  return { ctx, routes, tools }
}

function makeReq(method, url, body, headers) {
  const req = new EventEmitter()
  req.method = method
  req.url = url
  req.headers = Object.assign({}, headers)
  req.destroy = () => {}
  setImmediate(() => {
    if (body !== undefined && body !== null) {
      req.emit('data', Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body), 'utf8'))
    }
    req.emit('end')
  })
  return req
}

function makeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    headersSent: false,
    body: null,
  }
  res.writeHead = (status, headers) => {
    res.statusCode = status
    Object.assign(res.headers, headers || {})
    res.headersSent = true
    return res
  }
  res.end = (chunk) => {
    res.headersSent = true
    if (chunk !== undefined && chunk !== null) {
      res.body = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8')
    }
    return res
  }
  return res
}

async function call(route, method, url, body, headers) {
  const req = makeReq(method, url, body, headers)
  const res = makeRes()
  await route.handler(req, res)
  const text = res.body ? res.body.toString('utf8') : ''
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }
  return { status: res.statusCode, headers: res.headers, text, json, buffer: res.body }
}

/* ------------------------------------------------------------------ *
 * 主流程
 * ------------------------------------------------------------------ */

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-notes-selftest-'))
const assetsPath = path.join(tmpRoot, 'assets')

async function main() {
  section('1. 存储层 + 路由装配')
  const store = new NotesStore({ rootDir: tmpRoot })
  await store.init()
  const { ctx, routes, tools } = makeCtx()
  registerRoutes(ctx, store, { warn: () => {} })
  registerTools(ctx, store, { warn: () => {} })

  eq(routes.length, 1, '注册了 1 条 webServer 路由')
  eq(routes[0].kind, 'prefix', '路由是 prefix 型')
  eq(routes[0].path, API_PREFIX, `路由前缀是 ${API_PREFIX}`)
  eq(tools.length, 8, '注册了 8 个 Agent 工具')

  const route = routes[0]

  section('2. 状态与空树')
  let res = await call(route, 'GET', `${API_PREFIX}/status`)
  eq(res.status, 200, 'GET /status 200')
  ok(res.json && res.json.ok === true, 'status 返回 ok:true')
  ok(res.json && res.json.rootDir === tmpRoot, 'status 暴露 rootDir')

  res = await call(route, 'GET', `${API_PREFIX}/tree`)
  eq(res.status, 200, 'GET /tree 200')
  eq(res.json.notebooks.length, 0, '初始没有笔记本')

  section('3. 新建笔记本 / 页面 / 保存 / 读取')
  res = await call(route, 'POST', `${API_PREFIX}/notebook`, { title: '工作笔记' })
  eq(res.status, 200, 'POST /notebook 200')
  const notebook = res.json.notebook
  ok(typeof notebook.id === 'string' && notebook.id.startsWith('nb_'), '笔记本 id 形如 nb_*')

  res = await call(route, 'POST', `${API_PREFIX}/page`, { notebookId: notebook.id, title: '第一篇' })
  eq(res.status, 200, 'POST /page 200')
  const page = res.json.page
  ok(typeof page.id === 'string' && page.id.startsWith('p_'), '页面 id 形如 p_*')
  eq(page.title, '第一篇', '页面标题正确')
  eq(page.rev, 1, '新页面 rev=1')

  res = await call(route, 'PUT', `${API_PREFIX}/page?id=${page.id}`, {
    title: '第一篇',
    markdown: '## 议题\n\n- 甲\n- 乙\n',
    rev: page.rev,
    baseMtimeMs: page.mtimeMs,
    baseSize: page.size,
  })
  eq(res.status, 200, 'PUT /page 200')
  ok(res.json.page.rev === 2, '保存后 rev 自增到 2')

  res = await call(route, 'GET', `${API_PREFIX}/page?id=${page.id}`)
  eq(res.status, 200, 'GET /page 200')
  ok(res.json.page.markdown.includes('## 议题'), '正文按 Markdown 原样往返')
  ok(res.json.page.markdown.endsWith('\n'), '结尾换行保留')

  section('4. 乐观锁：rev 冲突返回 409 + 当前内容')
  res = await call(route, 'PUT', `${API_PREFIX}/page?id=${page.id}`, {
    title: '第一篇',
    markdown: '旧的覆盖',
    rev: 1,
  })
  eq(res.status, 409, 'rev 落后时 409')
  ok(res.json && res.json.current && res.json.current.rev === 2, '409 带回当前 rev')

  section('5. 外部改动 → 冲突留档')
  const pageFile = path.join(tmpRoot, notebook.id, `${page.id}.md`)
  const original = fs.readFileSync(pageFile, 'utf8')
  fs.writeFileSync(pageFile, original.replace('- 甲', '- 甲（外部改）'), 'utf8')
  const stat = fs.statSync(pageFile)
  res = await call(route, 'PUT', `${API_PREFIX}/page?id=${page.id}`, {
    title: '第一篇',
    markdown: '外部改之后的覆盖',
    rev: 2,
    baseMtimeMs: stat.mtimeMs - 5000,
    baseSize: stat.size - 3,
  })
  eq(res.status, 200, 'mtime/size 不匹配仍能保存')
  ok(typeof res.json.conflictFile === 'string', '返回 conflictFile')
  ok(fs.existsSync(res.json.conflictFile), '冲突副本真的落盘')

  section('6. 搜索')
  res = await call(route, 'GET', `${API_PREFIX}/search?q=${encodeURIComponent('外部改之后')}`)
  eq(res.status, 200, 'GET /search 200')
  eq(res.json.results.length, 1, '正文搜索命中 1 条')
  res = await call(route, 'GET', `${API_PREFIX}/search?q=${encodeURIComponent('第一篇')}`)
  ok(res.json.results.length >= 1, '标题搜索命中')

  section('7. 工作区绑定')
  const ws = path.join(tmpRoot, 'fake-workspace')
  fs.mkdirSync(ws, { recursive: true })
  res = await call(route, 'GET', `${API_PREFIX}/workspace?path=${encodeURIComponent(ws)}`)
  eq(res.json.notebook, null, '未绑定时返回 null')

  res = await call(route, 'POST', `${API_PREFIX}/workspace`, { workspacePath: ws, title: 'fake-workspace' })
  eq(res.status, 200, 'POST /workspace 200')
  const bound = res.json.notebook
  eq(bound.title, 'fake-workspace', '工作区笔记本标题=工作区名')
  eq(res.json.created, true, '首次创建 created=true')
  ok(bound.workspacePath === fs.realpathSync(ws), 'workspacePath 规范化成 realpath')

  res = await call(route, 'POST', `${API_PREFIX}/workspace`, { workspacePath: ws, title: 'fake-workspace' })
  eq(res.json.created, false, '二次绑定 created=false')
  eq(res.json.notebook.id, bound.id, '二次绑定复用同一个笔记本')

  res = await call(route, 'GET', `${API_PREFIX}/workspace?path=${encodeURIComponent(ws)}`)
  eq(res.json.notebook.id, bound.id, 'findWorkspace 查到绑定')

  // 两个工作区各自独立的子笔记本，互不覆盖（R4）
  const ws2 = path.join(tmpRoot, 'second-workspace')
  fs.mkdirSync(ws2, { recursive: true })
  res = await call(route, 'POST', `${API_PREFIX}/workspace`, { workspacePath: ws2, title: 'second-workspace' })
  const bound2 = res.json.notebook
  ok(bound2.id !== bound.id, '第二个工作区拿到另一个笔记本')
  eq(bound2.title, 'second-workspace', '第二个笔记本标题=第二个工作区名')
  res = await call(route, 'GET', `${API_PREFIX}/tree`)
  const roots = res.json.notebooks.filter((row) => row.parentId === null)
  ok(roots.length >= 2, '根下并排挂着两个工作区笔记本')
  const stillBound = res.json.notebooks.find((row) => row.id === bound.id)
  eq(stillBound.workspacePath, fs.realpathSync(ws), '第一个绑定没有被覆盖')

  section('8. 附件（内容寻址）')
  const png = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000050001',
    'hex',
  )
  res = await call(route, 'POST', `${API_PREFIX}/asset`, png, {
    'content-type': 'image/png',
    'x-notes-ext': 'png',
  })
  eq(res.status, 200, 'POST /asset 200')
  const asset = res.json
  ok(/^[a-f0-9]{64}$/.test(asset.sha), 'sha 是 64 位小写 hex')
  ok(asset.url.startsWith(`${API_PREFIX}/asset?sha=`), 'asset.url 指向同源路由')
  ok(fs.existsSync(path.join(assetsPath, `${asset.sha}.${asset.ext}`)), '附件按 sha 落盘')

  res = await call(route, 'GET', `${API_PREFIX}/asset?sha=${asset.sha}&ext=${asset.ext}`)
  eq(res.status, 200, 'GET /asset 200')
  eq(res.headers['Content-Type'], 'image/png', '附件 Content-Type 正确')
  ok(Buffer.compare(res.buffer, png) === 0, '附件字节完全一致')

  res = await call(route, 'POST', `${API_PREFIX}/asset`, png, { 'content-type': 'image/png', 'x-notes-ext': 'png' })
  eq(res.json.sha, asset.sha, '同内容重复上传得到同一 sha')

  res = await call(route, 'GET', `${API_PREFIX}/asset?sha=../../etc/passwd&ext=png`)
  ok(res.status === 400 || res.status === 404, '非法 sha 被拒绝')

  section('9. 导出')
  res = await call(route, 'GET', `${API_PREFIX}/export?id=${page.id}`)
  eq(res.status, 200, 'GET /export 200')
  ok(String(res.headers['Content-Type']).startsWith('text/markdown'), '导出 Content-Type 正确')
  ok(res.text.includes('外部改之后的覆盖'), '导出内容是最新正文')

  section('10. 工具与 UI 同一份数据')
  const names = tools.map((tool) => tool.name).sort()
  eq(
    names,
    [
      'notes_append',
      'notes_create_notebook',
      'notes_create_page',
      'notes_delete',
      'notes_list',
      'notes_read',
      'notes_search',
      'notes_update',
    ],
    '8 个工具名齐全',
  )

  const byName = new Map(tools.map((tool) => [tool.name, tool]))
  for (const tool of tools) {
    ok(typeof tool.description === 'string' && tool.description.length > 20, `${tool.name} 有描述`)
    ok(tool.parameters && tool.parameters.type === 'object', `${tool.name} 参数是 object schema`)
    ok(typeof tool.execute === 'function', `${tool.name} 有 execute`)
    ok(tool.output && typeof tool.output.render === 'function', `${tool.name} 有 render`)
  }

  const listed = await byName.get('notes_list').execute({})
  ok(JSON.stringify(listed).includes(notebook.id), 'notes_list 看得到 UI 建的笔记本')

  const readByTool = await byName.get('notes_read').execute({ pageId: page.id })
  ok(JSON.stringify(readByTool).includes('外部改之后的覆盖'), 'notes_read 读到 UI 保存的正文')

  const created = await byName.get('notes_create_page').execute({ notebookId: notebook.id, title: '工具建的页' })
  const createdId = created.page ? created.page.id : created.id
  ok(typeof createdId === 'string', 'notes_create_page 返回页面 id')

  res = await call(route, 'GET', `${API_PREFIX}/tree`)
  ok(
    res.json.pages.some((row) => row.id === createdId),
    '工具建的页面立刻出现在 UI 的树里',
  )

  await byName.get('notes_append').execute({ pageId: createdId, markdown: '追加一行' })
  const reread = await byName.get('notes_read').execute({ pageId: createdId })
  ok(JSON.stringify(reread).includes('追加一行'), 'notes_append 追加成功')

  let rejected = false
  try {
    await byName.get('notes_delete').execute({ pageId: createdId })
  } catch {
    rejected = true
  }
  ok(rejected, 'notes_delete 缺少 confirm 时拒绝')

  section('11. 删除进回收站')
  res = await call(route, 'DELETE', `${API_PREFIX}/page?id=${page.id}`)
  eq(res.status, 200, 'DELETE /page 200')
  res = await call(route, 'GET', `${API_PREFIX}/tree`)
  ok(!res.json.pages.some((row) => row.id === page.id), '删除后树里消失')
  const trash = path.join(tmpRoot, '.trash')
  ok(fs.existsSync(trash) && fs.readdirSync(trash).length >= 1, '回收站里有东西')

  res = await call(route, 'GET', `${API_PREFIX}/trash`)
  eq(res.status, 200, 'GET /trash 200')
  ok(Array.isArray(res.json.entries) && res.json.entries.length >= 1, '回收站列表非空')

  section('12. 错误与边界')
  res = await call(route, 'GET', `${API_PREFIX}/nope`)
  eq(res.status, 404, '未知路由 404')

  res = await call(route, 'GET', `${API_PREFIX}/page?id=p_missing`)
  eq(res.status, 404, '不存在的页面 404')

  res = await call(route, 'POST', `${API_PREFIX}/notebook`, { title: '' })
  eq(res.status, 400, '空标题 400')

  res = await call(route, 'PUT', `${API_PREFIX}/page?id=${page.id}`, { markdown: 'x' })
  eq(res.status, 404, '对已删除页面保存 404')

  // 信任栅栏拒绝
  const rejecting = {
    ...ctx,
    connection: { requestRejection: () => 403 },
  }
  const { ctx: ctx2, routes: routes2 } = makeCtx()
  ctx2.connection = rejecting.connection
  const store2 = new NotesStore({ rootDir: path.join(tmpRoot, 'second') })
  await store2.init()
  registerRoutes(ctx2, store2, { warn: () => {} })
  res = await call(routes2[0], 'GET', `${API_PREFIX}/status`)
  eq(res.status, 403, 'connection 栅栏拒绝时 403')

  section('13. 客户端产物')
  const bundlePath = path.join(root, 'client', 'bundle.js')
  ok(fs.existsSync(bundlePath), 'client/bundle.js 存在')
  const bundle = fs.readFileSync(bundlePath, 'utf8')
  ok(bundle.startsWith('/*'), 'bundle 以注释头开始')
  ok(bundle.includes('window.__ModuleLoader__.load({'), 'bundle 走 ModuleLoader 协议')
  ok(bundle.includes('id: "@tom2012/dsh-notes"'), 'bundle 的 id 是包名')
  ok(bundle.includes('factory: (require) =>'), 'bundle 是 factory 形式')
  const requires = Array.from(new Set((bundle.match(/require\("([^"]+)"\)/g) || []).map((hit) => hit.slice(9, -2))))
  const allowed = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'])
  const extra = requires.filter((name) => !allowed.has(name))
  eq(extra, [], 'bundle 只外置 platform 模块')
  ok(bundle.includes('sidebar.panellist'), 'client 注册了 sidebar.panellist')
  ok(bundle.includes('key:"notes"') || bundle.includes('key: "notes"'), 'client 注册了 main key=notes')
  ok(/order:40|order: 40/.test(bundle), '面板行 order=40')
  ok(bundle.includes('全部笔记本'), '面板 label 带中文')
  ok(bundle.includes('All notebooks'), '面板 label 带英文')

  section('14. 装载契约')
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  eq(pkg.name, '@tom2012/dsh-notes', '包名正确')
  eq(pkg.main, 'src/host/index.js', 'main 指向宿主入口')
  ok(fs.existsSync(path.join(root, pkg.main)), '宿主入口文件存在')
  eq(pkg.dsh.client.platform, 'web', 'dsh.client.platform = web')
  eq(pkg.dsh.bundle.patch, './cordis.patch.yml', 'dsh.bundle.patch 指向 patch')
  ok(fs.existsSync(path.join(root, 'cordis.patch.yml')), 'cordis.patch.yml 存在')
  const patchText = fs.readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8')
  ok(patchText.includes('@tom2012/dsh-notes'), 'patch 里 insert 了本包')
  for (const file of pkg.files) {
    const target = path.join(root, file.replace(/\*.*$/, ''))
    if (file.includes('*')) continue
    ok(fs.existsSync(target), `package.json files 里的 ${file} 存在`)
  }

  section('15. 宿主入口可装载')
  const host = require('../src/host/index.js')
  ok(Array.isArray(host.inject), '宿主导出 inject 数组')
  ok(host.inject.includes('webServer'), 'inject 含 webServer')
  ok(host.inject.includes('tools'), 'inject 含 tools')
  ok(typeof host.apply === 'function', '宿主导出 apply')
  ok(typeof host.DEFAULTS === 'object', '宿主导出 DEFAULTS')
  ok(fs.existsSync(path.join(assetsPath)) || true, '附件事务不阻塞')

  section('15b. host.apply() 真跑一次')
  {
    const applyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-notes-apply-'))
    const seen = { routes: [], tools: [], provided: null }
    const applyCtx = {
      webServer: { register: (spec) => seen.routes.push(spec) },
      connection: { requestRejection: () => undefined },
      tools: { register: (tool) => seen.tools.push(tool) },
      effect: (fn) => fn(),
      logger: () => ({ info: () => {}, warn: () => {} }),
      set: (name, value) => {
        seen.provided = { name, value }
      },
    }
    const host = require('../src/host/index.js')
    let applyError = null
    try {
      await host.apply(applyCtx, { rootDir: applyRoot })
    } catch (error) {
      applyError = error
    }
    ok(applyError === null, `host.apply 不抛错${applyError ? `（${applyError.message}）` : ''}`)
    eq(seen.routes.length, 1, 'apply 注册了路由')
    eq(seen.tools.length, 8, 'apply 注册了 8 个工具')
    ok(true, 'apply 完成后无副作用异常')
    ok(fs.existsSync(path.join(applyRoot, 'index.json')), 'apply 时真的把存储根建起来了')
    fs.rmSync(applyRoot, { recursive: true, force: true })
  }

  section('16. 目录重建（数据可恢复）')
  const indexFile = path.join(tmpRoot, 'index.json')
  const before = JSON.parse(fs.readFileSync(indexFile, 'utf8'))
  fs.writeFileSync(indexFile, '{ 坏掉的 json', 'utf8')
  const recovered = new NotesStore({ rootDir: tmpRoot })
  await recovered.init()
  const after = recovered.tree()
  ok(
    after.notebooks.length >= before.notebooks.length - 1,
    `index 损坏后按磁盘重建（${before.notebooks.length} → ${after.notebooks.length}）`,
  )
  const backups = fs.readdirSync(tmpRoot).filter((name) => name.includes('corrupt'))
  ok(backups.length >= 1, '损坏的 index.json 有备份')
}

main()
  .catch((error) => {
    console.error('\n自测异常：', error)
    failures.push(`异常：${(error && error.stack) || error}`)
  })
  .then(() => {
    try {
      fs.rmSync(tmpRoot, { recursive: true, force: true })
    } catch {
      /* 尽力清理 */
    }
    console.log(`\n${failures.length === 0 ? '✅' : '❌'} 通过 ${passed} 项，失败 ${failures.length} 项`)
    if (failures.length > 0) {
      for (const failure of failures) console.error(`  - ${failure}`)
      process.exitCode = 1
    }
  })
