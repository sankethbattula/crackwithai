import { Link } from 'react-router-dom'
import {
  Target,
  UserCheck,
  Search,
  Edit,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Check,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function SectionBadge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-xs font-semibold text-text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      {children}
    </div>
  )
}

function Card({ className = '', children }) {
  return (
    <div
      className={[
        'rounded-card border border-border bg-card p-6 transition duration-300',
        'hover:-translate-y-0.5 hover:shadow-glow',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      {/* SECTION 2 — HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        >
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-1.5 text-sm font-semibold text-text-primary">
              <span aria-hidden="true">✨</span>
              <span>AI-Powered Career Coach</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Land Your Dream Job with a Perfect Resume
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Upload your resume, get your real ATS score, discover missing skills, and get a
              personalized study plan to crack Software Engineer and Data Analyst interviews at
              Google, Microsoft, PayPal, Amazon, and Adobe.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-accent"
              >
                Check My ATS Score <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-button px-5 py-3 text-sm font-semibold text-text-primary ring-1 ring-border transition hover:bg-white/5"
              >
                View Study Plan
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="text-success">✓</span> Free forever
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-success">✓</span> No credit card
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-success">✓</span> 2,000+ students
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-card border border-border bg-card p-6 shadow-glow">
                <div
                  className="absolute inset-0 animate-shimmer bg-gradient-to-r from-primary/15 via-white/5 to-primary/15 [background-size:200%_100%] opacity-40"
                  aria-hidden="true"
                />
                <div className="relative space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-text-muted">Live stats</div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 px-3 py-1 text-xs font-semibold text-text-muted">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                      </span>
                      Live AI Analysis Active
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-card border border-border bg-bg/40 p-4">
                      <div className="text-3xl font-extrabold text-text-primary">94%</div>
                      <div className="mt-1 text-sm text-text-muted">ATS Match Rate Achieved</div>
                    </div>
                    <div className="rounded-card border border-border bg-bg/40 p-4">
                      <div className="text-3xl font-extrabold text-text-primary">2,847</div>
                      <div className="mt-1 text-sm text-text-muted">Resumes Analyzed</div>
                    </div>
                  </div>

                  <div className="rounded-card border border-border bg-bg/40 p-4 text-sm text-text-muted">
                    Google · Microsoft · PayPal · Amazon · Adobe
                  </div>

                  <div className="rounded-card border border-border bg-bg/40 p-4">
                    <div className="text-sm font-semibold text-text-primary">What you get in 30s</div>
                    <div className="mt-3 space-y-2 text-sm text-text-muted">
                      {[
                        'Strict ATS score + verdict',
                        'Missing skills and keywords',
                        'Bullet rewrites you can copy',
                        'Interview-ready study plan',
                      ].map((t) => (
                        <div key={t} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-primary" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-text-muted">
                Built for real hiring filters — not generic resume scoring.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — EXPERIENCE FIT PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            We tell you the truth before you apply
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            Most ATS tools just give you a score. We tell you if you should even apply first.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-card border border-danger/60 bg-card p-6 transition duration-300 hover:shadow-glow">
            <div className="text-sm font-semibold text-danger">⚠️ Poor Fit</div>
            <div className="mt-3 text-sm text-text-muted">
              “Job requires 5 years. You have 2 years.”
            </div>
            <div className="mt-4 text-sm font-semibold text-text-primary">
              Likely auto-rejected. Apply to junior roles.
            </div>
          </div>

          <div className="rounded-card border border-warning/60 bg-card p-6 transition duration-300 hover:shadow-glow">
            <div className="text-sm font-semibold text-warning">⚡ Borderline</div>
            <div className="mt-3 text-sm text-text-muted">
              “Job requires 3 years. You have 2 years.”
            </div>
            <div className="mt-4 text-sm font-semibold text-text-primary">
              Possible — strengthen your project section.
            </div>
          </div>

          <div className="rounded-card border border-success/60 bg-card p-6 transition duration-300 hover:shadow-glow">
            <div className="text-sm font-semibold text-success">✅ Great Fit</div>
            <div className="mt-3 text-sm text-text-muted">
              “Job requires 2 years. You have 2 years.”
            </div>
            <div className="mt-4 text-sm font-semibold text-text-primary">
              Experience matches! Here is your ATS analysis.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <SectionBadge>Features</SectionBadge>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Everything You Need to Succeed
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'ATS Score Checker',
              icon: Target,
              desc:
                'Real ATS match score using the same 10 rules Fortune 500 companies use — keyword matching, format, skills alignment.',
            },
            {
              title: 'Experience Fit Detector',
              icon: UserCheck,
              desc:
                'Know if you meet the experience requirement BEFORE wasting your application.',
            },
            {
              title: 'Missing Skills Finder',
              icon: Search,
              desc: 'See exactly which keywords and skills are missing from your resume.',
            },
            {
              title: 'Resume Bullet Rewriter',
              icon: Edit,
              desc: 'AI rewrites your weak bullet points into strong action-verb driven statements.',
            },
            {
              title: 'Interview Question Bank',
              icon: MessageCircle,
              desc: 'Top interview questions for your exact target role and company.',
            },
            {
              title: 'Personalized Study Plan',
              icon: BookOpen,
              desc: 'Week-by-week roadmap covering DSA, System Design, Frontend, Backend, Behavioral.',
            },
          ].map((f) => (
            <Card key={f.title} className="group">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-button bg-primary/15 text-primary ring-1 ring-primary/25 transition group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-text-primary">{f.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{f.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <SectionBadge>How It Works</SectionBadge>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Three Steps to Interview Success
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: '1',
              title: 'Create Your Free Account',
              desc: 'Sign up in 30 seconds. No credit card required.',
            },
            {
              n: '2',
              title: 'Upload Resume + Paste Job Description',
              desc:
                'Upload your PDF and paste from LinkedIn, Indeed, or any job board.',
            },
            {
              n: '3',
              title: 'Get Your Analysis + Study Plan',
              desc:
                'ATS score, experience verdict, missing skills, bullet rewrites, and full study plan in 30 seconds.',
            },
          ].map((s) => (
            <Card key={s.n}>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-glow">
                  <span className="text-sm font-extrabold">{s.n}</span>
                </div>
                <div>
                  <div className="text-base font-bold text-text-primary">{s.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 6 — STATS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { num: '2,847+', label: 'Resumes Analyzed' },
            { num: '94%', label: 'ATS Improvement' },
            { num: '500+', label: 'Interview Questions' },
            { num: '4.9★', label: 'Student Rating' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-card border border-border bg-card p-6 text-center transition duration-300 hover:shadow-glow"
            >
              <div className="text-3xl font-extrabold tracking-tight text-primary">{s.num}</div>
              <div className="mt-2 text-sm font-semibold text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <SectionBadge>Success Stories</SectionBadge>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Students Who Landed Their Dream Jobs
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Priya Sharma',
              role: 'SWE Intern → Full-time at Microsoft',
              quote:
                '“I had no idea my resume scored only 34% on ATS. CrackWithAI showed me exactly what was missing. After fixing it I got 3 callbacks in one week.”',
            },
            {
              name: 'Marcus Johnson',
              role: 'CS Graduate → Data Analyst at PayPal',
              quote:
                '“The experience fit feature saved me from wasting 10 applications on jobs I was not qualified for. It pointed me to right roles and I landed one.”',
            },
            {
              name: 'Aisha Patel',
              role: 'Bootcamp Grad → Frontend Engineer at Adobe',
              quote:
                '“The study plan was a game changer. Week by week I knew exactly what to study for the technical round.”',
            },
          ].map((t) => (
            <Card key={t.name}>
              <div className="flex items-center gap-1 text-warning" aria-label="5 out of 5 stars">
                {'★★★★★'.split('').map((s, idx) => (
                  <span key={idx} className="text-lg leading-none">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{t.quote}</p>
              <div className="mt-6">
                <div className="text-sm font-bold text-text-primary">{t.name}</div>
                <div className="mt-1 text-xs font-semibold text-text-muted">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 8 — CTA */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-card border border-border bg-card p-8 text-center sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Ready to Get Your Real ATS Score?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
              Join 2,000+ students improving their resumes and landing jobs at top companies.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-button bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 text-sm font-semibold text-text-muted">
              No credit card required · Free forever
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FOOTER */}
      <Footer />
    </div>
  )
}
