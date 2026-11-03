/**
 * 跟随宿主的深/浅色。
 *
 * DSH 的暗色标记是 `body[data-ds-dark-theme]`（见 dsh-client-ui-layout 的 DARK_ATTRIBUTE），
 * 它和 `--dsw-alias-*` 令牌一起切换。BlockNote 需要知道自己处在哪一档（影响它的
 * 阴影/高亮/选中底色），所以这里读一次 + 用 MutationObserver 跟着变。
 */

import { useEffect, useState } from 'react'

export function hostTheme() {
  if (typeof document === 'undefined' || !document.body) return 'light'
  return document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light'
}

/** React hook：返回 'light' | 'dark'，随宿主切换。 */
export function useHostTheme() {
  const [theme, setTheme] = useState(hostTheme)

  useEffect(() => {
    if (typeof MutationObserver !== 'function' || typeof document === 'undefined' || !document.body) return undefined
    const observer = new MutationObserver(() => setTheme(hostTheme()))
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'class'] })
    setTheme(hostTheme())
    return () => observer.disconnect()
  }, [])

  return theme
}
