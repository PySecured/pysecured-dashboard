import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Save, ShieldAlert, Radar, UserPlus, Users, Ticket, Lock, BarChart3,
  TrendingUp, TrendingDown, Minus, Smile, Gift, Plus, X, Clock, Trophy,
  MessageSquare, Star, Database, Trophy as TrophyIcon, RotateCcw, Gavel,
  ShieldCheck, UserCheck, AlertTriangle, LayoutList, Send, Trash2, ChevronDown,
  Siren, CalendarClock, Lock as LockIcon, Unlock,
  ScrollText, BarChart2, Lightbulb, FileText, Palette, Download, Search,
  Wand2, UserMinus, CheckSquare, Square, Sparkles, Moon, Megaphone,
  ShieldX, Timer, Pin, Undo2, Mail, TerminalSquare, Crown, LayoutDashboard, ArrowRight, Check,
} from 'lucide-react'
import { api } from '../api'
import { Toggle, Field, Select, NumberInput, TextInput, TextArea, ColorInput, Section, ActionButton } from '../components/Form'
import { BarChart } from '../components/BarChart'
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
    label: 'Overview',
    tabs: [{ id: 'overview', label: 'Overview', Icon: LayoutDashboard }],
  },
  {
    label: 'Security',
    tabs: [
      { id: 'general', label: 'General', Icon: ShieldAlert },
      { id: 'commands', label: 'Commands', Icon: TerminalSquare },
      { id: 'verification', label: 'Verification', Icon: UserCheck },
      { id: 'moderation', label: 'Moderation', Icon: Gavel },
      { id: 'message_log', label: 'Message Log', Icon: ScrollText },
      { id: 'trap', label: 'Trap channel', Icon: Radar },
      { id: 'whitelist', label: 'Whitelist', Icon: Users },
      { id: 'role_persist', label: 'Role Persistence', Icon: Undo2 },
      { id: 'invite_tracking', label: 'Invite Tracking', Icon: Mail },
    ],
  },
  {
    label: 'Community',
    tabs: [
      { id: 'welcome', label: 'Welcome', Icon: UserPlus },
      { id: 'reaction_roles', label: 'Reaction Roles', Icon: Smile },
      { id: 'giveaways', label: 'Giveaways', Icon: Gift },
      { id: 'tickets', label: 'Tickets', Icon: Ticket },
      { id: 'ticket_panels', label: 'Ticket Panels', Icon: LayoutList },
      { id: 'custom_commands', label: 'Custom Commands', Icon: MessageSquare },
      { id: 'leveling', label: 'Leveling', Icon: TrophyIcon },
      { id: 'starboard', label: 'Starboard', Icon: Star },
      { id: 'suggestions', label: 'Suggestions', Icon: Lightbulb },
      { id: 'stats_channels', label: 'Stats Channels', Icon: BarChart2 },
      { id: 'afk', label: 'AFK', Icon: Moon },
      { id: 'autopublish', label: 'Auto-Publish', Icon: Megaphone },
      { id: 'sticky', label: 'Sticky Messages', Icon: Pin },
    ],
  },
  {
    label: 'Premium',
    tabs: [
      { id: 'antinuke', label: 'Anti-Nuke', Icon: ShieldX, premium: true },
      { id: 'analytics', label: 'Analytics', Icon: BarChart3, premium: true },
      { id: 'backups', label: 'Backup & Restore', Icon: Database, premium: true },
      { id: 'member_restore', label: 'Member Restore', Icon: ShieldCheck, premium: true },
      { id: 'raid_mode', label: 'Raid Mode', Icon: Siren, premium: true },
      { id: 'announcements', label: 'Announcements', Icon: CalendarClock, premium: true },
      { id: 'transcripts', label: 'Transcripts', Icon: FileText, premium: true },
      { id: 'branding', label: 'Branding', Icon: Palette, premium: true },
      { id: 'identity', label: 'Bot Identity', Icon: Sparkles, premium: true },
      { id: 'temp_roles', label: 'Temporary Roles', Icon: Timer, premium: true },
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
  const [tab, setTab] = useState('overview')
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
  const [restorable, setRestorable] = useState(null)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [statsPresets, setStatsPresets] = useState(['members', 'humans', 'bots'])
  const [statsSetupBusy, setStatsSetupBusy] = useState(false)
  const [statsSetupResult, setStatsSetupResult] = useState(null)
  const [overview, setOverview] = useState(null)
  const [guildMeta, setGuildMeta] = useState(null)
  const [commandList, setCommandList] = useState(null)
  const [commandError, setCommandError] = useState(null)
  const [commandBusy, setCommandBusy] = useState(false)
  const [identityBusy, setIdentityBusy] = useState(false)
  const [identityResult, setIdentityResult] = useState(null)
  const [tabMenuOpen, setTabMenuOpen] = useState(false)
  const activeTab = TAB_GROUPS.flatMap((g) => g.tabs).find((t) => t.id === tab)
  const activeGroupLabel = TAB_GROUPS.find((g) => g.tabs.some((t) => t.id === tab))?.label ?? ''
  const [transcripts, setTranscripts] = useState(null)
  const [transcriptQuery, setTranscriptQuery] = useState('')
  const [openTranscript, setOpenTranscript] = useState(null)
  const [transcriptError, setTranscriptError] = useState(null)
  const [limits, setLimits] = useState(null)
  const [lockBusy, setLockBusy] = useState(false)
  const [lockError, setLockError] = useState(null)
  const [announcements, setAnnouncements] = useState(null)
  const [annError, setAnnError] = useState(null)
  const [annBusy, setAnnBusy] = useState(false)
  const [annForm, setAnnForm] = useState({
    channel_id: '', title: '', message: '', color: '#3EC6FF', interval: 'daily', start_in_minutes: 0,
  })
  const [panels, setPanels] = useState(null)
  const [panelsError, setPanelsError] = useState(null)
  const [panelBusy, setPanelBusy] = useState(null)
  const [panelResult, setPanelResult] = useState(null)
  const [openPanel, setOpenPanel] = useState(null)
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

  useEffect(() => {
    if (tab === 'ticket_panels' && panels === null) {
      Promise.all([api.ticketPanels(guildId), categories.length ? null : api.categories(guildId)])
        .then(([p, c]) => {
          setPanels(p)
          if (c) setCategories(c)
        })
        .catch((e) => setPanelsError(e.message))
    }
  }, [tab, guildId, panels, categories.length])

  async function addPanel() {
    setPanelBusy('new')
    setPanelsError(null)
    try {
      const created = await api.createTicketPanel(guildId)
      setPanels((p) => [...(p || []), created])
      setOpenPanel(created.id)
    } catch (e) {
      setPanelsError(e.message)
    } finally {
      setPanelBusy(null)
    }
  }

  // Local-only edit; nothing hits the API until Save is pressed, so typing
  // in a field doesn't fire a request per keystroke.
  function editPanel(panelId, patch) {
    setPanels((list) => list.map((p) => (p.id === panelId ? { ...p, ...patch } : p)))
  }

  function editOption(panelId, index, patch) {
    setPanels((list) =>
      list.map((p) => {
        if (p.id !== panelId) return p
        const options = [...(p.options || [])]
        options[index] = { ...options[index], ...patch }
        return { ...p, options }
      })
    )
  }

  function addOption(panelId) {
    setPanels((list) =>
      list.map((p) =>
        p.id === panelId
          ? {
              ...p,
              options: [
                ...(p.options || []),
                { label: 'New option', description: '', emoji: '', category_id: '', support_role_ids: [], name_prefix: 'ticket', ping_support: true },
              ],
            }
          : p
      )
    )
  }

  function removeOption(panelId, index) {
    setPanels((list) =>
      list.map((p) => (p.id === panelId ? { ...p, options: (p.options || []).filter((_, i) => i !== index) } : p))
    )
  }

  async function savePanel(panel) {
    setPanelBusy(panel.id)
    setPanelsError(null)
    setPanelResult(null)
    try {
      const saved = await api.updateTicketPanel(guildId, panel.id, panel)
      setPanels((list) => list.map((p) => (p.id === panel.id ? saved : p)))
      setPanelResult({ id: panel.id, text: 'Saved.' })
    } catch (e) {
      setPanelsError(e.message)
    } finally {
      setPanelBusy(null)
    }
  }

  async function publishPanel(panel) {
    setPanelBusy(panel.id)
    setPanelsError(null)
    setPanelResult(null)
    try {
      await api.updateTicketPanel(guildId, panel.id, panel)
      const res = await api.publishTicketPanel(guildId, panel.id)
      setPanelResult({ id: panel.id, text: `Posted in #${res.channel_name} with ${res.option_count} option(s).` })
      setPanels(await api.ticketPanels(guildId))
    } catch (e) {
      setPanelsError(e.message)
    } finally {
      setPanelBusy(null)
    }
  }

  async function deletePanel(panelId) {
    setPanelBusy(panelId)
    try {
      await api.deleteTicketPanel(guildId, panelId)
      setPanels((list) => list.filter((p) => p.id !== panelId))
      setOpenPanel(null)
    } catch (e) {
      setPanelsError(e.message)
    } finally {
      setPanelBusy(null)
    }
  }

  useEffect(() => {
    if (tab === 'announcements' && user?.is_premium && announcements === null) {
      api.announcements(guildId).then(setAnnouncements).catch((e) => setAnnError(e.message))
    }
  }, [tab, user, guildId, announcements])

  useEffect(() => {
    if (tab === 'transcripts' && user?.is_premium && transcripts === null) {
      api.transcripts(guildId).then(setTranscripts).catch((e) => setTranscriptError(e.message))
    }
  }, [tab, user, guildId, transcripts])

  useEffect(() => {
    if (limits === null) {
      api.limits(guildId).then(setLimits).catch(() => {})
    }
  }, [guildId, limits])

  useEffect(() => {
    // Reuses the guild list the dashboard already loads, so the header can
    // show this server's name and icon without another dedicated endpoint.
    api.guilds()
      .then((d) => setGuildMeta((d.configured || []).find((g) => g.id === guildId) || null))
      .catch(() => {})
  }, [guildId])

  async function searchTranscripts() {
    setTranscriptError(null)
    try {
      setTranscripts(await api.transcripts(guildId, transcriptQuery))
    } catch (e) {
      setTranscriptError(e.message)
    }
  }

  async function viewTranscript(id) {
    if (openTranscript?.id === id) {
      setOpenTranscript(null)
      return
    }
    try {
      setOpenTranscript(await api.transcript(guildId, id))
    } catch (e) {
      setTranscriptError(e.message)
    }
  }

  function addSticky() {
    setConfig((c) => ({
      ...c,
      sticky_messages: [...(c.sticky_messages || []), { channel_id: '', title: '', content: '', color: '#3EC6FF', min_gap: 5 }],
    }))
  }

  function updateSticky(i, field, value) {
    setConfig((c) => {
      const next = [...(c.sticky_messages || [])]
      next[i] = { ...next[i], [field]: value }
      return { ...c, sticky_messages: next }
    })
  }

  function removeSticky(i) {
    setConfig((c) => ({ ...c, sticky_messages: (c.sticky_messages || []).filter((_, x) => x !== i) }))
  }

  function addStatsChannel() {
    setConfig((c) => ({
      ...c,
      stats_channels: [...(c.stats_channels || []), { channel_id: '', template: 'Members: {members}' }],
    }))
  }

  function updateStatsChannel(i, field, value) {
    setConfig((c) => {
      const next = [...(c.stats_channels || [])]
      next[i] = { ...next[i], [field]: value }
      return { ...c, stats_channels: next }
    })
  }

  function removeStatsChannel(i) {
    setConfig((c) => ({ ...c, stats_channels: (c.stats_channels || []).filter((_, x) => x !== i) }))
  }

  async function toggleLockdown(locked) {
    setLockBusy(true)
    setLockError(null)
    try {
      await api.raidLockdown(guildId, locked)
      setConfig((c) => ({ ...c, raid_manual_lock: locked }))
    } catch (e) {
      setLockError(e.message)
    } finally {
      setLockBusy(false)
    }
  }

  async function createAnnouncement() {
    setAnnBusy(true)
    setAnnError(null)
    try {
      const created = await api.createAnnouncement(guildId, {
        ...annForm,
        start_in_minutes: Number(annForm.start_in_minutes) || 0,
      })
      setAnnouncements((a) => [...(a || []), created])
      setAnnForm({ channel_id: '', title: '', message: '', color: '#3EC6FF', interval: 'daily', start_in_minutes: 0 })
    } catch (e) {
      setAnnError(e.message)
    } finally {
      setAnnBusy(false)
    }
  }

  async function removeAnnouncement(id) {
    try {
      await api.deleteAnnouncement(guildId, id)
      setAnnouncements((a) => a.filter((x) => x.id !== id))
    } catch (e) {
      setAnnError(e.message)
    }
  }

  useEffect(() => {
    if (tab === 'member_restore' && user?.is_premium && restorable === null) {
      api.restorableMembers(guildId).then(setRestorable).catch((e) => setRestoreError(e.message))
    }
  }, [tab, user, guildId, restorable])

  useEffect(() => {
    if (tab === 'overview' && overview === null) {
      api.overview(guildId).then(setOverview).catch(() => {})
    }
  }, [tab, guildId, overview])

  useEffect(() => {
    if (tab === 'commands' && commandList === null) {
      api.commands(guildId).then(setCommandList).catch((e) => setCommandError(e.message))
    }
  }, [tab, guildId, commandList])

  async function toggleCommand(name, enable) {
    if (!commandList) return
    setCommandBusy(true)
    setCommandError(null)
    const nextDisabled = commandList.commands
      .filter((c) => (c.name === name ? !enable : !c.enabled))
      .map((c) => c.name)
    try {
      await api.setCommands(guildId, nextDisabled)
      setCommandList((s) => ({
        ...s,
        commands: s.commands.map((c) => (c.name === name ? { ...c, enabled: enable } : c)),
      }))
    } catch (e) {
      setCommandError(e.message)
    } finally {
      setCommandBusy(false)
    }
  }

  async function applyIdentity(reset = false) {
    setIdentityBusy(true)
    setIdentityResult(null)
    try {
      await save()
      const res = reset ? await api.resetIdentity(guildId) : await api.applyIdentity(guildId)
      setIdentityResult(res)
      if (reset) setConfig((c) => ({ ...c, identity_enabled: false }))
    } catch (e) {
      setError(e.message)
    } finally {
      setIdentityBusy(false)
    }
  }

  async function setupStatsChannels() {
    setStatsSetupBusy(true)
    setStatsSetupResult(null)
    try {
      const res = await api.setupStatsChannels(guildId, statsPresets)
      setConfig(res.config)
      setStatsSetupResult(`Created ${res.created} channel(s).`)
      setLimits(null)
    } catch (e) {
      setStatsSetupResult(null)
      setError(e.message)
    } finally {
      setStatsSetupBusy(false)
    }
  }

  async function runMemberRestore() {
    setRestoreBusy(true)
    setRestoreError(null)
    setRestoreResult(null)
    try {
      setRestoreResult(await api.restoreMembers(guildId, selectedMembers))
      setRestorable(null)
      setSelectedMembers([])
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

  function addReward() {
    setConfig((c) => ({
      ...c,
      leveling_rewards: [...(c.leveling_rewards || []), { level: 5, role_id: '' }],
    }))
  }

  function updateReward(index, field, value) {
    setConfig((c) => {
      const next = [...(c.leveling_rewards || [])]
      next[index] = { ...next[index], [field]: value }
      return { ...c, leveling_rewards: next }
    })
  }

  function removeReward(index) {
    setConfig((c) => ({
      ...c,
      leveling_rewards: (c.leveling_rewards || []).filter((_, i) => i !== index),
    }))
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

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between gap-3 flex-wrap pb-4 border-b border-[var(--line)] sticky top-0 lg:top-2 z-20 bg-[var(--bg)]/85 backdrop-blur-md pt-3 rounded-b-xl">
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
              className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2.5 sm:py-1.5"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={2.25} />
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-6 grid lg:grid-cols-[220px_1fr] gap-4 lg:gap-8">
        {/* Mobile: a dropdown. 23 tabs in a horizontal scroll strip means
            swiping blindly through everything to find one setting, with the
            group labels hidden — so on small screens this becomes an
            explicit menu that shows the current section and keeps the
            Security / Community / Premium grouping intact. */}
        <div className="lg:hidden">
          <button
            onClick={() => setTabMenuOpen((v) => !v)}
            aria-expanded={tabMenuOpen}
            className="surface w-full flex items-center gap-2.5 rounded-xl border border-[var(--line)] px-4 py-3 text-left"
          >
            {activeTab?.Icon && <activeTab.Icon className="w-4 h-4 text-[var(--py-blue)] shrink-0" strokeWidth={2.25} />}
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--mist-dim)]">
                {activeGroupLabel}
              </span>
              <span className="block text-sm text-white truncate">{activeTab?.label}</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--mist-dim)] shrink-0 transition-transform ${tabMenuOpen ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>

          {tabMenuOpen && (
            <div className="surface mt-2 rounded-xl border border-[var(--line)] p-2 max-h-[60vh] overflow-y-auto animate-log-in">
              {TAB_GROUPS.map((group) => (
                <div key={group.label} className="mb-2 last:mb-0">
                  <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--mist-dim)] uppercase px-3 py-1.5">
                    {group.label}
                  </p>
                  {group.tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTab(t.id)
                        setTabMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors ${
                        tab === t.id
                          ? 'bg-[var(--py-blue)] text-[#06111f]'
                          : 'text-[var(--mist)] hover:bg-white/[0.04]'
                      }`}
                    >
                      <t.Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                      <span className="flex-1">{t.label}</span>
                      {t.premium && (
                        <span className="crown">
                          <Crown className="w-2.5 h-2.5" strokeWidth={2.75} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: the full sidebar, unchanged. */}
        <nav className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
          <div className="surface rounded-2xl border border-[var(--line)] px-3 py-3 mb-4 flex items-center gap-2.5">
            {guildMeta?.icon ? (
              <img src={guildMeta.icon} alt="" className="w-9 h-9 rounded-xl shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{guildMeta?.name || 'This server'}</p>
              <p className="text-[11px] text-[var(--mist-dim)]">
                {limits?.is_premium ? 'Premium' : 'Free plan'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {TAB_GROUPS.map((group) => (
              <div key={group.label} className="mb-4 last:mb-0">
                <p className="text-[11px] font-semibold tracking-wider text-[var(--mist-dim)]/70 uppercase mb-2 px-3">
                  {group.label}
                </p>
                {group.tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`nav-row flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-sm font-medium ${
                      tab === t.id
                        ? 'nav-row-active'
                        : 'text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)]'
                    }`}
                  >
                    <t.Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span className="flex-1 truncate">{t.label}</span>
                    {t.premium && (
                      <span className="crown" title={user?.is_premium ? 'Premium feature' : 'Premium required'}>
                        <Crown className="w-2.5 h-2.5" strokeWidth={2.75} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div className="min-w-0 w-full lg:max-w-2xl">
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
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium feature
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Member Restore is a premium feature</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              If your server gets raided and members are mass-kicked, pull your verified members
              back in automatically. Premium starts at €2.99 and is applied to your account instantly.
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

                  {restorable && restorable.entries.length > 0 && (
                    <div className="py-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-[var(--mist-dim)]">
                          Choose who to bring back — {restorable.missing} of {restorable.total} aren't in the server
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedMembers(restorable.entries.filter((e) => !e.in_server).map((e) => e.user_id))}
                            className="text-xs text-[var(--py-blue)] hover:underline"
                          >
                            Select all missing
                          </button>
                          <span className="text-[var(--line)]">·</span>
                          <button
                            onClick={() => setSelectedMembers([])}
                            className="text-xs text-[var(--mist-dim)] hover:text-[var(--mist)]"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="max-h-72 overflow-y-auto rounded-lg border border-[var(--line)] divide-y divide-[var(--line)]">
                        {restorable.entries.map((e) => {
                          const on = selectedMembers.includes(e.user_id)
                          return (
                            <button
                              key={e.user_id}
                              onClick={() =>
                                setSelectedMembers((prev) =>
                                  on ? prev.filter((x) => x !== e.user_id) : [...prev, e.user_id]
                                )
                              }
                              disabled={e.in_server}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                                e.in_server ? 'opacity-40 cursor-default' : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              {e.in_server ? (
                                <Square className="w-4 h-4 text-[var(--mist-dim)] shrink-0" strokeWidth={2} />
                              ) : on ? (
                                <CheckSquare className="w-4 h-4 text-[var(--py-blue)] shrink-0" strokeWidth={2} />
                              ) : (
                                <Square className="w-4 h-4 text-[var(--mist-dim)] shrink-0" strokeWidth={2} />
                              )}
                              <span className="text-sm text-white truncate flex-1">{e.username}</span>
                              {e.flags?.length > 0 && (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400/70 shrink-0" strokeWidth={2} />
                              )}
                              <span className="font-mono text-[10px] text-[var(--mist-dim)] shrink-0">
                                {e.in_server ? 'in server' : 'missing'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-xs text-[var(--mist-dim)] mt-2">
                        Members already in the server can't be selected — there's nothing to restore.
                      </p>
                    </div>
                  )}

                  <div className="pt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={runMemberRestore}
                      disabled={restoreBusy || !verifications.restorable || !verifications.encryption_enabled}
                      className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                    >
                      <ShieldCheck className="w-4 h-4" strokeWidth={2.25} />
                      {restoreBusy
                        ? 'Pulling members back...'
                        : selectedMembers.length
                          ? `Restore ${selectedMembers.length} selected`
                          : 'Restore everyone'}
                    </button>
                    {selectedMembers.length > 0 && (
                      <button
                        onClick={() => setSelectedMembers([])}
                        className="press inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-white transition-colors text-xs px-3 py-2"
                      >
                        <UserMinus className="w-3.5 h-3.5" strokeWidth={2} />
                        Clear selection
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--mist-dim)] mt-2">
                    With nothing selected this restores everyone who's missing. Members already in the
                    server are skipped either way, so running it twice is safe.
                  </p>

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

        {tab === 'ticket_panels' && (
          <>
            <Section
              title="Ticket panels"
              icon={LayoutList}
              description="Build panels with a dropdown menu. Each option can route to its own category, its own support team, and its own opening message."
            >
              {panelsError && <p className="text-sm text-red-400 py-2">{panelsError}</p>}
              {!panels && !panelsError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
              {panels && (
                <div className="py-3">
                  <button
                    onClick={addPanel}
                    disabled={panelBusy === 'new' || panels.length >= (limits?.limits.ticket_panels ?? 10)}
                    className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.25} />
                    {panelBusy === 'new' ? 'Creating...' : 'New panel'}
                  </button>
                  <p className="text-xs text-[var(--mist-dim)] mt-2">
                    {panels.length} of {limits?.limits.ticket_panels ?? 10} panels used
                    {limits && !limits.is_premium && ` · premium allows ${limits.premium_limits.ticket_panels}`}
                    . Each panel holds up to 25 dropdown options.
                  </p>
                </div>
              )}
            </Section>

            {panels?.map((panel) => (
              <div key={panel.id} className="surface rounded-xl border border-[var(--line)] mb-4 overflow-hidden">
                <button
                  onClick={() => setOpenPanel(openPanel === panel.id ? null : panel.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <LayoutList className="w-4 h-4 text-[var(--py-blue)] shrink-0" strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{panel.name || 'Untitled panel'}</p>
                    <p className="text-xs text-[var(--mist-dim)] mt-0.5">
                      {(panel.options || []).length} option(s)
                      {panel.message_id ? ' · published' : ' · not published yet'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--mist-dim)] shrink-0 transition-transform ${openPanel === panel.id ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </button>

                {openPanel === panel.id && (
                  <div className="px-5 pb-5 border-t border-[var(--line)] pt-4 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Panel name (only you see this)">
                        <TextInput value={panel.name} onChange={(v) => editPanel(panel.id, { name: v })} maxLength={60} />
                      </Field>
                      <Field label="Channel">
                        <Select
                          value={panel.channel_id}
                          onChange={(v) => editPanel(panel.id, { channel_id: v })}
                          options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                          placeholder="Select a channel..."
                        />
                      </Field>
                    </div>

                    <Field label="Embed title">
                      <TextInput value={panel.title} onChange={(v) => editPanel(panel.id, { title: v })} maxLength={100} />
                    </Field>
                    <Field label="Embed description">
                      <TextArea value={panel.description} onChange={(v) => editPanel(panel.id, { description: v })} maxLength={500} rows={2} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Dropdown placeholder">
                        <TextInput value={panel.placeholder} onChange={(v) => editPanel(panel.id, { placeholder: v })} maxLength={100} />
                      </Field>
                      <Field label="Embed color">
                        <ColorInput value={panel.color} onChange={(v) => editPanel(panel.id, { color: v })} />
                      </Field>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-2">
                        Dropdown options
                      </p>
                      <div className="space-y-3">
                        {(panel.options || []).map((opt, i) => (
                          <div key={i} className="rounded-lg border border-[var(--line)] p-3 space-y-2.5">
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                              <input
                                value={opt.emoji || ''}
                                onChange={(e) => editOption(panel.id, i, { emoji: e.target.value })}
                                placeholder="🎫"
                                className="w-14 shrink-0 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-center text-sm text-white px-2 py-2 field-focus"
                              />
                              <input
                                value={opt.label || ''}
                                onChange={(e) => editOption(panel.id, i, { label: e.target.value })}
                                placeholder="Option label"
                                maxLength={100}
                                className="flex-1 min-w-0 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                              />
                              <button
                                onClick={() => removeOption(panel.id, i)}
                                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                              >
                                <X className="w-4 h-4" strokeWidth={2} />
                              </button>
                            </div>

                            <input
                              value={opt.description || ''}
                              onChange={(e) => editOption(panel.id, i, { description: e.target.value })}
                              placeholder="Short description shown in the dropdown (optional)"
                              maxLength={100}
                              className="w-full rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                            />

                            <div className="grid sm:grid-cols-2 gap-2">
                              <select
                                value={opt.category_id ?? ''}
                                onChange={(e) => editOption(panel.id, i, { category_id: e.target.value })}
                                className="rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                              >
                                <option value="">Category for these tickets...</option>
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                              <input
                                value={opt.name_prefix || ''}
                                onChange={(e) => editOption(panel.id, i, { name_prefix: e.target.value })}
                                placeholder="Channel prefix, e.g. billing"
                                maxLength={20}
                                className="rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
                              />
                            </div>

                            <div>
                              <p className="text-xs text-[var(--mist-dim)] mb-1.5">Support roles for this option</p>
                              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                {roles.map((role) => {
                                  const on = (opt.support_role_ids || []).includes(role.id)
                                  return (
                                    <button
                                      key={role.id}
                                      onClick={() =>
                                        editOption(panel.id, i, {
                                          support_role_ids: on
                                            ? opt.support_role_ids.filter((r) => r !== role.id)
                                            : [...(opt.support_role_ids || []), role.id],
                                        })
                                      }
                                      className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                                        on
                                          ? 'border-[var(--py-blue)] text-white'
                                          : 'border-[var(--line)] text-[var(--mist-dim)] hover:text-[var(--mist)]'
                                      }`}
                                    >
                                      {role.name}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={opt.ping_support !== false}
                                onChange={(e) => editOption(panel.id, i, { ping_support: e.target.checked })}
                                className="accent-[var(--py-blue)]"
                              />
                              <span className="text-xs text-[var(--mist)]">Ping these roles when a ticket opens</span>
                            </label>

                            <TextArea
                              value={opt.intro_message || ''}
                              onChange={(v) => editOption(panel.id, i, { intro_message: v })}
                              maxLength={500}
                              rows={2}
                              placeholder="Opening message for this option (optional) — use {member} to mention them"
                            />
                          </div>
                        ))}

                        {(panel.options || []).length === 0 && (
                          <p className="text-xs text-[var(--mist-dim)]">No options yet — add at least one before publishing.</p>
                        )}

                        {(panel.options || []).length < 25 && (
                          <button
                            onClick={() => addOption(panel.id)}
                            className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline"
                          >
                            <Plus className="w-4 h-4" strokeWidth={2.25} />
                            Add an option
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--line)]">
                      <button
                        onClick={() => savePanel(panel)}
                        disabled={panelBusy === panel.id}
                        className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg)] hover:brightness-125 disabled:opacity-50 border border-[var(--line)] transition-all text-white text-xs font-medium px-3 py-2"
                      >
                        <Save className="w-3.5 h-3.5" strokeWidth={2.25} />
                        Save
                      </button>
                      <button
                        onClick={() => publishPanel(panel)}
                        disabled={panelBusy === panel.id}
                        className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-xs font-semibold px-3 py-2"
                      >
                        <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
                        {panelBusy === panel.id ? 'Working...' : panel.message_id ? 'Repost panel' : 'Publish panel'}
                      </button>
                      <button
                        onClick={() => deletePanel(panel.id)}
                        disabled={panelBusy === panel.id}
                        className="press inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 disabled:opacity-50 transition-colors text-xs px-3 py-2 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        Delete
                      </button>
                    </div>

                    {panelResult?.id === panel.id && (
                      <p className="text-xs text-emerald-400">{panelResult.text}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {(tab === 'raid_mode' || tab === 'announcements') && !user?.is_premium && (
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="eyebrow mb-3">Premium feature</p>
            <h2 className="font-display text-lg font-bold text-white mb-2">
              {tab === 'raid_mode' ? 'Raid Mode' : 'Scheduled Announcements'} is a premium feature
            </h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              {tab === 'raid_mode'
                ? 'Detect join spikes and lock the server down before the damage starts, with automatic release.'
                : 'Write a message once and let it post itself — once, hourly, daily, or weekly.'}{' '}
              Premium starts at €2.99 and is applied to your account instantly.
            </p>
            <a
              href="/premium"
              className="press inline-block rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-2.5"
            >
              Get Premium
            </a>
          </div>
        )}

        {tab === 'raid_mode' && user?.is_premium && (
          <>
            <Section
              title="Lockdown"
              icon={config.raid_manual_lock ? LockIcon : Unlock}
              description="Revokes send and react from @everyone. Use it the moment something looks wrong — it's instantly reversible."
            >
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-white">Server status</p>
                  <p className="text-xs text-[var(--mist-dim)] mt-0.5">
                    {config.raid_manual_lock ? 'Locked down — members cannot send messages.' : 'Open — normal operation.'}
                  </p>
                </div>
                <span
                  className={`font-mono text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    config.raid_manual_lock ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {config.raid_manual_lock ? 'LOCKED' : 'OPEN'}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => toggleLockdown(true)}
                  disabled={lockBusy || config.raid_manual_lock}
                  className="press inline-flex items-center gap-1.5 rounded-lg bg-red-500/90 hover:brightness-110 disabled:opacity-40 transition-all text-white text-sm font-semibold px-4 py-2"
                >
                  <LockIcon className="w-4 h-4" strokeWidth={2.25} />
                  Lock server
                </button>
                <button
                  onClick={() => toggleLockdown(false)}
                  disabled={lockBusy || !config.raid_manual_lock}
                  className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg)] hover:brightness-125 disabled:opacity-40 border border-[var(--line)] transition-all text-white text-sm font-medium px-4 py-2"
                >
                  <Unlock className="w-4 h-4" strokeWidth={2.25} />
                  Release
                </button>
              </div>
              {lockError && <p className="text-sm text-red-400 mt-3">{lockError}</p>}
            </Section>

            <Section title="Automatic detection" icon={Siren} description="Watches for a burst of joins and reacts on its own">
              <Toggle
                label="Enable raid detection"
                checked={config.raid_mode_enabled}
                onChange={(v) => set('raid_mode_enabled', v)}
              />
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
                <Field label="Joins to trigger">
                  <NumberInput value={config.raid_join_threshold} onChange={(v) => set('raid_join_threshold', v)} min={3} max={100} />
                </Field>
                <Field label="Within (seconds)">
                  <NumberInput value={config.raid_window_seconds} onChange={(v) => set('raid_window_seconds', v)} min={5} max={300} />
                </Field>
              </div>
              <Field label="What to do">
                <Select
                  value={config.raid_action}
                  onChange={(v) => set('raid_action', v)}
                  options={[
                    { value: 'lockdown', label: 'Lock the server down (recommended)' },
                    { value: 'kick_wave', label: 'Kick the new accounts in the wave' },
                    { value: 'alert_only', label: 'Alert staff only, take no action' },
                  ]}
                />
              </Field>
              {config.raid_action === 'kick_wave' && (
                <Field label="Only kick accounts newer than (days)">
                  <NumberInput value={config.raid_min_account_age_days} onChange={(v) => set('raid_min_account_age_days', v)} min={0} max={365} />
                </Field>
              )}
              {config.raid_action === 'lockdown' && (
                <Field label="Auto-release after (minutes, 0 = manual only)">
                  <NumberInput value={config.raid_auto_release_minutes} onChange={(v) => set('raid_auto_release_minutes', v)} min={0} max={1440} />
                </Field>
              )}
              <p className="text-xs text-[var(--mist-dim)] pt-3">
                Lockdown is the default on purpose — a wrong kick can't be undone, a lockdown can.
                Kick-wave only ever targets accounts inside the burst that are also newer than the
                age above, so long-standing members who happen to join at the same time are never caught.
              </p>
            </Section>

            <Section title="Alerts">
              <Field label="Alert channel (falls back to your main log channel)">
                <Select
                  value={config.raid_alert_channel_id}
                  onChange={(v) => set('raid_alert_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Use the main log channel"
                />
              </Field>
              <Field label="Role to ping on a raid">
                <Select
                  value={config.raid_alert_role_id}
                  onChange={(v) => set('raid_alert_role_id', v)}
                  options={roles.map((r) => ({ value: r.id, label: r.name }))}
                  placeholder="Don't ping anyone"
                />
              </Field>
            </Section>
          </>
        )}

        {tab === 'announcements' && user?.is_premium && (
          <>
            <Section title="New announcement" icon={CalendarClock} description="Post once, or on a repeating schedule">
              {annError && <p className="text-sm text-red-400 py-2">{annError}</p>}
              <Field label="Channel">
                <Select
                  value={annForm.channel_id}
                  onChange={(v) => setAnnForm((f) => ({ ...f, channel_id: v }))}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <Field label="Embed title (leave blank to post as a plain message)">
                <TextInput value={annForm.title} onChange={(v) => setAnnForm((f) => ({ ...f, title: v }))} maxLength={100} />
              </Field>
              <Field label="Message">
                <TextArea
                  value={annForm.message}
                  onChange={(v) => setAnnForm((f) => ({ ...f, message: v }))}
                  maxLength={2000}
                  rows={4}
                  placeholder="What should PySecured post?"
                />
              </Field>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
                <Field label="Repeat">
                  <Select
                    value={annForm.interval}
                    onChange={(v) => setAnnForm((f) => ({ ...f, interval: v }))}
                    options={[
                      { value: 'once', label: 'Once' },
                      { value: 'hourly', label: 'Every hour' },
                      { value: 'daily', label: 'Every day' },
                      { value: 'weekly', label: 'Every week' },
                    ]}
                  />
                </Field>
                <Field label="First post in (minutes)">
                  <NumberInput
                    value={annForm.start_in_minutes}
                    onChange={(v) => setAnnForm((f) => ({ ...f, start_in_minutes: v }))}
                    min={0}
                    max={525600}
                  />
                </Field>
              </div>
              {annForm.title && (
                <Field label="Embed color">
                  <ColorInput value={annForm.color} onChange={(v) => setAnnForm((f) => ({ ...f, color: v }))} />
                </Field>
              )}
              <div className="pt-3">
                <button
                  onClick={createAnnouncement}
                  disabled={annBusy || !annForm.message.trim() || !annForm.channel_id}
                  className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                >
                  <CalendarClock className="w-4 h-4" strokeWidth={2.25} />
                  {annBusy ? 'Scheduling...' : 'Schedule it'}
                </button>
                <p className="text-xs text-[var(--mist-dim)] mt-2">
                  Repeating posts keep their original time — a daily post scheduled for 09:00 stays at 09:00.
                </p>
              </div>
            </Section>

            <Section title="Scheduled">
              {!announcements && !annError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
              {announcements && announcements.length === 0 && (
                <p className="text-xs text-[var(--mist-dim)] py-2">Nothing scheduled yet.</p>
              )}
              <div className="divide-y divide-[var(--line)]">
                {announcements?.map((a) => (
                  <div key={a.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{a.title || a.message.slice(0, 60)}</p>
                      <p className="text-xs text-[var(--mist-dim)] mt-0.5">
                        {a.interval === 'once' ? 'Once' : `Every ${a.interval.replace('ly', '')}`}
                        {' · '}
                        {a.enabled
                          ? `next ${new Date(a.next_run).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                          : 'finished'}
                        {a.run_count > 0 && ` · sent ${a.run_count}×`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAnnouncement(a.id)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === 'message_log' && (
          <>
            <Section
              title="Message logging"
              icon={ScrollText}
              description="Records what members edit and delete, so moderators can see what was actually said."
            >
              <Toggle label="Enable message logging" checked={config.message_log_enabled} onChange={(v) => set('message_log_enabled', v)} />
              <Field label="Log channel (falls back to your main log channel)">
                <Select
                  value={config.message_log_channel_id}
                  onChange={(v) => set('message_log_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Use the main log channel"
                />
              </Field>
              <Toggle label="Log edited messages" checked={config.message_log_edits} onChange={(v) => set('message_log_edits', v)} />
              <Toggle label="Log deleted messages" checked={config.message_log_deletes} onChange={(v) => set('message_log_deletes', v)} />
              <Toggle label="Log bulk deletes (purges)" checked={config.message_log_bulk_deletes} onChange={(v) => set('message_log_bulk_deletes', v)} />
              <Toggle label="Ignore bots" checked={config.message_log_ignore_bots} onChange={(v) => set('message_log_ignore_bots', v)} />
            </Section>

            <Section title="Ignored channels" description="Nothing from these channels is ever logged">
              <div className="py-3 space-y-1 max-h-64 overflow-y-auto">
                {channels.map((c) => {
                  const on = (config.message_log_ignored_channel_ids || []).includes(c.id)
                  return (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          set(
                            'message_log_ignored_channel_ids',
                            on
                              ? config.message_log_ignored_channel_ids.filter((x) => x !== c.id)
                              : [...(config.message_log_ignored_channel_ids || []), c.id]
                          )
                        }
                        className="accent-[var(--py-blue)]"
                      />
                      <span className="text-sm text-[var(--mist)]">#{c.name}</span>
                    </label>
                  )
                })}
              </div>
            </Section>
          </>
        )}

        {tab === 'suggestions' && (
          <>
            <Section
              title="Suggestions"
              icon={Lightbulb}
              description="Members run /suggest, the bot posts it with vote reactions, and staff approve or decline with /approve and /decline."
            >
              <Toggle label="Enable suggestions" checked={config.suggestions_enabled} onChange={(v) => set('suggestions_enabled', v)} />
              <Field label="Suggestions channel">
                <Select
                  value={config.suggestions_channel_id}
                  onChange={(v) => set('suggestions_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select a channel..."
                />
              </Field>
              <Field label="Review channel (optional — approved/declined get reposted here)">
                <Select
                  value={config.suggestions_review_channel_id}
                  onChange={(v) => set('suggestions_review_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Don't repost"
                />
              </Field>
              <Toggle
                label="Anonymous suggestions"
                description="Hides who submitted it from everyone who reads the channel"
                checked={config.suggestions_anonymous}
                onChange={(v) => set('suggestions_anonymous', v)}
              />
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
                <Field label="Upvote emoji">
                  <input
                    value={config.suggestions_upvote_emoji || ''}
                    onChange={(e) => set('suggestions_upvote_emoji', e.target.value)}
                    className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-3 py-2 field-focus"
                  />
                </Field>
                <Field label="Downvote emoji">
                  <input
                    value={config.suggestions_downvote_emoji || ''}
                    onChange={(e) => set('suggestions_downvote_emoji', e.target.value)}
                    className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-3 py-2 field-focus"
                  />
                </Field>
              </div>
              <p className="text-xs text-[var(--mist-dim)] pt-2">
                To approve or decline, right-click the suggestion in Discord → Copy Message ID, then run
                <code className="font-mono"> /approve</code> or <code className="font-mono">/decline</code> with it.
              </p>
            </Section>
          </>
        )}

        {tab === 'stats_channels' && (
          <Section
            title="Server stats channels"
            icon={BarChart2}
            description="Renames channels to show live counts. Create a voice channel, lock it so nobody can join, and point one of these at it."
          >
            <Toggle label="Enable stats channels" checked={config.stats_channels_enabled} onChange={(v) => set('stats_channels_enabled', v)} />

            <div className="py-4 my-3 rounded-lg border border-[var(--py-blue)]/25 bg-[var(--py-blue)]/5 px-4">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-[var(--py-blue)]" strokeWidth={2} />
                <p className="text-sm text-white font-medium">Set it up for me</p>
              </div>
              <p className="text-xs text-[var(--mist-dim)] mb-3">
                Creates a "Server Stats" category with locked voice channels — visible to everyone,
                joinable by nobody. Pick what you want shown:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  ['members', '👥 Members'],
                  ['humans', '🧍 Humans'],
                  ['bots', '🤖 Bots'],
                  ['online', '🟢 Online'],
                  ['boosts', '💜 Boosts'],
                  ['roles', '🎭 Roles'],
                  ['channels', '💬 Channels'],
                ].map(([key, label]) => {
                  const on = statsPresets.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setStatsPresets((p) => (on ? p.filter((x) => x !== key) : [...p, key]))
                      }
                      className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                        on ? 'border-[var(--py-blue)] text-white' : 'border-[var(--line)] text-[var(--mist-dim)] hover:text-[var(--mist)]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={setupStatsChannels}
                disabled={statsSetupBusy || statsPresets.length === 0}
                className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
              >
                <Wand2 className="w-4 h-4" strokeWidth={2.25} />
                {statsSetupBusy ? 'Creating channels...' : `Create ${statsPresets.length} channel(s)`}
              </button>
              {statsSetupResult && <p className="text-xs text-emerald-400 mt-2">{statsSetupResult}</p>}
            </div>

            <p className="text-xs text-[var(--mist-dim)] pt-2">Or point them at existing channels yourself:</p>
            <div className="py-3 space-y-2">
              {(config.stats_channels || []).map((st, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={st.channel_id ?? ''}
                    onChange={(e) => updateStatsChannel(i, 'channel_id', e.target.value)}
                    className="w-full sm:w-44 sm:shrink-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                  >
                    <option value="">Select a channel...</option>
                    {channels.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    value={st.template || ''}
                    onChange={(e) => updateStatsChannel(i, 'template', e.target.value)}
                    placeholder="Members: {members}"
                    className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
                  />
                  <button
                    onClick={() => removeStatsChannel(i)}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
              {(config.stats_channels || []).length === 0 && (
                <p className="text-xs text-[var(--mist-dim)] py-2">No stats channels yet.</p>
              )}
              {(!limits || (config.stats_channels || []).length < limits.limits.stats_channels) && (
                <button onClick={addStatsChannel} className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline pt-1">
                  <Plus className="w-4 h-4" strokeWidth={2.25} />
                  Add a stats channel
                </button>
              )}
              {limits && (
                <p className="text-xs text-[var(--mist-dim)] pt-1">
                  {(config.stats_channels || []).length} of {limits.limits.stats_channels} used
                  {!limits.is_premium && ` · premium allows ${limits.premium_limits.stats_channels}`}
                </p>
              )}
              <div className="pt-3">
                <p className="text-xs text-[var(--mist-dim)] mb-1.5">Available placeholders</p>
                <div className="flex flex-wrap gap-1.5">
                  {['{members}', '{humans}', '{bots}', '{online}', '{roles}', '{channels}', '{boosts}'].map((ph) => (
                    <code key={ph} className="font-mono text-[11px] text-[var(--py-blue)] border border-[var(--line)] rounded-md px-2 py-1">
                      {ph}
                    </code>
                  ))}
                </div>
                <p className="text-xs text-[var(--mist-dim)] mt-3">
                  Names refresh every 10 minutes — Discord rate-limits channel renames to twice per
                  10 minutes, so updating faster would just get throttled.
                </p>
              </div>
            </div>
          </Section>
        )}

        {(tab === 'transcripts' || tab === 'branding') && !user?.is_premium && (
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="eyebrow mb-3">Premium feature</p>
            <h2 className="font-display text-lg font-bold text-white mb-2">
              {tab === 'transcripts' ? 'Hosted transcripts' : 'Custom branding'} is a premium feature
            </h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              {tab === 'transcripts'
                ? "Browse and search every closed ticket right here, instead of digging through log-channel attachments. Transcripts are already being saved for this server — premium unlocks reading them."
                : 'Put your own footer, icon, and accent colour on every embed PySecured sends.'}{' '}
              Premium starts at €2.99 and is applied to your account instantly.
            </p>
            <a
              href="/premium"
              className="press inline-block rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-2.5"
            >
              Get Premium
            </a>
          </div>
        )}

        {tab === 'transcripts' && user?.is_premium && (
          <Section title="Ticket transcripts" icon={FileText} description="Every closed ticket, searchable by channel, staff member, or what was said inside it.">
            {transcriptError && <p className="text-sm text-red-400 py-2">{transcriptError}</p>}
            <div className="flex items-center gap-2 py-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                <input
                  value={transcriptQuery}
                  onChange={(e) => setTranscriptQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchTranscripts()}
                  placeholder="Search transcripts..."
                  className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white pl-9 pr-3 py-2 field-focus"
                />
              </div>
              <button
                onClick={searchTranscripts}
                className="press shrink-0 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 border border-[var(--line)] transition-all text-white text-xs font-medium px-3 py-2"
              >
                Search
              </button>
            </div>

            {!transcripts && !transcriptError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}
            {transcripts && transcripts.length === 0 && (
              <p className="text-xs text-[var(--mist-dim)] py-2">
                {transcriptQuery ? 'No transcripts match that.' : 'No tickets have been closed yet.'}
              </p>
            )}

            <div className="divide-y divide-[var(--line)]">
              {transcripts?.map((t) => (
                <div key={t.id}>
                  <button onClick={() => viewTranscript(t.id)} className="w-full py-3 flex items-center justify-between gap-3 text-left group">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate group-hover:text-[var(--py-blue)] transition-colors">
                        #{t.channel_name}
                      </p>
                      <p className="text-xs text-[var(--mist-dim)] mt-0.5">
                        {t.message_count} message(s) · closed by {t.closed_by} ·{' '}
                        {new Date(t.closed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--mist-dim)] shrink-0 transition-transform ${openTranscript?.id === t.id ? 'rotate-180' : ''}`}
                      strokeWidth={2}
                    />
                  </button>

                  {openTranscript?.id === t.id && (
                    <div className="pb-4 max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 p-3 space-y-2">
                      {openTranscript.messages.map((m, i) => (
                        <div key={i} className="text-xs">
                          <div className="flex items-baseline gap-2">
                            <span className={`font-medium ${m.bot ? 'text-[var(--mist-dim)]' : 'text-[var(--py-blue)]'}`}>
                              {m.author}
                            </span>
                            <span className="text-[10px] text-[var(--mist-dim)]">
                              {new Date(m.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[var(--mist)] whitespace-pre-wrap break-words">
                            {m.content || <em className="text-[var(--mist-dim)]">(no text content)</em>}
                          </p>
                          {m.attachments?.length > 0 && (
                            <p className="text-[10px] text-[var(--mist-dim)] mt-0.5">📎 {m.attachments.join(', ')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === 'branding' && user?.is_premium && (
          <Section title="Custom branding" icon={Palette} description="Replaces the default footer on embeds PySecured sends in your server.">
            <Toggle label="Enable custom branding" checked={config.branding_enabled} onChange={(v) => set('branding_enabled', v)} />
            <Field label="Footer text">
              <TextInput
                value={config.branding_footer_text}
                onChange={(v) => set('branding_footer_text', v)}
                maxLength={100}
                placeholder="Your server name"
              />
            </Field>
            <Field label="Footer icon URL (https only)">
              <TextInput
                value={config.branding_footer_icon_url}
                onChange={(v) => set('branding_footer_icon_url', v)}
                maxLength={300}
                placeholder="https://example.com/logo.png"
              />
            </Field>
            <Field label="Accent color (leave blank to keep each embed's own color)">
              <ColorInput value={config.branding_accent_color || '#3EC6FF'} onChange={(v) => set('branding_accent_color', v)} />
            </Field>
            <p className="text-xs text-[var(--mist-dim)] pt-3">
              Applies to message logs, suggestions, and ticket embeds. An invalid icon URL or colour is
              ignored rather than breaking the message.
            </p>
          </Section>
        )}

        {tab === 'afk' && (
          <Section title="AFK" icon={Moon} description="Members run /afk to mark themselves away. Anyone who mentions them gets told, and posting a message clears it automatically.">
            <Toggle label="Enable AFK" checked={config.afk_enabled} onChange={(v) => set('afk_enabled', v)} />
            <Toggle
              label="Add [AFK] to their nickname"
              description="Visible without anyone needing to mention them. Skipped silently if PySecured can't rename that member."
              checked={config.afk_change_nickname}
              onChange={(v) => set('afk_change_nickname', v)}
            />
            <p className="text-xs text-[var(--mist-dim)] pt-3">
              PySecured needs Manage Nicknames for the nickname part, and it can never rename the
              server owner or anyone above its own role — that's a Discord restriction, not a setting.
            </p>
          </Section>
        )}

        {tab === 'autopublish' && (
          <Section title="Auto-publish" icon={Megaphone} description="Automatically publishes messages posted in announcement channels, so servers following yours actually receive them.">
            <Toggle label="Enable auto-publish" checked={config.autopublish_enabled} onChange={(v) => set('autopublish_enabled', v)} />
            <div className="py-3">
              <p className="text-xs text-[var(--mist-dim)] mb-2">Channels to auto-publish</p>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {channels.map((c) => {
                  const on = (config.autopublish_channel_ids || []).includes(c.id)
                  return (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          set(
                            'autopublish_channel_ids',
                            on
                              ? config.autopublish_channel_ids.filter((x) => x !== c.id)
                              : [...(config.autopublish_channel_ids || []), c.id]
                          )
                        }
                        className="accent-[var(--py-blue)]"
                      />
                      <span className="text-sm text-[var(--mist)]">#{c.name}</span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-[var(--mist-dim)] mt-3">
                Only works in channels Discord marks as <strong>Announcement</strong> channels — regular
                text channels have nothing to publish. Discord also caps publishes per hour; anything
                over that is skipped rather than queued.
              </p>
            </div>
          </Section>
        )}

        {tab === 'identity' && !user?.is_premium && (
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="eyebrow mb-3">Premium feature</p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Per-server bot identity is a premium feature</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              Give PySecured its own name, avatar, banner, and bio in your server — completely
              separate from how it appears anywhere else. Premium starts at €2.99 and is applied to your account instantly.
            </p>
            <a
              href="/premium"
              className="press inline-block rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-2.5"
            >
              Get Premium
            </a>
          </div>
        )}

        {tab === 'identity' && user?.is_premium && (
          <>
            <Section
              title="Bot identity in this server"
              icon={Sparkles}
              description="Make PySecured look like it belongs to your server. These apply here only — every other server sees it differently."
            >
              <Toggle label="Use a custom identity here" checked={config.identity_enabled} onChange={(v) => set('identity_enabled', v)} />
              <Field label="Nickname (up to 32 characters)">
                <TextInput value={config.identity_nickname} onChange={(v) => set('identity_nickname', v)} maxLength={32} placeholder="Aegis" />
              </Field>
              <Field label="Avatar URL (https, PNG/JPG/GIF/WebP, under 8 MB)">
                <TextInput value={config.identity_avatar_url} onChange={(v) => set('identity_avatar_url', v)} maxLength={400} placeholder="https://example.com/avatar.png" />
              </Field>
              <Field label="Banner URL (https, same formats)">
                <TextInput value={config.identity_banner_url} onChange={(v) => set('identity_banner_url', v)} maxLength={400} placeholder="https://example.com/banner.png" />
              </Field>
              <Field label="Bio — the 'About Me' shown on its profile here">
                <TextArea value={config.identity_bio} onChange={(v) => set('identity_bio', v)} maxLength={190} rows={2} placeholder="Your server's helper." />
              </Field>

              <div className="flex flex-wrap items-center gap-2 pt-3">
                <button
                  onClick={() => applyIdentity(false)}
                  disabled={identityBusy || !config.identity_enabled}
                  className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-2"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={2.25} />
                  {identityBusy ? 'Applying...' : 'Save & apply'}
                </button>
                <button
                  onClick={() => applyIdentity(true)}
                  disabled={identityBusy}
                  className="press inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-white transition-colors text-sm px-4 py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                  Reset to default
                </button>
              </div>

              {identityResult && (
                <div className="mt-3 space-y-1">
                  {identityResult.applied?.length > 0 && (
                    <p className="text-xs text-emerald-400">
                      Applied: {identityResult.applied.join(', ')}.
                    </p>
                  )}
                  {identityResult.failed?.length > 0 && (
                    <div className="text-xs text-amber-400">
                      <p>Couldn't apply:</p>
                      <ul className="list-disc pl-4 mt-0.5">
                        {identityResult.failed.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                  {!identityResult.applied?.length && !identityResult.failed?.length && (
                    <p className="text-xs text-[var(--mist-dim)]">Nothing to apply — fill in at least one field.</p>
                  )}
                </div>
              )}
            </Section>

            <Section title="What this can and can't change">
              <div className="py-3 text-sm text-[var(--mist)] space-y-2">
                <p><strong className="text-white">Per-server, so only you see it:</strong></p>
                <ul className="list-disc pl-5 text-xs space-y-1 marker:text-[var(--py-blue)]">
                  <li>Nickname, avatar, banner, and bio inside this server</li>
                </ul>
                <p className="pt-1"><strong className="text-white">Stays global, because Discord has no per-server version:</strong></p>
                <ul className="list-disc pl-5 text-xs space-y-1 marker:text-[var(--mist-dim)]">
                  <li>The application name shown in the App Directory and "Add to Server" pages</li>
                  <li>The application description on its public profile</li>
                  <li>
                    The <strong>status</strong> line ("Watching 8 servers") — a bot has one presence
                    across its whole gateway connection, so every server sees the same text
                  </li>
                </ul>
                <p className="text-xs text-[var(--mist-dim)] pt-2">
                  PySecured needs Change Nickname here for the nickname. Discord can also refuse
                  avatars or banners depending on the bot's status — if that happens you'll see
                  exactly which part was refused rather than a silent failure.
                </p>
              </div>
            </Section>
          </>
        )}

        {tab === 'antinuke' && !user?.is_premium && (
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="eyebrow mb-3">Premium feature</p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Anti-nuke is a premium feature</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              Stops a compromised admin or rogue moderator from mass-deleting channels, wiping roles,
              or mass-banning members. Premium starts at €2.99 and is applied to your account instantly.
            </p>
            <a href="/premium"
               className="press inline-block rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-2.5">
              Get Premium
            </a>
          </div>
        )}

        {tab === 'antinuke' && user?.is_premium && (
          <>
            <Section
              title="Anti-nuke"
              icon={ShieldX}
              description="Raid mode stops attacks from outside. This stops the other kind — someone who already has permissions going destructive, whether they're compromised or malicious."
            >
              <Toggle label="Enable anti-nuke" checked={config.antinuke_enabled} onChange={(v) => set('antinuke_enabled', v)} />
              <Field label="What to do when it triggers">
                <Select
                  value={config.antinuke_action}
                  onChange={(v) => set('antinuke_action', v)}
                  options={[
                    { value: 'strip_roles', label: 'Strip all their roles (recommended)' },
                    { value: 'ban', label: 'Ban them' },
                    { value: 'alert_only', label: 'Alert staff only, take no action' },
                  ]}
                />
              </Field>
              <p className="text-xs text-[var(--mist-dim)] pb-2">
                Stripping roles is the default because it's reversible in seconds — banning your own
                head admin on a false positive isn't.
              </p>
              <Field label="Detection window (seconds)">
                <NumberInput value={config.antinuke_window_seconds} onChange={(v) => set('antinuke_window_seconds', v)} min={5} max={300} />
              </Field>
            </Section>

            <Section title="Thresholds" description="How many of each action, within the window above, before it triggers">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
                <Field label="Channel deletions">
                  <NumberInput value={config.antinuke_channel_delete_limit} onChange={(v) => set('antinuke_channel_delete_limit', v)} min={1} max={50} />
                </Field>
                <Field label="Role deletions">
                  <NumberInput value={config.antinuke_role_delete_limit} onChange={(v) => set('antinuke_role_delete_limit', v)} min={1} max={50} />
                </Field>
                <Field label="Bans">
                  <NumberInput value={config.antinuke_ban_limit} onChange={(v) => set('antinuke_ban_limit', v)} min={1} max={50} />
                </Field>
                <Field label="Kicks">
                  <NumberInput value={config.antinuke_kick_limit} onChange={(v) => set('antinuke_kick_limit', v)} min={1} max={50} />
                </Field>
              </div>
              <p className="text-xs text-[var(--mist-dim)]">
                Each action type is counted separately and per person — two moderators each banning
                three people won't trigger it, one person banning six will.
              </p>
            </Section>

            <Section title="Alerts & exemptions">
              <Field label="Alert channel (falls back to your main log channel)">
                <Select
                  value={config.antinuke_alert_channel_id}
                  onChange={(v) => set('antinuke_alert_channel_id', v)}
                  options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Use the main log channel"
                />
              </Field>
              <Field label="Role to ping when it triggers">
                <Select
                  value={config.antinuke_alert_role_id}
                  onChange={(v) => set('antinuke_alert_role_id', v)}
                  options={roles.map((r) => ({ value: r.id, label: r.name }))}
                  placeholder="Don't ping anyone"
                />
              </Field>
              <div className="py-3">
                <p className="text-xs text-[var(--mist-dim)] mb-1.5">Always exempt</p>
                <ul className="text-xs text-[var(--mist)] space-y-1 list-disc pl-5 marker:text-[var(--py-blue)]">
                  <li>The server owner — Discord won't let a bot action them regardless</li>
                  <li>PySecured itself, so its own moderation can't trip this</li>
                </ul>
                <p className="text-xs text-[var(--mist-dim)] mt-3">
                  PySecured needs <strong>View Audit Log</strong> to see who performed an action, and its
                  role must sit above anyone it's expected to act on.
                </p>
              </div>
            </Section>
          </>
        )}

        {tab === 'temp_roles' && !user?.is_premium && (
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="eyebrow mb-3">Premium feature</p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Temporary roles are a premium feature</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              Grant a role that removes itself automatically — event access, trial moderator, timed perks.
              Premium starts at €2.99 and is applied to your account instantly.
            </p>
            <a href="/premium"
               className="press inline-block rounded-lg bg-[var(--py-blue)] hover:brightness-110 transition-all text-[#06111f] text-sm font-semibold px-5 py-2.5">
              Get Premium
            </a>
          </div>
        )}

        {tab === 'temp_roles' && user?.is_premium && (
          <Section title="Temporary roles" icon={Timer} description="Moderators run /temprole to grant a role that expires on its own.">
            <Toggle label="Enable temporary roles" checked={config.temp_roles_enabled} onChange={(v) => set('temp_roles_enabled', v)} />
            <Field label="Log channel (falls back to your main log channel)">
              <Select
                value={config.temp_roles_log_channel_id}
                onChange={(v) => set('temp_roles_log_channel_id', v)}
                options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                placeholder="Use the main log channel"
              />
            </Field>
            <div className="py-3">
              <p className="text-xs text-[var(--mist-dim)] mb-2">Commands</p>
              <div className="flex flex-wrap gap-1.5">
                {['/temprole', '/removetemprole'].map((c) => (
                  <code key={c} className="font-mono text-[11px] text-[var(--py-blue)] border border-[var(--line)] rounded-md px-2 py-1">
                    {c}
                  </code>
                ))}
              </div>
            </div>

            <div className="py-3 space-y-2 text-xs text-[var(--mist-dim)]">
              <p>
                <code className="font-mono text-[var(--py-blue)]">/temprole @member @role 60</code>{' '}
                grants it for 60 minutes. Expiry is checked every minute and survives restarts.
                Granting the same role again extends it rather than stacking duplicates.
              </p>
              <p>
                <code className="font-mono text-[var(--py-blue)]">/removetemprole @member @role</code>{' '}
                takes it back early and cancels the scheduled expiry.
                {' '}<strong className="text-[var(--mist)]">If it's your premium role, the member's
                premium subscription ends at the same time</strong> — otherwise the dashboard would
                keep showing them as premium after the role was gone.
              </p>
            </div>
          </Section>
        )}

        {tab === 'sticky' && (
          <Section title="Sticky messages" icon={Pin} description="Keeps a message at the bottom of a channel by reposting it as conversation moves on.">
            <Toggle label="Enable sticky messages" checked={config.sticky_enabled} onChange={(v) => set('sticky_enabled', v)} />
            <div className="py-3 space-y-3">
              {(config.sticky_messages || []).map((st, i) => (
                <div key={i} className="rounded-lg border border-[var(--line)] p-3 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <select
                      value={st.channel_id ?? ''}
                      onChange={(e) => updateSticky(i, 'channel_id', e.target.value)}
                      className="flex-1 min-w-0 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                    >
                      <option value="">Select a channel...</option>
                      {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
                    </select>
                    <button
                      onClick={() => removeSticky(i)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                  <input
                    value={st.title || ''}
                    onChange={(e) => updateSticky(i, 'title', e.target.value)}
                    placeholder="Title (optional)"
                    maxLength={100}
                    className="w-full rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                  />
                  <textarea
                    value={st.content || ''}
                    onChange={(e) => updateSticky(i, 'content', e.target.value)}
                    placeholder="What the sticky message says"
                    rows={3}
                    maxLength={2000}
                    className="w-full rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus resize-none"
                  />
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    <Field label="Repost after this many messages">
                      <NumberInput value={st.min_gap ?? 5} onChange={(v) => updateSticky(i, 'min_gap', v)} min={1} max={100} />
                    </Field>
                    <Field label="Color">
                      <ColorInput value={st.color || '#3EC6FF'} onChange={(v) => updateSticky(i, 'color', v)} />
                    </Field>
                  </div>
                </div>
              ))}
              {(config.sticky_messages || []).length === 0 && (
                <p className="text-xs text-[var(--mist-dim)]">No sticky messages yet.</p>
              )}
              <button onClick={addSticky} className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline">
                <Plus className="w-4 h-4" strokeWidth={2.25} />
                Add a sticky message
              </button>
              <p className="text-xs text-[var(--mist-dim)] pt-2">
                The old copy is deleted each time so only one ever exists. There's also a minimum
                10-second gap between reposts, so a busy channel doesn't get flooded.
              </p>
            </div>
          </Section>
        )}

        {tab === 'role_persist' && (
          <>
            <Section
              title="Role persistence"
              icon={Undo2}
              description="Gives members their roles back if they leave and rejoin."
            >
              <div className="py-3 my-2 rounded-lg border border-amber-500/25 bg-amber-500/5 px-4">
                <p className="flex items-start gap-2 text-xs text-amber-300/90 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>
                    <strong className="text-amber-200">Quarantine roles are always restored</strong>, even
                    with the toggle below switched off. Without that, anyone you quarantine could simply
                    leave and rejoin to clear it — which would defeat the whole point. This part isn't
                    optional, by design.
                  </span>
                </p>
              </div>

              <Toggle
                label="Restore all roles on rejoin"
                description="Turn this on to bring back every role they had, not just sanctions."
                checked={config.role_persist_enabled}
                onChange={(v) => set('role_persist_enabled', v)}
              />
              <p className="text-xs text-[var(--mist-dim)] pt-2">
                Records are kept for 90 days. Roles above PySecured's own role are skipped, and
                bot-managed roles are never stored.
              </p>
            </Section>

            {config.role_persist_enabled && (
              <Section title="Never restore these" description="Roles that should always be re-granted by hand — usually anything with real power">
                <div className="py-3 space-y-1 max-h-64 overflow-y-auto">
                  {roles.map((r) => {
                    const on = (config.role_persist_exclude_ids || []).includes(r.id)
                    return (
                      <label key={r.id} className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            set(
                              'role_persist_exclude_ids',
                              on
                                ? config.role_persist_exclude_ids.filter((x) => x !== r.id)
                                : [...(config.role_persist_exclude_ids || []), r.id]
                            )
                          }
                          className="accent-[var(--py-blue)]"
                        />
                        <span className="text-sm text-[var(--mist)]">{r.name}</span>
                      </label>
                    )
                  })}
                </div>
                <p className="text-xs text-[var(--mist-dim)]">
                  Worth excluding admin and moderator roles — auto-restoring elevated access to someone
                  who left is a decision better made deliberately.
                </p>
              </Section>
            )}
          </>
        )}

        {tab === 'invite_tracking' && (
          <Section
            title="Invite tracking"
            icon={Mail}
            description="Records who invited each new member, and keeps a running tally per inviter."
          >
            <Toggle
              label="Enable invite tracking"
              checked={config.invite_tracking_enabled}
              onChange={(v) => set('invite_tracking_enabled', v)}
            />
            <Field label="Join log channel (falls back to your main log channel)">
              <Select
                value={config.invite_log_channel_id}
                onChange={(v) => set('invite_log_channel_id', v)}
                options={channels.map((c) => ({ value: c.id, label: `#${c.name}` }))}
                placeholder="Use the main log channel"
              />
            </Field>

            <div className="py-3">
              <p className="text-xs text-[var(--mist-dim)] mb-2">Commands</p>
              <div className="flex flex-wrap gap-1.5">
                {['/invites', '/inviteleaderboard'].map((c) => (
                  <code key={c} className="font-mono text-[11px] text-[var(--py-blue)] border border-[var(--line)] rounded-md px-2 py-1">
                    {c}
                  </code>
                ))}
              </div>
            </div>

            <div className="py-3 rounded-lg border border-[var(--py-blue)]/25 bg-[var(--py-blue)]/5 px-4 my-2">
              <p className="text-xs text-[var(--mist)] leading-relaxed">
                <strong className="text-white">PySecured needs the Manage Server permission</strong> to
                read invite data. Without it, joins are still logged but recorded as "unknown" rather
                than being wrongly attributed to someone.
              </p>
            </div>

            <p className="text-xs text-[var(--mist-dim)]">
              Counts track both total invited and how many have since left, and the leaderboard ranks
              by the difference — so someone whose invitees all left doesn't outrank someone whose
              stayed. Joins through your vanity URL are recorded as such rather than credited to anyone.
            </p>
          </Section>
        )}

        {tab === 'commands' && (
          <Section
            title="Commands"
            icon={TerminalSquare}
            description="Switch off any command you don't want available in this server. Disabled commands still appear in Discord's menu but reply that they're turned off."
          >
            {commandError && <p className="text-sm text-red-400 py-2">{commandError}</p>}
            {!commandList && !commandError && <p className="text-xs text-[var(--mist-dim)] py-2">Loading...</p>}

            {commandList && (
              <>
                {!commandList.is_premium && (
                  <div className="py-3 my-2 rounded-lg border border-[var(--py-blue)]/25 bg-[var(--py-blue)]/5 px-4">
                    <p className="text-xs text-[var(--mist)] leading-relaxed">
                      A few commands are PySecured's own — <code className="font-mono">/dashboard</code>,{' '}
                      <code className="font-mono">/pysecured</code> and <code className="font-mono">/invite</code>.
                      Premium servers can hide them; on the free plan they stay available. Everything
                      else here is yours to switch off.
                    </p>
                  </div>
                )}

                <div className="divide-y divide-[var(--line)]">
                  {commandList.commands.map((c) => (
                    <div key={c.name} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="font-mono text-sm text-[var(--py-blue)]">/{c.name}</code>
                          {c.always_on && (
                            <span className="font-mono text-[10px] text-[var(--mist-dim)] border border-[var(--line)] rounded-full px-2 py-0.5">
                              ALWAYS ON
                            </span>
                          )}
                          {c.premium_locked && !commandList.is_premium && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--py-yellow-soft)] border border-[var(--py-yellow-soft)]/30 rounded-full px-2 py-0.5">
                              <Lock className="w-2.5 h-2.5" strokeWidth={2.5} />
                              PREMIUM TO HIDE
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-xs text-[var(--mist-dim)] mt-0.5 truncate">{c.description}</p>
                        )}
                      </div>

                      {c.can_toggle ? (
                        <button
                          onClick={() => toggleCommand(c.name, !c.enabled)}
                          disabled={commandBusy}
                          className={`press shrink-0 rounded-lg border transition-colors text-xs font-medium px-3 py-1.5 disabled:opacity-50 ${
                            c.enabled
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-[var(--line)] text-[var(--mist-dim)] hover:text-[var(--mist)]'
                          }`}
                        >
                          {c.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      ) : (
                        <span
                          className="shrink-0 rounded-lg border border-[var(--line)] text-[var(--mist-dim)] text-xs px-3 py-1.5"
                          title={c.always_on ? "This one can't be turned off" : 'Premium is needed to hide this command'}
                        >
                          Enabled
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[var(--mist-dim)] pt-3">
                  <code className="font-mono">/setup</code> can never be disabled — it's how anyone finds
                  their way back to these settings. Moderation commands also have their own module toggle
                  under <strong>Moderation</strong>.
                </p>
              </>
            )}
          </Section>
        )}

        {tab === 'overview' && (
          <>
            {!overview && <div className="skeleton h-44 rounded-2xl mb-4" />}

            {overview && (
              <>
                <div className="surface rounded-2xl border border-[var(--line)] p-5 sm:p-6 mb-4">
                  <div className="flex items-center gap-3 mb-5">
                    {overview.guild.icon ? (
                      <img src={overview.guild.icon} alt="" className="w-12 h-12 rounded-2xl shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-bold text-white truncate">{overview.guild.name}</h2>
                      <p className="text-xs text-[var(--mist-dim)]">
                        {overview.is_premium ? 'Premium plan' : 'Free plan'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      ['Members', overview.guild.member_count?.toLocaleString() ?? '—'],
                      ['Channels', overview.guild.channel_count],
                      ['Roles', overview.guild.role_count],
                      ['Modules on', `${overview.modules_on}/${overview.modules_total}`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-3">
                        <p className="font-mono text-xl text-white leading-none">{value}</p>
                        <p className="text-[11px] text-[var(--mist-dim)] mt-1.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {overview.actions_30d !== null && overview.actions_30d !== undefined && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-3">
                        <p className="font-mono text-xl text-white leading-none">{overview.actions_7d}</p>
                        <p className="text-[11px] text-[var(--mist-dim)] mt-1.5">actions this week</p>
                      </div>
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-3">
                        <p className="font-mono text-xl text-white leading-none">{overview.actions_30d}</p>
                        <p className="text-[11px] text-[var(--mist-dim)] mt-1.5">actions in 30 days</p>
                      </div>
                    </div>
                  )}
                </div>

                {!overview.permissions_ok && (
                  <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 mb-4">
                    <p className="flex items-start gap-2 text-sm text-amber-300/90">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
                      <span>
                        <strong className="text-amber-200">PySecured is missing permissions.</strong>{' '}
                        It needs at least Manage Roles and Kick Members to act on anything. Check its
                        role in Server Settings → Roles.
                      </span>
                    </p>
                  </div>
                )}

                {overview.todo.length > 0 && (
                  <Section title="Suggested next steps" description="Quick wins that make the biggest difference">
                    <div className="divide-y divide-[var(--line)]">
                      {overview.todo.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setTab(t.tab)}
                          className="w-full py-3 flex items-center gap-3 text-left group"
                        >
                          <span className="w-6 h-6 rounded-lg border border-[var(--line)] flex items-center justify-center shrink-0 text-[11px] font-mono text-[var(--mist-dim)]">
                            {i + 1}
                          </span>
                          <span className="text-sm text-[var(--mist)] flex-1 group-hover:text-white transition-colors">
                            {t.text}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[var(--mist-dim)] shrink-0 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                        </button>
                      ))}
                    </div>
                  </Section>
                )}

                <Section title="Modules" description="What's switched on in this server right now">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-2 py-3">
                    {Object.entries(overview.modules).map(([name, on]) => (
                      <div key={name} className="flex items-center gap-2">
                        {on ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[var(--mist-dim)] shrink-0" strokeWidth={2.5} />
                        )}
                        <span className={`text-sm ${on ? 'text-[var(--mist)]' : 'text-[var(--mist-dim)]'}`}>{name}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}
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
                  <div key={i} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <input
                      value={m.emoji}
                      onChange={(e) => updateMapping(i, 'emoji', e.target.value)}
                      placeholder="🎮"
                      className="w-14 shrink-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-2 py-2 field-focus"
                    />
                    <select
                      value={m.role_id ?? ''}
                      onChange={(e) => updateMapping(i, 'role_id', e.target.value)}
                      className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono"
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
                      className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
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
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
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
                        className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                      />
                      <select
                        value={c.match_type}
                        onChange={(e) => updateCustomCommand(i, 'match_type', e.target.value)}
                        className="shrink-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-xs text-white px-2 py-2 field-focus"
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
                      className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus resize-none"
                    />
                  </div>
                ))}
                {(config.custom_commands || []).length === 0 && (
                  <p className="text-xs text-[var(--mist-dim)] py-2">No custom commands yet.</p>
                )}
                {limits && (
                  <p className="text-xs text-[var(--mist-dim)] pt-1">
                    {(config.custom_commands || []).length} of {limits.limits.custom_commands} used
                    {!limits.is_premium && ` · premium allows ${limits.premium_limits.custom_commands}`}
                  </p>
                )}
                {(config.custom_commands || []).length < (limits?.limits.custom_commands ?? 25) && (
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
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
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

            <Section title="Level rewards" description="Automatically grant a role when someone reaches a level">
              <Toggle
                label="Stack rewards"
                description="On: members keep every reward they've earned. Off: only their highest reward role is kept, older ones are removed."
                checked={config.leveling_stack_rewards}
                onChange={(v) => set('leveling_stack_rewards', v)}
              />
              <div className="py-3 space-y-2">
                {(config.leveling_rewards || []).map((r, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div className="shrink-0 flex items-center gap-1.5">
                      <span className="text-xs text-[var(--mist-dim)]">Level</span>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={r.level}
                        onChange={(e) => updateReward(i, 'level', e.target.value)}
                        className="w-16 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-2 py-2 field-focus font-mono"
                      />
                    </div>
                    <span className="text-xs text-[var(--mist-dim)] shrink-0">→</span>
                    <select
                      value={r.role_id ?? ''}
                      onChange={(e) => updateReward(i, 'role_id', e.target.value)}
                      className="flex-1 min-w-0 rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus"
                    >
                      <option value="">Select a role...</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeReward(i)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-red-400 hover:border-red-400/40 transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                ))}
                {(config.leveling_rewards || []).length === 0 && (
                  <p className="text-xs text-[var(--mist-dim)] py-2">No level rewards yet.</p>
                )}
                {(config.leveling_rewards || []).length < (limits?.limits.level_rewards ?? 50) && (
                  <button
                    onClick={addReward}
                    className="press inline-flex items-center gap-1.5 text-sm text-[var(--py-blue)] hover:underline pt-1"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.25} />
                    Add a reward
                  </button>
                )}
                {limits && (
                  <p className="text-xs text-[var(--mist-dim)]">
                    {(config.leveling_rewards || []).length} of {limits.limits.level_rewards} used
                    {!limits.is_premium && ` · premium allows ${limits.premium_limits.level_rewards}`}
                  </p>
                )}
                <p className="text-xs text-[var(--mist-dim)] pt-2">
                  Rewards are granted the moment someone levels up, and named in the level-up message.
                  PySecured's role must sit above any role it grants.
                </p>
              </div>
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
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 py-3">
              <Field label="Emoji">
                <input
                  value={config.starboard_emoji}
                  onChange={(e) => set('starboard_emoji', e.target.value)}
                  className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-center text-sm text-white px-3 py-2 field-focus"
                />
              </Field>
              <Field label="Threshold">
                <NumberInput value={config.starboard_threshold} onChange={(v) => set('starboard_threshold', v)} min={1} max={100} />
              </Field>
            </div>
          </Section>
        )}

        {tab === 'backups' && !user?.is_premium && (
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium feature
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Backup & Restore is a premium feature</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              Snapshot your server's roles and channels, restore them later. Premium starts at €2.99 and is applied to your account instantly.
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
            <Section title="Server backup" icon={Database} description="Snapshots roles, categories, channels, and every channel's permission overwrites. Restoring only ever adds — it never deletes or changes anything currently in your server.">
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
              <Toggle
                label="Ping support roles on new tickets"
                description="Posts a ping in the ticket channel so the team is notified immediately"
                checked={config.ticket_ping_support}
                onChange={(v) => set('ticket_ping_support', v)}
              />
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
          <div className="surface rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium feature
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Analytics is a premium feature</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              A real history of every action PySecured has taken in your server — trends, breakdowns,
              and a live activity feed. Premium starts at €2.99 and is applied to your account instantly.
              while we finish building the purchase flow.
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

                <Section title="Export" description="Download the full recorded history as a spreadsheet">
                  <div className="py-3">
                    <a
                      href={api.auditExportUrl(guildId)}
                      className="press inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg)] hover:brightness-125 border border-[var(--line)] transition-all text-white text-sm font-medium px-4 py-2"
                    >
                      <Download className="w-4 h-4" strokeWidth={2.25} />
                      Download CSV
                    </a>
                    <p className="text-xs text-[var(--mist-dim)] mt-2">
                      Includes every action with its timestamp, trigger, reason, and outcome.
                    </p>
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
