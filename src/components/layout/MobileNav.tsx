import { Menu, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { ProfileMenu } from './ProfileMenu'
import { SidebarContent } from './SidebarContent'

interface MobileNavProps {
  open: boolean
  setOpen: (open: boolean) => void
  onLogout: () => void
}

export function MobileNav({ open, setOpen, onLogout }: MobileNavProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, setOpen])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-emerald px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-11 items-center justify-center rounded-xl text-ivory hover:bg-emerald-soft"
          aria-label="Open navigation menu"
          aria-expanded={open}
        >
          <Menu className="size-5" />
        </button>
        <Link to="/dashboard" aria-label="ELVERMONT — go to dashboard">
          <Logo tone="light" size="sm" />
        </Link>
        <ProfileMenu onLogout={onLogout} compact />
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="animate-fade-in absolute inset-0 bg-surface-dark/50"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 w-[82%] max-w-[300px] shadow-pop">
            <SidebarContent onNavigate={() => setOpen(false)} onLogout={onLogout} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-6 right-3 flex size-10 items-center justify-center rounded-xl text-ivory/70 hover:bg-emerald-soft hover:text-ivory"
              aria-label="Close navigation menu"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
