/**
 * Notion often exports tables as HTML. React-markdown + GFM only render pipe tables.
 * This module converts those blocks and fixes multiline pipe-table rows.
 */

export function prepareNotionMarkdownForDisplay(md = '') {
  let output = cleanNotionMarkdown(md)
  output = convertNotionHtmlTablesToMarkdown(output)
  output = normalizeNotionMarkdownSpacing(output)
  output = fixMultilineNotionPipeTables(output)
  return output
}

/** Normalize Notion text: quotes, line endings, invisible chars, chrome blocks. */
export function cleanNotionMarkdown(str = '') {
  if (!str) return ''

  return String(str)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u2028/g, '\n')
    .replace(/\u2029/g, '\n\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\\n/g, '\n')
    .replace(/’/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/<empty-block\s*\/?>/gi, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
}

/**
 * Notion markdown often uses single newlines between blocks. Without blank lines,
 * paragraphs merge and a lone `---` after text becomes a setext H2 underline.
 */
export function normalizeNotionMarkdownSpacing(md = '') {
  const lines = String(md || '').split('\n')
  if (!lines.length) return ''

  const out = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isNotionChromeLine(line)) continue

    const prev = out.length ? out[out.length - 1] : ''

    if (out.length && needsBlankLineBetween(prev, line)) {
      if (out.length && out[out.length - 1].trim() !== '') {
        out.push('')
      }
    }

    out.push(line)

    if (needsBlankLineAfter(line, lines[i + 1])) {
      if (i + 1 < lines.length && lines[i + 1].trim() !== '') {
        out.push('')
      }
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function needsBlankLineBetween(prev, current) {
  const previous = prev.trim()
  const next = current.trim()
  if (!previous || !next) return false

  if (isHorizontalRuleOnly(next)) return true
  if (/^#{1,6}\s/.test(next) && !isHorizontalRuleOnly(previous)) return true
  if (/^#{1,6}\s/.test(previous) && isParagraphLine(next)) return true
  if (isListLine(previous) && isParagraphLine(next)) return true
  if (isParagraphLine(previous) && isListLine(next)) return true
  if (isParagraphLine(previous) && isParagraphLine(next)) return true
  if (isBlockquoteLine(previous) && isParagraphLine(next) && !isBlockquoteLine(next)) return true
  if (isParagraphLine(previous) && isBlockquoteLine(next)) return true
  if (/^!\[/.test(next) && isParagraphLine(previous)) return true
  if (isParagraphLine(previous) && /^!\[/.test(next)) return true

  return false
}

function needsBlankLineAfter(current, next) {
  if (!next) return false
  const line = current.trim()
  const following = next.trim()
  if (!line || !following) return false

  if (isHorizontalRuleOnly(line)) return true
  return false
}

function isHorizontalRuleOnly(line = '') {
  return /^-{3,}$/.test(String(line).trim())
}

function isListLine(line = '') {
  return /^(\s*[-*+]|\s*\d+\.)\s+/.test(String(line))
}

function isBlockquoteLine(line = '') {
  return String(line).trimStart().startsWith('>')
}

function isNotionChromeLine(line = '') {
  const value = String(line).trim()
  return !value || /^<empty-block\s*\/?>$/i.test(value)
}

function isParagraphLine(line = '') {
  const value = String(line).trim()
  if (!value) return false
  if (isNotionChromeLine(value)) return false
  if (isListLine(value)) return false
  if (isHorizontalRuleOnly(value)) return false
  if (/^#{1,6}\s/.test(value)) return false
  if (isBlockquoteLine(value)) return false
  if (value.startsWith('![')) return false
  if (value.startsWith('|')) return false
  if (value.startsWith('```')) return false
  return true
}

export function convertNotionHtmlTablesToMarkdown(md = '') {
  return String(md || '').replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (match, body) => {
    const openTag = match.match(/^<table\b[^>]*>/i)?.[0] || ''
    const hasHeaderRow = /header-row\s*=\s*["']?true["']?/i.test(openTag)
    const table = htmlTableBodyToMarkdown(body, hasHeaderRow)
    return table || match
  })
}

function htmlTableBodyToMarkdown(body, hasHeaderRow) {
  const rows = parseHtmlTableRows(body)
  if (!rows.length) return ''

  const columnCount = Math.max(...rows.map((row) => row.length))
  const normalized = rows.map((row) => padRow(row, columnCount))

  const lines = []
  const header = hasHeaderRow ? normalized[0] : null
  const bodyRows = hasHeaderRow ? normalized.slice(1) : normalized

  if (header) {
    lines.push(toPipeRow(header))
    lines.push(toSeparatorRow(columnCount))
    bodyRows.forEach((row) => lines.push(toPipeRow(row)))
  } else {
    normalized.forEach((row) => lines.push(toPipeRow(row)))
  }

  return `\n\n${lines.join('\n')}\n\n`
}

function parseHtmlTableRows(body) {
  const rows = []
  const rowMatches = body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)

  for (const rowMatch of rowMatches) {
    const cells = []
    const cellMatches = rowMatch[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)

    for (const cellMatch of cellMatches) {
      cells.push(normalizeTableCell(cellMatch[1]))
    }

    if (cells.length) rows.push(cells)
  }

  return rows
}

function normalizeTableCell(html = '') {
  return String(html || '')
    .replace(/<empty-block\s*\/?>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function padRow(row, length) {
  const next = [...row]
  while (next.length < length) next.push('')
  return next.slice(0, length)
}

function escapePipeCell(value = '') {
  return String(value || '').replace(/\|/g, '\\|')
}

function toPipeRow(cells) {
  return `| ${cells.map(escapePipeCell).join(' | ')} |`
}

function toSeparatorRow(columns) {
  return `| ${Array.from({ length: columns }, () => '---').join(' | ')} |`
}

/** GFM alignment / separator row: only pipes, spaces, colons, hyphens. */
function isMarkdownTableSeparatorLine(line) {
  const s = line.trim()
  if (!s.startsWith('|') || !/[─-]/.test(s)) return false
  return /^[\s|\-:]+$/.test(s)
}

function isPipeTableRowLine(line) {
  return line.trim().startsWith('|')
}

/** Common Notion → MD bold typo around labels inside table cells. */
export function fixNotionTableLabelTypos(md) {
  return md.replace(/\b(Read|Write)\*\*:\*\*/gi, '**$1:**')
}

function fixMultilineNotionPipeTablesInner(md) {
  const lines = md.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''

    if (!isPipeTableRowLine(line) || isMarkdownTableSeparatorLine(line)) {
      out.push(line)
      i++
      continue
    }

    let merged = line
    let j = i + 1

    while (j < lines.length) {
      const rawNext = lines[j] ?? ''
      const nextTrim = rawNext.trim()

      if (nextTrim === '') {
        if (!merged.trimEnd().endsWith('|')) {
          j++
          continue
        }
        break
      }

      if (isMarkdownTableSeparatorLine(rawNext)) break

      if (isPipeTableRowLine(rawNext)) {
        if (merged.trimEnd().endsWith('|')) break
        merged = `${merged.trimEnd()} · ${nextTrim}`
        j++
        continue
      }

      if (!merged.trimEnd().endsWith('|')) {
        merged = `${merged.trimEnd()} · ${nextTrim}`
        j++
        continue
      }

      if (nextTrim.includes('|')) {
        merged = `${merged.trimEnd()} · ${nextTrim}`
        j++
        continue
      }

      break
    }

    out.push(merged)
    i = j
  }

  return out.join('\n')
}

/**
 * Apply pipe-table fixes only outside fenced code blocks (``` ... ```).
 */
export function fixMultilineNotionPipeTables(md) {
  const lines = md.split('\n')
  const out = []
  let outsideBuf = []
  let insideBuf = []
  let inFence = false

  const flushOutside = () => {
    if (!outsideBuf.length) return
    let chunk = outsideBuf.join('\n')
    chunk = fixNotionTableLabelTypos(chunk)
    chunk = fixMultilineNotionPipeTablesInner(chunk)
    out.push(chunk)
    outsideBuf = []
  }

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (!inFence) {
        flushOutside()
        inFence = true
        insideBuf = [line]
      } else {
        insideBuf.push(line)
        out.push(insideBuf.join('\n'))
        insideBuf = []
        inFence = false
      }
      continue
    }

    if (inFence) insideBuf.push(line)
    else outsideBuf.push(line)
  }

  flushOutside()
  if (insideBuf.length) out.push(insideBuf.join('\n'))
  return out.join('\n')
}
