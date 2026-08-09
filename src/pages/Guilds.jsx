import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'

export default function Guilds() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [guilds, setGuilds] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .guilds()
      .then(setGuilds)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="text-sm font-medium text-white">PySecured</span>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-zinc-400">{user.username}</span>}
          <button
            onClick={logout}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-lg font-medium text-white mb-1">Your servers</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Select a server to manage its protection settings.
        </p>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {!guilds && !error && (
          <p className="text-sm text-zinc-500">Loading...</p>
        )}

        {guilds && guilds.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
            <p className="text-sm text-zinc-400">
              No servers found where you're an admin and PySecured is already added.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {guilds?.map((g) => (
            <button
              key={g.id}
              onClick={() => navigate(`/servers/${g.id}`)}
              className="w-full flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors p-4 text-left"
            >
              {g.icon ? (
                <img src={g.icon} alt="" className="w-9 h-9 rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                  {g.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-white font-medium">{g.name}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
