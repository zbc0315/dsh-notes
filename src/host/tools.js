'use strict'

/**
 * @tom2012/dsh-notes — Agent 工具（Host 侧）
 *
 * 8 个 `notes_*` 窄工具，全部通过同一个 NotesStore 实例读写，
 * 自己绝不碰文件系统（存储层的单写者 / 原子写 / 回收站语义得以保持）。
 *
 * 形状照 @tom2012/dsh-memory：`tool()` + `compileParameters()`，
 * 每个工具在 `ctx.effect(() => ctx.tools.register({...}))` 里注册，随插件卸载回收。
 */

const { StoreError, normalizeWorkspacePath } = require('./store')
const { markdownToBlocks } = require('./markdown-blocks')

/* ------------------------------------------------------------------ *
 * 参数编译（与 dsh-memory 同形）
 * ------------------------------------------------------------------ */

/**
 * `{ [key]: { required: true, ...schema } }` → `{ type:'object', properties, required? }`
 * 把 `required: true` 从字段里摘掉，填到顶层 required 数组。
 */
function compileParameters(propertyMap) {
  const properties = {}
  const required = []
  for (const [key, def] of Object.entries(propertyMap || {})) {
    const { required: isRequired, ...rest } = def ?? {}
    if (isRequired === true) required.push(key)
    properties[key] = rest
  }
  return {
    type: 'object',
    properties,
    ...(required.length > 0 ? { required } : {}),
  }
}

/** 组装一个工具定义。 */
function tool(name, description, parameters, execute) {
  return {
    name,
    description,
    parameters: compileParameters(parameters),
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    execute,
  }
}

/* ------------------------------------------------------------------ *
 * 小工具
 * ------------------------------------------------------------------ */

/** 文本归一（与存储层搜索口径一致：NFKC + 小写 + 折叠空白）。 */
function norm(value) {
  if (typeof value !== 'string') return ''
  let text = value
  try {
    text = text.normalize('NFKC')
  } catch {
    /* 忽略 */
  }
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** 统计某笔记本（含子孙）的 id 集合。 */
function subtreeIds(notebooks, rootId) {
  const ids = new Set([rootId])
  let grew = true
  while (grew) {
    grew = false
    for (const nb of notebooks) {
      if (nb.parentId && ids.has(nb.parentId) && !ids.has(nb.id)) {
        ids.add(nb.id)
        grew = true
      }
    }
  }
  return ids
}

/** 精简的页面行（工具返回不必带满所有内部字段）。 */
function briefPage(page) {
  return {
    id: page.id,
    notebookId: page.notebookId,
    title: page.title,
    rev: page.rev,
    size: page.size,
    updatedAt: page.updatedAt,
  }
}

/** `notes_read` 的页面视图（契约 §6）。blocks 整篇太大，默认只给摘要。 */
const BLOCKS_SUMMARY_LIMIT = 20

/**
 * 块摘要：`{ count, types, truncated }`。
 *
 * types 是块类型序列（最多 `BLOCKS_SUMMARY_LIMIT` 个），让模型知道文档结构，
 * 又不至于把几十 KB 的 blocks JSON 塞进上下文；需要真块时显式传 includeBlocks。
 */
function blocksSummary(blocks) {
  const list = Array.isArray(blocks) ? blocks : []
  const types = list
    .slice(0, BLOCKS_SUMMARY_LIMIT)
    .map((block) => (block && typeof block.type === 'string' ? block.type : 'unknown'))
  return { count: list.length, types, truncated: list.length > BLOCKS_SUMMARY_LIMIT }
}

/**
 * `notes_read` 的页面视图。
 *
 * 默认：`{ id, notebookId, title, rev, updatedAt, markdown, blocksSummary }`；
 * `includeBlocks: true` 时额外带完整 `blocks`。
 */
function pageView(page, includeBlocks) {
  const view = {
    id: page.id,
    notebookId: page.notebookId,
    title: page.title,
    rev: page.rev,
    updatedAt: page.updatedAt,
    markdown: page.markdown,
    blocksSummary: blocksSummary(page.blocks),
  }
  if (includeBlocks) view.blocks = page.blocks
  return view
}

/* ------------------------------------------------------------------ *
 * 注册
 * ------------------------------------------------------------------ */

/**
 * 注册全部 notes_* 工具。
 *
 * @param {object} ctx DSH 插件上下文（用到 ctx.tools.register / ctx.effect）
 * @param {import('./store.js').NotesStore} store 共享存储实例
 * @param {object} [options] 预留（当前只支持 `{ namespace }` 前缀替换，一般不用）
 */
function registerTools(ctx, store, options = {}) {
  if (!ctx || !ctx.tools || typeof ctx.tools.register !== 'function') {
    throw new Error('registerTools 需要一个带 tools.register 的插件上下文')
  }
  if (!store) throw new Error('registerTools 需要一个 NotesStore 实例')
  void options

  const tools = []

  /* ---------- notes_list ---------- */

  tools.push(
    tool(
      'notes_list',
      '列出笔记本与页面（只读）。返回 notebooks（按父子层级排好）、pages（不含正文）、counts（每个笔记本的页面数，含子笔记本累加）。' +
        '不传参数 = 全部笔记本；传 notebookId = 只看该笔记本及其子笔记本；传 workspace = 只看绑定到该工作区的笔记本。',
      {
        notebookId: {
          type: 'string',
          description: '只列这个笔记本及其子笔记本的页面。',
        },
        workspace: {
          type: 'string',
          description: '工作区路径（绝对路径）。自动按规范化后的路径找到绑定的笔记本。',
        },
      },
      async (args = {}) => {
        const tree = store.tree()
        let scope = null

        if (args.workspace) {
          const bound = store.findByWorkspace(args.workspace)
          if (!bound) {
            return {
              ok: true,
              rootDir: tree.rootDir,
              current: null,
              hint: '该工作区还没有笔记本，可先用 notes_create_notebook 传 workspacePath 新建。',
              // 指定了 workspace 却未绑定时，不要把其它工作区的笔记灌进模型上下文。
              notebooks: [],
              pages: [],
              counts: {},
            }
          }
          scope = bound
        } else if (args.notebookId) {
          scope = tree.notebooks.find((nb) => nb.id === String(args.notebookId)) || null
          if (!scope) throw new StoreError(404, `笔记本不存在: ${args.notebookId}`)
        }

        const ids = scope ? subtreeIds(tree.notebooks, scope.id) : null
        const notebooks = (ids ? tree.notebooks.filter((nb) => ids.has(nb.id)) : tree.notebooks).map((nb) => ({
          ...nb,
          pageCount: tree.counts[nb.id] ?? 0,
        }))
        const pages = (ids ? tree.pages.filter((p) => ids.has(p.notebookId)) : tree.pages).map(briefPage)

        return {
          ok: true,
          rootDir: tree.rootDir,
          current: scope ? { id: scope.id, title: scope.title, workspacePath: scope.workspacePath } : null,
          notebooks,
          pages,
          counts: ids ? Object.fromEntries(Object.entries(tree.counts).filter(([id]) => ids.has(id))) : tree.counts,
        }
      },
    ),
  )

  /* ---------- notes_read ---------- */

  tools.push(
    tool(
      'notes_read',
      '按 pageId 或标题读取一篇笔记：markdown（Markdown 导出镜像，通常够用）+ rev（保存时用作乐观锁）' +
        '+ blocksSummary（块数、块类型序列、是否截断）。' +
        '默认**不返回**完整 blocks（整页 JSON 可能有几十 KB）；确实需要编辑块结构时传 includeBlocks=true。' +
        '同时给 notebookId 可以缩小标题查找范围。',
      {
        pageId: {
          type: 'string',
          description: '页面 id（p_xxx）。与 title 二选一，优先使用。',
        },
        title: {
          type: 'string',
          description: '页面标题（模糊匹配，完全相同优先）。',
        },
        notebookId: {
          type: 'string',
          description: '只在这个笔记本（含子笔记本）里按标题查找。',
        },
        includeBlocks: {
          type: 'boolean',
          description: '为 true 时才返回完整 blocks（BlockNote 块数组，真源）；默认 false 只给 blocksSummary。',
        },
      },
      async (args = {}) => {
        const includeBlocks = args.includeBlocks === true
        if (args.pageId) {
          const page = await store.readPage(String(args.pageId))
          return { ok: true, page: pageView(page, includeBlocks) }
        }
        if (!args.title) throw new StoreError(400, '需要提供 pageId 或 title')

        const tree = store.tree()
        const filterIds = args.notebookId ? subtreeIds(tree.notebooks, String(args.notebookId)) : null
        const needle = norm(args.title)
        const candidates = tree.pages.filter((p) => (filterIds ? filterIds.has(p.notebookId) : true))

        // 标题完全相同 → 直接命中；否则退化为搜索（标题/正文）。
        let target = candidates.find((p) => norm(p.title) === needle) || null
        if (!target) {
          const hits = store.search(args.title, 50)
          const scoped = hits.find((hit) => (filterIds ? filterIds.has(hit.notebookId) : true))
          target = scoped ? candidates.find((p) => p.id === scoped.id) || null : null
        }
        if (!target) throw new StoreError(404, `没有找到标题匹配「${args.title}」的页面`)

        const page = await store.readPage(target.id)
        return { ok: true, page: pageView(page, includeBlocks) }
      },
    ),
  )

  /* ---------- notes_search ---------- */

  tools.push(
    tool(
      'notes_search',
      '在全部笔记里搜索（标题权重 3、正文权重 1），返回命中页面的 id/标题/摘要/更新时间。大小写与全角半角不敏感。',
      {
        query: { type: 'string', required: true, description: '搜索词（空串返回空结果）。' },
        limit: { type: 'number', description: '最多返回多少条，默认 50。' },
      },
      async (args = {}) => {
        const query = typeof args.query === 'string' ? args.query : ''
        const limit = args.limit === undefined || args.limit === null ? 50 : Number(args.limit)
        const results = store.search(query, Number.isFinite(limit) ? limit : 50)
        return { ok: true, query, count: results.length, results }
      },
    ),
  )

  /* ---------- notes_create_notebook ---------- */

  tools.push(
    tool(
      'notes_create_notebook',
      '新建笔记本（可挂在 parentId 下）。传 workspacePath 时同时把笔记本绑定到该工作区；' +
        '如果该工作区已经绑定过笔记本，直接返回已有的那个（existing=true），不会重复创建。',
      {
        title: { type: 'string', required: true, description: '笔记本标题。' },
        workspacePath: { type: 'string', description: '要绑定的工作区绝对路径（可选）。' },
        parentId: { type: 'string', description: '父笔记本 id（可选，缺省挂到根下）。' },
      },
      async (args = {}) => {
        const title = typeof args.title === 'string' ? args.title.trim() : ''
        if (!title) throw new StoreError(400, '笔记本标题不能为空')

        const normalized = args.workspacePath ? normalizeWorkspacePath(args.workspacePath) : null
        if (args.workspacePath && !normalized) throw new StoreError(400, '工作区路径无效')

        if (normalized && !args.parentId) {
          const bound = store.findByWorkspace(normalized)
          if (bound) return { ok: true, notebook: bound, existing: true }
        }

        const notebook = await store.createNotebook({
          parentId: args.parentId ? String(args.parentId) : null,
          title,
          workspacePath: normalized,
          workspaceLabel: normalized ? title : null,
        })
        return { ok: true, notebook, existing: false }
      },
    ),
  )

  /* ---------- notes_create_page ---------- */

  tools.push(
    tool(
      'notes_create_page',
      '在指定笔记本里新建一页笔记。正文可以给 markdown（会转成 BlockNote 块）或 blocks（BlockNote 块数组，优先）；' +
        'Markdown 镜像由块统一生成。返回新页面的详情（含 id 与 rev）。',
      {
        notebookId: { type: 'string', required: true, description: '目标笔记本 id。' },
        title: { type: 'string', required: true, description: '页面标题。' },
        markdown: { type: 'string', description: '初始 Markdown 正文（可选，会转成块）。' },
        blocks: {
          type: 'array',
          description: 'BlockNote 块数组（可选，优先于 markdown）。',
          items: { type: 'object', additionalProperties: true },
        },
      },
      async (args = {}) => {
        const hasBlocks = Array.isArray(args.blocks)
        const page = await store.createPage({
          notebookId: args.notebookId,
          title: args.title,
          blocks: hasBlocks ? args.blocks : undefined,
          markdown: hasBlocks ? undefined : args.markdown,
        })
        return { ok: true, page }
      },
    ),
  )

  /* ---------- notes_update ---------- */

  tools.push(
    tool(
      'notes_update',
      '保存笔记（替换整篇正文或只改标题）。markdown 会先转成 BlockNote 块再写入（有损），' +
        '镜像由块重新生成。建议先 notes_read 拿到 rev 再保存：rev 不匹配会报 409 并返回当前内容。' +
        '不传 rev 会跳过版本检查（可能覆盖别人的修改）；建议总是先 notes_read 拿 rev。rev 已随页面落盘，跨进程（UI / Agent）也会撞 409。',
      {
        pageId: { type: 'string', required: true, description: '页面 id。' },
        markdown: { type: 'string', description: '新的 Markdown 正文（整篇替换，会转成块）。' },
        title: { type: 'string', description: '新标题（可只改标题）。' },
        rev: { type: 'number', description: '上次读取到的版本号，用于乐观锁。' },
      },
      async (args = {}) => {
        const hasMarkdown = args.markdown !== undefined && args.markdown !== null
        const hasTitle = args.title !== undefined && args.title !== null
        if (!hasMarkdown && !hasTitle) throw new StoreError(400, '至少需要提供 markdown 或 title')

        const saved = await store.savePage({
          id: args.pageId,
          // markdown → blocks（契约 §6：store 不接受外部 markdown 当镜像）
          blocks: hasMarkdown ? markdownToBlocks(String(args.markdown)) : undefined,
          title: hasTitle ? args.title : undefined,
          rev: args.rev === undefined || args.rev === null ? undefined : Number(args.rev),
        })
        const out = { ok: true, page: saved.page }
        if (saved.conflictFile) out.conflictFile = saved.conflictFile
        if (hasMarkdown) out.lossy = true
        return out
      },
    ),
  )

  /* ---------- notes_append ---------- */

  tools.push(
    tool(
      'notes_append',
      '在笔记正文末尾追加一段 Markdown（转成块后追加，不会覆盖已有内容；镜像由全部块重新生成，有损）。' +
        '返回更新后的页面详情。',
      {
        pageId: { type: 'string', required: true, description: '页面 id。' },
        markdown: { type: 'string', required: true, description: '要追加的 Markdown 片段。' },
      },
      async (args = {}) => {
        const page = await store.appendPage({ id: args.pageId, markdown: args.markdown })
        return { ok: true, page, lossy: true }
      },
    ),
  )

  /* ---------- notes_delete ---------- */

  tools.push(
    tool(
      'notes_delete',
      '删除一页笔记或一个笔记本（连同子笔记本与页面），内容会移入回收站而不是彻底删除。' +
        '必须显式传 confirm=true 才会执行；pageId 与 notebookId 二选一。',
      {
        pageId: { type: 'string', description: '要删除的页面 id。' },
        notebookId: { type: 'string', description: '要删除的笔记本 id（连同子笔记本与全部页面）。' },
        confirm: { type: 'boolean', required: true, description: '必须为 true；用于防止误删。' },
      },
      async (args = {}) => {
        if (args.confirm !== true) throw new StoreError(400, '删除操作需要显式确认（confirm: true）')
        if (args.pageId && args.notebookId) throw new StoreError(400, 'pageId 与 notebookId 只能给一个')

        if (args.pageId) {
          const res = await store.deletePage(String(args.pageId))
          return { ok: true, deleted: 'page', trashed: res.trashed }
        }
        if (args.notebookId) {
          const res = await store.deleteNotebook(String(args.notebookId))
          return { ok: true, deleted: 'notebook', trashed: res.trashed, removedPages: res.removedPages }
        }
        throw new StoreError(400, '需要提供 pageId 或 notebookId')
      },
    ),
  )

  for (const item of tools) ctx.effect(() => ctx.tools.register(item))
}

module.exports = { registerTools, compileParameters }
