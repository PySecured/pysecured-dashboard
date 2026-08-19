import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Crown, Server, Gift, Copy, Check, Users2, Infinity as InfinityIcon,
  Clock, ArrowRight, ShieldCheck,
} from 'lucide-react'
import { api } from '../api'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import Badges from '../components/Badges'

export default function Profile() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.profile().then(setData).catch((e) => setError(e.message))
  }, [])

  const link = data ? `${window.location.origin}/premium?ref=${data.referral.code}` : ''

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (insecure context or denied) — the input is
      // selectable, so there's still a manual path.
    }
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <SEO title="Profile" description="Your PySecured profile." path="/profile" noindex />
        <main className="max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
          <p className="text-sm text-red-400">{error}</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
          <div className="skeleton h-32 rounded-2xl mb-4" />
          <div className="skeleton h-40 rounded-2xl" />
        </main>
      </div>
    )
  }

  const p = data.premium
  const r = data.referral

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO title="Profile" description="Your PySecured profile." path="/profile" noindex />

      <main className="max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
        {/* Identity */}
        <div className="surface rounded-2xl border border-[var(--line)] p-5 sm:p-6 mb-4">
          <div className="flex items-center gap-4">
            {data.avatar ? (
              <img src={data.avatar} alt="" className="w-16 h-16 rounded-full shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white truncate">
                  {data.username}
                </h1>
                <Badges badges={data.badges} size="lg" />
              </div>
              <p className="text-xs text-[var(--mist-dim)] font-mono mt-1">{data.id}</p>
            </div>
          </div>

          {data.badges?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--line)]">
              {data.badges.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--mist)] border border-[var(--line)] rounded-lg px-2.5 py-1.5"
                >
                  <img src={b.icon} alt="" className="w-3.5 h-3.5" />
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="surface rounded-xl border border-[var(--line)] p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Crown className="w-3.5 h-3.5 text-[var(--py-yellow)]" strokeWidth={2} />
              <p className="text-xs text-[var(--mist-dim)]">Premium</p>
            </div>
            <p className="font-display text-base text-white">
              {p.active ? (p.lifetime ? 'Lifetime' : 'Active') : 'None'}
            </p>
          </div>
          <div className="surface rounded-xl border border-[var(--line)] p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Server className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
              <p className="text-xs text-[var(--mist-dim)]">Servers</p>
            </div>
            <p className="font-display text-base text-white">{data.servers_managed}</p>
          </div>
          <div className="surface rounded-xl border border-[var(--line)] p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Users2 className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
              <p className="text-xs text-[var(--mist-dim)]">Referred</p>
            </div>
            <p className="font-display text-base text-white">{r.total_referred}</p>
          </div>
          <div className="surface rounded-xl border border-[var(--line)] p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Gift className="w-3.5 h-3.5 text-[var(--py-blue)]" strokeWidth={2} />
              <p className="text-xs text-[var(--mist-dim)]">Days earned</p>
            </div>
            <p className="font-display text-base text-white">{r.days_earned}</p>
          </div>
        </div>

        {/* Premium detail */}
        <div className="surface rounded-2xl border border-[var(--line)] p-5 mb-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-display text-base font-bold text-white mb-1">Premium</h2>
              <p className="text-sm text-[var(--mist-dim)]">
                {!p.active ? (
                  'You don\u2019t have premium yet.'
                ) : p.lifetime ? (
                  <span className="inline-flex items-center gap-1.5">
                    <InfinityIcon className="w-3.5 h-3.5 text-[var(--py-yellow)]" strokeWidth={2.25} />
                    Lifetime — never expires
                  </span>
                ) : p.expires_at ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--py-blue)]" strokeWidth={2.25} />
                    Active until {new Date(p.expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.25} />
                    Active
                  </span>
                )}
              </p>
            </div>
            <Link
              to="/premium"
              className="press shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-4 py-2.5"
            >
              {p.active ? 'Manage' : 'Get premium'}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
            </Link>
          </div>
        </div>

        {/* Referrals */}
        <div className="surface rounded-2xl border border-[var(--line)] p-5">
          <h2 className="font-display text-base font-bold text-white mb-1">Refer a friend</h2>
          <p className="text-sm text-[var(--mist-dim)] mb-4">
            Share your link. When someone you refer buys any premium plan, you get{' '}
            <strong className="text-white">{r.days_per_buyer} free days</strong> added to your own
            premium — and if you don&apos;t have premium yet, it starts it.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
              className="flex-1 min-w-0 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--mist)] px-3 py-2.5 font-mono field-focus"
            />
            <button
              onClick={copyLink}
              className="press shrink-0 inline-flex items-center gap-1.5 rounded-lg surface border border-[var(--line)] hover:brightness-125 transition-all text-white text-sm font-medium px-3 py-2.5"
            >
              {copied
                ? <><Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} /> Copied</>
                : <><Copy className="w-4 h-4" strokeWidth={2} /> Copy</>}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ['Referred', r.total_referred],
              ['Bought premium', r.buyers],
              ['Days earned', r.days_earned],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
                <p className="font-mono text-lg text-white leading-none">{value}</p>
                <p className="text-[10px] text-[var(--mist-dim)] mt-1.5">{label}</p>
              </div>
            ))}
          </div>

          {r.pending > 0 && (
            <p className="text-xs text-[var(--mist-dim)] mt-3">
              {r.pending} {r.pending === 1 ? 'person has' : 'people have'} signed up with your link
              but not bought yet — you&apos;ll be credited automatically if they do.
            </p>
          )}

          <p className="text-xs text-[var(--mist-dim)] mt-3">
            Credited once per person, on their first purchase.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
