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
import { api } from './api.js'
import { getEntryOwner, getEntryState, setEntryState, subscribeEntry } from './entry-state.js'
import { NotesBoundary } from './boundary.js'
import { providePlatformModules } from './blocknote-runtime.js'
import { PanelIcon } from './icons.js'
import { NotesRightPanel } from './right-panel.js'
import { SessionNotesAction } from './session-row-action.js'
import { SessionNotesMenuItem } from './session-menu.js'
import { dict } from './i18n.js'
import { readCurrentWorkspace, watchCurrentWorkspace } from './workspace.js'
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

  // 左侧面板行：工作区级入口。label 在「新建笔记本 / 打开笔记本」之间切换，
  // 状态变化时重新注册（宿主订阅了 sidebar.panellist，会重新渲染这一行）。
  let stopped = false
  const refreshEntry = async () => {
    if (getEntryOwner() === 'app') return
    const ws = readCurrentWorkspace(ctx)
    if (!ws) {
      setEntryState({ cwd: null, title: '', hasNotebook: false, ready: true })
      return
    }
    let has = false
    try {
      has = !!(await api.findWorkspace(ws.path))
    } catch {
      has = false
    }
    if (!stopped) setEntryState({ cwd: ws.path, title: ws.title, hasNotebook: has, ready: true })
  }
  const stopWatch = watchCurrentWorkspace(ctx, refreshEntry)
  refreshEntry()
  // 面板打开时由 NotesApp 拥有状态（owner=app）；关闭时低频兜底，保证切会话后文案跟上。
  const timer = setInterval(() => {
    if (getEntryOwner() !== 'app') refreshEntry()
  }, 3000)
  ctx.effect(() => () => {
    stopped = true
    clearInterval(timer)
    stopWatch()
  }, 'dsh-notes: entry state watcher')

  ctx.slots.inject('sidebar.panellist', () => {
    let dispose = null
    const render = () => {
      if (dispose) {
        dispose()
        dispose = null
      }
      const state = getEntryState()
      const label = !state.ready
        ? dict().panelLabel
        : state.hasNotebook
          ? dict().openNotebook
          : dict().createNotebook
      dispose = ctx.slots.register(
        { name: 'sidebar.panellist', id: 'notes', order: 40, label: () => label },
        PanelIcon,
      )
    }
    const off = subscribeEntry(render)
    render()
    return () => {
      off()
      if (dispose) dispose()
    }
  })

  // 主面板：笔记本本体。
  //   key=notes     —— 左侧「笔记本」行进入：工作区级，允许自动建；
  //   key=notes-all —— 右侧「全部笔记本」进入：全局视图，绝不自动建。
  ctx.slots.inject('main', () => {
    ctx.slots.register({ name: 'main', key: 'notes' }, () => (
      <NotesBoundary>
        <NotesApp ctx={ctx} autoCreate />
      </NotesBoundary>
    ))
    ctx.slots.register({ name: 'main', key: 'notes-all' }, () => (
      <NotesBoundary>
        <NotesApp ctx={ctx} autoCreate={false} />
      </NotesBoundary>
    ))
  })

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
