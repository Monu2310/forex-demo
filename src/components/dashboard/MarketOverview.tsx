import { Link, useNavigate } from 'react-router-dom'
import { useQuotes } from '../../context/PriceContext'
import { OVERVIEW_SLUGS } from '../../data/mockMarkets'
import { formatPrice } from '../../utils/format'
import { Card, CardHeader } from '../common/Card'
import { CategoryTag } from '../common/CategoryTag'
import { ChangeBadge } from '../common/ChangeBadge'
import { InstrumentIcon } from '../common/InstrumentIcon'
import { StatusDot } from '../common/StatusDot'

export function MarketOverview() {
  const quotes = useQuotes(OVERVIEW_SLUGS)
  const navigate = useNavigate()

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <CardHeader
          title="Market overview"
          subtitle="Selected instruments across asset classes"
          action={
            <Link to="/markets" className="text-[13px] font-medium text-emerald hover:underline">
              All markets
            </Link>
          }
        />
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-line bg-ivory/60 text-left text-[12px] font-medium text-muted">
              <th className="px-6 py-2.5 font-medium">Asset</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 text-right font-medium">Price</th>
              <th className="px-4 py-2.5 text-right font-medium">24h change</th>
              <th className="px-6 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {quotes.map((q) => (
              <tr
                key={q.instrument.slug}
                onClick={() => navigate(`/markets/${q.instrument.slug}`)}
                className="cursor-pointer transition-colors hover:bg-ivory/70"
              >
                <td className="px-6 py-3">
                  <Link
                    to={`/markets/${q.instrument.slug}`}
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InstrumentIcon instrument={q.instrument} size="sm" />
                    <span>
                      <span className="block font-semibold text-ink">{q.instrument.symbol}</span>
                      <span className="block text-[12px] text-muted">{q.instrument.name}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <CategoryTag category={q.instrument.category} />
                </td>
                <td className="tabular px-4 py-3 text-right font-medium text-ink">
                  {formatPrice(q.price, q.instrument.decimals)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ChangeBadge value={q.changePct} />
                </td>
                <td className="px-6 py-3">
                  <StatusDot status={q.instrument.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <ul className="divide-y divide-line border-t border-line md:hidden">
        {quotes.map((q) => (
          <li key={q.instrument.slug}>
            <Link to={`/markets/${q.instrument.slug}`} className="flex items-center gap-3 px-5 py-3.5">
              <InstrumentIcon instrument={q.instrument} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{q.instrument.symbol}</span>
                <span className="mt-0.5 flex items-center gap-2">
                  <CategoryTag category={q.instrument.category} />
                  <StatusDot status={q.instrument.status} />
                </span>
              </span>
              <span className="text-right">
                <span className="tabular block text-sm font-medium text-ink">
                  {formatPrice(q.price, q.instrument.decimals)}
                </span>
                <ChangeBadge value={q.changePct} className="text-[12px]" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
