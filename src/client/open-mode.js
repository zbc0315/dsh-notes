/** 打开主面板时的一次性开关：右侧「全部笔记本」打开时不要自动建当前工作区笔记本。 */
let suppressUntil = 0

/** 置上抑制；ttlMs 内有效（guide 的 title 在入口渲染时调用，点击发生在之后）。 */
export function suppressAutoCreate(ttlMs = 15000) {
  suppressUntil = Date.now() + ttlMs
}

/** 取走抑制；返回是否仍处于抑制窗口。 */
export function takeSuppressAutoCreate() {
  const value = Date.now() < suppressUntil
  suppressUntil = 0
  return value
}
