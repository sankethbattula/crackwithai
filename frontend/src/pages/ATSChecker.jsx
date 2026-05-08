import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import { UploadCloud, FileText, AlertTriangle, Copy, CheckCircle2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const targetRoles = [
  'Software Engineer',
  'Data Analyst',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack',
  'DevOps',
  'ML Engineer',
]

const loadingMessages = [
  'Parsing your resume...',
  'Extracting keywords...',
  'Comparing with job description...',
  'Detecting experience requirements...',
  'Calculating ATS score...',
  'Generating recommendations...',
  'Almost done...',
]

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

const progressWidthClasses = [
  'w-[0%]',
  'w-[5%]',
  'w-[10%]',
  'w-[15%]',
  'w-[20%]',
  'w-[25%]',
  'w-[30%]',
  'w-[35%]',
  'w-[40%]',
  'w-[45%]',
  'w-[50%]',
  'w-[55%]',
  'w-[60%]',
  'w-[65%]',
  'w-[70%]',
  'w-[75%]',
  'w-[80%]',
  'w-[85%]',
  'w-[90%]',
  'w-[95%]',
]

function progressClass(pct) {
  const clamped = clamp(pct, 0, 95)
  const step = Math.round(clamped / 5)
  return progressWidthClasses[step] || 'w-[0%]'
}

function scoreColor(score) {
  if (score >= 90) return { ring: 'text-success', chip: 'bg-success/15 text-success ring-success/30' }
  if (score >= 75) return { ring: 'text-[#60a5fa]', chip: 'bg-[#2563eb]/15 text-[#60a5fa] ring-[#2563eb]/30' }
  if (score >= 50) return { ring: 'text-warning', chip: 'bg-warning/15 text-warning ring-warning/30' }
  return { ring: 'text-danger', chip: 'bg-danger/15 text-danger ring-danger/30' }
}

function experienceBanner(fit) {
  if (fit === 'poor') {
    return {
      tone: 'border-danger/50 bg-danger/10 text-danger',
      title: '⚠️ Experience Gap Detected',
    }
  }
  if (fit === 'borderline') {
    return {
      tone: 'border-warning/50 bg-warning/10 text-warning',
      title: '⚡ You Are Close',
    }
  }
  return {
    tone: 'border-success/40 bg-success/10 text-success',
    title: '✅ Experience Match Confirmed',
  }
}

function validateInputs({ file, jobDescription }) {
  if (!file) return 'Please upload your resume PDF'
  if (file.type !== 'application/pdf') return 'Only PDF files are accepted'
  if (file.size > 5 * 1024 * 1024) return 'Please upload a PDF under 5MB'
  if (!jobDescription.trim()) return 'Please paste the job description'
  return ''
}

function CircularGauge({ score }) {
  const size = 140
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = clamp(score ?? 0, 0, 100) / 100
  const dash = c * (1 - pct)
  const colors = scoreColor(score ?? 0)

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[140px] w-[140px]">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={stroke}
            className="fill-none stroke-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={stroke}
            className={['fill-none transition-all duration-700', colors.ring].join(' ')}
            stroke="currentColor"
            strokeDasharray={c}
            strokeDashoffset={dash}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div className="text-3xl font-extrabold tracking-tight text-text-primary">
            {typeof score === 'number' ? score : '—'}
          </div>
          <div className="mt-1 text-xs font-semibold text-text-muted">ATS Score</div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-text-primary">
          Score above <span className="text-primary">75</span> increases callbacks
        </div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1">
          <span className={['rounded-full px-3 py-1 ring-1', colors.chip].join(' ')}>
            {score >= 90 ? 'Near perfect' : score >= 75 ? 'Strong' : score >= 50 ? 'Needs work' : 'At risk'}
          </span>
        </div>
      </div>
    </div>
  )
}

function Chip({ tone = 'bg-white/5 text-text-muted ring-border/80', children }) {
  return (
    <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1', tone].join(' ')}>
      {children}
    </span>
  )
}

function Alert({ tone, title, children }) {
  return (
    <div className={['rounded-card border p-4', tone].join(' ')}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5" />
        <div className="min-w-0">
          <div className="text-sm font-extrabold">{title}</div>
          <div className="mt-1 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function ATSChecker() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('Software Engineer')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const [loadingTextIdx, setLoadingTextIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  const canAnalyze = useMemo(() => Boolean(file) && jobDescription.trim().length > 0 && !submitting, [
    file,
    jobDescription,
    submitting,
  ])

  useEffect(() => {
    if (!submitting) return
    setLoadingTextIdx(0)
    setProgress(0)

    const started = Date.now()
    const msgTimer = window.setInterval(() => {
      setLoadingTextIdx((i) => (i + 1) % loadingMessages.length)
    }, 2000)

    const progTimer = window.setInterval(() => {
      const elapsed = Date.now() - started
      const pct = (elapsed / 20000) * 95
      setProgress((p) => Math.max(p, clamp(Math.floor(pct), 0, 95)))
    }, 180)

    return () => {
      window.clearInterval(msgTimer)
      window.clearInterval(progTimer)
    }
  }, [submitting])

  function onPickFile(f) {
    setError('')
    setResult(null)
    setFile(f || null)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) onPickFile(dropped)
  }

  async function onAnalyze() {
    setError('')
    setResult(null)

    const validation = validateInputs({ file, jobDescription })
    if (validation) {
      setError(validation)
      return
    }

    const form = new FormData()
    form.append('resume_file', file)
    form.append('job_description', jobDescription)
    form.append('target_role', targetRole)

    setSubmitting(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 65000)

    try {
      const { data } = await axios.post(`${API_URL}/api/analyze`, form, {
        signal: controller.signal,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProgress(95)
      setTimeout(() => setProgress(100), 250)
      setResult(data)

      try {
        const prev = JSON.parse(localStorage.getItem('cwai_ats_history') || '[]')
        const next = [
          { ts: Date.now(), score: data?.ats_score, role: targetRole },
          ...Array.isArray(prev) ? prev : [],
        ].slice(0, 20)
        localStorage.setItem('cwai_ats_history', JSON.stringify(next))
        localStorage.setItem('cwai_last_ats', JSON.stringify({ ts: Date.now(), ...data, targetRole }))
      } catch {
        // ignore storage errors
      }
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
        setError('Taking longer than expected, try again')
      } else if (err?.response?.data?.detail) {
        setError(String(err.response.data.detail))
      } else {
        setError('Analysis failed, please try again')
      }
    } finally {
      window.clearTimeout(timeout)
      setSubmitting(false)
      setProgress((p) => (p >= 95 ? p : 0))
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  const exp = useMemo(() => {
    if (!result) return null
    return experienceBanner(result.experience_fit)
  }, [result])

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">ATS Checker</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">
            Upload your resume PDF, paste the job description, and get a strict ATS score plus an
            honest experience-fit verdict.
          </p>
        </div>

        {error ? (
          <Alert tone="border-danger/50 bg-danger/10 text-danger" title="Action needed">
            {error}
          </Alert>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* LEFT INPUT PANEL */}
          <div className="rounded-card border border-border bg-card p-6">
            <div className="text-sm font-semibold text-text-muted">Resume PDF</div>
            <div
              className={[
                'mt-3 rounded-card border-2 border-dashed p-6 transition',
                dragActive ? 'border-primary bg-primary/10' : 'border-primary/60 bg-bg/40 hover:bg-white/5',
              ].join(' ')}
              onDragEnter={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => {
                e.preventDefault()
                setDragActive(false)
              }}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
              />

              <div className="flex flex-col items-center text-center">
                <UploadCloud className="h-8 w-8 text-primary" />
                <div className="mt-3 text-sm font-semibold text-text-primary">
                  Drag & drop your PDF here
                </div>
                <div className="mt-1 text-xs text-text-muted">
                  Or click to choose a file (max 5MB)
                </div>

                <div className="mt-4 w-full">
                  {file ? (
                    <div className="flex items-center justify-between gap-3 rounded-card border border-border bg-bg/40 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 text-text-muted" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{file.name}</div>
                          <div className="text-xs text-text-muted">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        className="rounded-button px-3 py-1.5 text-xs font-semibold text-text-primary ring-1 ring-border transition hover:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPickFile(null)
                          if (inputRef.current) inputRef.current.value = ''
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-card border border-border bg-bg/40 px-4 py-3 text-xs text-text-muted">
                      Tip: Use a text-based PDF (not scanned images).
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-text-muted">Job description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-2 min-h-[200px] w-full resize-y rounded-card border border-border bg-bg/40 px-4 py-3 text-sm leading-relaxed text-text-primary outline-none transition focus:border-primary"
                placeholder="Paste the job description from LinkedIn / Indeed / company site..."
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-text-muted">Target role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
              >
                {targetRoles.map((r) => (
                  <option key={r} value={r} className="bg-bg">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled={!canAnalyze}
              onClick={onAnalyze}
              className={[
                'mt-6 inline-flex w-full items-center justify-center rounded-button bg-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition',
                canAnalyze ? 'hover:bg-accent' : 'cursor-not-allowed opacity-60',
              ].join(' ')}
            >
              {submitting ? 'Analyzing...' : 'Analyze'}
            </button>

            {submitting ? (
              <div className="mt-6 rounded-card border border-border bg-bg/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner label={loadingMessages[loadingTextIdx]} />
                  </div>
                  <div className="text-sm font-semibold text-text-muted">{progress}%</div>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={['h-full rounded-full bg-primary transition-all', progressClass(progress)].join(' ')}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT RESULTS PANEL */}
          <div className="rounded-card border border-border bg-card p-6">
            {!result ? (
              <div className="rounded-card border border-border bg-bg/40 p-6 text-center">
                <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-button bg-primary/15 text-primary ring-1 ring-primary/25">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-text-primary">
                  Your analysis will appear here
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  Upload a PDF and paste a job description to get started.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. EXPERIENCE FIT BANNER */}
                <div className={['rounded-card border p-4', exp?.tone].join(' ')}>
                  <div className="text-sm font-extrabold">{exp?.title}</div>
                  <div className="mt-2 text-sm">
                    Requires <span className="font-extrabold">{result.required_experience_years}</span> years, you have{' '}
                    <span className="font-extrabold">{result.candidate_experience_years}</span> years
                  </div>
                  <div className="mt-2 text-sm leading-relaxed">{result.experience_message}</div>
                  {result.experience_fit === 'poor' ? (
                    <div className="mt-2 text-xs font-semibold text-text-muted">
                      We still analyzed your resume below
                    </div>
                  ) : null}
                </div>

                {/* 2. ATS SCORE */}
                <div className="rounded-card border border-border bg-bg/40 p-5">
                  <CircularGauge score={result.ats_score} />
                </div>

                {/* 3. Matched keywords */}
                <div>
                  <div className="text-sm font-extrabold text-text-primary">Matched keywords</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(result.matched_keywords || []).slice(0, 40).map((k) => (
                      <Chip key={k} tone="bg-success/12 text-success ring-success/30">
                        {k}
                      </Chip>
                    ))}
                    {(result.matched_keywords || []).length === 0 ? (
                      <div className="text-sm text-text-muted">
                        No matched keywords detected — check if your PDF is text-based.
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 4. Missing keywords */}
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="text-sm font-extrabold text-text-primary">Missing keywords</div>
                    <div className="text-xs font-semibold text-text-muted">
                      Tip: add only what you truly have.
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(result.missing_keywords || []).slice(0, 40).map((k) => (
                      <Chip key={k} tone="bg-danger/12 text-danger ring-danger/30">
                        {k}
                      </Chip>
                    ))}
                    {(result.missing_keywords || []).length === 0 ? (
                      <div className="text-sm text-text-muted">No obvious missing keywords.</div>
                    ) : null}
                  </div>
                </div>

                {/* 5. Bullet rewrites */}
                <div>
                  <div className="text-sm font-extrabold text-text-primary">Bullet rewrites</div>
                  <div className="mt-3 space-y-4">
                    {(result.bullet_rewrites || []).slice(0, 6).map((br, idx) => (
                      <div key={idx} className="rounded-card border border-border bg-bg/40 p-4">
                        <div className="text-xs font-semibold text-text-muted">Before</div>
                        <div className="mt-1 text-sm text-text-primary">{br.original}</div>
                        <div className="mt-3 text-xs font-semibold text-text-muted">After</div>
                        <div className="mt-1 text-sm text-text-primary">{br.improved}</div>
                        <div className="mt-3 flex justify-end">
                          <button
                            className="inline-flex items-center gap-2 rounded-button px-3 py-1.5 text-xs font-semibold text-text-primary ring-1 ring-border transition hover:bg-white/5"
                            onClick={async () => {
                              const ok = await copyText(br.improved)
                              if (!ok) setError('Could not copy. Please copy manually.')
                            }}
                          >
                            <Copy className="h-4 w-4" /> Copy
                          </button>
                        </div>
                      </div>
                    ))}
                    {(result.bullet_rewrites || []).length === 0 ? (
                      <div className="text-sm text-text-muted">No rewrites returned.</div>
                    ) : null}
                  </div>
                </div>

                {/* 6. Strengths */}
                <div>
                  <div className="text-sm font-extrabold text-text-primary">Strengths</div>
                  <ul className="mt-3 space-y-2 text-sm text-text-muted">
                    {(result.strengths || []).slice(0, 10).map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 7. Improvement areas */}
                <div>
                  <div className="text-sm font-extrabold text-text-primary">Improvement areas</div>
                  <ul className="mt-3 space-y-2 text-sm text-text-muted">
                    {(result.improvement_areas || []).slice(0, 10).map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 8. Interview tips */}
                <div>
                  <div className="text-sm font-extrabold text-text-primary">Interview tips</div>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-text-muted">
                    {(result.interview_tips || []).slice(0, 5).map((t, i) => (
                      <li key={`${i}-${t}`}>{t}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
