import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from || '/dashboard'

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email.')
    if (!password) return setError('Please enter your password.')

    setSubmitting(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.message || 'Sign in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function onForgotPassword(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Enter your email first, then click Forgot password.')
    setSubmitting(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (resetError) throw resetError
      setError('Password reset email sent. Please check your inbox.')
    } catch (err) {
      setError(err?.message || 'Could not send reset email. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isResetNote = error.toLowerCase().includes('reset')

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto flex max-w-7xl px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-card border border-border bg-card p-6 shadow-glow sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-text-muted">
              Sign in to continue your ATS analysis and learning plan.
            </p>

            {error ? (
              <div
                className={[
                  'mt-5 rounded-card border p-4 text-sm',
                  isResetNote
                    ? 'border-success/40 bg-success/10 text-success'
                    : 'border-danger/50 bg-danger/10 text-danger',
                ].join(' ')}
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                  placeholder="Your password"
                  autoComplete="current-password"
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
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <button
                onClick={onForgotPassword}
                className="font-semibold text-text-muted transition hover:text-text-primary"
              >
                Forgot password
              </button>
              <div className="text-text-muted">
                New here?{' '}
                <Link to="/signup" className="font-semibold text-primary transition hover:text-accent">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
