const STOP_WORDS = new Set([
  'about',
  'after',
  'again',
  'also',
  'because',
  'before',
  'between',
  'could',
  'every',
  'from',
  'have',
  'into',
  'just',
  'more',
  'need',
  'only',
  'that',
  'their',
  'there',
  'these',
  'they',
  'this',
  'through',
  'what',
  'when',
  'where',
  'which',
  'while',
  'with',
  'will',
  'would',
  'change',
  'digital',
  'important',
  'marketing',
  'redefine',
])

const TOPIC_PHRASES = [
  'ChatGPT ads',
  'AI advertising',
  'digital advertising',
  'performance marketing',
  'marketing analytics',
  'ROI measurement',
  'attribution',
  'paid social',
  'paid search',
  'creative intelligence',
  'signal quality',
  'growth operations',
  'budget allocation',
  'customer journey',
  'conversational intent',
  'conversational AI',
  'OpenAI',
  'CPC bidding',
  'conversion tracking',
  'customer acquisition cost',
  'Google Ads',
  'Meta Ads',
  'TikTok Ads',
  'LinkedIn Ads',
  'ROAS',
]

export function stripMarkdown(markdown = '') {
  return markdown
    .replace(/^---\s*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_~>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractImage(markdown = '') {
  const match = markdown.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/)
  return match?.[1] || ''
}

export function readingTime(markdown = '') {
  const words = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export function extractHeadings(markdown = '') {
  return [...markdown.matchAll(/^#{2,3}\s+(.+)$/gm)]
    .map((match) => stripMarkdown(match[1]))
    .filter(Boolean)
}

export function parseBlogArticleMarkdown(markdown = '', title = '', tags = []) {
  const lines = String(markdown || '').split('\n')
  const meta = { category: '', year: '', readMinutes: 0, summary: '' }
  const tagSet = new Set(tags.map((tag) => tag.toLowerCase().trim()).filter(Boolean))
  const body = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      i++
      continue
    }

    if (isHeading(line) && shouldDropLeadingHeading(line, title)) {
      i++
      continue
    }

    if (trimmed === '---' || trimmed.startsWith('---')) {
      const split = splitMetaPrefix(trimmed)
      if (split.meta) Object.assign(meta, split.meta)
      if (split.remainder) body.push(split.remainder)
      i++
      continue
    }

    const metaLine = parseMetaLine(trimmed)
    if (metaLine) {
      Object.assign(meta, metaLine)
      i++
      continue
    }

    if (/^summary\s*:/i.test(trimmed)) {
      meta.summary = trimmed.replace(/^summary\s*:\s*/i, '').trim()
      i++
      continue
    }

    if (tagSet.has(trimmed.toLowerCase()) && trimmed.length < 50) {
      i++
      continue
    }

    if (isBrokenImageLine(trimmed)) {
      i++
      continue
    }

    break
  }

  for (; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (!trimmed) {
      body.push(lines[i])
      continue
    }
    if (isBrokenImageLine(trimmed)) continue
    if (meta.summary && isSimilarText(trimmed, meta.summary)) continue
    body.push(lines[i])
  }

  let cleaned = body.join('\n').trim()
  const cleanedLines = cleaned.split('\n')

  while (cleanedLines.length && cleanedLines[0].trim() === '') cleanedLines.shift()
  while (cleanedLines.length && isHeading(cleanedLines[0]) && shouldDropLeadingHeading(cleanedLines[0], title)) {
    cleanedLines.shift()
    while (cleanedLines.length && cleanedLines[0].trim() === '') cleanedLines.shift()
  }

  cleaned = cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim()

  return { markdown: cleaned, meta }
}

export function renderableBlogMarkdown(markdown = '', title = '', tags = []) {
  return parseBlogArticleMarkdown(markdown, title, tags).markdown
}

export function metaDescription(markdown = '', fallback = '') {
  const parsed = parseBlogArticleMarkdown(markdown)
  if (parsed.meta.summary) return truncateAtWord(parsed.meta.summary, 155)

  const bodyWithoutHeadings = parsed.markdown.replace(/^#{1,6}\s+.+$/gm, ' ')
  const text = stripMarkdown(bodyWithoutHeadings)
  const candidate =
    text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .find((sentence) => sentence.length >= 90 && sentence.length <= 180) ||
    fallback ||
    text

  return truncateAtWord(candidate.replace(/\s+/g, ' '), 155)
}

export function extractKeywords({ title = '', markdown = '', tags = [] } = {}) {
  const parsed = parseBlogArticleMarkdown(markdown, title, tags)
  const text = `${title} ${stripMarkdown(parsed.markdown)}`.toLowerCase()
  const matchedPhrases = TOPIC_PHRASES.filter((phrase) => text.includes(phrase.toLowerCase()))
  const countedTerms = [...text.matchAll(/\b[a-z][a-z0-9]{3,}\b/g)]
    .map(([word]) => word)
    .filter((word) => !STOP_WORDS.has(word) && !matchedPhrases.some((phrase) => phrase.toLowerCase().includes(word)))
    .reduce((acc, word) => {
      acc.set(word, (acc.get(word) || 0) + 1)
      return acc
    }, new Map())

  const frequentTerms = [...countedTerms.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)

  return uniqueList([...tags.filter((tag) => tag && tag.toLowerCase() !== 'blog'), ...matchedPhrases, ...frequentTerms]).slice(0, 18)
}

export function buildBlogSeo(post) {
  const parsed = parseBlogArticleMarkdown(post?.markdown || '', post?.title || '', post?.tags || [])
  const markdown = parsed.markdown
  const keywords = extractKeywords({ title: post?.title, markdown, tags: post?.tags || [] })
  const image = post?.cover || extractImage(markdown)
  const description = metaDescription(post?.markdown || '', post?.description)
  const headings = extractHeadings(markdown)
  const text = stripMarkdown(markdown)
  const readMinutes = parsed.meta.readMinutes || readingTime(markdown)

  return {
    seoTitle: post?.title || '',
    metaDescription: description,
    keywords,
    headings,
    image,
    excerpt: truncateAtWord(parsed.meta.summary || text, 320),
    wordCount: text.split(/\s+/).filter(Boolean).length,
    readingMinutes: readMinutes,
    articleMeta: parsed.meta,
  }
}

function uniqueList(items) {
  const seen = new Set()
  return items
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function truncateAtWord(value, limit) {
  const clean = String(value || '').trim()
  if (clean.length <= limit) return clean
  const truncated = clean.slice(0, limit)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : limit).replace(/[.,;:!?-]+$/, '')}...`
}

function parseMetaLine(line) {
  const split = splitMetaPrefix(line)
  return split.meta
}

function splitMetaPrefix(line) {
  const cleaned = String(line || '')
    .replace(/^---+\s*/, '')
    .trim()
  const match = cleaned.match(/^(.+?)\s*[·|]\s*((?:19|20)\d{2})(?:\s*[·|]\s*(\d+)\s*min\s*read)?(?:\s*(.*))?$/i)
  if (!match) return { meta: null, remainder: cleaned }

  return {
    meta: {
      category: match[1].trim(),
      year: match[2],
      readMinutes: match[3] ? Number(match[3]) : 0,
    },
    remainder: (match[4] || '').trim(),
  }
}

function isHeading(line = '') {
  return /^#{1,3}\s+\S/.test(line.trim())
}

function shouldDropLeadingHeading(line = '', title = '') {
  const heading = line.replace(/^#{1,6}\s+/, '').trim()
  if (!title) return true

  const normalizedHeading = normalizeTitle(heading)
  const normalizedTitle = normalizeTitle(title)

  return (
    normalizedHeading.includes(normalizedTitle) ||
    normalizedTitle.includes(normalizedHeading) ||
    similarity(normalizedHeading, normalizedTitle) > 0.55
  )
}

function isBrokenImageLine(line = '') {
  const value = line.trim()
  if (!value.startsWith('![')) return false
  const match = value.match(/^!\[[^\]]*\]\(([^)]*)\)/)
  if (!match) return false
  return !(match[1] || '').trim()
}

function isSimilarText(a, b) {
  return similarity(normalizeTitle(a), normalizeTitle(b)) > 0.72
}

function normalizeTitle(value = '') {
  return value
    .toLowerCase()
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function similarity(a, b) {
  const aWords = new Set(a.split(/\s+/).filter(Boolean))
  const bWords = new Set(b.split(/\s+/).filter(Boolean))
  if (!aWords.size || !bWords.size) return 0
  const overlap = [...aWords].filter((word) => bWords.has(word)).length
  return overlap / Math.max(aWords.size, bWords.size)
}
