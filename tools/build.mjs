/**
 * 构建三样东西：
 *
 *  1. `client/bundle.js`  主包 —— src/client/index.js，包成 `window.__ModuleLoader__.load()`
 *  2. `client/editor.js`  编辑器重包 —— src/client/blocknote/entry.js，包成
 *     `window.__DSH_NOTES_EDITOR_FACTORY__ = (require) => …`（面板打开才加载，省 1.4 MB 首屏）
 *  3. `client/editor.css` BlockNote + Mantine 样式与 --dsw-* 令牌映射
 *
 * DSH 的 web client 加载协议：`__ModuleLoader__.load({ id, factory })`，factory 拿到一个
 * `require`，其静态模块表里有 react / react/jsx-runtime / react-dom / react-dom/client。
 * 主包与重包都只外置这些 platform 模块，其它（BlockNote、ProseMirror、Mantine）全部内联。
 *
 * 运行：npm run build
 *   --no-minify   保留可读产物（排错用）
 *   --watch       改动即重建
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, context } from 'esbuild'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(here, '..')
const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'))

const clientDir = join(pkgRoot, 'client')
const mainEntry = join(pkgRoot, 'src', 'client', 'index.js')
const editorEntry = join(pkgRoot, 'src', 'client', 'blocknote', 'entry.js')
const styleEntry = join(pkgRoot, 'src', 'client', 'blocknote', 'style.css')

const mainOut = join(clientDir, 'bundle.js')
const editorOut = join(clientDir, 'editor.js')
const styleOut = join(clientDir, 'editor.css')

/** 宿主 __ModuleLoader__ / 我们自己的 factory 提供的 platform 模块（不打包，运行时注入）。 */
const EXTERNAL = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client']

const args = new Set(process.argv.slice(2))
const minify = !args.has('--no-minify')
const watch = args.has('--watch')

/* ------------------------------------------------------------------ *
 * 包装
 * ------------------------------------------------------------------ */

function indent(code) {
  return code
    .split('\n')
    .map((line) => (line.length === 0 ? line : '    ' + line))
    .join('\n')
}

/** 主包：ModuleLoader 协议。 */
function wrapMain(code) {
  return `/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
${indent(code)}
    return module.exports
  }
})
`
}

/** 编辑器重包：只挂工厂，由主包带着 react 实例来调用。 */
function wrapEditor(code) {
  return `/* 由 tools/build.mjs 从 src/client/blocknote/entry.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__DSH_NOTES_EDITOR_FACTORY__ = (require) => {
  var module = { exports: {} }
  var exports = module.exports
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
${indent(code)}
  return module.exports
}
`
}

/* ------------------------------------------------------------------ *
 * 构建
 * ------------------------------------------------------------------ */

const baseOptions = {
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  external: EXTERNAL,
  minify,
  legalComments: 'none',
  charset: 'utf8',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
}

async function buildMain() {
  const result = await build({ ...baseOptions, entryPoints: [mainEntry] })
  mkdirSync(clientDir, { recursive: true })
  writeFileSync(mainOut, wrapMain(result.outputFiles[0].text), 'utf8')
  return result.outputFiles[0].text.length
}

async function buildEditor() {
  const result = await build({ ...baseOptions, entryPoints: [editorEntry] })
  mkdirSync(clientDir, { recursive: true })
  writeFileSync(editorOut, wrapEditor(result.outputFiles[0].text), 'utf8')
  return result.outputFiles[0].text.length
}

async function buildStyle() {
  const result = await build({
    entryPoints: [styleEntry],
    bundle: true,
    write: false,
    minify,
    charset: 'utf8',
    logLevel: 'warning',
  })
  // write:false + css 入口时 esbuild 只产出 <stdout>，没有 .css 后缀，所以取第一个文件
  const css = result.outputFiles[0]
  if (!css) throw new Error('样式构建没有产出 css')
  writeFileSync(styleOut, css.text, 'utf8')
  return css.text.length
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function run() {
  const started = Date.now()
  const [mainSize, editorSize, styleSize] = await Promise.all([buildMain(), buildEditor(), buildStyle()])
  console.log(
    `built client/bundle.js (${kb(mainSize)}) · client/editor.js (${kb(editorSize)}) · client/editor.css (${kb(
      styleSize,
    )}) ${minify ? '[minified]' : '[readable]'} in ${Date.now() - started} ms`,
  )
}

if (watch) {
  const rebuild = async () => {
    try {
      await run()
    } catch (error) {
      console.error(error)
    }
  }
  const ctxMain = await context({
    ...baseOptions,
    entryPoints: [mainEntry],
    write: false,
    plugins: [
      {
        name: 'wrap-main',
        setup(builder) {
          builder.onEnd(async (res) => {
            if (res.errors.length || !res.outputFiles?.[0]) return
            writeFileSync(mainOut, wrapMain(res.outputFiles[0].text), 'utf8')
            console.log(`rebuilt client/bundle.js (${kb(res.outputFiles[0].text.length)})`)
          })
        },
      },
    ],
  })
  await ctxMain.watch()
  console.log('watching src/client …（编辑器重包与样式改动请重跑 npm run build）')
} else {
  await run()
}
