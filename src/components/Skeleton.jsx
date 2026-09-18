export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 surface rounded-xl border border-[var(--line)] p-4">
      <SkeletonBlock className="w-10 h-10 rounded-full shrink-0" />
      <SkeletonBlock className="h-4 flex-1" />
      <SkeletonBlock className="h-5 w-24" />
    </div>
  )
}
