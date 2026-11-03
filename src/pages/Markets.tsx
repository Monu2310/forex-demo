import { SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { DemoBadge } from '../components/common/DemoBadge'
import { EmptyState } from '../components/common/EmptyState'
import { CategoryFilter, type CategoryFilterValue } from '../components/markets/CategoryFilter'
import { MarketList } from '../components/markets/MarketList'
import { PageHeader } from '../components/layout/PageHeader'
import { useQuotes } from '../context/PriceContext'
import { CATEGORY_LABELS, INSTRUMENTS, type MarketCategory } from '../data/mockMarkets'

const isCategory = (v: string | null): v is MarketCategory => v !== null && v in CATEGORY_LABELS

export default function Markets() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('category')
  const category: CategoryFilterValue = isCategory(raw) ? raw : 'all'
  const quotes = useQuotes()

  const filtered = useMemo(
    () => (category === 'all' ? quotes : quotes.filter((q) => q.instrument.category === category)),
    [quotes, category],
  )

  const counts = useMemo(() => {
    const c: Record<CategoryFilterValue, number> = { all: INSTRUMENTS.length, forex: 0, commodities: 0, crypto: 0 }
    for (const i of INSTRUMENTS) c[i.category]++
    return c
  }, [])

  const setCategory = (value: CategoryFilterValue) => {
    // push to history so browser back/forward restores the filter
    setParams(value === 'all' ? {} : { category: value })
  }

  return (
    <>
      <PageHeader
        title="Markets"
        description="Monitor Forex, Commodities and Crypto instruments in one place."
      >
        <DemoBadge label="Demo data — not live market prices" />
      </PageHeader>

      <div className="mb-4">
        <CategoryFilter value={category} onChange={setCategory} counts={counts} />
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-[15px] font-semibold text-ink">
            {category === 'all' ? 'All markets' : CATEGORY_LABELS[category]}
          </h2>
          <span className="text-[13px] text-muted">
            {filtered.length} instrument{filtered.length === 1 ? '' : 's'}
          </span>
        </div>
        {filtered.length ? (
          <MarketList quotes={filtered} />
        ) : (
          <EmptyState icon={SearchX} title="No instruments" description="No instruments match this category." />
        )}
      </Card>
    </>
  )
}
