import { useEffect, useState } from 'react'
import { ShieldCheck, Power, CheckCircle2, XCircle, Megaphone, Users2, ShieldOff } from 'lucide-react'
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

  useEffect(() => {
    api.adminGuilds().then(setGuilds).catch((e) => setError(e.message))
  }, [])

  return (
    <Section title="All servers" icon={Users2} description="Every server PySecured is currently in — for support and oversight, not just the ones you personally admin">
      {error && <p className="text-sm text-red-400 py-2">{error}</p>}
      {!guilds && !error && <p className="text-sm text-[var(--mist-dim)] py-2">Loading...</p>}
      {guilds && (
        <div className="divide-y divide-[var(--line)]">
          {guilds.map((g) => (
            <div key={g.id} className="py-2.5 flex items-center gap-3">
              {g.icon ? (
                <img src={g.icon} alt="" className="w-7 h-7 rounded-full shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--line)] shrink-0" />
              )}
              <span className="text-sm text-white flex-1 truncate">{g.name}</span>
              <span className="font-mono text-xs text-[var(--mist-dim)] shrink-0">{g.member_count} members</span>
              <span
                className={`inline-flex items-center gap-1 font-mono text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                  g.protection_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--line)] text-[var(--mist-dim)]'
                }`}
              >
                {g.protection_enabled ? <ShieldCheck className="w-2.5 h-2.5" strokeWidth={2.5} /> : <ShieldOff className="w-2.5 h-2.5" strokeWidth={2.5} />}
                {g.protection_enabled ? 'PROTECTED' : 'OFF'}
              </span>
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
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-2">Admin</p>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Site administration</h1>
        <p className="text-sm text-[var(--mist-dim)] mb-8">
          These only affect the website — the bot keeps moderating your servers normally either way.
        </p>

        <MaintenanceSection />
        <AnnouncementSection />
        <GuildsOverviewSection />
      </main>

      <SiteFooter />
    </div>
  )
}
