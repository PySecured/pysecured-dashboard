import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, ShieldCheck, ShieldOff } from 'lucide-react'
import { api } from '../api'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { SkeletonRow } from '../components/Skeleton'

function GuildIcon({ guild }) {
  if (guild.icon) {
    return <img src={guild.icon} alt="" className="w-10 h-10 rounded-full shrink-0" />
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[var(--bg-raised)] border border-[var(--line)] flex items-center justify-center text-xs text-[var(--mist-dim)] shrink-0">
      {guild.name.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function Guilds() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [inviteBusy, setInviteBusy] = useState(null)

  useEffect(() => {
    api
      .guilds()
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  async function addToServer(guildId = null) {
    setInviteBusy(guildId ?? 'generic')
    try {
      const { admin_url } = await api.inviteUrl(guildId)
      window.open(admin_url, '_blank', 'noopener')
    } catch (e) {
      setError(e.message)
    } finally {
      setInviteBusy(null)
    }
  }

  const configured = data?.configured ?? []
  const available = data?.available ?? []

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SEO title="Your Servers" description="Manage PySecured protection settings." path="/servers" noindex />
      <div
        aria-hidden
        className="absolute -top-24 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--py-blue)] blur-[110px] animate-glow opacity-20 pointer-events-none"
      />
      <SiteHeader />

      <main className="relative max-w-2xl mx-auto px-6 py-10">
        <Reveal>
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-2">
                Dashboard
              </p>
              <h1 className="font-display text-2xl font-bold text-white mb-1">Your servers</h1>
              <p className="text-sm text-[var(--mist-dim)]">Manage protection for a server PySecured is already in.</p>
            </div>
            <button
              onClick={() => addToServer(null)}
              disabled={inviteBusy === 'generic'}
              className="press group shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--discord)] hover:brightness-110 disabled:opacity-50 transition-all text-white text-sm font-medium px-4 py-2"
            >
              <Plus className="w-4 h-4" strokeWidth={2.25} />
              {inviteBusy === 'generic' ? 'Opening...' : 'Add to a server'}
            </button>
          </div>
        </Reveal>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {!data && !error && (
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {data && configured.length === 0 && (
          <Reveal delay={100}>
            <div className="surface rounded-xl border border-[var(--line)] p-6 text-center mb-8">
              <p className="text-sm text-[var(--mist)] mb-3">PySecured isn't in any server you admin yet.</p>
              <button onClick={() => addToServer(null)} className="text-sm text-[var(--py-blue)] hover:underline">
                Add it to your first server
              </button>
            </div>
          </Reveal>
        )}

        {data && configured.length > 0 && (
          <Reveal delay={50}>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="surface rounded-xl border border-[var(--line)] p-4">
                <p className="text-xs text-[var(--mist-dim)] mb-1">Servers</p>
                <p className="font-mono text-xl text-white">{configured.length}</p>
              </div>
              <div className="surface rounded-xl border border-[var(--line)] p-4">
                <p className="text-xs text-[var(--mist-dim)] mb-1">Protected</p>
                <p className="font-mono text-xl text-white">
                  {configured.filter((g) => g.protection_enabled).length}
                  <span className="text-[var(--mist-dim)] text-sm"> / {configured.length}</span>
                </p>
              </div>
            </div>
          </Reveal>
        )}

        <div className="space-y-2">
          {configured.map((g, idx) => (
            <Reveal key={g.id} delay={idx * 60}>
              <button
                onClick={() => navigate(`/servers/${g.id}`)}
                className="card-interactive w-full flex items-center gap-3 surface rounded-xl border border-[var(--line)] p-4 text-left"
              >
                <GuildIcon guild={g} />
                <span className="text-sm text-white font-medium flex-1">{g.name}</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    g.protection_enabled
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-[var(--line)] text-[var(--mist-dim)]'
                  }`}
                >
                  {g.protection_enabled ? (
                    <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                  ) : (
                    <ShieldOff className="w-3 h-3" strokeWidth={2.5} />
                  )}
                  {g.protection_enabled ? 'PROTECTED' : 'NOT CONFIGURED'}
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--mist-dim)] shrink-0" strokeWidth={2} />
              </button>
            </Reveal>
          ))}
        </div>

        {available.length > 0 && (
          <Reveal delay={configured.length * 60 + 100}>
            <div className="mt-10">
              <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-2">
                Not added yet
              </p>
              <h2 className="text-sm font-medium text-white mb-1">Add PySecured to a server</h2>
              <p className="text-xs text-[var(--mist-dim)] mb-4">
                You're an admin here, but PySecured isn't added yet.
              </p>
              <div className="space-y-2">
                {available.map((g) => (
                  <div
                    key={g.id}
                    className="w-full flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/30 p-4"
                  >
                    <GuildIcon guild={g} />
                    <span className="text-sm text-[var(--mist)] flex-1">{g.name}</span>
                    <button
                      onClick={() => addToServer(g.id)}
                      disabled={inviteBusy === g.id}
                      className="group shrink-0 inline-flex items-center gap-1 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 disabled:opacity-50 border border-[var(--line)] transition-all text-white text-xs font-medium px-3 py-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
                      {inviteBusy === g.id ? 'Opening...' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
