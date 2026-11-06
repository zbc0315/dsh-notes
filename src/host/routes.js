'use strict'

/**
 * @tom2012/dsh-notes — Host 路由半
 *
 * 全部走同源 `/-/notes/*`（ctx.webServer 的 prefix 路由），复用 dsh-access-gate
 * 的密码门和 connection 信任栅栏，不新开端口、不引入独立服务器。
 *
 * 这一层只做三件事：解析请求 → 调 NotesStore → 序列化结果。
 * 任何业务规则都在 store 里，UI 与 Agent 工具因此永远看到同一份数据。
 */

const fsp = require('node:fs/promises')
const fssync = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const API_PREFIX = '/-/notes'

/** 允许通过 /-/notes/client/<name> 分发的静态产物（白名单，禁止目录穿越）。 */
const CLIENT_ASSETS = {
  'editor.js': 'text/javascript; charset=utf-8',
  'editor.css': 'text/css; charset=utf-8',
}

/** 包根目录（src/host/routes.js → ../../）。 */
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..')

/** 允许上传的图片扩展名 → Content-Type。 */
const ASSET_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
}

/* ------------------------------------------------------------------ *
 * 小工具
 * ------------------------------------------------------------------ */

/** 写 JSON 响应（不抛错）。 */
function sendJson(res, status, payload) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8')
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': String(body.length),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

/** sendJson 的兜底版本：连接已断开/响应已写过时不再抛错。 */
function sendJsonSafe(res, status, payload) {
  try {
    if (res.headersSent) {
      res.end()
      return
    }
    sendJson(res, status, payload)
  } catch {
    /* 连接已断 */
  }
}

/**
 * 信任栅栏：与其它 host 路由一致，交给 connection 服务做 Host/Origin 检查。
 * 栅栏自身也可能抛错（宿主服务在插件热重载后处于半失效状态时见过），
 * 那种情况由调用方回 503，避免 webserver 把异常兜底成空 400。
 */
function connectionRejection(ctx, req) {
  const connection = ctx.connection
  if (!connection || typeof connection.requestRejection !== 'function') return undefined
  return connection.requestRejection(req)
}

/** 把 requestRejection 的返回值归一成 HTTP 状态码；null = 放行。 */
function rejectionStatus(rejection) {
  if (typeof rejection === 'number' && rejection > 0) return rejection
  if (rejection === undefined || rejection === null || rejection === false) return null
  return 403
}

/** 读 JSON 请求体。 */
function readJsonBody(req, limit = 4 << 20) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(Object.assign(new Error('请求体过大'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (!chunks.length) return resolve({})
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(Object.assign(new Error('JSON 解析失败'), { status: 400 }))
      }
    })
    req.on('error', reject)
  })
}

/** 读原始字节（图片上传用）。 */
function readBinaryBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(Object.assign(new Error('文件过大'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

/** 从 Content-Type 或显式头推断图片扩展名。 */
function guessAssetExt(req) {
  const explicit = String(req.headers['x-notes-ext'] || '').toLowerCase().replace(/^\./, '')
  if (explicit && ASSET_TYPES[explicit]) return explicit
  const type = String(req.headers['content-type'] || '').toLowerCase()
  if (type.startsWith('image/')) {
    const sub = type.slice('image/'.length).split(';')[0].trim()
    if (sub === 'svg+xml') return 'svg'
    if (sub === 'pjpeg') return 'jpg'
    if (ASSET_TYPES[sub]) return sub
  }
  return null
}

/** 数字参数解析（缺省 → undefined）。 */
function num(value) {
  if (value === undefined || value === null || value === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

/* ------------------------------------------------------------------ *
 * 注册
 * ------------------------------------------------------------------ */

/**
 * 注册 /-/notes/* 路由。
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx - 带 webServer / connection 的宿主上下文
 * @param {object} store - NotesStore 实例（已 init）
 * @param {object} [options]
 * @param {Function} [options.warn] - 日志函数
 * @returns {void}
 */
function registerRoutes(ctx, store, options = {}) {
  const warn = typeof options.warn === 'function' ? options.warn : (msg) => console.warn(`[dsh-notes] ${msg}`)
  const maxUploadBytes = options.maxUploadBytes || 16 * 1024 * 1024
  const webServer = ctx.webServer

  if (!webServer || typeof webServer.register !== 'function') {
    warn('webServer 不可用，笔记本 API 未注册')
    return
  }

  ctx.effect(() => {
    // 必须把 register 返回的 disposer 交回 effect：插件 install / 热重载时会重新 apply，
    // 旧路由若留在宿主上，会继续指向已释放的 ctx —— 每次请求在 ctx.connection 处抛错，
    // 客户端只看到 503「宿主连接服务不可用」；而重复注册同路径会直接抛 duplicate。
    return webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler: async (req, res) => {
        let rejection
        try {
          rejection = connectionRejection(ctx, req)
        } catch (err) {
          warn(`信任栅栏不可用：${(err && err.message) || err}`)
          return sendJsonSafe(res, 503, {
            ok: false,
            error: '宿主连接服务不可用：请重启 dsh web 后刷新页面',
          })
        }
        const status = rejectionStatus(rejection)
        if (status !== null) {
          try {
            res.statusCode = status
            res.end()
          } catch {
            /* 连接已断 */
          }
          return
        }

        try {
          const url = new URL(req.url || '/', 'http://dsh.local')
          const rest = url.pathname.startsWith(API_PREFIX) ? url.pathname.slice(API_PREFIX.length) : null
          if (rest === null) return sendJson(res, 404, { ok: false, error: 'not found' })

          const method = req.method || 'GET'
          const q = url.searchParams

          /* ---------- 状态 ---------- */
          if (method === 'GET' && (rest === '' || rest === '/' || rest === '/status')) {
            return sendJson(res, 200, {
              ok: true,
              rootDir: store.rootDir,
              notebooks: store.tree().notebooks.length,
              pages: store.tree().pages.length,
            })
          }

          /* ---------- 树 ---------- */
          if (method === 'GET' && rest === '/tree') {
            return sendJson(res, 200, { ok: true, ...store.tree() })
          }

          /* ---------- 页面 ---------- */
          if (method === 'GET' && rest === '/page') {
            const id = q.get('id')
            if (!id) return sendJson(res, 400, { ok: false, error: '缺少 id' })
            return sendJson(res, 200, { ok: true, page: await store.readPage(id) })
          }

          if (method === 'PUT' && rest === '/page') {
            const id = q.get('id')
            if (!id) return sendJson(res, 400, { ok: false, error: '缺少 id' })
            const body = await readJsonBody(req)
            const result = await store.savePage({
              id,
              title: body.title,
              // 不传 blocks（undefined）= 只改标题、不动正文；传了才覆盖。
              // Markdown 镜像由 store 从 blocks 生成，客户端不发 markdown。
              blocks: Array.isArray(body.blocks) ? body.blocks : undefined,
              rev: num(body.rev),
              baseMtimeMs: num(body.baseMtimeMs),
              baseSize: num(body.baseSize),
            })
            return sendJson(res, 200, { ok: true, ...result })
          }

          if (method === 'POST' && rest === '/page') {
            const body = await readJsonBody(req)
            if (!body.notebookId) return sendJson(res, 400, { ok: false, error: '缺少 notebookId' })
            const page = await store.createPage({
              notebookId: body.notebookId,
              title: body.title,
              blocks: Array.isArray(body.blocks) ? body.blocks : undefined,
              markdown: typeof body.markdown === 'string' ? body.markdown : undefined,
              order: num(body.order),
            })
            return sendJson(res, 200, { ok: true, page })
          }

          if (method === 'DELETE' && rest === '/page') {
            const id = q.get('id')
            if (!id) return sendJson(res, 400, { ok: false, error: '缺少 id' })
            return sendJson(res, 200, { ok: true, ...(await store.deletePage(id)) })
          }

          if (method === 'POST' && rest === '/page/reorder') {
            const body = await readJsonBody(req)
            if (!body.notebookId || !Array.isArray(body.ids)) {
              return sendJson(res, 400, { ok: false, error: '缺少 notebookId / ids' })
            }
            const pages = await store.reorderPages({ notebookId: body.notebookId, ids: body.ids })
            return sendJson(res, 200, { ok: true, pages })
          }

          /* ---------- 笔记本 ---------- */
          if (method === 'POST' && rest === '/notebook') {
            const body = await readJsonBody(req)
            const notebook = await store.createNotebook({
              parentId: body.parentId ?? null,
              title: body.title,
              workspacePath: body.workspacePath ?? null,
              workspaceLabel: body.workspaceLabel ?? null,
              icon: body.icon ?? null,
            })
            return sendJson(res, 200, { ok: true, notebook })
          }

          if ((method === 'PATCH' || method === 'PUT') && rest === '/notebook') {
            const id = q.get('id')
            if (!id) return sendJson(res, 400, { ok: false, error: '缺少 id' })
            const body = await readJsonBody(req)
            const notebook = await store.updateNotebook({
              id,
              title: body.title,
              parentId: body.parentId,
              order: num(body.order),
              icon: body.icon,
              workspacePath: body.workspacePath,
              workspaceLabel: body.workspaceLabel,
            })
            return sendJson(res, 200, { ok: true, notebook })
          }

          if (method === 'DELETE' && rest === '/notebook') {
            const id = q.get('id')
            if (!id) return sendJson(res, 400, { ok: false, error: '缺少 id' })
            return sendJson(res, 200, { ok: true, ...(await store.deleteNotebook(id)) })
          }

          if (method === 'POST' && rest === '/notebook/reorder') {
            const body = await readJsonBody(req)
            if (!Array.isArray(body.ids)) return sendJson(res, 400, { ok: false, error: '缺少 ids' })
            const notebooks = await store.reorderNotebooks({
              parentId: body.parentId ?? null,
              ids: body.ids,
            })
            return sendJson(res, 200, { ok: true, notebooks })
          }

          /* ---------- 工作区绑定 ---------- */
          if (method === 'GET' && rest === '/workspace') {
            const p = q.get('path')
            if (!p) return sendJson(res, 400, { ok: false, error: '缺少 path' })
            return sendJson(res, 200, { ok: true, notebook: store.findByWorkspace(p) })
          }

          if (method === 'POST' && rest === '/workspace') {
            const body = await readJsonBody(req)
            if (!body.workspacePath) return sendJson(res, 400, { ok: false, error: '缺少 workspacePath' })
            const before = store.findByWorkspace(body.workspacePath)
            const notebook = await store.bindWorkspace({
              workspacePath: body.workspacePath,
              title: body.title,
              workspaceLabel: body.workspaceLabel,
            })
            return sendJson(res, 200, { ok: true, notebook, created: before === null })
          }

          /* ---------- 搜索 ---------- */
          if (method === 'GET' && rest === '/search') {
            const query = q.get('q') || ''
            const results = store.search(query, num(q.get('limit')) || 50)
            return sendJson(res, 200, { ok: true, results })
          }

          /* ---------- 附件 ---------- */
          if (method === 'POST' && rest === '/asset') {
            const ext = guessAssetExt(req)
            if (!ext) return sendJson(res, 400, { ok: false, error: '不支持的图片类型' })
            const buffer = await readBinaryBody(req, maxUploadBytes)
            const asset = await store.putAsset(buffer, { ext, mime: ASSET_TYPES[ext] })
            return sendJson(res, 200, { ok: true, ...asset, url: store.assetUrl(asset.sha, asset.ext) })
          }

          if ((method === 'GET' || method === 'HEAD') && rest === '/asset') {
            const sha = q.get('sha')
            const ext = String(q.get('ext') || '').toLowerCase()
            if (!sha || !ext) return sendJson(res, 400, { ok: false, error: '缺少 sha / ext' })
            const abs = store.assetPath(sha, ext)
            let buf
            try {
              buf = await fsp.readFile(abs)
            } catch {
              return sendJson(res, 404, { ok: false, error: '附件不存在' })
            }
            res.writeHead(200, {
              'Content-Type': ASSET_TYPES[ext] || 'application/octet-stream',
              'Content-Length': String(buf.length),
              // 内容寻址：sha 变了 URL 就变，可以长缓存。
              'Cache-Control': 'private, max-age=31536000, immutable',
              'X-Content-Type-Options': 'nosniff',
              // 附件是同源内容：禁止其中的脚本/插件执行（历史遗留的 svg 也不会变成存储型 XSS）。
              'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox",
            })
            return method === 'HEAD' ? res.end() : res.end(buf)
          }

          /* ---------- 客户端静态产物（编辑器重包，按需加载） ---------- */
          if ((method === 'GET' || method === 'HEAD') && rest.startsWith('/client/')) {
            const name = rest.slice('/client/'.length)
            const type = CLIENT_ASSETS[name]
            if (!type) return sendJson(res, 404, { ok: false, error: 'not found' })
            const abs = path.join(PACKAGE_ROOT, 'client', name)
            let stat
            try {
              stat = fssync.statSync(abs)
            } catch {
              return sendJson(res, 404, {
                ok: false,
                error: '客户端产物不存在，请先在插件目录跑 npm run build',
              })
            }
            const etag = `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`
            if (req.headers['if-none-match'] === etag) {
              res.writeHead(304, { ETag: etag, 'Cache-Control': 'no-cache' })
              return res.end()
            }
            const buf = await fsp.readFile(abs)
            res.writeHead(200, {
              'Content-Type': type,
              'Content-Length': String(buf.length),
              ETag: etag,
              'Cache-Control': 'no-cache',
              'X-Content-Type-Options': 'nosniff',
            })
            return method === 'HEAD' ? res.end() : res.end(buf)
          }

          /* ---------- 导出 ---------- */
          if (method === 'GET' && rest === '/export') {
            const id = q.get('id')
            if (!id) return sendJson(res, 400, { ok: false, error: '缺少 id' })
            const page = await store.readPage(id)
            const name = `${(page.title || 'note').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80)}.md`
            const body = Buffer.from(page.markdown, 'utf8')
            res.writeHead(200, {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Content-Length': String(body.length),
              'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
              'Cache-Control': 'no-store',
            })
            return res.end(body)
          }

          /* ---------- 回收站 ---------- */
          if (method === 'GET' && rest === '/trash') {
            return sendJson(res, 200, { ok: true, entries: await store.listTrash() })
          }

          return sendJson(res, 404, { ok: false, error: `未知的接口: ${rest}` })
        } catch (err) {
          const status = (err && err.status) || 500
          const payload = { ok: false, error: String((err && err.message) || err) }
          // 409 时把当前内容带回去，UI 才能直接给「覆盖 / 放弃」的选择。
          if (err && err.payload !== undefined) payload.current = err.payload
          if (res.headersSent) {
            try {
              res.end()
            } catch {
              /* 已断开的流 */
            }
          } else {
            sendJsonSafe(res, status, payload)
          }
        }
      },
    })
  }, 'dsh-notes: notes api')
}

module.exports = { API_PREFIX, ASSET_TYPES, registerRoutes }
