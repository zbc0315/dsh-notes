/**
 * 左侧面板行的状态：当前工作区是否已有笔记本。
 *
 * 宿主的面板行 label 只在注册/语言变化时求值，所以状态变化时要用新的 label
 * **重新注册**这一行（宿主订阅了 sidebar.panellist，会重新渲染）。
 */

let state = { cwd: null, title: '', hasNotebook: false, ready: false }
const listeners = new Set()

export function getEntryState() {
  return state
}

export function setEntryState(next) {
  state = { ...state, ...next }
  for (const listener of listeners) {
    try {
      listener(state)
    } catch {
      /* 单个订阅者异常不影响其它人 */
    }
  }
}

export function subscribeEntry(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
