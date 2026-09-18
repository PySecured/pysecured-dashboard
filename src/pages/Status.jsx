import { useEffect, useRef, useState } from 'react'
import { Wifi, Server, ShieldCheck, Settings2, Ticket, UserPlus, Clock, Cloud, Gauge, Users2, Timer, Gavel, Trophy, Star, Gift, Info } from 'lucide-react'
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
  critical: 'bg-red-600',
  maintenance: 'bg-[var(--py-blue)]',
  not_configured: 'bg-[var(--mist-dim)]',
}

const COMPONENT_LABEL = {
  operational: 'Operational',
  degraded: 'Degraded',
  stopped: 'Stopped',
  down: 'Down',
  critical: 'Critical',
  maintenance: 'Maintenance',
  not_configured: 'Not configured',
}

const COMPONENT_ICON = {
  'Discord Gateway': Wifi,
  'Dashboard API': Server,
  'Moderation Engine': ShieldCheck,
  'Moderation Commands': Gavel,
  'Setup & Configuration': Settings2,
  'Ticket System': Ticket,
  'Welcome & Auto Role': UserPlus,
  'Leveling': Trophy,
  'Starboard': Star,
  'Giveaways': Gift,
  'Scheduled Unbans': Clock,
  'Cloudflare Tunnel': Cloud,
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

  // "not_configured" counts as fine — an unused optional component isn't a
  // fault, and counting it as one would make a healthy bot look broken.
  const comps = data?.components ?? []
  const healthy = comps.filter((c) => c.status === 'operational' || c.status === 'not_configured').length
  const degradedCount = comps.filter((c) => c.status === 'degraded' || c.status === 'stopped' || c.status === 'maintenance').length
  const downCount = comps.filter((c) => c.status === 'down' || c.status === 'critical').length

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Status"
        description="Live status for PySecured — Discord gateway connection, dashboard API, and every subsystem, updated automatically."
        path="/status"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white">System status</h1>
            <p className="text-sm text-[var(--mist-dim)] mt-1.5">
              Read live off the running bot, not a cached page.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 pb-1">
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--py-blue)] opacity-60" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[var(--py-blue)]" />
            </span>
            <span className="text-[11px] text-[var(--mist-dim)]">
              Live · every {REFRESH_MS / 1000}s
            </span>
          </div>
        </div>

        {error && !data && <p className="text-sm text-red-400">{error}</p>}

        {!data && !error && (
          <div className="space-y-6">
            <div className="skeleton h-14 rounded-xl" />
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="skeleton h-20 rounded-xl" />
              <div className="skeleton h-20 rounded-xl" />
              <div className="skeleton h-20 rounded-xl" />
            </div>
            <div className="skeleton h-64 rounded-xl" />
          </div>
        )}

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
            <div className={`rounded-2xl border ${overall.ring} px-5 sm:px-6 py-5 mb-4`}>
              <div className="flex items-center gap-3">
                <span className="relative flex w-3 h-3 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${overall.dot} opacity-60`} />
                  <span className={`relative inline-flex rounded-full w-3 h-3 ${overall.dot}`} />
                </span>
                <span className={`font-display text-lg sm:text-xl font-bold ${overall.text}`}>{overall.label}</span>
              </div>
              <p className="text-xs text-[var(--mist-dim)] mt-2 pl-6">
                {healthy} of {data.components.length} components operational
                {degradedCount > 0 && ` · ${degradedCount} degraded`}
                {downCount > 0 && ` · ${downCount} down`}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="surface rounded-xl border border-[var(--line)] p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                  <p className="text-xs text-[var(--mist-dim)]">Gateway latency</p>
                </div>
                <p className="font-mono text-lg text-white">
                  {data.bot.latency_ms != null ? `${data.bot.latency_ms} ms` : '—'}
                </p>
              </div>
              <div className="surface rounded-xl border border-[var(--line)] p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users2 className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                  <p className="text-xs text-[var(--mist-dim)]">Servers</p>
                </div>
                <p className="font-mono text-lg text-white">{data.bot.guild_count ?? '—'}</p>
              </div>
              <div className="surface rounded-xl border border-[var(--line)] p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users2 className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                  <p className="text-xs text-[var(--mist-dim)]">Members</p>
                </div>
                <p className="font-mono text-lg text-white">
                  {data.bot.member_count != null ? data.bot.member_count.toLocaleString() : '—'}
                </p>
              </div>
              <div className="surface rounded-xl border border-[var(--line)] p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Timer className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                  <p className="text-xs text-[var(--mist-dim)]">Uptime</p>
                </div>
                <p className="font-mono text-lg text-white">{formatUptime(data.bot.uptime_seconds)}</p>
              </div>
            </div>

            <p className="eyebrow mb-3">Components</p>
            <div className="surface rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden mb-6">
              {data.components.map((c) => {
                const Icon = COMPONENT_ICON[c.name]
                return (
                  <div
                    key={c.name}
                    className="relative px-4 sm:px-5 py-3 transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Left edge bar makes state scannable without reading labels */}
                    <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${COMPONENT_DOT[c.status]} opacity-70`} />
                    <div className="flex items-center justify-between gap-2 pl-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {Icon && <Icon className="w-4 h-4 text-[var(--mist-dim)] shrink-0" strokeWidth={2} />}
                        <span className="text-sm text-white truncate">{c.name}</span>
                        {c.overridden && (
                          <span className="hidden sm:inline text-[10px] font-mono text-[var(--py-blue)] border border-[var(--py-blue)]/25 rounded px-1.5 py-0.5 shrink-0">
                            MANUAL
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        {c.detail && <span className="font-mono text-[11px] text-[var(--mist-dim)]">{c.detail}</span>}
                        <span className={`text-xs w-20 sm:w-24 text-right ${
                          c.status === 'operational' ? 'text-[var(--mist-dim)]' : 'text-white'
                        }`}>
                          {COMPONENT_LABEL[c.status] ?? c.status}
                        </span>
                      </div>
                    </div>
                    {c.override_note && (
                      <p className="flex items-start gap-1.5 text-xs text-[var(--mist)] mt-2 pl-8">
                        <Info className="w-3 h-3 shrink-0 mt-0.5 text-[var(--py-blue)]" strokeWidth={2} />
                        {c.override_note}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--mist-dim)]">
              <span>
                {lastFetched ? `Last checked ${lastFetched.toLocaleTimeString()}` : ''}
                {data.bot.version && (
                  <> · <span className="font-mono">v{data.bot.version}</span></>
                )}
              </span>
              <span>Components marked MANUAL have a status set by an admin.</span>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
