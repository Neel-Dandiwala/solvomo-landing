'use client'

import { COLOUR_LOGO } from './assets.js'
import Navbar from './Navbar.jsx'
import { HiddenCrawlerMetadata, absoluteUrl, organizationSchema, useSeo, websiteSchema } from './seo.js'

const CALENDLY_BOOK_URL = 'https://calendly.com/riya-aggarwal29/30min'
const PRICING_TITLE = 'Solvomo Pricing — Talk to us about your plan'
const PRICING_DESCRIPTION =
  'Solvomo pricing is tailored to growth teams managing real budget and signal complexity. Contact us to scope the right plan for your operating model.'
const PRICING_TOPICS = [
  'Solvomo pricing',
  'marketing decision intelligence pricing',
  'growth operations pricing',
  'contact for pricing',
]

const pricingPillars = [
  {
    title: 'Scoped to your operating model',
    body: 'Plans are sized around how many channels, brands, and decision cadences you run, not by seat counts that punish collaboration.',
  },
  {
    title: 'Built for serious budgets',
    body: 'Solvomo is built for teams managing meaningful spend. We make sure the investment maps to clear decision outcomes, not vanity metrics.',
  },
  {
    title: 'Predictable from day one',
    body: 'Onboarding, integrations, and the operating cadence are part of every engagement. No surprise modules, no per-event meters.',
  },
]

const pricingFaqs = [
  {
    q: 'Why isn’t pricing public?',
    a: 'Each team has a different operating surface — channels, integrations, brands, and review cadence. We scope pricing once we understand what you actually need Solvomo to do.',
  },
  {
    q: 'What’s included?',
    a: 'Every engagement includes platform access, integrations to your core channel and signal stack, an onboarding plan, and a dedicated operating partner during rollout.',
  },
  {
    q: 'How fast can we get started?',
    a: 'Most teams move from first conversation to live operating cadence within a few weeks. We’ll walk through the timeline on our intro call.',
  },
]

export default function PricingPage() {
  useSeo({
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    path: '/pricing',
    image: COLOUR_LOGO,
    tags: PRICING_TOPICS,
    jsonLd: [
      organizationSchema(),
      websiteSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: PRICING_TITLE,
        description: PRICING_DESCRIPTION,
        url: absoluteUrl('/pricing'),
        isPartOf: websiteSchema(),
        about: PRICING_TOPICS.map((name) => ({ '@type': 'Thing', name })),
      },
    ],
  })

  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <Navbar />

      <HiddenCrawlerMetadata
        title={PRICING_TITLE}
        description={PRICING_DESCRIPTION}
        canonical={absoluteUrl('/pricing')}
        tags={PRICING_TOPICS}
      >
        <dt>Page purpose</dt>
        <dd>Explain Solvomo’s pricing approach and invite growth teams to contact us for a tailored quote.</dd>
      </HiddenCrawlerMetadata>

      <main>
        <section className="hero-backdrop border-b border-black/10">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="eyebrow rounded-full">
                <span className="eyebrow-dot" />
                Pricing
              </div>
              <h1 className="mt-8 text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-black">
                Pricing built around
                <span className="headline-product block">how your team operates.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/62">
                We don’t publish a price list because growth teams don’t look the same. Tell us about your channels, signal stack, and review
                cadence and we’ll scope the right plan.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/#contact"
                  className="button-primary inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold transition-all duration-200"
                >
                  Contact us for pricing
                </a>
                <a
                  href={CALENDLY_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold transition-all duration-200"
                >
                  Book a meeting with us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPillars.map((pillar) => (
                <article key={pillar.title} className="surface-frame rounded-[18px] p-6">
                  <h2 className="sv-card-title">{pillar.title}</h2>
                  <p className="sv-body-copy mt-3">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="max-w-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">FAQ</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                  Common questions before we talk.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-black/60">
                  Still curious? We’re happy to walk through anything else on a short intro call.
                </p>
              </div>
              <div className="grid gap-4">
                {pricingFaqs.map((item) => (
                  <article key={item.q} className="surface-soft rounded-[16px] p-5">
                    <h3 className="text-base font-semibold text-black">{item.q}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-black/60">{item.a}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="surface-frame overflow-hidden rounded-[20px]">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="border-b border-black/10 px-6 py-10 lg:border-b-0 lg:border-r lg:border-black/10 lg:px-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Get a quote</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                    Tell us what you’re running.
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-black/60">
                    Share a quick brief on your channel mix, signal stack, and team. We’ll come back with a tailored plan and pricing.
                  </p>
                </div>
                <div className="px-6 py-10 lg:px-10">
                  <div className="grid gap-3">
                    <a
                      href="/#contact"
                      className="button-primary inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold"
                    >
                      Contact us for pricing
                    </a>
                    <a
                      href={CALENDLY_BOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-secondary inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold"
                    >
                      Book a meeting with us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
