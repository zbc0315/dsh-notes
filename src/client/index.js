/**
 * @tom2012/dsh-notes — Client half
 *
 * 两个入口（用户原始需求）：
 *   1. 左侧边栏：工作区级「新建笔记本 / 打开笔记本」——
 *      `sidebar.workspaces.session.menu.item`（按该会话所属工作区建/开）；
 *   2. 右侧边栏：「全部笔记本」统一入口 ——
 *      `sidebarRightTabs` 的 notes 标签页类型 + `sidebar.right.pane.tab` 内容。
 *
 * 另外注册 `main` 的 keyed 槽（key="notes"），承载完整笔记本 UI。
 * **左侧不再有「全部笔记本」入口**：左侧只负责工作区级动作。
 *
 * 面板行的 label **不能是 { zh, en } 对象**：宿主的 resolveSlotLabel 只有
 * `typeof label === 'function' ? label() : label` 这一层，对象会被原样交给 React
 * 当子元素渲染（React #31），整个 sidebar 槽会崩成空白竖条（2026-11-03 实测）。
 *
 * 但可以传**函数**：宿主在 `ctx.locale.subscribe(...)` 时会对每个入口重新调用
 * resolveSlotLabel，所以 `() => dict().label` 既安全、又能跟着语言实时切换。
 *
 * 不 import 任何 @deepseek-ai/* 包：react 由 ModuleLoader 的 platform 表提供，
 * BlockNote（含 ProseMirror / Mantine）全部打进独立的 client/editor.js，面板打开才加载。
 */

import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'

import { NotesApp } from './app.js'
import { providePlatformModules } from './blocknote-runtime.js'
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

  ctx.slots.inject('main', () =>
    ctx.slots.register({ name: 'main', key: 'notes' }, () => <NotesApp ctx={ctx} />),
  )

  ctx.slots.inject('sidebar.workspaces.session.menu.item', () =>
    ctx.slots.register(
      {
        name: 'sidebar.workspaces.session.menu.item',
        id: 'notes',
        order: 300,
        // 菜单项自己渲染文案（组件里），这里不给 label：
        // 该槽的 label 没有消费者，而函数/对象都可能被当 React child 渲染。
      },
      (props) => <SessionNotesMenuItem ctx={ctx} sessionId={props && props.sessionId} />,
    ),
  )

  // 左侧栏的工作区级入口：会话行悬停按钮（工作区行本身没有插槽）。
  ctx.slots.inject('sidebar.workspaces.session.row.action', () =>
    ctx.slots.register(
      { name: 'sidebar.workspaces.session.row.action', id: 'notes', order: 100 },
      (props) => <SessionNotesAction ctx={ctx} sessionId={props && props.sessionId} />,
    ),
  )

  // 右侧栏「全部笔记本」入口：注册一个标签页类型 + 内容。
  // 右侧栏由 ui-sidebar-right 提供，稍于本插件就绪，所以用 ctx.inject 等它。
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
              // body 的 key 是标签页类型的 id（不是 kind）。
              { name: 'sidebar.right.pane.tab', key: 'dsh-notes' },
              (props) => <NotesRightPanel ctx={ctx} {...props} />,
            ),
          ),
        'dsh-notes: right tab body',
      )
    }
  })
}
