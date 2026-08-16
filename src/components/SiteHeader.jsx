import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, LifeBuoy, Menu, X } from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { DISCORD_SUPPORT_URL } from '../config'

export default function SiteHeader() {
  const { user, loading, logout } = useAuth()
  const [open, setOpen] = useState(false)

  // Same destinations in both the desktop bar and the mobile sheet, so
  // nothing is reachable on one and invisible on the other.
  const links = [
    { to: '/docs', label: 'Docs' },
    { to: '/status', label: 'Status' },
    { to: '/premium', label: 'Premium' },
  ]

  return (
    <nav className="relative z-30 max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="" className="w-8 h-8 transition-transform duration-300 group-hover:rotate-[8deg]" />
          <span className="font-display font-bold text-white tracking-tight">PySecured</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors"
          >
            Discord
          </a>

          {!loading && user && (
            <div className="flex items-center gap-3">
              {user.is_staff && !user.is_admin && (
                <Link to="/staff" className="inline-flex items-center gap-1 text-sm text-[var(--py-blue)] hover:brightness-125 transition-colors">
                  <LifeBuoy className="w-3.5 h-3.5" strokeWidth={2.25} />
                  Staff
                </Link>
              )}
              {user.is_admin && (
                <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.25} />
                  Admin
                </Link>
              )}
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
              className="press rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-4 py-2"
            >
              Continue with Discord
            </a>
          )}
        </div>

        {/* Mobile trigger — 44px tap target, the accessibility minimum */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-[var(--mist)] hover:text-white transition-colors"
        >
          {open ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden mt-4 surface rounded-xl border border-[var(--line)] p-2 animate-log-in">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-[var(--mist)] hover:bg-white/[0.04] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm text-[var(--mist)] hover:bg-white/[0.04] transition-colors"
          >
            Discord
          </a>

          {!loading && user && (
            <>
              <div className="my-2 border-t border-[var(--line)]" />
              {user.is_staff && !user.is_admin && (
                <Link to="/staff" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-[var(--py-blue)] hover:bg-white/[0.04] transition-colors">
                  <LifeBuoy className="w-4 h-4" strokeWidth={2.25} />
                  Staff
                </Link>
              )}
              {user.is_admin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-amber-400 hover:bg-white/[0.04] transition-colors">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2.25} />
                  Admin
                </Link>
              )}
              <Link to="/servers" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-white hover:bg-white/[0.04] transition-colors">
                Servers
              </Link>
              <button
                onClick={() => { setOpen(false); logout() }}
                className="w-full text-left rounded-lg px-3 py-3 text-sm text-[var(--mist-dim)] hover:bg-white/[0.04] transition-colors"
              >
                Log out
              </button>
            </>
          )}

          {!loading && !user && (
            <a
              href={api.loginUrl()}
              className="press block text-center mt-2 rounded-lg bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-4 py-3"
            >
              Continue with Discord
            </a>
          )}
        </div>
      )}
    </nav>
  )
}
