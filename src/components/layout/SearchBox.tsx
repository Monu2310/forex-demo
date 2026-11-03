import { Search } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORY_LABELS, INSTRUMENTS } from '../../data/mockMarkets'
import { InstrumentIcon } from '../common/InstrumentIcon'
import { useDismiss } from './useClickOutside'

export function SearchBox({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return INSTRUMENTS.filter(
      (i) =>
        i.symbol.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.symbol.replace('/', '').toLowerCase().includes(q),
    ).slice(0, 6)
  }, [query])

  const go = (slug: string) => {
    navigate(`/markets/${slug}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <label className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 transition-colors focus-within:border-emerald/40">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          placeholder="Search markets…"
          aria-label="Search markets"
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!results.length) return
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => (a + 1) % results.length)
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => (a - 1 + results.length) % results.length)
            } else if (e.key === 'Enter') {
              e.preventDefault()
              go(results[active].slug)
            }
          }}
        />
      </label>

      {open && query.trim() && (
        <div className="animate-fade-in absolute right-0 left-0 z-40 mt-2 overflow-hidden rounded-xl border border-line bg-white shadow-pop">
          {results.length ? (
            <ul role="listbox" aria-label="Search results" className="p-1.5">
              {results.map((i, idx) => (
                <li key={i.slug} role="option" aria-selected={idx === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => go(i.slug)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${
                      idx === active ? 'bg-ivory' : ''
                    }`}
                  >
                    <InstrumentIcon instrument={i} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{i.symbol}</span>
                      <span className="block truncate text-[12px] text-muted">{i.name}</span>
                    </span>
                    <span className="text-[11px] text-muted">{CATEGORY_LABELS[i.category]}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted">No markets match “{query}”.</p>
          )}
        </div>
      )}
    </div>
  )
}
