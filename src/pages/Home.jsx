import { Navigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import Reveal from '../components/Reveal'
import LiveFeed from '../components/LiveFeed'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

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

export default function Home() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/servers" replace />
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
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
              Anti-compromise protection
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
                className="rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              >
                Continue with Discord
              </a>
              <span className="text-xs text-[var(--mist-dim)]">
                You'll need Manage Server permission to add it.
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LiveFeed />
          </div>
        </div>
      </section>

      {/* Commands */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
            The commands
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-10">
            Everything runs from four commands.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 divide-y divide-[var(--line)] overflow-hidden">
            {COMMANDS.map((c) => (
              <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4">
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

      {/* Final CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal className="rounded-2xl border border-[var(--line)] bg-[var(--bg-raised)]/60 px-8 py-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Set it up in a couple of minutes.
          </h2>
          <p className="text-[var(--mist)] mb-8 max-w-md mx-auto">
            Log in, pick a server, configure protection — from your browser or straight from Discord.
          </p>
          <a
            href={api.loginUrl()}
            className="inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Continue with Discord
          </a>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
