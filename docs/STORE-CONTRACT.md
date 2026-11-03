# NotesStore 契约 v2（BlockNote 版，M1/M3/M4 实现依据）

> v2 变更（2026-11-03）：真源从 Markdown 改为 **BlockNote blocks JSON**，Markdown 降级为导出镜像。
> 依据 `docs/DESIGN.md` v0.2 §4.1 / §4.2 / §6.3。v1 的 Markdown 真源契约作废。
> 本文件是 `src/host/store.js`、`src/host/markdown-blocks.js`、`src/host/tools.js` 的唯一契约。

- 文件：CommonJS，`'use strict'`，除 `node:fs` / `node:path` / `node:os` / `node:crypto` 外**零依赖**
- `store.js` 导出：`{ NotesStore, StoreError, normalizeWorkspacePath, DEFAULT_OPTIONS }`
- `markdown-blocks.js` 导出：`{ markdownToBlocks, blocksToMarkdown, blocksToPlainText }`
- 数据根：`~/.dsh/notes`（可配置）

---

## 1. 数据结构

### 1.1 Notebook

与 v1 相同：

```js
{ id: 'nb_xxx', parentId: null, title: 'ask', workspacePath: null, workspaceLabel: null,
  icon: null, order: 0, createdAt: 0, updatedAt: 0 }
```

### 1.2 Page（索引行，不含正文）

```js
{ id: 'p_xxx', notebookId: 'nb_xxx', title: '周会记录', order: 0, rev: 1,
  createdAt: 0, updatedAt: 0,
  size: 1234 }        // blocks JSON 序列化后的字节数
```

> 内部可存 `mtimeMs`（用于与磁盘比对），但**对外返回时必须剥离**。

### 1.3 Page 详情

```js
{ ...Page,
  blocks: [ /* BlockNote 默认 schema 的块数组 */ ],
  markdown: '## 议题\n\n- 甲\n',
  mtimeMs: 0,
  path: '/Users/tom/.dsh/notes/nb_xxx/p_xxx.json' }
```

### 1.4 搜索结果行

`{ id, notebookId, title, snippet, updatedAt, score }`（同 v1；正文命中在 Markdown 镜像文本上算）

---

## 2. 磁盘布局

```
<rootDir>/
  index.json                        # { version: 1, notebooks: [...], pages: [...] }
  <notebookId>/<pageId>.json        # 真源：{ id, title, created, updated, tags, blocks }
  <notebookId>/<pageId>.md          # 镜像：YAML frontmatter + blocksToMarkdown(blocks)
  assets/<sha256>.<ext>             # 内容寻址附件
  .trash/<YYYYMMDD-HHmmss-SSS>/     # 删除的整块移入
```

`<pageId>.json` 字段顺序固定：

```json
{
  "id": "p_abc",
  "title": "周会记录",
  "created": "2026-11-03T13:00:00.000Z",
  "updated": "2026-11-03T13:20:00.000Z",
  "tags": [],
  "blocks": [ ... ]
}
```

规则：

- `.json` 是唯一真源；`.md` 每次保存后重写，**不读回**（除迁移）。
- `.json` 解析失败 → 该页跳过并在索引里标记，不要让 `init()` 抛错。
- 只有 `.md` 没有 `.json`（v1 遗留）→ 按 `markdownToBlocks(md)` 迁移出 `.json`，随后照常。
- 图片 URL 在 blocks 里存 `asset://<sha>.<ext>`；客户端渲染前换成 `/-/notes/asset?sha=…&ext=…`，保存前换回来。store 不做这个改写，只原样存取。

---

## 3. 一致性（同 v1，仅文件换成 .json）

- 写操作串行（`_serial` Promise 链）。
- 原子写：`tmp-<pid>-<n>` → `fh.sync()` → `close` → `rename`。
- `index.json` 损坏 → 备份 `index.json.corrupt-<ts>`，按磁盘重建。
- 乐观锁：`rev` 不匹配 → `StoreError(409)`，`err.payload` = 当前 Page 详情。
- 外部改动：`baseMtimeMs` / `baseSize` 与磁盘 `.json` 不一致 → 先把磁盘现状复制成 `<pageId>.conflict-<ts>.json`，再照常写入，返回 `conflictFile`。

---

## 4. API

错误一律抛 `StoreError(status, message, payload?)`（400/404/409/413）。除标注同步外都是 async。

### 4.1 构造与初始化

```js
new NotesStore({ rootDir, trashDir, maxPageBytes, maxAssetBytes })
await store.init()        // 幂等
store.rootDir             // 绝对路径
```

### 4.2 树

```js
store.tree()   // 同步；→ { notebooks: [Notebook], pages: [Page行], counts: { [notebookId]: n }, rootDir }
```

### 4.3 工作区绑定（与 v1 相同）

```js
normalizeWorkspacePath(p)                      // 模块级
store.findByWorkspace(workspacePath)           // → Notebook | null
await store.bindWorkspace({ workspacePath, title, workspaceLabel })  // → Notebook
```

### 4.4 页面

```js
await store.readPage(id)   // → Page 详情（含 blocks 与 markdown）

await store.createPage({ notebookId, title, blocks, markdown, order })
// blocks 缺省 []；只给 markdown 时先 markdownToBlocks 再统一生成镜像
// → Page 详情

await store.savePage({ id, title, blocks, rev, baseMtimeMs, baseSize })
// blocks 省略 = 不动正文（只改标题）
// Markdown 镜像**始终**由 blocksToMarkdown(blocks) 生成（不接受外部 markdown：
// BlockNote 0.57 的 blocksToMarkdownLossy 会输出 4 空格悬挂缩进，不能当镜像）
// → { page: Page 详情, conflictFile?: string }
// blocks JSON 超过 maxPageBytes → 413

await store.appendPage({ id, markdown })
// 把 markdown 转成块后追加到文档末尾 → Page 详情

await store.deletePage(id)                    // → { trashed }
await store.reorderPages({ notebookId, ids }) // → [Page行]
```

### 4.5 笔记本（与 v1 相同的 5 个）

`createNotebook` / `updateNotebook` / `deleteNotebook` / `reorderNotebooks`，签名与语义不变。

### 4.6 搜索

```js
store.search(query, limit = 50)   // 同 v1，只是命中文本来自 Markdown 镜像
```

### 4.7 附件（与 v1 相同）

```js
await store.putAsset(buffer, { ext, mime })   // → { sha, ext, size }
store.assetPath(sha, ext)
store.assetUrl(sha, ext)
```

### 4.8 维护

```js
await store.rebuildIndex()      // → { notebooks, pages }
await store.ensureTrash()
await store.listTrash()         // → [{ bucket, entries, size }]，bucket 降序
```

---

## 5. `markdown-blocks.js`

纯函数、无 IO、可单测。

```js
markdownToBlocks(md)      // → BlockNote 默认 schema 的块数组（每块带 id: 'b_<12 base36>'）
blocksToMarkdown(blocks)  // → GFM 字符串（结尾换行）
blocksToPlainText(blocks) // → 单行纯文本（供搜索）
```

`markdownToBlocks` 必须产出**BlockNote 能直接 `initialContent` 的完整块**：

```js
{ id, type, props, content, children }
```

- `paragraph`：`props: { textAlignment: 'left', backgroundColor: 'default', textColor: 'default' }`，`content: [inline…]`
- `heading`：`props: { level: 1|2|3, isToggleable: false, textAlignment: 'left', backgroundColor: 'default', textColor: 'default' }`
- `bulletListItem` / `numberedListItem`：`props: { textAlignment, backgroundColor, textColor }`
- `checkListItem`：额外 `checked: boolean`
- `quote`：同 paragraph 的 props
- `codeBlock`：`props: { language: '' }`，`content: [{ type: 'text', text, styles: {} }]`（整段一个 text，不加行内标记）
- `image`：`props: { url, caption: '', previewWidth: 512 }`，**没有 content**
- `divider`：`props: {}`，**没有 content**
- `table`：`content: { type: 'tableContent', rows: [{ cells: [inline[] | { type:'tableCell', content, props:{colspan:1,rowspan:1,backgroundColor:'default',textAlignment:'left'} }] }] }`
  实现标记为 `best-effort`（GFM 表格 → 表格块）；解析不了就退回成段落文本。
- 行内：`{ type: 'text', text: '…', styles: {} }`，支持 `bold` / `italic` / `code` / `strike` 的简单切分（嵌套标记可以丢掉样式，**不要丢文字**）
- `children: []` 一律给空数组（列表缩进不要求还原）
- 表格/任务列表/代码块**必须**能往返（见验收）

单测要求（`test/markdown-blocks.test.mjs`，node:test）：
1. 标题 1–3 级 → heading(level)
2. 段落 + 空行
3. 无序/有序列表
4. 任务列表 `- [ ]` / `- [x]` → checkListItem(checked)
5. 引用 `>` → quote
6. 代码围栏（带语言）→ codeBlock(language)
7. 图片 `![alt](url)` → image(url, caption=alt)
8. `---` → divider
9. 表格（2×2 + 表头）→ table 块
10. `blocksToMarkdown(markdownToBlocks(md))` 对上述 1–8 语义等价（空白/标记细节可不同，标题层级/列表类型/checked/代码内容/图片 url 必须一致）
11. `blocksToPlainText` 不含 `#`/`-`/`` ` `` 等标记
12. 空串 → `[]`；`blocksToMarkdown([])` → `''`

---

## 6. 工具（`src/host/tools.js`）

工具名与 v1 相同（8 个），参数不变，差异在**返回值与写入语义**：

| 工具 | 变化 |
| --- | --- |
| `notes_read` | 返回 `{ ok, page: { id, notebookId, title, rev, updatedAt, markdown, blocks } }` |
| `notes_update` | `markdown` 经 `markdownToBlocks` 转块写入；镜像由 blocks 重新生成；结果带 `lossy: true` 提示 |
| `notes_append` | 同上，追加到末尾 |
| `notes_create_page` | 可传 `markdown`（转块）或 `blocks` |
| 其余 | 不变 |

`registerTools(ctx, store, options)` 形状不变，内部仍用同一个 `store` 实例，不自己读写文件。
