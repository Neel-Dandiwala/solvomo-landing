import * as fs from 'node:fs'
import * as path from 'node:path'
import { buildBlogSeo } from '../src/seo-content.js'

const cwd = process.cwd()
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://solvomo.com').replace(/\/$/, '')
const publicDir = path.join(cwd, 'public')
const blogsPath = path.join(cwd, 'src/content/blogs.generated.json')

const blogs = readJson(blogsPath, []).map((post) => ({ ...post, seo: post.seo || buildBlogSeo(post) }))
const today = new Date().toISOString().slice(0, 10)

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: today },
  { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: today },
  { path: '/pricing', changefreq: 'monthly', priority: '0.8', lastmod: today },
  { path: '/blog', changefreq: 'weekly', priority: '0.8', lastmod: latestBlogDate(blogs) || today },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: today },
  ...blogs.map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: formatDate(post.date) || today,
  })),
]

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt())
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml(routes))
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt(blogs))

console.log(`Generated robots.txt, sitemap.xml, and llms.txt for ${routes.length} routes.`)

function robotsTxt() {
  const aiAgents = [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'PerplexityBot',
    'Google-Extended',
    'Applebot',
    'CCBot',
    'Bytespider',
  ]

  return [
    '# Solvomo crawler policy',
    'User-agent: *',
    'Allow: /',
    '',
    ...aiAgents.flatMap((agent) => ['User-agent: ' + agent, 'Allow: /', '']),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

function sitemapXml(items) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items.map(
      (item) => `  <url>
    <loc>${escapeXml(siteUrl + item.path)}</loc>
    <lastmod>${escapeXml(item.lastmod)}</lastmod>
    <changefreq>${escapeXml(item.changefreq)}</changefreq>
    <priority>${escapeXml(item.priority)}</priority>
  </url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')
}

function llmsTxt(posts) {
  return [
    '# Solvomo',
    '',
    '> Decision intelligence software for growth teams managing cross-channel performance, creative signal, signal quality, and budget allocation.',
    '',
    '## Crawl Policy',
    '',
    '- Public pages, blog posts, images, and metadata are crawlable.',
    '- Canonical site URL: ' + siteUrl,
    '- Sitemap: ' + siteUrl + '/sitemap.xml',
    '- Robots policy: ' + siteUrl + '/robots.txt',
    '',
    '## Primary URLs',
    '',
    '- [Home](' + siteUrl + '/): Solvomo product overview for marketing decision intelligence.',
    '- [About](' + siteUrl + '/about): Why Solvomo exists, what we believe, and how pre-spend simulation works.',
    '- [Pricing](' + siteUrl + '/pricing): Solvomo pricing tiers and what is included in each plan.',
    '- [Blog](' + siteUrl + '/blog): Operating notes on growth operations, AI advertising, signal quality, and decision intelligence.',
    '- [Privacy Policy](' + siteUrl + '/privacy): Privacy policy for website visitors and product inquiries.',
    '',
    '## Blog Posts',
    '',
    ...(posts.length
      ? posts.map((post) => {
          const details = [formatDate(post.date), ...(post.seo.keywords || [])].filter(Boolean).join('; ')
          return `- [${post.seo.seoTitle || post.title}](${siteUrl}/blog/${post.slug}): ${post.seo.metaDescription || post.description || 'Solvomo blog post.'}${details ? ` (${details})` : ''}`
        })
      : ['- No blog posts are currently published.']),
    '',
    '## Preferred Entity Metadata',
    '',
    '- Organization: Solvomo',
    '- Category: marketing decision intelligence software',
    '- Topics: growth operations, performance marketing analytics, AI advertising, creative intelligence, signal governance, budget allocation',
    '- Contact: hello@solvomo.com',
    '',
    '## Blog Topic Map',
    '',
    ...posts.flatMap((post) => [
      `### ${post.seo.seoTitle || post.title}`,
      '',
      `- URL: ${siteUrl}/blog/${post.slug}`,
      `- Summary: ${post.seo.excerpt}`,
      `- Keywords: ${(post.seo.keywords || []).join(', ')}`,
      `- Headings: ${(post.seo.headings || []).join(' | ')}`,
      '',
    ]),
    '',
  ].join('\n')
}

function latestBlogDate(posts) {
  const dates = posts.map((post) => new Date(post.date).getTime()).filter(Number.isFinite)
  if (!dates.length) return ''
  return new Date(Math.max(...dates)).toISOString().slice(0, 10)
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
