import { LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useWatchlist } from '../../context/WatchlistContext'
import { Logo } from '../common/Logo'
import { NAV_ITEMS } from './navItems'

interface SidebarContentProps {
  onNavigate?: () => void
  onLogout: () => void
}

/** Shared between the fixed desktop sidebar and the mobile drawer. */
export function SidebarContent({ onNavigate, onLogout }: SidebarContentProps) {
  const { user } = useAuth()
  const { slugs } = useWatchlist()

  return (
    <div className="flex h-full flex-col bg-emerald text-ivory">
      <div className="px-6 pt-8 pb-10">
        <Link to="/dashboard" onClick={onNavigate} className="inline-block rounded" aria-label="ELVERMONT — go to dashboard">
          <Logo tone="light" size="md" />
        </Link>
      </div>

      <nav aria-label="Main" className="flex-1 px-3">
        <p className="px-3 pb-3 text-[11px] font-medium tracking-[0.16em] text-ivory/45 uppercase">Menu</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-soft text-ivory' : 'text-ivory/65 hover:bg-emerald-soft/60 hover:text-ivory'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-r-full bg-gold" aria-hidden />
                    )}
                    <Icon className={`size-[18px] ${isActive ? 'text-gold' : ''}`} aria-hidden />
                    <span className="flex-1">{label}</span>
                    {to === '/watchlist' && slugs.length > 0 && (
                      <span className="tabular rounded-md bg-ivory/10 px-1.5 py-0.5 text-[11px] text-ivory/80">
                        {slugs.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-ivory/10 px-3 py-4">
        {user && (
          <div className="mb-2 flex items-center gap-3 px-3 py-2">
            <span className="flex size-9 items-center justify-center rounded-full border border-gold/60 text-[12px] font-semibold text-gold">
              {user.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block truncate text-[12px] text-ivory/55">Demo account</span>
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onLogout}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-ivory/65 transition-colors hover:bg-emerald-soft/60 hover:text-ivory"
        >
          <LogOut className="size-[18px]" aria-hidden />
          Logout
        </button>
      </div>
    </div>
  )
}
