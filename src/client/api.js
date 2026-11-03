/**
 * 与 Host 的 HTTP 契约（见 docs/DESIGN.md §5.2 与 docs/STORE-CONTRACT.md）。
 *
 * 全部同源 fetch，不带 sessionId —— 笔记本是全局的（~/.dsh/notes），
 * 工作区只是笔记本上的一个绑定字段。鉴权复用宿主网关，浏览器侧无需处理。
 */

const PREFIX = '/-/notes'

function hint(status) {
  if (status === 404) return '接口不存在（宿主插件可能未加载）'
  if (status === 403) return '没有权限（宿主鉴权拒绝了请求）'
  if (status === 409) return '内容已在别处修改'
  if (status === 413) return '内容过大'
  if (status === 503) return '宿主服务不可用，请重启 dsh web'
  if (status >= 500) return '宿主内部错误'
  return `HTTP ${status}`
}

async function readJson(res) {
  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  if (!res.ok || (body && body.ok === false)) {
    const error = new Error((body && body.error) || hint(res.status))
    error.status = res.status
    if (body && body.current !== undefined) error.current = body.current
    throw error
  }
  return body || {}
}

function qs(params) {
  const parts = []
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === '') continue
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

export const api = {
  base: PREFIX,

  async status() {
    return readJson(await fetch(`${PREFIX}/status`, { credentials: 'same-origin' }))
  },

  async tree() {
    return readJson(await fetch(`${PREFIX}/tree`, { credentials: 'same-origin' }))
  },

  async readPage(id) {
    const body = await readJson(await fetch(`${PREFIX}/page${qs({ id })}`, { credentials: 'same-origin' }))
    return body.page
  },

  /**
   * 保存页面。
   * `blocks` 省略 = 只改标题，不动正文（Markdown 镜像由 host 从 blocks 生成）。
   */
  async savePage({ id, title, blocks, rev, baseMtimeMs, baseSize }) {
    const body = { title, rev, baseMtimeMs, baseSize }
    if (Array.isArray(blocks)) body.blocks = blocks
    return readJson(
      await fetch(`${PREFIX}/page${qs({ id })}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )
  },

  async createPage({ notebookId, title, blocks, markdown }) {
    const payload = { notebookId, title }
    if (Array.isArray(blocks)) payload.blocks = blocks
    if (typeof markdown === 'string') payload.markdown = markdown
    const body = await readJson(
      await fetch(`${PREFIX}/page`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    )
    return body.page
  },

  async deletePage(id) {
    return readJson(await fetch(`${PREFIX}/page${qs({ id })}`, { method: 'DELETE', credentials: 'same-origin' }))
  },

  async createNotebook({ parentId = null, title, workspacePath = null, workspaceLabel = null }) {
    const body = await readJson(
      await fetch(`${PREFIX}/notebook`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, title, workspacePath, workspaceLabel }),
      }),
    )
    return body.notebook
  },

  async updateNotebook(id, patch) {
    const body = await readJson(
      await fetch(`${PREFIX}/notebook${qs({ id })}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch || {}),
      }),
    )
    return body.notebook
  },

  async deleteNotebook(id) {
    return readJson(await fetch(`${PREFIX}/notebook${qs({ id })}`, { method: 'DELETE', credentials: 'same-origin' }))
  },

  async findWorkspace(path) {
    const body = await readJson(
      await fetch(`${PREFIX}/workspace${qs({ path })}`, { credentials: 'same-origin' }),
    )
    return body.notebook
  },

  async bindWorkspace({ workspacePath, title, workspaceLabel }) {
    return readJson(
      await fetch(`${PREFIX}/workspace`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspacePath, title, workspaceLabel }),
      }),
    )
  },

  async search(query, limit = 30) {
    const body = await readJson(
      await fetch(`${PREFIX}/search${qs({ q: query, limit })}`, { credentials: 'same-origin' }),
    )
    return body.results || []
  },

  /** 上传图片：原始字节 + 扩展名，返回 { sha, ext, size, url }。 */
  async uploadAsset(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const res = await fetch(`${PREFIX}/asset`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-notes-ext': ext,
      },
      body: file,
    })
    return readJson(res)
  },

  exportUrl(id) {
    return `${PREFIX}/export${qs({ id })}`
  },
}
