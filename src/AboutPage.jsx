'use client'

import { Link } from 'react-router-dom'
import { COLOUR_LOGO, WHITE_LOGO } from './assets.js'
import { HiddenCrawlerMetadata, absoluteUrl, organizationSchema, useSeo, websiteSchema } from './seo.js'

const CALENDLY_BOOK_URL = 'https://calendly.com/riya-aggarwal29/30min'
const ABOUT_TITLE = 'About Solvomo — Marketing decision intelligence'
const ABOUT_DESCRIPTION =
  'Solvomo simulates ad performance across platforms so marketers know what will work, what will not, and how much they will make before spending a dollar.'
const ABOUT_TOPICS = [
  'about Solvomo',
  'pre-spend simulation',
  'cross-platform ad performance',
  'creative scoring',
  'marketing decision intelligence',
]

export default function AboutPage() {
  useSeo({
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    path: '/about',
    image: COLOUR_LOGO,
    tags: ABOUT_TOPICS,
    jsonLd: [
      organizationSchema(),
      websiteSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: ABOUT_TITLE,
        description: ABOUT_DESCRIPTION,
        url: absoluteUrl('/about'),
        isPartOf: websiteSchema(),
        about: ABOUT_TOPICS.map((name) => ({ '@type': 'Thing', name })),
      },
    ],
  })

  return (
    <div className="page-haze flex min-h-svh flex-col bg-white text-black antialiased">
      <header className="border-b border-black/10 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-4xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="logo-mark h-8 w-10 shrink-0">
              <img src={WHITE_LOGO} alt="Solvomo logo" className="h-full w-full" />
            </div>
            <span className="brand-wordmark text-[1.05rem]">Solvomo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="nav-link hidden text-sm font-medium sm:inline">
              Back to home
            </Link>
            <a
              href={CALENDLY_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary inline-flex items-center justify-center rounded-[14px] px-4 py-2.5 text-sm font-semibold transition-all duration-200"
            >
              Book a meeting with us
            </a>
          </div>
        </div>
      </header>

      <HiddenCrawlerMetadata
        title={ABOUT_TITLE}
        description={ABOUT_DESCRIPTION}
        canonical={absoluteUrl('/about')}
        tags={ABOUT_TOPICS}
      >
        <dt>Page purpose</dt>
        <dd>Explain what Solvomo is, why marketers waste budget today, and how pre-spend simulation creates certainty before launch.</dd>
      </HiddenCrawlerMetadata>

      <main className="flex flex-1 flex-col">
        <section className="hero-backdrop flex flex-col border-b border-black/10">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto w-full max-w-2xl">
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="eyebrow mx-auto rounded-full" style={{ display: 'inline-flex' }}>
                  <span className="eyebrow-dot" />
                  WHO WE ARE
                </span>
              </div>
              <h1 className="text-[clamp(2.8rem,6vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
                Solvomo is built for marketers who want visibility, certainty, and clarity.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-black/60 sm:text-xl">
                Simulate your ad campaigns using our platform mix before you spend. Know what&apos;s working, what&apos;s not, and how much
                you&apos;ll make across every platform.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto w-full max-w-2xl">
              <h2 className="sv-section-heading">The starting point</h2>
              <div className="surface-frame mt-6 rounded-[var(--sv-radius-card)] border border-black/10 p-6">
                <p className="text-base leading-relaxed text-black/70">
                  In 2024, marketers spent <strong className="text-black/80">$790 billion</strong> on digital ads. Yet{' '}
                  <strong className="text-black/80">87% experienced performance issues</strong>, and{' '}
                  <strong className="text-black/80">45% pulled campaigns mid-flight</strong> after money was already spent. The result:{' '}
                  <strong className="text-black/80">$160 billion in annual waste</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-black/[0.02]">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto w-full max-w-2xl">
              <h2 className="sv-section-heading">Why this happens</h2>

              <div className="mt-10">
                <h3 className="sv-card-title">1. Platform fragmentation</h3>
                <p className="sv-body-copy mt-3">
                  Meta reports ROI one way. Google reports it differently. LinkedIn has yet another metric. Teams can&apos;t compare across
                  platforms or trust any single number.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="sv-card-title">2. Invisible creative impact</h3>
                <p className="sv-body-copy mt-3">
                  Creative drives <strong className="text-black/80">49-70% of ad ROI</strong>. Yet{' '}
                  <strong className="text-black/80">33.2% of marketers</strong> have no way to measure creative quality before launch.
                  They&apos;re flying blind.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="sv-card-title">3. No pre-spend prediction</h3>
                <p className="sv-body-copy mt-3">
                  Every tool measures ROI after campaigns run. None simulate performance before you launch. So CFOs reject budget requests,
                  and campaigns launch hoping for the best.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto w-full max-w-2xl">
              <h2 className="sv-section-heading">Our approach</h2>
              <p className="sv-body-copy mt-6">
                Solvomo simulates your ad performance across platforms. Input your budget, audience, creative, and platform mix. We combine
                platform benchmarks, audience quality analysis, and creative scoring to predict what will actually happen before you commit
                a dollar.
              </p>

              <div className="surface-brand mt-10 rounded-[var(--sv-radius-card)] border border-transparent bg-gradient-to-br from-[rgba(242,213,138,0.08)] to-[rgba(216,143,141,0.08)] p-8">
                <h3 className="sv-card-title">How it works in practice</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-lg leading-none text-black/60">Monitor</span>
                    <span className="text-base text-black/70">Track live performance as campaigns run across platform</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-lg leading-none text-black/60">Simulate</span>
                    <span className="text-base text-black/70">Run pre-launch predictions using our platform mix before you spend</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-lg leading-none text-black/60">Evolve</span>
                    <span className="text-base text-black/70">Compare variations and optimize by ROI impact</span>
                  </div>
                </div>
              </div>

              <p className="sv-body-copy mt-8">
                The result: marketers move from guessing to knowing. From hoping campaigns work to predicting they will. From mid-flight
                panic to confident optimization.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-black/[0.02]">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto w-full max-w-2xl">
              <h2 className="sv-section-heading">Why Solvomo</h2>
              <div className="mt-8 space-y-4">
                <div className="border-l-3 border-blue-500/40 pl-6">
                  <p className="sv-body-copy mt-0">
                    <strong className="text-black/80">Simulate before you launch.</strong> No historical data required. Works on day one
                    with real platform benchmarks.
                  </p>
                </div>
                <div className="border-l-3 border-blue-500/40 pl-6">
                  <p className="sv-body-copy mt-0">
                    <strong className="text-black/80">See what&apos;s actually working.</strong> Cross-platform predictions (Meta, Google,
                    TikTok, LinkedIn) in one number.
                  </p>
                </div>
                <div className="border-l-3 border-blue-500/40 pl-6">
                  <p className="sv-body-copy mt-0">
                    <strong className="text-black/80">Honest about uncertainty.</strong> We tell you the confidence level, not just the
                    prediction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-black text-white">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto w-full max-w-2xl text-center">
              <h2 className="bg-gradient-to-r from-[#5FC7D4] to-[#5B7BE1] bg-clip-text pb-1 text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-[1.15] tracking-[-0.05em] text-transparent">
                Stop guessing. Start simulating.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/60">Know your ROI before you spend.</p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={CALENDLY_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary relative isolate inline-flex min-w-[13rem] items-center justify-center rounded-[14px] px-8 py-4 text-base font-semibold transition-all duration-200"
                >
                  <span className="relative z-10 text-white">Get Early Access</span>
                </a>
                <a
                  href={CALENDLY_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-button-secondary relative isolate inline-flex min-w-[13rem] items-center justify-center rounded-[14px] border px-8 py-4 text-base font-semibold text-white transition-all duration-200"
                >
                  <span className="relative z-10">Book a Demo</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
