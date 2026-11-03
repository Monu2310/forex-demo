import { formatCurrency } from '../../utils/format'

export interface AllocationItem {
  label: string
  sublabel?: string
  value: number
}

/**
 * Horizontal allocation chart. A single emerald fill encodes magnitude;
 * each row is directly labelled, so identity never depends on colour.
 */
export function AllocationBars({ items, total }: { items: AllocationItem[]; total: number }) {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  return (
    <ul className="space-y-4" aria-label="Asset allocation">
      {sorted.map((item) => {
        const pct = (item.value / total) * 100
        return (
          <li key={item.label} className="group" title={`${item.label}: ${formatCurrency(item.value)} (${pct.toFixed(1)}%)`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">
                <span className="font-medium text-ink">{item.label}</span>
                {item.sublabel && <span className="ml-2 text-[12px] text-muted">{item.sublabel}</span>}
              </span>
              <span className="tabular shrink-0 text-ink">
                <span className="font-semibold">{pct.toFixed(1)}%</span>
                <span className="ml-2 text-[12px] text-muted">{formatCurrency(item.value)}</span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-ivory">
              <div
                className="h-2 rounded-full bg-emerald transition-[width] group-hover:bg-surface-dark"
                style={{ width: `${Math.max(1.5, pct)}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
