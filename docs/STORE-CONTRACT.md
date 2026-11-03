# NotesStore 契约（M1 实现依据）

本文件是 `src/host/store.js` 的唯一契约。**实现方与调用方都以此为准**，任一侧要改先改本文件。

- 文件：`src/host/store.js`（CommonJS，`'use strict'`，除 `node:` 内置模块外 **零依赖**）
- 导出：`module.exports = { NotesStore, StoreError, normalizeWorkspacePath, DEFAULT_OPTIONS }`
- 运行环境：Node ≥ 20，macOS/Linux
- 数据根：`~/.dsh/notes`（可由 config `rootDir` 覆盖）

---

## 1. 数据结构

### 1.1 Notebook

```js
{
  id: 'nb_xxx',            // 'nb_' + 12 位 base36；稳定不变
  parentId: null,          // null = 根的第一层；否则是父 notebook.id
  title: 'ask',
  workspacePath: null,     // 规范化绝对路径（realpath 后）；仅工作区绑定的笔记本有值
  workspaceLabel: null,    // 创建时的工作区显示名
  icon: null,              // 可选，emoji 或短字符串
  order: 0,                // 同级排序，升序
  createdAt: 1699000000000,
  updatedAt: 1699000000000
}
```

### 1.2 Page（索引里的行，**不含正文**）

```js
{
  id: 'p_xxx',             // 'p_' + 12 位 base36
  notebookId: 'nb_xxx',
  title: '周会记录',
  order: 0,
  rev: 1,                  // 乐观锁版本，每次成功保存 +1，初值 1
  createdAt: 1699000000000,
  updatedAt: 1699000000000,
  size: 1234               // 最近一次落盘的 markdown 字节数（UTF-8）
}
```

### 1.3 Page 详情（读页面时返回）

```js
{
  ...Page,                 // 上面的所有字段
  markdown: '## 议题\n- ...',
  mtimeMs: 1699000000000,  // 磁盘文件的 mtime（用于冲突检测）
  path: '/Users/tom/.dsh/notes/nb_xxx/p_xxx.md'
}
```

### 1.4 搜索结果行

```js
{ id, notebookId, title, snippet, updatedAt, score }
```

`snippet` 是命中位置前后各 ~40 字符的纯文本（单行，不含换行），无命中时为空串。

---

## 2. 磁盘布局

```
<rootDir>/
  index.json                    # { version: 1, notebooks: [...], pages: [...] }
  <notebookId>/<pageId>.md      # YAML frontmatter + GFM 正文
  assets/<sha256>.<ext>         # 内容寻址附件
  .trash/<YYYYMMDD-HHmmss-SSS>/ # 删除的目录/文件整块移入
```

页面文件（**frontmatter 字段顺序固定**，便于 git diff）：

```md
---
id: p_abc123def456
title: 周会记录
created: 2026-11-03T13:00:00.000Z
updated: 2026-11-03T13:20:00.000Z
tags: []
---

## 议题
- ...
```

规则：

- frontmatter 解析失败/缺失时，**不要**报错丢数据；把整个文件当正文，title 回落到文件名，`pages` 行按磁盘重建。
- 正文与 frontmatter 之间保留恰好一个空行（`---\n` 后一个空行再接正文）。正文原样保存，不做格式化。
- title 里含换行时替换为空格；含 `:` 时不需要引号（frontmatter 用简单 `key: value` 解析，值取第一个 `:` 之后的全部内容并 trim）。
- `index.json` 是**缓存**，磁盘 md 是**真源**。启动时以磁盘为准重建/校正。

---

## 3. 一致性

- **单写者**：进程内所有写操作串行（用一个 `this._queue` Promise 链，`_serial(fn)`）。
- **原子写**：`<file>.tmp-<pid>-<n>` → `fh.sync()` → `close` → `rename`。`index.json` 同理。
- **崩溃安全**：`index.json` 损坏（JSON.parse 抛错）时，备份为 `index.json.corrupt-<ts>`，然后按磁盘重建，不抛错。
- **页面级乐观锁**：`savePage` 传 `rev`；`rev !== 当前 rev` → 抛 `StoreError(409)`，`err.payload = 当前 Page 详情`。
- **外部改动**：`savePage` 传 `baseMtimeMs` + `baseSize`；与磁盘现状不一致（说明别人改过）→ 先把磁盘现状复制成 `<pageId>.conflict-<ts>.md`（同目录），然后照常写入，返回里带 `conflictFile`。
- **孤儿页**：`<notebookId>` 目录存在但 notebookId 不在 index 中 → 重建时补一条同名 notebook（title = 目录名）。

---

## 4. API

所有方法都是 **async**（除明确标注同步的）。错误一律抛 `StoreError`，带 `status`（400/404/409/413）与中文 `message`。

```js
class StoreError extends Error { constructor(status, message, payload) }
```

### 4.1 构造与初始化

```js
new NotesStore(options?)
// options: {
//   rootDir,          // 默认 path.join(os.homedir(), '.dsh', 'notes')
//   trashDir,         // 默认 path.join(rootDir, '.trash')
//   maxPageBytes,     // 默认 2 * 1024 * 1024
//   maxAssetBytes,    // 默认 16 * 1024 * 1024
// }

await store.init()          // 建目录、加载/重建 index，幂等（重复调用直接返回）
store.rootDir                // 绝对路径（只读属性）
```

### 4.2 树

```js
store.tree()
// → {
//     notebooks: [Notebook],                         // 已按 parentId/order 排好（先父后子、同级 order 升序）
//     pages: [Page],                                 // 不含 markdown，按 notebookId/order 排好
//     counts: { [notebookId]: number },              // 每个 notebook 的页面数（含子 notebook 累加）
//     rootDir: string,
//   }
```

**同步方法**，只读内存索引，`init()` 之后可用。

### 4.3 工作区绑定

```js
normalizeWorkspacePath(p)                    // 模块级函数：trim + 去尾部 / + path.resolve + realpath（失败则用 resolve 结果）
store.findByWorkspace(workspacePath)         // → Notebook | null（按规范化路径匹配，含子 notebook）
store.bindWorkspace({ workspacePath, title })// → Notebook。已有绑定则直接返回；否则在根下新建，标题去重
                                             //   （'ask' → 'ask (2)' → 'ask (3)'），返回新建的那个
```

### 4.4 页面

```js
await store.readPage(id)                 // → Page 详情（含 markdown）。不存在 → StoreError(404)
await store.createPage({ notebookId, title, markdown = '', order })  // → Page 详情
    // notebookId 不存在 → 404；title 缺省 '无标题'
await store.savePage({ id, title, markdown, rev, baseMtimeMs, baseSize })
    // → { page: Page 详情, conflictFile?: string }
    // markdown 超过 maxPageBytes → StoreError(413)
    // rev 不匹配 → StoreError(409) 且 err.payload = Page 详情
await store.appendPage({ id, markdown })  // → Page 详情（在正文末尾追加；自动补一个换行分隔）
await store.deletePage(id)                // → { trashed: string }（进回收站，物理文件移走）
await store.reorderPages({ notebookId, ids })  // → [Page]（ids 全序；未列出的按原顺序跟在后面）
```

### 4.5 笔记本

```js
await store.createNotebook({ parentId = null, title, workspacePath = null, workspaceLabel = null, icon = null })
    // → Notebook。parentId 不存在 → 404。title 为空 → 400
await store.updateNotebook({ id, title, parentId, order, icon, workspacePath, workspaceLabel })
    // → Notebook。只改传入的字段（undefined = 不改）。
    // 改 parentId 时禁止把 notebook 挂到自己的子孙下 → 400
await store.deleteNotebook(id)    // → { trashed: string, removedPages: number }
    // 连同子 notebook 与所有页面整块进回收站；不存在 → 404
await store.reorderNotebooks({ parentId, ids })   // → [Notebook]
```

### 4.6 搜索

```js
store.search(query, limit = 50)
// → [搜索结果行]，按 score 降序、updatedAt 降序
// 归一化：String.prototype.normalize('NFKC') + toLowerCase + 折叠空白
// 命中：title 命中权重 3，纯文本正文命中权重 1；纯文本 = 去掉 markdown 标记的近似文本
// query 为空 → 返回 []
```

纯文本提取要求（`plainText(markdown)`，模块级导出便于单测）：

- 去掉 frontmatter；
- 去掉代码围栏行（``` 及 ```lang）但保留代码内容；
- 去掉行首 `#`、`>`、`- `、`* `、`1. `、`- [ ] `、`- [x] ` 等标记；
- 去掉 `**`、`__`、`*`、`_`、`~~`、`` ` ``、`[text](url)` 里的 `(url)` 只留 text、图片 `![alt](url)` 只留 alt；
- 表格竖线换成空格；
- 折叠连续空白。

### 4.7 附件

```js
await store.putAsset(buffer, { ext, mime = '' })   // → { sha, ext, size }
    // ext 白名单：png jpg jpeg gif webp svg avif
    // 超过 maxAssetBytes → StoreError(413)；空 buffer → 400
store.assetPath(sha, ext)                        // → 绝对路径（不检查存在）；sha 非 64 位小写 hex → 400
store.assetUrl(sha, ext)                         // → '/-/notes/asset?sha=<sha>&ext=<ext>'
```

### 4.8 维护

```js
await store.rebuildIndex()    // 按磁盘重建 index.json，返回 { notebooks, pages } 计数
await store.ensureTrash()     // 建回收站目录（init 已做，幂等）
store.setTitle(id, title)     // 内部：写 frontmatter 用，不必暴露
await store.listTrash()       // → [{ bucket: '20261103-214500-123', entries: ['nb_x', 'p_y.md'], size: 1234 }]
                              //   按 bucket 名降序（新的在前）；.trash 不存在 → []
```

---

## 5. 索引校正规则（`init()` 时）

1. `index.json` 存在且可解析 → 用它作为起点；否则重建（损坏则先备份）。
2. 扫 `<rootDir>` 的每个一级目录（跳过 `assets`、`.trash`、`.` 开头）：
   - 目录名不在 `notebooks` 里 → 新建 Notebook（title = 目录名，order = 现有最大 +1）。
   - 扫目录里的 `*.md`：文件名（去 `.md`）不在 `pages` 里，或磁盘 mtime/size 与索引记录不一致 → 重读文件、校正 frontmatter、更新索引行。
   - 索引有、磁盘没有 → 从索引里删掉该页（文件被外部删除）。
3. `pages` 里指向不存在 notebook 的行 → 删除。
4. 校正结果与起点有差异 → 原子写回 `index.json`。

---

## 6. 单测（`test/store.test.mjs`）

用 `node:test`，每个用例在 `fs.mkdtempSync(os.tmpdir() + '/notes-')` 下建独立 `rootDir`，结束删除。

必须覆盖：

1. 新建父子笔记本 + 建页 + `tree()` 结构正确（counts 累加）。
2. `savePage` 往返：frontmatter 字段顺序、正文逐字不变、`rev` 自增。
3. `rev` 不匹配 → 409 且 `payload` 是当前内容。
4. `baseMtimeMs` 不匹配 → 生成 `.conflict-<ts>.md`，返回 `conflictFile`，新内容已落盘。
5. `deletePage` / `deleteNotebook` → 文件出现在 `.trash/` 下，`tree()` 里消失。
6. `index.json` 写成 `{`（损坏）→ `init()` 不抛错，备份出 `.corrupt-*`，按磁盘重建出同样的数据。
7. 外部新增一个 `nb_x/p_y.md` 文件 → 重新 `init()` 后被索引到。
8. 外部改一个页面的正文 → 重新 `init()` 后 `readPage` 返回新正文。
9. 搜索：标题命中、正文命中、NFKC 全角半角、大小写、`plainText` 里不含 markdown 标记。
10. `putAsset` 同一内容两次 → 同一 sha 只落一个文件；`assetPath` 拒绝 `../` 与非法 sha。
11. `bindWorkspace` 幂等 + 同名追加 ` (2)`。
12. 超过 `maxPageBytes` → 413。

---

## 7. Agent 工具（`src/host/tools.js`）

```js
module.exports = { registerTools }
function registerTools(ctx, store, options?)   // 用 ctx.tools.register + ctx.effect 注册
```

工具名与参数（`compileParameters` 语义：每个字段可带 `required: true`）：

| 工具 | 参数 |
| --- | --- |
| `notes_list` | `notebookId?` `workspace?` |
| `notes_read` | `pageId?` `title?` `notebookId?` |
| `notes_search` | `query` `limit?` |
| `notes_create_notebook` | `title` `workspacePath?` `parentId?` |
| `notes_create_page` | `notebookId` `title` `markdown?` |
| `notes_update` | `pageId` `markdown?` `title?` `rev?` |
| `notes_append` | `pageId` `markdown` |
| `notes_delete` | `pageId?` `notebookId?` `confirm`（必须为 `true`） |

返回值统一是 JSON 可序列化对象（带 `ok: true`），失败抛错。所有工具通过同一个 `store` 实例，**不得**自己读写文件。

`registerTools` 内部自带 `tool()` / `compileParameters()` 小工具（从 `@tom2012/dsh-memory` 抄同样的形状）：

```js
ctx.effect(() => ctx.tools.register({
  name, description,
  parameters: { type: 'object', properties, required? },
  output: { schema: { type: 'object', additionalProperties: true }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v) }] },
  execute: async (args) => value,
}))
```
