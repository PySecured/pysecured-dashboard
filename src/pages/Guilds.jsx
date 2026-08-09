import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'

function GuildIcon({ guild }) {
  if (guild.icon) {
    return <img src={guild.icon} alt="" className="w-10 h-10 rounded-full shrink-0" />
  }
  return (
    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 shrink-0">
      {guild.name.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function Guilds() {
  const { user, logout } = useAuth()
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
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-6 h-6" />
          <span className="text-sm font-medium text-white">PySecured</span>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-zinc-400">{user.username}</span>}
          <button onClick={logout} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-lg font-medium text-white mb-1">Your servers</h1>
            <p className="text-sm text-zinc-500">Manage protection for a server PySecured is already in.</p>
          </div>
          <button
            onClick={() => addToServer(null)}
            disabled={inviteBusy === 'generic'}
            className="shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors text-white text-sm font-medium px-4 py-2"
          >
            {inviteBusy === 'generic' ? 'Opening...' : '+ Add to a server'}
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {!data && !error && <p className="text-sm text-zinc-500">Loading...</p>}

        {data && configured.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center mb-8">
            <p className="text-sm text-zinc-400 mb-3">PySecured isn't in any server you admin yet.</p>
            <button
              onClick={() => addToServer(null)}
              className="text-sm text-indigo-400 hover:underline"
            >
              Add it to your first server
            </button>
          </div>
        )}

        <div className="space-y-2">
          {configured.map((g) => (
            <button
              key={g.id}
              onClick={() => navigate(`/servers/${g.id}`)}
              className="w-full flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors p-4 text-left"
            >
              <GuildIcon guild={g} />
              <span className="text-sm text-white font-medium flex-1">{g.name}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                  g.protection_enabled
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-zinc-700/50 text-zinc-400'
                }`}
              >
                {g.protection_enabled ? 'Protected' : 'Not configured'}
              </span>
            </button>
          ))}
        </div>

        {available.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-medium text-white mb-1">Add PySecured to a server</h2>
            <p className="text-xs text-zinc-500 mb-4">
              You're an admin here, but PySecured isn't added yet.
            </p>
            <div className="space-y-2">
              {available.map((g) => (
                <div
                  key={g.id}
                  className="w-full flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
                >
                  <GuildIcon guild={g} />
                  <span className="text-sm text-zinc-300 flex-1">{g.name}</span>
                  <button
                    onClick={() => addToServer(g.id)}
                    disabled={inviteBusy === g.id}
                    className="shrink-0 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 border border-zinc-700 transition-colors text-white text-xs font-medium px-3 py-1.5"
                  >
                    {inviteBusy === g.id ? 'Opening...' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
