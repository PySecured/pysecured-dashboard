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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[var(--py-blue)] blur-[190px] opacity-[0.10] animate-glow"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/4 w-[380px] h-[380px] rounded-full bg-[var(--accent-violet)] blur-[170px] opacity-[0.07] animate-glow"
        style={{ animationDelay: '2s' }}
      />
      {/* Faint grid — adds structure without lifting the overall brightness */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative max-w-lg w-full text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--bg-raised)]/70 border border-[var(--line)] mb-8">
          <div aria-hidden className="absolute inset-0 rounded-2xl bg-[var(--py-blue)]/5" />
          <Settings2 className="relative w-9 h-9 text-[var(--py-blue)]/80 animate-slow-spin" strokeWidth={1.5} />
        </div>

        <p className="font-mono text-[11px] tracking-[0.25em] text-[var(--mist-dim)] uppercase mb-4">
          Under maintenance
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] mb-4 text-[var(--mist)]">
          We'll be right back.
        </h1>
        <p className="text-[var(--mist-dim)] text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto">
          {message}
        </p>

        <div className="relative h-[3px] rounded-full bg-white/[0.04] overflow-hidden mb-6">
          <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[var(--py-blue)]/60 to-transparent animate-scan-sweep" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--mist-dim)]/70 mb-8">
          <Radio className={`w-3 h-3 ${checking ? 'text-[var(--py-blue)]/70' : 'text-[var(--mist-dim)]/50'}`} strokeWidth={2} />
          <span>Checking automatically — no need to refresh.</span>
        </div>

        <a
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--mist-dim)] hover:text-[var(--py-blue)] transition-colors"
        >
          Updates in the Discord →
        </a>
      </div>
    </div>
  )
}
