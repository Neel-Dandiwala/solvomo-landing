'use client'

import { useEffect, useState } from 'react'

const CALENDLY_BOOK_URL = 'https://calendly.com/riya-aggarwal29/30min'

const nav = [
  { label: 'Product', href: '#pillars' },
  { label: 'Solutions', href: '#problem' },
  { label: 'Why Solvomo', href: '#customers' },
  { label: 'Resources', href: '#resources' },
  { label: 'Pricing', href: '#pricing' },
]

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

export default function SolvomoLanding() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-svh bg-luna-bg text-luna-text antialiased">
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
          scrolled
            ? 'border-luna-border bg-luna-bg/85 backdrop-blur-md shadow-sm shadow-black/20'
            : 'border-transparent bg-luna-bg/70 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#" className="group flex shrink-0 items-baseline gap-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-luna-bg">
            <span className="solvomo-wordmark-sm text-lg font-black tracking-[-0.06em] sm:text-xl">Solvomo</span>
            <span className="text-luna-text-muted text-lg font-semibold tracking-tight transition-colors group-hover:text-luna-text-secondary sm:text-xl">.</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-luna-text-secondary md:flex" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-luna-text">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <a
              href={CALENDLY_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-glow inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-accent-teal/75 to-accent-cyan/65 px-4 py-2 text-sm font-semibold text-luna-bg transition-all duration-200 hover:from-accent-teal hover:to-accent-cyan"
            >
              Get in touch
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative border-b border-luna-border/50">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,420px)] opacity-[0.22]"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(94, 214, 227, 0.09) 0%, transparent 55%)',
            }}
          />

          <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:gap-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-luna-text-muted">
                Decision intelligence for modern growth teams
              </p>
              <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-accent-teal/90">
                We analyze your marketing and tell you what to do next.
              </p>

              <h1 className="mt-8">
                <span className="solvomo-wordmark block text-[clamp(3.5rem,12vw,7.5rem)] font-black leading-[0.9] tracking-[-0.055em]">
                  Solvomo.
                </span>
                <span className="mt-5 block max-w-xl text-balance text-2xl font-semibold leading-snug tracking-tight text-luna-text sm:text-3xl lg:mt-6 lg:text-[2rem]">
                  See what&apos;s actually driving growth.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-luna-text-secondary">
                Solvomo helps growth teams understand cross-channel performance, identify winning creative patterns, improve signal quality, and reallocate budget with confidence.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={CALENDLY_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-teal/72 to-accent-cyan/60 px-6 py-3 text-sm font-semibold text-luna-bg transition-all duration-200 hover:from-accent-teal hover:to-accent-cyan"
                >
                  Get in touch
                </a>
                <a
                  href={CALENDLY_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-luna-border bg-luna-surface/35 px-6 py-3 text-sm font-semibold text-luna-text transition-colors duration-200 hover:border-luna-text-muted/40 hover:bg-luna-surface/60"
                >
                  Book a call
                </a>
              </div>

              <p className="mt-10 max-w-md text-xs font-medium leading-relaxed text-luna-text-muted">
                Built for teams who run paid media, creative tests, and pipeline programs—and need one place to see how they connect.
              </p>
            </div>

            {/* Hero product preview */}
            <div
              className="relative rounded-2xl border border-luna-border bg-luna-bg-secondary/80 p-1 shadow-[0_28px_90px_-32px_rgba(0,0,0,0.75)]"
              aria-label="Product preview"
            >
              <div className="rounded-[0.9rem] border border-luna-border/90 bg-luna-surface p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-luna-border/70 pb-3">
                  <span className="text-xs font-semibold text-luna-text">Workspace overview</span>
                  <span className="rounded-md border border-luna-border bg-luna-bg px-2 py-1 font-mono text-[10px] font-medium text-luna-text-muted">
                    app.solvomo.io / growth
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-luna-border bg-luna-bg/90 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-luna-text-muted">Channel intelligence</p>
                    <p className="mt-2 text-sm font-semibold text-luna-text">Cross-channel view</p>
                    <p className="mt-1 text-xs text-luna-text-secondary">How touchpoints combine on the path to conversion</p>
                  </div>
                  <div className="rounded-xl border border-luna-border bg-luna-bg/90 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-luna-text-muted">Creative intelligence</p>
                    <p className="mt-2 text-sm font-semibold text-luna-text">By hook and format</p>
                    <p className="mt-1 text-xs text-luna-text-secondary">See what to scale or retire</p>
                  </div>
                  <div className="rounded-xl border border-luna-border bg-luna-bg/90 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-luna-text-muted">Signal health</p>
                    <p className="mt-2 text-sm font-semibold text-luna-text">Coverage &amp; depth</p>
                    <p className="mt-1 text-xs text-luna-text-secondary">What platforms receive for optimization</p>
                  </div>
                  <div className="rounded-xl border border-accent-teal/20 bg-luna-bg/90 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-luna-text-muted">Next actions</p>
                    <p className="mt-2 text-sm font-medium leading-snug text-luna-text">
                      Budget and creative moves ranked by impact—so you change spend and inputs with context.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product positioning */}
        <section className="border-b border-luna-border/50 bg-luna-bg-secondary/35 py-11 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-relaxed text-luna-text-secondary">
              Solvomo is a marketing decision engine: it helps you understand performance across creatives, channels, and signals—and
              surfaces what to do next. No vanity metrics—just a clearer operating layer for growth teams.
            </p>
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">Marketing data is everywhere. Decision clarity is not.</h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-luna-text-secondary">
                Stop guessing which channels, creatives, and signals drive growth. Solvomo turns fragmented marketing performance into clear decisions.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  t: 'Fragmented channel truth',
                  d: 'Meta, Google, TikTok, LinkedIn, and CRM systems all tell different stories.',
                },
                {
                  t: 'Creative guesswork',
                  d: 'Teams know what ran, but not always why it won.',
                },
                {
                  t: 'Weak signal quality',
                  d: 'Platforms optimize to the signals they receive—even when those signals are too shallow.',
                },
                {
                  t: 'Reactive budget allocation',
                  d: 'Most teams adjust spend after the damage is done.',
                },
              ].map((c) => (
                <article
                  key={c.t}
                  className="rounded-2xl border border-luna-border bg-luna-surface/45 p-5 shadow-sm shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 hover:border-luna-text-muted/20 hover:shadow-md hover:shadow-black/25"
                >
                  <h3 className="text-sm font-semibold tracking-tight text-luna-text">{c.t}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-luna-text-secondary">{c.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section id="pillars" className="scroll-mt-24 border-t border-luna-border/50 bg-luna-bg-secondary/25 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">
              A clearer operating layer for performance marketing
            </h2>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {[
                {
                  Icon: IconLayers,
                  t: 'Cross-platform intelligence',
                  d: 'Understand how channels work together across awareness, intent, and conversion.',
                },
                {
                  Icon: IconWallet,
                  t: 'Budget allocation',
                  d: 'See where spend is underperforming and where it should move next.',
                },
                {
                  Icon: IconTarget,
                  t: 'Creative intelligence',
                  d: 'Identify the hooks, formats, and messages that actually drive outcomes.',
                },
                {
                  Icon: IconSignal,
                  t: 'Signal engineering',
                  d: 'Improve the events and feedback loops platforms use for optimization.',
                },
              ].map(({ Icon, t, d }) => (
                <article
                  key={t}
                  className="group rounded-2xl border border-luna-border bg-luna-surface/40 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-teal/20 hover:shadow-lg hover:shadow-black/20 sm:p-7"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-luna-border bg-luna-bg-secondary text-luna-text-secondary transition-colors group-hover:border-accent-teal/25 group-hover:text-accent-teal/90">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-luna-text">{t}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-luna-text-secondary">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Large product preview */}
        <section id="product-preview" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">Built to turn performance data into decisions</h2>
                <p className="mt-3 text-base font-medium text-luna-text-secondary">
                  One operating view for channel mix, creative performance, signal posture, and the next best budget move.
                </p>
              </div>
              <a
                href={CALENDLY_BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent-teal transition-colors hover:text-accent-cyan"
              >
                Book a call →
              </a>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-luna-border bg-luna-surface shadow-[0_32px_100px_-40px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-luna-border bg-luna-bg-secondary/55 px-4 py-3 sm:px-5">
                <span className="text-xs font-semibold text-luna-text">Performance command</span>
                <span className="rounded-md border border-luna-border bg-luna-bg px-2 py-1 font-mono text-[10px] text-luna-text-muted">
                  Illustrative UI
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
                <div className="border-b border-luna-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: 'Pipeline influenced', v: '—', d: 'Tied to your sources' },
                      { l: 'Blended CAC', v: '—', d: 'Across channels' },
                      { l: 'Creative tests', v: '—', d: 'In one ledger' },
                    ].map((k) => (
                      <div key={k.l} className="rounded-xl border border-luna-border/80 bg-luna-bg/80 p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-luna-text-muted">{k.l}</p>
                        <p className="mt-1.5 font-mono text-base font-semibold tabular-nums text-luna-text">{k.v}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-luna-text-secondary">{k.d}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-luna-text-muted">Channel mix</p>
                  <div className="mt-3 flex h-36 items-end gap-1.5">
                    {[44, 62, 36, 78, 52, 70, 48, 88, 58, 66, 74, 82].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-luna-border/70 transition-colors hover:bg-accent-teal/30"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[10px] text-luna-text-muted">
                    <span>Week 1</span>
                    <span>Week 12</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4 sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-luna-text-muted">Creative leaderboard</p>
                    <ul className="mt-3 space-y-2 text-xs">
                      {[
                        ['UGC · testimonial hook', 'Review', 'Creative'],
                        ['Product demo · square', 'Review', 'Creative'],
                        ['Founder story · long', 'Review', 'Creative'],
                      ].map(([a, b, c]) => (
                        <li key={a} className="flex items-center justify-between gap-2 rounded-lg border border-luna-border/60 bg-luna-bg/60 px-2.5 py-2">
                          <span className="font-medium text-luna-text-secondary">{a}</span>
                          <span className="shrink-0 font-mono text-luna-text-muted">{b}</span>
                          <span className="hidden shrink-0 text-luna-text-muted sm:inline">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-luna-border bg-luna-bg/70 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-luna-text-muted">Signal health</p>
                    <p className="mt-2 text-sm font-medium text-luna-text-secondary">
                      Check event coverage and conversion depth so platforms optimize on signals that match your funnel.
                    </p>
                  </div>
                  <div className="rounded-xl border border-accent-teal/25 bg-luna-bg-secondary/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal/90">Recommendation</p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-luna-text">
                      Compare creative approaches by hook and format, then decide where to scale spend before widening prospecting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="scroll-mt-24 border-t border-luna-border/50 bg-luna-bg-secondary/20 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">How Solvomo works</h2>
            <ol className="mt-12 grid gap-4 lg:grid-cols-4">
              {[
                {
                  n: '01',
                  t: 'Connect your channels',
                  d: 'Bring in paid media, analytics, CRM, and conversion sources.',
                },
                {
                  n: '02',
                  t: 'Unify the signal layer',
                  d: 'Normalize campaign, creative, and outcome data into one operating view.',
                },
                {
                  n: '03',
                  t: 'Surface what matters',
                  d: 'Reveal channel interactions, creative patterns, and signal gaps.',
                },
                {
                  n: '04',
                  t: 'Act with confidence',
                  d: 'Reallocate budget, improve creative direction, and strengthen optimization inputs.',
                },
              ].map((s) => (
                <li key={s.n} className="rounded-2xl border border-luna-border bg-luna-surface/35 p-5 transition-all duration-200 hover:border-luna-text-muted/25">
                  <span className="font-mono text-xs font-semibold tabular-nums text-accent-teal/85">{s.n}</span>
                  <h3 className="mt-3 text-sm font-semibold tracking-tight text-luna-text">{s.t}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-luna-text-secondary">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Feature detail */}
        <section id="resources" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">Not another dashboard</h2>
            <p className="mt-3 max-w-2xl text-base font-medium text-luna-text-secondary">
              Decision outputs you can brief a leadership team on—grounded in cross-channel evidence, not vanity charts.
            </p>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {[
                {
                  t: "What's working across channels",
                  d: 'Assisted paths, overlap, and downstream effects—so you know which channels earn budget beyond last-click stories.',
                  sample: (
                    <div className="mt-4 space-y-2 rounded-xl border border-luna-border bg-luna-bg/80 p-3 text-[11px]">
                      <div className="flex justify-between font-medium text-luna-text-secondary">
                        <span>Path: Search → Social → Purchase</span>
                        <span className="font-mono text-luna-text-muted">—</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-luna-border/60">
                        <div className="h-full w-[72%] rounded-full bg-accent-teal/50" />
                      </div>
                      <p className="text-luna-text-muted">Influenced outcomes across touchpoints (your model)</p>
                    </div>
                  ),
                },
                {
                  t: 'Which creatives to scale',
                  d: 'Performance by hook, format, and message type—so creative teams ship what the data already proved.',
                  sample: (
                    <div className="mt-4 rounded-xl border border-luna-border bg-luna-bg/80 p-3 text-[11px]">
                      <p className="font-semibold text-luna-text">Example grouping</p>
                      <p className="mt-1 font-mono text-sm text-luna-text-secondary">9:16 UGC · problem-first hook</p>
                      <p className="mt-2 text-luna-text-muted">Ranked by outcome and marginal contribution</p>
                    </div>
                  ),
                },
                {
                  t: 'What to fix next',
                  d: 'Signal recommendations and budget actions ranked by impact—so fixes land before platforms lock onto the wrong objective.',
                  sample: (
                    <div className="mt-4 rounded-xl border border-accent-teal/20 bg-luna-bg-secondary/80 p-3 text-[11px]">
                      <p className="font-semibold text-luna-text">Next action</p>
                      <p className="mt-1 text-luna-text-secondary">Send enriched purchase value on Campaign A before next flight.</p>
                    </div>
                  ),
                },
              ].map((block) => (
                <article
                  key={block.t}
                  className="flex flex-col rounded-2xl border border-luna-border bg-luna-surface/40 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-luna-text-muted/20 hover:shadow-lg hover:shadow-black/25 sm:p-7"
                >
                  <h3 className="text-base font-semibold tracking-tight text-luna-text">{block.t}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-luna-text-secondary">{block.d}</p>
                  {block.sample}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* What Solvomo is for */}
        <section id="customers" className="scroll-mt-24 border-t border-luna-border/50 bg-luna-bg-secondary/25 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">What Solvomo is built to do</h2>
            <p className="mt-3 max-w-2xl text-base font-medium text-luna-text-secondary">
              Clear decisions from fragmented performance data—without inventing wins on a slide.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                'Understand cross-platform marketing performance in one operating view.',
                'See how channels interact, not only what each platform reports in isolation.',
                'Improve signal quality going back to ad platforms so optimization matches your funnel.',
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-luna-border bg-luna-surface/40 p-5 text-sm font-medium leading-relaxed text-luna-text-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section id="pricing" className="relative scroll-mt-24 overflow-hidden border-t border-luna-border/50 py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0 section-radial-glow opacity-90" aria-hidden />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[min(100%,520px)] -translate-x-1/2 opacity-[0.18]"
            aria-hidden
            style={{
              background: 'radial-gradient(ellipse at center, rgba(159, 168, 218, 0.2) 0%, transparent 65%)',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl rounded-2xl border border-luna-border bg-luna-surface/50 px-6 py-12 text-center shadow-lg shadow-black/30 sm:px-10 sm:py-14">
              <h2 className="text-3xl font-semibold tracking-tight text-luna-text sm:text-4xl">Stop guessing. Start allocating with confidence.</h2>
              <p className="mx-auto mt-4 max-w-lg text-base font-medium text-luna-text-secondary">
                Solvomo gives growth teams a clearer picture of what&apos;s driving outcomes across channels, creatives, and signals.
              </p>

              <div className="mx-auto mt-10 w-full max-w-[560px] overflow-hidden rounded-xl border border-luna-border/60 bg-luna-bg/30">
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

              <div className="mt-9 flex justify-center">
                <a
                  href={CALENDLY_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-glow inline-flex min-h-11 w-full max-w-sm items-center justify-center rounded-xl bg-gradient-to-r from-accent-teal/72 to-accent-cyan/60 px-8 text-sm font-semibold text-luna-bg transition-all duration-200 hover:from-accent-teal hover:to-accent-cyan sm:w-auto"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-luna-border/60 bg-luna-bg py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div>
              <a href="#" className="inline-flex items-baseline gap-0">
                <span className="solvomo-wordmark-sm text-lg font-black tracking-[-0.06em]">Solvomo</span>
                <span className="text-luna-text-muted text-lg font-semibold">.</span>
              </a>
              <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-luna-text-secondary">
                Marketing decision intelligence for teams who need clarity, not more charts.
              </p>
              <div className="mt-5 flex gap-4 text-luna-text-muted">
                <a href="#" className="transition-colors hover:text-luna-text-secondary" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="transition-colors hover:text-luna-text-secondary" aria-label="X">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-luna-text-muted">Product</p>
                <ul className="mt-4 space-y-2.5 text-sm font-medium text-luna-text-secondary">
                  <li>
                    <a href="#pillars" className="transition-colors hover:text-luna-text">
                      Platform
                    </a>
                  </li>
                  <li>
                    <a href="#workflow" className="transition-colors hover:text-luna-text">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="#resources" className="transition-colors hover:text-luna-text">
                      Decision outputs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-luna-text-muted">Company</p>
                <ul className="mt-4 space-y-2.5 text-sm font-medium text-luna-text-secondary">
                  <li>
                    <a href="#" className="transition-colors hover:text-luna-text">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-luna-text">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href={CALENDLY_BOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-luna-text"
                    >
                      Book a call
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-luna-text-muted">Legal</p>
                <ul className="mt-4 space-y-2.5 text-sm font-medium text-luna-text-secondary">
                  <li>
                    <a href="#" className="transition-colors hover:text-luna-text">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-luna-text">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-luna-text">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-12 border-t border-luna-border/60 pt-8 text-center text-xs font-medium text-luna-text-muted">
            © {new Date().getFullYear()} Solvomo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
