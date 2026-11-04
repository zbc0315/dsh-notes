/**
 * 会话行悬停按钮：对**该会话所属工作区**新建/打开笔记本。
 *
 * 宿主的 `sidebar.workspaces.session.row.action` 只传 `{ sessionId, displayTitle }`；
 * 按钮和行内其它图标同高，点一下：没有笔记本就以工作区名建一个（根层级），
 * 已有就打开，然后切到主面板的笔记页。
 *
 * 这是左侧边栏的工作区级入口（工作区行本身没有可插入的槽位，所以挂在会话行上）。
 */

import { useEffect, useRef, useState } from 'react'

import { api } from './api.js'
import { currentLang, dict, onLangChange } from './i18n.js'
import { NotebookIcon } from './icons.js'
import { requestOpen } from './intent.js'
import { cwdOfSession, ensureWorkspaceNotebook, openNotesPanel } from './workspace-notebook.js'

/**
 * @param {{ ctx: object, sessionId?: string }} props
 */
export function SessionNotesAction({ ctx, sessionId }) {
  const [lang, setLang] = useState(currentLang())
  const [cwd, setCwd] = useState(() => cwdOfSession(ctx, sessionId))
  const [exists, setExists] = useState(null)
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)

  useEffect(() => onLangChange(setLang), [])

  useEffect(() => {
    alive.current = true
    if (!cwd) return undefined
    api
      .findWorkspace(cwd)
      .then((notebook) => {
        if (alive.current) setExists(notebook !== null && notebook !== undefined)
      })
      .catch(() => {
        if (alive.current) setExists(null)
      })
    return () => {
      alive.current = false
    }
  }, [cwd])

  // 会话列表可能晚于行挂载，补一次解析。
  useEffect(() => {
    if (cwd) return undefined
    const timer = setTimeout(() => setCwd(cwdOfSession(ctx, sessionId)), 300)
    return () => clearTimeout(timer)
  }, [ctx, sessionId, cwd])

  const label = exists ? dict(lang).openNotebook : dict(lang).createNotebook

  const onClick = async (event) => {
    event.stopPropagation()
    if (busy || !cwd) return
    setBusy(true)
    try {
      const { notebook } = await ensureWorkspaceNotebook(ctx, cwd)
      setExists(true)
      requestOpen({ notebookId: notebook.id })
      openNotesPanel(ctx)
    } catch (err) {
      console.warn('[dsh-notes] 建/开笔记本失败：', err && err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className="n-rowaction"
      aria-label={label}
      title={label}
      disabled={busy || !cwd}
      onClick={onClick}
    >
      <NotebookIcon size={14} />
    </button>
  )
}
