import { Star } from 'lucide-react'
import { ButtonLink } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { DemoBadge } from '../components/common/DemoBadge'
import { EmptyState } from '../components/common/EmptyState'
import { MarketList } from '../components/markets/MarketList'
import { PageHeader } from '../components/layout/PageHeader'
import { useQuotes } from '../context/PriceContext'
import { useWatchlist } from '../context/WatchlistContext'

export default function Watchlist() {
  const { slugs, remove } = useWatchlist()
  const quotes = useQuotes(slugs)

  return (
    <>
      <PageHeader title="Watchlist" description="The instruments you follow most closely.">
        <DemoBadge label="Demo data — not live market prices" />
      </PageHeader>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Saved instruments</h2>
            <p className="text-[13px] text-muted">
              {slugs.length} instrument{slugs.length === 1 ? '' : 's'} · saved on this device
            </p>
          </div>
          <ButtonLink to="/markets" variant="secondary" size="sm">
            Add instruments
          </ButtonLink>
        </div>

        {quotes.length ? (
          <MarketList quotes={quotes} mode="watchlist" onRemove={remove} />
        ) : (
          <EmptyState
            icon={Star}
            title="Your watchlist is empty"
            description="Add Forex pairs, commodities or crypto assets from the Markets page to follow them here."
            action={<ButtonLink to="/markets">Browse Markets</ButtonLink>}
          />
        )}
      </Card>
    </>
  )
}
