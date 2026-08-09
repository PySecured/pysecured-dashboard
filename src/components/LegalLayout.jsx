import { Link } from 'react-router-dom'

export default function LegalLayout({ title, effectiveDate, children }) {
  return (
    <div className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="w-7 h-7" />
          <span className="font-display font-bold text-white tracking-tight text-sm">PySecured</span>
        </Link>
        <Link to="/" className="text-xs text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--py-blue)] rounded">
          ← Back home
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        <h1 className="font-display text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-xs text-[var(--mist-dim)] mb-10">Effective {effectiveDate}</p>

        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 mb-10">
          <p className="text-xs text-amber-300/90 leading-relaxed">
            This is a starting template, not legal advice — fill in the bracketed
            placeholders below with your actual contact details, and consider
            having it reviewed before relying on it for a public server.
          </p>
        </div>

        <div className="space-y-8 text-sm text-[var(--mist)] leading-relaxed [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-[var(--py-blue)]">
          {children}
        </div>
      </main>
    </div>
  )
}
