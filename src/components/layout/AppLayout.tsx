import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { MobileNav } from './MobileNav'
import { SidebarContent } from './SidebarContent'

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const logout = useLogout()
  const { pathname } = useLocation()

  // scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-dvh bg-ivory">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 lg:block">
        <SidebarContent onLogout={logout} />
      </aside>

      <MobileNav open={drawerOpen} setOpen={setDrawerOpen} onLogout={logout} />

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
