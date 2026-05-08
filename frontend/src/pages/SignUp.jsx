import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function strengthLabel(password) {
  if (!password) return { label: 'Weak', color: 'text-danger', score: 0 }
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const len = password.length
  const score = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length + (len >= 10 ? 1 : 0)

  if (len < 8 || score <= 2) return { label: 'Weak', color: 'text-danger', score: 1 }
  if (score <= 4) return { label: 'Medium', color: 'text-warning', score: 2 }
  return { label: 'Strong', color: 'text-success', score: 3 }
}

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const strength = useMemo(() => strengthLabel(password), [password])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!email.trim()) return setError('Please enter your email.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setSubmitting(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      })
      if (signUpError) throw signUpError
      setSuccess('Success! Please check your email to verify your account.')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err?.message || 'Sign up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto flex max-w-7xl px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-card border border-border bg-card p-6 shadow-glow sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-text-muted">
              Free forever. Build a better resume and a plan you can follow.
            </p>

            {error ? (
              <div className="mt-5 rounded-card border border-danger/50 bg-danger/10 p-4 text-sm text-danger">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="mt-5 rounded-card border border-success/40 bg-success/10 p-4 text-sm text-success">
                {success}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-text-muted">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                  placeholder="Sai Sanketh Battula"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-text-muted">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-text-muted">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={[
                        'h-full rounded-full transition-all',
                        strength.score === 0
                          ? 'w-0'
                          : strength.score === 1
                            ? 'w-1/3 bg-danger'
                            : strength.score === 2
                              ? 'w-2/3 bg-warning'
                              : 'w-full bg-success',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={['text-xs font-semibold', strength.color].join(' ')}>
                    {strength.label}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-text-muted">Confirm Password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-button border border-border bg-bg/40 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary"
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={[
                  'inline-flex w-full items-center justify-center rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition',
                  submitting ? 'opacity-70' : 'hover:bg-accent',
                ].join(' ')}
              >
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold text-primary transition hover:text-accent">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
