import type { MarketStatus } from '../../data/mockMarkets'

export function StatusDot({ status }: { status: MarketStatus }) {
  const open = status !== 'Closed'
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink">
      <span className={`size-1.5 rounded-full ${open ? 'bg-up' : 'bg-muted'}`} aria-hidden />
      {status}
    </span>
  )
}
