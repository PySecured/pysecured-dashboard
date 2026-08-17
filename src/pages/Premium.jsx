import { BarChart3, Database, ShieldCheck, ShieldAlert, ShieldX, Timer, CalendarClock, FileText, Palette, Gauge, Sparkles, ArrowRight, Check, Crown, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../api'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { DISCORD_SUPPORT_URL } from '../config'

const FEATURES = [
  {
    Icon: ShieldAlert,
    title: 'Raid mode & auto-lockdown',
    body: "Detects a join spike — a configurable number of accounts joining inside a short window — and reacts before the damage starts. Lockdown is the default rather than mass-kicking, because a wrong kick can't be undone and a lockdown can.",
    bullets: [
      'Auto-lockdown revokes send + react from @everyone in one move',
      'Auto-release after a set window, so a 3am raid unlocks itself',
      'Optional kick-wave targets only new accounts inside the burst',
      'Alerts your staff role the moment it triggers',
      'Lock or release by hand any time from the dashboard',
    ],
  },
  {
    Icon: ShieldX,
    title: 'Anti-nuke protection',
    body: "Raid mode stops attacks from outside. This stops the other kind — someone who already has permissions going destructive, whether their account was compromised or they turned on you. Watches for mass channel deletions, role wipes, and ban or kick sprees.",
    bullets: [
      'Separate thresholds for channel deletes, role deletes, bans, and kicks',
      'Counted per person, so two mods working normally never trip it',
      'Strips their roles instantly — reversible, unlike a ban',
      'Server owner and PySecured itself are always exempt',
    ],
  },
  {
    Icon: Timer,
    title: 'Temporary roles',
    body: 'Grant a role that removes itself when time is up — event access, trial moderators, timed perks. Expiry survives restarts, so nothing gets stranded.',
    bullets: [
      '/temprole @member @role 60 — that simple',
      'Checked every minute, logged when it expires',
      'Re-granting extends rather than stacking duplicates',
      'Refuses roles above PySecured or above the granter',
    ],
  },
  {
    Icon: CalendarClock,
    title: 'Scheduled & recurring announcements',
    body: 'Write it once and let it post itself — rules reminders, weekly events, timed drops. Plain messages or full embeds with a title and colour.',
    bullets: [
      'Once, hourly, daily, or weekly',
      "No drift — a daily 09:00 post stays at 09:00, even if a tick runs late",
      'Skips the backlog after downtime instead of firing a burst of missed posts',
      'Pause, resume, or delete any schedule',
    ],
  },
  {
    Icon: ShieldCheck,
    title: 'Member restore after a raid',
    body: 'If your server gets raided and members are mass-kicked, pull them back in one click. Members who verified through PySecured personally authorised this during verification, so restore is instant and consented.',
    bullets: [
      'One click re-adds every verified member who was removed',
      'Anyone still in the server is skipped — safe to run twice',
      'Restore tokens are encrypted at rest, never stored in plain text',
      'Covers members who verified — the more who verify, the more you recover',
    ],
  },
  {
    Icon: Database,
    title: 'Server backup & restore',
    body: "Snapshot your roles, categories, channels, and every channel's permission overwrites, then restore them whenever you need. Restoring only ever adds — it never deletes or modifies anything currently in your server, so a bad restore can't make things worse.",
    bullets: [
      'Captures roles, channels, and per-channel permissions',
      'Keep up to 10 backups per server',
      'Private channels come back private — overwrites are restored too',
      'Restore is additive-only — nothing existing is ever touched',
      'See exactly what got created after every restore',
    ],
  },
  {
    Icon: FileText,
    title: 'Hosted ticket transcripts',
    body: "Every closed ticket, browsable and searchable right in the dashboard — by channel, by the staff member who closed it, or by what was actually said inside. Transcripts are saved for every server, so if you upgrade later your history is already there.",
    bullets: [
      'Full-text search across every closed ticket',
      'Read the whole conversation without downloading a file',
      'Search by channel name or by who closed it',
      'Keeps the last 200 tickets per server',
    ],
  },
  {
    Icon: Sparkles,
    title: 'Per-server bot identity',
    body: "Give PySecured its own nickname, avatar, banner, and bio in your server — completely separate from how it looks anywhere else. Call it whatever you want, with your own logo, and it stays that way only for you.",
    bullets: [
      'Custom nickname, avatar, banner, and bio, scoped to your server',
      'Every other server keeps seeing the default',
      'Reset back to default in one click',
      "Tells you exactly which parts applied — no silent failures",
    ],
  },
  {
    Icon: Palette,
    title: 'Custom branding',
    body: 'Put your own footer, icon, and accent colour on the embeds PySecured sends in your server, instead of the default PySecured footer.',
    bullets: [
      'Custom footer text and icon',
      'Server-wide accent colour',
      'Applies to logs, suggestions, and ticket embeds',
    ],
  },
  {
    Icon: Gauge,
    title: 'Higher limits',
    body: 'Every capped feature gets substantially more headroom — useful once a server is actually leaning on them.',
    bullets: [
      '25 backups instead of 5',
      '10 ticket panels instead of 3',
      '100 custom commands instead of 15',
      '25 scheduled announcements instead of 3',
    ],
  },
  {
    Icon: BarChart3,
    title: 'Real analytics, read live off the bot',
    body: 'A history of every action PySecured has taken in your server — not fabricated numbers, every entry comes from something that actually happened.',
    bullets: [
      'This-week vs last-week trend on every action taken',
      '14-day daily activity chart',
      'Breakdown by action type and by what triggered it',
      'Recent activity feed, most recent first',
      'Full history export to CSV',
    ],
  },
]

export default function Premium() {
  const { user } = useAuth()
  const [plans, setPlans] = useState(null)
  const [sub, setSub] = useState(null)
  const [busy, setBusy] = useState(null)
  const [notice, setNotice] = useState(null)
  const [error, setError] = useState(null)

  const hasPremium = !!user?.is_premium || !!sub?.active

  useEffect(() => {
    api.billingPlans().then(setPlans).catch(() => {})
    if (user) api.billingMe().then(setSub).catch(() => {})
  }, [user])

  useEffect(() => {
    // PayPal redirects back with ?token=<orderId>. Capture it server-side —
    // the redirect alone is not proof of payment.
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
          setNotice("Payment received — your premium role is being applied. If you're not in the support server yet, it'll apply the moment you join.")
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
      else setError('Couldn\'t start the payment.')
    } catch (e) {
      setError(e.message)
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Premium"
        description="PySecured Premium — raid mode, scheduled announcements, member restore, server backup, and analytics. Live now for premium members."
        path="/premium"
      />

      <section className="relative">
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full bg-[var(--py-yellow)] blur-[130px] opacity-[0.13] animate-glow"
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-14 text-center">
          <p className="eyebrow mb-5">Premium</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-[1.15] sm:leading-[1.1] mb-6">
            Almost everything is free. This is the "almost."
          </h1>
          <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Moderation, verification, tickets, reaction roles, giveaways, welcome messages,
            custom commands, leveling, and starboard — all free, no premium wall. Premium is
            the handful of things that are genuinely harder to build and matter most when
            something goes wrong.
          </p>

          {hasPremium ? (
            <>
              <div className="surface inline-flex items-center gap-3 rounded-2xl border border-[var(--py-yellow)]/40 px-5 py-4 mb-8">
                <span className="crown w-7 h-7 rounded-lg">
                  <Crown className="w-3.5 h-3.5" strokeWidth={2.75} />
                </span>
                <div className="text-left">
                  <p className="text-sm text-white font-semibold">You have Premium</p>
                  <p className="text-xs text-[var(--mist-dim)]">
                    {sub?.subscription?.lifetime
                      ? 'Lifetime — yours permanently.'
                      : sub?.subscription?.expires_at
                        ? `Active until ${new Date(sub.subscription.expires_at).toLocaleDateString()}.`
                        : 'Every feature below is unlocked on your servers.'}
                  </p>
                </div>
              </div>
              <div>
                <Link
                  to="/servers"
                  className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-3"
                >
                  Go to your servers
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="surface inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-[var(--py-blue)]/30 px-5 py-4 mb-8 text-left">
                <div className="flex items-center gap-2 shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-sm text-white font-medium">Live right now</span>
                </div>
                <p className="text-sm text-[var(--mist-dim)]">
                  Every feature below is built and working — but there's no way to buy it yet.
                  Premium is granted by hand in our Discord while we finish testing.
                </p>
              </div>

              <div>
                <a
                  href={DISCORD_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3"
                >
                  Ask about premium access
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Payments still in testing — shown to anyone who can't buy yet */}
      {plans?.configured && plans?.test_mode && !plans?.can_buy && !hasPremium && (
        <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-8">
          <div className="surface rounded-2xl border border-[var(--py-blue)]/30 px-5 py-5">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-[var(--py-blue)] shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-sm text-white font-semibold mb-1">
                  Payments are live, but still being tested
                </p>
                <p className="text-sm text-[var(--mist)] leading-relaxed mb-3">
                  Checkout works end to end — we're just verifying it properly with our QA team
                  before opening it to everyone. <strong className="text-white">Please don't try
                  to pay yet.</strong> When it opens, the prices below are what they'll be.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {plans.plans.map((p) => (
                    <span key={p.id} className="text-xs text-[var(--mist)] border border-[var(--line)] rounded-lg px-2.5 py-1.5">
                      <strong className="text-white">€{p.price}</strong>{' '}
                      {p.days ? `· ${p.days} days` : '· lifetime'}
                    </span>
                  ))}
                </div>
                <a
                  href={DISCORD_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-4 py-2.5"
                >
                  Join the Discord to hear when it opens
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {plans?.configured && plans?.can_buy && !hasPremium && (
        <section className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-8">
          {notice && (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4 mb-6">
              <p className="text-sm text-emerald-400">{notice}</p>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/5 px-5 py-4 mb-6">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {plans.test_mode && (
            <div className="rounded-xl border border-[var(--py-blue)]/25 bg-[var(--py-blue)]/5 px-4 py-3 mb-4">
              <p className="text-xs text-[var(--mist)]">
                <strong className="text-white">QA testing mode.</strong> You can buy because you're
                on the QA team — payments aren't open to the public yet.
                {!plans.live && ' PayPal is in sandbox, so no real money moves.'}
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
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
                  <h3 className="font-display text-base font-bold text-white">{p.name}</h3>
                  <p className="mt-2 mb-1">
                    <span className="font-display text-3xl font-bold text-white">€{p.price}</span>
                  </p>
                  <p className="text-xs text-[var(--mist-dim)] mb-5">
                    {p.days ? `${p.days} days of premium` : 'Yours permanently'}
                  </p>
                  <button
                    onClick={() => buy(p.id)}
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

          <p className="text-xs text-[var(--mist-dim)] mt-4 text-center">
            Paid securely through PayPal. Your premium role is applied automatically to your
            Discord account.
            {!plans.live && ' (Sandbox mode — test payments only.)'}
          </p>
        </section>
      )}

      <section className="relative max-w-4xl mx-auto px-6 sm:px-10 pb-16">
        <Reveal>
          <p className="eyebrow mb-4">What you get</p>
        </Reveal>
        <div className="space-y-5">
          {FEATURES.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 80}>
              <div className="surface rounded-xl border border-[var(--py-blue)]/40 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/30 flex items-center justify-center">
                    <item.Icon className="w-6 h-6 text-[var(--py-blue)]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h2 className="font-display text-xl font-bold text-white">{item.title}</h2>
                      {hasPremium && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--mist)] leading-relaxed mb-4">{item.body}</p>
                    <ul className="text-sm text-[var(--mist)] space-y-1.5 list-disc pl-5 marker:text-[var(--py-blue)]">
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="text-center text-xs text-[var(--mist-dim)] mt-10 max-w-md mx-auto leading-relaxed">
            {hasPremium
              ? "Thanks for being an early premium member — these features are still evolving, and feedback in the Discord genuinely shapes them."
              : "No price and no billing yet — we'd rather get it right than rush it out. The Discord is the most accurate place to hear when that changes."}
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
