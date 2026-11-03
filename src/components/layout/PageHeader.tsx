import type { ReactNode } from 'react'
import { useLogout } from '../../hooks/useLogout'
import { NotificationsMenu } from './NotificationsMenu'
import { ProfileMenu } from './ProfileMenu'
import { SearchBox } from './SearchBox'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  /** Extra content shown under the title row (e.g. badges) */
  children?: ReactNode
}

/** Page title + global actions (search, notifications, profile). */
export function PageHeader({ title, description, eyebrow, children }: PageHeaderProps) {
  const logout = useLogout()
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <div className="mb-1.5 text-[13px] text-muted">{eyebrow}</div>}
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted sm:text-[15px]">{description}</p>}
        </div>
        <div className="flex items-center gap-2.5">
          <SearchBox className="flex-1 lg:w-64 lg:flex-none" />
          <NotificationsMenu />
          <div className="hidden lg:block">
            <ProfileMenu onLogout={logout} />
          </div>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  )
}
