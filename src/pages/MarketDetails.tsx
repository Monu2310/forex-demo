import { ArrowLeft, ChevronRight, SearchX } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/common/Button'
import { Card, CardHeader } from '../components/common/Card'
import { CategoryTag } from '../components/common/CategoryTag'
import { ChangeBadge } from '../components/common/ChangeBadge'
import { DemoBadge } from '../components/common/DemoBadge'
import { EmptyState } from '../components/common/EmptyState'
import { InstrumentIcon } from '../components/common/InstrumentIcon'
import { StatusDot } from '../components/common/StatusDot'
import { InstrumentChartCard } from '../components/dashboard/InstrumentChartCard'
import { PageHeader } from '../components/layout/PageHeader'
import { WatchlistButton } from '../components/markets/WatchlistButton'
import { useActivity } from '../context/ActivityContext'
import { useQuote, useQuotes } from '../context/PriceContext'
import { CATEGORY_LABELS, INSTRUMENTS } from '../data/mockMarkets'
import { formatPrice } from '../utils/format'

export default function MarketDetails() {
  const { symbol } = useParams()
  const quote = useQuote(symbol)
  const navigate = useNavigate()
  const { log } = useActivity()
  const instrumentSymbol = quote?.instrument.symbol

  useEffect(() => {
    if (instrumentSymbol) log('view', `Viewed ${instrumentSymbol} market`)
  }, [instrumentSymbol, log])

  const related = useQuotes(
    INSTRUMENTS.filter((i) => quote && i.category === quote.instrument.category && i.slug !== quote.instrument.slug)
      .slice(0, 4)
      .map((i) => i.slug),
  )

  if (!quote) {
    return (
      <>
        <PageHeader title="Market not found" />
        <Card>
          <EmptyState
            icon={SearchX}
            title="We couldn’t find that instrument"
            description={`“${symbol}” is not part of the ELVERMONT demo market list.`}
            action={<ButtonLink to="/markets">Back to Markets</ButtonLink>}
          />
        </Card>
      </>
    )
  }

  const { instrument } = quote
  const { info } = instrument
  const d = instrument.decimals

  const facts: [string, ReactNode][] = [
    ['Category', <CategoryTag category={instrument.category} />],
    ['Status', <StatusDot status={instrument.status} />],
    ['Open (24h)', formatPrice(quote.open, d)],
    ['Day range', `${formatPrice(quote.dayLow, d)} – ${formatPrice(quote.dayHigh, d)}`],
    ['Base / quote', `${info.baseAsset} / ${info.quoteAsset}`],
    ['Contract unit', info.contractUnit],
    ['Tick size', info.tickSize],
    ['Venue', info.venue],
    ['Trading hours', info.tradingHours],
  ]

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[13px] text-muted">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/markets'))}
          className="inline-flex items-center gap-1.5 rounded-lg py-1 pr-2 font-medium text-emerald hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>
        <span aria-hidden>·</span>
        <Link to="/markets" className="hover:text-ink">Markets</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link to={`/markets?category=${instrument.category}`} className="hover:text-ink">
          {CATEGORY_LABELS[instrument.category]}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-ink">{instrument.symbol}</span>
      </nav>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <InstrumentIcon instrument={instrument} size="lg" />
            <span>
              {instrument.name}
              <span className="ml-2 align-middle text-base font-medium text-muted">{instrument.symbol}</span>
            </span>
          </span>
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="tabular text-[34px] leading-none font-semibold tracking-tight text-ink">
                {formatPrice(quote.price, d)}
              </span>
              <span className="text-sm text-muted">{info.quoteAsset}</span>
              <ChangeBadge value={quote.changePct} variant="pill" />
              <span className="tabular text-[13px] text-muted">
                {quote.change >= 0 ? '+' : '−'}
                {formatPrice(Math.abs(quote.change), d)} today
              </span>
            </div>
            <DemoBadge label="Demo data — not live market prices" className="mt-3" />
          </div>
          <WatchlistButton slug={instrument.slug} variant="full" className="w-full sm:w-auto" />
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InstrumentChartCard slug={instrument.slug} title={instrument.name} showDetailsLink={false} hideHeadline height={340} />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader title="Instrument information" />
            <p className="mb-4 text-sm leading-relaxed text-muted">{instrument.description}</p>
            <dl className="divide-y divide-line border-t border-line">
              {facts.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd className="tabular text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardHeader title={`More in ${CATEGORY_LABELS[instrument.category]}`} />
              <ul className="-mx-2 divide-y divide-line">
                {related.map((r) => (
                  <li key={r.instrument.slug}>
                    <Link
                      to={`/markets/${r.instrument.slug}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-ivory"
                    >
                      <InstrumentIcon instrument={r.instrument} size="sm" />
                      <span className="flex-1 text-sm font-medium text-ink">{r.instrument.symbol}</span>
                      <span className="text-right">
                        <span className="tabular block text-sm text-ink">{formatPrice(r.price, r.instrument.decimals)}</span>
                        <ChangeBadge value={r.changePct} className="text-[12px]" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
