import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { DISCORD_SUPPORT_URL } from '../config'

export default function SiteHeader() {
  const { user, loading, logout } = useAuth()

  return (
    <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <img src="/logo.png" alt="" className="w-8 h-8" />
        <span className="font-display font-bold text-white tracking-tight">PySecured</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/premium"
          className="hidden sm:block text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors"
        >
          Premium
        </Link>
        <a
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors"
        >
          Discord
        </a>

        {!loading && user && (
          <div className="flex items-center gap-3">
            <Link to="/servers" className="text-sm text-[var(--mist)] hover:text-white transition-colors">
              Servers
            </Link>
            <button onClick={logout} className="text-xs text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors">
              Log out
            </button>
          </div>
        )}

        {!loading && !user && (
          <a
            href={api.loginUrl()}
            className="rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--py-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Continue with Discord
          </a>
        )}
      </div>
    </nav>
  )
}
