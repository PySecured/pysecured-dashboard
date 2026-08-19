import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, ShieldAlert, Ticket, Smile, Gift, UserPlus, BarChart3, LayoutDashboard,
  MessageSquare, Trophy, Star, Database, Gavel, UserCheck, ShieldCheck, CalendarClock,
  ScrollText, Lightbulb, BarChart2, FileText, Sparkles, Moon, ShieldX, Pin, Undo2, Mail, Crown,
  Check, Plus,
} from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import Reveal from '../components/Reveal'
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

const SPOTLIGHTS = [
  {
    Icon: ShieldAlert,
    eyebrow: 'Security',
    title: 'Catches hacked accounts before your members see them',
    body: "A compromised account doesn't behave like its owner — it posts scam links, fake nitro giveaways, and mass pings within seconds of being taken over. PySecured watches for exactly that and acts before the damage spreads.",
    points: [
      'Scam link and lookalike-domain detection',
      'A honeypot trap channel that catches bots instantly',
      'Auto-mod for caps, spam, and blocked words',
      'Quarantine, timeout, kick or ban — your choice',
    ],
    panelLabel: 'What it catches',
    panel: [
      'scam phrase ("free nitro")',
      'lookalike domain ("discocrd.gg")',
      'mass mentions (7 pinged)',
      'Discord invite link',
      'excessive caps (92%)',
    ],
  },
  {
    Icon: UserCheck,
    eyebrow: 'Verification',
    title: 'Screen out alt and throwaway accounts at the door',
    body: 'One button, a Discord sign-in, and PySecured checks the account before letting anyone in — then logs every signal it found so your moderators can review anything borderline.',
    points: [
      'Account age and 2FA checks',
      'Flags repeat connections as possible alts',
      'Auto-reject high-risk accounts, or just log them',
      'Grants a role automatically once verified',
    ],
    panelLabel: 'Verification log',
    panel: [
      'risk: LOW — account 2y old',
      'risk: MEDIUM — new account (3d)',
      'risk: HIGH — no 2FA, same IP as 2 others',
      'rejected — account too new',
    ],
  },
  {
    Icon: LayoutDashboard,
    eyebrow: 'Dashboard',
    title: 'Every setting in one place, not buried in chat commands',
    body: "Twenty-eight features with a few hundred settings between them. That stopped being something a Discord embed could present clearly a long time ago — so all of it lives on the web, and nothing is enabled until you switch it on.",
    points: [
      'Grouped sidebar — Security, Community, Premium',
      'Per-server settings, changed live',
      'Turn individual commands on or off',
      'Works on mobile too',
    ],
    panelLabel: 'Modules',
    panel: [
      'Protection            ✓ on',
      'Verification          ✓ on',
      'Tickets               ✓ on',
      'Leveling              ✗ off',
      'Starboard             ✗ off',
    ],
  },
]

const FREE_LIST = [
  'Security, auto-mod and the trap channel',
  'Moderation commands with warning history',
  'Verification with alt detection',
  'Tickets, including multi-panel dropdowns',
  'Reaction roles, giveaways, starboard',
  'Leveling with role rewards',
  'Welcome messages, auto-role, role persistence',
  'Message logging, invite tracking, suggestions',
]

const PREMIUM_LIST = [
  'Anti-nuke protection',
  'Raid mode and auto-lockdown',
  'Member restore after a raid',
  'Server backup and restore',
  'Analytics and CSV export',
  'Per-server bot identity and branding',
  'Scheduled announcements, hosted transcripts',
]

const FAQ = [
  {
    q: 'Is PySecured really free?',
    a: "Yes. Every feature listed under Free is genuinely free with no usage caps designed to push you into paying. Premium exists for a small set of harder-to-build features, starting at €2.99, but nothing in the free tier is held back to sell it.",
  },
  {
    q: 'Will it start moderating my server as soon as I add it?',
    a: "No. Nothing is switched on when the bot joins. It won't take a single action until you enable something in the dashboard, so you can add it and look around safely.",
  },
  {
    q: 'What permissions does it need?',
    a: 'It depends what you turn on. Protection and moderation need Manage Roles, Kick and Ban. Verification needs Manage Roles. Invite tracking needs Manage Server. The dashboard tells you when something is missing rather than silently failing.',
  },
  {
    q: 'How do I set it up?',
    a: 'Add the bot, log into the dashboard with Discord, pick your server, and the overview page suggests what to turn on first. Most servers are set up in a couple of minutes.',
  },
  {
    q: 'Can I control who can use each command?',
    a: "Yes — through Discord's own permission system under Server Settings → Integrations, and you can also switch individual commands off entirely from the dashboard.",
  },
]

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
    Icon: ScrollText,
    title: 'Message logging',
    body: 'Logs every edit and deletion with the before and after, so moderators can see what was actually said.',
  },
  {
    Icon: Lightbulb,
    title: 'Suggestions',
    body: 'Members submit ideas with /suggest, everyone votes, and staff approve or decline with a reason.',
  },
  {
    Icon: BarChart2,
    title: 'Stats channels',
    body: 'Live member, bot, and boost counts displayed right in your channel list.',
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
  {
    Icon: ShieldAlert,
    title: 'Raid mode',
    body: 'Detects join spikes and locks the server down before the damage starts — with auto-release so it unlocks itself.',
    premium: true,
  },
  {
    Icon: CalendarClock,
    title: 'Scheduled announcements',
    body: 'Recurring or one-off posts on a schedule — rules reminders, weekly events, timed drops.',
    premium: true,
  },
  {
    Icon: Mail,
    title: 'Invite tracking',
    body: "See who invited each new member, with a leaderboard that counts people who actually stayed — not just raw invite numbers.",
  },
  {
    Icon: Undo2,
    title: 'Role persistence',
    body: "Roles come back when someone rejoins — and quarantines always do, so nobody can shed a sanction by leaving and coming back.",
  },
  {
    Icon: Pin,
    title: 'Sticky messages',
    body: 'Keep rules or a notice pinned to the bottom of a busy channel, reposted automatically as conversation moves on.',
  },
  {
    Icon: ShieldX,
    title: 'Anti-nuke',
    body: 'Stops a compromised admin or rogue mod from mass-deleting channels, wiping roles, or ban-spreeing your members.',
    premium: true,
  },
  {
    Icon: Moon,
    title: 'AFK',
    body: "Members mark themselves away and anyone who mentions them is told automatically — cleared the moment they post again.",
  },
  {
    Icon: Sparkles,
    title: 'Per-server bot identity',
    body: 'Give the bot its own name, avatar, banner, and bio in your server, separate from everywhere else.',
    premium: true,
  },
  {
    Icon: FileText,
    title: 'Hosted transcripts',
    body: 'Every closed ticket, searchable from the dashboard by channel, staff member, or what was said inside.',
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

        <div className="relative max-w-3xl mx-auto px-6 pt-12 sm:pt-20 pb-16 text-center">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-5">
              The all-in-one Discord bot
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-6">
              The all-in-one<br />bot for Discord
            </h1>
            <p className="text-[var(--mist)] text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              PySecured is a complete Discord bot that protects, moderates, and grows your
              server — security, tickets, verification, leveling and more, managed from one
              dashboard and mostly free.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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

          </div>

        </div>
      </section>

      {/* Trust band */}
      {status?.bot?.online && (
        <section className="relative border-y border-[var(--line)] bg-[var(--bg-raised)]/40">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {[
              [status.bot.guild_count?.toLocaleString?.() ?? status.bot.guild_count, 'servers protected'],
              [status.bot.member_count?.toLocaleString?.() ?? '—', 'members protected'],
              ['28', 'features included'],
              ['25', 'slash commands'],
              [`${status.bot.latency_ms} ms`, 'response time'],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">{v}</p>
                <p className="text-xs text-[var(--mist-dim)] mt-1">{l}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features — free and premium kept visually distinct */}
      <section className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow mb-3">Included free</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Everything most servers ever need
          </h2>
          <p className="text-[var(--mist)] max-w-xl mb-10">
            No trials, no usage caps designed to push you into paying.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.filter((f) => !f.premium).map((f, idx) => (
            <Reveal key={f.title} delay={idx * 50}>
              <div className="card-interactive h-full surface rounded-2xl border border-[var(--line)] p-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center mb-3">
                  <f.Icon className="w-5 h-5 text-[var(--py-blue)]" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="flex items-center gap-2 mt-16 mb-3">
            <span className="crown"><Crown className="w-2.5 h-2.5" strokeWidth={2.75} /></span>
            <p className="eyebrow">Premium</p>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            For when things go wrong
          </h2>
          <p className="text-[var(--mist)] max-w-xl mb-10">
            Recovery, insight, and control. Available now from €2.99, applied to your
            Discord account the moment you pay.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.filter((f) => f.premium).map((f, idx) => (
            <Reveal key={f.title} delay={idx * 50}>
              <div className="card-interactive h-full surface rounded-2xl border border-[var(--py-yellow)]/25 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--py-yellow)]/10 border border-[var(--py-yellow)]/25 flex items-center justify-center">
                    <f.Icon className="w-5 h-5 text-[var(--py-yellow)]" strokeWidth={1.75} />
                  </div>
                  <span className="crown"><Crown className="w-2.5 h-2.5" strokeWidth={2.75} /></span>
                </div>
                <h3 className="font-display text-base font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--mist)] leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Spotlights */}
      <section className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 space-y-16 sm:space-y-24">
        {SPOTLIGHTS.map((sp, idx) => (
          <Reveal key={sp.title}>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Alternate which side the panel sits on via order, rather
                  than direction:rtl — order can't affect text rendering. */}
              <div className={idx % 2 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-2 mb-3">
                  <sp.Icon className="w-4 h-4 text-[var(--py-blue)]" strokeWidth={2} />
                  <p className="eyebrow">{sp.eyebrow}</p>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                  {sp.title}
                </h3>
                <p className="text-[var(--mist)] leading-relaxed mb-5">{sp.body}</p>
                <ul className="space-y-2">
                  {sp.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-[var(--mist)]">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`surface rounded-2xl border border-[var(--line)] p-5 ${idx % 2 ? 'lg:order-1' : ''}`}>
                <p className="eyebrow mb-3">{sp.panelLabel}</p>
                <div className="space-y-2">
                  {sp.panel.map((row) => (
                    <div key={row} className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--py-blue)] shrink-0" />
                      <span className="text-xs text-[var(--mist)] font-mono">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Free vs Premium */}
      <section className="relative max-w-4xl mx-auto px-6 py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow mb-3 text-center">Pricing</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
            Almost everything is free
          </h2>
          <p className="text-[var(--mist)] text-center max-w-lg mx-auto mb-10">
            No feature is crippled to push you into paying. Premium is a handful of things
            that are genuinely harder to build, starting at €2.99.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          <Reveal>
            <div className="surface rounded-2xl border border-[var(--line)] p-6 h-full">
              <h3 className="font-display text-lg font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-[var(--mist-dim)] mb-5">Everything most servers ever need</p>
              <ul className="space-y-2">
                {FREE_LIST.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--mist)]">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="surface rounded-2xl border border-[var(--py-blue)]/40 p-6 h-full">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-lg font-bold text-white">Premium</h3>
                <span className="crown"><Crown className="w-2.5 h-2.5" strokeWidth={2.75} /></span>
              </div>
              <p className="text-xs text-[var(--mist-dim)] mb-5">From €2.99 — available now</p>
              <ul className="space-y-2">
                {PREMIUM_LIST.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--mist)]">
                    <Crown className="w-3.5 h-3.5 text-[var(--py-yellow)] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/premium" className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline mt-5">
                See what premium includes
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative max-w-3xl mx-auto px-6 py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow mb-3 text-center">FAQ</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
            Common questions
          </h2>
        </Reveal>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details className="surface group rounded-2xl border border-[var(--line)] px-5 py-4">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  <Plus className="w-4 h-4 text-[var(--mist-dim)] shrink-0 transition-transform group-open:rotate-45" strokeWidth={2} />
                </summary>
                <p className="text-sm text-[var(--mist)] leading-relaxed mt-3">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <Reveal className="card-interactive surface rounded-2xl border border-[var(--line)] px-6 sm:px-8 py-12 sm:py-14 text-center">
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
