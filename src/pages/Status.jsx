import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { api } from '../api'

const REFRESH_MS = 20000

const OVERALL_COPY = {
  operational: { label: 'All Systems Operational', dot: 'bg-emerald-500', text: 'text-emerald-400', ring: 'border-emerald-500/30 bg-emerald-500/5' },
  degraded: { label: 'Degraded Performance', dot: 'bg-amber-500', text: 'text-amber-400', ring: 'border-amber-500/30 bg-amber-500/5' },
  down: { label: 'Major Outage', dot: 'bg-red-500', text: 'text-red-400', ring: 'border-red-500/30 bg-red-500/5' },
}

const COMPONENT_DOT = {
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  stopped: 'bg-amber-500',
  down: 'bg-red-500',
  not_configured: 'bg-[var(--mist-dim)]',
}

const COMPONENT_LABEL = {
  operational: 'Operational',
  degraded: 'Degraded',
  stopped: 'Stopped',
  down: 'Down',
  not_configured: 'Not configured',
}

function formatUptime(seconds) {
  if (seconds == null) return '—'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function Status() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)
  const timerRef = useRef(null)

  async function load() {
    try {
      const result = await api.status()
      setData(result)
      setError(null)
      setLastFetched(new Date())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, REFRESH_MS)
    return () => clearInterval(timerRef.current)
  }, [])

  const overall = data ? OVERALL_COPY[data.overall] ?? OVERALL_COPY.degraded : null

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Status"
        description="Live status for PySecured — Discord gateway connection, dashboard API, and every subsystem, updated automatically."
        path="/status"
      />
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">Status</p>
        <h1 className="font-display text-2xl font-bold text-white mb-1">System status</h1>
        <p className="text-sm text-[var(--mist-dim)] mb-8">
          Read live off the running bot — refreshes automatically every {REFRESH_MS / 1000}s.
        </p>

        {error && !data && <p className="text-sm text-red-400">{error}</p>}

        {!data && !error && <p className="text-sm text-[var(--mist-dim)]">Loading...</p>}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
            <span className="text-sm font-medium text-red-400">
              Can't reach the status API right now{data ? ' — showing last known state below' : ''}.
            </span>
          </div>
        )}

        {data && (
          <>
            <div className={`rounded-xl border ${overall.ring} px-5 py-4 flex items-center gap-3 mb-6`}>
              <span className={`w-2.5 h-2.5 rounded-full ${overall.dot} shrink-0`} />
              <span className={`text-sm font-medium ${overall.text}`}>{overall.label}</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-4">
                <p className="text-xs text-[var(--mist-dim)] mb-1">Gateway latency</p>
                <p className="font-mono text-lg text-white">
                  {data.bot.latency_ms != null ? `${data.bot.latency_ms} ms` : '—'}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-4">
                <p className="text-xs text-[var(--mist-dim)] mb-1">Servers</p>
                <p className="font-mono text-lg text-white">{data.bot.guild_count ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-4">
                <p className="text-xs text-[var(--mist-dim)] mb-1">Uptime</p>
                <p className="font-mono text-lg text-white">{formatUptime(data.bot.uptime_seconds)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 divide-y divide-[var(--line)] overflow-hidden mb-6">
              {data.components.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-white">{c.name}</span>
                  <div className="flex items-center gap-2">
                    {c.detail && <span className="font-mono text-xs text-[var(--mist-dim)]">{c.detail}</span>}
                    <span className={`w-2 h-2 rounded-full ${COMPONENT_DOT[c.status]}`} />
                    <span className="text-xs text-[var(--mist-dim)] w-24 text-right">{COMPONENT_LABEL[c.status] ?? c.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-[var(--mist-dim)] text-center">
              {lastFetched ? <>Last checked {lastFetched.toLocaleTimeString()}</> : null}
            </p>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
