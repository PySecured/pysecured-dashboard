import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Toggle, Field, Select, NumberInput, Section, ActionButton } from '../components/Form'

const ACTION_OPTIONS = [
  { value: 'role', label: 'Quarantine role (blocks sending/typing)' },
  { value: 'timeout', label: 'Timeout' },
  { value: 'kick', label: 'Kick' },
  { value: 'ban', label: 'Ban' },
]

const TABS = [
  { id: 'general', label: 'General protection' },
  { id: 'trap', label: 'Trap channel' },
  { id: 'whitelist', label: 'Whitelist' },
]

export default function Settings() {
  const { guildId } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('general')
  const [config, setConfig] = useState(null)
  const [roles, setRoles] = useState([])
  const [channels, setChannels] = useState([])
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-400 mb-3">{error}</p>
          <button onClick={() => navigate('/servers')} className="text-sm text-indigo-400 hover:underline">
            Back to servers
          </button>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    )
  }

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }))
  const channelOptions = channels.map((c) => ({ value: c.id, label: `#${c.name}` }))

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/servers')} className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Servers
        </button>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-emerald-400">Saved</span>}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors text-white text-sm font-medium px-4 py-1.5"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <div className="flex gap-1 mb-6 border-b border-zinc-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm px-3 py-2 border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'general' && (
          <>
            <Section title="Protection">
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
              <Toggle label="Mass mentions" checked={config.detect_mass_mentions} onChange={(v) => set('detect_mass_mentions', v)} />
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

        {tab === 'whitelist' && (
          <Section title="Whitelisted roles" description="Members with any of these roles are never punished">
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
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                    <span className="text-sm text-white">{r.name}</span>
                  </label>
                )
              })}
              {roles.length === 0 && <p className="text-sm text-zinc-500">No roles found.</p>}
            </div>
          </Section>
        )}
      </main>
    </div>
  )
}
