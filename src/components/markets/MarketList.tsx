import { ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { Quote } from '../../context/PriceContext'
import { formatPrice } from '../../utils/format'
import { generateSeries } from '../../utils/series'
import { buttonClass } from '../common/Button'
import { CategoryTag } from '../common/CategoryTag'
import { ChangeBadge } from '../common/ChangeBadge'
import { InstrumentIcon } from '../common/InstrumentIcon'
import { Sparkline } from '../charts/Sparkline'
import { WatchlistButton } from './WatchlistButton'

interface MarketListProps {
  quotes: Quote[]
  /** Replace the add/remove star with an explicit remove button (watchlist page) */
  mode?: 'markets' | 'watchlist'
  onRemove?: (slug: string) => void
}

/** Responsive instrument list: table on md+, stacked cards on mobile. */
export function MarketList({ quotes, mode = 'markets', onRemove }: MarketListProps) {
  const navigate = useNavigate()

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-ivory/60 text-left text-[12px] text-muted">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Daily change</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                <span className="sr-only">Trend (1D)</span>
                <span aria-hidden>1D trend</span>
              </th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {quotes.map((q) => (
              <tr
                key={q.instrument.slug}
                onClick={() => navigate(`/markets/${q.instrument.slug}`)}
                className="cursor-pointer transition-colors hover:bg-ivory/70"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <InstrumentIcon instrument={q.instrument} />
                    <div>
                      <p className="font-semibold text-ink">{q.instrument.name}</p>
                      <p className="text-[12px] text-muted">{q.instrument.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <CategoryTag category={q.instrument.category} />
                </td>
                <td className="tabular px-4 py-3.5 text-right font-medium text-ink">
                  {formatPrice(q.price, q.instrument.decimals)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <ChangeBadge value={q.changePct} />
                </td>
                <td className="hidden px-4 py-3.5 lg:table-cell">
                  <Sparkline series={generateSeries(q.instrument, '1D', q.price)} />
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/markets/${q.instrument.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={buttonClass('secondary', 'sm')}
                    >
                      View details
                    </Link>
                    {mode === 'markets' ? (
                      <WatchlistButton slug={q.instrument.slug} />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemove?.(q.instrument.slug)
                        }}
                        className={buttonClass('ghost', 'sm')}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {quotes.map((q) => (
          <li key={q.instrument.slug} className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Link to={`/markets/${q.instrument.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                <InstrumentIcon instrument={q.instrument} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">{q.instrument.name}</span>
                  <span className="block text-[12px] text-muted">{q.instrument.symbol}</span>
                </span>
                <span className="text-right">
                  <span className="tabular block text-sm font-semibold text-ink">
                    {formatPrice(q.price, q.instrument.decimals)}
                  </span>
                  <ChangeBadge value={q.changePct} className="text-[12px]" />
                </span>
              </Link>
            </div>
            <div className="mt-3 flex items-center gap-2 pl-[52px]">
              <Link
                to={`/markets/${q.instrument.slug}`}
                className={buttonClass('secondary', 'sm', 'h-10 flex-1')}
              >
                View details <ChevronRight className="size-3.5" aria-hidden />
              </Link>
              {mode === 'markets' ? (
                <WatchlistButton slug={q.instrument.slug} />
              ) : (
                <button
                  type="button"
                  onClick={() => onRemove?.(q.instrument.slug)}
                  className={buttonClass('ghost', 'sm', 'h-10')}
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
