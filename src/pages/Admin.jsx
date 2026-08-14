import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Power, CheckCircle2, XCircle, Megaphone, Users2, ShieldOff,
  Search, ChevronRight, LogOut, X as XIcon, Activity, RotateCcw,
} from 'lucide-react'
import { api } from '../api'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { Section, TextArea } from '../components/Form'

function MaintenanceSection() {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    api
      .maintenanceStatus()
      .then((s) => {
        setStatus(s)
        setMessage(s.message)
      })
      .catch((e) => setError(e.message))
  }, [])

  async function toggle(enabled) {
    setSaving(true)
    setSaveError(null)
    setResult(null)
    try {
      const updated = await api.setMaintenance(enabled, message)
      setStatus({ enabled: updated.maintenance_enabled, message: updated.maintenance_message })
      setResult(updated)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>
  if (!status) return <p className="text-sm text-[var(--mist-dim)]">Loading...</p>

  return (
    <Section title="Maintenance mode" icon={ShieldCheck}>
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm text-white">Current status</p>
          <p className="text-xs text-[var(--mist-dim)] mt-0.5">
            {status.enabled ? 'Site is showing the maintenance page to everyone but admins.' : 'Site is live.'}
          </p>
        </div>
        <span
          className={`font-mono text-[11px] font-medium px-2.5 py-1 rounded-full ${
            status.enabled ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
          }`}
        >
          {status.enabled ? 'MAINTENANCE ON' : 'LIVE'}
        </span>
      </div>

      <div className="py-3">
        <span className="block text-sm text-white mb-1.5">Message shown to visitors</span>
        <TextArea value={message} onChange={setMessage} maxLength={300} rows={3} />
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          onClick={() => toggle(true)}
          disabled={saving}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-amber-500/90 hover:brightness-110 disabled:opacity-50 transition-all text-[#1a1000] text-sm font-semibold px-4 py-2"
        >
          <Power className="w-4 h-4" strokeWidth={2.25} />
          Turn maintenance ON
        </button>
        <button
          onClick={() => toggle(false)}
          disabled={saving}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 disabled:opacity-50 border border-[var(--line)] transition-all text-white text-sm font-medium px-4 py-2"
        >
          Turn OFF
        </button>
      </div>

      {result && (
        <p className="flex items-center gap-1.5 text-xs mt-3 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.25} />
          Saved — updated by {result.updated_by}.
        </p>
      )}
      {saveError && (
        <p className="flex items-center gap-1.5 text-xs mt-3 text-red-400">
          <XCircle className="w-3.5 h-3.5" strokeWidth={2.25} />
          {saveError}
        </p>
      )}
    </Section>
  )
}

function AnnouncementSection() {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    api
      .announcementStatus()
      .then((s) => {
        setStatus(s)
        setMessage(s.message)
      })
      .catch((e) => setError(e.message))
  }, [])

  async function toggle(enabled) {
    setSaving(true)
    setSaveError(null)
    setResult(null)
    try {
      const updated = await api.setAnnouncement(enabled, message)
      setStatus({ enabled: updated.announcement_enabled, message: updated.announcement_message })
      setResult(updated)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>
  if (!status) return <p className="text-sm text-[var(--mist-dim)]">Loading...</p>

  return (
    <Section title="Announcement banner" icon={Megaphone} description="A dismissible banner across the top of every page — lighter than maintenance mode">
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-white">Current status</p>
        <span
          className={`font-mono text-[11px] font-medium px-2.5 py-1 rounded-full ${
            status.enabled ? 'bg-[var(--py-blue)]/10 text-[var(--py-blue)]' : 'bg-[var(--line)] text-[var(--mist-dim)]'
          }`}
        >
          {status.enabled ? 'SHOWING' : 'HIDDEN'}
        </span>
      </div>

      <div className="py-3">
        <span className="block text-sm text-white mb-1.5">Banner message</span>
        <TextArea value={message} onChange={setMessage} maxLength={200} rows={2} placeholder="e.g. Leveling and Starboard are now live!" />
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          onClick={() => toggle(true)}
          disabled={saving || !message.trim()}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
        >
          <Megaphone className="w-4 h-4" strokeWidth={2.25} />
          Show banner
        </button>
        <button
          onClick={() => toggle(false)}
          disabled={saving}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 disabled:opacity-50 border border-[var(--line)] transition-all text-white text-sm font-medium px-4 py-2"
        >
          Hide
        </button>
      </div>

      {result && (
        <p className="flex items-center gap-1.5 text-xs mt-3 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.25} />
          Saved — updated by {result.updated_by}.
        </p>
      )}
      {saveError && (
        <p className="flex items-center gap-1.5 text-xs mt-3 text-red-400">
          <XCircle className="w-3.5 h-3.5" strokeWidth={2.25} />
          {saveError}
        </p>
      )}
    </Section>
  )
}

function GuildsOverviewSection() {
  const [guilds, setGuilds] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [confirmingLeave, setConfirmingLeave] = useState(null)
  const [leaveBusy, setLeaveBusy] = useState(null)
  const [leaveError, setLeaveError] = useState(null)

  useEffect(() => {
    api.adminGuilds().then(setGuilds).catch((e) => setError(e.message))
  }, [])

  async function confirmLeave(guildId) {
    setLeaveBusy(guildId)
    setLeaveError(null)
    try {
      await api.adminLeaveGuild(guildId)
      setGuilds((list) => list.filter((g) => g.id !== guildId))
      setConfirmingLeave(null)
    } catch (e) {
      setLeaveError(e.message)
    } finally {
      setLeaveBusy(null)
    }
  }

  const filtered = guilds?.filter((g) => g.name.toLowerCase().includes(query.toLowerCase())) ?? null
  const protectedCount = guilds?.filter((g) => g.protection_enabled).length ?? 0

  return (
    <Section
      title="All servers"
      icon={Users2}
      description="Every server PySecured is currently in — click into any of them to manage its full settings, whether or not you personally admin it in Discord."
    >
      {error && <p className="text-sm text-red-400 py-2">{error}</p>}
      {!guilds && !error && <p className="text-sm text-[var(--mist-dim)] py-2">Loading...</p>}

      {guilds && (
        <>
          <div className="grid grid-cols-2 gap-3 py-3">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
              <p className="font-mono text-lg text-white leading-none">{guilds.length}</p>
              <p className="text-[10px] text-[var(--mist-dim)] mt-1">servers</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
              <p className="font-mono text-lg text-white leading-none">
                {protectedCount}<span className="text-[var(--mist-dim)] text-sm"> / {guilds.length}</span>
              </p>
              <p className="text-[10px] text-[var(--mist-dim)] mt-1">protected</p>
            </div>
          </div>

          <div className="relative py-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search servers..."
              className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white pl-9 pr-3 py-2 field-focus"
            />
          </div>

          {leaveError && <p className="text-sm text-red-400 py-2">{leaveError}</p>}

          <div className="divide-y divide-[var(--line)]">
            {filtered.length === 0 && <p className="text-xs text-[var(--mist-dim)] py-3">No servers match "{query}".</p>}
            {filtered.map((g) => (
              <div key={g.id} className="py-2.5 flex items-center gap-3">
                {g.icon ? (
                  <img src={g.icon} alt="" className="w-7 h-7 rounded-full shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--line)] shrink-0" />
                )}
                <Link to={`/servers/${g.id}`} className="flex items-center gap-2 flex-1 min-w-0 group">
                  <span className="text-sm text-white truncate group-hover:text-[var(--py-blue)] transition-colors">{g.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--mist-dim)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                </Link>
                <span className="font-mono text-xs text-[var(--mist-dim)] shrink-0">{g.member_count} members</span>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    g.protection_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--line)] text-[var(--mist-dim)]'
                  }`}
                >
                  {g.protection_enabled ? <ShieldCheck className="w-2.5 h-2.5" strokeWidth={2.5} /> : <ShieldOff className="w-2.5 h-2.5" strokeWidth={2.5} />}
                  {g.protection_enabled ? 'PROTECTED' : 'OFF'}
                </span>

                {confirmingLeave === g.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => confirmLeave(g.id)}
                      disabled={leaveBusy === g.id}
                      className="press rounded-lg bg-red-500/90 hover:brightness-110 disabled:opacity-50 transition-all text-white text-xs font-medium px-2.5 py-1.5"
                    >
                      {leaveBusy === g.id ? 'Leaving...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmingLeave(null)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-white transition-colors"
                    >
                      <XIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingLeave(g.id)}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                    title="Remove PySecured from this server"
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Section>
  )
}

function StatusOverrideSection() {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(null)
  const [editing, setEditing] = useState(null)
  const [draftStatus, setDraftStatus] = useState('degraded')
  const [draftNote, setDraftNote] = useState('')

  const OPTIONS = [
    { value: 'operational', label: 'Operational', dot: 'bg-emerald-500' },
    { value: 'degraded', label: 'Degraded', dot: 'bg-amber-500' },
    { value: 'down', label: 'Down', dot: 'bg-red-500' },
    { value: 'critical', label: 'Critical', dot: 'bg-red-600' },
    { value: 'maintenance', label: 'Maintenance', dot: 'bg-[var(--py-blue)]' },
  ]

  async function load() {
    try {
      setStatus(await api.status())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function apply(component, newStatus, note) {
    setBusy(component)
    setError(null)
    try {
      await api.setStatusOverride(component, newStatus, note || '')
      await load()
      setEditing(null)
      setDraftNote('')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <Section
      title="Status page overrides"
      icon={Activity}
      description="Every component is detected automatically. An override only changes what visitors see — detection keeps running underneath, and you can hand any component back to it at any time."
    >
      {error && <p className="text-sm text-red-400 py-2">{error}</p>}
      {!status && !error && <p className="text-sm text-[var(--mist-dim)] py-2">Loading...</p>}

      {status && (
        <div className="divide-y divide-[var(--line)]">
          {status.components.map((c) => (
            <div key={c.name} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{c.name}</p>
                  <p className="text-xs text-[var(--mist-dim)] mt-0.5">
                    {c.overridden ? (
                      <>
                        Showing <span className="text-amber-400">{c.status}</span> · detected{' '}
                        <span className="text-[var(--mist)]">{c.detected_status}</span>
                      </>
                    ) : (
                      <>Automatic · {c.status}</>
                    )}
                  </p>
                  {c.override_note && (
                    <p className="text-xs text-[var(--mist)] mt-1 italic">"{c.override_note}"</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {c.overridden && (
                    <button
                      onClick={() => apply(c.name, null, '')}
                      disabled={busy === c.name}
                      title="Hand back to automatic detection"
                      className="press inline-flex items-center gap-1 rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-white transition-colors text-xs px-2.5 py-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                      Auto
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditing(editing === c.name ? null : c.name)
                      setDraftStatus(c.overridden ? c.status : 'degraded')
                      setDraftNote(c.override_note || '')
                    }}
                    className="press rounded-lg bg-[var(--bg-raised)] hover:brightness-125 border border-[var(--line)] transition-all text-white text-xs font-medium px-2.5 py-1.5"
                  >
                    {editing === c.name ? 'Cancel' : 'Override'}
                  </button>
                </div>
              </div>

              {editing === c.name && (
                <div className="mt-3 rounded-lg border border-[var(--line)] p-3 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setDraftStatus(o.value)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                          draftStatus === o.value
                            ? 'border-[var(--py-blue)] text-white'
                            : 'border-[var(--line)] text-[var(--mist-dim)] hover:text-[var(--mist)]'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${o.dot}`} />
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <input
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    maxLength={200}
                    placeholder="Optional note shown on the status page"
                    className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                  />
                  <button
                    onClick={() => apply(c.name, draftStatus, draftNote)}
                    disabled={busy === c.name}
                    className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-xs font-semibold px-3 py-1.5"
                  >
                    {busy === c.name ? 'Saving...' : 'Apply override'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

export default function Admin() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO title="Admin" description="Site administration." path="/admin" noindex />
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Site administration</h1>
        <p className="text-sm text-[var(--mist-dim)] mb-8">
          Maintenance and the announcement banner only affect the website — the bot keeps
          moderating servers normally either way. As an admin, you can also open and manage
          the full settings for any server below, whether or not you personally admin it in Discord.
        </p>

        <MaintenanceSection />
        <AnnouncementSection />
        <StatusOverrideSection />
        <GuildsOverviewSection />
      </main>

      <SiteFooter />
    </div>
  )
}
