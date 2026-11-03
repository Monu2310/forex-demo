import { Star } from 'lucide-react'
import { useWatchlist } from '../../context/WatchlistContext'

interface WatchlistButtonProps {
  slug: string
  variant?: 'icon' | 'full'
  className?: string
}

export function WatchlistButton({ slug, variant = 'icon', className = '' }: WatchlistButtonProps) {
  const { has, toggle } = useWatchlist()
  const saved = has(slug)
  const label = saved ? 'Remove from watchlist' : 'Add to watchlist'

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-colors ${
          saved ? 'border border-gold/70 bg-white text-ink hover:bg-gold/10' : 'bg-emerald text-ivory hover:bg-surface-dark'
        } ${className}`}
      >
        <Star className={`size-4 ${saved ? 'fill-gold text-gold' : ''}`} aria-hidden />
        {saved ? 'In watchlist' : 'Add to Watchlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle(slug)
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`flex size-10 items-center justify-center rounded-xl border transition-colors ${
        saved ? 'border-gold/60 bg-gold/10 text-ink' : 'border-line bg-white text-muted hover:text-ink'
      } ${className}`}
    >
      <Star className={`size-4 ${saved ? 'fill-gold text-gold' : ''}`} aria-hidden />
    </button>
  )
}
