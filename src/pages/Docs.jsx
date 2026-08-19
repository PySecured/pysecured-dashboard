import { useState } from 'react'
import {
  ShieldAlert, Gavel, UserCheck, Ticket, Smile, Gift, UserPlus,
  MessageSquare, Trophy, Star, ScrollText, Lightbulb, BarChart2, Search, Moon, Megaphone, Pin, Undo2, Mail,
} from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import Reveal from '../components/Reveal'

const COMMAND_GROUPS = [
  { label: 'Getting started', items: [
  { cmd: '/setup', desc: 'Get a link to this server\'s dashboard settings', perm: 'Manage Server' },
  { cmd: '/dashboard', desc: 'Get a link to the web dashboard', perm: 'Manage Server' },
  { cmd: '/pysecured', desc: 'About PySecured, version, and support links', perm: 'Everyone' },
  { cmd: '/invite', desc: 'Get an invite link to add PySecured elsewhere', perm: 'Everyone' },
  { cmd: '/premium', desc: 'What premium includes and how to get it', perm: 'Everyone' },
  ]},
  { label: 'Community', items: [
  { cmd: '/rank', desc: 'Check your level and XP (or someone else\'s)', perm: 'Everyone' },
  { cmd: '/suggest', desc: 'Submit a suggestion for the server', perm: 'Everyone' },
  { cmd: '/afk', desc: "Mark yourself away — cleared when you next post", perm: 'Everyone' },
  { cmd: '/serverinfo', desc: 'Details about this server', perm: 'Everyone' },
  { cmd: '/userinfo', desc: "Details about a member's account and roles", perm: 'Everyone' },
  { cmd: '/avatar', desc: "View someone's avatar in full size", perm: 'Everyone' },
  { cmd: '/invites', desc: 'See how many people someone has invited', perm: 'Everyone' },
  { cmd: '/inviteleaderboard', desc: 'Top inviters in this server', perm: 'Everyone' },
  { cmd: '/temprole', desc: 'Grant a role that expires automatically', perm: 'Manage Roles' },
  { cmd: '/removetemprole', desc: 'Remove a temporary role early, cancelling its expiry', perm: 'Manage Roles' },
  { cmd: '/approve', desc: 'Approve a suggestion by message ID', perm: 'Manage Server' },
  { cmd: '/decline', desc: 'Decline a suggestion by message ID', perm: 'Manage Server' },
  ]},
  { label: 'Moderation', items: [
  { cmd: '/warn', desc: 'Warn a member — logged, with history', perm: 'Timeout Members' },
  { cmd: '/warnings', desc: "View a member's warning history", perm: 'Timeout Members' },
  { cmd: '/clearwarnings', desc: 'Clear all warnings for a member', perm: 'Manage Server' },
  { cmd: '/mute', desc: 'Time a member out for a set number of minutes', perm: 'Timeout Members' },
  { cmd: '/unmute', desc: "Remove a member's timeout", perm: 'Timeout Members' },
  { cmd: '/kick', desc: 'Kick a member', perm: 'Kick Members' },
  { cmd: '/ban', desc: 'Ban a member, optionally deleting recent messages', perm: 'Ban Members' },
  { cmd: '/softban', desc: 'Kick and wipe recent messages — they can rejoin', perm: 'Ban Members' },
  { cmd: '/purge', desc: 'Bulk-delete recent messages, optionally from one member', perm: 'Manage Messages' },
  ]},
]

const COMMANDS = COMMAND_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })))

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
    Icon: Moon,
    title: 'AFK',
    body: 'Members mark themselves away with /afk. Anyone who mentions them is told, with how long ago they left and their note. Posting any message clears it automatically.',
    setup: 'Settings → AFK.',
  },
  {
    Icon: Mail,
    title: 'Invite tracking',
    body: "Records which invite each new member used and who created it, with a running tally per inviter. Tracks both total invited and how many have since left, so the leaderboard reflects real growth rather than raw invite counts. Needs Manage Server to read invite data.",
    setup: 'Settings → Invite Tracking.',
  },
  {
    Icon: Undo2,
    title: 'Role persistence',
    body: "Remembers a member's roles when they leave and restores them if they rejoin. Quarantine roles are always restored regardless of the setting, so leaving and rejoining can't be used to clear a sanction. Records are kept 90 days and you can exclude roles that should always be granted by hand.",
    setup: 'Settings → Role Persistence.',
  },
  {
    Icon: Pin,
    title: 'Sticky messages',
    body: 'Keeps a message at the bottom of a channel by reposting it as conversation moves on. The old copy is deleted so only one ever exists, with a minimum gap so busy channels do not get flooded.',
    setup: 'Settings → Sticky Messages.',
  },
  {
    Icon: Megaphone,
    title: 'Auto-publish',
    body: 'Automatically publishes messages posted in announcement channels so servers following yours actually receive them.',
    setup: 'Settings → Auto-Publish. Only works in Discord Announcement channels.',
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

      <main className="relative max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
        <Reveal>
          <div className="mb-6">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Everything PySecured does</h1>
          <p className="text-sm text-[var(--mist-dim)] mt-1.5 max-w-2xl">Every command and feature, what it's for, and where to turn it on. Nothing is enabled by default — the bot won't touch your server until you decide what you want.</p>
        </div>

          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mist-dim)]" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands and features..."
              className="w-full rounded-xl surface border border-[var(--line)] text-sm text-white pl-10 pr-3 py-2.5 field-focus"
            />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="font-display text-lg font-bold text-white mb-1">Commands</h2>
          <p className="text-sm text-[var(--mist-dim)] mb-5">
            Permissions are Discord's own — you can fine-tune who can run each command under
            Server Settings → Integrations → PySecured.
          </p>
          <div className="surface rounded-xl border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden mb-10">
            {commands.length === 0 && (
              <p className="text-sm text-[var(--mist-dim)] px-5 py-4">No commands match "{query}".</p>
            )}
            {commands.map((c) => (
              <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                <code className="font-mono text-[13px] text-[var(--py-blue)] sm:w-44 shrink-0">{c.cmd}</code>
                <span className="text-[13px] text-[var(--mist)] flex-1">{c.desc}</span>
                <span className="font-mono text-[10px] text-[var(--mist-dim)] border border-[var(--line)] rounded-full px-2 py-0.5 shrink-0">
                  {c.perm}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="font-display text-lg font-bold text-white mb-4">Features</h2>
          <div className="space-y-3">
            {features.length === 0 && (
              <p className="text-sm text-[var(--mist-dim)]">No features match "{query}".</p>
            )}
            {features.map((f) => (
              <div key={f.title} className="surface rounded-2xl border border-[var(--line)] p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center shrink-0">
                    <f.Icon className="w-4 h-4 text-[var(--py-blue)]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-white mb-1.5">{f.title}</h3>
                    <p className="text-[13px] text-[var(--mist)] leading-relaxed mb-2">{f.body}</p>
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
