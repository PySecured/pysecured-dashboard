import { Link } from 'react-router-dom'
import { DISCORD_SUPPORT_URL } from '../config'

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[var(--mist-dim)] text-xs">
          <img src="/logo.png" alt="" className="w-5 h-5 opacity-80" />
          <span>© {new Date().getFullYear()} PySecured</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[var(--mist-dim)]">
          <Link to="/status" className="hover:text-[var(--mist)] transition-colors">
            Status
          </Link>
          <Link to="/premium" className="hover:text-[var(--mist)] transition-colors">
            Premium
          </Link>
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--mist)] transition-colors"
          >
            Discord
          </a>
          <Link to="/terms" className="hover:text-[var(--mist)] transition-colors">
            Terms of Use
          </Link>
          <Link to="/privacy" className="hover:text-[var(--mist)] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
