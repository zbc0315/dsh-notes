/**
 * @tom2012/dsh-notes — Client half
 *
 * 用户 2026-11-04 的最终口径（两次纠正后）：
 *   1. **左侧边栏是全局的**：`sidebar.panellist` 一行「全部笔记本」→ 主面板（main key=notes）。
 *      左侧没有「新建笔记本」。
 *   2. **右侧边栏是当前工作区的**：右侧栏「笔记本」标签页 → 新建/打开当前工作区笔记本，
 *      内容直接渲染在**右侧栏里**（compact 模式），不占主面板。
 *
 * 数据：blocks JSON 真源 + Markdown 镜像，位于 ~/.dsh/notes。
 * label 只能传字符串或函数（对象会被 React 当子元素渲染 → #31）。
 */

import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'

import { NotesApp } from './app.js'
import { NotesBoundary } from './boundary.js'
import { providePlatformModules } from './blocknote-runtime.js'
import { PanelIcon } from './icons.js'
import { NotesRightPanel } from './right-panel.js'
import { dict } from './i18n.js'
import { installStyles } from './styles.js'

export const inject = ['slots']

export function apply(ctx) {
  console.info('[dsh-notes] build', typeof __NOTES_BUILD__ === 'string' ? __NOTES_BUILD__ : 'dev')
  installStyles()

  // 编辑器重包（client/editor.js）由本 bundle 带着**同一份** react 实例去调用，
  // 否则 BlockNote 里会出现两份 React → invalid hook call。
  providePlatformModules({
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'react-dom': ReactDOM,
    'react-dom/client': ReactDOMClient,
  })

  // 左侧面板：全局入口「全部笔记本」→ 主面板。
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      { name: 'sidebar.panellist', id: 'notes', order: 40, label: () => dict().label },
      PanelIcon,
    ),
  )

  // 主面板：全部笔记本（全局视图，绝不自动建工作区笔记本）。
  ctx.slots.inject('main', () =>
    ctx.slots.register(
      { name: 'main', key: 'notes' },
      () => (
        <NotesBoundary>
          <NotesApp ctx={ctx} autoCreate={false} />
        </NotesBoundary>
      ),
    ),
  )

  // 右侧栏：工作区级笔记本。标签页内容直接渲染在右侧栏（compact），不切主面板。
  ctx.inject(['slots', 'sidebarRightTabs'], (scope) => {
    const tabs = scope.sidebarRightTabs
    const slots = scope.slots

    if (tabs && typeof tabs.register === 'function') {
      ctx.effect(
        () =>
          tabs.register({
            id: 'dsh-notes',
            kind: 'notes',
            title: () => dict().rightTab,
            guide: [
              {
                id: 'workspace',
                order: 20,
                title: () => dict().rightTab,
                description: () => dict().rightTabDesc,
              },
            ],
          }),
        'dsh-notes: right tab type',
      )
    }

    if (slots && typeof slots.inject === 'function') {
      ctx.effect(
        () =>
          slots.inject('sidebar.right.pane.tab', () =>
            slots.register(
              { name: 'sidebar.right.pane.tab', key: 'dsh-notes' },
              (props) => <NotesRightPanel ctx={ctx} {...props} />,
            ),
          ),
        'dsh-notes: right tab body',
      )
    }
  })
}
