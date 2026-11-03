# dsh-notes 设计稿 v0.1

- 日期：2026-11-03
- 目标运行环境：DSH Web `0.2.1-rc.5`（profile `web`），Node ≥ 20，npm 包名 `@tom2012/dsh-notes`
- 状态：**设计待确认**（未写代码、未安装）

---

## 0. 结论摘要

| 项 | 结论 |
| --- | --- |
| 插件形态 | 持久化插件（Host 半 + Client 半），不是 agent preset、不是 MCP |
| 统一入口 | `sidebar.panellist` 新增一行「全部笔记本」，`order: 40`，排在 插件(0) / 记忆(5) / 自动化任务(10) / 技能库(35) 之后 |
| 主界面 | 注册 `main` keyed 槽 `notes`，里面是「笔记本树 + 富文本编辑区」双栏 |
| 工作区级新建 | DSH **没有**工作区行 action 插槽，无法把按钮直接钉在工作区行上（详见 §3）；P0 落在笔记本面板的工作区条 + P1 会话行前置图标/会话菜单 |
| 数据 | 以 Markdown（GFM + frontmatter）为真源，存于 `~/.dsh/notes/`，JSON 索引 + 原子写；可被 Agent 直接读写 |
| 富文本编辑器 | **BlockNote 0.57**（MPL-2.0，ProseMirror 内核，Notion 式块编辑）；选型对比见 §6 与 [EDITORS.md](EDITORS.md) |
| Agent 能力 | 一组 `notes_*` 工具，与 UI 走同一套 Host service |

---

## 1. 需求拆解与验收标准

| 编号 | 需求 | 验收标准 |
| --- | --- | --- |
| R1 | 左侧栏「全部笔记本」统一入口，位于「插件 / 记忆 / 自动化任务 / 技能库」下方 | 面板列表出现第 5 行（order 40），点击进入主面板；语言切换为英文时为 “All notebooks” |
| R2 | 在某个工作区的左侧栏点「新建笔记本」，在**根的下一层**创建以工作区名命名的子笔记本 | 当前工作区无笔记本时入口文案为「新建笔记本」；点击后树中出现该工作区的子笔记本，标题=工作区名，父节点=根 |
| R3 | 已经建过则入口显示「打开笔记本」 | 同一工作区第二次进入时，按钮/菜单/侧栏提示文案变为「打开笔记本」，点击直接定位到该子笔记本 |
| R4 | 全部笔记本统一浏览 | 面板左树显示根 + 全部工作区子笔记本 + 页面；支持搜索、重命名、删除 |
| R5 | 笔记可被 Agent 使用 | Agent 能通过工具列树、读页、写页、搜索；UI 与工具对同一操作结果一致 |
| R6 | 富文本编辑器选型调研 | 见 §6，给出许可、体积、集成方式与推荐 |

非目标（v0.1）：多人实时协作、移动端、附件视频、版本历史 UI、跨设备同步。

---

## 2. 现状调研（在本机实测）

### 2.1 左侧栏插槽

`Slots.listSubTree` 实测得到的关键座位：

- `sidebar`（整个左列）
  - `sidebar.panellist`（全局面板图标列表，list，注册项 `id/order/label`）
  - `sidebar.panellist.actions`（面板列表 More 菜单的行）
  - `sidebar.footer.action`（设置旁的脚部按钮）
  - `sidebar.workspaces`（**single**，整个工作区/会话浏览区，`replaceRisk: shadows-shipped-ui`）
    - `sidebar.session.row.leading`（每个会话行前 16px，props `{ sessionId }`）
    - `sidebar.workspaces.session.menu.item`（每个会话 “…” 菜单的行）
    - `sidebar.workspaces.session.row.action`（每个会话行悬停按钮）
- `main`（keyed，按面板 id 分发；已占用 `conversation`）
- `rightbar` / `sidebar.right.pane.tab`（右侧栏标签页）

现有面板行的 `order`（实测源码）：

| 面板 | 注册方 | order |
| --- | --- | --- |
| 插件 | `dsh-client-ui-plugin-manager` | 0 |
| 记忆 | `@tom2012/dsh-memory` | 5 |
| 自动化任务 | `dsh-client-ui-schedule` | 10 |
| 技能库 | `@yanglaofish/dsh-skill-manager` | 35 |

→ 「全部笔记本」取 `order: 40`，即“在它们下面”。

### 2.2 工作区行为什么不能直接加按钮

`dsh-client-ui-workspace` 的 `ProjectRowItem` 在悬停时的两个操作（新建会话 `+`、`…` 菜单的重命名/删除）是**写死在组件里的**，其 slots 声明只有 `sidebar.workspaces.session.menu.item` / `sidebar.workspaces.session.row.action`（**会话**级），没有 workspace 级的 `sidebar.workspaces.workspace.row.action`。`sidebar.workspaces` 本身是 single 槽，且它的 browser 组件没有从包里导出（只 export `apply`/`inject`），替换它 = 重写整个工作区浏览器。

这条限制决定了 §3 的方案取舍。

### 2.3 可用的 Host / Client 能力

- Client service：`ctx.layout.selectPanel(id)` / `openRightbar()`、`ctx.uiWorkspace.startSession(workspaceId)` / `openWorkspace()`、`ctx.workspaces.list`、`ctx.sidebarRightTabs.register()`、`ctx.locale.register()`。
- Host：`ctx.webServer` 注册同源路由（`/-/notes/*`，复用现有鉴权），`ctx.sessions` 取会话 cwd，`ctx.tools` 注册 Agent 工具，`ctx.workingDirectory`。
- 已有先例：`@tom2012/dsh-file-tree`（同源路由 + 右侧栏标签，已在本机 profile 运行）、`@tom2012/dsh-memory`（`sidebar.panellist` + `main` + 工具卡）。

---

## 3. 工作区级入口：方案对比（关键决策）

| 方案 | 做法 | 成本/风险 | 建议 |
| --- | --- | --- | --- |
| **A. 替换 `sidebar.workspaces`** | 重写工作区/会话树，在工作区行加「笔记本」按钮 | 高：复制整个 browser、`shadows-shipped-ui`、每次 DSH 升级都要跟 | 不采用 |
| **B. 面板入口 + 面板内工作区条** | 侧栏一行进「全部笔记本」；面板顶部有「当前工作区：ask → 新建/打开笔记本」，左树按工作区分组 | 低：全部走官方 list 槽 | **P0，推荐** |
| **C. 会话行前置图标 / 会话菜单项** | 每个会话行前的 16px 位显示 📓，或会话 “…” 菜单加「新建/打开笔记本」；点击即对**该会话所属工作区**操作 | 低-中：会出现在每一行，需要克制（默认只显示图标，config 可关） | **P1 增强**，默认开菜单项、图标默认关 |
| **D. 向上游提槽** | 给 `dsh-client-ui-workspace` 加 `sidebar.workspaces.workspace.row.action` | 一次投入，长期最干净 | 同步提 issue/PR |

**已确认采用 B + C**（2026-11-03，用户选择）。这样“某个工作区的左侧栏点新建笔记本”在体验上是成立的：打开笔记本面板后，面板顶部就是当前工作区；同时任一该工作区的会话行菜单都能一键新建/打开，不必先切面板。方案 A 与 D 保留为后续选项。

### 3.1 交互细节

- 新建：`title = 工作区名`；同名的已有子笔记本时追加 ` (2)`（除非该工作区已有绑定，则直接打开）。
- 判定「已存在」按 `workspacePath`（规范化 realpath）绑定，不按标题，避免用户改名后重复创建。
- 工作区重命名：笔记本标题**不**自动跟随（用户可能已改过），只在标题仍是旧工作区名时提示“是否同步改名”。
- 工作区删除：笔记本保留，标记为“游离”（orphan），统一面板可见、可删除/重新绑定。
- 空白会话（未选工作区）：入口禁用，提示先选工作区。

---

## 4. 信息架构与数据模型

### 4.1 实体

```ts
Notebook {
  id: string              // nanoid
  parentId: string | null // null = 根
  title: string
  workspacePath?: string  // 规范化绝对路径，绑定用
  workspaceLabel?: string // 创建时的工作区显示名
  icon?: string
  order: number
  createdAt: number
  updatedAt: number
}

Page {
  id: string
  notebookId: string
  title: string
  blocks: unknown[]       // BlockNote 文档（真源，保真）
  markdown: string        // 由 blocks 导出的 GFM 镜像（供搜索/导出/Agent 读）
  plainText: string       // 缓存，供搜索
  order: number
  rev: number             // 乐观锁
  createdAt: number
  updatedAt: number
}
```

### 4.2 目录布局

```
~/.dsh/notes/
  index.json                     # { version: 1, notebooks: [...], pages: [...] }
  <notebookId>/<pageId>.json     # BlockNote 文档（真源）+ frontmatter 同级的 meta
  <notebookId>/<pageId>.md       # 导出镜像（生成物，可 git、可被 read 工具读）
  assets/<sha256>.<ext>          # 图片等附件，按内容寻址
  .trash/<timestamp>/...         # 删除默认进回收站
```

页面示例（`<pageId>.json`）：

```json
{
  "id": "p_7f3a",
  "title": "周会记录",
  "created": "2026-11-03T13:00:00.000Z",
  "updated": "2026-11-03T13:20:00.000Z",
  "tags": ["meeting"],
  "blocks": [{ "type": "heading", "props": { "level": 2 }, "content": [{ "type": "text", "text": "议题" }] }]
}
```

**为什么真源变成 JSON 而不是 Markdown**：选定 BlockNote 后，块级属性（颜色、对齐、嵌套、折叠、自定义块）不能无损落进 GFM；Markdown 只做**导出镜像**，用于搜索、git diff、Agent 读取和外部导出。写入仍走 JSON，避免“存 Markdown → 再解析”的丢字段问题。Agent 写页时接受 Markdown，经 `tryParseMarkdownToBlocks` 转成块（这一步是有损的，工具会明确告知）。


### 4.3 一致性与并发

- 单写者：只有 Host 进程写文件；Client 通过路由发起。
- 原子写：临时文件 + `rename`；`index.json` 同样处理。
- 页面级乐观锁：保存带 `rev`，不匹配返回 `409` + 当前内容，UI 提示“他处已修改”。
- 自动保存：输入停止 800ms 落盘；切页/关面板立即 flush。
- 外部改动：保存前比较 `mtimeMs + size`，冲突时保留两份（`.conflict-<ts>.md`）。
- 索引重建：启动时扫目录；`index.json` 损坏则重建并备份。

### 4.4 搜索

v0.1 用内存索引（标题 + plainText 子串，大小写/全半角归一），页面数 < 5000 足够；不引入外部搜索引擎。

---

## 5. 架构

```
┌──────────────────────────── Client (web) ────────────────────────────┐
│ sidebar.panellist(id=notes, order=40, label=全部笔记本)                │
│        │ click → ctx.layout.selectPanel('notes')                     │
│        ▼                                                             │
│ main(key=notes) → <NotesApp>                                         │
│   ├─ 工作区条：当前工作区 + [新建笔记本]/[打开笔记本]                    │
│   ├─ 笔记本树（根 → 工作区子笔记本 → 页面）                             │
│   ├─ BlockNote 编辑器（BlockNoteView、自动保存、Markdown 镜像）          │
│   └─ 搜索 / 重命名 / 删除 / 导出                                       │
│  可选：sidebar.session.row.leading 图标、会话菜单项、右侧标签页(notes)   │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ fetch('/-/notes/*') 同源，复用 DSH 鉴权
┌───────────────────────────────▼──────────────────────────────────────┐
│ Host 插件                                                             │
│  routes: /tree /page /save /create /rename /delete /search /asset     │
│  service: NotesStore（唯一读写入口，UI 与工具共用）                     │
│  tools: notes_list / notes_read / notes_search / notes_create          │
│         notes_update / notes_append / notes_delete                    │
│  config: rootDir, autosaveMs, maxPageBytes, enableSessionRowEntry      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.1 包结构

```
dsh-notes/
  package.json            # dsh.bundle.patch + dsh.client
  cordis.patch.yml        # insert: id dsh-notes
  index.js                # Host：路由 + service + tools
  client/
    index.js              # Client 源码（自包含或 esbuild 入口）
    bundle.js             # __ModuleLoader__ 工厂，react 外置
  src/host/...            # store / routes / tools
  src/client/...          # NotesApp / Tree / Editor / api
  locale/{zh,en}.json
  icon.svg
  docs/DESIGN.md
  tools/build.mjs         # esbuild，external: react
```

- Client 依赖 React 仅从宿主模块表 `require('react')`；BlockNote、ProseMirror、Mantine 主题全部打进 `bundle.js`（esbuild，`external: ['react','react-dom']`）。
- 只用 `--dsw-alias-*` 主题令牌；控件自写，不 import DSH Client 包。

### 5.1.1 槽注册的两条硬约束（2026-11-03 实测踩坑）

1. **`label` 只能是字符串或函数**。宿主 `resolveSlotLabel` 只做 `typeof label === 'function' ? label() : label`，对象会被原样交给 React 当子元素渲染 → React #31，**整个 sidebar 槽崩成空白竖条**。要跟随语言用 `() => dict().label`，不要传 `{ zh, en }`。
2. **没有 label 消费者的槽不要传 `label`**。例如 `sidebar.workspaces.session.menu.item`，菜单文案由组件自己渲染；传函数/对象同样可能被当 React child。

### 5.1.2 Host 路由的注册约束

`ctx.effect(() => webServer.register({...}))` **必须 `return` register 返回的 disposer**。插件在 install / 热重载时会重新 apply：旧路由若泄漏，会继续指向已释放的 `ctx`（每次请求在 `ctx.connection` 处抛错 → 503）；同路径重复注册还会直接抛 duplicate，导致新上下文中断（工具不再注册）。详见 `test/routes-lifecycle.test.mjs`。

### 5.2 路由（v0.1）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/-/notes/tree` | 笔记本树 + 页面索引 |
| GET | `/-/notes/page?id=` | 读取页面（markdown + rev） |
| PUT | `/-/notes/page?id=` | 保存（body: markdown, title, rev） |
| POST | `/-/notes/notebook` | 新建（parentId, title, workspacePath?） |
| PATCH | `/-/notes/notebook?id=` | 重命名/改父级/排序 |
| DELETE | `/-/notes/notebook?id=` | 删除（进回收站） |
| DELETE | `/-/notes/page?id=` | 删除页面 |
| POST | `/-/notes/asset` | 上传图片，返回 `asset://<sha>` |
| GET | `/-/notes/asset?sha=` | 读取附件 |
| GET | `/-/notes/search?q=` | 搜索 |

### 5.3 Agent 工具

一个工具多 action 还是多个工具？建议**多个窄工具**（模型更易选对），参数与路由同构：

- `notes_list`（可选 workspace）
- `notes_read`（pageId 或 title）
- `notes_search`（query）
- `notes_create_notebook`（title, workspacePath?, parentId?）
- `notes_create_page`（notebookId, title）
- `notes_update`（pageId, markdown, rev）
- `notes_append`（pageId, markdown）

工具结果返回 id/标题/更新时间，便于连续操作；删除类操作要求显式 `confirm` 参数。

---

## 6. 富文本编辑器调研（开源、可直接复用）

### 6.1 对比（npm 实测，2026-11-03）

体积为 esbuild `--minify`、`react/react-dom` 外置后的单文件大小（gzip -9），仅代表“典型配置”，不是极限值：

| 库 | 版本 | 许可 | 内核 | 数据模型 | Markdown | React 19 | 体积 (raw/gzip) | 适配点评 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **TipTap** | 3.32.2 | MIT（Pro 扩展另售） | ProseMirror | JSON / HTML | 官方 `@tiptap/markdown` | ✅ | 459 KB / **145 KB** | 生态最大、扩展即插即用、无头可完全自绘 UI；无头方向首选（未选） |
| Lexical | 0.53.0 | MIT | 自研 | JSON | 需转换 | ✅ | 463 KB / 152 KB | 性能好、React 一等公民，但仍是 0.x，块级功能要自己写 |
| BlockNote | 0.57.0 | MPL-2.0（`xl-*` 为 GPL-3.0 或商业） | ProseMirror | JSON | 需转换 | ✅ | 6.2 MB / 1.43 MB | **已选定**；开箱即 Notion（斜杠菜单/拖拽块），体积大、弱 copyleft、XL 包许可要避开 |
| Milkdown | 7.23.0 | MIT | ProseMirror | Markdown 原生 | ✅ 原生 | ✅ | 未测 | Markdown 真源时最省心；插件生态小于 TipTap |
| Plate | 53.5.2 | MIT | Slate | JSON | 需转换 | ✅ | 未测 | 定制自由度极高，和 shadcn 风格契合；文档/组件偏多 |
| Editor.js | 2.31.7 | Apache-2.0 | 自研 | Block JSON | 需转换 | ⚠️ | 轻 | 块编辑器，不是内联富文本；适合结构化表单，不适合笔记 |
| Quill 2 | 2.0.3 | BSD-3 | 自研 | Delta | 需转换 | ⚠️（社区封装滞后） | 中 | 成熟稳定，但现代化扩展/协作弱 |
| ProseMirror | 1.25.12 | MIT | — | JSON | `prosemirror-markdown` | 无 UI | 小 | 最底层，等于自研编辑器，工作量最大 |
| MDXEditor | 4.5.0 | MIT | Lexical/CodeMirror | Markdown | ✅ | ✅ | 中 | 面向 MDX 文档，笔记场景可但定制面窄 |
| BlockSuite（AFFiNE） | 0.22.4 | MIT | 自研 | Block | 需转换 | ✅ | 大 | 整套文档框架，接入成本高于收益 |
| Yjs + Hocuspocus | 13.6.33 / 4.8.0 | MIT | — | CRDT | — | — | 小 | 不是编辑器，是后续实时协作/多端同步的底座 |

> 实测命令与产物保留在 `/tmp/edb`（TipTap：StarterKit + Link + TaskList/TaskItem + TableKit；Lexical：RichText + History + List + Table；BlockNote：`@blocknote/mantine`）。

参考：[TipTap 文档](https://tiptap.dev/docs)、[BlockNote 定价/许可](https://www.blocknotejs.org/pricing)、[Lexical 文档](https://lexical.dev)、[BlockNote 从 Lexical 迁移说明](https://tiptap.dev/docs/guides/migrate-from-lexical)。版本/许可取自 npm registry（2026-11-03）。

### 6.2 选定结果：BlockNote（2026-11-03）

用户看完三个可点击小样后选定 **BlockNote 0.57**（Notion 块编辑、`BlockNoteView`、成熟的主题变量体系）。完整候选与体积对比见 [EDITORS.md](</Users/tom/Projects/dsh-notes/docs/EDITORS.md>)。

**许可边界**：`@blocknote/core|react|mantine` 是 MPL-2.0——以依赖方式使用、只做主题/样式覆盖、不修改其源文件，即可闭源分发本插件；`@blocknote/xl-*`（AI、PDF 导出）是 GPL-3.0 或商业许可，**不引入**。

**已知代价**：
- 首屏 JS 6.2 MB（gzip 1.43 MB），远程链路首开明显慢于另外两个候选 → 需要骨架屏，并把编辑器视图做成面板打开时才加载。
- Markdown 往返有损：块级属性（颜色/对齐/嵌套/自定义块）不能全部落进 GFM → 真源改为 BlockNote JSON，Markdown 只做导出镜像（见 §4.2）。
- 默认 Mantine 主题要换成 DSH 令牌（`--dsw-alias-*`），否则会出现第二套设计语言。

**为什么不是另外两个**：Milkdown Crepe 排版更精致但主题定制面窄、体积 924 KB 也不小；Vditor 最轻但块拖拽/Notion 式交互弱，且默认资源加载方式偏 CDN。

### 6.3 集成要点（BlockNote）

- 组件：`BlockNoteView`（`@blocknote/mantine`），`editor` 由 `useCreateBlockNote` 创建；面板打开时才 `import()`，避免每次进 GUI 都加载 6.2 MB。
- 主题：把 BlockNote 的 CSS 变量映射到 DSH 令牌（`--bn-colors-editor-text` → `--dsw-alias-label-primary` 等），`theme` 跟随宿主深浅色；不引入 Mantine 的全局 Provider。
- 内容：`editor.document`（blocks JSON）为真源；保存时同时生成 Markdown 镜像（`blocksToMarkdownLossy`）供搜索/导出/Agent 读。
- 图片：粘贴/拖入 → `POST /-/notes/asset` → 自定义 image block 指向 `asset://<sha>`，渲染走同源路由（带鉴权）。
- 斜杠菜单：用 BlockNote 自带 suggestion menu，项按 DSH 习惯收敛（标题/列表/待办/引用/代码/表格/图片）。
- 快捷键：`Cmd/Ctrl+S` 立即保存；不覆盖 BlockNote 自己的编辑快捷键。
- 无障碍：编辑区 `aria-label`、工具栏按钮 `aria-pressed`，焦点环不吞宿主快捷键。

## 7. 里程碑

| 阶段 | 内容 | 预估 | 完成判据 |
| --- | --- | --- | --- |
| M0 | 包骨架、patch、manifest、locale、图标、esbuild、安装冒烟 | 1d | 面板行出现、点开是空态页 |
| M1 | 存储层（index/pages/assets、原子写、回收站、搜索）+ 单测 | 2d | 断电式写入无损坏；搜索命中 |
| M2 | 面板与树（根/工作区子笔记本/页面、创建/改名/删除、工作区条） | 2d | R1–R4 可演示 |
| M3 | BlockNote 接入、JSON→Markdown 镜像、自动保存、图片 | 3d | 编辑/刷新/重启内容一致 |
| M4 | Agent 工具（7 个）与 UI 共用 service | 1d | 工具与 UI 结果一致 |
| M5 | 打磨（快捷键、空态、冲突、导出、暗色、a11y） | 2d | 验收清单全过 |
| M6（可选） | 会话行入口、右侧标签页、Yjs 协作 | 3d+ | — |

---

## 8. 风险与开放问题

1. **工作区行没有插槽**（最大不确定性）：若必须“按钮就在工作区行”，只能走方案 A（重写浏览器）。建议先用 B+C，或同步给 DSH 提 `workspace.row.action` 槽。
2. **编辑器体积**：BlockNote 首屏 gzip 1.43 MB，必须懒加载 + 骨架屏；后续若加 AI/PDF 导出，注意 `xl-*` 的 GPL/商业许可，默认不引入。
3. **工作区重命名/删除**后的归属与“游离笔记本”策略需要产品确认。
4. **附件鉴权**：`asset://` 必须走同源路由并校验页面归属，避免路径穿越（参考 file-tree 的 realpath 约束）。
5. **多窗口/多标签页**同时编辑同一页：v0.1 用 rev 冲突提示，不做实时合并。
6. **DSH 版本漂移**：slot 名与服务以 `0.2.1-rc.5` 为准；升级后需回归 `sidebar.panellist` / `main`。

---

## 9. 验收清单（v0.1）

- [ ] 侧栏面板列表第 5 行「全部笔记本」，位于技能库之下
- [ ] 面板内当前工作区无笔记本时显示「新建笔记本」，点击后根下出现同名子笔记本
- [ ] 再次进入显示「打开笔记本」，点击直达该子笔记本
- [ ] 两个工作区各自拥有独立子笔记本，互不覆盖
- [ ] 页面自动保存，刷新/重启不丢；外部改文件可检测冲突
- [ ] 搜索能按标题/正文命中
- [ ] Agent 工具可列出、读取、写入、搜索，且与 UI 状态一致
- [ ] 暗色/亮色均使用宿主令牌；中英文文案完整
- [ ] 卸载插件后侧栏入口与主面板消失，数据保留
