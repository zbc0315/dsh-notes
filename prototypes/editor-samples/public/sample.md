# 周会记录 · 2026-11-03

> 目标：把「笔记本」嵌进 DSH，按工作区自动建子笔记本。

## 今日议题

1. 编辑器选型
2. 存储与同步
3. Agent 工具

### 待办

- [x] 调研候选编辑器
- [ ] 做三个可点击小样
- [ ] 确定最终选型

## 对比表

| 方案 | 体积 | 许可 |
| --- | --- | --- |
| BlockNote | 1.43 MB | MPL-2.0 |
| Milkdown | 924 KB | MIT |
| Vditor | 74 KB | MIT |

## 代码

```js
const notebook = await notes.create({ title: 'ask' })
console.log(notebook.id)
```

**加粗**、*斜体*、~~删除线~~、`行内代码`，以及 [一个链接](https://tiptap.dev)。

---

最后一行：同一份 Markdown，在三个编辑器里分别长什么样。
