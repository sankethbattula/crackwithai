import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CheckCircle2, ChevronRight } from 'lucide-react'

const roles = [
  'Software Engineer',
  'Data Analyst',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack',
  'DevOps',
  'ML Engineer',
]

const levels = ['Beginner', 'Intermediate', 'Advanced']
const timelines = ['4 weeks', '8 weeks', '12 weeks']
const companies = ['Google', 'Microsoft', 'Amazon', 'PayPal', 'Adobe']

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-button px-4 py-2 text-sm font-semibold transition ring-1',
        active
          ? 'bg-primary/15 text-text-primary ring-primary/25'
          : 'bg-bg/40 text-text-muted ring-border hover:bg-white/5 hover:text-text-primary',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function buildPlan({ role, level, timelineWeeks, selectedCompanies }) {
  const companyLine =
    selectedCompanies.length > 0
      ? `Patterns emphasized for: ${selectedCompanies.join(', ')}.`
      : 'Company patterns included for top tech.'

  const intensity = timelineWeeks <= 4 ? 'high' : timelineWeeks <= 8 ? 'medium' : 'steady'

  const dsaFocus =
    level === 'Beginner'
      ? ['Arrays & Strings', 'Hash Maps', 'Two Pointers', 'Stacks & Queues', 'Recursion basics']
      : level === 'Intermediate'
        ? ['Binary Search', 'Trees', 'Graphs', 'Dynamic Programming', 'Sliding Window']
        : ['Advanced DP', 'Graph shortest paths', 'Monotonic stacks', 'Tries', 'Union Find']

  const roleFocus =
    role === 'Data Analyst'
      ? {
          frontend: ['Dashboards basics', 'Data visualization principles', 'SQL-to-chart storytelling'],
          backend: ['SQL queries', 'Data modeling basics', 'ETL concepts', 'APIs for analytics'],
          system: ['Warehouse vs lake basics', 'Batch vs streaming', 'Data quality checks'],
        }
      : role === 'Frontend Engineer'
        ? {
            frontend: ['React fundamentals', 'State management patterns', 'Performance tuning', 'Accessibility'],
            backend: ['REST APIs', 'Auth basics', 'Caching fundamentals', 'Error handling'],
            system: ['CDNs & caching', 'Client-server boundaries', 'Web performance metrics'],
          }
        : role === 'Backend Engineer'
          ? {
              frontend: ['HTTP basics', 'Client-server contracts', 'API docs writing'],
              backend: ['REST design', 'Databases indexes', 'Caching', 'Background jobs', 'Observability'],
              system: ['Scaling patterns', 'Load balancing', 'Queues', 'Rate limiting'],
            }
          : role === 'DevOps'
            ? {
                frontend: ['CI basics', 'Developer workflows', 'Release checks'],
                backend: ['Containers', 'Networking basics', 'Secrets management', 'IaC fundamentals'],
                system: ['Monitoring/alerting', 'SLOs', 'Incident response', 'Kubernetes primitives'],
              }
            : role === 'ML Engineer'
              ? {
                  frontend: ['Model demos', 'Data visualization', 'Experiment dashboards'],
                  backend: ['Feature stores', 'Model serving APIs', 'Batch inference', 'MLOps basics'],
                  system: ['Latency vs throughput', 'Model monitoring', 'Retraining triggers'],
                }
              : {
                  frontend: ['React fundamentals', 'TypeScript adoption', 'Testing basics', 'Accessibility'],
                  backend: ['API design', 'Databases', 'Auth', 'Caching', 'Performance'],
                  system: ['System design fundamentals', 'Scaling', 'Reliability'],
                }

  const weeks = Array.from({ length: timelineWeeks }, (_, i) => i + 1)

  const dsa = weeks.map((w) => {
    const topic = dsaFocus[(w - 1) % dsaFocus.length]
    const pace = intensity === 'high' ? '6–8 problems' : intensity === 'medium' ? '4–6 problems' : '3–5 problems'
    return {
      week: w,
      title: `Week ${w}: ${topic}`,
      bullets: [
        `Solve ${pace} focused problems (easy → medium).`,
        'Write clean solutions with time/space analysis.',
        'Re-solve 2 missed problems from memory.',
      ],
    }
  })

  const systemDesign = [
    'Week 1: Core concepts — latency, throughput, consistency, caching',
    'Week 2: API + data modeling — REST, pagination, indexing',
    'Week 3: Scaling patterns — queues, load balancing, sharding',
    'Week 4: Reliability — monitoring, rate limits, failure modes',
  ]

  const frontend = [
    ...roleFocus.frontend,
    'Project: Build a polished UI with responsive layout and clean component boundaries.',
    'Practice: Explain your UI decisions (UX, accessibility, performance).',
  ]

  const backend = [
    ...roleFocus.backend,
    'Project: Build 1 production-style API with validation + error handling.',
    'Practice: Write crisp trade-offs and edge cases for your API design.',
  ]

  const behavioral = [
    'Tell me about yourself (role-aligned)',
    'Most challenging bug you solved',
    'A conflict you handled',
    'A project you’re proud of',
    'A time you showed ownership',
    'A time you failed and recovered',
    'Dealing with ambiguous requirements',
    'Handling tight deadlines',
    'Improving a process',
    'Mentoring / helping others',
    'Receiving critical feedback',
    'Leading without authority',
    'Prioritization under pressure',
    'Customer impact example',
    'A decision you changed your mind on',
    'Driving measurable impact',
    'Working cross-functionally',
    'Communicating trade-offs',
    'Handling production issues',
    'Why this company / team',
  ].map((q, idx) => `${idx + 1}. ${q} — answer with STAR, quantify impact.`)

  const oa = [
    `${companyLine}`,
    'Warm-up: 2 timed problems/day (35–45 mins each).',
    'Pattern focus: arrays/strings, hash maps, intervals, trees/graphs, DP basics.',
    'Review loop: after each session, write a 5-line “why I missed it” note.',
    'Final week: 3 full mocks + error log review.',
  ]

  return {
    meta: {
      role,
      level,
      timelineWeeks,
      selectedCompanies,
    },
    dsa,
    systemDesign,
    frontend,
    backend,
    behavioral,
    oa,
  }
}

export default function LearningPlan() {
  const [role, setRole] = useState('Software Engineer')
  const [level, setLevel] = useState('Beginner')
  const [timeline, setTimeline] = useState('8 weeks')
  const [selectedCompanies, setSelectedCompanies] = useState(['Google', 'Microsoft'])
  const [activeTab, setActiveTab] = useState('DSA')
  const [plan, setPlan] = useState(null)

  const timelineWeeks = useMemo(() => Number(timeline.split(' ')[0]), [timeline])

  function toggleCompany(c) {
    setSelectedCompanies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  }

  function onGenerate(e) {
    e.preventDefault()
    const built = buildPlan({ role, level, timelineWeeks, selectedCompanies })
    setPlan(built)
    setActiveTab('DSA')
    try {
      localStorage.setItem('cwai_last_plan', JSON.stringify({ ts: Date.now(), ...built.meta }))
    } catch {
      // ignore storage errors
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Learning Plan</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">
            Build a week-by-week plan you can actually execute — tuned to your role, level, and
            timeline.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <form onSubmit={onGenerate} className="rounded-card border border-border bg-card p-6 lg:col-span-1">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-text-muted">Target role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-bg">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-text-muted">Experience level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                >
                  {levels.map((l) => (
                    <option key={l} value={l} className="bg-bg">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-text-muted">Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                >
                  {timelines.map((t) => (
                    <option key={t} value={t} className="bg-bg">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-sm font-semibold text-text-muted">Target companies</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {companies.map((c) => {
                    const active = selectedCompanies.includes(c)
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCompany(c)}
                        className={[
                          'rounded-button px-3 py-2 text-sm font-semibold transition ring-1',
                          active
                            ? 'bg-primary/15 text-text-primary ring-primary/25'
                            : 'bg-bg/40 text-text-muted ring-border hover:bg-white/5 hover:text-text-primary',
                        ].join(' ')}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-2 text-xs text-text-muted">
                  Choose 1–3 companies for tighter pattern focus.
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-accent"
              >
                Generate plan <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="rounded-card border border-border bg-card p-6 lg:col-span-2">
            {!plan ? (
              <div className="rounded-card border border-border bg-bg/40 p-8 text-center">
                <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-button bg-primary/15 text-primary ring-1 ring-primary/25">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-text-primary">
                  Your plan will appear here
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  Pick your role and timeline, then generate a week-by-week roadmap.
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2">
                  {['DSA', 'System Design', 'Frontend', 'Backend', 'Behavioral', 'Online Assessment'].map((t) => (
                    <TabButton key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>
                      {t}
                    </TabButton>
                  ))}
                </div>

                <div className="mt-6">
                  {activeTab === 'DSA' ? (
                    <div className="space-y-4">
                      {plan.dsa.map((w) => (
                        <div key={w.week} className="rounded-card border border-border bg-bg/40 p-4">
                          <div className="text-sm font-extrabold text-text-primary">{w.title}</div>
                          <ul className="mt-2 space-y-2 text-sm text-text-muted">
                            {w.bullets.map((b) => (
                              <li key={b} className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeTab === 'System Design' ? (
                    <div className="space-y-3 text-sm text-text-muted">
                      {plan.systemDesign.map((line) => (
                        <div key={line} className="rounded-card border border-border bg-bg/40 p-4">
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeTab === 'Frontend' ? (
                    <ul className="space-y-3 text-sm text-text-muted">
                      {plan.frontend.map((line) => (
                        <li key={line} className="rounded-card border border-border bg-bg/40 p-4">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {activeTab === 'Backend' ? (
                    <ul className="space-y-3 text-sm text-text-muted">
                      {plan.backend.map((line) => (
                        <li key={line} className="rounded-card border border-border bg-bg/40 p-4">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {activeTab === 'Behavioral' ? (
                    <div className="rounded-card border border-border bg-bg/40 p-5">
                      <div className="text-sm font-extrabold text-text-primary">20 STAR questions</div>
                      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-text-muted">
                        {plan.behavioral.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                  {activeTab === 'Online Assessment' ? (
                    <div className="space-y-3 text-sm text-text-muted">
                      {plan.oa.map((line) => (
                        <div key={line} className="rounded-card border border-border bg-bg/40 p-4">
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : null}
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
