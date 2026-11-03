# @tom2012/dsh-notes

DSH Web 的笔记本插件：左侧栏一行「全部笔记本」，按工作区一键新建/打开子笔记本，BlockNote 块编辑器（Notion 式斜杠菜单/拖拽块），blocks JSON 为真源 + Markdown 导出镜像，Agent 可直接读写同一份数据。

- 目标环境：DSH Web `0.2.1-rc.5`（profile `web`），Node ≥ 20
- 数据目录：`~/.dsh/notes`（`<pageId>.json` 真源 + `<pageId>.md` 镜像 + `index.json` + `assets/` + `.trash/`）
- 设计稿：[`docs/DESIGN.md`](docs/DESIGN.md)　存储契约：[`docs/STORE-CONTRACT.md`](docs/STORE-CONTRACT.md)

## 它解决什么

DSH 没有「给某个工作区记笔记」的地方。本插件把「工作区」变成笔记本的绑定字段：

- 侧栏面板列表多一行 **全部笔记本**（`order: 40`，排在 插件 / 记忆 / 自动化任务 / 技能库 之后）；
- 打开后顶部就是**当前工作区**：没有笔记本时显示「新建笔记本」，点一下就在根下建一个以工作区命名的子笔记本；已经有就变成「打开笔记本」，直达该笔记本；
- 面板内是完整的「笔记本树 + 编辑器」，可以建子笔记本、建页、改名、删除（进回收站）、搜索；
- 页面真源是 BlockNote 的 blocks JSON（块级属性不丢），同时落一份 GFM Markdown 镜像；Agent 用 `notes_*` 工具读写的是同一份数据，UI 与工具永远一致。

## 安装

```bash
# 开发态（本机目录直连，改 client 后需要 npm run build）
dsh plugin --profile web add link:/Users/tom/Projects/dsh-notes
```

装完把 `@tom2012/dsh-notes` 加进 profile 的 `package.json` → `dsh.profile.bundles`，**重启 dsh web**（宿主插件不热加载），刷新页面。

卸载：

```bash
dsh plugin --profile web remove @tom2012/dsh-notes
```

卸载后侧栏入口与主面板消失，`~/.dsh/notes` 里的数据保留。

## 使用

| 操作 | 位置 |
| --- | --- |
| 新建/打开当前工作区的笔记本 | 面板顶部工作区条 |
| 新建子笔记本 / 页面 | 树里笔记本行的悬停按钮 |
| 改名 / 删除 | 行悬停按钮（删除进 `.trash/`，可手工找回） |
| 搜索 | 顶部搜索框，`Cmd/Ctrl+P` 聚焦 |
| 标题/列表/待办/引用/代码/表格/图片 | `/` 斜杠菜单（BlockNote 自带） |
| 立即保存 | `Cmd/Ctrl+S`（默认输入停止 800ms 自动保存） |
| 新建页面 | `Cmd/Ctrl+Shift+N` |
| 导出 Markdown | 右上角导出按钮 |

粘贴或拖入图片会自动上传到 `~/.dsh/notes/assets/<sha256>.<ext>`，块里存 `asset://<sha>.<ext>`，渲染时经 `resolveFileUrl` 换成同源路由 `/-/notes/asset?sha=…&ext=…`（带宿主鉴权，不暴露绝对路径）。

## Agent 工具

| 工具 | 参数 |
| --- | --- |
| `notes_list` | `notebookId?` `workspace?` |
| `notes_read` | `pageId?` `title?` `notebookId?` |
| `notes_search` | `query` `limit?` |
| `notes_create_notebook` | `title` `workspacePath?` `parentId?` |
| `notes_create_page` | `notebookId` `title` `markdown?` |
| `notes_update` | `pageId` `markdown?` `title?` `rev?` |
| `notes_append` | `pageId` `markdown` |
| `notes_delete` | `pageId?` `notebookId?` `confirm` |

工具与 UI 共用同一个 `NotesStore` 实例（`src/host/store.js`），不存在两套写路径。

## 磁盘布局

```
~/.dsh/notes/
  index.json                    # 缓存索引，可随时从磁盘重建
  <notebookId>/<pageId>.json    # BlockNote 文档（真源，保真）
  <notebookId>/<pageId>.md      # Markdown 镜像（生成物，可 git、可被 read 工具读）
  assets/<sha256>.<ext>         # 内容寻址附件
  .trash/<timestamp>/…          # 删除的东西
```

页面真源：

```json
{
  "id": "p_abc123",
  "title": "周会记录",
  "created": "2026-11-03T13:00:00.000Z",
  "updated": "2026-11-03T13:20:00.000Z",
  "tags": [],
  "blocks": [{ "type": "heading", "props": { "level": 2 }, "content": [{ "type": "text", "text": "议题", "styles": {} }] }]
}
```

镜像由 host 的 `blocksToMarkdown(blocks)` 生成（单一生成器；不用 BlockNote 自己的
`blocksToMarkdownLossy`，因为 0.57 会给块之间插 4 空格悬挂缩进）。

## 开发

```bash
npm install          # devDependencies：esbuild、react、BlockNote、jsdom
npm run build        # 三个产物：client/bundle.js（主包）、client/editor.js（BlockNote 重包）、client/editor.css
npm run check        # 宿主侧五个文件的语法检查
npm run selftest     # 路由 + 存储 + 静态产物 + 工具 的端到端自测
npm run smoke        # jsdom 里真渲染主包 + 重包（含 BlockNote）
npm test             # 以上全部 + 两个单测文件
node --test test/markdown-blocks.test.mjs   # markdown ↔ blocks 往返
node --test test/store.test.mjs             # 存储层
```

- 宿主侧（`src/host/`）纯 CommonJS，零运行时依赖；`markdown-blocks.js` 是纯函数转换器。
- 客户端侧（`src/client/`）用 JSX + ESM，打两份：主包很小（~40 KB），BlockNote 那一份
  gzip ≈1.4 MB、面板打开才 `import()`；两份都只外置 `react` / `react-dom` / `react/jsx-runtime`，
  且共用同一个 React 实例（主包把实例递给重包），与宿主版本解耦。
- 样式只用宿主的 `--dsw-*` 令牌，不覆盖宿主选择器。

## 已知限制（v0.1）

- 没有工作区行 action 插槽，所以入口在面板顶部 + （P1）会话菜单，不在工作区行本身；
- 多人实时协作、移动端、版本历史、跨设备同步都不在范围内；
- 同一页在多标签页同时编辑时用 `rev` 乐观锁，冲突提示「覆盖 / 载入最新」，不做自动合并。

## 许可

本插件代码 MIT。内置的 `@blocknote/core|react|mantine` 为 MPL-2.0（以依赖方式使用、
未修改其源文件）；`@blocknote/xl-*`（AI/PDF 导出）为 GPL-3.0 或商业许可，本项目不引入。

MIT © zbc0315
