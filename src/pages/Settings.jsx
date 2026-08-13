import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Save, ShieldAlert, Radar, UserPlus, Users, Ticket, Lock, BarChart3,
  TrendingUp, TrendingDown, Minus, Smile, Gift, Plus, X, Clock, Trophy,
  MessageSquare, Star, Database, Trophy as TrophyIcon, RotateCcw, Gavel,
  ShieldCheck, UserCheck, AlertTriangle,
} from 'lucide-react'
import { api } from '../api'
import { Toggle, Field, Select, NumberInput, TextInput, TextArea, ColorInput, Section, ActionButton } from '../components/Form'
import { BarChart } from '../components/BarChart'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { useAuth } from '../AuthContext'
import { DISCORD_SUPPORT_URL } from '../config'

const ACTION_OPTIONS = [
  { value: 'role', label: 'Quarantine role (blocks sending/typing)' },
  { value: 'timeout', label: 'Timeout' },
  { value: 'kick', label: 'Kick' },
  { value: 'ban', label: 'Ban' },
]

const MATCH_TYPE_OPTIONS = [
  { value: 'exact', label: 'Exact match' },
  { value: 'contains', label: 'Contains anywhere' },
]

const TAB_GROUPS = [
  {
    label: 'Security',
    tabs: [
      { id: 'general', label: 'General', Icon: ShieldAlert },
      { id: 'verification', label: 'Verification', Icon: UserCheck },
      { id: 'moderation', label: 'Moderation', Icon: Gavel },
      { id: 'trap', label: 'Trap channel', Icon: Radar },
      { id: 'whitelist', label: 'Whitelist', Icon: Users },
    ],
  },
  {
    label: 'Community',
    tabs: [
      { id: 'welcome', label: 'Welcome', Icon: UserPlus },
      { id: 'reaction_roles', label: 'Reaction Roles', Icon: Smile },
      { id: 'giveaways', label: 'Giveaways', Icon: Gift },
      { id: 'tickets', label: 'Tickets', Icon: Ticket },
      { id: 'custom_commands', label: 'Custom Commands', Icon: MessageSquare },
      { id: 'leveling', label: 'Leveling', Icon: TrophyIcon },
      { id: 'starboard', label: 'Starboard', Icon: Star },
    ],
  },
  {
    label: 'Premium',
    tabs: [
      { id: 'analytics', label: 'Analytics', Icon: BarChart3, premium: true },
      { id: 'backups', label: 'Backup & Restore', Icon: Database, premium: true },
      { id: 'member_restore', label: 'Member Restore', Icon: ShieldCheck, premium: true },
    ],
  },
]

const TRIGGER_LABEL = {
  scam_link: 'Scam links',
  scam_phrase: 'Scam phrases',
  invite_link: 'Invite links',
  mass_mentions: 'Mass mentions',
  trap_channel: 'Trap channel',
  caps: 'Excessive caps',
  repeat_spam: 'Repeated characters',
  blacklist: 'Blacklisted words',
  manual: 'Manual (moderator)',
  other: 'Other',
  unknown: 'Unknown',
}

const ACTION_LABEL = {
  role: 'Quarantine', timeout: 'Timeout', kick: 'Kick', ban: 'Ban',
  warn: 'Warn', softban: 'Softban', unknown: 'Unknown',
}

export default function Settings() {
  const { guildId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tab, setTab] = useState('general')
  const [config, setConfig] = useState(null)
  const [roles, setRoles] = useState([])
  const [channels, setChannels] = useState([])
  const [categories, setCategories] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [analyticsEvents, setAnalyticsEvents] = useState([])
  const [analyticsError, setAnalyticsError] = useState(null)
  const [giveaways, setGiveaways] = useState(null)
  const [giveawayForm, setGiveawayForm] = useState({ prize: '', channel_id: '', duration_minutes: 60, winner_count: 1, required_role_id: '' })
  const [giveawayCreating, setGiveawayCreating] = useState(false)
  const [giveawayError, setGiveawayError] = useState(null)
  const [leaderboard, setLeaderboard] = useState(null)
  const [leaderboardError, setLeaderboardError] = useState(null)
  const [backups, setBackups] = useState(null)
  const [backupError, setBackupError] = useState(null)
  const [backupBusy, setBackupBusy] = useState(null)
  const [backupResult, setBackupResult] = useState(null)
  const [verifications, setVerifications] = useState(null)
  const [verificationError, setVerificationError] = useState(null)
  const [restoreBusy, setRestoreBusy] = useState(false)
  const [restoreResult, setRestoreResult] = useState(null)
  const [restoreError, setRestoreError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.getConfig(guildId), api.roles(guildId), api.channels(guildId)])
      .then(([cfg, r, c]) => {
        setConfig(cfg)
        setRoles(r)
        setChannels(c)
      })
      .catch((e) => setError(e.message))
  }, [guildId])

  useEffect(() => {
    if (tab === 'tickets' && categories.length === 0) {
      api.categories(guildId).then(setCategories).catch(() => {})
    }
  }, [tab, user, guildId, categories.length])

  useEffect(() => {
    if (tab === 'analytics' && user?.is_premium && !analytics) {
      Promise.all([api.analyticsSummary(guildId), api.analyticsEvents(guildId, 15)])
        .then(([summary, events]) => {
          setAnalytics(summary)
          setAnalyticsEvents(events)
        })
        .catch((e) => setAnalyticsError(e.message))
    }
  }, [tab, user, guildId, analytics])

  useEffect(() => {
    if (tab === 'giveaways' && giveaways === null) {
      api.giveaways(guildId).then(setGiveaways).catch((e) => setGiveawayError(e.message))
    }
  }, [tab, guildId, giveaways])

  useEffect(() => {
    if (tab === 'leveling' && leaderboard === null) {
      api.leaderboard(guildId).then(setLeaderboard).catch((e) => setLeaderboardError(e.message))
    }
  }, [tab, guildId, leaderboard])

  useEffect(() => {
    if (tab === 'backups' && user?.is_premium && backups === null) {
      api.backups(guildId).then(setBackups).catch((e) => setBackupError(e.message))
    }
  }, [tab, user, guildId, backups])

  useEffect(() => {
    if ((tab === 'verification' || tab === 'member_restore') && verifications === null) {
      api.verifications(guildId).then(setVerifications).catch((e) => setVerificationError(e.message))
    }
  }, [tab, guildId, verifications])

  async function runMemberRestore() {
    setRestoreBusy(true)
    setRestoreError(null)
    setRestoreResult(null)
    try {
      setRestoreResult(await api.restoreMembers(guildId))
    } catch (e) {
      setRestoreError(e.message)
    } finally {
      setRestoreBusy(false)
    }
  }

  function addCustomCommand() {
    setConfig((c) => ({
      ...c,
      custom_commands: [...(c.custom_commands || []), { trigger: '', response: '', match_type: 'contains' }],
    }))
  }

  function updateCustomCommand(index, field, value) {
    setConfig((c) => {
      const next = [...(c.custom_commands || [])]
      next[index] = { ...next[index], [field]: value }
      return { ...c, custom_commands: next }
    })
  }

  function removeCustomCommand(index) {
    setConfig((c) => ({
      ...c,
      custom_commands: (c.custom_commands || []).filter((_, i) => i !== index),
    }))
  }

  async function runBackup() {
    setBackupBusy('creating')
    setBackupError(null)
    setBackupResult(null)
    try {
      const created = await api.createBackup(guildId)
      setBackups((b) => [created, ...(b || [])])
    } catch (e) {
      setBackupError(e.message)
    } finally {
      setBackupBusy(null)
    }
  }

  async function runRestore(backupId) {
    setBackupBusy(backupId)
    setBackupError(null)
    setBackupResult(null)
    try {
      const result = await api.restoreBackup(guildId, backupId)
      setBackupResult({ backupId, ...result })
    } catch (e) {
      setBackupError(e.message)
    } finally {
      setBackupBusy(null)
    }
  }

  async function createGiveaway() {
    setGiveawayCreating(true)
    setGiveawayError(null)
    try {
      const created = await api.createGiveaway(guildId, {
        prize: giveawayForm.prize,
        channel_id: giveawayForm.channel_id,
        duration_minutes: Number(giveawayForm.duration_minutes),
        winner_count: Number(giveawayForm.winner_count),
        required_role_id: giveawayForm.required_role_id || null,
      })
      setGiveaways((g) => [created, ...(g || [])])
      setGiveawayForm({ prize: '', channel_id: '', duration_minutes: 60, winner_count: 1, required_role_id: '' })
    } catch (e) {
      setGiveawayError(e.message)
    } finally {
      setGiveawayCreating(false)
    }
  }

  async function endGiveawayNow(id) {
    try {
      const updated = await api.endGiveaway(guildId, id)
      setGiveaways((list) => list.map((g) => (g.id === id ? updated : g)))
    } catch (e) {
      setGiveawayError(e.message)
    }
  }

  function set(key, value) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  function addMapping() {
    setConfig((c) => ({
      ...c,
      reaction_roles_mappings: [...(c.reaction_roles_mappings || []), { emoji: '', role_id: '', label: '' }],
    }))
  }

  function updateMapping(index, field, value) {
    setConfig((c) => {
      const next = [...(c.reaction_roles_mappings || [])]
      next[index] = { ...next[index], [field]: value }
      return { ...c, reaction_roles_mappings: next }
    })
  }

  function removeMapping(index) {
    setConfig((c) => ({
      ...c,
      reaction_roles_mappings: (c.reaction_roles_mappings || []).filter((_, i) => i !== index),
    }))
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const updated = await api.patchConfig(guildId, config)
      setConfig(updated)
      setSavedAt(Date.now())
      return updated
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setSaving(false)
    }
  }

  if (error && !config) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="flex items-center justify-center px-4 py-24">
          <div className="text-center">
            <p className="text-sm text-red-400 mb-3">{error}</p>
            <button onClick={() => navigate('/servers')} className="text-sm text-[var(--py-blue)] hover:underline">
              Back to servers
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="skeleton h-4 w-24 rounded mb-6" />
          <div className="flex gap-2 mb-6">
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-8 w-28 rounded-lg" />
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
          <div className="skeleton h-40 rounded-xl mb-4" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }))
  const channelOptions = channels.map((c) => ({ value: c.id, label: `#${c.name}` }))

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO title="Server Settings" description="Configure PySecured protection for this server." path={`/servers/${guildId}`} noindex />
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <button
            onClick={() => navigate('/servers')}
            className="inline-flex items-center gap-1 text-sm text-[var(--mist-dim)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            Servers
          </button>
          <div className="flex items-center gap-3">
            {savedAt && <span className="text-xs text-emerald-400">Saved</span>}
            <button
              onClick={save}
              disabled={saving}
              className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-1.5"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={2.25} />
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <nav className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {TAB_GROUPS.map((group) => (
              <div key={group.label} className="contents lg:block lg:mb-4 last:lg:mb-0">
                <p className="hidden lg:block font-mono text-[10px] tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-1.5 px-3">
                  {group.label}
                </p>
                {group.tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2.5 shrink-0 lg:w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      tab === t.id
                        ? 'bg-[var(--py-blue)] text-[#06111f]'
                        : 'text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)]'
                    }`}
                  >
                    <t.Icon className="w-4 h-4 shrink-0" strokeWidth={2.25} />
                    <span className="flex-1">{t.label}</span>
                    {t.premium && !user?.is_premium && <Lock className="w-3 h-3 opacity-70 shrink-0" strokeWidth={2.25} />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div className="min-w-0 max-w-2xl">
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {tab === 'general' && (
          <>
            <Section title="Protection" icon={ShieldAlert}>
              <Toggle
                label="Enable protection"
                description="Scan messages for scam links, phrases, and mass pings"
                checked={config.enabled}
                onChange={(v) => set('enabled', v)}
              />
            </Section>

            <Section title="Action" description="What happens when a message is flagged">
              <Field label="Action">
                <Select value={config.action} onChange={(v) => set('action', v)} options={ACTION_OPTIONS} />
              </Field>
              {config.action === 'role' && (
                <Field label="Quarantine role">
                  <Select
                    value={config.quarantine_role_id}
                    onChange={(v) => set('quarantine_role_id', v)}
                    options={roleOptions}
                    placeholder="Select a role..."
                  />
                </Field>
              )}
              {config.action === 'role' && (
                <ActionButton
                  label="Auto-create & lock quarantine role"
                  description="Saves your settings, then creates the role if needed and blocks it from sending/typing in every channel"
                  onRun={async () => {
                    await save()
                    const result = await api.autoConfigureRole(guildId)
                    setConfig((c) => ({
                      ...c,
                      quarantine_role_id: result.config.quarantine_role_id,
                      action: result.config.action,
                    }))
                    const r = await api.roles(guildId)
                    setRoles(r)
                    return result
                  }}
                  resultText={(r) => `Locked ${r.role_name} across ${r.channels_configured} channel(s).`}
                />
              )}
              {config.action === 'timeout' && (
                <Field label="Timeout length (minutes)">
                  <NumberInput value={config.timeout_minutes} onChange={(v) => set('timeout_minutes', v)} min={1} max={40320} />
                </Field>
              )}
              {config.action === 'ban' && (
                <Field label="Ban length in days (0 = permanent)">
                  <NumberInput value={config.ban_duration_days} onChange={(v) => set('ban_duration_days', v)} min={0} max={3650} />
                </Field>
              )}
              <Field label="Log channel">
                <Select
                  value={config.log_channel_id}
                  onChange={(v) => set('log_channel_id', v)}
                  options={channelOptions}
                  placeholder="Select a channel..."
                />
              </Field>
            </Section>

            <Section title="Detectors">
              <Toggle label="Suspicious/lookalike links" checked={config.detect_links} onChange={(v) => set('detect_links', v)} />
              <Toggle label="Scam/giveaway phrases" checked={config.detect_keywords} onChange={(v) => set('detect_keywords', v)} />
              <Toggle
                label="Discord invite links"
                description="Flags any discord.gg or discord.com/invite link"
                checked={config.detect_invite_links}
                onChange={(v) => set('detect_invite_links', v)}
              />
              <Toggle label="Mass mentions" checked={config.detect_mass_mentions} onChange={(v) => set('detect_mass_mentions', v)} />
              {config.detect_mass_mentions && (
                <Field label="Mass mention threshold — flag at this many pings or more">
                  <NumberInput
                    value={config.mass_mention_threshold}
                    onChange={(v) => set('mass_mention_threshold', v)}
                    min={2}
                    max={50}
                  />
                </Field>
              )}
              <Toggle
                label="Delete flagged message"
                checked={config.delete_flagged_message}
                onChange={(v) => set('delete_flagged_message', v)}
              />
            </Section>

            <Section title="Auto-mod" description="Extra spam filters, all off by default — these use the same action you set above">
              <Toggle
                label="Excessive caps"
                description="Flags messages that are mostly uppercase (short messages are always exempt)"
                checked={config.automod_caps_enabled}
                onChange={(v) => set('automod_caps_enabled', v)}
              />
              {config.automod_caps_enabled && (
                <Field label="Caps threshold — flag at this % uppercase or above">
                  <NumberInput
                    value={config.automod_caps_threshold}
                    onChange={(v) => set('automod_caps_threshold', v)}
                    min={30}
                    max={100}
                  />
                </Field>
              )}

              <Toggle
                label="Repeated characters"
                description="Flags things like 'spaaaaaaaam' or '!!!!!!!!!!'"
                checked={config.automod_repeat_enabled}
                onChange={(v) => set('automod_repeat_enabled', v)}
              />
              {config.automod_repeat_enabled && (
                <Field label="Flag at this many identical characters in a row">
                  <NumberInput
                    value={config.automod_repeat_threshold}
                    onChange={(v) => set('automod_repeat_threshold', v)}
                    min={3}
                    max={50}
                  />
                </Field>
              )}

              <Toggle
                label="Word blacklist"
                description="Flags any message containing one of your blocked words"
                checked={config.automod_blacklist_enabled}
                onChange={(v) => set('automod_blacklist_enabled', v)}
              />
              {config.automod_blacklist_enabled && (
                <Field label="Blocked words — one per line, case-insensitive">
                  <TextArea
                    value={(config.automod_blacklist_words || []).join('\n')}
                    onChange={(v) =>
                      set(
                        'automod_blacklist_words',
                        // Blank lines are stripped here as well as server-side —
                        // an empty entry would otherwise match every message.
                        v.split('\n').map((w) => w.trim()).filter(Boolean)
                      )
                    }
                    rows={4}
                    placeholder={'badword\nanotherword'}
                  />
                </Field>
              )}
            </Section>
          </>
        )}

        {tab === 'verification' && (
          <>
            <Section
              title="Verification"
              icon={UserCheck}
              description="Posts a panel with a Verify button. Members sign in with Discord on our site, get checked, and are given a role automatically."
            >
              <Toggle
                label="Enable verification"
                checked={config.verification_enabled}
                onChange={(v) => set('verification_enabled', v)}
              />
              <Field label="Panel channel">
                <Select
                  value={config.verification_channel_id}
                  onChange={(v) => set('verification_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <Field label="Role given once verified">
                <Select
                  value={config.verification_role_id}
                  onChange={(v) => set('verification_role_id', v)}
                  options={roles.map((r) => ({ value: r.id, label: r.name }))}
                  placeholder="Select a role..."
                />
              </Field>
              <Field label="Verification log channel (optional — falls back to your main log channel)">
                <Select
                  value={config.verification_log_channel_id}
                  onChange={(v) => set('verification_log_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Use the main log channel"
                />
              </Field>
              <ActionButton
                label="Post/refresh verification panel"
                description="Saves your settings, then posts the panel with a working Verify button"
                onRun={async () => {
                  await save()
                  return api.postVerificationPanel(guildId)
                }}
                resultText={(r) => `Posted in #${r.channel_name}.`}
              />
            </Section>

            <Section title="Screening" description="Checks run at the moment someone verifies">
              <Field label="Minimum Discord account age in days (0 = no minimum)">
                <NumberInput
                  value={config.verification_min_account_age_days}
                  onChange={(v) => set('verification_min_account_age_days', v)}
                  min={0}
                  max={365}
                />
              </Field>
              <Toggle
                label="Auto-reject high-risk accounts"
                description="Blocks verification when several risk signals stack up — they're told to contact a moderator"
                checked={config.verification_block_high_risk}
                onChange={(v) => set('verification_block_high_risk', v)}
              />
              <div className="py-3">
                <p className="text-xs text-[var(--mist-dim)] mb-2">What gets checked</p>
                <ul className="text-xs text-[var(--mist)] space-y-1 list-disc pl-5 marker:text-[var(--py-blue)]">
                  <li>Account age — brand-new accounts are the strongest raid signal</li>
                  <li>Whether their email is verified with Discord, and whether they have 2FA</li>
                  <li>Whether they have a custom avatar</li>
                  <li>Whether another verified member shares the same connection (possible alt)</li>
                </ul>
                <p className="text-xs text-[var(--mist-dim)] mt-3">
                  Every signal is written to your log channel with a low/medium/high rating. IP addresses are
                  never stored — only a salted hash, which is enough to spot repeats but not to identify anyone.
                </p>
              </div>
            </Section>

            <Section title="Panel appearance">
              <Field label="Embed title">
                <TextInput value={config.verification_embed_title} onChange={(v) => set('verification_embed_title', v)} maxLength={100} />
              </Field>
              <Field label="Embed description">
                <TextArea
                  value={config.verification_embed_description}
                  onChange={(v) => set('verification_embed_description', v)}
                  maxLength={500}
                  rows={3}
                />
              </Field>
              <Field label="Button label">
                <TextInput value={config.verification_button_label} onChange={(v) => set('verification_button_label', v)} maxLength={40} />
              </Field>
              <Field label="Embed color">
                <ColorInput value={config.verification_embed_color} onChange={(v) => set('verification_embed_color', v)} />
              </Field>
            </Section>

            <Section title="Verified members">
              {verificationError && <p className="text-sm text-red-400 py-2">{verificationError}</p>}
              {!verifications && !verificationError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
              {verifications && (
                <>
                  <div className="grid grid-cols-2 gap-3 py-3">
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
                      <p className="font-mono text-lg text-white leading-none">{verifications.total}</p>
                      <p className="text-[10px] text-[var(--mist-dim)] mt-1">verified</p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
                      <p className="font-mono text-lg text-white leading-none">{verifications.restorable}</p>
                      <p className="text-[10px] text-[var(--mist-dim)] mt-1">restorable after a raid</p>
                    </div>
                  </div>
                  <div className="divide-y divide-[var(--line)]">
                    {verifications.entries.length === 0 && (
                      <p className="text-xs text-[var(--mist-dim)] py-2">Nobody has verified yet.</p>
                    )}
                    {verifications.entries.slice(0, 25).map((e) => (
                      <div key={e.user_id} className="py-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-white truncate">{e.username}</span>
                          <span className="font-mono text-[11px] text-[var(--mist-dim)] shrink-0">
                            {new Date(e.verified_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {e.flags?.length > 0 && (
                          <p className="flex items-start gap-1.5 text-xs text-amber-400/90 mt-1">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" strokeWidth={2} />
                            {e.flags.join(' · ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Section>
          </>
        )}

        {tab === 'member_restore' && !user?.is_premium && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium · QA access required
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Member Restore is out for QA testing</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              If your server gets raided and members are mass-kicked, pull your verified members
              back in automatically. Currently limited to the QA Team.
            </p>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-2.5"
            >
              Join the Discord
            </a>
          </div>
        )}

        {tab === 'member_restore' && user?.is_premium && (
          <>
            <Section
              title="Member restore"
              icon={ShieldCheck}
              description="After a raid or mass-kick, re-add your verified members in one click."
            >
              <div className="py-3 rounded-lg border border-[var(--py-blue)]/25 bg-[var(--py-blue)]/5 px-4 my-3">
                <p className="text-xs text-[var(--mist)] leading-relaxed">
                  <strong className="text-white">How this works, honestly:</strong> Discord only lets a bot
                  re-add someone who personally approved it during verification. That's a deliberate
                  platform restriction — no bot can re-add arbitrary members. So restore covers everyone
                  who has <em>verified</em>, not everyone who was ever in the server. The more members who
                  verify, the more you can recover.
                </p>
              </div>

              {verificationError && <p className="text-sm text-red-400 py-2">{verificationError}</p>}
              {!verifications && !verificationError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}

              {verifications && (
                <>
                  {!verifications.encryption_enabled && (
                    <p className="flex items-start gap-1.5 text-xs text-amber-400 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                      Member restore is inactive: the server's <code className="font-mono">VERIFICATION_TOKEN_KEY</code> isn't
                      set, so no restore tokens are being stored. This is intentional — nothing sensitive is
                      ever written unencrypted.
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 py-3">
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
                      <p className="font-mono text-lg text-white leading-none">{verifications.restorable}</p>
                      <p className="text-[10px] text-[var(--mist-dim)] mt-1">members you can pull back</p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5">
                      <p className="font-mono text-lg text-white leading-none">{verifications.total}</p>
                      <p className="text-[10px] text-[var(--mist-dim)] mt-1">verified in total</p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={runMemberRestore}
                      disabled={restoreBusy || !verifications.restorable || !verifications.encryption_enabled}
                      className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                    >
                      <ShieldCheck className="w-4 h-4" strokeWidth={2.25} />
                      {restoreBusy ? 'Pulling members back...' : 'Restore members now'}
                    </button>
                    <p className="text-xs text-[var(--mist-dim)] mt-2">
                      Anyone already in the server is skipped automatically — running this twice is safe.
                    </p>
                  </div>

                  {restoreError && <p className="text-sm text-red-400 mt-3">{restoreError}</p>}
                  {restoreResult && (
                    <div className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
                      <p className="text-sm text-emerald-400">
                        Added <strong>{restoreResult.added}</strong> member(s) back.
                      </p>
                      <p className="text-xs text-[var(--mist-dim)] mt-1">
                        {restoreResult.already_in_server} already in the server
                        {restoreResult.failed > 0 && ` · ${restoreResult.failed} couldn't be re-added (they likely revoked access)`}
                      </p>
                    </div>
                  )}
                </>
              )}
            </Section>
          </>
        )}

        {tab === 'moderation' && (
          <>
            <Section
              title="Moderation commands"
              icon={Gavel}
              description="Slash commands your moderators run by hand — separate from the automatic detection above"
            >
              <Toggle
                label="Enable moderation commands"
                description="While off, running any of these commands tells the person the module isn't enabled"
                checked={config.moderation_enabled}
                onChange={(v) => set('moderation_enabled', v)}
              />
              <div className="py-3">
                <p className="text-xs text-[var(--mist-dim)] mb-2">Commands in this module</p>
                <div className="flex flex-wrap gap-1.5">
                  {['/warn', '/warnings', '/clearwarnings', '/kick', '/ban', '/softban', '/mute', '/unmute', '/purge'].map((c) => (
                    <code
                      key={c}
                      className="font-mono text-[11px] text-[var(--py-blue)] border border-[var(--line)] rounded-md px-2 py-1"
                    >
                      {c}
                    </code>
                  ))}
                </div>
                <p className="text-xs text-[var(--mist-dim)] mt-3">
                  Who can run each one is controlled by Discord's own permissions — e.g. <code className="font-mono">/ban</code> needs
                  Ban Members. You can fine-tune this per role in Discord under Server Settings → Integrations → PySecured.
                </p>
              </div>
            </Section>

            <Section title="Logging & behavior">
              <Field label="Moderation log channel (optional — falls back to your main log channel)">
                <Select
                  value={config.moderation_log_channel_id}
                  onChange={(v) => set('moderation_log_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Use the main log channel"
                />
              </Field>
              <Toggle
                label="DM the member"
                description="Sends them the action and reason — silently skipped if their DMs are closed"
                checked={config.moderation_dm_user}
                onChange={(v) => set('moderation_dm_user', v)}
              />
              <Toggle
                label="Require a reason"
                description="Moderators must supply a reason or the command is rejected"
                checked={config.moderation_require_reason}
                onChange={(v) => set('moderation_require_reason', v)}
              />
            </Section>

            <Section title="Built-in safety">
              <div className="py-3 space-y-1.5 text-sm text-[var(--mist)]">
                <p>These are always enforced, regardless of the settings above:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-[var(--py-blue)] text-xs">
                  <li>Nobody can moderate themselves or the server owner</li>
                  <li>Nobody can moderate someone with an equal or higher role than their own</li>
                  <li>Nothing can be actioned if the target's role sits above PySecured's</li>
                  <li>Every action is logged, and shows up in Analytics as a manual action</li>
                </ul>
              </div>
            </Section>
          </>
        )}

        {tab === 'trap' && (
          <>
            <Section
              title="Trap channel"
              icon={Radar}
              description="Any message from a non-admin in this channel is instantly punished"
            >
              <Toggle label="Enable trap channel" checked={config.trap_enabled} onChange={(v) => set('trap_enabled', v)} />
              <Field label="Trap channel">
                <Select
                  value={config.trap_channel_id}
                  onChange={(v) => set('trap_channel_id', v)}
                  options={channelOptions}
                  placeholder="Select a channel..."
                />
              </Field>
              <ActionButton
                label="Post/refresh notice in trap channel"
                description="Saves your settings, then posts and pins the warning message in the trap channel"
                onRun={async () => {
                  await save()
                  return api.postTrapNotice(guildId)
                }}
                resultText={(r) => `Posted in #${r.channel_name}.`}
              />
              <Field label="Action">
                <Select value={config.trap_action} onChange={(v) => set('trap_action', v)} options={ACTION_OPTIONS} />
              </Field>
              {config.trap_action === 'role' && (
                <Field label="Quarantine role">
                  <Select
                    value={config.trap_quarantine_role_id}
                    onChange={(v) => set('trap_quarantine_role_id', v)}
                    options={roleOptions}
                    placeholder="Select a role..."
                  />
                </Field>
              )}
              {config.trap_action === 'timeout' && (
                <Field label="Timeout length (minutes)">
                  <NumberInput
                    value={config.trap_timeout_minutes}
                    onChange={(v) => set('trap_timeout_minutes', v)}
                    min={1}
                    max={40320}
                  />
                </Field>
              )}
              {config.trap_action === 'ban' && (
                <Field label="Ban length in days (0 = permanent)">
                  <NumberInput
                    value={config.trap_ban_duration_days}
                    onChange={(v) => set('trap_ban_duration_days', v)}
                    min={0}
                    max={3650}
                  />
                </Field>
              )}
            </Section>
          </>
        )}

        {tab === 'welcome' && (
          <>
            <Section title="Auto role" icon={UserPlus} description="Automatically give new members a role when they join">
              <Toggle label="Enable auto role" checked={config.auto_role_enabled} onChange={(v) => set('auto_role_enabled', v)} />
              <Field label="Role to assign">
                <Select
                  value={config.auto_role_id}
                  onChange={(v) => set('auto_role_id', v)}
                  options={roleOptions}
                  placeholder="Select a role..."
                />
              </Field>
            </Section>

            <Section title="Welcome message" description="Sent automatically when someone joins">
              <Toggle label="Enable welcome message" checked={config.welcome_enabled} onChange={(v) => set('welcome_enabled', v)} />
              <Field label="Welcome channel">
                <Select
                  value={config.welcome_channel_id}
                  onChange={(v) => set('welcome_channel_id', v)}
                  options={channelOptions}
                  placeholder="Select a channel..."
                />
              </Field>
              <ActionButton
                label="Send test welcome message"
                description="Saves your settings, then sends it to the channel with you as the preview"
                onRun={async () => {
                  await save()
                  return api.welcomeTest(guildId)
                }}
                resultText={(r) => `Sent in #${r.channel_name}.`}
              />
            </Section>

            <Section title="Message content">
              <Field label="Embed title">
                <TextInput value={config.welcome_embed_title} onChange={(v) => set('welcome_embed_title', v)} maxLength={100} />
              </Field>
              <Field label="Embed description">
                <TextArea
                  value={config.welcome_embed_description}
                  onChange={(v) => set('welcome_embed_description', v)}
                  maxLength={1000}
                  rows={4}
                />
              </Field>
              <Field label="Embed color">
                <ColorInput value={config.welcome_embed_color} onChange={(v) => set('welcome_embed_color', v)} />
              </Field>
              <p className="text-xs text-[var(--mist-dim)] pt-3">
                Placeholders: <code className="font-mono">{'{member}'}</code> mentions them,{' '}
                <code className="font-mono">{'{username}'}</code> their display name,{' '}
                <code className="font-mono">{'{server}'}</code> this server's name,{' '}
                <code className="font-mono">{'{membercount}'}</code> member count.
              </p>
            </Section>
          </>
        )}

        {tab === 'reaction_roles' && (
          <>
            <Section title="Reaction role panel" icon={Smile} description="One message — react with an emoji, get a role">
              <Toggle label="Enable reaction roles" checked={config.reaction_roles_enabled} onChange={(v) => set('reaction_roles_enabled', v)} />
              <Field label="Panel channel">
                <Select
                  value={config.reaction_roles_channel_id}
                  onChange={(v) => set('reaction_roles_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <ActionButton
                label="Post/refresh panel"
                description="Saves your settings, then posts the panel and reacts with every configured emoji"
                onRun={async () => {
                  await save()
                  return api.postReactionRolesPanel(guildId)
                }}
                resultText={(r) => (r.warning ? r.warning : `Posted in #${r.channel_name}.`)}
              />
            </Section>

            <Section title="Roles" description="Emoji, role, and an optional label — up to a reasonable handful per panel">
              <div className="py-3 space-y-2">
                {(config.reaction_roles_mappings || []).map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={m.emoji}
                      onChange={(e) => updateMapping(i, 'emoji', e.target.value)}
                      placeholder="🎮"
                      className="w-14 shrink-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-2 py-2 focus:outline-none focus:border-[var(--py-blue)]"
                    />
                    <select
                      value={m.role_id ?? ''}
                      onChange={(e) => updateMapping(i, 'role_id', e.target.value)}
                      className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 focus:outline-none focus:border-[var(--py-blue)] font-mono"
                    >
                      <option value="">Select a role...</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <input
                      value={m.label}
                      onChange={(e) => updateMapping(i, 'label', e.target.value)}
                      placeholder="Label (optional)"
                      className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 focus:outline-none focus:border-[var(--py-blue)]"
                    />
                    <button
                      onClick={() => removeMapping(i)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                ))}
                {(config.reaction_roles_mappings || []).length === 0 && (
                  <p className="text-xs text-[var(--mist-dim)] py-2">No roles added yet.</p>
                )}
                <button
                  onClick={addMapping}
                  className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline pt-1"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.25} />
                  Add a role
                </button>
              </div>
            </Section>

            <Section title="Panel appearance">
              <Field label="Embed title">
                <TextInput value={config.reaction_roles_embed_title} onChange={(v) => set('reaction_roles_embed_title', v)} maxLength={100} />
              </Field>
              <Field label="Embed description">
                <TextArea
                  value={config.reaction_roles_embed_description}
                  onChange={(v) => set('reaction_roles_embed_description', v)}
                  maxLength={500}
                  rows={3}
                />
              </Field>
              <Field label="Embed color">
                <ColorInput value={config.reaction_roles_embed_color} onChange={(v) => set('reaction_roles_embed_color', v)} />
              </Field>
            </Section>
          </>
        )}

        {tab === 'giveaways' && (
          <>
            <Section title="Create a giveaway" icon={Gift}>
              {giveawayError && <p className="text-sm text-red-400 py-2">{giveawayError}</p>}
              <Field label="Prize">
                <TextInput
                  value={giveawayForm.prize}
                  onChange={(v) => setGiveawayForm((f) => ({ ...f, prize: v }))}
                  placeholder="Discord Nitro"
                  maxLength={200}
                />
              </Field>
              <Field label="Channel">
                <Select
                  value={giveawayForm.channel_id}
                  onChange={(v) => setGiveawayForm((f) => ({ ...f, channel_id: v }))}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <div className="grid grid-cols-2 gap-4 py-3">
                <Field label="Duration (minutes)">
                  <NumberInput
                    value={giveawayForm.duration_minutes}
                    onChange={(v) => setGiveawayForm((f) => ({ ...f, duration_minutes: v }))}
                    min={1}
                    max={43200}
                  />
                </Field>
                <Field label="Winners">
                  <NumberInput
                    value={giveawayForm.winner_count}
                    onChange={(v) => setGiveawayForm((f) => ({ ...f, winner_count: v }))}
                    min={1}
                    max={50}
                  />
                </Field>
              </div>
              <Field label="Required role (optional)">
                <Select
                  value={giveawayForm.required_role_id}
                  onChange={(v) => setGiveawayForm((f) => ({ ...f, required_role_id: v }))}
                  options={roles.map((r) => ({ value: r.id, label: r.name }))}
                  placeholder="Anyone can enter"
                />
              </Field>
              <div className="pt-3">
                <button
                  onClick={createGiveaway}
                  disabled={giveawayCreating || !giveawayForm.prize || !giveawayForm.channel_id}
                  className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                >
                  <Gift className="w-4 h-4" strokeWidth={2.25} />
                  {giveawayCreating ? 'Starting...' : 'Start giveaway'}
                </button>
              </div>
            </Section>

            <Section title="Active & recent">
              {!giveaways && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
              {giveaways && giveaways.length === 0 && <p className="text-xs text-[var(--mist-dim)] py-2">No giveaways yet.</p>}
              <div className="divide-y divide-[var(--line)]">
                {giveaways?.map((g) => (
                  <div key={g.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{g.prize}</p>
                      <p className="text-xs text-[var(--mist-dim)] flex items-center gap-1.5 mt-0.5">
                        {g.ended ? (
                          <>
                            <Trophy className="w-3 h-3" strokeWidth={2} />
                            {g.winners.length > 0 ? `${g.winners.length} winner(s)` : 'No winner'}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            {g.entries.length} entries
                          </>
                        )}
                      </p>
                    </div>
                    {!g.ended && (
                      <button
                        onClick={() => endGiveawayNow(g.id)}
                        className="press shrink-0 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 border border-[var(--line)] transition-all text-white text-xs font-medium px-3 py-1.5"
                      >
                        End now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === 'custom_commands' && (
          <>
            <Section title="Custom commands" icon={MessageSquare} description="A trigger word or phrase — PySecured replies automatically">
              <Toggle label="Enable custom commands" checked={config.custom_commands_enabled} onChange={(v) => set('custom_commands_enabled', v)} />
            </Section>

            <Section title="Commands" description="Up to 25 per server">
              <div className="py-3 space-y-2">
                {(config.custom_commands || []).map((c, i) => (
                  <div key={i} className="rounded-lg border border-[var(--line)] p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={c.trigger}
                        onChange={(e) => updateCustomCommand(i, 'trigger', e.target.value)}
                        placeholder="Trigger word or phrase"
                        className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 focus:outline-none focus:border-[var(--py-blue)]"
                      />
                      <select
                        value={c.match_type}
                        onChange={(e) => updateCustomCommand(i, 'match_type', e.target.value)}
                        className="shrink-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-xs text-white px-2 py-2 focus:outline-none focus:border-[var(--py-blue)]"
                      >
                        {MATCH_TYPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeCustomCommand(i)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                    <textarea
                      value={c.response}
                      onChange={(e) => updateCustomCommand(i, 'response', e.target.value)}
                      placeholder="What PySecured replies with"
                      rows={2}
                      className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 focus:outline-none focus:border-[var(--py-blue)] resize-none"
                    />
                  </div>
                ))}
                {(config.custom_commands || []).length === 0 && (
                  <p className="text-xs text-[var(--mist-dim)] py-2">No custom commands yet.</p>
                )}
                {(config.custom_commands || []).length < 25 && (
                  <button
                    onClick={addCustomCommand}
                    className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline pt-1"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.25} />
                    Add a command
                  </button>
                )}
              </div>
            </Section>
          </>
        )}

        {tab === 'leveling' && (
          <>
            <Section title="Leveling & XP" icon={TrophyIcon} description="Members earn XP from activity, with a server leaderboard">
              <Toggle label="Enable leveling" checked={config.leveling_enabled} onChange={(v) => set('leveling_enabled', v)} />
              <div className="grid grid-cols-2 gap-4 py-3">
                <Field label="Min XP per message">
                  <NumberInput value={config.leveling_xp_min} onChange={(v) => set('leveling_xp_min', v)} min={1} max={1000} />
                </Field>
                <Field label="Max XP per message">
                  <NumberInput value={config.leveling_xp_max} onChange={(v) => set('leveling_xp_max', v)} min={1} max={1000} />
                </Field>
              </div>
              <Field label="Cooldown between XP awards (seconds)">
                <NumberInput value={config.leveling_cooldown_seconds} onChange={(v) => set('leveling_cooldown_seconds', v)} min={0} max={3600} />
              </Field>
              <Toggle
                label="Announce level-ups"
                checked={config.leveling_announce_enabled}
                onChange={(v) => set('leveling_announce_enabled', v)}
              />
              {config.leveling_announce_enabled && (
                <Field label="Announcement channel (optional — defaults to wherever they leveled up)">
                  <Select
                    value={config.leveling_announce_channel_id}
                    onChange={(v) => set('leveling_announce_channel_id', v)}
                    options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                    placeholder="Same channel as the message"
                  />
                </Field>
              )}
              <p className="text-xs text-[var(--mist-dim)] pt-3">
                Members can check their own rank with <code className="font-mono">/rank</code> in Discord.
              </p>
            </Section>

            <Section title="Leaderboard" description="Top 10 by XP, right now">
              {leaderboardError && <p className="text-sm text-red-400 py-2">{leaderboardError}</p>}
              {!leaderboard && !leaderboardError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
              {leaderboard && leaderboard.length === 0 && (
                <p className="text-xs text-[var(--mist-dim)] py-2">No one has earned XP yet.</p>
              )}
              <div className="divide-y divide-[var(--line)]">
                {leaderboard?.map((entry) => (
                  <div key={entry.user_id} className="py-2.5 flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--mist-dim)] w-5 shrink-0">#{entry.rank}</span>
                    {entry.avatar && <img src={entry.avatar} alt="" className="w-6 h-6 rounded-full shrink-0" />}
                    <span className="text-sm text-white flex-1 truncate">{entry.username}</span>
                    <span className="text-xs text-[var(--mist-dim)] shrink-0">Level {entry.level}</span>
                    <span className="font-mono text-xs text-[var(--mist)] shrink-0 w-16 text-right">{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === 'starboard' && (
          <Section title="Starboard" icon={Star} description="Messages that hit a reaction threshold get pinned to a highlights channel">
            <Toggle label="Enable starboard" checked={config.starboard_enabled} onChange={(v) => set('starboard_enabled', v)} />
            <Field label="Starboard channel">
              <Select
                value={config.starboard_channel_id}
                onChange={(v) => set('starboard_channel_id', v)}
                options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                placeholder="Select a channel..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4 py-3">
              <Field label="Emoji">
                <input
                  value={config.starboard_emoji}
                  onChange={(e) => set('starboard_emoji', e.target.value)}
                  className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-3 py-2 focus:outline-none focus:border-[var(--py-blue)]"
                />
              </Field>
              <Field label="Threshold">
                <NumberInput value={config.starboard_threshold} onChange={(v) => set('starboard_threshold', v)} min={1} max={100} />
              </Field>
            </div>
          </Section>
        )}

        {tab === 'backups' && !user?.is_premium && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium · QA access required
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Backup & Restore is out for QA testing</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              Snapshot your server's roles and channels, restore them later. Currently limited to the QA Team.
            </p>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-2.5"
            >
              Join the Discord
            </a>
          </div>
        )}

        {tab === 'backups' && user?.is_premium && (
          <>
            <Section title="Server backup" icon={Database} description="Snapshots roles, categories, and channels. Restoring only ever adds — it never deletes or changes anything currently in your server.">
              <div className="py-3">
                <button
                  onClick={runBackup}
                  disabled={backupBusy === 'creating'}
                  className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                >
                  <Database className="w-4 h-4" strokeWidth={2.25} />
                  {backupBusy === 'creating' ? 'Creating...' : 'Create backup now'}
                </button>
              </div>
              {backupError && <p className="text-sm text-red-400 py-2">{backupError}</p>}
            </Section>

            <Section title="Backups">
              {!backups && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
              {backups && backups.length === 0 && <p className="text-xs text-[var(--mist-dim)] py-2">No backups yet.</p>}
              <div className="divide-y divide-[var(--line)]">
                {backups?.map((b) => (
                  <div key={b.id} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-white">
                          {new Date(b.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-[var(--mist-dim)] mt-0.5">
                          {b.role_count} roles · {b.category_count} categories · {b.channel_count} channels · by {b.created_by}
                        </p>
                      </div>
                      <button
                        onClick={() => runRestore(b.id)}
                        disabled={backupBusy === b.id}
                        className="press shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 disabled:opacity-50 border border-[var(--line)] transition-all text-white text-xs font-medium px-3 py-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.25} />
                        {backupBusy === b.id ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                    {backupResult?.backupId === b.id && (
                      <p className="text-xs text-emerald-400 mt-2">
                        Restored: {backupResult.roles} roles, {backupResult.categories} categories, {backupResult.channels} channels created
                        {backupResult.skipped > 0 && ` (${backupResult.skipped} skipped)`}.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === 'whitelist' && (
            <Section title="Whitelisted roles" icon={Users} description="Members with any of these roles are never punished">
            <div className="py-3 space-y-1">
              {roles.map((r) => {
                const checked = config.whitelist_role_ids?.includes(r.id)
                return (
                  <label key={r.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const ids = new Set(config.whitelist_role_ids || [])
                        if (e.target.checked) {
                          ids.add(r.id)
                        } else {
                          ids.delete(r.id)
                        }
                        set('whitelist_role_ids', [...ids])
                      }}
                      className="w-4 h-4 rounded accent-[var(--py-blue)]"
                    />
                    <span className="text-sm text-white">{r.name}</span>
                  </label>
                )
              })}
              {roles.length === 0 && <p className="text-sm text-[var(--mist-dim)]">No roles found.</p>}
            </div>
          </Section>
        )}

        {tab === 'tickets' && (
          <>
            <Section title="Ticket system" icon={Ticket} description="A panel embed with a button that opens a private channel per person">
              <Toggle label="Enable tickets" checked={config.tickets_enabled} onChange={(v) => set('tickets_enabled', v)} />
              <Field label="Panel channel">
                <Select
                  value={config.ticket_panel_channel_id}
                  onChange={(v) => set('ticket_panel_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <Field label="Ticket category">
                <Select
                  value={config.ticket_category_id}
                  onChange={(v) => set('ticket_category_id', v)}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Select a category..."
                />
              </Field>
              <Field label="Log channel">
                <Select
                  value={config.ticket_log_channel_id}
                  onChange={(v) => set('ticket_log_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <ActionButton
                label="Post/refresh ticket panel"
                description="Saves your settings, then posts the panel embed with a working button"
                onRun={async () => {
                  await save()
                  return api.postTicketPanel(guildId)
                }}
                resultText={(r) => `Posted in #${r.channel_name}.`}
              />
            </Section>

            <Section title="Support roles" description="These roles can see and reply in every ticket">
              <div className="py-3 space-y-1">
                {roles.map((r) => {
                  const checked = config.ticket_support_role_ids?.includes(r.id)
                  return (
                    <label key={r.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const ids = new Set(config.ticket_support_role_ids || [])
                          if (e.target.checked) {
                            ids.add(r.id)
                          } else {
                            ids.delete(r.id)
                          }
                          set('ticket_support_role_ids', [...ids])
                        }}
                        className="w-4 h-4 rounded accent-[var(--py-blue)]"
                      />
                      <span className="text-sm text-white">{r.name}</span>
                    </label>
                  )
                })}
                {roles.length === 0 && <p className="text-sm text-[var(--mist-dim)]">No roles found.</p>}
              </div>
            </Section>

            <Section title="Panel appearance">
              <Field label="Embed title">
                <TextInput value={config.ticket_embed_title} onChange={(v) => set('ticket_embed_title', v)} maxLength={100} />
              </Field>
              <Field label="Embed description">
                <TextArea
                  value={config.ticket_embed_description}
                  onChange={(v) => set('ticket_embed_description', v)}
                  maxLength={500}
                  rows={3}
                />
              </Field>
              <Field label="Button label">
                <TextInput value={config.ticket_button_label} onChange={(v) => set('ticket_button_label', v)} maxLength={45} />
              </Field>
              <Field label="Embed color">
                <ColorInput value={config.ticket_embed_color} onChange={(v) => set('ticket_embed_color', v)} />
              </Field>
            </Section>
          </>
        )}

        {tab === 'analytics' && !user?.is_premium && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium · QA access required
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Analytics is out for QA testing</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              A history of every action PySecured has taken in your server is currently limited
              to the QA Team while it's tested. Join the Discord to ask about access.
            </p>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-2.5"
            >
              Join the Discord
            </a>
          </div>
        )}

        {tab === 'analytics' && user?.is_premium && (
          <>
            {analyticsError && <p className="text-sm text-red-400 mb-4">{analyticsError}</p>}

            {!analytics && !analyticsError && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="skeleton h-20 rounded-xl" />
                  <div className="skeleton h-20 rounded-xl" />
                  <div className="skeleton h-20 rounded-xl" />
                </div>
                <div className="skeleton h-40 rounded-xl" />
              </div>
            )}

            {analytics && (
              <>
                <Section title="Overview" icon={BarChart3} description="Last 30 days, read live from every action PySecured has taken">
                  <div className="grid sm:grid-cols-3 gap-3 py-3">
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 p-4">
                      <p className="text-xs text-[var(--mist-dim)] mb-1">This week</p>
                      <div className="flex items-baseline gap-2">
                        <p className="font-mono text-2xl text-white">{analytics.total_7d}</p>
                        {analytics.total_7d > analytics.prev_7d && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-amber-400">
                            <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                            {analytics.total_7d - analytics.prev_7d}
                          </span>
                        )}
                        {analytics.total_7d < analytics.prev_7d && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-emerald-400">
                            <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                            {analytics.prev_7d - analytics.total_7d}
                          </span>
                        )}
                        {analytics.total_7d === analytics.prev_7d && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-[var(--mist-dim)]">
                            <Minus className="w-3 h-3" strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--mist-dim)] mt-0.5">vs {analytics.prev_7d} the week before</p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 p-4">
                      <p className="text-xs text-[var(--mist-dim)] mb-1">Last 30 days</p>
                      <p className="font-mono text-2xl text-white">{analytics.total_30d}</p>
                      <p className="text-[11px] text-[var(--mist-dim)] mt-0.5">actions taken</p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 p-4">
                      <p className="text-xs text-[var(--mist-dim)] mb-1">Tickets</p>
                      <p className="font-mono text-2xl text-white">{analytics.tickets_opened_30d}</p>
                      <p className="text-[11px] text-[var(--mist-dim)] mt-0.5">{analytics.tickets_closed_30d} closed, last 30d</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs text-[var(--mist-dim)] mb-3">Daily activity, last 14 days</p>
                    <BarChart data={analytics.daily} />
                  </div>
                </Section>

                <Section title="Breakdown">
                  <div className="grid sm:grid-cols-2 gap-6 py-3">
                    <div>
                      <p className="text-xs text-[var(--mist-dim)] mb-2">By action</p>
                      <div className="space-y-1.5">
                        {Object.entries(analytics.by_action).length === 0 && (
                          <p className="text-xs text-[var(--mist-dim)]">No actions yet.</p>
                        )}
                        {Object.entries(analytics.by_action).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--mist)]">{ACTION_LABEL[k] || k}</span>
                            <span className="font-mono text-white">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--mist-dim)] mb-2">By trigger</p>
                      <div className="space-y-1.5">
                        {Object.entries(analytics.by_trigger).length === 0 && (
                          <p className="text-xs text-[var(--mist-dim)]">No actions yet.</p>
                        )}
                        {Object.entries(analytics.by_trigger).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--mist)]">{TRIGGER_LABEL[k] || k}</span>
                            <span className="font-mono text-white">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Recent activity">
                  <div className="divide-y divide-[var(--line)]">
                    {analyticsEvents.length === 0 && <p className="text-xs text-[var(--mist-dim)] py-3">Nothing recorded yet.</p>}
                    {analyticsEvents.map((e, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                        <span className="text-sm text-[var(--mist)]">
                          {e.type === 'protection_action' && `${ACTION_LABEL[e.action] || e.action} — ${e.reason}`}
                          {e.type === 'ticket_opened' && 'Ticket opened'}
                          {e.type === 'ticket_closed' && 'Ticket closed'}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--mist-dim)] shrink-0">
                          {new Date(e.ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}
          </>
        )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
