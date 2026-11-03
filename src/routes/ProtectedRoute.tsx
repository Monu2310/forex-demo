import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Redirects to /login when no demo session exists, remembering the requested page. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return <Outlet />
}

/** Keeps signed-in users away from the login page (returning them to the page they originally requested). */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  return isAuthenticated ? <Navigate to={from && from !== '/login' ? from : '/dashboard'} replace /> : <Outlet />
}
