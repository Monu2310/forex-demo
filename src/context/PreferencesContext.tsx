import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage'

export interface Preferences {
  priceAlerts: boolean
  weeklySummary: boolean
  productUpdates: boolean
}

const DEFAULTS: Preferences = { priceAlerts: true, weeklySummary: true, productUpdates: false }

interface PreferencesContextValue {
  preferences: Preferences
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void
  reset: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => ({
    ...DEFAULTS,
    ...readJSON<Partial<Preferences>>(STORAGE_KEYS.preferences, {}),
  }))

  const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value }
      writeJSON(STORAGE_KEYS.preferences, next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    writeJSON(STORAGE_KEYS.preferences, DEFAULTS)
    setPreferences(DEFAULTS)
  }, [])

  const value = useMemo(() => ({ preferences, setPreference, reset }), [preferences, setPreference, reset])
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}
