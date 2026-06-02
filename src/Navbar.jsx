'use client'

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WHITE_LOGO } from './assets.js'

const CALENDLY_BOOK_URL = 'https://calendly.com/riya-aggarwal29/30min'

const navGroups = [
  {
    id: 'products',
    label: 'Products',
    items: [
      { label: 'Platform', description: 'A unified operating view for growth teams.', to: '/#platform' },
      { label: 'Operating model', description: 'How operators review and decide with Solvomo.', to: '/#operating-model' },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    items: [
      { label: 'Pricing', description: 'Talk to us about the right plan for your team.', to: '/pricing' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    items: [
      { label: 'Blog', description: 'Operating notes on growth, signal, and decisions.', to: '/blog' },
    ],
  },
  {
    id: 'solvomo',
    label: 'Solvomo',
    items: [
      { label: 'About Us', description: 'Why Solvomo exists and what we believe.', to: '/#about' },
      { label: 'Contact Us', description: 'Get in touch with our team.', to: '/#contact' },
    ],
  },
]

function isInternal(to) {
  return typeof to === 'string' && to.startsWith('/')
}

function NavItem({ to, children, className = '', onClick }) {
  if (isInternal(to) && !to.includes('#')) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

export default function Navbar({ scrolled: scrolledProp }) {
  const [openId, setOpenId] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolledLocal, setScrolledLocal] = useState(false)
  const containerRef = useRef(null)
  const closeTimer = useRef(null)
  const { pathname } = useLocation()

  const scrolled = typeof scrolledProp === 'boolean' ? scrolledProp : scrolledLocal

  useEffect(() => {
    if (typeof scrolledProp === 'boolean') return undefined
    const onScroll = () => setScrolledLocal(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrolledProp])

  useEffect(() => {
    setMobileOpen(false)
    setOpenId(null)
  }, [pathname])

  useEffect(() => {
    function onDocClick(event) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target)) {
        setOpenId(null)
      }
    }
    function onKey(event) {
      if (event.key === 'Escape') {
        setOpenId(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenId(null), 140)
  }
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? 'border-black/10 bg-white/92 backdrop-blur-md' : 'border-transparent bg-white/88 backdrop-blur-md'
      }`}
    >
      <div ref={containerRef} className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="logo-mark h-8 w-10 shrink-0">
            <img src={WHITE_LOGO} alt="Solvomo logo" className="h-full w-full" />
          </div>
          <span className="brand-wordmark text-[1.05rem]">Solvomo</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navGroups.map((group) => {
            const isOpen = openId === group.id
            return (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => {
                  cancelClose()
                  setOpenId(group.id)
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={`nav-link inline-flex items-center gap-1 rounded-[10px] px-3 py-2 text-sm font-medium ${
                    isOpen ? 'text-black' : ''
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : group.id)}
                  onFocus={() => {
                    cancelClose()
                    setOpenId(group.id)
                  }}
                >
                  {group.label}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden
                    className={`h-3.5 w-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.5 8 4.5 4.5L14.5 8" />
                  </svg>
                </button>

                {isOpen ? (
                  <div
                    className="nav-dropdown surface-frame absolute left-1/2 top-full z-40 mt-2 w-[20rem] -translate-x-1/2 rounded-[16px] p-2"
                    role="menu"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="grid gap-1">
                      {group.items.map((item) => (
                        <NavItem
                          key={item.label}
                          to={item.to}
                          className="nav-dropdown-item block rounded-[12px] px-3 py-2.5"
                          onClick={() => setOpenId(null)}
                        >
                          <span className="block text-sm font-semibold text-black">{item.label}</span>
                          {item.description ? (
                            <span className="mt-1 block text-xs leading-relaxed text-black/55">{item.description}</span>
                          ) : null}
                        </NavItem>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CALENDLY_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary hidden items-center justify-center rounded-[14px] px-4 py-2.5 text-sm font-semibold transition-all duration-200 md:inline-flex"
          >
            Book a meeting with us
          </a>
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-black/10 text-black/70"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-black/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="grid gap-4">
              {navGroups.map((group) => (
                <div key={group.id}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">{group.label}</p>
                  <div className="mt-2 grid gap-1">
                    {group.items.map((item) => (
                      <NavItem
                        key={item.label}
                        to={item.to}
                        className="nav-dropdown-item block rounded-[12px] px-3 py-2.5 text-sm font-medium text-black"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </NavItem>
                    ))}
                  </div>
                </div>
              ))}
              <a
                href={CALENDLY_BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary mt-2 inline-flex items-center justify-center rounded-[14px] px-4 py-3 text-sm font-semibold"
              >
                Book a meeting with us
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
