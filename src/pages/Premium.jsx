import { BarChart3, Database, ShieldCheck, ArrowRight } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { DISCORD_SUPPORT_URL } from '../config'

const AVAILABLE_NOW = [
  {
    Icon: BarChart3,
    title: 'Real analytics, read live off the bot',
    body: "A history of every action PySecured has taken in your server — not fabricated numbers, every entry comes from something that actually happened. Trend comparisons, a 14-day activity chart, and a breakdown of what's actually triggering detections.",
    bullets: [
      'This-week vs last-week trend on every action taken',
      '14-day daily activity chart',
      'Breakdown by action type and by what triggered it',
      'Recent activity feed, most recent first',
    ],
  },
  {
    Icon: Database,
    title: 'Server backup & restore',
    body: 'Snapshot your roles, categories, and channels, restore them whenever you need. Restoring only ever adds — it never deletes or modifies anything currently in your server, so there\'s no way a bad restore makes things worse.',
    bullets: [
      'One-click snapshot of every role, category, and channel',
      'Keep up to 10 backups per server',
      'Restore is additive-only — nothing existing is ever touched',
      'See exactly what got created after every restore',
    ],
  },
  {
    Icon: ShieldCheck,
    title: 'Member restore after a raid',
    body: "If your server gets raided and members are mass-kicked, pull them back in one click. Members who verified through PySecured personally authorized this during verification — so restore is instant, consented, and doesn't need anyone to click an invite again.",
    bullets: [
      'One click re-adds every verified member who was removed',
      'Anyone still in the server is skipped — safe to run twice',
      'Restore tokens are encrypted at rest, never stored in plain text',
      'Covers members who verified — the more who verify, the more you recover',
    ],
  },
]

export default function Premium() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Premium"
        description="PySecured Premium — analytics, server backup & restore, and member restore after a raid. Everything else stays free."
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
            Almost everything is free. This is the "almost."
          </h1>
          <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
            Moderation, verification, moderation commands, tickets, reaction roles, giveaways, welcome messages,
            custom commands, leveling, and starboard — all free, no premium wall. Premium is for
            the handful of things that genuinely need more work to build right, currently in QA
            testing with our Discord's QA Team.
          </p>
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press group inline-flex items-center gap-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Join the Discord for QA access
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </a>
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-16">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
            Available now, for QA
          </p>
        </Reveal>
        <div className="space-y-5">
          {AVAILABLE_NOW.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 100}>
              <div className="rounded-xl border border-[var(--py-blue)]/40 bg-[var(--bg-raised)]/60 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/30 flex items-center justify-center">
                    <item.Icon className="w-6 h-6 text-[var(--py-blue)]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white mb-2">{item.title}</h2>
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
          <p className="text-center text-xs text-[var(--mist-dim)] mt-10">
            More premium features are being scoped out — no price or date yet.
            The Discord is the most accurate place to hear what's next.
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
