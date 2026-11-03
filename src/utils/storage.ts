/** Small, crash-safe wrappers around Web Storage (private mode / quota errors are ignored). */

export const STORAGE_KEYS = {
  session: 'elvermont.session',
  watchlist: 'elvermont.watchlist',
  activity: 'elvermont.activity',
  preferences: 'elvermont.preferences',
} as const

export function readJSON<T>(key: string, fallback: T, store: Storage = localStorage): T {
  try {
    const raw = store.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown, store: Storage = localStorage): void {
  try {
    store.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export function removeKey(key: string, store: Storage = localStorage): void {
  try {
    store.removeItem(key)
  } catch {
    /* ignore */
  }
}
