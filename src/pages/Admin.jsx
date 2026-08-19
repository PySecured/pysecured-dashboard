import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Power, CheckCircle2, XCircle, Megaphone, Users2, ShieldOff,
  Search, ChevronRight, LogOut, X as XIcon, Activity, RotateCcw, Eye, CreditCard, FlaskConical, Stethoscope,
  Crown, UserSearch, Settings2, Plus, Trash2, Infinity as InfinityIcon,
} from 'lucide-react'
import { api } from '../api'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { Section, TextArea } from '../components/Form'
import Badges from '../components/Badges'

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

function PremiumSection() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(null)
  const [result, setResult] = useState(null)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ user_id: '', plan: 'monthly', days: 30 })

  async function load() {
    try { setData(await api.adminPremium()) } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  async function grant() {
    setBusy('grant'); setError(null); setResult(null)
    try {
      const res = await api.grantPremium({
        user_id: form.user_id.trim(),
        plan: form.plan,
        days: Number(form.days) || 30,
      })
      setResult(res.note || 'Premium granted and the role applied.')
      setForm((f) => ({ ...f, user_id: '' }))
      await load()
    } catch (e) { setError(e.message) } finally { setBusy(null) }
  }

  async function revoke(userId) {
    setBusy(userId); setError(null); setResult(null)
    try {
      const res = await api.revokePremium(userId)
      setResult(res.note || 'Premium removed.')
      await load()
    } catch (e) { setError(e.message) } finally { setBusy(null) }
  }

  const filtered = data?.entries.filter(
    (e) => !query || (e.username || '').toLowerCase().includes(query.toLowerCase()) || e.user_id.includes(query.trim())
  ) ?? []

  return (
    <>
      <Section title="Grant premium" icon={Plus} description="Applies the Discord role and records the subscription together, so the dashboard and Discord always agree.">
        <div className="grid sm:grid-cols-2 gap-4 py-3">
          <div>
            <span className="block text-sm text-white mb-1.5">Discord user ID</span>
            <input
              value={form.user_id}
              onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
              placeholder="123456789012345678"
              className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
            />
          </div>
          <div>
            <span className="block text-sm text-white mb-1.5">Duration</span>
            <select
              value={form.plan}
              onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
              className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
            >
              <option value="monthly">Monthly — 30 days</option>
              <option value="quarterly">Three months — 90 days</option>
              <option value="lifetime">Lifetime — permanent</option>
              <option value="custom">Custom…</option>
            </select>
          </div>
        </div>

        {form.plan === 'custom' && (
          <div className="pb-3">
            <span className="block text-sm text-white mb-1.5">Days</span>
            <input
              type="number" min={1} max={3650}
              value={form.days}
              onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
              className="w-32 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
            />
          </div>
        )}

        <button
          onClick={grant}
          disabled={busy === 'grant' || !form.user_id.trim()}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-yellow)] hover:brightness-110 disabled:opacity-40 transition-all text-[#2a1c00] text-sm font-semibold px-4 py-2"
        >
          <Crown className="w-4 h-4" strokeWidth={2.25} />
          {busy === 'grant' ? 'Granting…' : 'Grant premium'}
        </button>

        {result && <p className="text-xs text-emerald-400 mt-3">{result}</p>}
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        <p className="text-xs text-[var(--mist-dim)] mt-3">
          Granting again extends existing time rather than replacing it. If they aren't in the
          support server yet, the role applies automatically when they join.
        </p>
      </Section>

      <Section
        title="Premium members"
        icon={Crown}
        description={data ? `${data.active_count} active` : 'Loading…'}
      >
        {!data?.role_configured && (
          <p className="text-xs text-amber-400 py-2">
            The premium role isn't configured, so roles can't be applied or removed from here.
          </p>
        )}

        {data && (
          <>
            <div className="relative py-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or ID…"
                className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white pl-9 pr-3 py-2 field-focus"
              />
            </div>

            <div className="divide-y divide-[var(--line)]">
              {filtered.length === 0 && (
                <p className="text-xs text-[var(--mist-dim)] py-3">
                  {query ? 'Nobody matches that.' : 'No premium members yet.'}
                </p>
              )}
              {filtered.map((e) => (
                <div key={e.user_id} className="py-3 flex items-center gap-3">
                  {e.avatar ? (
                    <img src={e.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">
                      {e.username || <span className="font-mono text-xs">{e.user_id}</span>}
                    </p>
                    <p className="text-[11px] text-[var(--mist-dim)]">
                      {e.lifetime ? (
                        <span className="inline-flex items-center gap-1">
                          <InfinityIcon className="w-3 h-3" strokeWidth={2.25} /> Lifetime
                        </span>
                      ) : e.expires_at ? (
                        `Until ${new Date(e.expires_at).toLocaleDateString()}`
                      ) : e.source === 'role_only' ? (
                        'Role only — no subscription record'
                      ) : 'No expiry set'}
                      {!e.in_server && ' · not in server'}
                      {e.source === 'subscription' && !e.has_role && e.in_server && ' · role missing'}
                    </p>
                  </div>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    e.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--line)] text-[var(--mist-dim)]'
                  }`}>
                    {e.active ? 'ACTIVE' : 'ENDED'}
                  </span>
                  <button
                    onClick={() => revoke(e.user_id)}
                    disabled={busy === e.user_id}
                    title="Remove premium"
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  )
}

function LookupSection() {
  const [id, setId] = useState('')
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function run() {
    if (!id.trim()) return
    setBusy(true); setError(null); setRes(null)
    try { setRes(await api.adminLookup(id.trim())) }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  return (
    <Section
      title="User lookup"
      icon={UserSearch}
      description="Paste a Discord user ID to see their badges, premium state and which of your servers they're in."
    >
      <div className="flex flex-wrap items-center gap-2 py-3">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="123456789012345678"
          className="flex-1 min-w-[12rem] rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
        />
        <button
          onClick={run}
          disabled={busy || !id.trim()}
          className="press shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-40 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
        >
          <Search className="w-4 h-4" strokeWidth={2.25} />
          Look up
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {res && (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 p-4 mt-2 space-y-3">
          <div className="flex items-center gap-3">
            {res.avatar ? (
              <img src={res.avatar} alt="" className="w-10 h-10 rounded-full shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-white truncate">
                  {res.username || <span className="font-mono text-xs">{res.user_id}</span>}
                </p>
                <Badges badges={res.badges} />
              </div>
              <p className="text-[11px] text-[var(--mist-dim)] font-mono">{res.user_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[var(--line)] px-3 py-2">
              <p className="text-[10px] text-[var(--mist-dim)] mb-0.5">Premium</p>
              <p className="text-sm text-white">
                {res.premium.active
                  ? (res.premium.lifetime ? 'Lifetime' : `Until ${new Date(res.premium.expires_at).toLocaleDateString()}`)
                  : 'None'}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--line)] px-3 py-2">
              <p className="text-[10px] text-[var(--mist-dim)] mb-0.5">Shared servers</p>
              <p className="text-sm text-white">{res.shared_count}</p>
            </div>
          </div>

          {res.shared_servers?.length > 0 && (
            <div>
              <p className="text-[10px] text-[var(--mist-dim)] mb-1.5">In these servers</p>
              <div className="flex flex-wrap gap-1.5">
                {res.shared_servers.map((g) => (
                  <span key={g.id} className="text-[11px] text-[var(--mist)] border border-[var(--line)] rounded-md px-2 py-1">
                    {g.name}{g.owner && ' (owner)'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!res.found && (
            <p className="text-xs text-[var(--mist-dim)]">
              PySecured doesn't share any server with that user, so there's nothing to show.
            </p>
          )}
        </div>
      )}
    </Section>
  )
}

function BillingSection() {
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [diag, setDiag] = useState(null)
  const [diagBusy, setDiagBusy] = useState(false)

  async function load() {
    try { setData(await api.adminBilling()) } catch (e) { setError(e.message) }
  }

  async function runDiagnose() {
    setDiagBusy(true)
    try { setDiag(await api.billingDiagnose()) } catch (e) { setError(e.message) }
    finally { setDiagBusy(false) }
  }
  useEffect(() => { load() }, [])

  async function setMode(testMode) {
    setBusy(true); setError(null)
    try { await api.setBillingMode(testMode); await load() }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  if (error && !data) return <p className="text-sm text-red-400">{error}</p>
  if (!data) return null

  return (
    <Section
      title="Payments"
      icon={CreditCard}
      description="Who is allowed to buy premium right now, and what's been sold."
    >
      <div className="flex items-center justify-between gap-3 py-3 flex-wrap">
        <div>
          <p className="text-sm text-white">Who can buy</p>
          <p className="text-xs text-[var(--mist-dim)] mt-0.5">
            {data.test_mode
              ? 'QA testers only — everyone else sees that payments are still being tested.'
              : 'Open to everyone. Real customers can buy right now.'}
          </p>
        </div>
        <span className={`font-mono text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
          data.test_mode ? 'bg-[var(--py-blue)]/10 text-[var(--py-blue)]' : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {data.test_mode ? 'QA ONLY' : 'PUBLIC'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-3">
        <button
          onClick={() => setMode(true)}
          disabled={busy || data.test_mode}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-40 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
        >
          <FlaskConical className="w-4 h-4" strokeWidth={2.25} />
          Limit to QA testers
        </button>
        <button
          onClick={() => setMode(false)}
          disabled={busy || !data.test_mode}
          className="press inline-flex items-center gap-1.5 rounded-lg surface border border-[var(--line)] hover:brightness-125 disabled:opacity-40 transition-all text-white text-sm font-medium px-4 py-2"
        >
          Open to everyone
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
        {[
          ['PayPal', data.configured ? (data.live ? 'Live' : 'Sandbox') : 'Not set up'],
          ['Active subs', data.active_count],
          ['Total ever', data.total_count],
          ['Recent orders', data.recent_orders?.length ?? 0],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
            <p className="font-mono text-base text-white leading-none">{v}</p>
            <p className="text-[10px] text-[var(--mist-dim)] mt-1.5">{l}</p>
          </div>
        ))}
      </div>

      {!data.test_mode && data.configured && !data.live && (
        <p className="text-xs text-amber-400 mt-4">
          Payments are open to everyone but PayPal is still in sandbox — nobody can actually pay.
          Set PAYPAL_MODE=live when you're ready.
        </p>
      )}

      {data.recent_orders?.length > 0 && (
        <div className="pt-5">
          <p className="text-xs text-[var(--mist-dim)] mb-2">Recent orders</p>
          <div className="divide-y divide-[var(--line)]">
            {data.recent_orders.slice(0, 8).map((o) => (
              <div key={o.order_id} className="py-2 flex items-center justify-between gap-3">
                <span className="text-xs text-white truncate">
                  &lt;@{o.discord_id}&gt; · {o.plan}
                </span>
                <span className="font-mono text-[11px] text-[var(--mist-dim)] shrink-0">
                  €{o.amount} · {new Date(o.at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-5 border-t border-[var(--line)] mt-5">
        <p className="text-xs text-[var(--mist-dim)] mb-2">Purchase log channel</p>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-4 py-3 mb-5">
          {data.log_channel ? (
            <div className="flex items-center gap-2 flex-wrap">
              {data.log_channel_ok
                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                : <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2.5} />}
              <span className="text-sm text-white">{data.log_channel}</span>
              <span className="text-xs text-[var(--mist-dim)]">
                {data.log_channel_ok
                  ? '— purchases and expiries are logged here'
                  : "— PySecured can't post there, so nothing is being logged"}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className="text-xs text-[var(--mist)]">
                No purchase log channel set. Purchases still work, but nothing is posted to
                Discord — set <code className="font-mono">BILLING_LOG_CHANNEL_ID</code> in the
                bot&apos;s environment to get a message on every sale, renewal and expiry.
              </span>
            </div>
          )}
        </div>

        <button
          onClick={runDiagnose}
          disabled={diagBusy}
          className="press inline-flex items-center gap-1.5 rounded-lg surface border border-[var(--line)] hover:brightness-125 disabled:opacity-50 transition-all text-white text-sm font-medium px-4 py-2"
        >
          <Stethoscope className="w-4 h-4" strokeWidth={2} />
          {diagBusy ? 'Testing…' : 'Test PayPal connection'}
        </button>

        {diag && (
          <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 p-4 space-y-1.5">
            {[
              ['Credentials set', diag.configured],
              ['PayPal reachable from the bot', diag.reachable],
              ['Credentials accepted', diag.credentials_valid],
              ['Webhook ID set', diag.webhook_id_set],
            ].map(([label, ok]) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                {ok
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" strokeWidth={2.5} />}
                <span className={ok ? 'text-[var(--mist)]' : 'text-red-400'}>{label}</span>
              </div>
            ))}
            <p className="text-[11px] text-[var(--mist-dim)] pt-1.5">
              Mode: <span className="font-mono">{diag.mode}</span> · {diag.api_base}
            </p>
            {diag.error && <p className="text-xs text-amber-400 pt-1">{diag.error}</p>}
            {diag.credentials_valid && (
              <p className="text-xs text-[var(--mist-dim)] pt-1">
                Credentials work. If checkout still fails, the problem is your PayPal
                account's ability to <strong className="text-white">receive</strong> payments,
                not this integration — check the Resolution Center.
              </p>
            )}
          </div>
        )}
      </div>


      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
    </Section>
  )
}

function PresenceSection() {
  const [state, setState] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)

  useEffect(() => {
    api.presence().then(setState).catch((e) => setError(e.message))
  }, [])

  async function save() {
    setSaving(true)
    setSaved(null)
    setError(null)
    try {
      const res = await api.setPresence({
        template: state.template,
        activity_type: state.activity_type,
        status: state.status,
      })
      setState((s) => ({ ...s, ...res }))
      setSaved(res.preview)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const ACTIVITY = [
    ['watching', 'Watching'],
    ['playing', 'Playing'],
    ['listening', 'Listening to'],
    ['competing', 'Competing in'],
  ]
  const STATUS = [
    ['online', 'Online'],
    ['idle', 'Idle'],
    ['dnd', 'Do Not Disturb'],
    ['invisible', 'Invisible'],
  ]

  if (error && !state) return <p className="text-sm text-red-400">{error}</p>
  if (!state) return <p className="text-sm text-[var(--mist-dim)]">Loading...</p>

  const activityLabel = ACTIVITY.find(([v]) => v === state.activity_type)?.[1] ?? 'Watching'

  return (
    <Section
      title="Bot status"
      icon={Eye}
      description="The status shown under PySecured's name everywhere. This is one global value — Discord has no way to show a different status per server."
    >
      <div className="py-3">
        <p className="text-xs text-[var(--mist-dim)] mb-1.5">Live preview</p>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-4 py-3">
          <p className="text-sm text-white">
            <span className="text-[var(--mist-dim)]">{activityLabel}</span>{' '}
            {state.preview || <span className="text-[var(--mist-dim)]">—</span>}
          </p>
        </div>
      </div>

      <div className="py-3">
        <span className="block text-sm text-white mb-1.5">Status text</span>
        <input
          value={state.template}
          onChange={(e) => setState((s) => ({ ...s, template: e.target.value }))}
          maxLength={100}
          className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['{servers}', '{members}', '{commands}'].map((ph) => (
            <button
              key={ph}
              onClick={() => setState((s) => ({ ...s, template: `${s.template}${ph}` }))}
              className="font-mono text-[11px] text-[var(--py-blue)] border border-[var(--line)] rounded-md px-2 py-1 hover:border-[var(--py-blue)]/40 transition-colors"
            >
              {ph}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--mist-dim)] mt-2">
          Currently in {state.guild_count} server(s). The count refreshes automatically whenever
          PySecured joins or leaves one.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
        <div>
          <span className="block text-sm text-white mb-1.5">Activity type</span>
          <select
            value={state.activity_type}
            onChange={(e) => setState((s) => ({ ...s, activity_type: e.target.value }))}
            className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
          >
            {ACTIVITY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <span className="block text-sm text-white mb-1.5">Online status</span>
          <select
            value={state.status}
            onChange={(e) => setState((s) => ({ ...s, status: e.target.value }))}
            className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
          >
            {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-3">
        <button
          onClick={save}
          disabled={saving}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
        >
          <Eye className="w-4 h-4" strokeWidth={2.25} />
          {saving ? 'Applying...' : 'Apply status'}
        </button>
        {saved && <p className="text-xs text-emerald-400 mt-2">Applied — now showing "{activityLabel} {saved}".</p>}
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
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

const TABS = [
  { id: 'premium', label: 'Premium', Icon: Crown },
  { id: 'payments', label: 'Payments', Icon: CreditCard },
  { id: 'support', label: 'Support', Icon: UserSearch },
  { id: 'servers', label: 'Servers', Icon: Users2 },
  { id: 'site', label: 'Site', Icon: Settings2 },
]

export default function Admin() {
  const [tab, setTab] = useState('premium')

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO title="Admin" description="Site administration." path="/admin" noindex />

      <main className="max-w-4xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
        <div className="mb-6">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Admin</h1>
          <p className="text-sm text-[var(--mist-dim)] mt-1.5">
            Premium, payments and site controls. Changes here apply immediately.
          </p>
        </div>

        {/* Tabs — horizontally scrollable on mobile rather than wrapping into
            a tall stack that pushes the content off screen. */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin -mx-1 px-1 pb-2 mb-5 border-b border-[var(--line)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-[var(--bg-elevated)] text-white'
                  : 'text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              <t.Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'premium' && <PremiumSection />}
        {tab === 'payments' && <BillingSection />}
        {tab === 'support' && <LookupSection />}
        {tab === 'servers' && <GuildsOverviewSection />}
        {tab === 'site' && (
          <>
            <PresenceSection />
            <MaintenanceSection />
            <AnnouncementSection />
            <StatusOverrideSection />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
