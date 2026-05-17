import * as fs from 'node:fs'
import * as path from 'node:path'

const cwd = process.cwd()
const jsonPath = path.join(cwd, 'src/content/blogs.generated.json')
const publicImageDir = path.join(cwd, 'public/images/blogs')
const distImageDir = path.join(cwd, 'dist/images/blogs')

if (!fs.existsSync(jsonPath)) {
  console.log('No blogs.generated.json — skipping image verification.')
  process.exit(0)
}

const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const imagePaths = new Set()

for (const post of posts) {
  const sources = [post.markdown, post.cover, post.seo?.image].filter(Boolean).join('\n')
  for (const match of sources.matchAll(/\/images\/blogs\/[^\s)"']+/g)) {
    imagePaths.add(match[0])
  }
}

if (!imagePaths.size) {
  console.log('No blog images referenced.')
  process.exit(0)
}

const missingPublic = []
const missingDist = []

for (const imagePath of imagePaths) {
  const relative = imagePath.replace(/^\//, '')
  const publicFile = path.join(cwd, 'public', relative.replace(/^public\//, ''))
  const distFile = path.join(cwd, 'dist', relative)

  if (!fs.existsSync(publicFile)) missingPublic.push(imagePath)
  if (fs.existsSync(path.join(cwd, 'dist')) && !fs.existsSync(distFile)) {
    missingDist.push(imagePath)
  }
}

if (missingPublic.length) {
  console.error('Blog images missing from public/:')
  missingPublic.forEach((p) => console.error(`  - ${p}`))
  console.error('\nRun: npm run sync:blogs')
  console.error('Ensure public/images/blogs/*.png are committed and pushed to GitHub.')
  process.exit(1)
}

if (missingDist.length) {
  console.error('Blog images missing from dist/ after build:')
  missingDist.forEach((p) => console.error(`  - ${p}`))
  process.exit(1)
}

console.log(`Verified ${imagePaths.size} blog image(s) in public/ and dist/.`)
