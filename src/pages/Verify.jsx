import { useEffect, useState } from 'react'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import SEO from '../components/SEO'
import { API_BASE } from '../api'

export default function Verify() {
  const [error, setError] = useState(null)

  useEffect(() => {
    const guild = new URLSearchParams(window.location.search).get('guild')
    if (!guild) {
      setError("This link is missing its server. Head back to Discord and click Verify again.")
      return
    }
    // Straight into the bot's OAuth start endpoint — this page exists so the
    // link people see is on the real site rather than a bare API domain.
    window.location.replace(`${API_BASE}/verify/start?guild=${encodeURIComponent(guild)}`)
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden flex items-center justify-center px-6">
      <SEO title="Verify" description="Verify your Discord account." path="/verify" noindex />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--py-blue)] blur-[130px] animate-glow opacity-30"
      />
      <div className="relative text-center max-w-md">
        {error ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--bg-raised)]/80 border border-[var(--line)] mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-400" strokeWidth={1.75} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Can't verify from here</h1>
            <p className="text-sm text-[var(--mist)]">{error}</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--bg-raised)]/80 border border-[var(--line)] mb-6">
              <ShieldCheck className="w-8 h-8 text-[var(--py-blue)] animate-slow-spin" strokeWidth={1.75} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Taking you to Discord…</h1>
            <p className="text-sm text-[var(--mist)]">
              You'll be asked to approve sign-in, then sent straight back. This only takes a moment.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
