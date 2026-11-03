import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_WATCHLIST, getInstrument } from '../data/mockMarkets'
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage'
import { useActivity } from './ActivityContext'
import { useToast } from './ToastContext'

interface WatchlistContextValue {
  slugs: string[]
  has: (slug: string) => boolean
  add: (slug: string) => void
  remove: (slug: string) => void
  toggle: (slug: string) => void
  reset: () => void
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null)

function load(): string[] {
  const stored = readJSON<string[] | null>(STORAGE_KEYS.watchlist, null)
  return Array.isArray(stored) ? stored.filter((s) => getInstrument(s)) : [...DEFAULT_WATCHLIST]
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(load)
  const { log } = useActivity()
  const { notify } = useToast()

  const persist = useCallback((next: string[]) => {
    writeJSON(STORAGE_KEYS.watchlist, next)
    setSlugs(next)
  }, [])

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs])

  const add = useCallback(
    (slug: string) => {
      const inst = getInstrument(slug)
      if (!inst || slugs.includes(slug)) return
      persist([...slugs, slug])
      log('watchlist-add', `Added ${inst.symbol} to watchlist`)
      notify(`${inst.symbol} added to your watchlist`)
    },
    [slugs, persist, log, notify],
  )

  const remove = useCallback(
    (slug: string) => {
      const inst = getInstrument(slug)
      if (!inst || !slugs.includes(slug)) return
      persist(slugs.filter((s) => s !== slug))
      log('watchlist-remove', `Removed ${inst.symbol} from watchlist`)
      notify(`${inst.symbol} removed from your watchlist`, 'info')
    },
    [slugs, persist, log, notify],
  )

  const toggle = useCallback(
    (slug: string) => (slugs.includes(slug) ? remove(slug) : add(slug)),
    [slugs, add, remove],
  )

  const reset = useCallback(() => persist([...DEFAULT_WATCHLIST]), [persist])

  const value = useMemo(
    () => ({ slugs, has, add, remove, toggle, reset }),
    [slugs, has, add, remove, toggle, reset],
  )
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
