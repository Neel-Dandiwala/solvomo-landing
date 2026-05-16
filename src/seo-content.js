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
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
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

export function metaDescription(markdown = '', fallback = '') {
  const bodyWithoutHeadings = markdown.replace(/^#{1,6}\s+.+$/gm, ' ')
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
  const text = `${title} ${stripMarkdown(markdown)}`.toLowerCase()
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
  const markdown = post?.markdown || ''
  const keywords = extractKeywords({ title: post?.title, markdown, tags: post?.tags || [] })
  const image = post?.cover || extractImage(markdown)
  const description = metaDescription(markdown, post?.description)
  const headings = extractHeadings(markdown)
  const text = stripMarkdown(markdown)

  return {
    seoTitle: post?.title || '',
    metaDescription: description,
    keywords,
    headings,
    image,
    excerpt: truncateAtWord(text, 320),
    wordCount: text.split(/\s+/).filter(Boolean).length,
    readingMinutes: readingTime(markdown),
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
