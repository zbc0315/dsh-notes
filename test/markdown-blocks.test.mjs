/**
 * markdown-blocks.js 单测（契约 docs/STORE-CONTRACT.md §5 的 12 组用例）
 *
 * 重点不只是「能转」，而是产出的块**必须**是 BlockNote 默认 schema 能直接当
 * `initialContent` 吃的完整块：id / type / props / content / children 齐全，
 * props 逐类型给全（缺 props 会在真实 BlockNote 渲染时炸）。
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { markdownToBlocks, blocksToMarkdown, blocksToPlainText } = require('../src/host/markdown-blocks.js')

/* ------------------------------------------------------------------ *
 * 脚手架
 * ------------------------------------------------------------------ */

const BLOCK_ID_RE = /^b_[0-9a-z]{12}$/

/** 块内所有 text 节点的文字拼起来。 */
function textOf(block) {
  const inline = Array.isArray(block && block.content) ? block.content : []
  let out = ''
  for (const node of inline) {
    if (typeof node === 'string') out += node
    else if (node && typeof node.text === 'string') out += node.text
    else if (node && node.type === 'link') out += (node.content || []).map((n) => n.text || '').join('')
  }
  return out
}

/** 断言这是 BlockNote 能吃的完整块（image/divider 没有 content）。 */
function assertFullBlock(block, type) {
  assert.ok(block && typeof block === 'object', '块必须是对象')
  assert.match(block.id, BLOCK_ID_RE, `块 id 形如 b_<12 base36>，实际 ${block.id}`)
  assert.equal(block.type, type)
  assert.ok(block.props && typeof block.props === 'object', `${type} 必须有 props`)
  assert.ok(Array.isArray(block.children), `${type}.children 必须是数组`)
  if (type === 'image' || type === 'divider') {
    assert.equal('content' in block, false, `${type} 不应有 content`)
  } else if (type === 'table') {
    assert.ok(block.content && block.content.type === 'tableContent', 'table.content 必须是 tableContent')
  } else {
    assert.ok(Array.isArray(block.content), `${type}.content 必须是数组`)
  }
  return block
}

/** 结构签名：用于「往返后语义等价」的比较（忽略空白与标记细节）。 */
function signatures(blocks) {
  return blocks.map((block) => {
    const sig = { type: block.type }
    if (block.type === 'heading') sig.level = block.props.level
    if (block.type === 'checkListItem') sig.checked = block.props.checked
    if (block.type === 'codeBlock') sig.language = block.props.language
    if (block.type === 'image') sig.url = block.props.url
    if (block.type === 'table') sig.rows = block.content.rows.length
    sig.text = blocksToPlainText([block])
    return sig
  })
}

/* ------------------------------------------------------------------ *
 * 0. 完整块形状 + props 齐全（BlockNote 0.57 默认 schema）
 * ------------------------------------------------------------------ */

test('0. 所有块都是完整块，props 按类型给全', () => {
  const md = [
    '# 标题',
    '',
    '段落',
    '',
    '- 无序',
    '',
    '1. 有序',
    '',
    '- [x] 任务',
    '',
    '> 引用',
    '',
    '```js',
    'const a = 1',
    '```',
    '',
    '![图注](https://example.com/a.png)',
    '',
    '---',
    '',
    '| 甲 | 乙 |',
    '| --- | --- |',
    '| 1 | 2 |',
  ].join('\n')

  const blocks = markdownToBlocks(md)
  const byType = new Map(blocks.map((block) => [block.type, block]))
  for (const type of [
    'heading',
    'paragraph',
    'bulletListItem',
    'numberedListItem',
    'checkListItem',
    'quote',
    'codeBlock',
    'image',
    'divider',
    'table',
  ]) {
    assert.ok(byType.has(type), `应产出 ${type} 块`)
    assertFullBlock(byType.get(type), type)
  }

  // 通用 props（BlockNote defaultProps：backgroundColor / textColor / textAlignment）
  for (const type of ['paragraph', 'bulletListItem', 'numberedListItem', 'checkListItem', 'heading']) {
    const props = byType.get(type).props
    assert.equal(props.textAlignment, 'left', `${type}.textAlignment`)
    assert.equal(props.backgroundColor, 'default', `${type}.backgroundColor`)
    assert.equal(props.textColor, 'default', `${type}.textColor`)
  }
  // heading 额外：level + isToggleable（默认 schema 里 isToggleable 是可选布尔）
  assert.equal(byType.get('heading').props.level, 1)
  assert.equal(byType.get('heading').props.isToggleable, false)
  // checkListItem 额外：checked
  assert.equal(byType.get('checkListItem').props.checked, true)
  // quote：默认 schema 只有 backgroundColor / textColor
  assert.equal(byType.get('quote').props.backgroundColor, 'default')
  assert.equal(byType.get('quote').props.textColor, 'default')
  // codeBlock：只有 language
  assert.equal(byType.get('codeBlock').props.language, 'js')
  // image：url / caption / name / showPreview / previewWidth
  const image = byType.get('image').props
  assert.equal(image.url, 'https://example.com/a.png')
  assert.equal(image.caption, '图注')
  assert.equal(image.name, '')
  assert.equal(image.showPreview, true)
  assert.equal(image.previewWidth, 512)
  // divider：props 是空对象
  assert.deepEqual(byType.get('divider').props, {})
  // table：props.textColor + tableContent（含 columnWidths / headerRows / tableCell props）
  const table = byType.get('table')
  assert.equal(table.props.textColor, 'default')
  assert.equal(table.content.type, 'tableContent')
  assert.ok(Array.isArray(table.content.columnWidths))
  assert.equal(table.content.headerRows, 1)
  assert.equal(table.content.rows.length, 2)
  for (const row of table.content.rows) {
    for (const cell of row.cells) {
      assert.equal(cell.type, 'tableCell')
      assert.deepEqual(cell.props, {
        colspan: 1,
        rowspan: 1,
        backgroundColor: 'default',
        textColor: 'default',
        textAlignment: 'left',
      })
      assert.ok(Array.isArray(cell.content))
    }
  }

  // id 不重复
  assert.equal(new Set(blocks.map((block) => block.id)).size, blocks.length)
})

/* ------------------------------------------------------------------ *
 * 1. 标题 1–3 级
 * ------------------------------------------------------------------ */

test('1. 标题 1–3 级 → heading(level)', () => {
  const blocks = markdownToBlocks('# 一\n\n## 二\n\n### 三')
  assert.equal(blocks.length, 3)
  assert.deepEqual(
    blocks.map((block) => block.type),
    ['heading', 'heading', 'heading'],
  )
  assert.deepEqual(
    blocks.map((block) => block.props.level),
    [1, 2, 3],
  )
  assert.deepEqual(blocks.map(textOf), ['一', '二', '三'])
  // 4–6 级压到 3 级（BlockNote 默认 heading 只到 3）
  assert.equal(markdownToBlocks('#### 四')[0].props.level, 3)
})

/* ------------------------------------------------------------------ *
 * 2. 段落 + 空行
 * ------------------------------------------------------------------ */

test('2. 段落 + 空行 → 多个 paragraph', () => {
  const blocks = markdownToBlocks('第一段\n\n第二段\n\n\n第三段')
  assert.equal(blocks.length, 3)
  for (const block of blocks) assertFullBlock(block, 'paragraph')
  assert.deepEqual(blocks.map(textOf), ['第一段', '第二段', '第三段'])

  // 同一段内的换行保留为一个块（BlockNote 会渲染成硬换行）
  const one = markdownToBlocks('第一行\n第二行')
  assert.equal(one.length, 1)
  assert.equal(textOf(one[0]), '第一行\n第二行')
})

/* ------------------------------------------------------------------ *
 * 3. 无序 / 有序列表
 * ------------------------------------------------------------------ */

test('3. 无序 / 有序列表', () => {
  const blocks = markdownToBlocks('- 甲\n- 乙\n\n1. 一\n2) 二')
  assert.deepEqual(
    blocks.map((block) => block.type),
    ['bulletListItem', 'bulletListItem', 'numberedListItem', 'numberedListItem'],
  )
  assert.deepEqual(blocks.map(textOf), ['甲', '乙', '一', '二'])
  for (const block of blocks) assertFullBlock(block, block.type)
})

/* ------------------------------------------------------------------ *
 * 4. 任务列表
 * ------------------------------------------------------------------ */

test('4. 任务列表 - [ ] / - [x] → checkListItem(checked)', () => {
  const blocks = markdownToBlocks('- [ ] 未完成\n- [x] 已完成\n- [X] 大写也行')
  assert.equal(blocks.length, 3)
  for (const block of blocks) assertFullBlock(block, 'checkListItem')
  assert.deepEqual(
    blocks.map((block) => block.props.checked),
    [false, true, true],
  )
  assert.deepEqual(blocks.map(textOf), ['未完成', '已完成', '大写也行'])
})

/* ------------------------------------------------------------------ *
 * 5. 引用
 * ------------------------------------------------------------------ */

test('5. 引用 > → quote', () => {
  const blocks = markdownToBlocks('> 引用一\n> 引用二\n\n普通段落')
  assert.equal(blocks.length, 2)
  assertFullBlock(blocks[0], 'quote')
  assert.equal(textOf(blocks[0]), '引用一\n引用二')
  assert.equal(blocks[1].type, 'paragraph')
})

/* ------------------------------------------------------------------ *
 * 6. 代码围栏（带语言）
 * ------------------------------------------------------------------ */

test('6. 代码围栏 → codeBlock(language)', () => {
  const blocks = markdownToBlocks('```js\nconst a = 1\nconsole.log(a)\n```')
  assert.equal(blocks.length, 1)
  const block = assertFullBlock(blocks[0], 'codeBlock')
  assert.equal(block.props.language, 'js')
  assert.equal(block.content.length, 1, '整段一个 text，不加行内标记')
  assert.deepEqual(block.content[0], { type: 'text', text: 'const a = 1\nconsole.log(a)', styles: {} })

  // 无语言 / 波浪线围栏
  assert.equal(markdownToBlocks('```\nplain\n```')[0].props.language, '')
  assert.equal(markdownToBlocks('~~~py\nprint(1)\n~~~')[0].props.language, 'py')
})

/* ------------------------------------------------------------------ *
 * 7. 图片
 * ------------------------------------------------------------------ */

test('7. 图片 ![alt](url) → image(url, caption=alt)', () => {
  const blocks = markdownToBlocks('![图注](asset://abc123.png)')
  assert.equal(blocks.length, 1)
  const block = assertFullBlock(blocks[0], 'image')
  assert.equal(block.props.url, 'asset://abc123.png')
  assert.equal(block.props.caption, '图注')

  // 空 alt
  assert.equal(markdownToBlocks('![](https://x/y.png)')[0].props.caption, '')
})

/* ------------------------------------------------------------------ *
 * 8. 分隔线
 * ------------------------------------------------------------------ */

test('8. --- → divider', () => {
  for (const md of ['---', '***', '___']) {
    const blocks = markdownToBlocks(md)
    assert.equal(blocks.length, 1)
    assertFullBlock(blocks[0], 'divider')
    assert.deepEqual(blocks[0].props, {})
  }
})

/* ------------------------------------------------------------------ *
 * 9. 表格（2×2 + 表头）
 * ------------------------------------------------------------------ */

test('9. GFM 表格 → table 块（2×2 + 表头）', () => {
  const blocks = markdownToBlocks('| 甲 | 乙 |\n| --- | --- |\n| 1 | 2 |')
  assert.equal(blocks.length, 1)
  const block = assertFullBlock(blocks[0], 'table')
  assert.equal(block.content.type, 'tableContent')
  assert.equal(block.content.headerRows, 1)
  assert.equal(block.content.rows.length, 2)
  const rows = block.content.rows.map((row) => row.cells.map((cell) => textOf(cell)))
  assert.deepEqual(rows, [
    ['甲', '乙'],
    ['1', '2'],
  ])

  // 列数不一致的行会被补齐/截断，不吞内容
  const padded = markdownToBlocks('| 甲 | 乙 |\n| --- | --- |\n| 1 |')
  assert.deepEqual(
    padded[0].content.rows[1].cells.map((cell) => textOf(cell)),
    ['1', ''],
  )
})

/* ------------------------------------------------------------------ *
 * 10. 往返：1–8 语义等价
 * ------------------------------------------------------------------ */

test('10. blocksToMarkdown(markdownToBlocks(md)) 对 1–8 语义等价', () => {
  const fixtures = [
    '# 一级\n\n## 二级\n\n### 三级',
    '第一段\n\n第二段',
    '- 甲\n- 乙\n\n1. 一\n2. 二',
    '- [ ] 未完成\n- [x] 已完成',
    '> 引用一\n> 引用二',
    '```js\nconst a = 1\n```',
    '![图注](asset://abc123.png)',
    '---',
    '| 甲 | 乙 |\n| --- | --- |\n| 1 | 2 |',
  ]

  for (const md of fixtures) {
    const first = markdownToBlocks(md)
    const round = blocksToMarkdown(first)
    assert.equal(typeof round, 'string')
    assert.ok(round.length > 0, `往返结果不应为空: ${md}`)
    // 镜像必须是干净 GFM：不能出现 4 空格悬挂缩进（BlockNote lossy 序列化的 bug）
    for (const line of round.split('\n')) {
      assert.equal(/^ {4,}/.test(line), false, `镜像不应有 4 空格缩进: ${JSON.stringify(line)}`)
    }
    const second = markdownToBlocks(round)
    assert.deepEqual(signatures(second), signatures(first), `往返后语义应等价: ${md}`)
  }
})

/* ------------------------------------------------------------------ *
 * 11. 纯文本
 * ------------------------------------------------------------------ */

test('11. blocksToPlainText 不含 # / - / ` 等标记', () => {
  const md = [
    '# 标题行',
    '',
    '- 列表项',
    '- [x] 已完成项',
    '',
    '> 引用行',
    '',
    '```js',
    'const a = 1',
    '```',
    '',
    '| 甲 | 乙 |',
    '| --- | --- |',
    '| 1 | 2 |',
    '',
    '**粗体** 与 `行内代码` 和 ~~删除线~~',
  ].join('\n')

  const text = blocksToPlainText(markdownToBlocks(md))
  assert.equal(text.includes('\n'), false, '纯文本应折叠成单行')
  for (const marker of ['#', '-', '`', '>', '|', '*', '~']) {
    assert.equal(text.includes(marker), false, `纯文本不应含 ${marker}`)
  }
  for (const keeps of ['标题行', '列表项', '已完成项', '引用行', 'const a = 1', '甲', '乙', '粗体', '行内代码', '删除线']) {
    assert.ok(text.includes(keeps), `纯文本应保留 ${keeps}`)
  }
})

/* ------------------------------------------------------------------ *
 * 12. 空输入
 * ------------------------------------------------------------------ */

test('12. 空串 → []；blocksToMarkdown([]) → ""', () => {
  assert.deepEqual(markdownToBlocks(''), [])
  assert.deepEqual(markdownToBlocks('   \n\n  '), [])
  assert.deepEqual(markdownToBlocks(undefined), [])
  assert.equal(blocksToMarkdown([]), '')
  assert.equal(blocksToMarkdown(undefined), '')
  assert.equal(blocksToPlainText([]), '')
})

/* ------------------------------------------------------------------ *
 * 13. 附加：行内标记切分 / 迁移兼容
 * ------------------------------------------------------------------ */

test('13. 行内标记：bold/italic/code/strike 切分，链接与转义不丢文字', () => {
  const blocks = markdownToBlocks('**粗** *斜* `码` ~~删~~ [链接](https://a.b/c) 和 \\*字面星号\\*')
  const inline = blocks[0].content
  const stylesOf = (word) => {
    const node = inline.find((n) => n.type === 'text' && n.text === word)
    assert.ok(node, `应有 text 节点 ${word}`)
    return node.styles
  }
  assert.deepEqual(stylesOf('粗'), { bold: true })
  assert.deepEqual(stylesOf('斜'), { italic: true })
  assert.deepEqual(stylesOf('码'), { code: true })
  assert.deepEqual(stylesOf('删'), { strike: true })
  const link = inline.find((n) => n.type === 'link')
  assert.ok(link, '链接应转成 link 行内节点')
  assert.equal(link.href, 'https://a.b/c')
  assert.equal(link.content[0].text, '链接')
  assert.equal(textOf(blocks[0]).includes('*字面星号*'), true)

  // 往返后链接仍是 Markdown 链接
  assert.ok(blocksToMarkdown(blocks).includes('[链接](https://a.b/c)'))
})

test('14. 迁移兼容：带 YAML frontmatter 的旧 Markdown 不吃掉正文', () => {
  const md = ['---', 'id: p_abc', 'title: 旧页', 'created: 2026-11-03T05:00:00.000Z', 'tags: [a, b]', '---', '', '外部正文'].join(
    '\n',
  )
  const blocks = markdownToBlocks(md)
  assert.equal(blocks.length, 1)
  assert.equal(textOf(blocks[0]), '外部正文')
})
