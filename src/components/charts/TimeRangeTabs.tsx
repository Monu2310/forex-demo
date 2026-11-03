import { TIME_RANGES, type TimeRange } from '../../utils/series'

interface TimeRangeTabsProps {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

export function TimeRangeTabs({ value, onChange }: TimeRangeTabsProps) {
  return (
    <div role="tablist" aria-label="Chart time range" className="inline-flex rounded-xl border border-line bg-ivory p-1">
      {TIME_RANGES.map((r) => {
        const active = r === value
        return (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r)}
            className={`relative h-8 min-w-10 rounded-lg px-2.5 text-[12px] font-semibold transition-colors ${
              active ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink'
            }`}
          >
            {r}
            {active && (
              <span className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-gold" aria-hidden />
            )}
          </button>
        )
      })}
    </div>
  )
}
