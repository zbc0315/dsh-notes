/**
 * 「当前工作区」推导。
 *
 * DSH 没有直接的 `currentWorkspace` 服务，但三者能拼出来：
 *   1. uiSession.current（或 adapter.current）的 binding key = 当前会话 id
 *   2. ctx.sessions.list 的 byId[sessionId].cwd = 该会话的工作区绝对路径
 *   3. ctx.workspaces.list 的 items[] = 工作区行（含 path / title）
 *
 * 任何一环缺失都优雅退化：拿不到会话就取「主视图保留的那个会话」，
 * 再拿不到就返回 null，面板显示「未选择工作区」并禁用新建。
 */

import { useEffect, useState } from 'react'

/** 读当前会话 id（可能为 undefined）。 */
function currentSessionId(ctx) {
  try {
    const uiSession = ctx.get && ctx.get('uiSession')
    const ref = (uiSession && (uiSession.current || uiSession.adapter?.current)) || null
    const snapshot = ref && typeof ref.getSnapshot === 'function' ? ref.getSnapshot() : null
    if (snapshot && typeof snapshot.key === 'string') return snapshot.key
  } catch {
    /* 服务形状变了就退化 */
  }
  try {
    const sessions = ctx.get && ctx.get('sessions')
    const list = sessions && sessions.list && sessions.list.getSnapshot()
    if (list && list.byId) {
      const hit = Object.values(list.byId).find((item) => (item.retainedBy?.mainView ?? 0) > 0)
      if (hit && hit.id) return hit.id
    }
  } catch {
    /* 同上 */
  }
  return undefined
}

/** 把 cwd 解析成 { path, title }；标题优先用工作区行上的 displayTitle/title。 */
function resolveWorkspace(ctx, cwd) {
  if (!cwd) return null
  let title = ''
  try {
    const workspaces = ctx.get && ctx.get('workspaces')
    const snapshot = workspaces && workspaces.list && workspaces.list.getSnapshot()
    const items = (snapshot && snapshot.items) || []
    const hit = items.find((item) => item.path === cwd)
    if (hit) title = hit.title || hit.displayTitle || ''
  } catch {
    /* 只影响显示名 */
  }
  if (!title) {
    const parts = String(cwd).split(/[\\/]/).filter(Boolean)
    title = parts.length ? parts[parts.length - 1] : cwd
  }
  return { path: cwd, title }
}

/** 同步读一次当前工作区。 */
export function readCurrentWorkspace(ctx) {
  const sessionId = currentSessionId(ctx)
  if (!sessionId) return null
  try {
    const sessions = ctx.get && ctx.get('sessions')
    const list = sessions && sessions.list && sessions.list.getSnapshot()
    const summary = list && list.byId && list.byId[sessionId]
    if (!summary) return null
    return resolveWorkspace(ctx, summary.cwd)
  } catch {
    return null
  }
}

/** React hook：跟随会话/工作区变化。 */
export function useCurrentWorkspace(ctx) {
  const [workspace, setWorkspace] = useState(() => readCurrentWorkspace(ctx))

  useEffect(() => {
    const read = () => setWorkspace(readCurrentWorkspace(ctx))
    const stops = []
    const subscribe = (service, pick) => {
      try {
        const store = pick(service)
        if (store && typeof store.subscribe === 'function') stops.push(store.subscribe(read) || (() => {}))
      } catch {
        /* 服务不在就跳过 */
      }
    }
    const uiSession = ctx.get && ctx.get('uiSession')
    try {
      const ref = (uiSession && (uiSession.current || uiSession.adapter?.current)) || null
      if (ref && typeof ref.subscribe === 'function') stops.push(ref.subscribe(read) || (() => {}))
    } catch {
      /* 跳过 */
    }
    try {
      const sessions = ctx.get && ctx.get('sessions')
      subscribe(sessions, (s) => s.list)
    } catch {
      /* 跳过 */
    }
    try {
      const workspaces = ctx.get && ctx.get('workspaces')
      subscribe(workspaces, (w) => w.list)
    } catch {
      /* 跳过 */
    }
    read()
    return () => {
      for (const stop of stops) {
        try {
          stop()
        } catch {
          /* 忽略 */
        }
      }
    }
  }, [ctx])

  return workspace
}

/**
 * 非 React 版本：订阅当前工作区变化（面板行 label 用）。
 * @param {object} ctx
 * @param {() => void} onChange
 * @returns {() => void} 退订
 */
export function watchCurrentWorkspace(ctx, onChange) {
  const stops = []
  const fire = () => {
    try {
      onChange()
    } catch {
      /* 订阅者异常不影响宿主 */
    }
  }
  const subscribe = (store, label) => {
    try {
      if (store && typeof store.subscribe === 'function') stops.push(store.subscribe(fire) || (() => {}))
    } catch {
      /* 服务形状变了就跳过 */
    }
  }
  try {
    const uiSession = ctx.get && ctx.get('uiSession')
    const ref = (uiSession && (uiSession.current || uiSession.adapter?.current)) || null
    if (ref && typeof ref.subscribe === 'function') stops.push(ref.subscribe(fire) || (() => {}))
  } catch {
    /* 跳过 */
  }
  try {
    const sessions = ctx.get && ctx.get('sessions')
    subscribe(sessions && sessions.list)
  } catch {
    /* 跳过 */
  }
  try {
    const workspaces = ctx.get && ctx.get('workspaces')
    subscribe(workspaces && workspaces.list)
  } catch {
    /* 跳过 */
  }
  return () => {
    for (const stop of stops) {
      try {
        stop()
      } catch {
        /* 忽略 */
      }
    }
  }
}
