import { ShieldCheck, Ticket, Trophy, Gift, UserCheck, Crown } from 'lucide-react'

/**
 * A stylised mock of the dashboard for the homepage hero.
 *
 * Built from markup rather than a screenshot on purpose: it stays sharp at
 * any size, weighs nothing, re-themes automatically with the CSS variables,
 * and never goes out of date when the real dashboard changes.
 */
export default function DashboardPreview() {
  const rows = [
    { Icon: ShieldCheck, label: 'Protection', on: true },
    { Icon: UserCheck, label: 'Verification', on: true },
    { Icon: Ticket, label: 'Tickets', on: true },
    { Icon: Trophy, label: 'Leveling', on: false },
    { Icon: Gift, label: 'Giveaways', on: false, premium: false },
  ]

  return (
    <div className="relative w-full max-w-md select-none" aria-hidden="true">
      {/* Glow behind the panel */}
      <div className="absolute -inset-6 rounded-[2rem] bg-[var(--py-blue)] opacity-[0.14] blur-[60px]" />

      <div className="relative surface rounded-2xl border border-[var(--line)] overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-2 font-mono text-[10px] text-[var(--mist-dim)]">dashboard.pysecured.online</span>
        </div>

        <div className="p-4">
          {/* Server chip */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--py-blue)] to-[var(--accent-violet)] shrink-0" />
            <div className="min-w-0">
              <div className="h-2.5 w-24 rounded bg-white/25 mb-1.5" />
              <div className="h-2 w-14 rounded bg-white/10" />
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[['1,284', 'members'], ['12/12', 'modules'], ['0', 'incidents']].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 px-2.5 py-2.5">
                <p className="font-mono text-sm text-white leading-none">{v}</p>
                <p className="text-[9px] text-[var(--mist-dim)] mt-1">{l}</p>
              </div>
            ))}
          </div>

          {/* Module rows */}
          <div className="space-y-1.5">
            {rows.map(({ Icon, label, on, premium }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/40 px-3 py-2.5"
              >
                <Icon className="w-3.5 h-3.5 text-[var(--py-blue)] shrink-0" strokeWidth={2} />
                <span className="text-[11px] text-[var(--mist)] flex-1">{label}</span>
                {premium && (
                  <span className="crown">
                    <Crown className="w-2 h-2" strokeWidth={3} />
                  </span>
                )}
                <span
                  className={`w-7 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                    on ? 'bg-[var(--py-blue)] justify-end' : 'bg-white/10 justify-start'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
