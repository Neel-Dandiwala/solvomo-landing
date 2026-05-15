import ReactMarkdown from 'react-markdown'
import { Link, Navigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import blogs from './content/blogs.generated.json'

function Header() {
  return (
    <header className="border-b border-black/10 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="logo-mark h-8 w-10 shrink-0">
            <img src="/white_logo.jpeg" alt="Solvomo logo" className="h-full w-full" />
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

function getPosts() {
  return [...blogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function BlogIndex() {
  const posts = getPosts()

  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <Header />
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
            {posts.map((post) => (
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
                  {post.description ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/58">{post.description}</p> : null}
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

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <Header />
      <main>
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <Link to="/blog" className="nav-link text-sm font-medium">
            Back to blog
          </Link>
          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">{formatDate(post.date)}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-black sm:text-5xl">{post.title}</h1>
            {post.description ? <p className="mt-5 text-base leading-relaxed text-black/60">{post.description}</p> : null}
            {post.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-medium text-black/50">
                    {tag}
                  </span>
                ))}
              </div>
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.markdown}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
