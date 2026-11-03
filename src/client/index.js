/**
 * @tom2012/dsh-notes — Client half
 *
 * 注册三样东西（DESIGN.md §5）：
 *   1. `sidebar.panellist` 加一行「全部笔记本」，order 40 ——
 *      排在 插件(0) / 记忆(5) / 自动化任务(10) / 技能库(35) 之后；
 *   2. `main` 的 keyed 槽注册 key="notes"，承载整块笔记本 UI；
 *   3. `sidebar.workspaces.session.menu.item` 会话 "…" 菜单里的「新建/打开笔记本」
 *      （方案 C 的 P1：对**该会话所属工作区**操作，不必先切面板）。
 *
 * 面板行的 label 传 { zh, en } 映射：宿主的 resolveSlotLabel 按当前语言解析，
 * 且 dsh-client-ui-sidebar 订阅了 locale 变化，所以切语言会即时更新。
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
import { PanelIcon } from './icons.js'
import { SessionNotesMenuItem } from './session-menu.js'
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

  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: 'notes',
        order: 40,
        label: { zh: '全部笔记本', en: 'All notebooks' },
      },
      PanelIcon,
    ),
  )

  ctx.slots.inject('main', () =>
    ctx.slots.register({ name: 'main', key: 'notes' }, () => <NotesApp ctx={ctx} />),
  )

  ctx.slots.inject('sidebar.workspaces.session.menu.item', () =>
    ctx.slots.register(
      {
        name: 'sidebar.workspaces.session.menu.item',
        id: 'notes',
        order: 300,
        label: { zh: '新建/打开笔记本', en: 'New/Open notebook' },
      },
      (props) => <SessionNotesMenuItem ctx={ctx} sessionId={props && props.sessionId} />,
    ),
  )
}
