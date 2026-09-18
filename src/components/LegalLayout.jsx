import { ListTree } from 'lucide-react'
import SiteFooter from './SiteFooter'
import SEO from './SEO'
import Reveal from './Reveal'

export default function LegalLayout({ title, path, description, effectiveDate, icon: Icon, sections = [], children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SEO title={title} description={description} path={path} />
      <div
        aria-hidden
        className="absolute -top-24 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--py-blue)] blur-[110px] animate-glow opacity-15 pointer-events-none"
      />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-10 pb-20 pt-8 sm:pt-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[var(--py-blue)]" strokeWidth={1.75} />
              </div>
            )}
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--py-yellow-soft)] uppercase">Legal</p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-xs text-[var(--mist-dim)] mb-10">Effective {effectiveDate}</p>
        </Reveal>

        <div className="grid lg:grid-cols-[200px_1fr] gap-12">
          {sections.length > 0 && (
            <nav className="hidden lg:block">
              <div className="sticky top-8">
                <div className="flex items-center gap-1.5 mb-3">
                  <ListTree className="w-3.5 h-3.5 text-[var(--mist-dim)]" strokeWidth={2} />
                  <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--mist-dim)] uppercase">
                    On this page
                  </p>
                </div>
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

          <Reveal delay={100} className="space-y-10 text-sm text-[var(--mist)] leading-relaxed max-w-2xl [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:scroll-mt-8 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-[var(--py-blue)]">
            {children}
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
