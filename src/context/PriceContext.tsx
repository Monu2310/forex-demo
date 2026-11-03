import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getInstrument, INSTRUMENTS, type Instrument } from '../data/mockMarkets'
import { openPrice } from '../utils/series'

/**
 * One shared source of simulated prices. Every few seconds each price is
 * nudged by a tiny amount (bounded near its reference value), so all pages
 * always show the same, subtly moving, DEMO price for an instrument.
 */

const TICK_MS = 5000
const MAX_STEP = 0.0003 // ±0.03% per tick
const MAX_BAND = 0.004 // stay within ±0.4% of reference

type PriceMap = Record<string, number>

const initialPrices = (): PriceMap =>
  Object.fromEntries(INSTRUMENTS.map((i) => [i.slug, i.basePrice]))

const PriceContext = createContext<PriceMap | null>(null)

export function PriceProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<PriceMap>(initialPrices)

  useEffect(() => {
    const id = window.setInterval(() => {
      setPrices((prev) => {
        const next: PriceMap = {}
        for (const inst of INSTRUMENTS) {
          const current = prev[inst.slug] ?? inst.basePrice
          // slight pull back toward the reference price keeps values stable
          const pull = ((inst.basePrice - current) / inst.basePrice) * 0.15
          const step = (Math.random() * 2 - 1) * MAX_STEP + pull
          const candidate = current * (1 + step)
          const lo = inst.basePrice * (1 - MAX_BAND)
          const hi = inst.basePrice * (1 + MAX_BAND)
          next[inst.slug] = Math.min(hi, Math.max(lo, candidate))
        }
        return next
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  return <PriceContext.Provider value={prices}>{children}</PriceContext.Provider>
}

export interface Quote {
  instrument: Instrument
  price: number
  change: number
  changePct: number
  open: number
  dayLow: number
  dayHigh: number
}

function buildQuote(instrument: Instrument, price: number): Quote {
  const open = openPrice(instrument)
  const change = price - open
  const spread = Math.abs(instrument.change24hPct) / 100 + 0.004
  return {
    instrument,
    price,
    change,
    changePct: (change / open) * 100,
    open,
    dayLow: Math.min(open, price) * (1 - spread * 0.35),
    dayHigh: Math.max(open, price) * (1 + spread * 0.25),
  }
}

function usePrices() {
  const ctx = useContext(PriceContext)
  if (!ctx) throw new Error('usePrices must be used within PriceProvider')
  return ctx
}

export function useQuote(slug: string | undefined): Quote | undefined {
  const prices = usePrices()
  const instrument = getInstrument(slug)
  const price = instrument ? prices[instrument.slug] : undefined
  return useMemo(
    () => (instrument && price !== undefined ? buildQuote(instrument, price) : undefined),
    [instrument, price],
  )
}

export function useQuotes(slugs?: string[]): Quote[] {
  const prices = usePrices()
  return useMemo(() => {
    const list = slugs
      ? slugs.map((s) => getInstrument(s)).filter((i): i is Instrument => Boolean(i))
      : INSTRUMENTS
    return list.map((i) => buildQuote(i, prices[i.slug]))
  }, [prices, slugs])
}
