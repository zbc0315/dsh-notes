'use strict'

/**
 * @tom2012/dsh-notes — Host half
 *
 * 一个 NotesStore 实例同时喂三张嘴：
 *   · 同源路由 /-/notes/*（web UI，复用宿主鉴权）
 *   · Agent 工具 notes_*（ctx.tools.register）
 *   · 未来的 CLI / 脚本
 * 因此 UI 与 Agent 对同一份数据永远一致 —— 这是设计的核心约束（R5）。
 *
 * 数据根默认 ~/.dsh/notes，Markdown 为真源，index.json 只是可重建的缓存。
 */

const os = require('node:os')
const path = require('node:path')

const { NotesStore } = require('./store')
const { registerRoutes } = require('./routes')
const { registerTools } = require('./tools')

const name = 'dsh-notes'

/**
 * 注入：webServer 提供同源路由，connection 提供信任栅栏，
 * tools 提供 Agent 工具注册表。
 */
const inject = ['webServer', 'connection', 'tools']

const DEFAULTS = {
  rootDir: path.join(os.homedir(), '.dsh', 'notes'),
  maxPageBytes: 2 * 1024 * 1024,
  maxAssetBytes: 16 * 1024 * 1024,
  /** UI 侧自动保存的抖动间隔（毫秒），由客户端读取。 */
  autosaveMs: 800,
  /** 会话行入口（M6/P1），默认只开菜单项。 */
  enableSessionRowEntry: true,
}

/**
 * 插件入口。
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {object} [config]
 */
async function apply(ctx, config) {
  const options = Object.assign({}, DEFAULTS, config || {})
  const logger = typeof ctx.logger === 'function' ? ctx.logger(name) : null
  const log = (msg) => (logger && logger.info ? logger.info(msg) : console.log(`[dsh-notes] ${msg}`))
  const warn = (msg) => (logger && logger.warn ? logger.warn(msg) : console.warn(`[dsh-notes] ${msg}`))

  const store = new NotesStore({
    rootDir: options.rootDir,
    maxPageBytes: options.maxPageBytes,
    maxAssetBytes: options.maxAssetBytes,
    // 镜像自愈（.md 比 .json 旧就重写、被手改就备份）失败时走这里
    warn,
  })

  try {
    await store.init()
    const tree = store.tree()
    log(`笔记本 ${tree.notebooks.length} 个、页面 ${tree.pages.length} 篇（${store.rootDir}）`)
  } catch (err) {
    // 存储根建不起来时不要让整个 profile 起不来：路由与工具都退化为明确的 503/报错。
    warn(`存储层初始化失败：${(err && err.message) || err}`)
  }

  registerRoutes(ctx, store, {
    warn,
    maxUploadBytes: options.maxAssetBytes,
  })

  if (ctx.tools && typeof ctx.tools.register === 'function') {
    registerTools(ctx, store, { warn, autosaveMs: options.autosaveMs })
  } else {
    warn('tools 服务不可用，notes_* 工具未注册')
  }

  // 让同进程的其它插件能拿到 store（例如将来的 CLI）。纯可选：
  // 任何一步形状不对都静默跳过，绝不让它影响插件启动。
  ctx.effect(() => {
    try {
      if (typeof ctx.set === 'function') ctx.set('notesStore', store)
    } catch {
      /* 宿主上下文不支持就跳过 */
    }
    return () => {
      try {
        if (typeof ctx.set === 'function') ctx.set('notesStore', undefined)
      } catch {
        /* 同上 */
      }
    }
  }, 'dsh-notes: notes store service')
}

module.exports = { name, inject, apply, DEFAULTS }
