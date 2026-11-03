import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuote } from '../../context/PriceContext'
import { useSeries } from '../../hooks/useSeries'
import { formatPrice } from '../../utils/format'
import { seriesChangePct, type TimeRange } from '../../utils/series'
import { Card } from '../common/Card'
import { ChangeBadge } from '../common/ChangeBadge'
import { InstrumentIcon } from '../common/InstrumentIcon'
import { PriceChart } from '../charts/PriceChart'
import { TimeRangeTabs } from '../charts/TimeRangeTabs'

interface InstrumentChartCardProps {
  slug: string
  title?: string
  showDetailsLink?: boolean
  /** Hide the price headline when the page already shows it (market detail) */
  hideHeadline?: boolean
  height?: number
}

/** Price headline + time filters + simulated chart for one instrument. */
export function InstrumentChartCard({
  slug,
  title,
  showDetailsLink = true,
  hideHeadline = false,
  height = 300,
}: InstrumentChartCardProps) {
  const [range, setRange] = useState<TimeRange>('1D')
  const quote = useQuote(slug)
  const series = useSeries(quote, range)
  if (!quote) return null
  const { instrument } = quote
  const rangeChange = range === '1D' ? quote.changePct : seriesChangePct(series)

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {hideHeadline ? (
          <div>
            <p className="text-[15px] font-semibold text-ink">Price history</p>
            <p className="mt-0.5 text-[13px] text-muted">
              <ChangeBadge value={rangeChange} className="mr-1.5" />
              {range === '1D' ? 'today' : `over the past ${range}`}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <InstrumentIcon instrument={instrument} />
            <div>
              <p className="text-sm font-medium text-muted">
                {title ?? `${instrument.name} / USD`} <span className="text-muted/70">· {instrument.symbol}</span>
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">
                  {formatPrice(quote.price, instrument.decimals)}
                </span>
                <ChangeBadge value={rangeChange} variant="pill" />
                <span className="text-[12px] text-muted">{range === '1D' ? 'Today' : `Past ${range}`}</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <TimeRangeTabs value={range} onChange={setRange} />
        </div>
      </div>

      <PriceChart instrument={instrument} series={series} range={range} height={height} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[12px] text-muted">
        <span>Simulated data for demonstration — not live market prices.</span>
        {showDetailsLink && (
          <Link
            to={`/markets/${instrument.slug}`}
            className="inline-flex items-center gap-1 font-medium text-emerald hover:underline"
          >
            View market details <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </Card>
  )
}
