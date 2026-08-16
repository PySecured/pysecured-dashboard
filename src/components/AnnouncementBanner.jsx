import { useEffect, useState } from 'react'
import { Megaphone, X } from 'lucide-react'
import { api } from '../api'

const DISMISS_KEY = 'pysecured_announcement_dismissed'

export default function AnnouncementBanner() {
  const [data, setData] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    api.announcementStatus().then(setData).catch(() => {})
  }, [])

  useEffect(() => {
    if (data?.enabled) {
      // Keyed by message content, not just a boolean — if the admin changes
      // the message, someone who dismissed the old one sees the new one.
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === data.message)
    }
  }, [data])

  if (!data?.enabled || dismissed) return null

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, data.message)
    setDismissed(true)
  }

  return (
    <div className="relative bg-[var(--py-blue)]/10 border-b border-[var(--py-blue)]/25 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
        <p className="text-xs sm:text-sm text-[var(--mist)] flex items-center gap-2 text-center">
          <Megaphone className="w-3.5 h-3.5 text-[var(--py-blue)] shrink-0" strokeWidth={2} />
          {data.message}
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 shrink-0 text-[var(--mist-dim)] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
