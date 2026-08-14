import { useEffect, useState } from 'react'

const SCRIPT = [
  { text: 'pysecured watch --guild "your-server"', type: 'cmd' },
  { text: 'scanning #general...', type: 'dim' },
  { text: 'flagged: lookalike domain in message', type: 'warn' },
  { text: 'quarantined @user_3821 · role applied', type: 'action' },
  { text: 'giveaway started in #announcements', type: 'action' },
  { text: 'ticket opened by @user_5512', type: 'action' },
  { text: 'reaction role assigned · @user_2290 → Gamer', type: 'action' },
  { text: 'welcomed @user_9927 · auto-role applied', type: 'action' },
  { text: 'flagged: message in #spam-catcher', type: 'warn' },
  { text: 'banned @user_9027 · trap channel', type: 'action' },
  { text: 'ticket closed · transcript logged', type: 'ok' },
  { text: 'all clear', type: 'ok' },
]

const STYLES = {
  cmd: 'text-[var(--py-yellow-soft)]',
  dim: 'text-[var(--mist-dim)]',
  warn: 'text-amber-400',
  action: 'text-[var(--py-blue)]',
  ok: 'text-emerald-400',
}

const PREFIX = {
  cmd: '$',
  dim: '·',
  warn: '⚠',
  action: '✔',
  ok: '✔',
}

export default function LiveFeed() {
  const [lines, setLines] = useState([SCRIPT[0]])
  const [i, setI] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, SCRIPT[i % SCRIPT.length]]
        return next.length > 7 ? next.slice(next.length - 7) : next
      })
      setI((prev) => prev + 1)
    }, 1400)
    return () => clearInterval(timer)
  }, [i])

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)]/80 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden w-full max-w-md">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--line)]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 font-mono text-[11px] text-[var(--mist-dim)]">activity-log</span>
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed h-[220px] flex flex-col justify-end">
        {lines.map((line, idx) => (
          <div key={`${line.text}-${idx}-${i}`} className="animate-log-in flex gap-2">
            <span className={STYLES[line.type]}>{PREFIX[line.type]}</span>
            <span className={line.type === 'cmd' ? STYLES.cmd : 'text-[var(--mist)]'}>{line.text}</span>
          </div>
        ))}
        <div className="flex gap-2 mt-1">
          <span className="text-[var(--py-yellow-soft)]">$</span>
          <span className="inline-block w-2 h-3.5 bg-[var(--py-yellow-soft)] animate-caret" />
        </div>
      </div>
    </div>
  )
}
