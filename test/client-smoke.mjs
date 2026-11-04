/**
 * 客户端集成测试：在 jsdom 里真渲染 client/bundle.js + client/editor.js，
 * 网络层直接接到进程内的 NotesStore + 路由（假的 webServer handler），
 * 所以这是「浏览器 + 宿主 + BlockNote」的最小闭环。
 *
 * 覆盖：
 *  - ModuleLoader / 编辑器工厂两套装载协议、apply() 注册的三个槽
 *  - 工作区条：有工作区但无笔记本 → 点「新建笔记本」→ 根下出现同名子笔记本 + 一页
 *  - 按钮文案从「新建笔记本」变「打开笔记本」
 *  - 树里出现笔记本行与页面行；标题输入 → 800ms 防抖 → 落盘
 *  - 页面 Markdown → blocks → 真实 BlockNote 渲染（标题/列表/待办/代码/表格/图片）
 *  - 切页重挂载、搜索、语言切换、会话菜单 intent、卸载
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
const editorPath = path.join(root, 'client', 'editor.js')
for (const file of [bundlePath, editorPath]) {
  if (!fs.existsSync(file)) {
    console.error(`${path.basename(file)} 不存在，先跑 npm run build`)
    process.exit(1)
  }
}

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

async function waitFor(predicate, label, timeout = 6000) {
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
    await sleep(25)
  }
}

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

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-notes-smoke-'))
const workspaceDir = path.join(tmpRoot, 'my-project')
fs.mkdirSync(workspaceDir, { recursive: true })
const notesRoot = path.join(tmpRoot, 'notes')

const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!doctype html><html lang="zh-CN"><body><div id="root"></div><div id="menu"></div></body></html>', {
  pretendToBeVisual: true,
  url: 'https://dsh.test/',
})
const win = dom.window

for (const key of [
  'document', 'MutationObserver', 'getComputedStyle', 'DOMParser', 'Element', 'HTMLElement', 'HTMLInputElement',
  'Node', 'Range', 'Event', 'CustomEvent', 'KeyboardEvent', 'MouseEvent', 'File', 'FileReader', 'DocumentFragment',
  'Text', 'DOMRect', 'DOMRectReadOnly', 'requestAnimationFrame', 'cancelAnimationFrame',
]) {
  if (win[key] !== undefined) globalThis[key] = win[key]
}
globalThis.window = win
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true })
win.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = win.ResizeObserver
win.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver = win.IntersectionObserver
win.matchMedia =
  win.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  }))
globalThis.matchMedia = win.matchMedia

const { NotesStore } = require('../src/host/store.js')
const { registerRoutes } = require('../src/host/routes.js')
const { markdownToBlocks } = require('../src/host/markdown-blocks.js')

const React = require('react')
const jsxRuntime = require('react/jsx-runtime')
const ReactDOM = require('react-dom')
const ReactDOMClient = require('react-dom/client')
const { createRoot } = ReactDOMClient

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

  section('2. 装载主包与编辑器重包')
  const registrations = []
  let loaded = null
  win.__ModuleLoader__ = {
    load(registration) {
      loaded = registration
    },
  }
  // eslint-disable-next-line no-new-func
  new Function(fs.readFileSync(bundlePath, 'utf8'))()
  ok(loaded !== null, '主包调用了 __ModuleLoader__.load')
  eq(loaded.id, '@tom2012/dsh-notes', '主包 id = 包名')

  // 先把编辑器重包挂到 window，加载器会优先用它（等价于浏览器里 <script> 已就绪后的状态）
  // eslint-disable-next-line no-new-func
  new Function(fs.readFileSync(editorPath, 'utf8'))()
  ok(typeof win.__DSH_NOTES_EDITOR_FACTORY__ === 'function', '编辑器重包挂了工厂')

  const platformRequire = (name) => {
    if (name === 'react') return React
    if (name === 'react/jsx-runtime') return jsxRuntime
    if (name === 'react-dom') return ReactDOM
    if (name === 'react-dom/client') return ReactDOMClient
    throw new Error(`bundle 请求了未声明的外置模块：${name}`)
  }

  const workspaceTitle = 'my-project'
  const rightTabTypes = []
  const mainCtx = {
    slots: {
      inject(name, fn) {
        fn()
      },
      register(options, component) {
        registrations.push({ options, component })
        return () => {}
      },
    },
    // 右侧栏标签类型注册表（宿主 ui-sidebar-right 提供）
    sidebarRightTabs: {
      register(definition) {
        rightTabTypes.push(definition)
        return () => {}
      },
    },
    inject(services, callback) {
      // 宿主里这两个服务是稍后就绪的；测试里同步给齐。
      if (services.includes('slots') && services.includes('sidebarRightTabs')) {
        callback({ slots: mainCtx.slots, sidebarRightTabs: mainCtx.sidebarRightTabs })
      }
    },
    effect(fn) {
      return fn()
    },
    layout: { selectPanel: () => {} },
    get(name) {
      if (name === 'uiSession') {
        return { current: { getSnapshot: () => ({ key: 's1' }), subscribe: () => () => {} } }
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
            getSnapshot: () => ({ items: [{ path: workspaceDir, title: workspaceTitle }] }),
            subscribe: () => () => {},
          },
        }
      }
      return undefined
    },
  }

  const plugin = loaded.factory(platformRequire)
  eq(plugin.inject, ['slots'], '插件 inject = [slots]')
  plugin.apply(mainCtx)

  const panelReg = registrations.find((item) => item.options.name === 'sidebar.panellist')
  const mainReg = registrations.find((item) => item.options.name === 'main')
  const menuReg = registrations.find((item) => item.options.name === 'sidebar.workspaces.session.menu.item')
  ok(panelReg === undefined, '左侧不再注册「全部笔记本」入口')

  const rightType = rightTabTypes.find((item) => item.kind === 'notes')
  ok(rightType !== undefined, '注册了右侧 notes 标签类型')
  ok(rightType && rightType.guide && rightType.guide.length === 1, '右侧 guide 有一个入口')
  const rightBody = registrations.find((item) => item.options.name === 'sidebar.right.pane.tab')
  ok(rightBody !== undefined && rightBody.options.key === 'dsh-notes', '右侧标签内容注册在类型 id 下')
  ok(mainReg !== undefined, '注册了 main')
  ok(menuReg !== undefined, '注册了会话菜单项')
  // 右侧 guide 的 title 也是 thunk：切语言要跟着变。
  win.document.documentElement.lang = 'zh-CN'
  eq(rightType.guide[0].title(), '全部笔记本', '中文 guide 标题正确')
  win.document.documentElement.lang = 'en'
  eq(rightType.guide[0].title(), 'All notebooks', '英文 guide 标题正确（切语言实时刷新）')
  win.document.documentElement.lang = 'zh-CN'
  eq(mainReg.options.key, 'notes', 'main 槽 key = notes')

  section('2b. 槽契约：label 只能是字符串或函数')
  for (const reg of registrations) {
    const label = reg.options.label
    const name = reg.options.name
    // keyed 槽（main）本来就不带 label
    if (label === undefined) continue
    // 宿主的 resolveSlotLabel 只有 `typeof label === 'function' ? label() : label`，
    // 对象会被原样交给 React 当子元素 → React #31，整条侧栏崩掉。
    ok(typeof label === 'string' || typeof label === 'function', `${name} 的 label 类型安全（非对象）`)
    const resolved = typeof label === 'function' ? label() : label
    ok(typeof resolved === 'string' && resolved.length > 0, `${name} 求值后是非空字符串`)
  }

  section('3. 渲染 app（有工作区、还没有笔记本）')
  const container = win.document.getElementById('root')
  const reactRoot = createRoot(container)
  const renderApp = () => reactRoot.render(mainReg.component({ ctx: mainCtx }))
  renderApp()

  await waitFor(() => container.querySelector('.n-app') !== null, 'app 挂载')
  await waitFor(() => container.textContent.includes(workspaceTitle), '工作区条显示当前工作区名')
  ok(container.textContent.includes('当前工作区'), '有「当前工作区」标签')
  await waitFor(() => container.textContent.includes('还没有笔记本'), '空态提示出现')
  ok(container.querySelector('.n-search input') !== null, '搜索框存在')

  section('4. 点「新建笔记本」')
  const createButton = container.querySelector('.n-wsbar-actions .n-btn')
  ok(createButton !== undefined, '工作区条有主按钮')
  eq(createButton.textContent.trim(), '新建笔记本', '无笔记本时文案是「新建笔记本」')
  createButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))

  await waitFor(() => store.tree().notebooks.length === 1, '磁盘上出现 1 个笔记本')
  const notebook = store.tree().notebooks[0]
  eq(notebook.title, workspaceTitle, '笔记本标题 = 工作区名')
  eq(notebook.parentId, null, '笔记本在根的第一层')
  ok(path.resolve(notebook.workspacePath || '') === fs.realpathSync(workspaceDir), '笔记本绑定到工作区路径')

  await waitFor(() => store.tree().pages.length === 1, '自动建了一页')
  await waitFor(() => container.textContent.includes('打开笔记本'), '按钮变成「打开笔记本」')

  section('5. BlockNote 编辑器挂载')
  await waitFor(() => container.querySelector('.n-blocknote') !== null, '编辑器容器出现', 12000)
  await waitFor(() => container.querySelector('.bn-editor') !== null, 'BlockNote 真正渲染出 .bn-editor', 12000)
  ok(container.querySelector('.bn-container') !== null, 'BlockNote 容器类在')
  await waitFor(() => container.textContent.includes('已保存'), '顶栏显示「已保存」')

  section('6. 树里有笔记本行与页面行')
  await waitFor(() => container.querySelectorAll('.n-row').length >= 2, '树里出现笔记本行与页面行')
  const titles = Array.from(container.querySelectorAll('.n-row-title')).map((node) => node.textContent)
  ok(titles.includes(workspaceTitle), `树里有笔记本标题（当前：${JSON.stringify(titles)}）`)

  section('7. 标题输入 → 自动保存')
  const titleInput = container.querySelector('.n-topbar .n-title-input')
  ok(titleInput !== null, '顶栏有标题输入')
  const setValue = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set
  setValue.call(titleInput, '周会记录')
  titleInput.dispatchEvent(new win.Event('input', { bubbles: true }))
  const savedTitle = await waitFor(
    () => store.tree().pages.some((row) => row.title === '周会记录'),
    '标题自动保存进索引',
  )
  if (!savedTitle) {
    console.log('DEBUG banner:', container.querySelector('.n-banner')?.textContent)
    console.log('DEBUG state:', container.querySelector('.n-save-state')?.textContent)
  }

  section('8. Markdown → blocks → BlockNote 渲染（真源往返）')
  const pageA = store.tree().pages.find((row) => row.title === '周会记录')
  ok(pageA !== undefined, '找到刚改名的页面')
  const detailA = await store.readPage(pageA.id)
  const richMd = [
    '## 议题',
    '',
    '- 甲',
    '- 乙',
    '',
    '- [x] 已完成',
    '- [ ] 待办',
    '',
    '```js',
    'console.log(1)',
    '```',
    '',
    '> 引用一段',
    '',
    '| a | b |',
    '| --- | --- |',
    '| 1 | 2 |',
  ].join('\n')
  const written = await store.savePage({
    id: pageA.id,
    title: '周会记录',
    blocks: markdownToBlocks(richMd),
    rev: detailA.rev,
    baseMtimeMs: detailA.mtimeMs,
    baseSize: detailA.size,
  })
  ok(written.page.rev === detailA.rev + 1, 'host 写入富文本成功')
  ok(written.page.blocks.length >= 8, `blocks 覆盖多种类型（${written.page.blocks.length}）`)
  ok(written.page.markdown.includes('## 议题'), '镜像由 host 生成')

  // 切到另一页再切回来，强制 surface 用服务端 blocks 重建
  const plusButton = container.querySelector('.n-row.is-notebook .n-row-actions .n-btn')
  ok(plusButton !== undefined, '笔记本行有「新建页面」按钮')
  plusButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await waitFor(() => store.tree().pages.length === 2, '再建一页（合计 2 页）')
  await waitFor(() => container.querySelectorAll('.n-row:not(.is-notebook)').length >= 2, '树里两个页面行')
  await sleep(200)

  const otherRow = Array.from(container.querySelectorAll('.n-row:not(.is-notebook)')).find(
    (row) => !row.classList.contains('is-active'),
  )
  if (!ok(otherRow !== undefined, '存在另一个页面行可切换')) return
  otherRow.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await sleep(300)
  const backRow = Array.from(container.querySelectorAll('.n-row:not(.is-notebook)')).find((row) =>
    row.textContent.includes('周会记录'),
  )
  if (!ok(backRow !== undefined, '能切回「周会记录」页')) return
  backRow.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))

  await waitFor(() => container.querySelector('.bn-editor') !== null, 'BlockNote 重新挂载', 12000)
  await waitFor(() => container.textContent.includes('议题'), '标题块渲染出来', 12000)
  ok(container.textContent.includes('甲') && container.textContent.includes('乙'), '列表项渲染出来')
  ok(container.textContent.includes('已完成') && container.textContent.includes('待办'), '任务列表渲染出来')
  ok(container.textContent.includes('console.log(1)'), '代码块渲染出来')
  ok(container.textContent.includes('引用一段'), '引用块渲染出来')
  await waitFor(() => container.querySelector('table') !== null, '表格渲染成 <table>', 12000)

  section('8b. 客户端 api 层：blocks 真的发出去（源码直测）')
  {
    // api.js 是纯 ESM（无 JSX），可以直接 import；这样能验证「编辑器 → 网络」这一段接线，
    // 而不必在 jsdom 里伪造 ProseMirror 的输入事件。
    const { api } = await import('../src/client/api.js')
    const detailB = await store.readPage(pageA.id)
    const newBlocks = detailB.blocks.concat([
      {
        id: 'b_paste0000001',
        type: 'paragraph',
        props: { textAlignment: 'left', backgroundColor: 'default', textColor: 'default' },
        content: [{ type: 'text', text: '粘贴进来的正文', styles: {} }],
        children: [],
      },
    ])
    const saved = await api.savePage({
      id: pageA.id,
      title: '周会记录',
      blocks: newBlocks,
      rev: detailB.rev,
      baseMtimeMs: detailB.mtimeMs,
      baseSize: detailB.size,
    })
    ok(saved.page.rev === detailB.rev + 1, 'api.savePage 带 blocks 保存成功')
    ok(saved.page.blocks.length === newBlocks.length, 'blocks 数量原样落库')
    ok(saved.page.markdown.includes('粘贴进来的正文'), 'Markdown 镜像同步更新（host 生成）')
    ok(store.search('粘贴进来的正文', 5).length > 0, '镜像内容可被搜索命中')

    const created2 = await api.createPage({ notebookId: notebook.id, title: '空页' })
    ok(Array.isArray(created2.blocks), 'api.createPage 返回 blocks 数组（空页）')

    const onlyTitle = await api.savePage({
      id: pageA.id,
      title: '周会记录（改名）',
      rev: saved.page.rev,
      baseMtimeMs: saved.page.mtimeMs,
      baseSize: saved.page.size,
    })
    ok(onlyTitle.page.blocks.length === newBlocks.length, '只改标题时 blocks 不被清空')
    eq(onlyTitle.page.title, '周会记录（改名）', '标题确实改了')
  }

  section('9. 搜索')
  const searchInput = container.querySelector('.n-search input')
  setValue.call(searchInput, '议题')
  searchInput.dispatchEvent(new win.Event('input', { bubbles: true }))
  await waitFor(() => container.querySelectorAll('.n-hit').length >= 1, '搜索出结果')

  // 清空搜索，回到树
  setValue.call(searchInput, '')
  searchInput.dispatchEvent(new win.Event('input', { bubbles: true }))
  await waitFor(() => container.querySelector('.n-row.is-notebook') !== null, '清空搜索后回到树视图')

  section('10. 会话 … 菜单 intent')
  const menuHost = win.document.getElementById('menu')
  const menuRoot = createRoot(menuHost)
  menuRoot.render(menuReg.component({ sessionId: 's1' }))
  await waitFor(() => menuHost.querySelector('.n-menu-item') !== null, '菜单行渲染出来')
  const menuButton = menuHost.querySelector('.n-menu-item')
  await waitFor(() => menuButton.textContent.includes('打开笔记本'), '菜单行文案是「打开笔记本」')

  const nbRow = container.querySelector('.n-row.is-notebook')
  nbRow.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await waitFor(() => container.querySelector('.n-row.is-notebook')?.getAttribute('aria-expanded') === 'false', '笔记本被折叠')
  menuButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true }))
  await waitFor(
    () => container.querySelector('.n-row.is-notebook')?.getAttribute('aria-expanded') === 'true',
    '点菜单项后笔记本重新展开（intent 生效）',
  )
  menuRoot.unmount()

  section('10b. 暗色跟随宿主')
  win.document.body.setAttribute('data-ds-dark-theme', '')
  await waitFor(
    () => win.document.querySelector('.bn-container[data-color-scheme="dark"]') !== null ||
      win.document.querySelector('[data-color-scheme="dark"]') !== null,
    '宿主切暗色后 BlockNote 跟着切',
    8000,
  )
  win.document.body.removeAttribute('data-ds-dark-theme')
  await waitFor(
    () => win.document.querySelector('[data-color-scheme="dark"]') === null,
    '切回亮色后 BlockNote 也回来',
    8000,
  )

  section('11. 语言切换')
  win.document.documentElement.lang = 'en'
  renderApp()
  await waitFor(() => container.textContent.includes('Current workspace'), '英文文案生效')
  win.document.documentElement.lang = 'zh-CN'

  section('12. 卸载干净')
  reactRoot.unmount()
  await sleep(80)
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
    setTimeout(() => process.exit(process.exitCode || 0), 80)
  })
