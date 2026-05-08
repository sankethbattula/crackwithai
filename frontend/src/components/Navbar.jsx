import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Sparkles, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
]

function scrollToHash(hash) {
  if (!hash) return
  const el = document.querySelector(hash)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const location = useLocation()
  const onHome = useMemo(() => location.pathname === '/', [location.pathname])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  function handleHashClick(e, href) {
    if (!href.startsWith('#')) return
    if (!onHome) return
    e.preventDefault()
    scrollToHash(href)
  }

  return (
    <header
      className={[
        'sticky top-0 z-50 h-16 border-b border-transparent transition-all',
        scrolled ? 'border-border/70 bg-bg/70 backdrop-blur' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-button px-2 py-1 transition hover:bg-white/5"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-button bg-primary/15 text-primary ring-1 ring-primary/25 transition group-hover:bg-primary/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-base font-extrabold tracking-tight text-text-primary">
            CrackWithAI
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            onHome ? (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleHashClick(e, item.href)}
                className="rounded-button px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-white/5 hover:text-text-primary"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={`/${item.href}`}
                className="rounded-button px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-white/5 hover:text-text-primary"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/signin"
            className="rounded-button px-4 py-2 text-sm font-semibold text-text-primary ring-1 ring-border transition hover:bg-white/5"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-accent"
          >
            Get Started Free
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button p-2 text-text-primary ring-1 ring-border transition hover:bg-white/5 md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-bg/95 backdrop-blur md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                onHome ? (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      handleHashClick(e, item.href)
                      setMobileOpen(false)
                    }}
                    className="rounded-button px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-white/5 hover:text-text-primary"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={`/${item.href}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-button px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-white/5 hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/signin"
                className="rounded-button px-4 py-2 text-center text-sm font-semibold text-text-primary ring-1 ring-border transition hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-button bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-glow transition hover:bg-accent"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
