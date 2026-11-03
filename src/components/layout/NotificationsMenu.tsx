import { Bell } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { DEMO_NOTIFICATIONS } from '../../data/mockActivity'
import { useDismiss } from './useClickOutside'

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          setUnread(false)
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unread ? 'Notifications (3 unread)' : 'Notifications'}
        className="relative flex size-11 items-center justify-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-muted/40"
      >
        <Bell className="size-[18px]" />
        {unread && <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-gold ring-2 ring-white" aria-hidden />}
      </button>

      {open && (
        <div className="animate-fade-in absolute right-0 z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-white shadow-pop">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <span className="text-[11px] font-medium tracking-wide text-muted uppercase">Demo</span>
          </div>
          <ul className="divide-y divide-line">
            {DEMO_NOTIFICATIONS.map((n) => (
              <li key={n.id} className="px-4 py-3">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="mt-0.5 text-[13px] text-muted">{n.body}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {n.minutesAgo < 60 ? `${n.minutesAgo} min ago` : `${Math.round(n.minutesAgo / 60)} hrs ago`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
