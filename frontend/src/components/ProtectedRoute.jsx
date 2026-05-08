import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [status, setStatus] = useState({ loading: true, authed: false })

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        const authed = Boolean(data?.session?.user)
        if (mounted) setStatus({ loading: false, authed })
      } catch {
        if (mounted) setStatus({ loading: false, authed: false })
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  if (status.loading) {
    return (
      <div className="min-h-[60vh] px-6 py-10">
        <LoadingSpinner label="Checking your session..." />
      </div>
    )
  }

  if (!status.authed) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}
