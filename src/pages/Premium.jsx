import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/Reveal'
import { DISCORD_SUPPORT_URL } from '../config'

const PLANNED = [
  {
    icon: '🎯',
    title: 'Sharper detection',
    body: 'A larger, continuously-updated set of scam patterns and lookalike domains, tuned from real reports instead of a static list.',
  },
  {
    icon: '✏️',
    title: 'Custom quarantine messages',
    body: 'Write your own DM or embed sent to a quarantined member, instead of the default notice.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    body: 'A history of every action PySecured has taken in your server, with trends over time — not just the live log feed.',
  },
  {
    icon: '⚡',
    title: 'Priority support',
    body: 'Faster answers when something needs a human, through the support server.',
  },
]

export default function Premium() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <section className="relative">
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full bg-[var(--py-yellow)] blur-[130px] animate-glow"
        />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-5">
            Premium
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6">
            Still coming soon.
          </h1>
          <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
            Everything PySecured does today stays free. Premium will add a
            handful of things on top — nothing's ready to ship yet, but
            here's what's planned.
          </p>
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Join the Discord for updates
          </a>
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-5">
          {PLANNED.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 100}>
              <div className="h-full rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-6">
                <span className="text-2xl">{item.icon}</span>
                <h2 className="font-display text-base font-bold text-white mt-3 mb-2">{item.title}</h2>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <p className="text-center text-xs text-[var(--mist-dim)] mt-10">
            No price, no date, no waitlist yet — this list is a direction,
            not a promise. The Discord is the most accurate place to hear
            when that changes.
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
