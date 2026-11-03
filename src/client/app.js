/**
 * 笔记本主面板：工作区条 + 搜索 + 笔记本树 + 编辑区。
 *
 * 结构固定为左右两栏（DESIGN.md §5）：
 *   左：当前工作区（新建/打开笔记本）、搜索、根下全部笔记本与页面
 *   右：选中页面的 BlockNote 编辑区
 *
 * 所有数据操作都打 /-/notes/*，与 Agent 工具共用同一个 NotesStore。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { api } from './api.js'
import { NotesEditor } from './editor.js'
import { currentLang, dict, onLangChange } from './i18n.js'
import { consumeIntent, onIntent } from './intent.js'
import {
  ChevronIcon,
  CloseIcon,
  EditIcon,
  NotebookIcon,
  PageIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from './icons.js'
import { useCurrentWorkspace } from './workspace.js'

/** 按 parentId / order 组装成可渲染的层级。 */
function groupTree(tree) {
  const notebooks = Array.isArray(tree?.notebooks) ? tree.notebooks : []
  const pages = Array.isArray(tree?.pages) ? tree.pages : []
  const byId = new Map(notebooks.map((item) => [item.id, item]))
  const children = new Map()
  for (const item of notebooks) {
    const parent = item.parentId && byId.has(item.parentId) ? item.parentId : null
    if (!children.has(parent)) children.set(parent, [])
    children.get(parent).push(item)
  }
  for (const list of children.values()) list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title))

  const pagesOf = new Map()
  for (const page of pages) {
    if (!pagesOf.has(page.notebookId)) pagesOf.set(page.notebookId, [])
    pagesOf.get(page.notebookId).push(page)
  }
  for (const list of pagesOf.values()) list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (b.updatedAt ?? 0) - (a.updatedAt ?? 0))

  return { byId, children, pagesOf, root: children.get(null) || [], notebookCount: notebooks.length }
}

/** 行内重命名输入框。 */
function RenameInput({ value, onChange, onCommit, onCancel }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])
  return (
    <input
      ref={ref}
      className="n-title-input"
      style={{ height: '22px', fontSize: '13px', fontWeight: 500 }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onCommit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onCommit()
        } else if (event.key === 'Escape') {
          event.preventDefault()
          onCancel()
        }
      }}
    />
  )
}

export function NotesApp({ ctx }) {
  const [lang, setLang] = useState(currentLang())
  useEffect(() => onLangChange(setLang), [])
  const t = useMemo(() => dict(lang), [lang])

  const workspace = useCurrentWorkspace(ctx)

  const [tree, setTree] = useState({ notebooks: [], pages: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPageId, setSelectedPageId] = useState(null)
  const [expanded, setExpanded] = useState(() => new Set())
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [bound, setBound] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [renaming, setRenaming] = useState(null)
  const [busy, setBusy] = useState(false)
  const searchRef = useRef(null)

  const grouped = useMemo(() => groupTree(tree), [tree])
  const selectedNotebookId = useMemo(() => {
    if (!selectedPageId) return null
    const hit = (tree.pages || []).find((page) => page.id === selectedPageId)
    return hit ? hit.notebookId : null
  }, [selectedPageId, tree])

  /* ---------------- 数据 ---------------- */

  const refresh = useCallback(async () => {
    setError('')
    try {
      const next = await api.tree()
      setTree({ notebooks: next.notebooks || [], pages: next.pages || [] })
      setLoading(false)
      return next
    } catch (err) {
      setLoading(false)
      setError(String((err && err.message) || err))
      return null
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  /* ---------------- 外部意图（会话菜单 → 打开笔记本） ---------------- */

  const applyIntent = useCallback(
    async (intent) => {
      if (!intent) return
      const fresh = await refresh()
      let notebookId = intent.notebookId || null
      if (!notebookId && intent.workspacePath) {
        try {
          const notebook = await api.findWorkspace(intent.workspacePath)
          notebookId = notebook ? notebook.id : null
        } catch {
          notebookId = null
        }
      }
      if (!notebookId) return
      setExpanded((prev) => new Set(prev).add(notebookId))
      if (intent.pageId) {
        setSelectedPageId(intent.pageId)
        return
      }
      const pages = ((fresh && fresh.pages) || []).filter((page) => page.notebookId === notebookId)
      if (pages.length > 0) {
        setSelectedPageId(pages[0].id)
        return
      }
      try {
        const page = await api.createPage({ notebookId, title: t.untitled })
        await refresh()
        setSelectedPageId(page.id)
      } catch (err) {
        setError(String((err && err.message) || err))
      }
    },
    [refresh, t],
  )

  useEffect(() => {
    // 面板可能是被会话菜单「叫醒」的：先消费挂起的那条 intent，再订阅后续的。
    const pendingIntent = consumeIntent()
    if (pendingIntent) applyIntent(pendingIntent)
    const stop = onIntent((intent) => {
      consumeIntent()
      applyIntent(intent)
    })
    return stop
  }, [applyIntent])

  // 工作区绑定：路径变了就重新查一次；树变了（可能刚建/删笔记本）也重查。
  useEffect(() => {
    const path = workspace?.path
    if (!path) {
      setBound(null)
      return
    }
    let cancelled = false
    api
      .findWorkspace(path)
      .then((notebook) => {
        if (!cancelled) setBound(notebook)
      })
      .catch(() => {
        if (!cancelled) setBound(null)
      })
    return () => {
      cancelled = true
    }
  }, [workspace?.path, tree])

  // 搜索：输入防抖 200ms。
  useEffect(() => {
    const text = query.trim()
    if (!text) {
      setResults(null)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      api
        .search(text, 30)
        .then((hits) => {
          if (!cancelled) setResults(hits)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  /* ---------------- 动作 ---------------- */

  const withBusy = useCallback(async (fn) => {
    setBusy(true)
    try {
      return await fn()
    } finally {
      setBusy(false)
    }
  }, [])

  const ensureWorkspace = useCallback(async () => {
    if (!workspace?.path) return null
    if (bound) return bound
    const response = await api.bindWorkspace({
      workspacePath: workspace.path,
      workspaceLabel: workspace.title,
      title: workspace.title,
    })
    setBound(response.notebook)
    return response.notebook
  }, [workspace, bound])

  const openNotebook = useCallback(
    async (notebook) => {
      if (!notebook) return
      setExpanded((prev) => new Set(prev).add(notebook.id))
      // 打开 = 展开 + 若还没有选中页就落到第一页
      const first = (grouped.pagesOf.get(notebook.id) || [])[0]
      if (first) setSelectedPageId(first.id)
      else await createPage(notebook.id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grouped],
  )

  const createPage = useCallback(
    async (notebookId) => {
      const target = notebookId || selectedNotebookId || (bound && bound.id)
      if (!target) return
      await withBusy(async () => {
        try {
          const page = await api.createPage({ notebookId: target, title: t.untitled })
          setExpanded((prev) => new Set(prev).add(target))
          await refresh()
          // 新页面不进入行内改名：编辑器顶栏就在眼前，那里改名更顺手，
          // 也避免侧栏输入框和顶栏输入框同时作用于同一页。
          setSelectedPageId(page.id)
        } catch (err) {
          setError(String((err && err.message) || err))
        }
      })
    },
    [selectedNotebookId, bound, refresh, t, withBusy],
  )

  const createNotebook = useCallback(
    async (parentId = null) => {
      await withBusy(async () => {
        try {
          const notebook = await api.createNotebook({ parentId, title: t.notebook })
          await refresh()
          if (parentId) setExpanded((prev) => new Set(prev).add(parentId))
          setRenaming({ kind: 'notebook', id: notebook.id, value: notebook.title })
        } catch (err) {
          setError(String((err && err.message) || err))
        }
      })
    },
    [refresh, t, withBusy],
  )

  const createWorkspaceNotebook = useCallback(async () => {
    await withBusy(async () => {
      try {
        const notebook = await ensureWorkspace()
        await refresh()
        await openNotebook(notebook)
      } catch (err) {
        setError(String((err && err.message) || err))
      }
    })
  }, [ensureWorkspace, refresh, openNotebook, withBusy])

  const commitRename = useCallback(async () => {
    const target = renaming
    setRenaming(null)
    if (!target) return
    const value = target.value.trim()
    if (!value) return
    try {
      if (target.kind === 'notebook') {
        await api.updateNotebook(target.id, { title: value })
      } else {
        // 页面改名：不带 blocks，host 只改 title、不动正文
        const page = await api.readPage(target.id)
        await api.savePage({
          id: page.id,
          title: value,
          rev: page.rev,
          baseMtimeMs: page.mtimeMs,
          baseSize: page.size,
        })
      }
      await refresh()
    } catch (err) {
      setError(String((err && err.message) || err))
    }
  }, [renaming, refresh])

  const doDelete = useCallback(async () => {
    const target = pendingDelete
    setPendingDelete(null)
    if (!target) return
    try {
      if (target.kind === 'page') {
        await api.deletePage(target.id)
        if (selectedPageId === target.id) setSelectedPageId(null)
      } else {
        await api.deleteNotebook(target.id)
      }
      await refresh()
    } catch (err) {
      setError(String((err && err.message) || err))
    }
  }, [pendingDelete, selectedPageId, refresh])

  const toggleExpand = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  /* ---------------- 快捷键 ---------------- */

  useEffect(() => {
    const onKey = (event) => {
      const mod = event.metaKey || event.ctrlKey
      if (mod && event.key.toLowerCase() === 'p') {
        event.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select?.()
      } else if (mod && event.shiftKey && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        createPage()
      } else if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [createPage])

  /* ---------------- 渲染 ---------------- */

  const renderPages = (notebookId, depth) =>
    (grouped.pagesOf.get(notebookId) || []).map((page) => {
      const isRenaming = renaming && renaming.kind === 'page' && renaming.id === page.id
      return (
        <div
          key={page.id}
          className={`n-row${selectedPageId === page.id ? ' is-active' : ''}`}
          style={{ paddingLeft: `${8 + depth * 12 + 16}px` }}
          role="treeitem"
          aria-selected={selectedPageId === page.id ? 'true' : 'false'}
          tabIndex={0}
          onClick={() => setSelectedPageId(page.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setSelectedPageId(page.id)
            }
          }}
        >
          <PageIcon />
          {isRenaming ? (
            <RenameInput
              value={renaming.value}
              onChange={(value) => setRenaming({ ...renaming, value })}
              onCommit={commitRename}
              onCancel={() => setRenaming(null)}
            />
          ) : (
            <span className="n-row-title">{page.title || t.untitled}</span>
          )}
          <span className="n-row-actions">
            <button
              type="button"
              className="n-btn is-icon"
              title={t.rename}
              aria-label={t.rename}
              onClick={(event) => {
                event.stopPropagation()
                setRenaming({ kind: 'page', id: page.id, value: page.title || '' })
              }}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className="n-btn is-icon is-danger"
              title={t.delete}
              aria-label={t.delete}
              onClick={(event) => {
                event.stopPropagation()
                setPendingDelete({ kind: 'page', id: page.id, title: page.title || t.untitled })
              }}
            >
              <TrashIcon />
            </button>
          </span>
        </div>
      )
    })

  const renderNotebook = (notebook, depth) => {
    const open = expanded.has(notebook.id)
    const kids = grouped.children.get(notebook.id) || []
    const pages = grouped.pagesOf.get(notebook.id) || []
    const hasChildren = kids.length > 0 || pages.length > 0
    const isRenaming = renaming && renaming.kind === 'notebook' && renaming.id === notebook.id
    const isWorkspace = notebook.workspacePath && workspace?.path && notebook.workspacePath === workspace.path
    return (
      <div key={notebook.id}>
        <div
          className="n-row is-notebook"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
          role="treeitem"
          aria-expanded={open ? 'true' : 'false'}
          tabIndex={0}
          onClick={() => toggleExpand(notebook.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggleExpand(notebook.id)
            }
          }}
          title={notebook.workspacePath || notebook.title}
        >
          <span className={`n-twist${hasChildren ? '' : ' is-leaf'}`} aria-hidden="true">
            <ChevronIcon open={open} />
          </span>
          <NotebookIcon />
          {isRenaming ? (
            <RenameInput
              value={renaming.value}
              onChange={(value) => setRenaming({ ...renaming, value })}
              onCommit={commitRename}
              onCancel={() => setRenaming(null)}
            />
          ) : (
            <span className="n-row-title">{notebook.title}</span>
          )}
          {isWorkspace && <span className="n-row-badge">{t.currentWorkspace}</span>}
          {notebook.workspacePath && !isWorkspace && <span className="n-row-badge">{t.orphan}</span>}
          <span className="n-row-actions">
            <button
              type="button"
              className="n-btn is-icon"
              title={t.newPage}
              aria-label={t.newPage}
              onClick={(event) => {
                event.stopPropagation()
                createPage(notebook.id)
              }}
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              className="n-btn is-icon"
              title={t.newChild}
              aria-label={t.newChild}
              onClick={(event) => {
                event.stopPropagation()
                createNotebook(notebook.id)
              }}
            >
              <NotebookIcon size={12} />
            </button>
            <button
              type="button"
              className="n-btn is-icon"
              title={t.rename}
              aria-label={t.rename}
              onClick={(event) => {
                event.stopPropagation()
                setRenaming({ kind: 'notebook', id: notebook.id, value: notebook.title })
              }}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className="n-btn is-icon is-danger"
              title={t.delete}
              aria-label={t.delete}
              onClick={(event) => {
                event.stopPropagation()
                setPendingDelete({ kind: 'notebook', id: notebook.id, title: notebook.title })
              }}
            >
              <TrashIcon />
            </button>
          </span>
        </div>
        {open && (
          <div role="group">
            {kids.map((child) => renderNotebook(child, depth + 1))}
            {renderPages(notebook.id, depth)}
            {!hasChildren && (
              <div className="n-row" style={{ paddingLeft: `${8 + (depth + 1) * 12 + 16}px`, color: 'var(--dsw-alias-label-tertiary)' }}>
                <span className="n-row-title">{t.noPage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const wsLabel = workspace ? workspace.title : t.noWorkspace
  const canBind = Boolean(workspace?.path)

  return (
    <div className="n-app">
      <aside className="n-side">
        <div className="n-wsbar">
          <span className="n-wsbar-label">{t.currentWorkspace}</span>
          <span className="n-wsbar-name" title={workspace?.path || ''}>
            <NotebookIcon />
            <b>{wsLabel}</b>
          </span>
          <span className="n-wsbar-actions">
            <button
              type="button"
              className="n-btn"
              disabled={!canBind || busy}
              onClick={() => (bound ? openNotebook(bound) : createWorkspaceNotebook())}
            >
              <PlusIcon />
              {bound ? t.openNotebook : t.createNotebook}
            </button>
            <button
              type="button"
              className="n-btn"
              disabled={busy}
              title={t.newPage}
              aria-label={t.newPage}
              onClick={() => createPage()}
            >
              <EditIcon />
            </button>
          </span>
        </div>

        <div className="n-search">
          <SearchIcon />
          <input
            ref={searchRef}
            type="search"
            value={query}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className="n-btn is-icon" aria-label={t.delete} onClick={() => setQuery('')}>
              <CloseIcon size={12} />
            </button>
          )}
        </div>

        {error && (
          <div className="n-banner" role="alert">
            <span className="n-banner-text">{error}</span>
            <button type="button" className="n-btn" onClick={refresh}>
              {t.retry}
            </button>
          </div>
        )}

        {pendingDelete && (
          <div className="n-banner" role="alert">
            <span className="n-banner-text">
              {pendingDelete.kind === 'notebook'
                ? t.deleteNotebookConfirm(pendingDelete.title)
                : t.deletePageConfirm(pendingDelete.title)}
            </span>
            <button type="button" className="n-btn is-danger" onClick={doDelete}>
              {t.delete}
            </button>
            <button type="button" className="n-btn" onClick={() => setPendingDelete(null)}>
              <CloseIcon size={12} />
            </button>
          </div>
        )}

        <div className="n-tree" role="tree" aria-label={t.title}>
          {loading && <div className="n-tree-empty">{t.loading}</div>}
          {!loading && results && (
            <>
              {results.length === 0 && <div className="n-tree-empty">{t.noResults}</div>}
              {results.map((hit) => (
                <div
                  key={hit.id}
                  className="n-hit"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedPageId(hit.id)
                    setQuery('')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setSelectedPageId(hit.id)
                      setQuery('')
                    }
                  }}
                >
                  <div className="n-hit-title">{hit.title || t.untitled}</div>
                  {hit.snippet && <div className="n-hit-snippet">{hit.snippet}</div>}
                </div>
              ))}
            </>
          )}
          {!loading && !results && grouped.notebookCount === 0 && (
            <div className="n-tree-empty">
              <b>{t.empty}</b>
              <div>{t.emptyHint}</div>
            </div>
          )}
          {!loading && !results && grouped.root.map((notebook) => renderNotebook(notebook, 0))}
        </div>
      </aside>

      <NotesEditor
        pageId={selectedPageId}
        t={t}
        onChanged={() => {
          refresh()
        }}
        onGone={() => {
          setSelectedPageId(null)
          refresh()
        }}
      />
    </div>
  )
}
