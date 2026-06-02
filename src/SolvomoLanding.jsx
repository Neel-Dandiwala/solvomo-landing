'use client'

import { useEffect } from 'react'
import { COLOUR_LOGO, WHITE_LOGO } from './assets.js'
import Navbar from './Navbar.jsx'
import { HiddenCrawlerMetadata, absoluteUrl, organizationSchema, useSeo, websiteSchema } from './seo.js'

const CALENDLY_BOOK_URL = 'https://calendly.com/riya-aggarwal29/30min'
const HOME_TITLE = 'Solvomo - Marketing decision intelligence'
const HOME_DESCRIPTION =
  'Solvomo is decision intelligence software for growth teams managing cross-channel performance, creative signal, and budget allocation in one operating layer.'
const HOME_TOPICS = [
  'marketing decision intelligence',
  'growth operations',
  'performance marketing analytics',
  'creative intelligence',
  'signal quality',
  'budget allocation',
]

const primaryButtonClass =
  'button-primary inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold transition-all duration-200'

const chartTones = ['preview-chart-brand', 'preview-chart-product', 'preview-chart-interaction', 'preview-chart-depth']

function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 12m9.429 0 4.179-2.25M12 21l9-4.875V6.375L12 1.5l-9 4.875v9.75L12 21Z" />
    </svg>
  )
}

function IconTarget(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  )
}

function IconSignal(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5 8.5 8 12 11.5l3.5-3.5L21 13.5M3 17.25h18" />
    </svg>
  )
}

function IconWallet(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H4.5V6.75A2.25 2.25 0 0 1 6.75 4.5h12A2.25 2.25 0 0 1 21 6.75V12Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12v6.75a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18.75V12" />
      <path strokeLinecap="round" d="M16.5 14.25h.008v.008H16.5V14.25Z" />
    </svg>
  )
}

function LogoMark({ src, alt, className = '', imageClassName = '' }) {
  return (
    <div className={className}>
      <img src={src} alt={alt} className={imageClassName} />
    </div>
  )
}

export default function SolvomoLanding() {
  useSeo({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: '/',
    image: COLOUR_LOGO,
    tags: HOME_TOPICS,
    jsonLd: [
      organizationSchema(),
      websiteSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
        url: absoluteUrl('/'),
        isPartOf: websiteSchema(),
        about: HOME_TOPICS.map((name) => ({ '@type': 'Thing', name })),
        mainEntity: {
          '@type': 'SoftwareApplication',
          name: 'Solvomo',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: HOME_DESCRIPTION,
          url: absoluteUrl('/'),
        },
      },
    ],
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = window.location.hash.replace('#', '')
    if (!id) return
    const target = document.getElementById(id)
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }))
    }
  }, [])

  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <Navbar />

      <HiddenCrawlerMetadata title={HOME_TITLE} description={HOME_DESCRIPTION} canonical={absoluteUrl('/')} tags={HOME_TOPICS}>
        <dt>Primary use cases</dt>
        <dd>Cross-channel growth review, creative performance intelligence, signal governance, marketing budget decisions, executive reporting.</dd>
      </HiddenCrawlerMetadata>

      <main>
        <section className="hero-backdrop border-b border-black/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
              <div className="max-w-2xl">
                <div className="eyebrow rounded-full">
                  <span className="eyebrow-dot" />
                  Decision intelligence for growth operators
                </div>

                <h1 className="mt-8 max-w-[18ch] text-[clamp(2.6rem,5.5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-black">
                  Solvomo is built for marketers who want
                  <span className="headline-brand block">visibility, certainty, and clarity.</span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/62">
                  Simulate your ad campaigns using our platform mix before you spend. Know what&apos;s working, what&apos;s not, and how much
                  you&apos;ll make across every platform.
                </p>

                <div className="mt-8">
                  <a href={CALENDLY_BOOK_URL} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
                    Book a meeting with us
                  </a>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-3">
                  {[
                    ['Cross-channel view', 'One operating layer across spend, creative, and signal quality.'],
                    ['Operator workflow', 'Structured around planning, review, and reallocation.'],
                    ['Decision output', 'Built to tell teams what changed and what to do next.'],
                  ].map(([title, body]) => (
                    <div key={title}>
                      <p className="text-sm font-semibold text-black">{title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-black/58">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-frame hero-surface overflow-hidden rounded-[20px]">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <LogoMark
                      src={WHITE_LOGO}
                      alt="Solvomo logo"
                      className="logo-mark h-7 w-9 shrink-0"
                      imageClassName="h-full w-full"
                    />
                    <div>
                      <p className="text-sm font-semibold text-black">Solvomo platform</p>
                      <p className="text-xs text-black/48">Decision workspace</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-medium text-black/52">QBR ready</span>
                    <span className="rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-medium text-black/52">Series B stack</span>
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[180px_minmax(0,1fr)]">
                  <aside className="border-b border-black/10 px-5 py-5 lg:border-b-0 lg:border-r lg:border-black/10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Views</p>
                    <div className="mt-4 space-y-2">
                      {['Executive summary', 'Channel review', 'Creative intelligence', 'Signal quality', 'Budget actions'].map((item, idx) => (
                        <div
                          key={item}
                          className={`rounded-[12px] px-3 py-2 text-sm font-medium ${
                            idx === 0 ? 'surface-depth text-black' : 'border border-transparent text-black/56'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="section-divider-brand mt-6" />

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Brand asset</p>
                      <div className="surface-soft mt-3 overflow-hidden rounded-[14px] p-2">
                        <LogoMark
                          src={COLOUR_LOGO}
                          alt="Solvomo brand graphic"
                          className="logo-mark-color h-24 w-full"
                          imageClassName="h-full w-full"
                        />
                      </div>
                    </div>
                  </aside>

                  <div className="px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ['Spend efficiency', 'Within target', 'Blended CAC and payback monitoring'],
                        ['Signal quality', 'Recovering', 'Improved event coverage across core funnels'],
                        ['Priority move', 'Reallocate', 'Shift spend toward verified creative cohorts'],
                      ].map(([label, value, detail]) => (
                        <div key={label} className="surface-soft rounded-[14px] p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">{label}</p>
                          <p className="mt-3 text-xl font-semibold tracking-tight text-black">{value}</p>
                          <p className="mt-2 text-sm leading-relaxed text-black/56">{detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
                      <div className="surface-product rounded-[16px] p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Channel allocation</p>
                            <p className="mt-1 text-sm font-medium text-black/58">Weekly contribution by operating lane</p>
                          </div>
                          <span className="text-[11px] font-medium text-black/46">Last 12 weeks</span>
                        </div>
                        <div className="mt-6 flex h-44 items-end gap-2">
                          {[42, 60, 36, 74, 50, 68, 48, 84, 56, 66, 72, 80].map((h, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t-sm ${chartTones[i % chartTones.length]}`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between text-[11px] font-medium text-black/42">
                          <span>Week 1</span>
                          <span>Week 12</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="surface-depth rounded-[16px] p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Recommendation</p>
                          <p className="mt-3 text-base font-semibold leading-snug text-black">
                            Consolidate budget into the two creative clusters with verified assisted-path contribution.
                          </p>
                          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/58">
                            <li>Prioritize high-signal conversion cohorts over raw platform ROAS.</li>
                            <li>Reduce low-confidence spend before the next creative refresh.</li>
                          </ul>
                        </div>

                        <div className="surface-brand rounded-[16px] p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Operator note</p>
                          <p className="mt-3 text-sm leading-relaxed text-black/58">
                            Built for growth leaders who need one place to review efficiency, creative momentum, and signal integrity before moving budget.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-black/10 bg-white">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
            <div className="mx-auto w-full max-w-2xl">
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="eyebrow rounded-full" style={{ display: 'inline-flex' }}>
                  <span className="eyebrow-dot" />
                  WHO WE ARE
                </span>
              </div>
              <h2 className="text-[clamp(2.4rem,5vw,3rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                Why Solvomo exists
              </h2>
            </div>
          </div>

          <div>
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="mx-auto w-full max-w-2xl">
                <h3 className="sv-section-heading">The starting point</h3>
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
          </div>

          <div className="border-t border-black/10 bg-black/[0.02]">
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="mx-auto w-full max-w-2xl">
                <h3 className="sv-section-heading">Why this happens</h3>

                <div className="mt-10">
                  <h4 className="sv-card-title">1. Platform fragmentation</h4>
                  <p className="sv-body-copy mt-3">
                    Meta reports ROI one way. Google reports it differently. LinkedIn has yet another metric. Teams can&apos;t compare across
                    platforms or trust any single number.
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="sv-card-title">2. Invisible creative impact</h4>
                  <p className="sv-body-copy mt-3">
                    Creative drives <strong className="text-black/80">49-70% of ad ROI</strong>. Yet{' '}
                    <strong className="text-black/80">33.2% of marketers</strong> have no way to measure creative quality before launch.
                    They&apos;re flying blind.
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="sv-card-title">3. No pre-spend prediction</h4>
                  <p className="sv-body-copy mt-3">
                    Every tool measures ROI after campaigns run. None simulate performance before you launch. So CFOs reject budget requests,
                    and campaigns launch hoping for the best.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10">
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="mx-auto w-full max-w-2xl">
                <h3 className="sv-section-heading">Our approach</h3>
                <p className="sv-body-copy mt-6">
                  Solvomo simulates your ad performance across platforms. Input your budget, audience, creative, and platform mix. We combine
                  platform benchmarks, audience quality analysis, and creative scoring to predict what will actually happen before you commit
                  a dollar.
                </p>

                <div className="surface-brand mt-10 rounded-[var(--sv-radius-card)] border border-transparent bg-gradient-to-br from-[rgba(242,213,138,0.08)] to-[rgba(216,143,141,0.08)] p-8">
                  <h4 className="sv-card-title">How it works in practice</h4>
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
          </div>

          <div className="border-t border-black/10 bg-black/[0.02]">
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="mx-auto w-full max-w-2xl">
                <h3 className="sv-section-heading">Why Solvomo</h3>
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
          </div>
        </section>

        <section id="platform" className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Platform</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-black sm:text-5xl">
                  A product built for
                  <span className="headline-product block">serious growth teams.</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-black/60">
                  Solvomo turns fragmented marketing infrastructure into a structured operating system for decision-making, not another reporting surface.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    Icon: IconLayers,
                    title: 'Unified operating view',
                    body: 'Bring channel, creative, and conversion signals into one review layer with consistent definitions.',
                    surface: 'surface-product',
                  },
                  {
                    Icon: IconWallet,
                    title: 'Budget discipline',
                    body: 'Rank budget moves by confidence, contribution, and downside before spend shifts.',
                    surface: 'surface-depth',
                  },
                  {
                    Icon: IconTarget,
                    title: 'Creative intelligence',
                    body: 'Track performance by hook, format, and message pattern instead of isolated ad IDs.',
                    surface: 'surface-soft',
                  },
                  {
                    Icon: IconSignal,
                    title: 'Signal governance',
                    body: 'Monitor event quality, funnel depth, and platform feedback so optimization stays trustworthy.',
                    surface: 'surface-soft',
                  },
                ].map(({ Icon, title, body, surface }) => (
                  <article key={title} className={`${surface} rounded-[16px] p-5`}>
                    <div className="icon-accent flex h-10 w-10 items-center justify-center rounded-[12px] text-black/80">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-black">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/58">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="operating-model" className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Operating model</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-black sm:text-5xl">
                  Review the business,
                  <span className="headline-product block">not just the dashboard.</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-black/60">
                  The product is designed around how operators actually work: align on the signal, review the system, and commit to the next move.
                </p>

                <div className="section-divider mt-8" />

                <div className="mt-8 space-y-5">
                  {[
                    ['01', 'Normalize the operating layer', 'Connect the systems that matter and establish one trusted view of channel, creative, and conversion performance.'],
                    ['02', 'Review what changed', 'Expose contribution shifts, weak signal coverage, and creative movement in a format leadership teams can act on.'],
                    ['03', 'Commit the next move', 'Translate insight into budget direction, signal fixes, and creative decisions with clear accountability.'],
                  ].map(([num, title, body]) => (
                    <div key={num} className="grid grid-cols-[56px_minmax(0,1fr)] gap-4">
                      <div className="surface-depth flex h-12 w-12 items-center justify-center rounded-[12px] text-sm font-semibold text-black">{num}</div>
                      <div>
                        <p className="text-base font-semibold text-black">{title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-black/58">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-frame overflow-hidden rounded-[18px]">
                <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="border-b border-black/10 px-5 py-5 md:border-b-0 md:border-r md:border-black/10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Decision stack</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ['Board summary', 'Weekly operating narrative'],
                        ['Channel review', 'Efficiency and overlap'],
                        ['Creative review', 'Message and format evidence'],
                        ['Signal review', 'Coverage, fidelity, and depth'],
                      ].map(([title, body], idx) => (
                        <div key={title} className={`${idx === 0 ? 'surface-product' : 'surface-soft'} rounded-[14px] p-4`}>
                          <p className="text-sm font-semibold text-black">{title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-black/56">{body}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="surface-soft rounded-[16px] p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Executive brief</p>
                        <p className="mt-3 text-lg font-semibold leading-snug text-black">
                          Paid efficiency improved after moving budget into high-confidence creative cohorts.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-black/58">
                          Signal quality recovered on priority campaigns, which increased platform confidence and improved blended acquisition efficiency.
                        </p>
                      </div>

                      <div className="surface-depth rounded-[16px] p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">Next operator action</p>
                        <p className="mt-3 text-sm leading-relaxed text-black/58">
                          Keep budget concentrated in proven cohorts, close remaining signal gaps, and gate new creative tests behind verified performance baselines.
                        </p>
                      </div>
                    </div>

                    <div className="kpi-rule mt-6" />

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {[
                        ['Channel confidence', 'High', 'Cross-platform trend alignment'],
                        ['Creative signal', 'Stable', 'Winning hooks remain durable'],
                        ['Signal coverage', 'Improving', 'Higher event fidelity in core funnel'],
                      ].map(([title, value, body]) => (
                        <div key={title} className="surface-soft rounded-[14px] p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">{title}</p>
                          <p className="mt-3 text-lg font-semibold text-black">{value}</p>
                          <p className="mt-2 text-sm leading-relaxed text-black/56">{body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-black/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="surface-frame overflow-hidden rounded-[20px]">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="border-b border-black/10 px-6 py-10 lg:border-b-0 lg:border-r lg:border-black/10 lg:px-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Contact</p>
                  <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-black sm:text-5xl">
                    Built for teams scaling paid growth with discipline.
                  </h2>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-black/60">
                    Solvomo is for operators who need stronger signal integrity, clearer budget decisions, and a more executive-ready view of marketing performance.
                  </p>
                  <div className="mt-8">
                    <a href={CALENDLY_BOOK_URL} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
                      Book a meeting with us
                    </a>
                  </div>
                </div>

                <div className="px-6 py-10 lg:px-8">
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ['Who it is for', 'Growth leaders, performance teams, and operators managing serious spend across multiple channels.'],
                        ['What it replaces', 'Disconnected reporting, shallow attribution views, and reactive budget reviews.'],
                        ['What teams get', 'A structured operating layer for signal review, creative evaluation, and budget allocation.'],
                        ['How to start', 'Begin with one workspace and one operating cadence, then expand into broader decision coverage.'],
                      ].map(([title, body]) => (
                        <div key={title} className="surface-soft rounded-[16px] p-5">
                          <p className="text-sm font-semibold text-black">{title}</p>
                          <p className="mt-3 text-sm leading-relaxed text-black/58">{body}</p>
                        </div>
                      ))}
                    </div>

                    <div className="surface-brand rounded-[18px] p-5 sm:p-6">
                      <div className="max-w-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Newsletter</p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-black">Get product notes and operating insights.</h3>
                        <p className="mt-3 text-sm leading-relaxed text-black/58">
                          Subscribe for concise updates on performance systems, signal quality, and how serious growth teams make better decisions.
                        </p>
                      </div>

                      <div className="surface-soft mt-6 overflow-hidden rounded-[16px] border border-black/10 bg-white">
                        <iframe
                          src="https://subscribe-forms.beehiiv.com/15e9e565-128a-48c1-9866-f96a47808e2a"
                          className="beehiiv-embed block w-full max-w-full border-0 bg-transparent"
                          data-test-id="beehiiv-embed"
                          title="Subscribe to Solvomo updates"
                          style={{
                            width: '100%',
                            height: '315px',
                            margin: 0,
                            boxShadow: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <a href="#" className="flex items-center gap-3">
                <LogoMark
                  src={WHITE_LOGO}
                  alt="Solvomo logo"
                  className="logo-mark h-8 w-10 shrink-0"
                  imageClassName="h-full w-full"
                />
                <span className="brand-wordmark text-[1.05rem]">Solvomo</span>
              </a>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/58">
                Decision intelligence software for growth teams operating with real budget, real signal complexity, and real accountability.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Products</p>
                <div className="mt-4 space-y-2.5">
                  <a href="#platform" className="footer-link block">
                    Platform
                  </a>
                  <a href="#operating-model" className="footer-link block">
                    Operating model
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Pricing</p>
                <div className="mt-4 space-y-2.5">
                  <a href="/pricing" className="footer-link block">
                    Pricing
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Resources</p>
                <div className="mt-4 space-y-2.5">
                  <a href="/blog" className="footer-link block">
                    Blog
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Solvomo</p>
                <div className="mt-4 space-y-2.5">
                  <a href="/#about" className="footer-link block">
                    About Us
                  </a>
                  <a href="/#contact" className="footer-link block">
                    Contact Us
                  </a>
                  <a href={CALENDLY_BOOK_URL} target="_blank" rel="noopener noreferrer" className="footer-link block">
                    Book a meeting with us
                  </a>
                  <a
                    href="https://www.linkedin.com/company/solvomo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link block"
                  >
                    LinkedIn
                  </a>
                  <a href="/privacy.html" className="footer-link block">
                    Privacy
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider mt-10" />
          <p className="mt-6 text-xs font-medium text-black/42">© {new Date().getFullYear()} Solvomo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
