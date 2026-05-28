import * as fs from 'node:fs'
import * as path from 'node:path'

const cwd = process.cwd()
const distDir = path.join(cwd, 'dist')
const indexPath = path.join(distDir, 'index.html')
const sitemapPath = path.join(distDir, 'sitemap.xml')

if (!fs.existsSync(indexPath)) {
  throw new Error('Cannot generate route fallbacks because dist/index.html does not exist.')
}

const routes = readRoutesFromSitemap(sitemapPath)

for (const route of routes) {
  if (route === '/') continue

  const routePath = route.replace(/^\/+|\/+$/g, '')
  if (!routePath) continue

  const targetDir = path.join(distDir, routePath)
  const targetPath = path.join(targetDir, 'index.html')

  fs.mkdirSync(targetDir, { recursive: true })
  fs.copyFileSync(indexPath, targetPath)
}

console.log(`Generated SPA route fallbacks for ${Math.max(routes.length - 1, 0)} routes.`)

function readRoutesFromSitemap(filePath) {
  if (!fs.existsSync(filePath)) {
    return ['/', '/about', '/pricing', '/blog', '/privacy']
  }

  const sitemap = fs.readFileSync(filePath, 'utf8')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const routes = urls
    .map((url) => {
      try {
        return new URL(url).pathname
      } catch {
        return ''
      }
    })
    .filter(Boolean)

  return [...new Set(routes)]
}
