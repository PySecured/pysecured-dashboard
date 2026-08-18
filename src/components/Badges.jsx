/**
 * Badge row. Badges come from the API already resolved from Discord roles,
 * so this only renders — there's no client-side notion of who deserves what.
 */
export default function Badges({ badges, size = 'sm', className = '' }) {
  if (!badges?.length) return null
  const px = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {badges.map((b) => (
        <img
          key={b.id}
          src={b.icon}
          alt={b.label}
          title={b.description || b.label}
          className={`${px} shrink-0`}
          loading="lazy"
        />
      ))}
    </span>
  )
}
