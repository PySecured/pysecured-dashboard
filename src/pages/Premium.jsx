import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, Database, ShieldCheck, ShieldAlert, ShieldX, Timer, CalendarClock,
  FileText, Palette, Gauge, Sparkles, ArrowRight, Check, Crown, Infinity as InfinityIcon,
  Clock, Server, RefreshCw,
} from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { DISCORD_SUPPORT_URL } from '../config'

/**
 * Every premium feature, with the settings tab it lives in so a member can
 * jump straight to configuring what they've paid for.
 */
const FEATURES = [
  {
    Icon: ShieldX,
    title: 'Anti-nuke',
    blurb: 'Stops a compromised admin or rogue mod mass-deleting channels, wiping roles, or ban-spreeing.',
    tab: 'antinuke',
  },
  {
    Icon: ShieldAlert,
    title: 'Raid mode',
    blurb: 'Detects join spikes and locks the server down before damage starts, with automatic release.',
    tab: 'raid_mode',
  },
  {
    Icon: ShieldCheck,
    title: 'Member restore',
    blurb: 'Raided and mass-kicked? Pull your verified members back in one click.',
    tab: 'member_restore',
  },
  {
    Icon: Database,
    title: 'Backup & restore',
    blurb: 'Snapshot roles, channels and permissions. Restoring only ever adds, never deletes.',
    tab: 'backups',
  },
  {
    Icon: BarChart3,
    title: 'Analytics',
    blurb: 'Real history of every action taken, with trends, breakdowns and CSV export.',
    tab: 'analytics',
  },
  {
    Icon: FileText,
    title: 'Hosted transcripts',
    blurb: 'Every closed ticket, searchable by channel, staff member, or what was said inside.',
    tab: 'transcripts',
  },
  {
    Icon: CalendarClock,
    title: 'Scheduled announcements',
    blurb: 'Post once, hourly, daily or weekly. No drift, and no backlog burst after downtime.',
    tab: 'announcements',
  },
  {
    Icon: Sparkles,
    title: 'Bot identity',
    blurb: 'Your own nickname, avatar, banner and bio for PySecured — in your server only.',
    tab: 'identity',
  },
  {
    Icon: Palette,
    title: 'Custom branding',
    blurb: 'Your footer, icon and accent colour on the embeds PySecured sends.',
    tab: 'branding',
  },
  {
    Icon: Timer,
    title: 'Temporary roles',
    blurb: 'Grant a role that removes itself, or take it back early with /removetemprole.',
    tab: 'temp_roles',
  },
  {
    Icon: Gauge,
    title: 'Higher limits',
    blurb: '25 backups, 10 ticket panels, 100 custom commands, 25 scheduled posts.',
    tab: 'overview',
  },
]

function daysBetween(iso) {
  const ms = new Date(iso) - new Date()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

/* ---------- Member view: you already have premium ---------- */

function MemberView({ sub, plans, onBuy, busy }) {
  const lifetime = sub?.lifetime
  const expires = sub?.expires_at
  const daysLeft = expires ? daysBetween(expires) : null
  const expiringSoon = daysLeft !== null && daysLeft <= 7

  return (
    <>
      <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="crown"><Crown className="w-2.5 h-2.5" strokeWidth={2.75} /></span>
          <p className="eyebrow">Premium</p>
        </div>

        {/* Status card */}
        <div className="surface rounded-2xl border border-[var(--py-yellow)]/35 p-5 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                Your premium is active
              </h1>
              <p className="text-sm text-[var(--mist-dim)]">
                Every feature below is unlocked on all servers you manage.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 px-4 py-3 min-w-[9rem]">
              {lifetime ? (
                <>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <InfinityIcon className="w-4 h-4 text-[var(--py-yellow)]" strokeWidth={2.25} />
                    <span className="font-display text-lg font-bold text-white">Lifetime</span>
                  </div>
                  <p className="text-[11px] text-[var(--mist-dim)]">Never expires</p>
                </>
              ) : expires ? (
                <>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock className={`w-4 h-4 ${expiringSoon ? 'text-amber-400' : 'text-[var(--py-blue)]'}`} strokeWidth={2.25} />
                    <span className="font-display text-lg font-bold text-white">
                      {daysLeft} day{daysLeft === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--mist-dim)]">
                    Until {new Date(expires).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                    <span className="font-display text-lg font-bold text-white">Active</span>
                  </div>
                  <p className="text-[11px] text-[var(--mist-dim)]">Granted directly</p>
                </>
              )}
            </div>
          </div>

          {expiringSoon && (
            <p className="text-xs text-amber-400 mt-4 pt-4 border-t border-[var(--line)]">
              Your premium ends in {daysLeft} day{daysLeft === 1 ? '' : 's'}. Extending now adds to
              your remaining time rather than replacing it.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-[var(--line)]">
            <Link
              to="/servers"
              className="press inline-flex items-center gap-2 rounded-xl bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-4 py-2.5"
            >
              <Server className="w-4 h-4" strokeWidth={2.25} />
              Configure your servers
            </Link>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center gap-2 rounded-xl surface border border-[var(--line)] hover:brightness-125 transition-all text-white text-sm font-medium px-4 py-2.5"
            >
              Get support
            </a>
          </div>
        </div>
      </section>

      {/* Unlocked features — compact, each links to its settings tab */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-6">
        <p className="eyebrow mb-3">Unlocked</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 30}>
              <div className="surface h-full rounded-xl border border-[var(--line)] p-4">
                <div className="flex items-start gap-2.5 mb-2">
                  <f.Icon className="w-4 h-4 text-[var(--py-yellow)] shrink-0 mt-0.5" strokeWidth={2} />
                  <h3 className="font-display text-sm font-bold text-white flex-1">{f.title}</h3>
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                </div>
                <p className="text-xs text-[var(--mist-dim)] leading-relaxed">{f.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Extend — only when there's something to extend */}
      {!lifetime && plans?.configured && plans?.can_buy && (
        <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-8">
          <p className="eyebrow mb-3">Extend or upgrade</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {plans.plans.map((p) => (
              <button
                key={p.id}
                onClick={() => onBuy(p.id)}
                disabled={!!busy}
                className="card-interactive surface rounded-xl border border-[var(--line)] p-4 text-left disabled:opacity-50"
              >
                <p className="text-xs text-[var(--mist-dim)] mb-1">{p.name}</p>
                <p className="font-display text-xl font-bold text-white mb-1">€{p.price}</p>
                <p className="text-[11px] text-[var(--mist-dim)] mb-3">
                  {p.days ? `Adds ${p.days} days` : 'Makes it permanent'}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-[var(--py-blue)]">
                  {busy === p.id ? 'Opening PayPal…' : 'Choose'}
                  <ArrowRight className="w-3 h-3" strokeWidth={2.25} />
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--mist-dim)] mt-3 flex items-start gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} />
            Time is added to what you already have — you never lose remaining days by extending early.
          </p>
        </section>
      )}
    </>
  )
}

/* ---------- Visitor view: pricing and what you'd get ---------- */

function VisitorView({ plans, onBuy, busy, notice, error }) {
  return (
    <>
      <section className="relative max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="crown"><Crown className="w-2.5 h-2.5" strokeWidth={2.75} /></span>
          <p className="eyebrow">Premium</p>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight mb-4">
          Almost everything is free.<br />This is the “almost.”
        </h1>
        <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed max-w-xl mx-auto">
          Twenty-eight features, and only these eleven cost anything. They're the ones that
          matter most when something goes wrong — recovery, insight, and control.
        </p>
      </section>

      {notice && (
        <section className="relative max-w-3xl mx-auto px-4 sm:px-10 pb-4">
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4">
            <p className="text-sm text-emerald-400">{notice}</p>
          </div>
        </section>
      )}
      {error && (
        <section className="relative max-w-3xl mx-auto px-4 sm:px-10 pb-4">
          <div className="rounded-2xl border border-red-500/25 bg-red-500/5 px-5 py-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </section>
      )}

      {/* Plans */}
      {plans?.configured && plans?.can_buy && (
        <section id="plans" className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-8">
          {plans.test_mode && (
            <div className="rounded-xl border border-[var(--py-blue)]/25 bg-[var(--py-blue)]/5 px-4 py-3 mb-4">
              <p className="text-xs text-[var(--mist)]">
                <strong className="text-white">QA testing mode.</strong> You can buy because you're
                on the QA team — payments aren't open to everyone yet.
                {!plans.live && ' PayPal is in sandbox, so no real money moves.'}
              </p>
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-3">
            {plans.plans.map((p) => {
              const best = p.id === 'lifetime'
              return (
                <div
                  key={p.id}
                  className={`surface rounded-2xl border p-5 flex flex-col ${
                    best ? 'border-[var(--py-yellow)]/40' : 'border-[var(--line)]'
                  }`}
                >
                  {best && (
                    <span className="inline-flex items-center gap-1 self-start text-[10px] font-medium px-2 py-0.5 rounded-md border border-[var(--py-yellow)]/30 text-[var(--py-yellow)] mb-2">
                      <Crown className="w-2.5 h-2.5" strokeWidth={2.75} />
                      Best value
                    </span>
                  )}
                  <p className="text-xs text-[var(--mist-dim)] mb-1">{p.name}</p>
                  <p className="font-display text-3xl font-bold text-white mb-1">€{p.price}</p>
                  <p className="text-xs text-[var(--mist-dim)] mb-5">
                    {p.days ? `${p.days} days` : 'Yours permanently'}
                  </p>
                  <button
                    onClick={() => onBuy(p.id)}
                    disabled={!!busy}
                    className={`press mt-auto w-full rounded-xl text-sm font-semibold px-4 py-2.5 transition-all disabled:opacity-50 ${
                      best
                        ? 'bg-[var(--py-yellow)] text-[#2a1c00] hover:brightness-110'
                        : 'bg-[var(--py-blue)] text-[#06111f] hover:brightness-110'
                    }`}
                  >
                    {busy === p.id ? 'Opening PayPal…' : 'Buy with PayPal'}
                  </button>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[var(--mist-dim)] mt-3 text-center">
            Paid through PayPal. Your role is applied automatically — nothing recurring is charged.
          </p>
        </section>
      )}

      {/* Payments not open to this visitor */}
      {plans?.configured && plans?.test_mode && !plans?.can_buy && (
        <section className="relative max-w-3xl mx-auto px-4 sm:px-10 pb-8">
          <div className="surface rounded-2xl border border-[var(--py-blue)]/30 px-5 py-5">
            <p className="text-sm text-white font-semibold mb-1">Payments open shortly</p>
            <p className="text-sm text-[var(--mist)] leading-relaxed mb-3">
              Checkout works end to end — we're verifying it with our QA team first. These
              are the prices it'll launch at.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {plans.plans.map((p) => (
                <span key={p.id} className="text-xs text-[var(--mist)] border border-[var(--line)] rounded-lg px-2.5 py-1.5">
                  <strong className="text-white">€{p.price}</strong> {p.days ? `· ${p.days} days` : '· lifetime'}
                </span>
              ))}
            </div>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center gap-2 rounded-xl bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-4 py-2.5"
            >
              Hear when it opens
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          </div>
        </section>
      )}

      {/* What you get — compact grid */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-8">
        <p className="eyebrow mb-3">What you get</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 30}>
              <div className="card-interactive surface h-full rounded-xl border border-[var(--line)] p-4">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--py-yellow)]/10 border border-[var(--py-yellow)]/25 flex items-center justify-center shrink-0">
                    <f.Icon className="w-4 h-4 text-[var(--py-yellow)]" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-sm font-bold text-white flex-1 pt-1.5">{f.title}</h3>
                </div>
                <p className="text-xs text-[var(--mist-dim)] leading-relaxed">{f.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

export default function Premium() {
  const { user } = useAuth()
  const [plans, setPlans] = useState(null)
  const [sub, setSub] = useState(null)
  const [busy, setBusy] = useState(null)
  const [notice, setNotice] = useState(null)
  const [error, setError] = useState(null)

  // Role-based premium counts even without a purchase record (QA, or granted
  // by hand), so the member view must not depend on a subscription existing.
  const hasPremium = !!user?.is_premium || !!sub?.active

  useEffect(() => {
    api.billingPlans().then(setPlans).catch(() => {})
    if (user) api.billingMe().then(setSub).catch(() => {})
  }, [user])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('token')
    if (params.get('cancelled')) {
      setNotice('Payment cancelled — nothing was charged.')
      window.history.replaceState({}, '', '/premium')
      return
    }
    if (orderId && params.get('paid')) {
      setBusy('capture')
      api.captureOrder(orderId)
        .then(() => {
          setNotice('Payment received — your premium role is being applied.')
          return api.billingMe().then(setSub)
        })
        .catch((e) => setError(e.message))
        .finally(() => {
          setBusy(null)
          window.history.replaceState({}, '', '/premium')
        })
    }
  }, [])

  async function buy(planId) {
    setBusy(planId)
    setError(null)
    try {
      const res = await api.createOrder(planId)
      if (res.approve_url) window.location.href = res.approve_url
      else setError("Couldn't start the payment.")
    } catch (e) {
      setError(e.message)
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Premium"
        description="PySecured Premium — anti-nuke, raid mode, member restore, backups, analytics and more. From €2.99."
        path="/premium"
      />

      {hasPremium ? (
        <>
          {notice && (
            <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pt-6">
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4">
                <p className="text-sm text-emerald-400">{notice}</p>
              </div>
            </section>
          )}
          {error && (
            <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pt-6">
              <div className="rounded-2xl border border-red-500/25 bg-red-500/5 px-5 py-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </section>
          )}
          <MemberView sub={sub?.subscription} plans={plans} onBuy={buy} busy={busy} />
        </>
      ) : (
        <VisitorView plans={plans} onBuy={buy} busy={busy} notice={notice} error={error} />
      )}

      <SiteFooter />
    </div>
  )
}
