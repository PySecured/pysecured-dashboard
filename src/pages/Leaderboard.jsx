import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Gift, Users2, ArrowRight, Medal } from 'lucide-react'
import { api } from '../api'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { useAuth } from '../AuthContext'

const MEDAL = ['text-[#ffd54a]', 'text-[#c7cdd6]', 'text-[#d99a5b]']

export default function Leaderboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.referralLeaderboard().then(setData).catch((e) => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Referral Leaderboard"
        description="Top PySecured referrers, ranked by how many people they've brought in who bought premium."
        path="/leaderboard"
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-10 pt-8 sm:pt-12 pb-16">
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[var(--py-yellow)]" strokeWidth={2} />
            <p className="eyebrow">Referrals</p>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-sm text-[var(--mist-dim)] mt-1.5">
            Ranked by people referred who bought premium. Everyone earns
            {data ? ` ${data.days_per_buyer} free days` : ' free days'} per buyer.
          </p>
        </div>

        {!user && (
          <div className="surface rounded-2xl border border-[var(--py-blue)]/25 px-5 py-4 mb-4">
            <p className="text-sm text-[var(--mist)]">
              <Link to="/profile" className="text-[var(--py-blue)] hover:underline font-medium">
                Log in to get your own referral link
              </Link>{' '}
              and start earning free premium.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
        {!data && !error && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        )}

        {data && data.entries.length === 0 && (
          <div className="surface rounded-2xl border border-[var(--line)] p-8 text-center">
            <Gift className="w-8 h-8 text-[var(--mist-dim)] mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[var(--mist)] mb-1">Nobody's on the board yet.</p>
            <p className="text-xs text-[var(--mist-dim)]">
              Be the first — share your referral link from your profile.
            </p>
          </div>
        )}

        {data && data.entries.length > 0 && (
          <div className="surface rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
            {data.entries.map((e, i) => (
              <div
                key={e.user_id}
                className={`flex items-center gap-3 px-4 sm:px-5 py-3 ${
                  e.is_you ? 'bg-[var(--py-blue)]/[0.06]' : ''
                }`}
              >
                <span
                  className={`w-6 text-center font-display text-sm font-bold shrink-0 ${
                    i < 3 ? MEDAL[i] : 'text-[var(--mist-dim)]'
                  }`}
                >
                  {i < 3 ? <Medal className="w-4 h-4 mx-auto" strokeWidth={2.25} /> : i + 1}
                </span>

                {e.avatar ? (
                  <img src={e.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] shrink-0" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">
                    {e.username || <span className="font-mono text-xs">{e.user_id}</span>}
                    {e.is_you && <span className="text-[var(--py-blue)] font-normal"> · you</span>}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-sm text-white font-mono leading-none">{e.buyers}</p>
                    <p className="text-[10px] text-[var(--mist-dim)] mt-0.5">
                      {e.buyers === 1 ? 'buyer' : 'buyers'}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-[var(--py-blue)] font-mono leading-none">{e.days_earned}</p>
                    <p className="text-[10px] text-[var(--mist-dim)] mt-0.5">days earned</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.your_stats && (
          <div className="surface rounded-2xl border border-[var(--py-blue)]/25 px-5 py-4 mt-4 flex items-center gap-3">
            <Users2 className="w-4 h-4 text-[var(--py-blue)] shrink-0" strokeWidth={2} />
            <p className="text-sm text-[var(--mist)] flex-1">
              You're ranked <strong className="text-white">#{data.your_stats.rank}</strong> with{' '}
              <strong className="text-white">{data.your_stats.buyers}</strong> buyers —{' '}
              <strong className="text-[var(--py-blue)]">{data.your_stats.days_earned} days</strong> earned.
            </p>
          </div>
        )}

        {user && (
          <div className="mt-5 text-center">
            <Link
              to="/profile"
              className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline"
            >
              Get your referral link
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
