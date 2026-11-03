import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useDismiss } from './useClickOutside'

export function ProfileMenu({ onLogout, compact = false }: { onLogout: () => void; compact?: boolean }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className={
          compact
            ? 'flex size-11 items-center justify-center rounded-xl hover:bg-emerald-soft'
            : 'flex h-11 items-center gap-2.5 rounded-xl border border-line bg-white pr-3 pl-1.5 transition-colors hover:border-muted/40'
        }
      >
        <span
          className={`flex size-8 items-center justify-center rounded-full text-[12px] font-semibold ${
            compact ? 'border border-gold/60 text-gold' : 'bg-emerald text-gold'
          }`}
        >
          {user.initials}
        </span>
        {!compact && (
          <>
            <span className="hidden text-left text-sm leading-tight xl:block">
              <span className="block font-medium text-ink">{user.name}</span>
            </span>
            <ChevronDown className="size-4 text-muted" aria-hidden />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-white shadow-pop"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-[12px] text-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              role="menuitem"
              to="/settings"
              onClick={close}
              className="flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm text-ink hover:bg-ivory"
            >
              <User className="size-4 text-muted" aria-hidden /> Profile
            </Link>
            <Link
              role="menuitem"
              to="/settings"
              onClick={close}
              className="flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm text-ink hover:bg-ivory"
            >
              <Settings className="size-4 text-muted" aria-hidden /> Settings
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                close()
                onLogout()
              }}
              className="flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm text-ink hover:bg-ivory"
            >
              <LogOut className="size-4 text-muted" aria-hidden /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
