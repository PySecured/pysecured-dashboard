import { Target, BarChart3, Zap, Ticket, ArrowRight } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { DISCORD_SUPPORT_URL } from '../config'

const PLANNED = [
  {
    Icon: Target,
    title: 'Sharper detection',
    body: 'A larger, continuously-updated set of scam patterns and lookalike domains, tuned from real reports instead of a static list.',
  },
  {
    Icon: BarChart3,
    title: 'Analytics',
    body: 'A history of every action PySecured has taken in your server, with trends over time — not just the live log feed.',
  },
  {
    Icon: Zap,
    title: 'Priority support',
    body: 'Faster answers when something needs a human, through the support server.',
  },
]

export default function Premium() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Premium"
        description="PySecured Premium adds a fully customizable Discord ticket system and more — currently out for QA testing."
        path="/premium"
      />
      <SiteHeader />

      <section className="relative">
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full bg-[var(--py-yellow)] blur-[130px] animate-glow"
        />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-5">
            Premium · out for QA testing
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6">
            Everything here is being tested right now.
          </h1>
          <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
            Premium is currently in QA — accessible to the QA Team role in
            our Discord, not open to everyone yet. Everything below either
            works today for testers or is planned next.
          </p>
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Join the Discord for QA access
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </a>
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-4">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
            Available now, for QA
          </p>
          <div className="rounded-xl border border-[var(--py-blue)]/40 bg-[var(--bg-raised)]/60 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/30 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-[var(--py-blue)]" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-white mb-2">
                  A fully customizable ticket system
                </h2>
                <p className="text-sm text-[var(--mist)] leading-relaxed mb-4">
                  A panel embed with a button that opens a private channel per
                  person — configure the panel's channel, which category
                  tickets are created under, which roles can see and reply to
                  them, a dedicated log channel with a transcript on close,
                  and the panel's title, description, button label, and
                  color, all from the dashboard.
                </p>
                <ul className="text-sm text-[var(--mist)] space-y-1.5 list-disc pl-5 marker:text-[var(--py-blue)]">
                  <li>Custom embed — title, description, color, button label</li>
                  <li>Pick the category tickets are created in</li>
                  <li>Choose exactly which roles can access tickets</li>
                  <li>Dedicated log channel with a transcript on close</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 py-16">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
            Planned next
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5 mt-4">
          {PLANNED.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 100}>
              <div className="card-interactive h-full rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--line)] flex items-center justify-center mb-3">
                  <item.Icon className="w-5 h-5 text-[var(--mist)]" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <p className="text-center text-xs text-[var(--mist-dim)] mt-10">
            No price or public release date yet — the Discord is the most
            accurate place to hear when that changes.
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
