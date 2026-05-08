import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:items-start">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-button px-2 py-1 transition hover:bg-white/5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-button bg-primary/15 text-primary ring-1 ring-primary/25">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-text-primary">CrackWithAI</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-text-muted">
            Built for students, by a student.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-center">
          <a href="/#features" className="text-sm font-semibold text-text-muted transition hover:text-text-primary">
            Features
          </a>
          <a href="/#how-it-works" className="text-sm font-semibold text-text-muted transition hover:text-text-primary">
            How It Works
          </a>
          <Link to="/signin" className="text-sm font-semibold text-text-muted transition hover:text-text-primary">
            Sign In
          </Link>
          <Link to="/signup" className="text-sm font-semibold text-text-muted transition hover:text-text-primary">
            Sign Up
          </Link>
        </div>

        <div className="text-sm leading-relaxed text-text-muted md:text-right">
          <div>© 2025 CrackWithAI · Built by Sai Sanketh Reddy Battula · MS IT, ASU GPA 3.9</div>
        </div>
      </div>
    </footer>
  )
}
