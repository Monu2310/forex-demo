import type { Instrument } from '../../data/mockMarkets'

/** Monogram avatar for an instrument (brand-neutral, no third-party logos). */
export function InstrumentIcon({ instrument, size = 'md' }: { instrument: Instrument; size?: 'sm' | 'md' | 'lg' }) {
  const text = instrument.symbol.split('/')[0].slice(0, 3)
  const dims = size === 'sm' ? 'size-8 text-[10px]' : size === 'lg' ? 'size-12 text-[13px]' : 'size-10 text-[11px]'
  const highlighted = instrument.slug === 'xau-usd'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide ${dims} ${
        highlighted ? 'bg-emerald text-gold' : 'border border-line bg-ivory text-emerald'
      }`}
      aria-hidden
    >
      {text}
    </span>
  )
}
