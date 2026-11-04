# 富文本编辑器候选清单（v0.2）

> **已选定：BlockNote 0.57**（2026-11-03，用户看完三份可点击小样后确认）。本文保留完整候选与评测数据，供以后替换/复盘。

- 日期：2026-11-03
- 用途：dsh-notes 笔记本的编辑内核选型
- 评测口径：esbuild `--minify`、`react`/`react-dom` 外置、gzip -9；数字是“最小可用配置”，不是极限值；未测标 `—`
- 版本/许可/发布时间取自 npm registry（2026-11-03）

> 先说明一件事：上一版推荐的 **TipTap 是无头（headless）库**，它本身没有工具栏、斜杠菜单、块拖拽——那些界面是使用方自己画的。如果“不好”指的是默认观感，那么换成下面任意一个“自带界面”的方案就会立刻不一样；如果“不好”指的是能力/生态，再按表里的强项挑。

---

## 1. 一页总表

| # | 方案 | 类型 | 许可 | 体积 gzip | 默认界面 | 维护 | 一句话 |
|---|---|---|---|---|---|---|---|
| 1 | **BlockNote** 0.57 ✅ 已选 | Notion 块编辑器 | MPL-2.0 | **1.43 MB** | ✅ 完整 | 活跃 | 开箱最像 Notion，代价是重；`xl-*`（AI/PDF）是 GPL/商业，别碰 |
| 2 | **Yoopta-Editor** 6.0 | Notion 块编辑器 | MIT | **101 KB** | ✅ 块菜单/工具栏 | 活跃 | 轻量版 BlockNote，块插件化，生态较小 |
| 3 | **Milkdown Crepe** 7.23 | Markdown WYSIWYG | MIT | **924 KB** | ✅ 完整 | 活跃 | 自带斜杠菜单/表格/LaTeX/代码，开箱最漂亮之一 |
| 4 | **Toast UI Editor** 3.2 | Markdown 双模式 | MIT | **177 KB** | ✅ 完整 | ⚠️ 2023 后未更新 | Markdown/WYSIWYG 双栏，中文资料多，但已停更 |
| 5 | **Vditor** 4.0 | Markdown 三模式 | MIT | **74 KB** | ✅ 完整 | 活跃 | 国产、中文排版好、所见即所得/即时渲染/分屏；默认走 CDN 资源 |
| 6 | **MDXEditor** 4.5 | Markdown React | MIT | — | ✅ 工具栏 | 活跃 | React 组件式 Markdown 编辑器，MDX 场景强，笔记场景偏文档 |
| 7 | **TipTap** 3.32 | 无头引擎 | MIT | **145 KB** | ❌ 自绘 | 非常活跃 | 生态最大，ProseMirror 底座，Markdown 官方支持 |
| 8 | **ProseKit** 0.23 | 无头引擎 | MIT | **105 KB** | ❌ 自绘 | 活跃 | 新一代 ProseMirror 工具包，React/Vue/Svelte/Solid 都能用 |
| 9 | **Lexical** 0.53 | 无头引擎 | MIT | **152 KB** | ❌ 自绘 | 非常活跃 | Meta 出品，React 一等公民，仍 0.x，块功能要自己补 |
| 10 | **Plate** 53 | 无头引擎 | MIT | — | ❌ 自绘 | 活跃 | Slate 底座 + 大量插件，shadcn 风格，配置面很大 |
| 11 | **Remirror** 3.0 | 无头引擎 | MIT | — | ❌ 自绘 | 2025 后放缓 | ProseMirror 的 React 封装，文档偏旧 |
| 12 | **ProseMirror** 1.25 | 底座 | MIT | — | ❌ | 活跃 | 一切 ProseMirror 系的根，等于自研 |
| 13 | **Slate** 0.12x | 底座 | MIT | — | ❌ | 活跃 | 数据模型自由，历史包袱与性能要自己扛 |
| 14 | **Quill** 2.0 | 经典富文本 | BSD-3 | **60 KB** | ✅ 工具栏 | 2025 后放缓 | 稳定、轻、Delta 模型；现代扩展/协作弱 |
| 15 | **Editor.js** 2.31 | 块编辑器 | Apache-2.0 | **66 KB** | ✅ 块 | 活跃 | 输出干净 JSON，但不是内联富文本（每块独立） |
| 16 | **TinyMCE** 8.10 | 经典富文本 | **GPL-2.0+ / 商业** | — | ✅ 完整 | 活跃 | 功能全，但许可不适合闭源插件分发 |
| 17 | **CKEditor 5** | 经典富文本 | **GPL-2.0+ / 商业** | — | ✅ 完整 | 活跃 | 同上，且体积大 |
| 18 | **SunEditor** 3.4 | 经典富文本 | MIT | — | ✅ 工具栏 | 一般 | 轻量传统编辑器，生态小 |
| 19 | **Trix** 2.1 | 经典富文本 | MIT | — | ✅ 极简 | 一般 | Basecamp 出品，功能少，适合评论框 |
| 20 | **BlockSuite** 0.22 | 文档框架 | MIT | —（很大） | ✅ 完整 | 活跃 | AFFiNE 的底座，整块文档系统，接入成本高 |

> 体积对照：TipTap 145 KB / Lexical 152 KB / ProseKit 105 KB / Yoopta 101 KB / Quill 60 KB / Editor.js 66 KB / Vditor 74 KB / Toast UI 177 KB / Milkdown Crepe 924 KB / BlockNote 1.43 MB。

---

## 2. 按“你想要的观感”分组

### A. 要 Notion 那种块编辑（斜杠菜单、拖拽块、块级工具栏）

| 方案 | 适合 | 注意 |
|---|---|---|
| **BlockNote** | 想一步到位、接受 1.4 MB 和 MPL-2.0 | 默认 Mantine 主题要换成 DSH 令牌；`xl-ai`/`xl-pdf` 是 GPL/商业，别装 |
| **Yoopta** | 想要 Notion 体验但体积要小（101 KB） | 块类型要按插件装；社区/文档比 BlockNote 小 |
| **Plate** | 想要完全掌控块行为、愿意写配置 | Slate 底座，v53 刚重写，升级跟版要投入 |
| **BlockSuite** | 想要“文档应用”级能力（嵌套块、协作） | 不是即插即用的 React 组件，等于接一个框架 |

### B. 要 Markdown 友好（笔记天然适合）

| 方案 | 适合 | 注意 |
|---|---|---|
| **Milkdown Crepe** | 想要开箱即用的 Markdown 所见即所得 | 924 KB（含 LaTeX/代码高亮）；主题要改 |
| **Vditor** | 中文排版、三模式（WYSIWYG/IR/分屏） | 默认从 CDN 拉图标/高亮资源，要改成本地 |
| **Toast UI** | 双栏 Markdown，团队熟悉 | 2023 年后停更，长期风险 |
| **MDXEditor** | React 里嵌 Markdown 文档 | 偏 MDX/文档，笔记的块拖拽弱 |

### C. 要自己设计界面（DSH 设计语言统一）

| 方案 | 适合 | 注意 |
|---|---|---|
| **TipTap** | 生态、文档、扩展最全；官方 Markdown | 所有 UI 自己画 |
| **ProseKit** | 想要更轻、更现代的 ProseMirror 封装 | 文档较新，示例少于 TipTap |
| **Lexical** | React 性能优先、愿意自己补块能力 | 0.x，API 还会变 |
| **Plate** | 喜欢 shadcn 风格、要大量现成插件 | 配置复杂，依赖 Slate 版本 |
| **Quill / Editor.js** | 只要一个轻量编辑区，不要复杂块 | 扩展性有限 |

### D. 不建议用于本插件

- **TinyMCE / CKEditor 5**：GPL-2.0+ 或商业许可，闭源插件分发有法律风险；体积也大。
- **ProseMirror / Slate 裸用**：等于自研编辑器，工期不可控。
- **Toast UI**：停更两年，作为新项目底座不稳。

---

## 3. 决策树

```
你要“开箱就好看”还是“界面完全自己定”？
├─ 开箱就好看
│  ├─ 要 Notion 块编辑
│  │  ├─ 接受 1.4MB / MPL → BlockNote
│  │  └─ 要轻（~100KB）   → Yoopta
│  ├─ 要 Markdown 笔记
│  │  ├─ 要最漂亮/功能全   → Milkdown Crepe
│  │  ├─ 中文/三模式       → Vditor
│  │  └─ 双栏经典          → Toast UI（注意停更）
│  └─ 经典工具栏           → Quill / Editor.js
└─ 界面完全自己定
   ├─ 生态最大             → TipTap
   ├─ 更轻的 ProseMirror   → ProseKit
   ├─ React 性能优先       → Lexical
   └─ shadcn 插件生态      → Plate
```

---

## 4. 对 dsh-notes 的接入成本

| 方案 | 集成工作量 | 体积影响 | Markdown 往返能力（评估期口径） | 风险 |
|---|---|---|---|---|
| BlockNote | 中（换主题、关掉 Mantine 样式） | 大 | 需 JSON↔MD | MPL 弱 copyleft；XL 包许可 |
| Yoopta | 中（装块插件、写主题） | 小 | 需 JSON↔MD | 生态小，API 可能变 |
| Milkdown Crepe | 低-中（CSS 主题） | 大 | 原生 MD | 主题定制面窄 |
| Vditor | 低（配置 + 本地资源） | 小 | 原生 MD | CDN 资源、国产文档为主 |
| TipTap | 中-高（UI 全自绘） | 中 | 官方 MD | 无 |
| ProseKit | 中-高（UI 全自绘） | 小 | 需 MD 插件 | 文档较新 |
| Lexical | 高（块能力自补） | 中 | 需转换 | 0.x |
| Quill / Editor.js | 低 | 小 | 需转换 | 扩展有限 |
| BlockSuite | 高（框架级） | 很大 | 需转换 | 升级/集成成本 |

---

## 5. 我的四个候选（按不同偏好）

1. **要“立刻好看、Notion 感”** → **BlockNote**：功能最完整，代价是 1.4 MB + MPL-2.0。
2. **要“Notion 感但轻”** → **Yoopta**：101 KB、MIT、块插件化，性价比最高。
3. **要“Markdown 笔记、中文好”** → **Vditor** 或 **Milkdown Crepe**：前者轻、三模式；后者漂亮、功能全。
4. **要“和 DSH 设计语言完全一致”** → **TipTap** 或 **ProseKit**：UI 全自绘，145/105 KB。

---

## 6. 复现评测

```bash
# 目录 /tmp/edb（TipTap/Lexical/BlockNote）与 /tmp/edb2（其余）
npx esbuild entry.js --bundle --format=esm --minify \
  --external:react --external:react-dom --outfile=out.js
gzip -9 -c out.js | wc -c
```

各方案 entry 的最小配置：

- TipTap：`StarterKit + Link + TaskList/TaskItem + TableKit`
- Lexical：`RichText + History + List + Table`
- BlockNote：`@blocknote/core + @blocknote/react + @blocknote/mantine`
- ProseKit：`defineBasicExtension()`
- Yoopta：`Paragraph + HeadingOne/Two`
- Milkdown：`@milkdown/crepe`
- 其余：官方最小示例
