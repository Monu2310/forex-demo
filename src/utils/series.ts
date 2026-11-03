import type { Instrument } from '../data/mockMarkets'

/**
 * Deterministic simulated price history.
 * The same instrument + range always produces the same shape, and every
 * series ends exactly at the current price so charts agree with headline values.
 */

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y'
export const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y']

export interface SeriesPoint {
  t: number
  price: number
}

const HOUR = 3_600_000
const DAY = 24 * HOUR

const RANGE_CONFIG: Record<TimeRange, { points: number; step: number; days: number }> = {
  '1D': { points: 49, step: 30 * 60_000, days: 1 },
  '1W': { points: 57, step: 3 * HOUR, days: 7 },
  '1M': { points: 61, step: 12 * HOUR, days: 30 },
  '3M': { points: 91, step: DAY, days: 90 },
  '1Y': { points: 53, step: 7 * DAY, days: 365 },
}

/** Approximate daily volatility per category, used to scale the walk. */
const DAILY_VOL: Record<Instrument['category'], number> = {
  forex: 0.0045,
  commodities: 0.011,
  crypto: 0.028,
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-9)
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** Price at the start of the 24h window implied by the reference 24h change. */
export function openPrice(instrument: Instrument): number {
  return instrument.basePrice / (1 + instrument.change24hPct / 100)
}

export function generateSeries(
  instrument: Instrument,
  range: TimeRange,
  currentPrice: number,
  anchor: number = Date.now(),
): SeriesPoint[] {
  const { points, step, days } = RANGE_CONFIG[range]
  const rand = mulberry32(hash(`${instrument.slug}:${range}`))
  const vol = DAILY_VOL[instrument.category]

  // Starting price for the window
  let start: number
  if (range === '1D') {
    start = openPrice(instrument)
  } else {
    const drift = gaussian(rand) * vol * Math.sqrt(days) * 0.9
    start = currentPrice * Math.exp(-drift)
  }

  // Brownian bridge between start and current price
  const walk: number[] = [0]
  for (let i = 1; i < points; i++) walk.push(walk[i - 1] + gaussian(rand))
  const last = walk[points - 1]
  const stepVol = (vol * Math.sqrt(days)) / Math.sqrt(points) * 1.15

  const logStart = Math.log(start)
  const logEnd = Math.log(currentPrice)
  const end = Math.floor(anchor / step) * step

  return walk.map((w, i) => {
    const f = i / (points - 1)
    const bridge = w - f * last
    const logP = logStart + f * (logEnd - logStart) + bridge * stepVol
    return { t: end - (points - 1 - i) * step, price: i === points - 1 ? currentPrice : Math.exp(logP) }
  })
}

export function seriesChangePct(series: SeriesPoint[]): number {
  if (series.length < 2) return 0
  const first = series[0].price
  return ((series[series.length - 1].price - first) / first) * 100
}

export function formatAxisTime(t: number, range: TimeRange): string {
  const d = new Date(t)
  if (range === '1D') return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (range === '1W') return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
  if (range === '1Y') return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatTooltipTime(t: number, range: TimeRange): string {
  const d = new Date(t)
  if (range === '1D' || range === '1W')
    return d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
