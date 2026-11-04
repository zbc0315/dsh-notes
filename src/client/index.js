/**
 * @tom2012/dsh-notes — Client half
 *
 * 两个入口（用户 2026-11-04 的澄清）：
 *   1. 左侧面板：`sidebar.panellist` 一行「笔记本」——工作区级「新建/打开」；
 *   2. 右侧全局入口：`sidebarRightTabs` 的 notes 类型 + 「全部笔记本」guide，
 *      点开进**主面板**（`main`，key=`notes`）看全部笔记本。
 *
 * 笔记本本体在主面板；左侧面板行同时给 main 提供面板身份。
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
import { SessionNotesAction } from './session-row-action.js'
import { SessionNotesMenuItem } from './session-menu.js'
import { dict } from './i18n.js'
import { installStyles } from './styles.js'

export const inject = ['slots']

export function apply(ctx) {
  installStyles()

  // 编辑器重包（client/editor.js）由本 bundle 带着**同一份** react 实例去调用，
  // 否则 BlockNote 里会出现两份 React → invalid hook call。
  providePlatformModules({
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'react-dom': ReactDOM,
    'react-dom/client': ReactDOMClient,
  })

  // 左侧面板行：工作区级入口。点行本身由宿主负责 selectPanel('notes')。
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      { name: 'sidebar.panellist', id: 'notes', order: 40, label: () => dict().panelLabel },
      PanelIcon,
    ),
  )

  // 主面板：笔记本本体（错误边界先接住崩溃，把组件栈打进控制台）。
  ctx.slots.inject('main', () =>
    ctx.slots.register({ name: 'main', key: 'notes' }, () => (
      <NotesBoundary>
        <NotesApp ctx={ctx} />
      </NotesBoundary>
    )),
  )

  // 会话「…」菜单：对会话所属工作区建/开。
  ctx.slots.inject('sidebar.workspaces.session.menu.item', () =>
    ctx.slots.register(
      { name: 'sidebar.workspaces.session.menu.item', id: 'notes', order: 300 },
      (props) => <SessionNotesMenuItem ctx={ctx} sessionId={props && props.sessionId} />,
    ),
  )

  // 会话行悬停按钮：同一个动作的快捷方式。
  ctx.slots.inject('sidebar.workspaces.session.row.action', () =>
    ctx.slots.register(
      { name: 'sidebar.workspaces.session.row.action', id: 'notes', order: 100 },
      (props) => <SessionNotesAction ctx={ctx} sessionId={props && props.sessionId} />,
    ),
  )

  // 右侧栏：全局入口（标签页 + guide），内容列表点条目进主面板。
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
                id: 'all',
                order: 20,
                title: () => dict().label,
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
