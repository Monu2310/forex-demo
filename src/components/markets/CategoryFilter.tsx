import { CATEGORY_LABELS, type MarketCategory } from '../../data/mockMarkets'

export type CategoryFilterValue = 'all' | MarketCategory

const OPTIONS: { value: CategoryFilterValue; label: string }[] = [
  { value: 'all', label: 'All Markets' },
  ...(Object.keys(CATEGORY_LABELS) as MarketCategory[]).map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
]

interface CategoryFilterProps {
  value: CategoryFilterValue
  onChange: (value: CategoryFilterValue) => void
  counts: Record<CategoryFilterValue, number>
}

export function CategoryFilter({ value, onChange, counts }: CategoryFilterProps) {
  return (
    <div role="tablist" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {OPTIONS.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
              active
                ? 'border-emerald bg-emerald text-ivory'
                : 'border-line bg-white text-muted hover:border-muted/40 hover:text-ink'
            }`}
          >
            {o.label}
            <span
              className={`tabular rounded-md px-1.5 text-[11px] ${active ? 'bg-ivory/15 text-gold' : 'bg-ivory text-muted'}`}
            >
              {counts[o.value]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
