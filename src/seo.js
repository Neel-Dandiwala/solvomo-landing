import { createElement, useEffect } from 'react'
export {
  buildBlogSeo,
  extractHeadings,
  extractImage,
  extractKeywords,
  metaDescription,
  parseBlogArticleMarkdown,
  readingTime,
  renderableBlogMarkdown,
  stripMarkdown,
} from './seo-content.js'

export const SITE_NAME = 'Solvomo'
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://solvomo.com').replace(/\/$/, '')
export const DEFAULT_DESCRIPTION =
  'Solvomo is decision intelligence software for growth teams managing channel performance, creative signal, and budget allocation in one operating layer.'

const META_SELECTOR = 'data-solvomo-seo'

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: 'hello@solvomo.com',
    sameAs: ['https://www.linkedin.com/company/solvomo'],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: organizationSchema(),
    inLanguage: 'en',
  }
}

export function HiddenCrawlerMetadata({ title, description, canonical, type = 'WebPage', tags = [], children }) {
  const pairs = [
    ['Page type', type],
    ['Title', title],
    ['Description', description],
    ['Canonical URL', canonical],
    tags.length ? ['Topics', tags.join(', ')] : null,
  ].filter(Boolean)

  return createElement(
    'section',
    {
      className: 'crawler-metadata',
      'aria-label': 'Crawler metadata',
      style: {
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
      },
    },
    createElement(
      'dl',
      null,
      pairs.flatMap(([term, detail]) => [
        createElement('dt', { key: `${term}-term` }, term),
        createElement('dd', { key: `${term}-detail` }, detail),
      ]),
      children,
    ),
  )
}

export function useSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  image = '',
  publishedTime,
  modifiedTime,
  tags = [],
  jsonLd = [],
}) {
  useEffect(() => {
    const canonical = absoluteUrl(path)
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    const imageUrl = image ? absoluteUrl(image) : ''

    document.documentElement.lang = 'en'
    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    upsertMeta('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    upsertMeta('name', 'bingbot', 'index, follow, max-snippet:-1, max-image-preview:large')
    upsertMeta('name', 'ai-crawlable', 'true')
    upsertMeta('name', 'application-name', SITE_NAME)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:locale', 'en_US')
    upsertMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)

    upsertOptionalMeta('property', 'og:image', imageUrl)
    upsertOptionalMeta('name', 'twitter:image', imageUrl)
    upsertOptionalMeta('property', 'og:image:alt', imageUrl ? `${fullTitle} preview image` : '')
    upsertOptionalMeta('name', 'twitter:image:alt', imageUrl ? `${fullTitle} preview image` : '')
    upsertOptionalMeta('property', 'article:published_time', publishedTime)
    upsertOptionalMeta('property', 'article:modified_time', modifiedTime)
    upsertRepeatedMeta('property', 'article:tag', tags)
    upsertLink('canonical', canonical)
    upsertLink('alternate', absoluteUrl('/llms.txt'), 'text/plain')

    upsertJsonLd('route', jsonLd)
  }, [description, image, jsonLd, modifiedTime, path, publishedTime, tags, title, type])
}

function upsertMeta(attribute, value, content) {
  if (!content) return
  const selector = `meta[${attribute}="${cssEscape(value)}"]:not([data-repeated-seo])`
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    element.setAttribute(META_SELECTOR, 'true')
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertOptionalMeta(attribute, value, content) {
  if (content) {
    upsertMeta(attribute, value, content)
    return
  }

  document.head.querySelectorAll(`meta[${attribute}="${cssEscape(value)}"]:not([data-repeated-seo])`).forEach((element) => element.remove())
}

function upsertRepeatedMeta(attribute, value, contents) {
  document.head.querySelectorAll(`meta[${attribute}="${cssEscape(value)}"][data-repeated-seo]`).forEach((element) => element.remove())

  contents.filter(Boolean).forEach((content) => {
    const element = document.createElement('meta')
    element.setAttribute(attribute, value)
    element.setAttribute('content', content)
    element.setAttribute('data-repeated-seo', 'true')
    element.setAttribute(META_SELECTOR, 'true')
    document.head.appendChild(element)
  })
}

function upsertLink(rel, href, type) {
  let element = document.head.querySelector(`link[rel="${cssEscape(rel)}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    element.setAttribute(META_SELECTOR, 'true')
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
  if (type) element.setAttribute('type', type)
}

function upsertJsonLd(id, items) {
  const elementId = `solvomo-jsonld-${id}`
  let element = document.getElementById(elementId)
  const graph = Array.isArray(items) ? items.filter(Boolean) : [items].filter(Boolean)

  if (!element) {
    element = document.createElement('script')
    element.id = elementId
    element.type = 'application/ld+json'
    element.setAttribute(META_SELECTOR, 'true')
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(graph.length === 1 ? graph[0] : { '@context': 'https://schema.org', '@graph': graph })
}

function cssEscape(value) {
  return String(value).replace(/"/g, '\\"')
}
