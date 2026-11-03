/**
 * 客户端集成测试：在 jsdom 里真渲染 client/bundle.js，网络层直接接到进程内的
 * NotesStore + 路由（假的 webServer handler），所以这是「浏览器 + 宿主」的最小闭环。
 *
 * 覆盖：
 *  - ModuleLoader 协议、apply() 注册了 sidebar.panellist / main
 *  - 工作区条：未选工作区 / 有工作区但无笔记本 / 建完变「打开笔记本」
 *  - 点「新建笔记本」→ 根下出现以工作区命名的子笔记本 + 一页 → 编辑器挂载
 *  - 标题输入 → 800ms 防抖自动保存 → 磁盘上真的变了
 *  - 树里出现页面行、搜索框、语言切换
 *
 * 运行：npm run smoke
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

const bundlePath = path.join(root, 'client', 'bundle.js')
if (!fs.existsSync(bundlePath)) {
  console.error('client/bundle.js 不存在，先跑 npm run build')
  process.exit(1)
}

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
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passed += 1
    return true
  }
  failures.push(`${label}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`)
  console.error(`  ✗ ${label} — 期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`)
  return false
}

function section(title) {
  console.log(`\n${title}`)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitFor(predicate, label, timeout = 4000) {
  const start = Date.now()
  for (;;) {
    let hit = false
    try {
      hit = predicate()
    } catch {
      hit = false
    }
    if (hit) {
      passed += 1
      return true
    }
    if (Date.now() - start > timeout) {
      failures.push(`等待超时：${label}`)
      console.error(`  ✗ 等待超时：${label}`)
      return false
    }
    await sleep(20)
  }
}

/* ------------------------------------------------------------------ *
 * 假 req / res（与 selftest 同一套形状）
 * ------------------------------------------------------------------ */

function makeReq(method, url, body, headers) {
  const req = new EventEmitter()
  req.method = method
  req.url = url
  req.headers = Object.assign({}, headers || {})
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
  const res = { statusCode: 200, headers: {}, headersSent: false, body: null }
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

/* ------------------------------------------------------------------ *
 * 环境
 * ------------------------------------------------------------------ */

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-notes-smoke-'))
const workspaceDir = path.join(tmpRoot, 'my-project')
fs.mkdirSync(workspaceDir, { recursive: true })
const notesRoot = path.join(tmpRoot, 'notes')

const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!doctype html><html lang="zh-CN"><body><div id="root"></div></body></html>', {
  pretendToBeVisual: true,
  url: 'https://dsh.test/',
})
const win = dom.window

const globals = {
  window: win,
  document: win.document,
  MutationObserver: win.MutationObserver,
  getComputedStyle: win.getComputedStyle,
  DOMParser: win.DOMParser,
  Element: win.Element,
  HTMLElement: win.HTMLElement,
  HTMLInputElement: win.HTMLInputElement,
  Node: win.Node,
  Range: win.Range,
  Event: win.Event,
  CustomEvent: win.CustomEvent,
  KeyboardEvent: win.KeyboardEvent,
  MouseEvent: win.MouseEvent,
  File: win.File,
  FileReader: win.FileReader,
  requestAnimationFrame: win.requestAnimationFrame.bind(win),
  cancelAnimationFrame: win.cancelAnimationFrame.bind(win),
  DocumentFragment: win.DocumentFragment,
  Text: win.Text,
  DOMParser: win.DOMParser,
}
for (const [key, value] of Object.entries(globals)) globalThis[key] = value
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true })

const { NotesStore } = require('../src/host/store.js')
const { registerRoutes } = require('../src/host/routes.js')

const React = require('react')
const { createRoot } = require('react-dom/client')

async function main() {
  section('1. 进程内宿主')
  const store = new NotesStore({ rootDir: notesRoot })
  await store.init()
  const routes = []
  registerRoutes(
    {
      webServer: { register: (spec) => routes.push(spec) },
      connection: { requestRejection: () => undefined },
      effect: (fn) => fn(),
    },
    store,
    { warn: () => {} },
  )
  eq(routes.length, 1, '宿主路由已注册')
  const route = routes[0]

  // 网络层：把 fetch 接到这条路由上，等价于同源请求。
  globalThis.fetch = async (url, options = {}) => {
    const method = String(options.method || 'GET').toUpperCase()
    const body = options.body
    let payload
    if (typeof body === 'string') {
      try {
        payload = JSON.parse(body)
      } catch {
        payload = undefined
      }
    } else {
      payload = body
    }
    const req = makeReq(method, url, payload, options.headers)
    const res = makeRes()
    await route.handler(req, res)
    const text = res.body ? res.body.toString('utf8') : ''
    return {
      ok: res.statusCode >= 200 && res.statusCode < 300,
      status: res.statusCode,
      headers: { get: (name) => res.headers[name] },
      async json() {
        return text ? JSON.parse(text) : {}
      },
      async text() {
        return text
      },
    }
  }
  win.fetch = globalThis.fetch

  section('2. ModuleLoader 装载 bundle')
  const registrations = []
  let loaded = null
  win.__ModuleLoader__ = {
    load(registration) {
      loaded = registration
    },
  }
  // eslint-disable-next-line no-new-func
  new Function(fs.readFileSync(bundlePath, 'utf8'))()
  ok(loaded !== null, 'bundle 调用了 __ModuleLoader__.load')
  eq(loaded.id, '@tom2012/dsh-notes', 'bundle id = 包名')

  const slotsCtx = {
    slots: {
      inject(name, fn) {
        fn()
      },
      register(options, component) {
        registrations.push({ options, component })
        return () => {}
      },
    },
    get(name) {
      if (name === 'uiSession') {
        return {
          current: {
            getSnapshot: () => ({ key: 's1' }),
            subscribe: () => () => {},
          },
        }
      }
      if (name === 'sessions') {
        return {
          list: {
            getSnapshot: () => ({ byId: { s1: { id: 's1', cwd: workspaceDir, retainedBy: { mainView: 1 } } } }),
            subscribe: () => () => {},
          },
        }
      }
      if (name === 'workspaces') {
        return {
          list: {
            getSnapshot: () => ({ items: [{ path: workspaceDir, title: 'my-project' }] }),
            subscribe: () => () => {},
          },
        }
      }
      return undefined
    },
  }
  const plugin = loaded.factory((name) => {
    if (name === 'react') return React
    if (name === 'react/jsx-runtime') return require('react/jsx-runtime')
    if (name === 'react-dom') return require('react-dom')
    if (name === 'react-dom/client') return require('react-dom/client')
    throw new Error(`bundle 请求了未声明的外置模块：${name}`)
  })
  eq(plugin.inject, ['slots'], '插件 inject = [slots]')
  ok(typeof plugin.apply === 'function', '插件导出 apply')

  plugin.apply(slotsCtx)

  const panelReg = registrations.find((item) => item.options.name === 'sidebar.panellist')
  const mainReg = registrations.find((item) => item.options.name === 'main')
  ok(panelReg !== undefined, '注册了 sidebar.panellist')
  ok(mainReg !== undefined, '注册了 main')
  eq(panelReg.options.id, 'notes', '面板 id = notes')
  eq(panelReg.options.order, 40, '面板 order = 40（排在技能库 35 之后）')
  eq(panelReg.options.label, { zh: '全部笔记本', en: 'All notebooks' }, '面板 label 带中英映射')
  eq(mainReg.options.key, 'notes', 'main 槽 key = notes')

  // 面板图标能渲染成 svg
  const { renderToStaticMarkup } = require('react-dom/server')
  const iconMarkup = renderToStaticMarkup(React.createElement(panelReg.component))
  ok(iconMarkup.startsWith('<svg'), '面板图标是内联 SVG')

  section('3. 渲染 app（有工作区、还没有笔记本）')
  const fakeCtx = slotsCtx

  const container = win.document.getElementById('root')
  const reactRoot = createRoot(container)
  const renderApp = () => reactRoot.render(mainReg.component({ ctx: fakeCtx }))
  renderApp()

  await waitFor(() => container.innerHTML.length > 0, 'app 挂载出内容')
  await waitFor(() => container.textContent.includes('my-project'), '工作区条显示当前工作区名')
  ok(container.textContent.includes('当前工作区'), '工作区条有「当前工作区」标签')
  await waitFor(() => container.textContent.includes('还没有笔记本'), '空态提示出现')
  ok(container.querySelector('.n-search input') !== null, '搜索框存在')
  ok(container.querySelector('.n-app') !== null, '根节点类名 n-app')

  section('4. 点「新建笔记本」')
  const buttons = Array.from(container.querySelectorAll('.n-wsbar-actions .n-btn'))
  const createButton = buttons[0]
  ok(createButton !== undefined, '工作区条有主按钮')
  eq(createButton.textContent.trim(), '新建笔记本', '无笔记本时按钮文案是「新建笔记本」')
  createButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))

  await waitFor(() => store.tree().notebooks.length === 1, '磁盘上出现了 1 个笔记本')
  const notebook = store.tree().notebooks[0]
  eq(notebook.title, 'my-project', '笔记本标题 = 工作区名')
  eq(notebook.parentId, null, '笔记本在根的第一层')
  ok(
    path.resolve(notebook.workspacePath || '') === fs.realpathSync(workspaceDir),
    '笔记本绑定到工作区路径',
  )

  await waitFor(() => store.tree().pages.length === 1, '自动建了一页')
  await waitFor(() => container.textContent.includes('打开笔记本'), '按钮变成「打开笔记本」')
  await waitFor(() => container.querySelector('.n-prose') !== null, 'TipTap 编辑区挂载')
  ok(container.querySelector('.n-toolbar') !== null, '工具栏出现')
  await waitFor(
    () => container.querySelector('.n-prose [data-placeholder]') !== null,
    '空文档显示占位文案',
    4000,
  )
  eq(
    container.querySelector('.n-prose [data-placeholder]')?.getAttribute('data-placeholder'),
    '开始写…',
    '占位文案是中文',
  )

  section('5. 树里有笔记本与页面行')
  await waitFor(() => container.querySelectorAll('.n-row').length >= 2, '树里出现笔记本行与页面行')
  const titles = Array.from(container.querySelectorAll('.n-row-title')).map((node) => node.textContent)
  ok(titles.includes('my-project'), `树里有笔记本标题（当前：${JSON.stringify(titles)}）`)
  ok(
    container.querySelectorAll('.n-row:not(.is-notebook)').length >= 1,
    '树里有页面行（新页面会自动进入行内改名，所以标题可能暂由输入框承载）',
  )

  section('6. 新建页面 + 改名 → 自动保存到磁盘')
  const notebookRow = Array.from(container.querySelectorAll('.n-row.is-notebook'))[0]
  ok(notebookRow !== undefined, '能找到笔记本行')
  const plusButton = notebookRow.querySelector('.n-row-actions .n-btn')
  plusButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await waitFor(() => store.tree().pages.length === 2, '再建一页（合计 2 页）')
  await waitFor(
    () => container.querySelectorAll('.n-row:not(.is-notebook)').length >= 2,
    '树里渲染出两个页面行',
  )
  await sleep(150)

  const titleInput = container.querySelector('.n-topbar .n-title-input')
  ok(titleInput !== null, '编辑器顶栏有标题输入')

  const setValue = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set
  setValue.call(titleInput, '周会记录')
  titleInput.dispatchEvent(new win.Event('input', { bubbles: true }))
  const savedTitle = await waitFor(
    () => store.tree().pages.some((row) => row.title === '周会记录'),
    '标题自动保存进索引',
    4000,
  )
  if (!savedTitle) {
    console.log('DEBUG banner:', container.querySelector('.n-banner')?.textContent)
    console.log('DEBUG state:', container.querySelector('.n-save-state')?.textContent)
    console.log('DEBUG pages:', JSON.stringify(store.tree().pages.map((row) => ({ id: row.id, title: row.title, rev: row.rev }))))
    console.log('DEBUG input value:', JSON.stringify(titleInput.value))
    console.log('DEBUG topbar?', container.querySelector('.n-topbar') !== null)
  }

  section('7. Markdown ↔ 编辑器往返 + 切页')
  const pageA = store.tree().pages.find((row) => row.title === '周会记录')
  ok(pageA !== undefined, '找到刚改名的页面')
  const detailA = await store.readPage(pageA.id)
  const written = await store.savePage({
    id: pageA.id,
    title: '周会记录',
    markdown: '## 议题\n\n- 甲\n- 乙\n',
    rev: detailA.rev,
    baseMtimeMs: detailA.mtimeMs,
    baseSize: detailA.size,
  })
  ok(written.page.rev === detailA.rev + 1, '直接写入正文成功')

  // 切到另一页再切回来，强制 EditorSurface 用服务端内容重建
  await waitFor(
    () => container.querySelectorAll('.n-row:not(.is-notebook)').length >= 2,
    '两个页面行都在',
  )
  const pageRows = Array.from(container.querySelectorAll('.n-row:not(.is-notebook)'))
  const otherRow = pageRows.find((row) => !row.classList.contains('is-active'))
  if (!ok(otherRow !== undefined, '存在另一个页面行可切换')) return
  otherRow.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await sleep(180)
  const backRow = Array.from(container.querySelectorAll('.n-row:not(.is-notebook)')).find((row) =>
    row.textContent.includes('周会记录'),
  )
  if (!ok(backRow !== undefined, '能切回「周会记录」页')) return
  backRow.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))

  await waitFor(() => container.querySelector('.n-prose h2') !== null, 'Markdown 标题被解析成 <h2>', 4000)
  eq(container.querySelector('.n-prose h2').textContent, '议题', '标题文本正确')
  eq(container.querySelectorAll('.n-prose ul li').length, 2, '列表解析成 2 个 <li>')
  ok(container.textContent.includes('已保存'), '切页后状态回到「已保存」')

  section('7b. 编辑区打字 → Cmd+S 落盘（jsdom 支持则校验）')
  const prose = container.querySelector('.n-prose')
  prose.focus()
  const selection = win.getSelection()
  selection.removeAllRanges()
  const range = win.document.createRange()
  range.selectNodeContents(prose)
  range.collapse(false)
  selection.addRange(range)
  if (typeof win.document.execCommand === 'function') {
    win.document.execCommand('insertText', false, '补充一行')
  }
  await sleep(120)
  const typed = prose.textContent.includes('补充一行')
  prose.dispatchEvent(new win.KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true }))
  await sleep(500)
  const after = await store.readPage(pageA.id)
  if (typed) {
    ok(after.markdown.includes('补充一行'), '输入的正文经 Cmd+S 落盘')
  } else {
    ok(true, '（jsdom 不支持 execCommand 输入，跳过正文键入断言）')
  }
  ok(after.markdown.includes('议题'), '原有正文没被清空')

  section('7c. 会话 … 菜单入口（P1）')
  const menuReg = registrations.find((item) => item.options.name === 'sidebar.workspaces.session.menu.item')
  ok(menuReg !== undefined, '注册了 sidebar.workspaces.session.menu.item')
  eq(menuReg.options.id, 'notes', '菜单项 id = notes')
  ok(typeof menuReg.options.order === 'number', '菜单项有 order')

  const menuHost = win.document.createElement('div')
  win.document.body.appendChild(menuHost)
  const menuRoot = createRoot(menuHost)
  menuRoot.render(menuReg.component({ sessionId: 's1' }))
  await waitFor(() => menuHost.querySelector('.n-menu-item') !== null, '菜单行渲染出来')
  const menuButton = menuHost.querySelector('.n-menu-item')
  await waitFor(() => menuButton.textContent.includes('打开笔记本'), '菜单行文案是「打开笔记本」', 4000)

  // 先把笔记本折叠起来，再看点击菜单项能不能把它叫回来
  const nbRow = container.querySelector('.n-row.is-notebook')
  nbRow.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await waitFor(() => nbRow.getAttribute('aria-expanded') === 'false', '笔记本被折叠')
  menuButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await waitFor(
    () => container.querySelector('.n-row.is-notebook')?.getAttribute('aria-expanded') === 'true',
    '点菜单项后笔记本重新展开（intent 生效）',
    4000,
  )
  menuRoot.unmount()
  menuHost.remove()

  section('8. 搜索')
  const searchInput = container.querySelector('.n-search input')
  setValue.call(searchInput, '周会')
  searchInput.dispatchEvent(new win.Event('input', { bubbles: true }))
  await waitFor(() => container.querySelectorAll('.n-hit').length >= 1, '搜索出结果', 4000)

  section('9. 语言切换')
  win.document.documentElement.lang = 'en'
  renderApp()
  renderApp()
  await waitFor(() => container.textContent.includes('Current workspace'), '英文文案生效', 4000)
  win.document.documentElement.lang = 'zh-CN'

  section('10. 卸载干净')
  reactRoot.unmount()
  await sleep(50)
  eq(container.innerHTML, '', '卸载后容器清空')
}

main()
  .catch((error) => {
    console.error('\n冒烟异常：', error)
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
    // jsdom 的 MutationObserver / EditorView 可能挂住事件循环
    setTimeout(() => process.exit(process.exitCode || 0), 50)
  })
