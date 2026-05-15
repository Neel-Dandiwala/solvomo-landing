import axios from 'axios'
import { Client, LogLevel } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import * as fs from 'node:fs'
import Mime from 'mime-types'
import * as path from 'node:path'

const cwd = process.cwd()
dotenv.config({ path: path.join(cwd, '.env'), quiet: true })
dotenv.config({ path: path.join(cwd, '.env.local'), quiet: true })

const NOTION_KEY = process.env.NOTION_API_KEY || process.env.NOTION_INTEGRATIONS_KEY || ''
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || ''

const contentDir = path.join(cwd, 'content/blogs')
const imageDir = path.join(cwd, 'public/images/blogs')
const generatedJsonPath = path.join(cwd, 'src/content/blogs.generated.json')

const notion = new Client({ auth: NOTION_KEY, logLevel: LogLevel.ERROR })
const n2m = new NotionToMarkdown({ notionClient: notion })

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
  fs.mkdirSync(contentDir, { recursive: true })
  fs.mkdirSync(imageDir, { recursive: true })
  fs.mkdirSync(path.dirname(generatedJsonPath), { recursive: true })

  const posts = []

  console.log(`Found ${rows.length} Notion blog rows`)

  for (const row of rows) {
    if (!isPage(row)) continue

    const title = getTitle(row)
    if (!title) continue

    const mdBlocks = await n2m.pageToMarkdown(row.id)
    let markdown = mdToPlainString(n2m.toMarkdownString(mdBlocks))
    markdown = await localizeMarkdownImages(markdown, title)
    markdown = fixMultilineNotionPipeTables(markdown)

    const cover = await saveImage(getCoverUrl(row), `${title}-cover`)
    const slug = getSlug(title)
    const date = getDate(row)
    const description = getDescription(row, markdown)
    const tags = getTags(row)

    const post = {
      id: row.id,
      slug,
      title,
      description,
      date,
      tags,
      cover,
      markdown: clean(markdown.replaceAll('http://', 'https://')),
    }

    posts.push(post)

    fs.writeFileSync(
      path.join(contentDir, `${slug}.md`),
      `---\ntitle: ${yamlString(title)}\ndescription: ${yamlString(description)}\ndate: ${date}\nslug: ${slug}\ntags: ${JSON.stringify(tags)}\ncover: ${cover || ''}\n---\n\n${post.markdown}`,
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

function mdToPlainString(md) {
  if (md === null || md === undefined) return ''
  if (typeof md === 'string') return md
  if (Array.isArray(md)) return md.map((item) => mdToPlainString(item)).join('\n')
  if (typeof md === 'object') {
    const parent = typeof md.parent === 'string' ? md.parent : ''
    const children = Array.isArray(md.children) ? md.children.map((child) => mdToPlainString(child)).join('\n') : ''
    return [parent, children].filter(Boolean).join('\n')
  }
  return String(md)
}

async function localizeMarkdownImages(markdown, title) {
  const imageRegex = /!\[([^\]]*)\]\((?!\/images\/blogs\/)([^\s)]+)(?:\s+"([^"]+)")?\)/gm
  let updated = markdown
  let match
  let imageIndex = 0

  while ((match = imageRegex.exec(markdown)) !== null) {
    const source = match[2]
    const replacement = await saveImage(source, `${title}-${imageIndex++}`)
    if (replacement) {
      updated = updated.replace(match[0], `![${match[1] || ''}](${replacement})`)
    }
  }

  return updated
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
  const titleProp = Object.values(page.properties).find((property) => property.type === 'title')
  return titleProp?.title?.[0]?.plain_text || ''
}

function getDescription(page, markdown) {
  const property = pickProperty(page, ['Description', 'Summary', 'Excerpt', 'Meta Description'])
  const fromProperty = richTextToPlain(property)
  return fromProperty || extractDescription(markdown)
}

function getDate(page) {
  const property = pickProperty(page, ['Published Date', 'Publish Date', 'Date', 'published_date'])
  if (property?.type === 'date' && property.date?.start) return property.date.start
  return page.created_time || new Date().toISOString()
}

function getTags(page) {
  const property = pickProperty(page, ['Tags', 'Tag', 'Category', 'Categories'])
  if (property?.type === 'multi_select') return property.multi_select.map((tag) => tag.name)
  if (property?.type === 'select' && property.select?.name) return [property.select.name]
  return []
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

function richTextToPlain(property) {
  if (property?.type !== 'rich_text') return ''
  return property.rich_text.map((item) => item.plain_text).join('')
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

function clean(str) {
  return str.replace(/’/g, "'").replace(/“/g, '"').replace(/”/g, '"')
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

function isMarkdownTableSeparatorLine(line) {
  const s = line.trim()
  if (!s.startsWith('|') || !/-/.test(s)) return false
  return /^[\s|\-:]+$/.test(s)
}

function isPipeTableRowLine(line) {
  return line.trim().startsWith('|')
}

function fixNotionTableLabelTypos(md) {
  return md.replace(/\b(Read|Write)\*\*:\*\*/gi, '**$1:**')
}

function fixMultilineNotionPipeTablesInner(md) {
  const lines = md.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] || ''

    if (!isPipeTableRowLine(line) || isMarkdownTableSeparatorLine(line)) {
      out.push(line)
      i++
      continue
    }

    let merged = line
    let j = i + 1

    while (j < lines.length) {
      const rawNext = lines[j] || ''
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
        merged = `${merged.trimEnd()} - ${nextTrim}`
        j++
        continue
      }

      if (!merged.trimEnd().endsWith('|') || nextTrim.includes('|')) {
        merged = `${merged.trimEnd()} - ${nextTrim}`
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

function fixMultilineNotionPipeTables(md) {
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

console.log(`Blog sync complete. Open /blog after running npm run dev.\nGenerated dates display like: ${localDate(new Date())}`)
