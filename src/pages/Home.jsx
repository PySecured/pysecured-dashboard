import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Terminal, Radio, Sparkles, Smile, Gift } from 'lucide-react'
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
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Discord',
  description:
    'PySecured is a Discord bot that detects compromised (hacked) accounts by their behavior — scam links, fake nitro giveaways, mass-ping spam — and automatically quarantines, times out, kicks, or bans them. Also includes reaction roles, giveaways, and more.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const COMMANDS = [
  { cmd: '/setup', desc: 'Configure protection — quarantine role, trap channel, whitelist' },
  { cmd: '/dashboard', desc: 'Open this page, right from Discord' },
  { cmd: '/invite', desc: 'Add PySecured to another server' },
  { cmd: '/pysecured', desc: 'What this bot does, in one place' },
]

const STEPS = [
  {
    n: '01',
    title: 'Detect',
    body: 'Every message is checked against known compromise patterns — lookalike scam links, nitro/giveaway phrases, mass-ping spam.',
  },
  {
    n: '02',
    title: 'Act',
    body: 'Configurable per server: quarantine role, timeout, kick, or ban — with a custom length, set once and forget.',
  },
  {
    n: '03',
    title: 'Log',
    body: 'Every action is posted to your log channel, with the reason attached, so nothing happens without a paper trail.',
  },
]

const MORE_FEATURES = [
  {
    Icon: Smile,
    title: 'Reaction roles',
    body: 'One panel message — react with an emoji, get a role. No extra typing, no separate command to remember.',
  },
  {
    Icon: Gift,
    title: 'Giveaways',
    body: 'Set a prize, a duration, and how many winners — PySecured posts it, tracks entries, and picks winners automatically.',
  },
]

const PLANNED_FEATURES = ['Leveling & XP', 'Reminders', 'Custom commands', 'Starboard']

export default function Home() {
  const { user, loading } = useAuth()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    api.status().then(setStatus).catch(() => {})
  }, [])

  if (!loading && user) {
    return <Navigate to="/servers" replace />
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="PySecured — Discord Anti-Hack Bot with Reaction Roles, Giveaways & More"
        description="PySecured catches hacked and compromised accounts before they spam your server — plus reaction roles, giveaways, and more, all free."
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
          className="absolute top-10 -right-24 w-[380px] h-[380px] rounded-full bg-[var(--py-yellow)] blur-[110px] animate-glow"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-5">
              Discord anti-spam &amp; moderation bot
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6">
              Catch hacked accounts before they wreck your server.
            </h1>
            <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              PySecured watches every message for scam links, fake giveaways, and
              mass-ping spam — then quarantines, times out, kicks, or bans
              automatically, before real damage is done.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={api.loginUrl()}
                className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              >
                Continue with Discord
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
              <span className="text-xs text-[var(--mist-dim)]">
                You'll need Manage Server permission to add it.
              </span>
            </div>

            {status?.bot?.online && (
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-[var(--line)]">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-xs text-[var(--mist-dim)]">LIVE</span>
                </div>
                <span className="font-mono text-xs text-[var(--mist)]">
                  Protecting <span className="text-white font-medium">{status.bot.guild_count}</span> server{status.bot.guild_count === 1 ? '' : 's'}
                </span>
                <span className="font-mono text-xs text-[var(--mist)]">
                  {status.bot.latency_ms} ms gateway latency
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <LiveFeed />
          </div>
        </div>
      </section>

      {/* Commands */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-3.5 h-3.5 text-[var(--py-yellow-soft)]" strokeWidth={2} />
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase">
              The commands
            </p>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-10">
            Everything runs from four commands.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 divide-y divide-[var(--line)] overflow-hidden">
            {COMMANDS.map((c) => (
              <div
                key={c.cmd}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <code className="font-mono text-sm text-[var(--py-blue)] sm:w-40 shrink-0">{c.cmd}</code>
                <span className="text-sm text-[var(--mist)]">{c.desc}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
            How protection works
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {STEPS.map((step, idx) => (
            <Reveal key={step.n} delay={idx * 120}>
              <div className="border-t border-[var(--py-blue)]/40 pt-5">
                <span className="font-mono text-xs text-[var(--mist-dim)]">{step.n}</span>
                <h3 className="font-display text-lg font-bold text-white mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* And more */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--py-yellow-soft)]" strokeWidth={2} />
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase">And more</p>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Security is where PySecured started. It's not where it stops.
          </h2>
          <p className="text-[var(--mist)] max-w-xl mb-10">
            Everything below is free and live right now, right alongside the moderation tools.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {MORE_FEATURES.map((f, idx) => (
            <Reveal key={f.title} delay={idx * 100}>
              <div className="card-interactive h-full rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center mb-3">
                  <f.Icon className="w-5 h-5 text-[var(--py-blue)]" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="font-mono text-xs tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-3">Planned next</p>
          <div className="flex flex-wrap gap-2">
            {PLANNED_FEATURES.map((title) => (
              <span
                key={title}
                className="text-xs text-[var(--mist-dim)] border border-[var(--line)] rounded-full px-3 py-1.5"
              >
                {title}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal className="card-interactive rounded-2xl border border-[var(--line)] bg-[var(--bg-raised)]/60 px-8 py-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Set it up in a couple of minutes.
          </h2>
          <p className="text-[var(--mist)] mb-8 max-w-md mx-auto">
            Log in, pick a server, configure protection — from your browser or straight from Discord.
          </p>
          <a
            href={api.loginUrl()}
            className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Continue with Discord
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </a>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
