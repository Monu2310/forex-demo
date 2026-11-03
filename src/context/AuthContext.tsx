import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { readJSON, removeKey, STORAGE_KEYS, writeJSON } from '../utils/storage'

/**
 * SIMULATED FRONTEND AUTHENTICATION — for demo purposes only.
 * Credentials are hard-coded and the "session" is a plain object in Web Storage.
 * This is NOT secure and must not be used in production.
 */

export const DEMO_CREDENTIALS = {
  email: 'demo@elvermont.com',
  password: 'Demo@123',
} as const

export interface DemoUser {
  email: string
  name: string
  firstName: string
  initials: string
  loggedInAt: number
}

interface AuthContextValue {
  user: DemoUser | null
  isAuthenticated: boolean
  login: (email: string, password: string, remember: boolean) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadSession(): DemoUser | null {
  return (
    readJSON<DemoUser | null>(STORAGE_KEYS.session, null) ??
    readJSON<DemoUser | null>(STORAGE_KEYS.session, null, sessionStorage)
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(loadSession)

  const login = useCallback((email: string, password: string, remember: boolean) => {
    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
    if (!ok) return false
    const session: DemoUser = {
      email: DEMO_CREDENTIALS.email,
      name: 'Alex Morgan',
      firstName: 'Alex',
      initials: 'AM',
      loggedInAt: Date.now(),
    }
    writeJSON(STORAGE_KEYS.session, session, remember ? localStorage : sessionStorage)
    setUser(session)
    return true
  }, [])

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.session)
    removeKey(STORAGE_KEYS.session, sessionStorage)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
