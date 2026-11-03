# 编辑器小样（BlockNote / Milkdown Crepe / Vditor）

同一份 Markdown（`public/sample.md`）分别在三个编辑器里渲染，点标签切换，按需挂载。

> 该小样已从 DSH 静态服务下线（不再对外暴露 URL）。需要再看时，按下面的本地方式启动。

## 本地运行

```bash
npm install
node build.mjs          # 产出 public/assets/*.js|css 并拷贝 vditor 资源
python3 -m http.server 8899 -d public
# 打开 http://127.0.0.1:8899/index.html
```

## 体积（esbuild minify + gzip，React 已外置）

| 编辑器 | JS gzip | 说明 |
| --- | --- | --- |
| BlockNote | 1.43 MB | 含 Mantine 主题；已选定 |
| Milkdown Crepe | 924 KB | 完整 Crepe（表格/LaTeX/代码高亮） |
| Vditor | 74 KB | 编辑器本体；图标/高亮按需加载 |

## 源码

- `src/blocknote.js`：React + `@blocknote/mantine`，Markdown → blocks 用 `editor.tryParseMarkdownToBlocks`
- `src/crepe.js`：`new Crepe({ root, defaultValue })`
- `src/vditor.js`：`mode: 'ir'`（即时渲染），`cdn: './vditor'` 指向本地资源
- `build.mjs`：三个入口分别打成 IIFE，CSS 单独产出
