import { CATEGORY_LABELS, type MarketCategory } from '../../data/mockMarkets'

export function CategoryTag({ category }: { category: MarketCategory }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-ivory px-2 py-0.5 text-[12px] font-medium text-muted">
      {CATEGORY_LABELS[category]}
    </span>
  )
}
