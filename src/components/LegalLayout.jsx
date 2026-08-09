import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function LegalLayout({ title, effectiveDate, sections = [], children }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase mb-4">
          Legal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-xs text-[var(--mist-dim)] mb-10">Effective {effectiveDate}</p>

        <div className="grid lg:grid-cols-[200px_1fr] gap-12">
          {sections.length > 0 && (
            <nav className="hidden lg:block">
              <div className="sticky top-8">
                <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--mist-dim)] uppercase mb-3">
                  On this page
                </p>
                <ul className="space-y-2 border-l border-[var(--line)]">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block pl-4 -ml-px border-l border-transparent hover:border-[var(--py-blue)] text-xs text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors py-0.5"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}

          <div className="space-y-10 text-sm text-[var(--mist)] leading-relaxed max-w-2xl [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:scroll-mt-8 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-[var(--py-blue)]">
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
