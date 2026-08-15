import { useState } from 'react'
import {
  BookOpen, ShieldAlert, Gavel, UserCheck, Ticket, Smile, Gift, UserPlus,
  MessageSquare, Trophy, Star, ScrollText, Lightbulb, BarChart2, Search,
} from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import Reveal from '../components/Reveal'

const COMMANDS = [
  { cmd: '/setup', desc: 'Open the interactive setup panel in Discord', perm: 'Manage Server' },
  { cmd: '/dashboard', desc: 'Get a link to the web dashboard', perm: 'Manage Server' },
  { cmd: '/pysecured', desc: 'About PySecured, version, and support links', perm: 'Everyone' },
  { cmd: '/invite', desc: 'Get an invite link to add PySecured elsewhere', perm: 'Everyone' },
  { cmd: '/premium', desc: 'What premium includes and how to get it', perm: 'Everyone' },
  { cmd: '/rank', desc: 'Check your level and XP (or someone else\'s)', perm: 'Everyone' },
  { cmd: '/suggest', desc: 'Submit a suggestion for the server', perm: 'Everyone' },
  { cmd: '/approve', desc: 'Approve a suggestion by message ID', perm: 'Manage Server' },
  { cmd: '/decline', desc: 'Decline a suggestion by message ID', perm: 'Manage Server' },
  { cmd: '/warn', desc: 'Warn a member — logged, with history', perm: 'Timeout Members' },
  { cmd: '/warnings', desc: "View a member's warning history", perm: 'Timeout Members' },
  { cmd: '/clearwarnings', desc: 'Clear all warnings for a member', perm: 'Manage Server' },
  { cmd: '/mute', desc: 'Time a member out for a set number of minutes', perm: 'Timeout Members' },
  { cmd: '/unmute', desc: "Remove a member's timeout", perm: 'Timeout Members' },
  { cmd: '/kick', desc: 'Kick a member', perm: 'Kick Members' },
  { cmd: '/ban', desc: 'Ban a member, optionally deleting recent messages', perm: 'Ban Members' },
  { cmd: '/softban', desc: 'Kick and wipe recent messages — they can rejoin', perm: 'Ban Members' },
  { cmd: '/purge', desc: 'Bulk-delete recent messages, optionally from one member', perm: 'Manage Messages' },
]

const FEATURES = [
  {
    Icon: ShieldAlert,
    title: 'Security & moderation',
    body: 'Watches every message for hacked-account behaviour — scam links, fake nitro giveaways, mass pings — and automatically quarantines, times out, kicks, or bans. Includes auto-mod for excessive caps, repeated characters, and a word blacklist, plus a honeypot trap channel where any message triggers instant action.',
    setup: 'Settings → General, then set a log channel so you can see what it does.',
  },
  {
    Icon: Gavel,
    title: 'Moderation commands',
    body: 'Manual moderation with warning history, custom logging, optional DM-to-member, and optional required reasons. Role hierarchy is always enforced — nobody can action someone at or above their own role, or above PySecured.',
    setup: 'Settings → Moderation. Off by default; running a command while off explains how to enable it.',
  },
  {
    Icon: UserCheck,
    title: 'Verification',
    body: 'A Verify button that sends members through Discord sign-in on our site, screens the account for risk signals — age, 2FA, verified email, repeat connections — then grants a role and logs every signal.',
    setup: 'Settings → Verification. Pick a channel and the role to grant, then post the panel.',
  },
  {
    Icon: Ticket,
    title: 'Tickets',
    body: 'A button panel, or multi-panels with a dropdown where each option routes to its own category, support team, and opening message. Transcripts are saved on close.',
    setup: 'Settings → Tickets for a simple panel, or Ticket Panels for dropdowns.',
  },
  {
    Icon: ScrollText,
    title: 'Message logging',
    body: 'Records edits and deletions with the before and after, bulk deletes with a per-author breakdown, and attachment names. Supports an ignore list for private channels.',
    setup: 'Settings → Message Log.',
  },
  {
    Icon: Smile,
    title: 'Reaction roles',
    body: 'One panel message — react with an emoji, get a role. Survives restarts.',
    setup: 'Settings → Reaction Roles. Add emoji-role pairs and publish.',
  },
  {
    Icon: Trophy,
    title: 'Leveling & rewards',
    body: 'Members earn XP from activity with an anti-spam cooldown. Grant roles automatically at chosen levels, either stacking or keeping only the highest tier.',
    setup: 'Settings → Leveling. Members check progress with /rank.',
  },
  {
    Icon: Gift,
    title: 'Giveaways',
    body: 'Set a prize, duration, and number of winners. Entries are tracked live and winners picked automatically, with an optional required role.',
    setup: 'Settings → Giveaways.',
  },
  {
    Icon: UserPlus,
    title: 'Welcome & auto-role',
    body: 'Greet new members with a fully custom embed, and assign a role the moment they join. Supports placeholders for name, server, and member count.',
    setup: 'Settings → Welcome.',
  },
  {
    Icon: Lightbulb,
    title: 'Suggestions',
    body: 'Members submit ideas with /suggest, the bot posts them with vote reactions, and staff approve or decline with a reason — which rewrites the original post.',
    setup: 'Settings → Suggestions.',
  },
  {
    Icon: Star,
    title: 'Starboard',
    body: 'Messages that reach a reaction threshold get pinned to a highlights channel. Re-reactions update the existing post rather than duplicating it.',
    setup: 'Settings → Starboard.',
  },
  {
    Icon: MessageSquare,
    title: 'Custom commands',
    body: 'Define a trigger word or phrase and what PySecured replies with. Exact or contains matching.',
    setup: 'Settings → Custom Commands.',
  },
  {
    Icon: BarChart2,
    title: 'Stats channels',
    body: 'Channel names that display live member, human, bot, online, role, channel, and boost counts.',
    setup: 'Settings → Stats Channels. Make a locked voice channel and point one at it.',
  },
]

export default function Docs() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const commands = q
    ? COMMANDS.filter((c) => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    : COMMANDS
  const features = q
    ? FEATURES.filter(
        (f) => f.title.toLowerCase().includes(q) || f.body.toLowerCase().includes(q)
      )
    : FEATURES

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SEO
        title="Docs"
        description="Every PySecured command and feature, what it does, and where to set it up."
        path="/docs"
      />
      <div
        aria-hidden
        className="absolute -top-24 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--py-blue)] blur-[110px] animate-glow opacity-15 pointer-events-none"
      />
      <SiteHeader />

      <main className="relative max-w-4xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[var(--py-blue)]" strokeWidth={1.75} />
            </div>
            <p className="eyebrow">Documentation</p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Everything PySecured does
          </h1>
          <p className="text-[var(--mist)] max-w-xl mb-8">
            Every command and feature, what it's for, and where to turn it on. Nothing is enabled
            by default — the bot won't touch your server until you decide what you want.
          </p>

          <div className="relative mb-10 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mist-dim)]" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands and features..."
              className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white pl-10 pr-3 py-2.5 field-focus"
            />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="font-display text-xl font-bold text-white mb-1">Commands</h2>
          <p className="text-sm text-[var(--mist-dim)] mb-5">
            Permissions are Discord's own — you can fine-tune who can run each command under
            Server Settings → Integrations → PySecured.
          </p>
          <div className="surface rounded-xl border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden mb-14">
            {commands.length === 0 && (
              <p className="text-sm text-[var(--mist-dim)] px-5 py-4">No commands match "{query}".</p>
            )}
            {commands.map((c) => (
              <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <code className="font-mono text-sm text-[var(--py-blue)] sm:w-40 shrink-0">{c.cmd}</code>
                <span className="text-sm text-[var(--mist)] flex-1">{c.desc}</span>
                <span className="font-mono text-[10px] text-[var(--mist-dim)] border border-[var(--line)] rounded-full px-2 py-0.5 shrink-0">
                  {c.perm}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="font-display text-xl font-bold text-white mb-5">Features</h2>
          <div className="space-y-4">
            {features.length === 0 && (
              <p className="text-sm text-[var(--mist-dim)]">No features match "{query}".</p>
            )}
            {features.map((f) => (
              <div key={f.title} className="surface rounded-xl border border-[var(--line)] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center shrink-0">
                    <f.Icon className="w-4 h-4 text-[var(--py-blue)]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-white mb-1.5">{f.title}</h3>
                    <p className="text-sm text-[var(--mist)] leading-relaxed mb-2">{f.body}</p>
                    <p className="text-xs text-[var(--mist-dim)]">
                      <span className="text-[var(--py-blue)]">Set up:</span> {f.setup}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  )
}
