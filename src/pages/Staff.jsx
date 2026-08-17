import { useEffect, useState } from 'react'
import { LifeBuoy, Search, Check, X as XIcon, ChevronRight, ShieldCheck, ShieldOff } from 'lucide-react'
import { api } from '../api'
import SiteFooter from '../components/SiteFooter'
import SEO from '../components/SEO'
import { Section } from '../components/Form'

const MODULE_LABELS = {
  protection: 'Protection',
  trap_channel: 'Trap channel',
  moderation_commands: 'Moderation commands',
  verification: 'Verification',
  tickets: 'Tickets',
  welcome: 'Welcome',
  auto_role: 'Auto role',
  reaction_roles: 'Reaction roles',
  leveling: 'Leveling',
  starboard: 'Starboard',
  custom_commands: 'Custom commands',
}

const PERM_LABELS = {
  manage_roles: 'Manage Roles',
  manage_channels: 'Manage Channels',
  kick_members: 'Kick Members',
  ban_members: 'Ban Members',
  moderate_members: 'Timeout Members',
  manage_messages: 'Manage Messages',
}

function Flag({ on, label }) {
  return (
    <div className="flex items-center gap-1.5">
      {on ? (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
      ) : (
        <XIcon className="w-3.5 h-3.5 text-[var(--mist-dim)] shrink-0" strokeWidth={2.5} />
      )}
      <span className={`text-xs ${on ? 'text-[var(--mist)]' : 'text-[var(--mist-dim)]'}`}>{label}</span>
    </div>
  )
}

export default function Staff() {
  const [guilds, setGuilds] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailError, setDetailError] = useState(null)

  useEffect(() => {
    api.staffGuilds().then(setGuilds).catch((e) => setError(e.message))
  }, [])

  async function open(guildId) {
    if (selected === guildId) {
      setSelected(null)
      setDetail(null)
      return
    }
    setSelected(guildId)
    setDetail(null)
    setDetailError(null)
    try {
      setDetail(await api.staffGuildDetail(guildId))
    } catch (e) {
      setDetailError(e.message)
    }
  }

  const filtered = guilds?.filter(
    (g) => g.name.toLowerCase().includes(query.toLowerCase()) || g.id.includes(query.trim())
  ) ?? null

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO title="Staff" description="Support tools." path="/staff" noindex />

      <main className="max-w-3xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-6">
        <div className="mb-6">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Support tools</h1>
          <p className="text-sm text-[var(--mist-dim)] mt-1.5 max-w-2xl">Read-only. Look up any server to see which modules are on and whether PySecured has the permissions it needs — enough to answer 'why isn't this working?' without changing anyone's setup.</p>
        </div>

        <Section title="Server lookup" icon={LifeBuoy} description="Search by name or paste a server ID">
          {error && <p className="text-sm text-red-400 py-2">{error}</p>}
          {!guilds && !error && <p className="text-sm text-[var(--mist-dim)] py-2">Loading...</p>}

          {guilds && (
            <>
              <div className="relative py-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or server ID..."
                  className="w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white pl-9 pr-3 py-2 field-focus"
                />
              </div>

              <div className="divide-y divide-[var(--line)]">
                {filtered.length === 0 && (
                  <p className="text-xs text-[var(--mist-dim)] py-3">No servers match that.</p>
                )}
                {filtered.slice(0, 40).map((g) => (
                  <div key={g.id}>
                    <button
                      onClick={() => open(g.id)}
                      className="w-full py-2.5 flex items-center gap-3 text-left group"
                    >
                      {g.icon ? (
                        <img src={g.icon} alt="" className="w-7 h-7 rounded-full shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[var(--line)] shrink-0" />
                      )}
                      <span className="text-sm text-white truncate flex-1 group-hover:text-[var(--py-blue)] transition-colors">
                        {g.name}
                      </span>
                      <span className="font-mono text-xs text-[var(--mist-dim)] shrink-0">{g.member_count}</span>
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                          g.protection_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--line)] text-[var(--mist-dim)]'
                        }`}
                      >
                        {g.protection_enabled ? <ShieldCheck className="w-2.5 h-2.5" strokeWidth={2.5} /> : <ShieldOff className="w-2.5 h-2.5" strokeWidth={2.5} />}
                        {g.protection_enabled ? 'ON' : 'OFF'}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-[var(--mist-dim)] shrink-0 transition-transform ${selected === g.id ? 'rotate-90' : ''}`}
                        strokeWidth={2}
                      />
                    </button>

                    {selected === g.id && (
                      <div className="pb-4 pl-10">
                        {detailError && <p className="text-sm text-red-400">{detailError}</p>}
                        {!detail && !detailError && <p className="text-xs text-[var(--mist-dim)]">Loading...</p>}
                        {detail && (
                          <div className="space-y-4">
                            <div>
                              <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-2">
                                Modules
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                                {Object.entries(detail.modules).map(([k, v]) => (
                                  <Flag key={k} on={v} label={MODULE_LABELS[k] || k} />
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-2">
                                Bot permissions
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                                {Object.entries(detail.bot_permissions).map(([k, v]) => (
                                  <Flag key={k} on={v} label={PERM_LABELS[k] || k} />
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-2">
                                Setup
                              </p>
                              <div className="space-y-1 text-xs text-[var(--mist)]">
                                <p>Log channel: <span className="text-white">{detail.setup.log_channel || 'not set'}</span></p>
                                <p>Moderation log: <span className="text-white">{detail.setup.moderation_log_channel || 'falls back to main'}</span></p>
                                <p>Verification log: <span className="text-white">{detail.setup.verification_log_channel || 'falls back to main'}</span></p>
                                <p>Action on detection: <span className="text-white">{detail.setup.action}</span></p>
                                <p>Quarantine role: <span className="text-white">{detail.setup.quarantine_role_set ? 'set' : 'not set'}</span></p>
                                <p>
                                  {detail.setup.ticket_panel_count} ticket panel(s) ·{' '}
                                  {detail.setup.custom_command_count} custom command(s) ·{' '}
                                  {detail.setup.reaction_role_count} reaction role(s) ·{' '}
                                  {detail.setup.level_reward_count} level reward(s)
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </Section>
      </main>

      <SiteFooter />
    </div>
  )
}
