/**
 * 把 src/client/index.js（ESM + JSX）打包成 client/bundle.js。
 *
 * DSH 的 web client 加载协议：`window.__ModuleLoader__.load({ id, factory })`。
 * factory 收到一个 `require`，其静态模块表里有 react / react/jsx-runtime /
 * react-dom / react-dom/client 等（见 dsh-web-frontend 的静态表）。
 *
 * 所以本插件除这些 platform 模块外把 @tiptap/*、prosemirror、@tiptap/markdown
 * 全部打进来 —— 与宿主零版本耦合，卸载即干净。
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

const entry = join(pkgRoot, 'src', 'client', 'index.js')
const outfile = join(pkgRoot, 'client', 'bundle.js')

/** 宿主 __ModuleLoader__ 提供的 platform 模块（不打包，运行时 require）。 */
const EXTERNAL = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client']

const args = new Set(process.argv.slice(2))
const minify = !args.has('--no-minify')
const watch = args.has('--watch')

/** 把 esbuild 产出的 CJS 正文塞进 ModuleLoader 工厂。 */
function wrap(code) {
  const banner = `/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
`
  const footer = `
    return module.exports
  }
})
`
  const indented = code
    .split('\n')
    .map((line) => (line.length === 0 ? line : '    ' + line))
    .join('\n')
  return banner + indented + footer
}

/** 一次完整构建：打包 → 包一层 → 落盘。 */
async function run() {
  const started = Date.now()
  const result = await build({
    entryPoints: [entry],
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
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    logLevel: 'warning',
  })
  const code = result.outputFiles[0].text
  mkdirSync(dirname(outfile), { recursive: true })
  writeFileSync(outfile, wrap(code), 'utf8')
  const kb = (Buffer.byteLength(code) / 1024).toFixed(1)
  console.log(`built ${outfile} — ${kb} KB ${minify ? '(minified)' : '(readable)'} in ${Date.now() - started} ms`)
}

if (watch) {
  const ctx = await context({
    entryPoints: [entry],
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
    plugins: [
      {
        name: 'module-loader-wrap',
        setup(b) {
          b.onEnd(async (res) => {
            if (res.errors.length > 0) return
            const out = res.outputFiles && res.outputFiles[0]
            if (!out) return
            mkdirSync(dirname(outfile), { recursive: true })
            writeFileSync(outfile, wrap(out.text), 'utf8')
            console.log(`rebuilt ${outfile} — ${(Buffer.byteLength(out.text) / 1024).toFixed(1)} KB`)
          })
        },
      },
    ],
  })
  await ctx.watch()
  console.log('watching src/client …')
} else {
  await run()
}
