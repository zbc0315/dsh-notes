/**
 * 编辑区：BlockNote（Notion 式块编辑）。
 *
 * 分两层：
 *   · NotesEditor —— 只负责取页面（pageId → 请求 → 状态机）与骨架屏；
 *   · BlockNoteSurface —— 一个页面一个实例（key=page.id），持有 BlockNote 编辑器、
 *     标题、自动保存、冲突处理、图片上传。
 *
 * 重包（gzip ≈1.4 MB）在 surface 挂载后才 `loadEditorRuntime()`，面板首次打开加载一次。
 *
 * 真源是 blocks JSON（`editor.document`）；Markdown 镜像由 host 用 blocksToMarkdown 生成，
 * 客户端**不**发送 markdown（BlockNote 0.57 的 blocksToMarkdownLossy 有 4 空格缩进 bug）。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { api } from './api.js'
import { loadEditorRuntime } from './blocknote-runtime.js'
import { CloseIcon, ExportIcon, SaveIcon } from './icons.js'
import { useHostTheme } from './theme.js'

const AUTOSAVE_MS = 800
const MAX_IMAGE_BYTES = 16 * 1024 * 1024

/** 把 `asset://<sha>.<ext>` 换成带鉴权的同源路由。 */
export function assetToUrl(url) {
  if (typeof url !== 'string') return url
  if (!url.startsWith('asset://')) return url
  const rest = url.slice('asset://'.length)
  const dot = rest.lastIndexOf('.')
  const sha = dot === -1 ? rest : rest.slice(0, dot)
  const ext = dot === -1 ? 'png' : rest.slice(dot + 1)
  return `/-/notes/asset?sha=${encodeURIComponent(sha)}&ext=${encodeURIComponent(ext)}`
}

/* ------------------------------------------------------------------ *
 * 页面容器
 * ------------------------------------------------------------------ */

/**
 * @param {object} props
 * @param {string|null} props.pageId
 * @param {object} props.t 文案
 * @param {Function} props.onChanged - 保存成功后刷新树
 * @param {Function} props.onGone - 页面已不存在
 */
export function NotesEditor({ pageId, t, onChanged, onGone }) {
  const [page, setPage] = useState(null)
  const [state, setState] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState('')
  const onGoneRef = useRef(onGone)
  onGoneRef.current = onGone

  useEffect(() => {
    if (!pageId) {
      setPage(null)
      setState('idle')
      return
    }
    let cancelled = false
    setState('loading')
    setError('')
    api
      .readPage(pageId)
      .then((next) => {
        if (cancelled) return
        setPage(next)
        setState('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(String((err && err.message) || err))
        setState('error')
        if (err && err.status === 404 && typeof onGoneRef.current === 'function') onGoneRef.current()
      })
    return () => {
      cancelled = true
    }
  }, [pageId])

  if (!pageId) return <div className="n-empty">{t.noPage}</div>
  if (state === 'loading' || state === 'idle') return <div className="n-empty">{t.loading}</div>
  if (state === 'error') return <div className="n-empty">{error}</div>
  if (!page) return <div className="n-empty">{t.loading}</div>

  return <BlockNoteSurface key={page.id} page={page} t={t} onSaved={onChanged} />
}

/* ------------------------------------------------------------------ *
 * 骨架屏
 * ------------------------------------------------------------------ */

function EditorSkeleton({ t }) {
  return (
    <div className="n-editor-skeleton" role="status" aria-live="polite">
      <div className="n-skel-line" style={{ width: '38%', height: '18px' }} />
      <div className="n-skel-line" style={{ width: '92%' }} />
      <div className="n-skel-line" style={{ width: '86%' }} />
      <div className="n-skel-line" style={{ width: '70%' }} />
      <div className="n-skel-hint">{t.loading}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 单页编辑面
 * ------------------------------------------------------------------ */

function BlockNoteSurface({ page, t, onSaved }) {
  const [runtime, setRuntime] = useState(null)
  const [runtimeError, setRuntimeError] = useState('')
  const [title, setTitle] = useState(page.title && page.title !== t.untitled ? page.title : '')
  const [saveState, setSaveState] = useState('saved') // saved | dirty | saving | error
  const [conflict, setConflict] = useState(null)
  const [notice, setNotice] = useState('')

  const baseRef = useRef({ ...page })
  const dirtyRef = useRef(false)
  const changeSeqRef = useRef(0)
  const pendingRef = useRef(false)
  const timerRef = useRef(null)
  const savingRef = useRef(false)
  const editorRef = useRef(null)
  const titleRef = useRef(title)
  const tRef = useRef(t)
  const onSavedRef = useRef(onSaved)

  titleRef.current = title
  tRef.current = t
  onSavedRef.current = onSaved

  /* ---------------- 加载重包 ---------------- */

  useEffect(() => {
    let cancelled = false
    loadEditorRuntime()
      .then((mod) => {
        if (!cancelled) setRuntime(mod)
      })
      .catch((error) => {
        if (!cancelled) setRuntimeError(String((error && error.message) || error))
      })
    return () => {
      cancelled = true
    }
  }, [])

  /* ---------------- 保存 ---------------- */

  const flush = useCallback(async ({ force = false, rev } = {}) => {
    const editor = editorRef.current
    if (!editor) return
    if (savingRef.current) {
      // 正在保存：记下来，等这一轮结束后再排一次，避免吞掉保存窗口里的输入。
      pendingRef.current = true
      return
    }
    if (!dirtyRef.current && !force) return
    const seq = changeSeqRef.current
    const base = baseRef.current
    let blocks
    try {
      blocks = JSON.parse(JSON.stringify(editor.document))
    } catch (error) {
      setNotice(String((error && error.message) || error))
      return
    }
    savingRef.current = true
    setSaveState('saving')
    try {
      const result = await api.savePage({
        id: base.id,
        title: titleRef.current.trim() || tRef.current.untitled,
        blocks,
        rev: rev === undefined ? base.rev : rev,
        baseMtimeMs: base.mtimeMs,
        baseSize: base.size,
      })
      baseRef.current = { ...result.page }
      if (changeSeqRef.current === seq) {
        dirtyRef.current = false
        setSaveState('saved')
      } else {
        // 保存期间又改了：保留 dirty，稍后自动再存一次。
        setSaveState('dirty')
      }
      setConflict(null)
      if (result.conflictFile) {
        const name = String(result.conflictFile).split(/[\\/]/).pop()
        setNotice(`已保存；外部改动留档为 ${name}`)
      }
      if (typeof onSavedRef.current === 'function') onSavedRef.current(result.page)
    } catch (error) {
      if (error && error.status === 409) {
        setConflict(error.current || null)
        setSaveState('error')
      } else {
        setSaveState('error')
        setNotice(String((error && error.message) || error))
      }
    } finally {
      savingRef.current = false
      if (pendingRef.current || (dirtyRef.current && changeSeqRef.current !== seq)) {
        pendingRef.current = false
        scheduleRef.current()
      }
    }
  }, [])

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      flush()
    }, AUTOSAVE_MS)
  }, [flush])
  const scheduleRef = useRef(schedule)
  scheduleRef.current = schedule

  // 卸载（切页/关面板）：立刻落盘一次，不等结果。
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (dirtyRef.current) flush({ force: true }).catch(() => {})
    }
  }, [flush])

  // Cmd/Ctrl+S 立即保存（只拦这一个组合，BlockNote 自己的快捷键不动）
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && String(event.key).toLowerCase() === 's') {
        event.preventDefault()
        flush({ force: true })
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [flush])

  /* ---------------- 编辑器选项 ---------------- */

  const uploadFile = useCallback(async (file) => {
    if (file && file.size > MAX_IMAGE_BYTES) throw new Error(tRef.current.imageTooLarge)
    const asset = await api.uploadAsset(file)
    // 真源里存 asset://，渲染时由 resolveFileUrl 换成同源路由（带宿主鉴权）
    return `asset://${asset.sha}.${asset.ext}`
  }, [])

  const resolveFileUrl = useCallback(async (url) => assetToUrl(url), [])

  const options = useMemo(
    () => ({
      initialContent: Array.isArray(page.blocks) && page.blocks.length > 0 ? page.blocks : undefined,
      uploadFile,
      resolveFileUrl,
    }),
    // 只跟着页面走：换页就重建编辑器（key=page.id 已经保证了这一点）
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page.id],
  )

  /* ---------------- 渲染 ---------------- */

  return (
    <div className="n-main">
      <div className="n-topbar">
        <input
          className="n-title-input"
          value={title}
          placeholder={t.untitled}
          aria-label={t.title}
          onChange={(event) => {
            setTitle(event.target.value)
            dirtyRef.current = true
            changeSeqRef.current += 1
            setSaveState('dirty')
            schedule()
          }}
          onBlur={() => flush()}
        />
        <span
          className={`n-save-state${saveState === 'error' ? ' is-error' : ''}`}
          role="status"
          aria-live="polite"
        >
          {saveState === 'saving'
            ? t.saving
            : saveState === 'dirty'
              ? t.unsaved
              : saveState === 'error'
                ? t.conflict
                : t.saved}
        </span>
        <a
          className="n-btn is-icon"
          href={api.exportUrl(page.id)}
          download
          title={t.exportMd}
          aria-label={t.exportMd}
        >
          <ExportIcon />
        </a>
        <button
          type="button"
          className="n-btn is-icon"
          title={t.save}
          aria-label={t.save}
          onClick={() => flush({ force: true })}
        >
          <SaveIcon />
        </button>
      </div>

      {conflict && (
        <div className="n-banner" role="alert">
          <span className="n-banner-text">
            <b>{t.conflict}</b> — {t.conflictBody}
          </span>
          <button
            type="button"
            className="n-btn"
            onClick={() => {
              const rev = conflict.rev
              setConflict(null)
              dirtyRef.current = true
              changeSeqRef.current += 1
              flush({ force: true, rev })
            }}
          >
            {t.overwrite}
          </button>
          <button
            type="button"
            className="n-btn"
            onClick={async () => {
              setConflict(null)
              try {
                const next = await api.readPage(baseRef.current.id)
                baseRef.current = { ...next }
                setTitle(next.title === t.untitled ? '' : next.title)
                const editor = editorRef.current
                if (editor && Array.isArray(next.blocks)) {
                  editor.replaceBlocks(editor.document, next.blocks)
                }
                dirtyRef.current = false
                setSaveState('saved')
              } catch (error) {
                setNotice(String((error && error.message) || error))
              }
            }}
          >
            {t.reload}
          </button>
        </div>
      )}

      {notice && (
        <div className="n-banner" role="status">
          <span className="n-banner-text">{notice}</span>
          <button type="button" className="n-btn is-icon" aria-label={t.close} onClick={() => setNotice('')}>
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="n-editor-scroll">
        <div className="n-editor">
          {runtimeError && <div className="n-empty">{runtimeError}</div>}
          {!runtime && !runtimeError && <EditorSkeleton t={t} />}
          {runtime && (
            <RuntimeEditor
              runtime={runtime}
              options={options}
              t={t}
              onReady={(editor) => {
                editorRef.current = editor
              }}
              onChange={() => {
                dirtyRef.current = true
                changeSeqRef.current += 1
                setSaveState((prev) => (prev === 'saving' ? prev : 'dirty'))
                schedule()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 真正挂 BlockNoteView 的组件。
 *
 * 单独一层是必须的：`useCreateBlockNote` 是 hook，不能条件调用；
 * 所以等重型 bundle 到位后，才把这一层挂上去。
 */
function RuntimeEditor({ runtime, options, t, onReady, onChange }) {
  const { useCreateBlockNote, BlockNoteView } = runtime
  const theme = useHostTheme()
  const editor = useCreateBlockNote(options)

  useEffect(() => {
    if (editor) onReady(editor)
  }, [editor, onReady])

  if (!editor) return null

  return (
    <div className="n-blocknote">
      <BlockNoteView editor={editor} theme={theme} onChange={onChange} />
    </div>
  )
}
