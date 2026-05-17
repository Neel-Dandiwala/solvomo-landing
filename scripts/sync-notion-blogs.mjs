import axios from 'axios'
import { Client, LogLevel } from '@notionhq/client'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import * as fs from 'node:fs'
import Mime from 'mime-types'
import * as path from 'node:path'
import { cleanNotionMarkdown, prepareNotionMarkdownForDisplay } from '../src/notion-markdown-tables.js'
import { buildBlogSeo, parseBlogArticleMarkdown } from '../src/seo-content.js'

const cwd = process.cwd()
dotenv.config({ path: path.join(cwd, '.env'), quiet: true })
dotenv.config({ path: path.join(cwd, '.env.local'), quiet: true })

const NOTION_KEY = process.env.NOTION_API_KEY || process.env.NOTION_INTEGRATIONS_KEY || ''
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || ''

const contentDir = path.join(cwd, 'content/blogs')
const imageDir = path.join(cwd, 'public/images/blogs')
const generatedJsonPath = path.join(cwd, 'src/content/blogs.generated.json')

const notion = new Client({ auth: NOTION_KEY, logLevel: LogLevel.ERROR })

if (!NOTION_KEY) {
  console.error('NOTION_API_KEY is required. Add it to .env.local.')
  process.exit(1)
}

if (!BLOG_DATABASE_ID) {
  console.error('NOTION_BLOG_DATABASE_ID is required. Add it to .env.local.')
  process.exit(1)
}

await syncBlogs()

async function syncBlogs() {
  const rows = await getTable(BLOG_DATABASE_ID)

  fs.rmSync(contentDir, { recursive: true, force: true })
  fs.rmSync(imageDir, { recursive: true, force: true })
  fs.mkdirSync(contentDir, { recursive: true })
  fs.mkdirSync(imageDir, { recursive: true })
  fs.writeFileSync(path.join(imageDir, '.gitkeep'), '')
  fs.mkdirSync(path.dirname(generatedJsonPath), { recursive: true })

  console.log('Cleared cached blog markdown and images')

  const posts = []

  console.log(`Found ${rows.length} Notion blog rows`)

  for (const row of rows) {
    if (!isPage(row)) continue

    const title = getTitle(row)
    if (!title) continue

    if (isHidden(row)) {
      console.log(`Skipped hidden post: ${title}`)
      continue
    }

    const pageId = normalizeNotionId(row.id)
    const blockImages = await collectPageImageBlocks(pageId)
    const blockImageMap = new Map(blockImages.map((img) => [normalizeNotionId(img.blockId), img.url]))

    const rawMarkdown = await fetchPageMarkdown(pageId)
    let markdown = await localizeMarkdownImages(rawMarkdown, title, blockImageMap)
    markdown = await injectBlockImages(markdown, blockImages, title)
    markdown = prepareNotionMarkdownForDisplay(markdown)

    const notionImageRefs = (rawMarkdown.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length
    if (notionImageRefs > 0 && !markdown.includes('/images/blogs/')) {
      console.warn(
        [
          `Post "${title}" has ${notionImageRefs} image(s) in Notion but none were downloaded.`,
          'The Notion API is not returning downloadable file URLs for this integration.',
          'Fix: https://www.notion.so/my-integrations → Solvomo-Notion → Capabilities → enable all read/content permissions,',
          're-share the Help Center database, then rerun npm run sync:blogs.',
          'Workaround: use "Embed image" with an external URL instead of uploading files directly in Notion.',
        ].join(' '),
      )
    }

    const cover = await saveImage(getCoverUrl(row), `${title}-cover`)
    const slug = getSlug(title)
    const date = getDate(row)
    const updatedAt = getUpdatedAt(row)
    const author = getAuthor(row)
    const updatedBy = getUpdatedBy(row)
    const tags = getTags(row)
    const articleMeta = getArticleMeta(row, date)
    const rawCleaned = cleanNotionMarkdown(markdown.replaceAll('http://', 'https://'))
    const parsed = parseBlogArticleMarkdown(rawCleaned, title, tags)
    const mergedMeta = mergeArticleMeta(articleMeta, parsed.meta)
    const description = mergedMeta.summary || getSummary(row) || extractDescription(parsed.markdown)

    const post = {
      id: pageId,
      slug,
      title,
      description,
      date,
      updatedAt,
      author,
      updatedBy,
      tags,
      cover,
      articleMeta: mergedMeta,
      markdown: parsed.markdown,
    }

    post.seo = buildBlogSeo(post)

    posts.push(post)

    fs.writeFileSync(
      path.join(contentDir, `${slug}.md`),
      `---\ntitle: ${yamlString(title)}\ndescription: ${yamlString(description)}\ndate: ${date}\nupdatedAt: ${updatedAt}\nauthor: ${yamlString(author)}\nupdatedBy: ${yamlString(updatedBy)}\nslug: ${slug}\ntags: ${JSON.stringify(tags)}\ncategory: ${yamlString(mergedMeta.category)}\nreadMinutes: ${mergedMeta.readMinutes || 0}\ncover: ${cover || ''}\n---\n\n${post.markdown}`,
    )

    console.log(`Synced ${title}`)
    await wait(350)
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  fs.writeFileSync(generatedJsonPath, `${JSON.stringify(posts, null, 2)}\n`)
  console.log(`Wrote ${posts.length} posts to ${generatedJsonPath}`)
}

async function getTable(databaseId) {
  const useDataSources = typeof notion.dataSources?.query === 'function'
  const queryId = useDataSources ? await getDataSourceId(databaseId) : databaseId
  const idKey = useDataSources ? 'data_source_id' : 'database_id'
  const query = useDataSources ? notion.dataSources.query.bind(notion.dataSources) : notion.databases.query.bind(notion.databases)
  const search = { [idKey]: queryId }
  let db

  try {
    db = await query(search)
  } catch (error) {
    handleNotionQueryError(error, databaseId)
  }

  const rows = [...db.results]

  while (db.next_cursor) {
    search.start_cursor = db.next_cursor
    db = await query(search)
    rows.push(...db.results)
  }

  return rows
}

async function getDataSourceId(databaseId) {
  try {
    const database = await notion.databases.retrieve({ database_id: databaseId })
    return database.data_sources?.[0]?.id || databaseId
  } catch (error) {
    if (error?.code !== 'object_not_found') {
      throw error
    }
    return databaseId
  }
}

function handleNotionQueryError(error, databaseId) {
  if (error?.code === 'object_not_found') {
    console.error(
      [
        `Could not access Notion blog database/data source: ${databaseId}`,
        'Share the Notion database with your integration, then rerun npm run sync:blogs.',
        'In Notion: open the database -> Share -> Connections -> add the integration used by NOTION_API_KEY.',
      ].join('\n'),
    )
    process.exit(1)
  }

  throw error
}

function isPage(row) {
  return row?.object === 'page' && 'properties' in row
}

function normalizeNotionId(id) {
  const hex = String(id || '')
    .replace(/-/g, '')
    .toLowerCase()
  if (!/^[0-9a-f]{32}$/.test(hex)) return id
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

async function fetchPageMarkdown(pageId) {
  const response = await notion.pages.retrieveMarkdown({ page_id: pageId })
  return response.markdown || ''
}

async function collectPageImageBlocks(pageId) {
  const images = []

  async function walk(blockId) {
    let cursor
    do {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      })

      for (const block of response.results) {
        if (block.type === 'image') {
          const url = getImageBlockUrl(block.image)
          if (url) {
            const caption = block.image?.caption?.map((item) => item.plain_text).join('').trim() || ''
            images.push({ blockId: block.id, url, alt: caption })
          }
        }

        if (block.has_children) {
          await walk(block.id)
        }
      }

      cursor = response.next_cursor
    } while (cursor)
  }

  await walk(pageId)
  return images
}

function getImageBlockUrl(image) {
  if (!image?.type) return ''
  if (image.type === 'external') return image.external?.url || ''
  if (image.type === 'file') return image.file?.url || ''
  return ''
}

function parseFileAttachmentUri(source) {
  if (!source?.startsWith('file://')) return null
  try {
    const raw = decodeURIComponent(source.replace(/^file:\/\//, ''))
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function resolveImageUrl(source, blockImageMap) {
  const trimmed = String(source || '').trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/images/blogs/')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const attachment = parseFileAttachmentUri(trimmed)
  const blockId = attachment?.permissionRecord?.id
  if (!blockId) return ''

  const normalizedBlockId = normalizeNotionId(blockId)
  if (blockImageMap.has(normalizedBlockId)) {
    return blockImageMap.get(normalizedBlockId)
  }

  try {
    const block = await notion.blocks.retrieve({ block_id: normalizedBlockId })
    return getImageBlockUrl(block.image)
  } catch {
    return ''
  }
}

async function localizeMarkdownImages(markdown, title, blockImageMap) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g
  let updated = markdown
  let imageIndex = 0

  for (const match of markdown.matchAll(imageRegex)) {
    const alt = match[1] || ''
    const source = (match[2] || '').trim()
    const token = match[0]

    if (source.startsWith('/images/blogs/')) continue

    const downloadUrl = await resolveImageUrl(source, blockImageMap)
    let replacement = ''

    if (downloadUrl) {
      replacement = await saveImage(downloadUrl, `${title}-${imageIndex++}`)
    } else if (source.startsWith('file://')) {
      console.warn(
        `Could not resolve Notion file attachment in "${title}". Check integration file-read capabilities at https://www.notion.so/my-integrations`,
      )
    } else if (source) {
      console.warn(`Could not download image for "${title}": ${source.slice(0, 120)}`)
    }

    updated = updated.replace(token, replacement ? `![${alt}](${replacement})` : '')
  }

  return updated.replace(/\n{3,}/g, '\n\n').trim()
}

async function injectBlockImages(markdown, blockImages, title) {
  if (!blockImages.length) return markdown

  const lines = markdown.split('\n')
  const placeholderRegex = /^!\[\]\(\s*\)$|^!\[[^\]]*\]\(\s*\)$|^image\.(png|jpe?g|gif|webp|svg)$/i
  let imageIndex = 0
  const out = []

  for (const line of lines) {
    const trimmed = line.trim()
    const needsImage =
      placeholderRegex.test(trimmed) ||
      (trimmed.startsWith('![') && trimmed.includes('](file://'))

    if (needsImage && imageIndex < blockImages.length) {
      const localPath = await saveImage(blockImages[imageIndex].url, `${title}-block-${imageIndex}`)
      imageIndex += 1
      if (localPath) {
        const alt = blockImages[imageIndex - 1]?.alt || ''
        out.push(`![${alt}](${localPath})`)
        continue
      }
    }

    out.push(line)
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

async function saveImage(url, title) {
  if (!url) return ''

  try {
    const image = await axios(url, {
      responseType: 'arraybuffer',
      headers: { Accept: '*/*' },
    })

    if (!image?.data) return ''

    const contentType = image.headers?.['content-type']
    const ext = Mime.extension(contentType) || extensionFromUrl(url) || 'png'
    const filename = `${getSlug(title)}-${createHash('sha256').update(url).digest('hex').slice(0, 10)}.${ext}`
    const outputPath = path.join(imageDir, filename)

    fs.writeFileSync(outputPath, image.data)
    return `/images/blogs/${filename}`
  } catch (error) {
    console.error(`Could not save image ${url}`, error.message)
    return ''
  }
}

function extensionFromUrl(url) {
  const cleanUrl = url.split('?')[0] || ''
  const ext = path.extname(cleanUrl).replace('.', '').toLowerCase()
  return ext || ''
}

function getTitle(page) {
  const titleProp = pickProperty(page, ['Title']) || Object.values(page.properties).find((property) => property.type === 'title')
  return propertyValueToPlain(titleProp)
}

function getSummary(page) {
  return propertyValueToPlain(pickProperty(page, ['Summary', 'Description', 'Excerpt', 'Meta Description']))
}

function getCategory(page) {
  return stripInlineFormatting(propertyValueToPlain(pickProperty(page, ['Category'])))
}

function getMinuteRead(page) {
  const property = pickProperty(page, ['Minute read', 'Read time', 'Reading time', 'Minutes read'])
  if (property?.type === 'number' && typeof property.number === 'number') return property.number
  const parsed = Number(propertyValueToPlain(property))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function getArticleMeta(page, date) {
  const year = getYearFromDate(date)
  return {
    category: getCategory(page),
    year,
    readMinutes: getMinuteRead(page),
    summary: getSummary(page),
  }
}

function mergeArticleMeta(fromNotion, fromMarkdown) {
  return {
    category: fromNotion.category || fromMarkdown.category || '',
    year: fromNotion.year || fromMarkdown.year || '',
    readMinutes: fromNotion.readMinutes || fromMarkdown.readMinutes || 0,
    summary: fromNotion.summary || fromMarkdown.summary || '',
  }
}

function getYearFromDate(date) {
  if (!date) return ''
  const year = new Date(date).getFullYear()
  return Number.isFinite(year) ? String(year) : ''
}

function getDate(page) {
  return (
    getPropertyDate(page, ['Created at', 'Published Date', 'Publish Date', 'Date', 'published_date']) ||
    page.created_time ||
    new Date().toISOString()
  )
}

function getUpdatedAt(page) {
  return getPropertyDate(page, ['Updated at', 'Modified at']) || getDate(page)
}

function getAuthor(page) {
  return richTextToPlain(pickProperty(page, ['Author'])) || 'Solvomo'
}

function getUpdatedBy(page) {
  return richTextToPlain(pickProperty(page, ['Updated by']))
}

function getTags(page) {
  const property = pickProperty(page, ['Tags', 'Tag'])
  if (property?.type === 'multi_select') return property.multi_select.map((tag) => tag.name)
  if (property?.type === 'select' && property.select?.name) return [property.select.name]

  const text = propertyValueToPlain(property)
  if (!text) return []

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) return parsed.map((tag) => String(tag).trim()).filter(Boolean)
    } catch {
      // fall through
    }
  }

  return text
    .split(/[,;|]/)
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

function getPropertyDate(page, names) {
  const property = pickProperty(page, names)
  if (property?.type === 'date' && property.date?.start) return property.date.start
  return parseRichTextDate(richTextToPlain(property))
}

function parseRichTextDate(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  const parsed = Date.parse(text)
  if (!Number.isFinite(parsed)) return ''
  return new Date(parsed).toISOString()
}

function isHidden(page) {
  const property = pickProperty(page, ['Hide', 'Hidden'])
  if (property?.type === 'checkbox') return property.checkbox === true
  if (property?.type === 'select' && property.select?.name) {
    return ['true', 'yes', 'hidden', '__yes__'].includes(property.select.name.toLowerCase())
  }

  const text = propertyValueToPlain(property).toLowerCase()
  return text === 'true' || text === 'yes' || text === 'hidden' || text === '__yes__'
}

function getCoverUrl(page) {
  if (page.cover?.type === 'external') return page.cover.external.url
  if (page.cover?.type === 'file') return page.cover.file.url
  return ''
}

function pickProperty(page, names) {
  for (const name of names) {
    if (page.properties[name]) return page.properties[name]
  }
  return undefined
}

function propertyValueToPlain(property) {
  if (!property?.type) return ''

  switch (property.type) {
    case 'title':
      return property.title?.map((item) => item.plain_text).join('') || ''
    case 'rich_text':
      return property.rich_text?.map((item) => item.plain_text).join('') || ''
    case 'number':
      return property.number == null ? '' : String(property.number)
    case 'select':
      return property.select?.name || ''
    case 'multi_select':
      return property.multi_select?.map((item) => item.name).join(', ') || ''
    case 'checkbox':
      return property.checkbox ? '__YES__' : '__NO__'
    case 'date':
      return property.date?.start || ''
    case 'url':
      return property.url || ''
    case 'formula':
      return property.formula?.string || (property.formula?.number != null ? String(property.formula.number) : '')
    default:
      return ''
  }
}

function richTextToPlain(property) {
  return property?.type === 'rich_text' ? propertyValueToPlain(property) : ''
}

function stripInlineFormatting(value = '') {
  return String(value || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .trim()
}

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/['"’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function localDate(date) {
  return new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
}

function yamlString(value) {
  return `"${String(value || '').replace(/"/g, '\\"')}"`
}

function extractDescription(content) {
  let text = content
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim()

  const firstLine = text
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 40)

  text = firstLine || text.split('\n')[0] || ''
  if (text.length <= 160) return text

  const truncated = text.slice(0, 160)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : 160)}...`
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

console.log(`Blog sync complete. Open /blog after running npm run dev.\nGenerated dates display like: ${localDate(new Date())}`)
