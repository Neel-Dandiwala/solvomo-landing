'use client'

import { Link } from 'react-router-dom'

const CONTACT_EMAIL = 'hello@solvomo.com'

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold tracking-tight text-black">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-black/70">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="page-haze min-h-svh bg-white text-black antialiased">
      <header className="border-b border-black/10 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="logo-mark h-8 w-10 shrink-0">
              <img src="/white_logo.jpeg" alt="Solvomo logo" className="h-full w-full" />
            </div>
            <span className="brand-wordmark text-[1.05rem]">Solvomo</span>
          </Link>
          <Link to="/" className="nav-link text-sm font-medium">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-black/55">Last updated: April 10, 2026</p>

        <p className="mt-8 text-sm leading-relaxed text-black/70">
          This Privacy Policy describes how Solvomo (&quot;we,&quot; &quot;us&quot;) collects, uses, and shares information when you visit our
          website, request information about our product, or otherwise interact with us online. We are early-stage and not yet incorporated;
          when we form a legal entity, this policy will continue to apply unless we post an update.
        </p>

        <Section title="Information we collect">
          <p>
            We may collect information you provide directly, such as your name, email address, company name, and anything you include in a
            message or form. If you book time with us through a third-party scheduling link, that provider processes your details under
            their own terms.
          </p>
          <p>
            We also receive limited technical data automatically, such as IP address, browser type, general device or network information,
            and how you use our site (for example pages viewed), through server logs and similar technologies.
          </p>
        </Section>

        <Section title="How we use information">
          <p>We use this information to operate and improve our website, respond to inquiries, send updates you have asked for, and understand interest in Solvomo.</p>
        </Section>

        <Section title="Cookies">
          <p>We may use cookies or similar technologies for basic site functionality and to measure traffic or performance. You can control cookies through your browser settings.</p>
        </Section>

        <Section title="Sharing">
          <p>
            We do not sell your personal information. We may share information with vendors that help us host the site, send email, or run
            analytics, strictly as needed for those services. We may also disclose information if required by law or to protect our rights
            and the security of our users.
          </p>
        </Section>

        <Section title="Security">
          <p>We take reasonable steps to protect information we hold. No method of transmission or storage is completely secure.</p>
        </Section>

        <Section title="Retention">
          <p>We keep information only as long as needed for the purposes above, unless a longer period is required or permitted by law.</p>
        </Section>

        <Section title="Children">
          <p>Our site is not directed at children under 13, and we do not knowingly collect their personal information.</p>
        </Section>

        <Section title="Changes">
          <p>We may update this policy from time to time. We will revise the &quot;Last updated&quot; date above when we do.</p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-black underline decoration-black/25 underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>
    </div>
  )
}
