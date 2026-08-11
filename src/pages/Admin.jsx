import { useEffect, useState } from 'react'
import { ShieldCheck, Power, CheckCircle2, XCircle } from 'lucide-react'
import { api } from '../api'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { Section, TextArea } from '../components/Form'

export default function Admin() {
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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO title="Admin" description="Site administration." path="/admin" noindex />
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-2">Admin</p>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Site administration</h1>
        <p className="text-sm text-[var(--mist-dim)] mb-8">
          This only affects the website — the bot keeps moderating your servers normally either way.
        </p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {!status && !error && <p className="text-sm text-[var(--mist-dim)]">Loading...</p>}

        {status && (
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
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
