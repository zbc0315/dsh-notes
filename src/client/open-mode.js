/** 打开主面板时的一次性开关：右侧「全部笔记本」打开时不要自动建当前工作区笔记本。 */
let suppress = false

export function suppressAutoCreate() {
  suppress = true
}

export function takeSuppressAutoCreate() {
  const value = suppress
  suppress = false
  return value
}
