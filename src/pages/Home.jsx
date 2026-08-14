import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Radio, ShieldAlert, Ticket, Smile, Gift, UserPlus, BarChart3, LayoutDashboard,
  MessageSquare, Trophy, Star, Database, Gavel, UserCheck, ShieldCheck,
} from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import Reveal from '../components/Reveal'
import LiveFeed from '../components/LiveFeed'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PySecured',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Discord',
  description:
    'PySecured is an all-in-one Discord bot — security and hacked-account detection, tickets, reaction roles, giveaways, welcome messages, custom commands, leveling, starboard, analytics, server backup & restore, and a full web dashboard.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const FEATURES = [
  {
    Icon: ShieldAlert,
    title: 'Security & moderation',
    body: 'Catches hacked accounts by behavior — scam links, fake giveaways, mass pings — and automatically quarantines, times out, kicks, or bans. Plus auto-mod for caps, spam, and a word blacklist, and a honeypot trap channel.',
  },
  {
    Icon: UserCheck,
    title: 'Verification',
    body: 'A one-click Verify button that screens for alt and throwaway accounts — account age, 2FA, repeat connections — and logs every signal before granting a role.',
  },
  {
    Icon: Gavel,
    title: 'Moderation commands',
    body: '/warn, /kick, /ban, /softban, /mute, /purge and more — with warning history, custom logging, and built-in role-hierarchy safety.',
  },
  {
    Icon: Ticket,
    title: 'Support tickets',
    body: 'A panel button opens a private channel per person — custom category, support roles, and a transcript logged on close.',
  },
  {
    Icon: Smile,
    title: 'Reaction roles',
    body: 'React to a message, get a role. No typing, no separate command to remember.',
  },
  {
    Icon: Gift,
    title: 'Giveaways',
    body: 'Set a prize, a duration, and how many winners — entries are tracked and winners picked automatically.',
  },
  {
    Icon: UserPlus,
    title: 'Welcome & auto-role',
    body: 'Greet new members with a fully custom embed and assign a role the moment they join.',
  },
  {
    Icon: MessageSquare,
    title: 'Custom commands',
    body: 'Define a trigger word or phrase — PySecured replies automatically. No code, all from the dashboard.',
  },
  {
    Icon: Trophy,
    title: 'Leveling & XP',
    body: 'Members earn XP from activity, with a server leaderboard and a /rank command to check progress.',
  },
  {
    Icon: Star,
    title: 'Starboard',
    body: 'Messages that hit a reaction threshold get pinned to a highlights channel automatically.',
  },
  {
    Icon: BarChart3,
    title: 'Analytics',
    body: 'A real history of every action taken — trends, breakdowns, recent activity. Not fabricated numbers.',
    premium: true,
  },
  {
    Icon: Database,
    title: 'Backup & restore',
    body: 'Snapshot every role, category, and channel, restore later — additive-only, never destructive.',
    premium: true,
  },
  {
    Icon: ShieldCheck,
    title: 'Member restore',
    body: 'Raided and mass-kicked? Pull your verified members back into the server automatically, in one click.',
    premium: true,
  },
]

export default function Home() {
  const { user } = useAuth()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    api.status().then(setStatus).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="PySecured — The All-in-One Discord Bot"
        description="Security, tickets, reaction roles, giveaways, leveling, starboard, welcome messages, and a full web dashboard — one Discord bot, mostly free."
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Helmet>
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="absolute -top-24 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--py-blue)] blur-[110px] animate-glow animate-float"
        />
        <div
          aria-hidden
          className="absolute top-10 -right-24 w-[380px] h-[380px] rounded-full bg-[var(--accent-violet)] blur-[110px] animate-glow"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-5">
              The all-in-one Discord bot
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] mb-6">
              <span className="text-white">One bot. </span>
              <span className="bg-gradient-to-r from-[var(--py-blue)] to-[var(--accent-violet)] bg-clip-text text-transparent">
                Every tool your server needs.
              </span>
            </h1>
            <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              PySecured catches hacked accounts before they spam your server, runs tickets,
              giveaways, reaction roles, leveling, and a starboard, welcomes new members
              automatically — all from one dashboard, mostly free.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {user ? (
                <Link
                  to="/servers"
                  className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              ) : (
                <a
                  href={api.loginUrl()}
                  className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  Continue with Discord
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </a>
              )}
              <span className="text-xs text-[var(--mist-dim)]">
                {user ? `Logged in as ${user.username}.` : "You'll need Manage Server permission to add it."}
              </span>
            </div>

            {status?.bot?.online && (
              <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
                <div className="surface rounded-xl border border-[var(--line)] px-3 py-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Radio className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    <span className="font-mono text-[10px] text-[var(--mist-dim)] uppercase tracking-wide">Live</span>
                  </div>
                  <p className="font-mono text-lg text-white leading-none">{status.bot.guild_count}</p>
                  <p className="text-[10px] text-[var(--mist-dim)] mt-0.5">servers</p>
                </div>
                <div className="surface rounded-xl border border-[var(--line)] px-3 py-3">
                  <p className="font-mono text-lg text-white leading-none mt-4">{status.bot.latency_ms}<span className="text-xs text-[var(--mist-dim)]"> ms</span></p>
                  <p className="text-[10px] text-[var(--mist-dim)] mt-1.5">gateway latency</p>
                </div>
                <div className="surface rounded-xl border border-[var(--line)] px-3 py-3">
                  <p className="font-mono text-lg text-white leading-none mt-4">13<span className="text-xs text-[var(--mist-dim)]">+</span></p>
                  <p className="text-[10px] text-[var(--mist-dim)] mt-1.5">features, mostly free</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <LiveFeed />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <LayoutDashboard className="w-3.5 h-3.5 text-[var(--py-yellow-soft)]" strokeWidth={2} />
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase">
              Everything included
            </p>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Not just moderation.
          </h2>
          <p className="text-[var(--mist)] max-w-xl mb-12">
            Manage all of it from Discord or from your browser — full parity either way.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, idx) => (
            <Reveal key={f.title} delay={idx * 80}>
              <div className="card-interactive h-full surface rounded-xl border border-[var(--line)] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center">
                    <f.Icon className="w-5 h-5 text-[var(--py-blue)]" strokeWidth={1.75} />
                  </div>
                  {f.premium && (
                    <span className="font-mono text-[10px] tracking-wide text-[var(--py-yellow-soft)] border border-[var(--py-yellow-soft)]/30 rounded-full px-2 py-0.5">
                      PREMIUM
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal className="card-interactive surface rounded-2xl border border-[var(--line)] px-8 py-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            {user ? 'Pick up where you left off.' : 'Set it up in a couple of minutes.'}
          </h2>
          <p className="text-[var(--mist)] mb-8 max-w-md mx-auto">
            {user
              ? "You're already logged in — jump straight to your servers."
              : 'Log in, pick a server, turn on whatever you need — from your browser or straight from Discord.'}
          </p>
          {user ? (
            <Link
              to="/servers"
              className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          ) : (
            <a
              href={api.loginUrl()}
              className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            >
              Continue with Discord
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          )}
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
