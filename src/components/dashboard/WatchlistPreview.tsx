import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuotes } from '../../context/PriceContext'
import { useWatchlist } from '../../context/WatchlistContext'
import { formatPrice } from '../../utils/format'
import { ButtonLink } from '../common/Button'
import { Card, CardHeader } from '../common/Card'
import { ChangeBadge } from '../common/ChangeBadge'
import { InstrumentIcon } from '../common/InstrumentIcon'

export function WatchlistPreview() {
  const { slugs } = useWatchlist()
  const quotes = useQuotes(slugs.slice(0, 5))

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Watchlist"
        subtitle={`${slugs.length} instrument${slugs.length === 1 ? '' : 's'}`}
        action={
          <Link to="/watchlist" className="text-[13px] font-medium text-emerald hover:underline">
            View all
          </Link>
        }
      />
      {quotes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <Star className="mb-3 size-5 text-gold" aria-hidden />
          <p className="text-sm text-muted">Your watchlist is empty.</p>
          <ButtonLink to="/markets" variant="secondary" size="sm" className="mt-4">
            Browse markets
          </ButtonLink>
        </div>
      ) : (
        <ul className="-mx-2 flex-1 divide-y divide-line">
          {quotes.map((q) => (
            <li key={q.instrument.slug}>
              <Link
                to={`/markets/${q.instrument.slug}`}
                className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-ivory"
              >
                <InstrumentIcon instrument={q.instrument} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{q.instrument.symbol}</span>
                  <span className="block truncate text-[12px] text-muted">{q.instrument.name}</span>
                </span>
                <span className="text-right">
                  <span className="tabular block text-sm font-medium text-ink">
                    {formatPrice(q.price, q.instrument.decimals)}
                  </span>
                  <ChangeBadge value={q.changePct} className="justify-end text-[12px]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
