/**
 * 富文本编辑区：TipTap v3 + @tiptap/markdown。
 *
 * 分成两层，是因为两者的生命周期不一样：
 *   · NotesEditor —— 负责取/换页面（pageId → 请求 → 状态机）；
 *   · EditorSurface —— 一个页面一个实例（key=page.id），持有 TipTap、标题、自动保存与冲突处理。
 *
 * 设计要点（DESIGN.md §6.3）：
 *  · Markdown 是唯一真源：初始内容用 `contentType: 'markdown'` 解析，
 *    保存时取 `editor.getMarkdown()`；
 *  · 自动保存 800ms 防抖，切页/失焦/Cmd+S 立即 flush；
 *  · 乐观锁：保存带 rev + baseMtimeMs + baseSize；409 时给「覆盖 / 载入最新」；
 *  · 图片粘贴/拖入 → 上传成内容寻址附件，正文里是标准 Markdown 图片语法。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TableKit } from '@tiptap/extension-table'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Markdown } from '@tiptap/markdown'

import { api } from './api.js'
import { CloseIcon, ExportIcon, ImagePlusIcon, SaveIcon } from './icons.js'

const AUTOSAVE_MS = 800
const MAX_IMAGE_BYTES = 16 * 1024 * 1024

/** 工具栏小按钮。 */
function TBtn({ active, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      className={`n-btn is-icon${active ? ' is-on' : ''}`}
      title={title}
      aria-label={title}
      aria-pressed={active ? 'true' : 'false'}
      disabled={disabled}
      // 不让工具栏抢走编辑区的焦点（TipTap 的命令依赖选区）
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Glyph({ children }) {
  return <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1 }}>{children}</span>
}

/* ------------------------------------------------------------------ *
 * 页面容器
 * ------------------------------------------------------------------ */

/**
 * @param {object} props
 * @param {string|null} props.pageId
 * @param {object} props.t 文案
 * @param {Function} props.onChanged - 保存成功后通知外层刷新树
 * @param {Function} props.onGone - 页面已不存在
 */
export function NotesEditor({ pageId, t, onChanged, onGone }) {
  const [page, setPage] = useState(null)
  const [state, setState] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState('')

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
        if (err && err.status === 404 && typeof onGone === 'function') onGone()
      })
    return () => {
      cancelled = true
    }
  }, [pageId, onGone])

  if (!pageId) return <div className="n-empty">{t.noPage}</div>
  if (state === 'loading' || state === 'idle') return <div className="n-empty">{t.loading}</div>
  if (state === 'error') return <div className="n-empty">{error}</div>
  if (!page) return <div className="n-empty">{t.loading}</div>

  return <EditorSurface key={page.id} page={page} t={t} onSaved={onChanged} />
}

/* ------------------------------------------------------------------ *
 * 单页编辑面
 * ------------------------------------------------------------------ */

/** 扩展表：placeholder 文案跟语言走，所以按 t 记忆化。 */
function buildExtensions(t) {
  return [
  // StarterKit v3 自带 Link（以及 underline / listKeymap / trailingNode），
  // 这里显式关掉它，用下面自己配置的那份，避免同名扩展重复注册。
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    link: false,
  }),
  Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
  Image.configure({ inline: false, allowBase64: false }),
  Placeholder.configure({ placeholder: t.writeHere }),
  TableKit.configure({ table: { resizable: true } }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Markdown.configure({ indentation: { style: 'space', size: 2 } }),
  ]
}

function EditorSurface({ page, t, onSaved }) {
  const [title, setTitle] = useState(page.title && page.title !== t.untitled ? page.title : '')
  const [saveState, setSaveState] = useState('saved') // saved | dirty | saving | error
  const [conflict, setConflict] = useState(null)
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)

  /** 服务端那一份的元数据（乐观锁基线）。 */
  const baseRef = useRef({ ...page })
  const dirtyRef = useRef(false)
  const timerRef = useRef(null)
  const savingRef = useRef(false)
  const titleRef = useRef(title)
  const tRef = useRef(t)
  const fileInputRef = useRef(null)
  const onSavedRef = useRef(onSaved)

  titleRef.current = title
  tRef.current = t
  onSavedRef.current = onSaved

  const extensions = useMemo(() => buildExtensions(tRef.current), [])

  const editor = useEditor({
    extensions,
    content: page.markdown || '',
    contentType: 'markdown',
    autofocus: false,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class: 'n-prose',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'notes editor',
        spellcheck: 'false',
      },
    },
    onUpdate: () => {
      dirtyRef.current = true
      setSaveState((prev) => (prev === 'saving' ? prev : 'dirty'))
      scheduleRef.current()
    },
  })

  /* ---------------- 保存 ---------------- */

  const flush = useCallback(async ({ force = false, rev } = {}) => {
    if (!editor || savingRef.current) return
    if (!dirtyRef.current && !force) return
    const base = baseRef.current
    let markdown
    try {
      markdown = editor.getMarkdown()
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
        markdown,
        rev: rev === undefined ? base.rev : rev,
        baseMtimeMs: base.mtimeMs,
        baseSize: base.size,
      })
      baseRef.current = { ...result.page }
      dirtyRef.current = false
      setSaveState('saved')
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
    }
  }, [editor])

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      flush()
    }, AUTOSAVE_MS)
  }, [flush])

  // onUpdate 在 editor 还没建好时也要能排程；用 ref 转发，避免 useEditor 的 options 闭包过期。
  const scheduleRef = useRef(schedule)
  scheduleRef.current = schedule

  // 卸载（切页/关面板）：立刻尝试落盘，不等结果。
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (dirtyRef.current) flush({ force: true }).catch(() => {})
    }
  }, [flush])

  // 快捷键：Cmd/Ctrl+S 立即保存；Cmd/Ctrl+Z/Y 交给 ProseMirror。
  useEffect(() => {
    if (!editor) return
    const dom = editor.view.dom
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        flush({ force: true })
      }
    }
    dom.addEventListener('keydown', onKey)
    return () => dom.removeEventListener('keydown', onKey)
  }, [editor, flush])

  /* ---------------- 图片 ---------------- */

  const uploadImage = useCallback(
    async (file) => {
      if (!editor || !file) return
      if (file.size > MAX_IMAGE_BYTES) {
        setNotice(tRef.current.imageTooLarge)
        return
      }
      setUploading(true)
      try {
        const asset = await api.uploadAsset(file)
        editor.chain().focus().setImage({ src: asset.url, alt: file.name }).run()
      } catch (error) {
        setNotice(`${tRef.current.uploadFailed}: ${String((error && error.message) || error)}`)
      } finally {
        setUploading(false)
      }
    },
    [editor],
  )

  useEffect(() => {
    if (!editor) return
    const dom = editor.view.dom
    const collect = (list) => Array.from(list || []).filter((file) => file.type && file.type.startsWith('image/'))
    const onPaste = (event) => {
      const files = collect(event.clipboardData && event.clipboardData.files)
      if (files.length === 0) return
      event.preventDefault()
      for (const file of files) uploadImage(file)
    }
    const onDrop = (event) => {
      const files = collect(event.dataTransfer && event.dataTransfer.files)
      if (files.length === 0) return
      event.preventDefault()
      for (const file of files) uploadImage(file)
    }
    dom.addEventListener('paste', onPaste)
    dom.addEventListener('drop', onDrop)
    return () => {
      dom.removeEventListener('paste', onPaste)
      dom.removeEventListener('drop', onDrop)
    }
  }, [editor, uploadImage])

  /* ---------------- 冲突处理 ---------------- */

  const overwrite = useCallback(() => {
    const rev = conflict ? conflict.rev : undefined
    setConflict(null)
    dirtyRef.current = true
    flush({ force: true, rev })
  }, [conflict, flush])

  const reload = useCallback(async () => {
    setConflict(null)
    try {
      const next = await api.readPage(baseRef.current.id)
      baseRef.current = { ...next }
      setTitle(next.title === t.untitled ? '' : next.title)
      if (editor) {
        editor.commands.setContent(next.markdown || '', { contentType: 'markdown', emitUpdate: false })
      }
      dirtyRef.current = false
      setSaveState('saved')
    } catch (error) {
      setNotice(String((error && error.message) || error))
    }
  }, [editor, t])

  /* ---------------- 渲染 ---------------- */

  const stateLabel =
    saveState === 'saving'
      ? t.saving
      : saveState === 'dirty'
        ? t.unsaved
        : saveState === 'error'
          ? t.conflict
          : t.saved

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
            setSaveState('dirty')
            schedule()
          }}
          onBlur={() => flush()}
        />
        <span className={`n-save-state${saveState === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">
          {stateLabel}
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
          <button type="button" className="n-btn" onClick={overwrite}>
            {t.overwrite}
          </button>
          <button type="button" className="n-btn" onClick={reload}>
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

      {editor && (
        <div className="n-toolbar" role="toolbar" aria-label={t.formatting}>
          <TBtn title={t.bold} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Glyph>B</Glyph>
          </TBtn>
          <TBtn title={t.italic} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Glyph>I</Glyph>
          </TBtn>
          <TBtn title={t.strike} active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Glyph>S</Glyph>
          </TBtn>
          <TBtn title={t.code} active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Glyph>{'</>'}</Glyph>
          </TBtn>
          <span className="n-toolbar-sep" />
          <TBtn
            title={t.h1}
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Glyph>H1</Glyph>
          </TBtn>
          <TBtn
            title={t.h2}
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Glyph>H2</Glyph>
          </TBtn>
          <TBtn
            title={t.h3}
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Glyph>H3</Glyph>
          </TBtn>
          <span className="n-toolbar-sep" />
          <TBtn title={t.bulletList} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <Glyph>•</Glyph>
          </TBtn>
          <TBtn title={t.orderedList} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <Glyph>1.</Glyph>
          </TBtn>
          <TBtn title={t.taskList} active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}>
            <Glyph>☑</Glyph>
          </TBtn>
          <TBtn title={t.quote} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Glyph>❝</Glyph>
          </TBtn>
          <TBtn title={t.codeBlock} active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Glyph>{'{}'}</Glyph>
          </TBtn>
          <span className="n-toolbar-sep" />
          <TBtn
            title={t.link}
            active={editor.isActive('link')}
            onClick={() => {
              const previous = editor.getAttributes('link').href || ''
              const href = window.prompt(t.linkPrompt, previous)
              if (href === null) return
              if (href === '') {
                editor.chain().focus().unsetLink().run()
                return
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
            }}
          >
            <Glyph>🔗</Glyph>
          </TBtn>
          <TBtn title={t.image} disabled={uploading} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            <ImagePlusIcon />
          </TBtn>
          <TBtn title={t.table} onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}>
            <Glyph>▦</Glyph>
          </TBtn>
          <span className="n-toolbar-sep" />
          <TBtn title={t.undo} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Glyph>↶</Glyph>
          </TBtn>
          <TBtn title={t.redo} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Glyph>↷</Glyph>
          </TBtn>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            aria-hidden="true"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files && event.target.files[0]
              event.target.value = ''
              if (file) uploadImage(file)
            }}
          />
        </div>
      )}

      <div className="n-editor-scroll">
        <div className="n-editor">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
