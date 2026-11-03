/**
 * 样式：只用宿主的 --dsw-* 令牌，不引入任何外部 CSS，也不覆盖宿主选择器。
 * 所有类名带 n- 前缀（notes），避免和宿主/其它插件撞车。
 */

const CSS = `
.n-app {
  display: flex;
  height: 100%;
  min-height: 0;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: 13px;
}

/* ---------- 左侧：工作区条 + 搜索 + 树 ---------- */
.n-side {
  display: flex;
  flex-direction: column;
  width: 268px;
  min-width: 200px;
  max-width: 40%;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  min-height: 0;
}

.n-wsbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 10px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.n-wsbar-label {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  letter-spacing: .02em;
}
.n-wsbar-name {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.n-wsbar-name b {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.n-wsbar-actions { display: flex; gap: 6px; }

.n-search {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 10px;
  padding: 0 8px;
  height: 28px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-md, 8px);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-tertiary);
}
.n-search:focus-within { border-color: var(--dsw-alias-brand-primary); }
.n-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
}

.n-tree {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 2px 6px 12px;
}
.n-tree-empty {
  padding: 24px 14px;
  color: var(--dsw-alias-label-tertiary);
  line-height: 1.7;
}
.n-tree-empty b { color: var(--dsw-alias-label-secondary); font-weight: 600; }

.n-row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 4px;
  border-radius: var(--dsw-radius-sm, 6px);
  cursor: pointer;
  user-select: none;
  color: var(--dsw-alias-label-secondary);
  min-width: 0;
}
.n-row:hover { background: var(--dsw-alias-interactive-bg-hover); }
.n-row.is-active {
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-primary);
}
.n-row.is-notebook { color: var(--dsw-alias-label-primary); font-weight: 550; }
.n-row-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.n-row-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-tertiary);
  font-weight: 500;
}
.n-row-actions {
  display: none;
  align-items: center;
  gap: 2px;
}
.n-row:hover .n-row-actions,
.n-row:focus-within .n-row-actions { display: flex; }
.n-twist {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--dsw-alias-label-tertiary);
  flex: none;
}
.n-twist.is-leaf { visibility: hidden; }
.n-indent { flex: none; width: 12px; }

.n-hit {
  display: block;
  padding: 6px 8px;
  border-radius: var(--dsw-radius-sm, 6px);
  cursor: pointer;
  min-width: 0;
}
.n-hit:hover { background: var(--dsw-alias-interactive-bg-hover); }
.n-hit-title {
  font-weight: 550;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.n-hit-snippet {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  margin-top: 2px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ---------- 右侧：编辑器 ---------- */
.n-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.n-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  flex: none;
}
.n-title-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
}
.n-save-state {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
}
.n-save-state.is-error { color: var(--dsw-alias-label-error); }

.n-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  flex: none;
  flex-wrap: wrap;
}
.n-toolbar-sep {
  width: 1px;
  height: 16px;
  background: var(--dsw-alias-border-l2);
  margin: 0 4px;
}

.n-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.n-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.n-btn:disabled { opacity: .45; cursor: default; }
.n-btn.is-icon { width: 26px; padding: 0; }
.n-btn.is-on {
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-primary);
}
.n-btn.is-primary {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
  border-color: transparent;
}
.n-btn.is-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
.n-btn.is-danger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-label-error);
}
/* 会话 "…" 菜单里的行（宿主菜单里插入的一行） */
.n-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}
.n-menu-item:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.n-menu-item:disabled { opacity: .45; cursor: default; }
.n-menu-item:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
  outline-offset: -1px;
}

.n-btn:focus-visible, .n-row:focus-visible, .n-hit:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
  outline-offset: 1px;
}

.n-editor-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.n-editor {
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 24px 120px;
}
.n-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--dsw-alias-label-tertiary);
  padding: 40px;
  text-align: center;
  line-height: 1.7;
}
.n-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 12px 0;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-state-warn-primary);
  border-radius: var(--dsw-radius-md, 8px);
  background: var(--dsw-alias-state-warn-tertiary);
  color: var(--dsw-alias-state-warn-label);
  font-size: 12px;
}
.n-banner-text { flex: 1; min-width: 0; }

/* ---------- ProseMirror / TipTap ---------- */
.n-prose {
  outline: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 1.75;
  min-height: 320px;
}
.n-prose > * + * { margin-top: .7em; }
.n-prose h1 { font-size: 1.6em; font-weight: 650; margin-top: 1.1em; line-height: 1.35; }
.n-prose h2 { font-size: 1.3em; font-weight: 650; margin-top: 1em; line-height: 1.4; }
.n-prose h3 { font-size: 1.12em; font-weight: 650; margin-top: .9em; }
.n-prose h4, .n-prose h5, .n-prose h6 { font-size: 1em; font-weight: 650; margin-top: .8em; }
.n-prose p { margin: 0; }
.n-prose ul, .n-prose ol { padding-left: 1.4em; margin: .4em 0; }
.n-prose ul { list-style: disc; }
.n-prose ol { list-style: decimal; }
.n-prose li > p { margin: 0; }
.n-prose blockquote {
  border-left: 3px solid var(--dsw-alias-border-l3);
  padding-left: .8em;
  color: var(--dsw-alias-label-secondary);
  margin: .6em 0;
}
.n-prose code {
  font-family: var(--dsw-font-markdown-code-font-family, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: .9em;
  padding: .12em .35em;
  border-radius: 4px;
  background: var(--dsw-alias-markdown-inline-code);
}
.n-prose pre {
  background: var(--dsw-alias-markdown-code-block);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-md, 8px);
  padding: 10px 12px;
  overflow: auto;
}
.n-prose pre code { background: transparent; padding: 0; font-size: .875em; line-height: 1.6; }
.n-prose a { color: var(--dsw-alias-link); text-decoration: underline; text-underline-offset: 2px; }
.n-prose hr { border: 0; border-top: 1px solid var(--dsw-alias-border-l2); margin: 1.2em 0; }
.n-prose img { max-width: 100%; border-radius: var(--dsw-radius-md, 8px); display: block; }
.n-prose img.ProseMirror-selectednode { outline: 2px solid var(--dsw-alias-brand-primary); }
.n-prose table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: .8em 0;
  overflow: hidden;
}
.n-prose th, .n-prose td {
  border: 1px solid var(--dsw-alias-border-l2);
  padding: 6px 8px;
  vertical-align: top;
  position: relative;
  min-width: 60px;
}
.n-prose th { background: var(--dsw-alias-bg-layer-2); font-weight: 600; text-align: left; }
.n-prose .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--dsw-alias-brand-primary);
  pointer-events: none;
}
.n-prose ul[data-type="taskList"] { list-style: none; padding-left: .2em; }
.n-prose ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  gap: .5em;
}
.n-prose ul[data-type="taskList"] li > label { flex: none; margin-top: .28em; }
.n-prose ul[data-type="taskList"] li > div { flex: 1; min-width: 0; }
.n-prose ul[data-type="taskList"] input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
}
.n-prose p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--dsw-alias-label-tertiary);
  float: left;
  height: 0;
  pointer-events: none;
}
`

let installed = false

/** 注入一次全局样式（幂等）。 */
export function installStyles() {
  if (installed || typeof document === 'undefined') return
  installed = true
  const id = 'dsh-notes-styles'
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = CSS
  document.head.append(style)
}
