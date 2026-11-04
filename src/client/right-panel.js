/**
 * 右侧栏「笔记本」标签页 —— 工作区级笔记本，**在右侧栏里**打开。
 *
 * 用户 2026-11-04 的最终口径：
 *   · 左侧边栏是全局的：一行「全部笔记本」→ 主面板；
 *   · 右侧边栏是当前工作区的：新建/打开当前工作区笔记本 → 内容就渲染在右侧栏。
 *
 * 所以这里不再切主面板，直接渲染 compact 模式的 NotesApp。
 */

import { NotesApp } from './app.js'
import { NotesBoundary } from './boundary.js'

export function NotesRightPanel({ ctx }) {
  return (
    <div className="n-right-host">
      <NotesBoundary>
        <NotesApp ctx={ctx} compact autoCreate />
      </NotesBoundary>
    </div>
  )
}
