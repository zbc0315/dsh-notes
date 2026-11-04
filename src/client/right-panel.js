/**
 * 右侧栏「笔记」标签页 —— 全部笔记本的统一入口。
 *
 * 需求（用户原话）：左侧边栏负责「某个工作区的新建/打开笔记本」，右侧边栏
 * 负责「全部笔记本」的统一入口。左侧那条 `sidebar.panellist` 是面板级入口；
 * 这里补的是右侧栏的标签页类型：
 *   · `sidebarRightTabs.register({ id, kind: 'notes', guide: [...] })` → 右侧
 *     「新标签页」里出现「全部笔记本」；
 *   · `sidebar.right.pane.tab` 用同一个 id 注册标签内容。
 *
 * 右侧栏只有 300–420px，塞不下完整编辑器，所以这里做「目录 + 跳转」：
 * 点任意笔记本会在主面板（key=notes）里打开它，并带上 intent 选中。
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from './api.js'
import { currentLang, dict, onLangChange } from './i18n.js'
import { requestOpen } from './intent.js'
import { ensureWorkspaceNotebook, openNotesPanel } from './workspace-notebook.js'
import { useCurrentWorkspace } from './workspace.js'

/**
 * @param {{ ctx: object }} props - 客户端 context，用来切主面板。
 */
export function NotesRightPanel({ ctx }) {
  const [lang, setLang] = useState(currentLang())
  useEffect(() => onLangChange(setLang), [])
  const t = useMemo(() => dict(lang), [lang])

  const workspace = useCurrentWorkspace(ctx)
  const [tree, setTree] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const next = await api.tree()
      setTree({ notebooks: next.notebooks || [], pages: next.pages || [] })
    } catch (err) {
      setError(String((err && err.message) || err))
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const rows = useMemo(() => {
    const notebooks = (tree && tree.notebooks) || []
    const pages = (tree && tree.pages) || []
    const count = new Map()
    for (const page of pages) count.set(page.notebookId, (count.get(page.notebookId) || 0) + 1)
    return notebooks
      .filter((notebook) => notebook.parentId === null || notebook.parentId === undefined)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((notebook) => ({ ...notebook, pageCount: count.get(notebook.id) || 0 }))
  }, [tree])

  const openInMain = (notebookId) => {
    requestOpen({ notebookId })
    openNotesPanel(ctx)
  }

  const bound = useMemo(() => {
    if (!workspace || !rows.length) return null
    return rows.find((notebook) => notebook.workspacePath && notebook.workspacePath === workspace.path) || null
  }, [rows, workspace])

  const onCreateOrOpen = async () => {
    if (!workspace || busy) return
    setBusy(true)
    setError('')
    try {
      if (bound) {
        openInMain(bound.id)
      } else {
        const { notebook } = await ensureWorkspaceNotebook(ctx, workspace.path)
        await refresh()
        openInMain(notebook.id)
      }
    } catch (err) {
      setError(String((err && err.message) || err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="n-right">
      <div className="n-right-head">
        <span className="n-right-title">{t.label}</span>
        <button
          type="button"
          className="n-right-refresh"
          onClick={refresh}
          disabled={busy}
          aria-label={t.retry}
          title={t.retry}
        >
          ⟳
        </button>
      </div>

      <div className="n-right-ws">
        {workspace ? (
          <>
            <span className="n-right-ws-name" title={workspace.path}>
              {workspace.title}
            </span>
            <button type="button" className="n-right-action n-right-ws-btn" onClick={onCreateOrOpen} disabled={busy}>
              {bound ? t.openNotebook : t.createNotebook}
            </button>
          </>
        ) : (
          <span className="n-right-ws-name">{t.noWorkspace}</span>
        )}
      </div>

      {error ? (
        <div className="n-right-empty">
          <div>{t.unavailable}</div>
          <div className="n-right-hint">{error}</div>
          <button type="button" className="n-right-action" onClick={refresh}>
            {t.retry}
          </button>
        </div>
      ) : !tree ? (
        <div className="n-right-empty">{t.loading}</div>
      ) : rows.length === 0 ? (
        <div className="n-right-empty">
          <div>{t.empty}</div>
          <div className="n-right-hint">{t.rightEmptyHint}</div>
        </div>
      ) : (
        <div className="n-right-list" role="list">
          {rows.map((notebook) => (
            <button
              key={notebook.id}
              type="button"
              role="listitem"
              className="n-right-row"
              onClick={() => openInMain(notebook.id)}
              title={notebook.workspacePath || notebook.title}
            >
              <span className="n-right-row-main">
                <span className="n-right-row-title">{notebook.title}</span>
                <span className="n-right-row-meta">
                  {notebook.pageCount} {t.page}
                  {notebook.workspacePath ? '' : ` · ${t.orphan}`}
                </span>
              </span>
              <span className="n-right-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
