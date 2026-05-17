import ReactMarkdown from 'react-markdown'
import { Link, Navigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { COLOUR_LOGO, WHITE_LOGO } from './assets.js'
import blogs from './content/blogs.generated.json'
import { HiddenCrawlerMetadata, absoluteUrl, buildBlogSeo, renderableBlogMarkdown, useSeo, websiteSchema } from './seo.js'

const BLOG_INDEX_TITLE = 'Solvomo Blog - Growth operations and decision intelligence'
const BLOG_INDEX_DESCRIPTION = 'Operating notes from Solvomo on growth operations, signal quality, AI advertising, and decision intelligence for performance teams.'

function Header() {
  return (
    <header className="border-b border-black/10 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="logo-mark h-8 w-10 shrink-0">
            <img src={WHITE_LOGO} alt="Solvomo logo" className="h-full w-full" />
          </div>
          <span className="brand-wordmark text-[1.05rem]">Solvomo</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatArticleMetaLine(meta = {}) {
  const parts = []
  if (meta.category && meta.year) parts.push(`${meta.category} · ${meta.year}`)
  else if (meta.category) parts.push(meta.category)
  else if (meta.year) parts.push(meta.year)

  if (meta.readMinutes) parts.push(`${meta.readMinutes} min read`)

  return parts.join(' | ')
}

function getPosts() {
  return [...blogs]
    .filter((post) => !post.hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function BlogIndex() {
  const posts = getPosts()
  const postsWithSeo = posts.map((post) => ({ ...post, seo: post.seo || buildBlogSeo(post) }))
  const tags = [...new Set(postsWithSeo.flatMap((post) => post.seo.keywords || post.tags || []))]

  useSeo({
    title: BLOG_INDEX_TITLE,
    description: BLOG_INDEX_DESCRIPTION,
    path: '/blog',
    image: COLOUR_LOGO,
    tags: ['growth operations', 'decision intelligence', 'performance marketing', ...tags],
    jsonLd: [
      websiteSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: BLOG_INDEX_TITLE,
        description: BLOG_INDEX_DESCRIPTION,
        url: absoluteUrl('/blog'),
        isPartOf: websiteSchema(),
        mainEntity: {
          '@type': 'Blog',
          name: 'Solvomo Blog',
          blogPost: postsWithSeo.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.seo.seoTitle || post.title,
            description: post.seo.metaDescription || post.description,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.date,
            image: post.seo.image ? [absoluteUrl(post.seo.image)] : undefined,
            keywords: post.seo.keywords?.join(', '),
          })),
        },
      },
    ],
  })

  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <Header />
      <HiddenCrawlerMetadata title={BLOG_INDEX_TITLE} description={BLOG_INDEX_DESCRIPTION} canonical={absoluteUrl('/blog')} tags={tags}>
        <dt>Indexed blog URLs</dt>
        <dd>{postsWithSeo.map((post) => absoluteUrl(`/blog/${post.slug}`)).join(', ')}</dd>
      </HiddenCrawlerMetadata>
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Blog</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-black sm:text-5xl">
            Operating notes from
            <span className="headline-product block">Solvomo.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-black/60">
            Long-form thinking on growth operations, signal quality, and decision intelligence.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-5">
            {postsWithSeo.map((post) => (
              <article key={post.slug} className="surface-frame overflow-hidden rounded-[18px]">
                {post.cover ? <img src={post.cover} alt="" className="h-56 w-full object-cover" /> : null}
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-black/46">
                    <span>{formatDate(post.date)}</span>
                    {post.tags?.map((tag) => (
                      <span key={tag} className="rounded-full border border-black/10 px-2.5 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-black">
                    <Link to={`/blog/${post.slug}`} className="hover:underline hover:decoration-black/20 hover:underline-offset-4">
                      {post.title}
                    </Link>
                  </h2>
                  {post.seo.metaDescription ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/58">{post.seo.metaDescription}</p> : null}
                  <Link to={`/blog/${post.slug}`} className="button-secondary mt-5 inline-flex rounded-[14px] px-4 py-2.5 text-sm font-semibold">
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = getPosts().find((item) => item.slug === slug)
  const seo = post ? post.seo || buildBlogSeo(post) : null
  const postImage = seo?.image || ''
  const postPath = post ? `/blog/${post.slug}` : '/blog'
  const postDescription = seo?.metaDescription || post?.description || BLOG_INDEX_DESCRIPTION
  const postReadingTime = seo?.readingMinutes || 0
  const articleMeta = seo?.articleMeta || {}
  const markdownBody = post ? renderableBlogMarkdown(post.markdown, post.title, post.tags) : ''

  useSeo({
    title: seo?.seoTitle || post?.title || BLOG_INDEX_TITLE,
    description: postDescription,
    path: postPath,
    type: post ? 'article' : 'website',
    image: postImage,
    publishedTime: post?.date,
    modifiedTime: post?.updatedAt || post?.date,
    tags: seo?.keywords || post?.tags || [],
    jsonLd: post
      ? [
          websiteSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: seo.seoTitle || post.title,
            alternativeHeadline: seo.headings?.[0],
            description: postDescription,
            url: absoluteUrl(postPath),
            mainEntityOfPage: absoluteUrl(postPath),
            datePublished: post.date,
            dateModified: post.updatedAt || post.date,
            image: postImage ? [absoluteUrl(postImage)] : undefined,
            author: {
              '@type': 'Organization',
              name: 'Solvomo',
              url: absoluteUrl('/'),
            },
            publisher: {
              '@type': 'Organization',
              name: 'Solvomo',
              url: absoluteUrl('/'),
            },
            keywords: seo.keywords?.join(', '),
            articleSection: seo.keywords?.[0] || 'Marketing',
            wordCount: seo.wordCount,
            timeRequired: `PT${postReadingTime}M`,
            inLanguage: 'en',
            about: seo.keywords?.map((name) => ({ '@type': 'Thing', name })),
          },
        ]
      : [websiteSchema()],
  })

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <Header />
      <HiddenCrawlerMetadata title={post.title} description={postDescription} canonical={absoluteUrl(postPath)} type="BlogPosting" tags={seo.keywords || post.tags || []}>
        <dt>Published date</dt>
        <dd>{post.date}</dd>
        <dt>Reading time</dt>
        <dd>{postReadingTime} minutes</dd>
        <dt>Article summary for crawlers</dt>
        <dd>{seo.excerpt}</dd>
      </HiddenCrawlerMetadata>
      <main>
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <Link to="/blog" className="nav-link text-sm font-medium">
            Back to blog
          </Link>
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updatedAt && post.updatedAt !== post.date ? (
                <span>Updated {formatDate(post.updatedAt)}</span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-black sm:text-5xl">{post.title}</h1>
            {formatArticleMetaLine(articleMeta) ? (
              <p className="mt-3 text-sm font-medium text-black/50">{formatArticleMetaLine(articleMeta)}</p>
            ) : null}
            {post.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-medium text-black/50">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {articleMeta.summary ? (
              <p className="mt-5 text-base leading-relaxed text-black/60">{articleMeta.summary}</p>
            ) : null}
          </div>
        </article>

        {post.cover ? (
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="surface-frame overflow-hidden rounded-[20px]">
              <img src={post.cover} alt="" className="max-h-[480px] w-full object-cover" />
            </div>
          </div>
        ) : null}

        <article className="blog-markdown mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownBody}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
