/**
 * 面板内意图总线。
 *
 * 「会话 … 菜单 → 新建/打开笔记本」发生在会话行上，但真正要动的是笔记面板里的
 * 选中状态，两者不在同一棵树里。方案：菜单项写一条 intent，然后 selectPanel('notes')；
 * 面板挂载时（或已挂载时）消费这条 intent。
 *
 * 面板可能还没挂载（用户当前在看对话），所以 pending 要能存住，等 mount 再取。
 */

let pending = null
const listeners = new Set()

/**
 * 请求笔记面板打开某个工作区的笔记本。
 * @param {{ workspacePath?: string, notebookId?: string, pageId?: string }} intent
 */
export function requestOpen(intent) {
  pending = Object.assign({ at: Date.now() }, intent || {})
  for (const listener of listeners) {
    try {
      listener(pending)
    } catch {
      /* 单个订阅者异常不影响其它人 */
    }
  }
}

/** 取走当前 intent（取一次就清空）。 */
export function consumeIntent() {
  const intent = pending
  pending = null
  return intent
}

/** 订阅 intent；返回退订函数。 */
export function onIntent(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
