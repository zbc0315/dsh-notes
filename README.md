# @tom2012/dsh-notes

DSH Web 的笔记本插件：左侧栏一行「全部笔记本」，按工作区一键新建/打开子笔记本，TipTap 富文本编辑，Markdown 为真源，Agent 可直接读写同一份数据。

- 目标环境：DSH Web `0.2.1-rc.5`（profile `web`），Node ≥ 20
- 数据目录：`~/.dsh/notes`（Markdown + `index.json` + `assets/` + `.trash/`）
- 设计稿：[`docs/DESIGN.md`](docs/DESIGN.md)　存储契约：[`docs/STORE-CONTRACT.md`](docs/STORE-CONTRACT.md)

## 它解决什么

DSH 没有「给某个工作区记笔记」的地方。本插件把「工作区」变成笔记本的绑定字段：

- 侧栏面板列表多一行 **全部笔记本**（`order: 40`，排在 插件 / 记忆 / 自动化任务 / 技能库 之后）；
- 打开后顶部就是**当前工作区**：没有笔记本时显示「新建笔记本」，点一下就在根下建一个以工作区命名的子笔记本；已经有就变成「打开笔记本」，直达该笔记本；
- 面板内是完整的「笔记本树 + 编辑器」，可以建子笔记本、建页、改名、删除（进回收站）、搜索；
- 页面以 GFM Markdown 落盘，Agent 用 `notes_*` 工具读写的是同一份文件，UI 与工具永远一致。

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
| 加粗/标题/列表/引用/代码/表格/链接/图片 | 编辑器工具栏 |
| 立即保存 | `Cmd/Ctrl+S`（默认输入停止 800ms 自动保存） |
| 新建页面 | `Cmd/Ctrl+Shift+N` |
| 导出 Markdown | 右上角导出按钮 |

粘贴或拖入图片会自动上传到 `~/.dsh/notes/assets/<sha256>.<ext>`，正文里写成 `![name](/-/notes/asset?sha=…&ext=…)`，带宿主鉴权，不暴露绝对路径。

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
  index.json                  # 缓存索引，可随时从磁盘重建
  <notebookId>/<pageId>.md    # YAML frontmatter + GFM 正文（真源）
  assets/<sha256>.<ext>       # 内容寻址附件
  .trash/<timestamp>/…        # 删除的东西
```

页面文件：

```md
---
id: p_abc123
title: 周会记录
created: 2026-11-03T13:00:00.000Z
updated: 2026-11-03T13:20:00.000Z
tags: []
---

## 议题
- …
```

## 开发

```bash
npm install          # devDependencies：esbuild、react、TipTap 全家
npm run build        # src/client/index.js → client/bundle.js（ModuleLoader 包装，react 外置）
npm run check        # 宿主侧四个文件的语法检查
npm run selftest     # 路由 + 存储 + 客户端产物的端到端自测
npm test             # build + check + selftest
node --test test/store.test.mjs   # 存储层单测
```

- 宿主侧（`src/host/`）纯 CommonJS，零运行时依赖。
- 客户端侧（`src/client/`）用 JSX + ESM，打包成单文件；除 `react` / `react-dom` / `react/jsx-runtime` 外全部内联，与宿主版本解耦。
- 样式只用宿主的 `--dsw-*` 令牌，不覆盖宿主选择器。

## 已知限制（v0.1）

- 没有工作区行 action 插槽，所以入口在面板顶部 + （P1）会话菜单，不在工作区行本身；
- 多人实时协作、移动端、版本历史、跨设备同步都不在范围内；
- 同一页在多标签页同时编辑时用 `rev` 乐观锁，冲突提示「覆盖 / 载入最新」，不做自动合并。

MIT © zbc0315
