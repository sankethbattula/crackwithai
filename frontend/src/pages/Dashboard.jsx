import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { FileSearch, GraduationCap, LogOut, Lightbulb, Gauge, CalendarDays } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'

function firstNameFromUser(user) {
  const meta = user?.user_metadata
  const full = meta?.full_name || meta?.name || ''
  const first = String(full).trim().split(/\s+/)[0]
  return first || 'there'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [atsSummary, setAtsSummary] = useState({ runs: 0, lastScore: null })
  const [planSummary, setPlanSummary] = useState({ created: false })

  useEffect(() => {
    let mounted = true
    async function run() {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data?.user ?? null)
      try {
        const history = JSON.parse(localStorage.getItem('cwai_ats_history') || '[]')
        const last = JSON.parse(localStorage.getItem('cwai_last_ats') || 'null')
        const runs = Array.isArray(history) ? history.length : 0
        const lastScore = typeof last?.ats_score === 'number' ? last.ats_score : null
        setAtsSummary({ runs, lastScore })
      } catch {
        setAtsSummary({ runs: 0, lastScore: null })
      }
      try {
        const lastPlan = JSON.parse(localStorage.getItem('cwai_last_plan') || 'null')
        setPlanSummary({ created: Boolean(lastPlan?.ts) })
      } catch {
        setPlanSummary({ created: false })
      }
      setLoading(false)
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const firstName = useMemo(() => firstNameFromUser(user), [user])

  async function onSignOut() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {loading ? (
          <div className="py-10">
            <LoadingSpinner label="Loading your dashboard..." />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
                  Run a strict ATS check, see your experience fit, then follow a week-by-week plan
                  to close gaps fast.
                </p>
              </div>
              <button
                onClick={onSignOut}
                className="inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold text-text-primary ring-1 ring-border transition hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Link
                to="/ats-checker"
                className="group rounded-card border border-border bg-card p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-glow"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-button bg-primary/15 text-primary ring-1 ring-primary/25 transition group-hover:bg-primary/20">
                    <FileSearch className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold">ATS Score Checker</div>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      Upload your PDF, paste the job description, and get a strict score, matched
                      keywords, missing skills, bullet rewrites, and interview tips.
                    </p>
                    <div className="mt-4 text-sm font-semibold text-primary transition group-hover:text-accent">
                      Start analysis →
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                to="/learning-plan"
                className="group rounded-card border border-border bg-card p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-glow"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-button bg-[#2563eb]/15 text-[#60a5fa] ring-1 ring-[#2563eb]/30 transition group-hover:bg-[#2563eb]/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold">Study Plan</div>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      Get a practical weekly roadmap across DSA, System Design, Frontend, Backend,
                      and Behavioral — tuned to your timeline and target companies.
                    </p>
                    <div className="mt-4 text-sm font-semibold text-[#60a5fa] transition group-hover:text-white">
                      Build my plan →
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="rounded-card border border-border bg-card p-6 transition duration-300 hover:shadow-glow">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                  <Gauge className="h-4 w-4 text-primary" /> Analyses Run
                </div>
                <div className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary">
                  {atsSummary.runs}
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  Your first analysis takes ~30 seconds.
                </div>
              </div>
              <div className="rounded-card border border-border bg-card p-6 transition duration-300 hover:shadow-glow">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                  <Gauge className="h-4 w-4 text-primary" /> Last Score
                </div>
                <div className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary">
                  {typeof atsSummary.lastScore === 'number' ? atsSummary.lastScore : '—'}
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  Scores above <span className="font-semibold text-text-primary">75</span> increase
                  callbacks.
                </div>
              </div>
              <div className="rounded-card border border-border bg-card p-6 transition duration-300 hover:shadow-glow">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                  <CalendarDays className="h-4 w-4 text-primary" /> Plan Created
                </div>
                <div className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary">
                  {planSummary.created ? 'Yes' : 'No'}
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  Generate a plan aligned to your target role.
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-card border border-border bg-card p-6 transition duration-300 hover:shadow-glow">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                <Lightbulb className="h-4 w-4 text-primary" /> 3 quick ATS tips
              </div>
              <ul className="mt-4 grid gap-3 text-sm text-text-muted md:grid-cols-3">
                <li className="rounded-card border border-border bg-bg/40 p-4">
                  Use standard headings: <span className="font-semibold text-text-primary">Skills</span>,{' '}
                  <span className="font-semibold text-text-primary">Experience</span>,{' '}
                  <span className="font-semibold text-text-primary">Education</span>.
                </li>
                <li className="rounded-card border border-border bg-bg/40 p-4">
                  Mirror keywords from the job description — especially tools and frameworks.
                </li>
                <li className="rounded-card border border-border bg-bg/40 p-4">
                  Quantify impact: “reduced latency by 35%”, “served 10k users”, “saved 5 hrs/week”.
                </li>
              </ul>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
