/**
 * 文案：不引宿主 i18n 运行时（client 半与宿主解耦），只读
 * `document.documentElement.lang` —— 这正是 dsh-client-locale 在切换语言时改的那个属性。
 *
 * 面板行的 label 走另一条路：sidebar.panellist 的 label 允许传 { zh, en } 映射，
 * 宿主自己 resolveSlotLabel + 监听 locale 变化，所以那里不用本文件。
 */

const ZH = {
  label: '全部笔记本',
  title: '全部笔记本',
  currentWorkspace: '当前工作区',
  noWorkspace: '未选择工作区',
  createNotebook: '新建笔记本',
  openNotebook: '打开笔记本',
  orphan: '游离',
  newPage: '新建页面',
  newChild: '新建子笔记本',
  rename: '重命名',
  delete: '删除',
  exportMd: '导出 Markdown',
  save: '保存',
  saved: '已保存',
  saving: '保存中…',
  unsaved: '未保存',
  conflict: '他处已修改',
  conflictBody: '这份笔记在别处被改过。覆盖会丢掉对方的改动。',
  overwrite: '覆盖',
  reload: '载入最新',
  empty: '还没有笔记本',
  emptyHint: '在左侧选中一个工作区，点「新建笔记本」开始。',
  noPage: '选一个页面开始编辑，或者新建一页。',
  untitled: '无标题',
  searchPlaceholder: '搜索标题与正文…',
  searchEmpty: '没有命中',
  deleteNotebookConfirm: (t) => `删除笔记本「${t}」？它和里面的页面都会进回收站。`,
  deletePageConfirm: (t) => `删除页面「${t}」？会进回收站。`,
  renamePrompt: '新名字',
  loading: '载入中…',
  retry: '重试',
  unavailable: '笔记本服务不可用',
  unavailableHint: '宿主路由没有注册成功，请重启 dsh web 后刷新页面。',
  imageTooLarge: '图片太大（上限 16MB）',
  uploadFailed: '图片上传失败',
  chars: (n) => `${n} 字`,
  more: '更多',
  noResults: '没有结果',
  close: '关闭',
  writeHere: '开始写…',
  formatting: '格式',
  bold: '加粗',
  italic: '斜体',
  strike: '删除线',
  code: '行内代码',
  h1: '一级标题',
  h2: '二级标题',
  h3: '三级标题',
  bulletList: '无序列表',
  orderedList: '有序列表',
  taskList: '任务列表',
  quote: '引用',
  codeBlock: '代码块',
  link: '链接',
  linkPrompt: '链接地址',
  image: '插入图片',
  table: '插入表格',
  undo: '撤销',
  redo: '重做',
  notebook: '笔记本',
  page: '页面',
}

const EN = {
  label: 'All notebooks',
  title: 'All notebooks',
  currentWorkspace: 'Current workspace',
  noWorkspace: 'No workspace selected',
  createNotebook: 'New notebook',
  openNotebook: 'Open notebook',
  orphan: 'Orphan',
  newPage: 'New page',
  newChild: 'New sub-notebook',
  rename: 'Rename',
  delete: 'Delete',
  exportMd: 'Export markdown',
  save: 'Save',
  saved: 'Saved',
  saving: 'Saving…',
  unsaved: 'Unsaved',
  conflict: 'Changed elsewhere',
  conflictBody: 'This note changed on disk. Overwriting discards the other version.',
  overwrite: 'Overwrite',
  reload: 'Reload latest',
  empty: 'No notebooks yet',
  emptyHint: 'Pick a workspace on the left, then click “New notebook”.',
  noPage: 'Pick a page to start writing, or create one.',
  untitled: 'Untitled',
  searchPlaceholder: 'Search titles and text…',
  searchEmpty: 'Nothing matched',
  deleteNotebookConfirm: (t) => `Delete notebook “${t}”? It and its pages go to the trash.`,
  deletePageConfirm: (t) => `Delete page “${t}”? It goes to the trash.`,
  renamePrompt: 'New name',
  loading: 'Loading…',
  retry: 'Retry',
  unavailable: 'Notebook service unavailable',
  unavailableHint: 'The host route did not register. Restart dsh web, then reload this page.',
  imageTooLarge: 'Image too large (16MB limit)',
  uploadFailed: 'Image upload failed',
  chars: (n) => `${n} chars`,
  more: 'More',
  noResults: 'No results',
  close: 'Close',
  writeHere: 'Start writing…',
  formatting: 'Formatting',
  bold: 'Bold',
  italic: 'Italic',
  strike: 'Strikethrough',
  code: 'Inline code',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  bulletList: 'Bullet list',
  orderedList: 'Numbered list',
  taskList: 'Task list',
  quote: 'Quote',
  codeBlock: 'Code block',
  link: 'Link',
  linkPrompt: 'Link URL',
  image: 'Insert image',
  table: 'Insert table',
  undo: 'Undo',
  redo: 'Redo',
  notebook: 'Notebook',
  page: 'Page',
}

export function currentLang() {
  const raw = (typeof document !== 'undefined' && document.documentElement.lang) || 'zh-CN'
  return String(raw).toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function dict(lang) {
  const target = lang || currentLang()
  return target === 'zh' ? ZH : EN
}

/** 订阅语言切换（html[lang] 变化）。返回退订函数。 */
export function onLangChange(fn) {
  if (typeof MutationObserver !== 'function' || typeof document === 'undefined') return () => {}
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.attributeName === 'lang') {
        fn(currentLang())
        return
      }
    }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
  return () => observer.disconnect()
}
