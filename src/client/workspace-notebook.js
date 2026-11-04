/**
 * 「按工作区建/开笔记本」的共用动作。
 *
 * 两个入口都要做同一件事，所以抽在这里：
 *   · 左侧会话行悬停按钮 / 会话「…」菜单 → ensureWorkspaceNotebook(ctx, sessionId)
 *   · 右侧「全部笔记本」面板的当前工作区按钮 → ensureWorkspaceNotebook(ctx, cwd)
 */

import { api } from './api.js'

/** 从会话 id 解析工作区 cwd；解析不到返回 null。 */
export function cwdOfSession(ctx, sessionId) {
  if (!ctx || typeof ctx.get !== 'function') return null
  try {
    const sessions = ctx.get('sessions')
    const list = sessions && sessions.list && sessions.list.getSnapshot()
    const summary = list && list.byId && list.byId[sessionId]
    const cwd = summary && summary.cwd
    return typeof cwd === 'string' && cwd ? cwd : null
  } catch {
    return null
  }
}

/** 工作区显示名：优先工作区行标题，否则路径末段。 */
export function labelOfWorkspace(ctx, cwd) {
  try {
    const workspaces = ctx && typeof ctx.get === 'function' ? ctx.get('workspaces') : null
    const snapshot = workspaces && workspaces.list && workspaces.list.getSnapshot()
    const items = (snapshot && snapshot.items) || []
    const hit = items.find((item) => item.path === cwd)
    if (hit && (hit.title || hit.displayTitle)) return hit.title || hit.displayTitle
  } catch {
    /* 只用路径兜底 */
  }
  const parts = String(cwd || '').split(/[\\/]/).filter(Boolean)
  return parts.length ? parts[parts.length - 1] : String(cwd || '')
}

/**
 * 取该工作区的笔记本；没有就以工作区名建一个（根层级）。
 * @returns {Promise<{notebook: object, created: boolean}>}
 */
export async function ensureWorkspaceNotebook(ctx, cwd) {
  const existing = await api.findWorkspace(cwd)
  if (existing) return { notebook: existing, created: false }
  const title = labelOfWorkspace(ctx, cwd)
  const notebook = await api.createNotebook({ title, workspacePath: cwd, workspaceLabel: title })
  return { notebook, created: true }
}

/** 切到主面板的笔记页。 */
export function openNotesPanel(ctx, key = 'notes') {
  try {
    const layout = ctx && typeof ctx.get === 'function' ? ctx.get('layout') : null
    if (layout && typeof layout.selectPanel === 'function') {
      layout.selectPanel(key)
      return
    }
    console.warn('[dsh-notes] layout 服务不可用，无法切主面板')
  } catch (err) {
    console.warn('[dsh-notes] selectPanel(notes) 失败：', (err && err.message) || err)
  }
}
