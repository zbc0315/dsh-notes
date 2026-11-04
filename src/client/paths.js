/**
 * 路径相等判断（客户端没有 fs.realpath）。
 *
 * 宿主把 workspacePath 归一化成 realpath（macOS 上 /tmp → /private/tmp），
 * 而会话 cwd 可能是符号链接形式；比较时把已知的 /private 前缀对齐，
 * 并忽略末尾斜杠。真正的符号链接解析仍在宿主侧（findWorkspace 会 realpath）。
 */
export function samePath(a, b) {
  if (!a || !b) return false
  const left = stripTrailing(String(a))
  const right = stripTrailing(String(b))
  if (left === right) return true
  if (left === `/private${right}` || right === `/private${left}`) return true
  return false
}

/** 归一化 key：去掉末尾斜杠与 macOS 的 /private 前缀，供 Set 比较。 */
export function pathKey(value) {
  if (!value) return ''
  const path = stripTrailing(String(value))
  return path.startsWith('/private/') ? path.slice('/private'.length) : path
}

function stripTrailing(value) {
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value
}
