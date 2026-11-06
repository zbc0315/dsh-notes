'use strict'

/**
 * @tom2012/dsh-notes — Markdown ↔ BlockNote blocks 转换（纯函数）
 *
 * 契约：docs/STORE-CONTRACT.md §5
 *
 *  - `markdownToBlocks(md)`：把 GFM 子集解析成 BlockNote 默认 schema 的**完整块**
 *    （`{ id, type, props, content, children }`，图片/分隔线没有 `content`），
 *    可以直接当 `initialContent` 吃。解析是 best-effort：嵌套标记可能丢样式，
 *    但**不丢文字**；列表缩进不还原成 children。
 *  - `blocksToMarkdown(blocks)`：把块数组导出成 GFM，结尾带换行；空数组返回 `''`。
 *  - `blocksToPlainText(blocks)`：单行纯文本（供搜索/摘要），不含块级标记。
 *
 * 零依赖：只用 node:crypto 生成块 id（`b_<12 base36>`）。
 * props 按 BlockNote 0.57 默认 schema 逐类型给全（见每处注释里的 schema 来源），
 * 缺 props 会让真实 BlockNote 渲染报错，所以宁可多写。
 */

const crypto = require('node:crypto')

/* ------------------------------------------------------------------ *
 * 常量
 * ------------------------------------------------------------------ */

/** base36 字符表（与 store.js 的 id 生成口径一致）。 */
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

/** 标题最多落到 3 级（契约 §5 只允许 1|2|3；4–6 级压平到 3）。 */
const MAX_HEADING_LEVEL = 3

/** 行内强调标记 → BlockNote 默认 styleSchema 里的样式名。 */
const EMPHASIS_MARKERS = Object.freeze([
  { mark: '**', style: 'bold' },
  { mark: '__', style: 'bold' },
  { mark: '~~', style: 'strike' },
  { mark: '*', style: 'italic' },
  { mark: '_', style: 'italic' },
])

/* ------------------------------------------------------------------ *
 * 小工具
 * ------------------------------------------------------------------ */

/** `b_<12 base36>`。 */
function blockId() {
  const bytes = crypto.randomBytes(12)
  let out = 'b_'
  for (let i = 0; i < 12; i++) out += ID_ALPHABET[bytes[i] % 36]
  return out
}

/** BlockNote 默认的通用 props（paragraph / 列表 / heading / quote 共用部分）。 */
function defaultProps() {
  return { textAlignment: 'left', backgroundColor: 'default', textColor: 'default' }
}

/** 行内文本节点。 */
function textNode(text, styles) {
  return { type: 'text', text: typeof text === 'string' ? text : '', styles: styles || {} }
}

/** 给行内节点加一个样式（link 递归到 content）。 */
function applyStyle(node, style) {
  if (!node || typeof node !== 'object') return node
  if (node.type === 'link') {
    return { ...node, content: (Array.isArray(node.content) ? node.content : []).map((child) => applyStyle(child, style)) }
  }
  if (node.type === 'text') return { ...node, styles: { ...(node.styles || {}), [style]: true } }
  return node
}

/* ------------------------------------------------------------------ *
 * 行内解析
 * ------------------------------------------------------------------ */

/**
 * 匹配 `[label](href)`（支持可选的 `"title"`）。
 * @returns {{label: string, href: string, end: number}|null}
 */
function matchLink(src, start) {
  const closeBracket = src.indexOf(']', start + 1)
  if (closeBracket === -1) return null
  if (src[closeBracket + 1] !== '(') return null
  const closeParen = src.indexOf(')', closeBracket + 2)
  if (closeParen === -1) return null
  const label = src.slice(start + 1, closeBracket)
  let href = src.slice(closeBracket + 2, closeParen).trim()
  const space = href.search(/\s/)
  if (space !== -1) href = href.slice(0, space)
  if (!href) return null
  return { label, href, end: closeParen + 1 }
}

/**
 * 在 start 处匹配一个强调标记，并找到它对应的闭合标记。
 * 找不到闭合（或内容为空）返回 null —— 调用方会把标记当普通字符保留，保证不丢文字。
 */
function matchEmphasis(src, start) {
  for (const { mark, style } of EMPHASIS_MARKERS) {
    if (!src.startsWith(mark, start)) continue
    // 单字符标记不能是双字符标记的一半（`**x**` 不能被当成两个 `*`）。
    if (mark.length === 1 && src.startsWith(mark + mark, start)) continue
    const from = start + mark.length
    const end = src.indexOf(mark, from)
    if (end <= from) continue
    const inner = src.slice(from, end)
    if (!inner.trim()) continue
    // snake_case 之类：下划线夹在字母数字之间不算强调。
    if (mark === '_' && /[A-Za-z0-9]/.test(src[start - 1] || '') && /[A-Za-z0-9]/.test(src[end + 1] || '')) continue
    return { inner, style, end: end + mark.length }
  }
  return null
}

/**
 * 行内 Markdown → BlockNote InlineContent[]。
 *
 * 支持：`**bold**` / `__bold__` / `*italic*` / `_italic_` / `~~strike~~` / `` `code` `` /
 * `[text](url)` / 反斜杠转义。嵌套标记最多剥一层（契约允许丢样式，不丢文字）。
 */
function parseInline(text) {
  const src = typeof text === 'string' ? text : ''
  const out = []
  let buffer = ''
  const flush = () => {
    if (buffer) {
      out.push(textNode(buffer))
      buffer = ''
    }
  }

  let i = 0
  while (i < src.length) {
    const ch = src[i]

    // 反斜杠转义：`\*` → 字面量 `*`。
    if (ch === '\\' && i + 1 < src.length && '\\`*_{}[]()#+-.!|~>'.includes(src[i + 1])) {
      buffer += src[i + 1]
      i += 2
      continue
    }

    // 行内代码：内部不再解析标记。
    if (ch === '`') {
      const end = src.indexOf('`', i + 1)
      if (end > i + 1) {
        flush()
        out.push(textNode(src.slice(i + 1, end), { code: true }))
        i = end + 1
        continue
      }
    }

    // 链接（块级图片已在 block 层处理；行内 `![alt](url)` 只保留 alt 文字）。
    if (ch === '!' && src[i + 1] === '[') {
      const link = matchLink(src, i + 1)
      if (link) {
        flush()
        const label = link.label ? parseInline(link.label) : []
        for (const node of label) out.push(node)
        i = link.end
        continue
      }
    }
    if (ch === '[') {
      const link = matchLink(src, i)
      if (link) {
        flush()
        out.push({ type: 'link', href: link.href, content: link.label ? parseInline(link.label) : [] })
        i = link.end
        continue
      }
    }

    // 强调 / 删除线 / 行内代码（单标记版本）。
    const emphasis = matchEmphasis(src, i)
    if (emphasis) {
      flush()
      for (const node of parseInline(emphasis.inner)) out.push(applyStyle(node, emphasis.style))
      i = emphasis.end
      continue
    }

    buffer += ch
    i++
  }

  flush()
  return out
}

/** 行内数组 → 纯文本（供导出）。 */
function inlineToMarkdown(content) {
  if (!Array.isArray(content)) return ''
  return content.map(nodeToMarkdown).join('')
}

function nodeToMarkdown(node) {
  if (typeof node === 'string') return node
  if (!node || typeof node !== 'object') return ''
  if (node.type === 'link') return `[${inlineToMarkdown(node.content)}](${node.href || ''})`
  let text = typeof node.text === 'string' ? node.text : ''
  const styles = node.styles || {}
  if (styles.bold) text = `**${text}**`
  if (styles.italic) text = `*${text}*`
  if (styles.strike) text = `~~${text}~~`
  if (styles.code) text = `\`${text}\``
  return text
}

/** 行内数组 → 纯文本（供搜索）。 */
function inlineToPlainText(content) {
  if (!Array.isArray(content)) return ''
  let out = ''
  for (const node of content) {
    if (typeof node === 'string') {
      out += node
      continue
    }
    if (!node || typeof node !== 'object') continue
    if (node.type === 'link') out += inlineToPlainText(node.content)
    else if (typeof node.text === 'string') out += node.text
  }
  return out
}

/* ------------------------------------------------------------------ *
 * 块构造器（props 与 BlockNote 0.57 默认 schema 对齐）
 * ------------------------------------------------------------------ */

/** paragraph：backgroundColor / textColor / textAlignment。 */
function paragraphBlock(text) {
  return {
    id: blockId(),
    type: 'paragraph',
    props: defaultProps(),
    content: parseInline(text),
    children: [],
  }
}

/** heading：level(1–6) + textAlignment / backgroundColor / textColor + isToggleable(可选)。 */
function headingBlock(level, text) {
  return {
    id: blockId(),
    type: 'heading',
    props: {
      level: Math.min(MAX_HEADING_LEVEL, Math.max(1, Number(level) || 1)),
      isToggleable: false,
      ...defaultProps(),
    },
    content: parseInline(text),
    children: [],
  }
}

/** bulletListItem / numberedListItem：通用 props。 */
function listItemBlock(type, text, checked) {
  const props = defaultProps()
  if (type === 'checkListItem') props.checked = checked === true
  return {
    id: blockId(),
    type,
    props,
    content: parseInline(text),
    children: [],
  }
}

/** quote：BlockNote 默认 schema 只有 backgroundColor / textColor（多给的 textAlignment 被忽略）。 */
function quoteBlock(text) {
  return {
    id: blockId(),
    type: 'quote',
    props: defaultProps(),
    content: parseInline(text),
    children: [],
  }
}

/** codeBlock：content 是 plain（整段一个 text，不加行内标记），props 只有 language。 */
function codeBlock(language, code) {
  return {
    id: blockId(),
    type: 'codeBlock',
    props: { language: typeof language === 'string' ? language : '' },
    content: code ? [textNode(code)] : [],
    children: [],
  }
}

/**
 * image：props = textAlignment / backgroundColor / name / url / caption /
 * showPreview / previewWidth（`content` 不存在）。
 */
function imageBlock(url, caption) {
  return {
    id: blockId(),
    type: 'image',
    props: {
      textAlignment: 'left',
      backgroundColor: 'default',
      name: '',
      url: typeof url === 'string' ? url : '',
      caption: typeof caption === 'string' ? caption : '',
      showPreview: true,
      previewWidth: 512,
    },
    children: [],
  }
}

/** divider：props = {}（`content` 不存在）。 */
function dividerBlock() {
  return {
    id: blockId(),
    type: 'divider',
    props: {},
    children: [],
  }
}

/**
 * table：props = textColor（BlockNote 默认 tablePropSchema）；
 * content = tableContent（columnWidths / headerRows / rows[].cells，单元格是 tableCell 对象）。
 */
function tableBlock(rows) {
  return {
    id: blockId(),
    type: 'table',
    props: { textColor: 'default' },
    content: {
      type: 'tableContent',
      columnWidths: [],
      headerRows: rows.length ? 1 : 0,
      rows: rows.map((cells) => ({
        cells: cells.map((text) => ({
          type: 'tableCell',
          props: {
            colspan: 1,
            rowspan: 1,
            backgroundColor: 'default',
            textColor: 'default',
            textAlignment: 'left',
          },
          content: parseInline(text),
        })),
      })),
    },
    children: [],
  }
}

/* ------------------------------------------------------------------ *
 * Markdown → blocks
 * ------------------------------------------------------------------ */

/**
 * 去掉开头的 YAML frontmatter（旧版页面文件 / Markdown 镜像都带）。
 * 只有内容看起来像 `key: value` 时才认定是 frontmatter，避免把 `---` 分隔线误吃。
 */
function stripFrontmatter(md) {
  const src = md.charCodeAt(0) === 0xfeff ? md.slice(1) : md
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(src)
  if (!match) return src
  const inner = match[1]
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .every((line) => /^[A-Za-z_][\w-]*[ \t]*:/.test(line))
  return inner || !match[1].trim() ? src.slice(match[0].length) : src
}

/** `| a | b |` → ['a', 'b']（支持 `\|` 转义）。 */
function splitTableRow(line) {
  let text = String(line || '').trim()
  if (text.startsWith('|')) text = text.slice(1)
  if (text.endsWith('|')) text = text.slice(0, -1)
  const cells = []
  let current = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '\\' && text[i + 1] === '|') {
      current += '|'
      i++
      continue
    }
    if (ch === '|') {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  cells.push(current.trim())
  return cells
}

/** GFM 表格的分隔行：`| --- | :---: |`。 */
function isTableDelimiter(line) {
  const text = String(line || '').trim()
  if (!text.includes('-')) return false
  return /^\|?[ \t]*:?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)*\|?$/.test(text)
}

/** 尝试从 lines[start] 解析一张 GFM 表格（表头 + 分隔行 + 数据行）。 */
function tryParseTable(lines, start) {
  const headerLine = lines[start]
  if (!headerLine || !headerLine.includes('|')) return null
  const delimiter = lines[start + 1]
  if (!delimiter || !isTableDelimiter(delimiter)) return null
  const headerCells = splitTableRow(headerLine)
  const delimiterCells = splitTableRow(delimiter)
  if (!headerCells.length || headerCells.length !== delimiterCells.length) return null

  const rows = [headerCells]
  let i = start + 2
  while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
    const cells = splitTableRow(lines[i])
    while (cells.length < headerCells.length) cells.push('')
    rows.push(cells.slice(0, headerCells.length))
    i++
  }
  return { block: tableBlock(rows), next: i }
}

const FENCE_RE = /^ {0,3}(`{3,}|~{3,})[ \t]*([^`\s]*)[^`]*$/
const HEADING_RE = /^ {0,3}(#{1,6})[ \t]+(.*)$/
const DIVIDER_RE = /^ {0,3}(?:-{3,}|\*{3,}|_{3,})[ \t]*$/
const QUOTE_RE = /^ {0,3}>/
const LIST_RE = /^(\s*)([-*+]|\d{1,9}[.)])[ \t]+(.*)$/
const TASK_RE = /^\[([ xX])\][ \t]*(.*)$/
const IMAGE_RE = /^ {0,3}!\[([^\]]*)\]\(([^)\s]+)(?:[ \t]+"[^"]*")?\)[ \t]*$/

/**
 * GFM 子集 → BlockNote 默认 schema 的完整块数组。
 *
 * 支持：标题 1–6（压到 3）、段落、无序/有序列表、任务列表、引用、围栏代码、
 * 独占一行的图片、分隔线、GFM 表格。其余语法按普通段落处理（不丢文字）。
 *
 * @param {string} md
 * @returns {object[]}
 */
function markdownToBlocks(md) {
  if (typeof md !== 'string' || !md.trim()) return []
  const source = stripFrontmatter(md).replace(/\r\n?/g, '\n')
  const lines = source.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 空行
    if (!line.trim()) {
      i++
      continue
    }

    // 围栏代码块
    const fence = FENCE_RE.exec(line)
    if (fence) {
      const marker = fence[1][0]
      const closing = new RegExp(`^ {0,3}${marker === '`' ? '`{3,}' : '~{3,}'}[ \\t]*$`)
      const buffer = []
      i++
      while (i < lines.length && !closing.test(lines[i])) {
        buffer.push(lines[i])
        i++
      }
      if (i < lines.length) i++ // 收尾的围栏行
      blocks.push(codeBlock(fence[2] || '', buffer.join('\n')))
      continue
    }

    // 标题
    const heading = HEADING_RE.exec(line)
    if (heading) {
      const text = heading[2].replace(/[ \t]+#+[ \t]*$/, '').trim()
      blocks.push(headingBlock(heading[1].length, text))
      i++
      continue
    }

    // 分隔线
    if (DIVIDER_RE.test(line)) {
      blocks.push(dividerBlock())
      i++
      continue
    }

    // 表格
    const table = tryParseTable(lines, i)
    if (table) {
      blocks.push(table.block)
      i = table.next
      continue
    }

    // 引用（连续多行合并成一个 quote 块，行间用 \n，BlockNote 会渲染成硬换行）
    if (QUOTE_RE.test(line)) {
      const buffer = []
      while (i < lines.length && QUOTE_RE.test(lines[i])) {
        buffer.push(lines[i].replace(/^ {0,3}>[ \t]?/, ''))
        i++
      }
      blocks.push(quoteBlock(buffer.join('\n')))
      continue
    }

    // 列表 / 任务列表
    const list = LIST_RE.exec(line)
    if (list) {
      const marker = list[2]
      const body = list[3]
      const task = TASK_RE.exec(body)
      if (task) {
        blocks.push(listItemBlock('checkListItem', task[2], task[1].toLowerCase() === 'x'))
      } else if (/^\d/.test(marker)) {
        blocks.push(listItemBlock('numberedListItem', body))
      } else {
        blocks.push(listItemBlock('bulletListItem', body))
      }
      i++
      continue
    }

    // 独占一行的图片
    const image = IMAGE_RE.exec(line)
    if (image) {
      const url = image[2]
      // 站内附件 `asset://<sha>.<ext>` 原样保留（契约 §2：store 不做改写）。
      blocks.push(imageBlock(url, image[1] || ''))
      i++
      continue
    }

    // 段落：吃到空行或下一个块级结构开始为止
    const paragraph = [line]
    i++
    while (i < lines.length && lines[i].trim() && !startsBlock(lines, i)) {
      paragraph.push(lines[i])
      i++
    }
    blocks.push(paragraphBlock(paragraph.join('\n').trim()))
  }

  return blocks
}

/** lines[i] 是否是某个块级结构的开头（供段落累积时判断断点）。 */
function startsBlock(lines, i) {
  const line = lines[i]
  if (!line || !line.trim()) return true
  if (FENCE_RE.test(line) || HEADING_RE.test(line) || DIVIDER_RE.test(line)) return true
  if (QUOTE_RE.test(line) || LIST_RE.test(line) || IMAGE_RE.test(line)) return true
  // 表格：当前行带 | 且下一行是分隔行
  if (line.includes('|') && lines[i + 1] && isTableDelimiter(lines[i + 1])) return true
  return false
}

/* ------------------------------------------------------------------ *
 * blocks → Markdown
 * ------------------------------------------------------------------ */

/** codeBlock 的 content（plain）→ 纯代码文本。 */
function plainContentText(content) {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  let out = ''
  for (const node of content) {
    if (typeof node === 'string') out += node
    else if (node && typeof node.text === 'string') out += node.text
  }
  return out
}

/** 表格块 → GFM（第一行作表头，GFM 语法要求）。 */
function tableToMarkdown(content) {
  const rows = content && Array.isArray(content.rows) ? content.rows : []
  if (!rows.length) return ''
  const rendered = rows.map((row) => {
    const cells = Array.isArray(row && row.cells) ? row.cells : []
    return cells.map((cell) => {
      if (typeof cell === 'string') return cell.replace(/\|/g, '\\|')
      if (cell && cell.type === 'tableCell') return inlineToMarkdown(cell.content).replace(/\|/g, '\\|')
      if (Array.isArray(cell)) return inlineToMarkdown(cell).replace(/\|/g, '\\|')
      return ''
    })
  })
  const width = Math.max(...rendered.map((cells) => cells.length))
  const pad = (cells) => {
    const copy = cells.slice()
    while (copy.length < width) copy.push('')
    return `| ${copy.join(' | ')} |`
  }
  const header = pad(rendered[0])
  const delimiter = `| ${Array(width).fill('---').join(' | ')} |`
  const body = rendered.slice(1).map((cells) => pad(cells))
  return [header, delimiter, ...body].join('\n')
}

/** 单个块 → Markdown（不含 children）。 */
function blockToMarkdown(block, depth, counters) {
  if (!block || typeof block !== 'object') return ''
  const indent = '  '.repeat(Math.max(0, depth))
  const type = block.type
  const text = inlineToMarkdown(block.content)
  const children = Array.isArray(block.children) ? block.children : []

  let own = ''
  let childDepth = depth

  switch (type) {
    case 'heading': {
      const level = Math.min(6, Math.max(1, Number(block.props && block.props.level) || 1))
      own = `${'#'.repeat(level)} ${text}`
      break
    }
    case 'bulletListItem':
      own = `- ${text}`
      childDepth = depth + 1
      break
    case 'numberedListItem':
      counters.number += 1
      own = `${counters.number}. ${text}`
      childDepth = depth + 1
      break
    case 'checkListItem': {
      const checked = block.props && block.props.checked === true
      own = `- [${checked ? 'x' : ' '}] ${text}`
      childDepth = depth + 1
      break
    }
    case 'quote': {
      const lines = text.split('\n')
      own = lines.map((line) => `> ${line}`).join('\n')
      childDepth = depth + 1
      break
    }
    case 'codeBlock': {
      const language = block.props && typeof block.props.language === 'string' ? block.props.language : ''
      const code = plainContentText(block.content)
      // 围栏长度必须比内容里最长的反引号串更长，否则代码块里的 ``` 会把镜像截断。
      const longest = (code.match(/`+/g) || []).reduce((max, run) => Math.max(max, run.length), 0)
      const fence = '`'.repeat(Math.max(3, longest + 1))
      own = `${fence}${language}\n${code}\n${fence}`
      break
    }
    case 'image': {
      const props = block.props || {}
      own = `![${props.caption || ''}](${props.url || ''})`
      break
    }
    case 'divider':
      own = '---'
      break
    case 'table':
      own = tableToMarkdown(block.content)
      break
    case 'paragraph':
    default:
      own = text
      break
  }

  if (children.length) {
    const nested = renderBlocks(children, childDepth)
    if (nested) own = own ? `${own}\n${nested}` : nested
  }
  return own ? `${indent}${own}`.replace(/^ +\n/gm, '\n') : ''
}

/** 列表类块的「家族」：同一家族相邻时只隔一个换行（不同家族要空行，否则会被并成一张列表）。 */
function listFamily(type) {
  if (type === 'numberedListItem') return 'numbered'
  if (type === 'bulletListItem' || type === 'checkListItem') return 'bullet'
  return ''
}

/** 块数组 → Markdown 行（块之间空一行；相邻列表项只隔一个换行）。 */
function renderBlocks(blocks, depth = 0) {
  if (!Array.isArray(blocks) || !blocks.length) return ''
  let out = ''
  let prev = null
  const counters = { number: 0 }
  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue
    if (block.type !== 'numberedListItem') counters.number = 0
    const text = blockToMarkdown(block, depth, counters)
    if (!text) continue
    const prevFamily = prev ? listFamily(prev.type) : ''
    const family = listFamily(block.type)
    const separator = prev && prevFamily && prevFamily === family ? '\n' : '\n\n'
    out = out ? `${out}${separator}${text}` : text
    prev = block
  }
  return out
}

/**
 * BlockNote blocks → GFM（结尾带换行；空数组返回空串）。
 * 有损：颜色/对齐/嵌套等块级属性不进 Markdown（真源仍是 blocks JSON）。
 */
function blocksToMarkdown(blocks) {
  const text = renderBlocks(Array.isArray(blocks) ? blocks : [])
  if (!text) return ''
  return `${text.replace(/[ \t\n]+$/, '')}\n`
}

/* ------------------------------------------------------------------ *
 * blocks → 纯文本
 * ------------------------------------------------------------------ */

/** 收集一个块的纯文本（不含块级标记）。 */
function blockToPlainText(block) {
  if (!block || typeof block !== 'object') return ''
  switch (block.type) {
    case 'codeBlock':
      return plainContentText(block.content)
    case 'image': {
      const props = block.props || {}
      return [props.caption, props.name].filter((v) => typeof v === 'string' && v).join(' ')
    }
    case 'divider':
      return ''
    case 'table': {
      const rows = block.content && Array.isArray(block.content.rows) ? block.content.rows : []
      const out = []
      for (const row of rows) {
        const cells = Array.isArray(row && row.cells) ? row.cells : []
        for (const cell of cells) {
          if (typeof cell === 'string') out.push(cell)
          else if (cell && cell.type === 'tableCell') out.push(inlineToPlainText(cell.content))
          else if (Array.isArray(cell)) out.push(inlineToPlainText(cell))
        }
      }
      return out.join(' ')
    }
    default:
      return inlineToPlainText(block.content)
  }
}

/**
 * BlockNote blocks → 单行纯文本（搜索 / 摘要用）。
 * 不含 `#` / `-` / 反引号之类块级标记。
 */
function blocksToPlainText(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return ''
  const out = []
  const walk = (list) => {
    for (const block of Array.isArray(list) ? list : []) {
      const text = blockToPlainText(block)
      if (text) out.push(text)
      if (block && Array.isArray(block.children) && block.children.length) walk(block.children)
    }
  }
  walk(blocks)
  return out
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

module.exports = {
  markdownToBlocks,
  blocksToMarkdown,
  blocksToPlainText,
}
