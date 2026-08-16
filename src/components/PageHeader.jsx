export default function PageHeader({ eyebrow, title, subtitle, icon: Icon, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[var(--py-blue)]" strokeWidth={1.75} />
            </div>
          )}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--mist-dim)] mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}
