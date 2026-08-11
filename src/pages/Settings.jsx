import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Save, ShieldAlert, Radar, UserPlus, Users, Ticket, Lock, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
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

const TABS = [
  { id: 'general', label: 'General', Icon: ShieldAlert },
  { id: 'trap', label: 'Trap channel', Icon: Radar },
  { id: 'welcome', label: 'Welcome', Icon: UserPlus },
  { id: 'whitelist', label: 'Whitelist', Icon: Users },
  { id: 'tickets', label: 'Tickets', Icon: Ticket, premium: true },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3, premium: true },
]

const TRIGGER_LABEL = {
  scam_link: 'Scam links',
  scam_phrase: 'Scam phrases',
  invite_link: 'Invite links',
  mass_mentions: 'Mass mentions',
  trap_channel: 'Trap channel',
  other: 'Other',
  unknown: 'Unknown',
}

const ACTION_LABEL = { role: 'Quarantine', timeout: 'Timeout', kick: 'Kick', ban: 'Ban', unknown: 'Unknown' }

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
    if (tab === 'tickets' && user?.is_premium && categories.length === 0) {
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

  function set(key, value) {
    setConfig((c) => ({ ...c, [key]: value }))
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--py-blue)] hover:brightness-110 disabled:opacity-50 transition-all text-[#06111f] text-sm font-semibold px-4 py-1.5"
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
            {TABS.map((t) => (
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

        {tab === 'tickets' && !user?.is_premium && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/60 p-8 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-3">
              Premium · QA access required
            </p>
            <h2 className="font-display text-lg font-bold text-white mb-2">Tickets is out for QA testing</h2>
            <p className="text-sm text-[var(--mist)] max-w-sm mx-auto mb-5">
              The ticket system is currently limited to the QA Team while it's tested.
              Join the Discord to ask about access.
            </p>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-2.5"
            >
              Join the Discord
            </a>
          </div>
        )}

        {tab === 'tickets' && user?.is_premium && (
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
              className="inline-block rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-5 py-2.5"
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
