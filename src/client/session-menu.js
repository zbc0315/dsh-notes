/**
 * 「会话 … 菜单」里的笔记本入口（DESIGN.md 方案 C 的 P1 部分）。
 *
 * 宿主把它渲染进 sidebar.workspaces.session.menu.item，传进来的 props 是
 * `{ sessionId, displayTitle }`。点一下就对**该会话所属工作区**建/开笔记本，
 * 然后切到笔记面板 —— 不用先切面板再选工作区。
 *
 * 菜单行自己画（不 import 宿主 ui-primitives），样式贴 --dsw-* 令牌。
 */

import { useEffect, useState } from 'react'

import { api } from './api.js'
import { dict, currentLang, onLangChange } from './i18n.js'
import { NotebookIcon } from './icons.js'
import { requestOpen } from './intent.js'

/** 从会话 id 解析工作区 cwd；解析不到返回 null。 */
function cwdOfSession(ctx, sessionId) {
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
function labelOfWorkspace(ctx, cwd) {
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
 * 会话菜单行。
 *
 * @param {object} props
 * @param {import('@deepseek-ai/cordis').Context} props.ctx
 */
export function SessionNotesMenuItem(props) {
  const { ctx, sessionId } = props || {}
  const [lang, setLang] = useState(currentLang())
  const [bound, setBound] = useState(null)
  const [cwd, setCwd] = useState(() => cwdOfSession(ctx, sessionId))
  const [busy, setBusy] = useState(false)

  useEffect(() => onLangChange(setLang), [])

  // 会话行可能在面板之后才拿到 cwd（列表还在加载），订阅一次即可。
  useEffect(() => {
    if (cwd) return undefined
    let stop = null
    try {
      const sessions = ctx && typeof ctx.get === 'function' ? ctx.get('sessions') : null
      const list = sessions && sessions.list
      if (list && typeof list.subscribe === 'function') {
        stop = list.subscribe(() => {
          const next = cwdOfSession(ctx, sessionId)
          if (next) setCwd(next)
        })
      }
    } catch {
      /* 拿不到就保持禁用 */
    }
    const timer = setTimeout(() => setCwd(cwdOfSession(ctx, sessionId)), 200)
    return () => {
      clearTimeout(timer)
      if (typeof stop === 'function') stop()
    }
  }, [ctx, sessionId, cwd])

  // 这个工作区有没有已经绑好的笔记本 → 决定文案是「新建」还是「打开」。
  useEffect(() => {
    if (!cwd) {
      setBound(null)
      return undefined
    }
    let cancelled = false
    api
      .findWorkspace(cwd)
      .then((notebook) => {
        if (!cancelled) setBound(notebook)
      })
      .catch(() => {
        if (!cancelled) setBound(null)
      })
    return () => {
      cancelled = true
    }
  }, [cwd])

  const t = dict(lang)
  const disabled = !cwd || busy
  const label = bound ? t.openNotebook : t.createNotebook

  return (
    <button
      type="button"
      className="n-menu-item"
      role="menuitem"
      disabled={disabled}
      title={cwd || t.noWorkspace}
      onClick={async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!cwd || busy) return
        setBusy(true)
        try {
          if (bound) {
            requestOpen({ workspacePath: cwd, notebookId: bound.id })
          } else {
            const response = await api.bindWorkspace({
              workspacePath: cwd,
              workspaceLabel: labelOfWorkspace(ctx, cwd),
              title: labelOfWorkspace(ctx, cwd),
            })
            setBound(response.notebook)
            requestOpen({ workspacePath: cwd, notebookId: response.notebook.id })
          }
          // 切到笔记面板；面板自己消费 intent。
          try {
            ctx.layout.selectPanel('notes')
          } catch {
            /* layout 服务形状变了就只写 intent */
          }
        } catch (error) {
          console.warn('[dsh-notes] 会话菜单建笔记本失败:', error)
        } finally {
          setBusy(false)
        }
      }}
    >
      <NotebookIcon size={14} />
      <span>{label}</span>
    </button>
  )
}
