import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Settings2, Radio } from 'lucide-react'
import { api } from '../api'
import { DISCORD_SUPPORT_URL } from '../config'

const RECHECK_MS = 15000

export default function MaintenancePage({ message, onResolved }) {
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const timer = setInterval(async () => {
      setChecking(true)
      try {
        const status = await api.maintenanceStatus()
        if (!status.enabled) {
          onResolved()
        }
      } catch {
        // stay on this page, just try again next tick
      } finally {
        setChecking(false)
      }
    }, RECHECK_MS)
    return () => clearInterval(timer)
  }, [onResolved])

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <Helmet>
        <title>Under Maintenance — PySecured</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--py-blue)] blur-[140px] animate-glow opacity-40"
      />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--accent-violet)] blur-[130px] animate-glow opacity-25"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="relative max-w-lg w-full text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--bg-raised)]/80 border border-[var(--line)] mb-8">
          <Settings2 className="w-9 h-9 text-[var(--py-blue)] animate-slow-spin" strokeWidth={1.75} />
        </div>

        <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-4">
          Under maintenance
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] mb-4">
          <span className="bg-gradient-to-r from-[var(--py-blue)] to-[var(--accent-violet)] bg-clip-text text-transparent">
            We'll be right back.
          </span>
        </h1>
        <p className="text-[var(--mist)] text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto">
          {message}
        </p>

        <div className="relative h-1 rounded-full bg-[var(--bg-raised)] border border-[var(--line)] overflow-hidden mb-6">
          <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-[var(--py-blue)] to-[var(--accent-violet)] animate-scan-sweep" />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[var(--mist-dim)] mb-8">
          <Radio className={`w-3.5 h-3.5 ${checking ? 'text-[var(--py-blue)]' : 'text-[var(--mist-dim)]'}`} strokeWidth={2} />
          <span>Checking automatically — this page updates itself, no need to refresh.</span>
        </div>

        <a
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--py-blue)] hover:underline"
        >
          Updates in the Discord →
        </a>
      </div>
    </div>
  )
}
