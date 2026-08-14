export function BarChart({ data, height = 120 }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const barWidth = 100 / data.length

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = (d.count / max) * (height - 20)
          const x = i * barWidth
          return (
            <g key={d.date}>
              <rect
                x={x + barWidth * 0.15}
                y={height - 16 - barHeight}
                width={barWidth * 0.7}
                height={Math.max(barHeight, d.count > 0 ? 2 : 0)}
                rx={1}
                className={d.count > 0 ? 'fill-[var(--py-blue)]' : 'fill-[var(--line)]'}
              />
            </g>
          )
        })}
      </svg>
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[10px] text-[var(--mist-dim)]">{data[0]?.date.slice(5)}</span>
        <span className="font-mono text-[10px] text-[var(--mist-dim)]">{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  )
}
