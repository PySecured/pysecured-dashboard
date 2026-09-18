import { Link } from 'react-router-dom'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import { DISCORD_SUPPORT_URL } from '../config'

const COLUMNS = [
  {
    label: 'Product',
    links: [
      { to: '/', label: 'Home' },
      { to: '/docs', label: 'Documentation' },
      { to: '/premium', label: 'Premium' },
      { to: '/status', label: 'Status' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of Use' },
      { to: '/privacy', label: 'Privacy Policy' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--line)] mt-8">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-2.5 mb-3">
              <img src="/logo.png" alt="" className="w-8 h-8 transition-transform duration-300 group-hover:rotate-[8deg]" />
              <span className="font-display font-bold text-white tracking-tight">PySecured</span>
            </Link>
            <p className="text-sm text-[var(--mist-dim)] leading-relaxed max-w-xs mb-5">
              An all-in-one Discord bot — security, moderation, tickets, verification and more.
              Mostly free, no feature held hostage.
            </p>
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center gap-2 rounded-xl surface border border-[var(--line)] hover:brightness-125 transition-all text-sm text-white px-4 py-2.5"
            >
              <MessageCircle className="w-4 h-4 text-[var(--py-blue)]" strokeWidth={2} />
              Join the Discord
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.label}>
              <p className="text-[11px] font-semibold tracking-wider text-[var(--mist-dim)]/60 uppercase mb-3">
                {col.label}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 mt-10 border-t border-[var(--line)]">
          <p className="text-xs text-[var(--mist-dim)]">
            © {new Date().getFullYear()} PySecured. Not affiliated with Discord Inc.
          </p>
          <p className="text-xs text-[var(--mist-dim)]">
            Built for communities that would rather not get raided.
          </p>
        </div>
      </div>
    </footer>
  )
}
