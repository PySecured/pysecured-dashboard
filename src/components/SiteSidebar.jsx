import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home, BookOpen, Activity, Crown, Server, MessageCircle,
  ShieldCheck, LifeBuoy, FileText, Lock, LogOut, LogIn, Menu, X,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { DISCORD_SUPPORT_URL } from '../config'
import Badges from './Badges'

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
  const [collapsed, setCollapsed] = useState(() => {
    // Read synchronously in the initialiser — doing this in an effect makes
    // the sidebar visibly jump from expanded to collapsed on every load.
    try {
      return localStorage.getItem('pysecured_sidebar_collapsed') === '1'
    } catch {
      return false
    }
  })

  function toggleCollapsed() {
    setCollapsed((v) => {
      const next = !v
      try {
        localStorage.setItem('pysecured_sidebar_collapsed', next ? '1' : '0')
      } catch {
        /* private browsing — the preference just won't persist */
      }
      return next
    })
  }

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

  const NavLink = ({ item, onNavigate, mini }) => (
    <Link
      to={item.to}
      onClick={onNavigate}
      title={mini ? item.label : undefined}
      aria-label={mini ? item.label : undefined}
      className={`nav-row flex items-center text-sm ${
        mini ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
      } ${
        isActive(item)
          ? 'nav-row-active font-medium'
          : 'text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)]'
      }`}
    >
      <item.Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
      {!mini && <span className="truncate">{item.label}</span>}
    </Link>
  )

  const SidebarBody = ({ onNavigate, mini = false }) => (
    <div className="flex flex-col h-full">
      <Link
        to="/"
        onClick={onNavigate}
        title={mini ? 'PySecured' : undefined}
        className={`group flex items-center py-1 mb-6 ${mini ? 'justify-center' : 'gap-2.5 px-3'}`}
      >
        <img src="/logo.png" alt="" className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:rotate-[8deg]" />
        {!mini && <span className="font-display font-bold text-white tracking-tight">PySecured</span>}
      </Link>

      <nav className="space-y-1">
        {main.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} mini={mini} />)}
      </nav>

      {account.length > 0 && (
        <>
          {mini ? (
            <div className="my-3 mx-2 border-t border-[var(--line)]" />
          ) : (
            <p className="text-[11px] font-semibold tracking-wider text-[var(--mist-dim)]/60 uppercase mt-6 mb-2 px-3">
              Account
            </p>
          )}
          <nav className="space-y-1">
            {account.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} mini={mini} />)}
          </nav>
        </>
      )}

      {mini ? (
        <div className="my-3 mx-2 border-t border-[var(--line)]" />
      ) : (
        <p className="text-[11px] font-semibold tracking-wider text-[var(--mist-dim)]/60 uppercase mt-6 mb-2 px-3">
          Support
        </p>
      )}
      <nav className="space-y-1">
        <a
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          title={mini ? 'Discord' : undefined}
          className={`nav-row flex items-center text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-[var(--bg-raised)] ${
            mini ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
          {!mini && <span>Discord</span>}
        </a>
        {legal.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} mini={mini} />)}
      </nav>

      <div className="mt-auto pt-6">
        {!loading && user && mini && (
          <div className="flex flex-col items-center gap-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                title={[user.username, ...(user.badges || []).map((b) => b.label)].join(' · ')}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)]" />
            )}
            <button
              onClick={() => { onNavigate?.(); logout() }}
              title="Log out"
              aria-label="Log out"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist-dim)] hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        )}

        {!loading && user && !mini && (
          <div className="surface rounded-xl border border-[var(--line)] p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] shrink-0" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-sm text-white truncate">{user.username}</p>
                  <Badges badges={user.badges} />
                </div>
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
            title={mini ? 'Log in with Discord' : undefined}
            className={`press flex items-center justify-center gap-2 rounded-xl bg-[var(--discord)] hover:brightness-110 transition-all text-white text-sm font-medium ${
              mini ? 'px-0 py-3' : 'px-4 py-3'
            }`}
          >
            <LogIn className="w-4 h-4 shrink-0" strokeWidth={2} />
            {!mini && 'Log in with Discord'}
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop rail */}
      <aside
        className={`relative hidden lg:flex lg:flex-col shrink-0 border-r border-[var(--line)] bg-[var(--bg-raised)]/30 p-4 h-screen sticky top-0 transition-[width] duration-200 ease-out ${
          collapsed ? 'w-[4.5rem]' : 'w-60'
        }`}
      >
        <SidebarBody mini={collapsed} />

        {/* Sits on the border so it reads as belonging to the rail edge
            rather than floating inside the content area. */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="absolute -right-3 top-7 w-6 h-6 flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--mist-dim)] hover:text-white hover:border-[var(--py-blue)]/40 transition-colors z-10"
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            : <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />}
        </button>
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

      {/* Top padding lives here rather than on each page: removing the old
          site header took its spacing with it, and every screen was left
          flush against the top of the viewport. */}
      <div className="flex-1 min-w-0 pb-4">{children}</div>
    </div>
  )
}
