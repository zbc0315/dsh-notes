/**
 * 懒加载 BlockNote 重包。
 *
 * 流程：
 *   1. 注入 `<link rel=stylesheet href=/-/notes/client/editor.css>`（一次）
 *   2. 注入 `<script src=/-/notes/client/editor.js>`（一次）；脚本只挂工厂，不执行
 *   3. 用**本 bundle 已 require 到的** react / react-dom 调用工厂 → 拿到
 *      { BlockNoteView, useCreateBlockNote, ... }
 *
 * 这样主 bundle 不需要内联 1.4 MB，React 也只有一个实例。
 */

export const CLIENT_ASSET_PREFIX = '/-/notes/client'

const REACT_MODULES = {}

let pending = null

/**
 * 注册可复用的 platform 模块（由 index.js 在 apply 时注入本 bundle 已加载的实例）。
 * @param {Record<string, unknown>} modules - { react, 'react/jsx-runtime', 'react-dom', 'react-dom/client' }
 */
export function providePlatformModules(modules) {
  Object.assign(REACT_MODULES, modules || {})
}

function makeRequire() {
  return (specifier) => {
    const hit = REACT_MODULES[specifier]
    if (hit !== undefined) return hit
    throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${specifier}`)
  }
}

/** 版本串用 asset 的 mtime，改了就换 URL，避免浏览器缓存旧包。 */
function withVersion(url) {
  return url
}

/**
 * 加载编辑器重包。
 * @returns {Promise<object>} { BlockNoteView, useCreateBlockNote, BlockNoteSchema, defaultBlockSpecs, zhLocale, enLocale }
 */
export function loadEditorRuntime() {
  if (pending) return pending

  pending = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('dsh-notes: 没有 document，无法加载编辑器'))
      return
    }

    const cssId = 'dsh-notes-editor-css'
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link')
      link.id = cssId
      link.rel = 'stylesheet'
      link.href = `${CLIENT_ASSET_PREFIX}/editor.css`
      document.head.append(link)
    }

    const globalKey = '__DSH_NOTES_EDITOR_FACTORY__'
    const existing = window[globalKey]
    if (typeof existing === 'function') {
      try {
        resolve(existing(makeRequire()))
      } catch (error) {
        reject(normalizeError(error))
      }
      return
    }

    const script = document.createElement('script')
    script.src = `${CLIENT_ASSET_PREFIX}/editor.js`
    script.async = true
    script.onload = () => {
      const factory = window[globalKey]
      if (typeof factory !== 'function') {
        reject(new Error('dsh-notes: 编辑器模块加载后没有注册工厂'))
        return
      }
      try {
        resolve(factory(makeRequire()))
      } catch (error) {
        reject(normalizeError(error))
      }
    }
    script.onerror = () => reject(new Error('dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）'))
    document.head.append(script)
  })

  // 失败后允许重试（宿主重启过一次是很常见的）
  pending.catch(() => {
    pending = null
  })

  return pending
}

function normalizeError(error) {
  return error instanceof Error ? error : new Error(String(error))
}
