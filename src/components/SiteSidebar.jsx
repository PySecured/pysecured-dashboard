import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home, BookOpen, Activity, Crown, Server, MessageCircle,
  ShieldCheck, LifeBuoy, FileText, Lock, LogOut, LogIn, Menu, X,
} from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { DISCORD_SUPPORT_URL } from '../config'

/**
 * Site-wide sidebar.
 *
 * One navigation surface for the whole product rather than a marketing
 * header on some pages and a dashboard nav on others — so moving between
 * the landing page, docs and your servers never changes the furniture.
 */
export default function SiteSidebar({ children }) {
  const { user, loading, logout } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const main = [
    { to: '/', label: 'Home', Icon: Home, exact: true },
    { to: '/docs', label: 'Documentation', Icon: BookOpen },
    { to: '/premium', label: 'Premium', Icon: Crown },
    { to: '/status', label: 'Status', Icon: Activity },
  ]

  const account = user
    ? [
        { to: '/servers', label: 'My Servers', Icon: Server },
        ...(user.is_staff && !user.is_admin ? [{ to: '/staff', label: 'Staff', Icon: LifeBuoy }] : []),
        ...(user.is_admin ? [{ to: '/admin', label: 'Admin', Icon: ShieldCheck }] : []),
      ]
    : []

  const legal = [
    { to: '/terms', label: 'Terms', Icon: FileText },
    { to: '/privacy', label: 'Privacy', Icon: Lock },
  ]

  const isActive = (item) => (item.exact ? pathname === item.to : pathname.startsWith(item.to))

  const NavLink = ({ item, onNavigate }) => (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={`nav-row flex items-center gap-3 px-3 py-2.5 text-sm ${
        isActive(item)
          ? 'nav-row-active font-medium'
          : 'text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)]'
      }`}
    >
      <item.Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
      <span className="truncate">{item.label}</span>
    </Link>
  )

  const SidebarBody = ({ onNavigate }) => (
    <div className="flex flex-col h-full">
      <Link to="/" onClick={onNavigate} className="group flex items-center gap-2.5 px-3 py-1 mb-6">
        <img src="/logo.png" alt="" className="w-8 h-8 transition-transform duration-300 group-hover:rotate-[8deg]" />
        <span className="font-display font-bold text-white tracking-tight">PySecured</span>
      </Link>

      <nav className="space-y-1">
        {main.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
      </nav>

      {account.length > 0 && (
        <>
          <p className="text-[11px] font-semibold tracking-wider text-[var(--mist-dim)]/60 uppercase mt-6 mb-2 px-3">
            Account
          </p>
          <nav className="space-y-1">
            {account.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
          </nav>
        </>
      )}

      <p className="text-[11px] font-semibold tracking-wider text-[var(--mist-dim)]/60 uppercase mt-6 mb-2 px-3">
        Support
      </p>
      <nav className="space-y-1">
        <a
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="nav-row flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)]"
        >
          <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
          <span>Discord</span>
        </a>
        {legal.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
      </nav>

      <div className="mt-auto pt-6">
        {!loading && user && (
          <div className="surface rounded-xl border border-[var(--line)] p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm text-white truncate">{user.username}</p>
                <p className="text-[11px] text-[var(--mist-dim)]">
                  {user.is_premium ? 'Premium' : 'Free plan'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { onNavigate?.(); logout() }}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] text-xs text-[var(--mist-dim)] hover:text-white transition-colors py-2"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
              Log out
            </button>
          </div>
        )}
        {!loading && !user && (
          <a
            href={api.loginUrl()}
            className="press flex items-center justify-center gap-2 rounded-xl bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium px-4 py-3"
          >
            <LogIn className="w-4 h-4" strokeWidth={2} />
            Log in with Discord
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop rail */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 border-r border-[var(--line)] bg-[var(--bg-raised)]/30 p-4 h-screen sticky top-0">
        <SidebarBody />
      </aside>

      {/* Mobile bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="w-7 h-7" />
          <span className="font-display font-bold text-white text-sm">PySecured</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-11 h-11 -mr-2 flex items-center justify-center text-[var(--mist)]"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--bg)] border-r border-[var(--line)] p-4 overflow-y-auto animate-log-in">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[var(--mist-dim)] hover:text-white"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
