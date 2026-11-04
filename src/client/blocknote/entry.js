/**
 * BlockNote 编辑器模块（**重包**，单独打一份 `client/editor.js`，面板打开才加载）。
 *
 * 为什么要单独一份：`@blocknote/*` + ProseMirror + Mantine 主题一起 gzip ≈ 1.4 MB，
 * 打进主 bundle 会让每次进 GUI 都付这笔钱。宿主路由 `/-/notes/client/editor.js`
 * 直接把这个文件当静态资源发出去。
 *
 * 这个文件不直接执行：它只把工厂挂到 `window.__DSH_NOTES_EDITOR_FACTORY__`，
 * 由主 bundle 在需要时调用，并把宿主的 react / react-dom **同一个实例** 传进来
 * （否则两份 React → invalid hook call）。
 */

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteViewRaw as BlockNoteView } from '@blocknote/react'
import { zh as zhLocale, en as enLocale } from '@blocknote/core/locales'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'

export { useCreateBlockNote, BlockNoteView, BlockNoteSchema, defaultBlockSpecs, zhLocale, enLocale }
