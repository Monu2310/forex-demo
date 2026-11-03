import { useMemo } from 'react'
import type { Quote } from '../context/PriceContext'
import { generateSeries, type TimeRange } from '../utils/series'

/** Deterministic simulated history for a quote, always ending at its current price. */
export function useSeries(quote: Quote | undefined, range: TimeRange) {
  const instrument = quote?.instrument
  const price = quote?.price
  return useMemo(
    () => (instrument && price !== undefined ? generateSeries(instrument, range, price) : []),
    [instrument, range, price],
  )
}
