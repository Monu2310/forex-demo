import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { seedActivity, type Activity, type ActivityKind } from '../data/mockActivity'
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage'

/** Demo activity log (UI events only — never financial transactions). Persisted locally. */

const MAX_ITEMS = 20

interface ActivityContextValue {
  activities: Activity[]
  log: (kind: ActivityKind, message: string) => void
  reset: () => void
}

const ActivityContext = createContext<ActivityContextValue | null>(null)

function load(): Activity[] {
  const stored = readJSON<Activity[] | null>(STORAGE_KEYS.activity, null)
  if (stored && stored.length) return stored
  const seeded = seedActivity()
  writeJSON(STORAGE_KEYS.activity, seeded)
  return seeded
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(load)

  const log = useCallback((kind: ActivityKind, message: string) => {
    setActivities((prev) => {
      // avoid duplicate consecutive entries (e.g. re-opening the same market)
      if (prev[0] && prev[0].message === message && Date.now() - prev[0].at < 10 * 60_000) return prev
      const next = [
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, message, at: Date.now() },
        ...prev,
      ].slice(0, MAX_ITEMS)
      writeJSON(STORAGE_KEYS.activity, next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const seeded = seedActivity()
    writeJSON(STORAGE_KEYS.activity, seeded)
    setActivities(seeded)
  }, [])

  const value = useMemo(() => ({ activities, log, reset }), [activities, log, reset])
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export function useActivity() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider')
  return ctx
}
