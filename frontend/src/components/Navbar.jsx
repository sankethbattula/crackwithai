import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const topLinks = [
  { label: 'ATS Score', to: '/ats-checker' },
  { label: 'Study Plan', to: '/learning-plan' },
  { label: 'Practice', to: '/practice' },
  { label: 'Learn', to: '/learn' },
]

const secondaryLinks = [
  { label: 'DSA', hash: '#dsa' },
  { label: 'Python', hash: '#python' },
  { label: 'Java', hash: '#java' },
  { label: 'C', hash: '#c' },
  { label: 'C++', hash: '#cpp' },
  { label: 'SQL', hash: '#sql' },
  { label: 'System Design', hash: '#system-design' },
  { label: 'Interview Prep', hash: '#interview-prep' },
  { label: 'ML & AI', hash: '#ml-ai' },
  { label: 'Web Dev', hash: '#web-dev' },
]

function firstName(user) {
  const meta = user?.user_metadata || {}
  const full = meta.full_name || meta.name || ''
  const first = String(full).trim().split(/\s+/)[0]
  return first || (user?.email ? user.email.split('@')[0] : 'Student')
}

function capitalizeFirst(name) {
  const s = String(name || '')
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function scrollToHash(hash) {
  const el = document.querySelector(hash)
  if (!el) return false
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

function TopNavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'relative text-[14px] font-medium text-gray-800 transition-colors duration-200',
          'hover:text-primary',
          isActive ? 'text-primary' : '',
          'after:absolute after:-bottom-[10px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200',
          isActive ? 'after:w-full' : '',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)

  const [auth, setAuth] = useState({ loading: true, user: null })

  const activeSecondary = useMemo(() => {
    const hash = location.hash || ''
    const found = secondaryLinks.find((p) => p.hash === hash)
    return found?.hash || ''
  }, [location.hash])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const { data } = await supabase.auth.getUser()
        if (!alive) return
        setAuth({ loading: false, user: data?.user ?? null })
      } catch {
        if (!alive) return
        setAuth({ loading: false, user: null })
      }
    }
    load()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth({ loading: false, user: session?.user ?? null })
    })

    return () => {
      alive = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  async function onSignOut() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  function handleSecondaryClick(hash) {
    // If we are already on /learn, scroll immediately; otherwise route to /learn + hash.
    if (location.pathname === '/learn') {
      const ok = scrollToHash(hash)
      if (!ok) {
        // fallback: update URL hash; Learn page will handle after render
        navigate(`/learn${hash}`)
      } else {
        window.history.replaceState(null, '', `/learn${hash}`)
      }
      return
    }
    navigate(`/learn${hash}`)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* TOP ROW */}
      <div className="h-[60px] border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-[18px] font-semibold text-gray-900">CrackWithAI</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {topLinks.map((l) => (
              <TopNavItem key={l.to} to={l.to}>
                {l.label}
              </TopNavItem>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {auth.loading ? (
              <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
            ) : auth.user ? (
              <>
                <div className="text-[14px] text-gray-800">
                  Hi, <span className="font-semibold">{capitalizeFirst(firstName(auth.user))}</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-[14px] text-gray-800 transition-colors duration-200 hover:text-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-[14px] text-gray-800 transition-colors duration-200 hover:text-primary">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-md bg-success px-3 py-1.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-gray-900 transition-colors duration-200 hover:bg-gray-100 md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        <div
          className={[
            'md:hidden overflow-hidden border-t border-gray-200 bg-white',
            'transition-[max-height] duration-300 ease-in-out',
            mobileOpen ? 'max-h-[520px]' : 'max-h-0',
          ].join(' ')}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2">
              {topLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    [
                      'min-h-[44px] px-2 py-3 text-[14px] transition-colors duration-200',
                      isActive ? 'text-primary' : 'text-gray-800 hover:text-primary',
                    ].join(' ')
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              {auth.user ? (
                <>
                  <button
                    onClick={onSignOut}
                    className="text-[14px] text-gray-800 transition-colors duration-200 hover:text-primary"
                  >
                    Sign Out
                  </button>
                  <div className="text-[14px] text-gray-800">
                    Hi, <span className="font-semibold">{capitalizeFirst(firstName(auth.user))}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-[14px] text-gray-800 transition-colors duration-200 hover:text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-md bg-success px-3 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="h-[40px] border-b border-gray-200 bg-[#f9fafb]">
        <div className="mx-auto flex h-[40px] max-w-7xl items-center px-4 sm:px-6">
          <div className="no-scrollbar flex w-full items-center gap-5 overflow-x-auto text-[13px]">
            {secondaryLinks.map((p) => {
              const isActive = location.pathname === '/learn' && activeSecondary === p.hash
              return (
                <button
                  key={p.hash}
                  type="button"
                  onClick={() => handleSecondaryClick(p.hash)}
                  className={[
                    'relative shrink-0 py-1 text-[13px] text-gray-700 transition-colors duration-200 hover:text-primary',
                    isActive ? 'text-primary' : '',
                    'after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200',
                    isActive ? 'after:w-full' : '',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
