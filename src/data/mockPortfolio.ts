/**
 * DEMO PORTFOLIO — SIMULATED VALUES.
 * A fixed snapshot so headline figures stay consistent throughout the presentation.
 * No real holdings, trades or balances are represented.
 */

export interface Holding {
  /** Instrument slug (from mockMarkets), or null for the cash line */
  slug: string | null
  label: string
  symbol: string
  quantity: number
  unit: string
  /** Snapshot price used for valuation */
  price: number
  /** Average entry price (fictional) */
  avgCost: number
  /** Today's change in USD for this line (fictional) */
  dayChange: number
}

export const HOLDINGS: Holding[] = [
  {
    slug: 'xau-usd',
    label: 'Gold',
    symbol: 'XAU/USD',
    quantity: 4.2,
    unit: 'oz',
    price: 2385.4,
    avgCost: 2148.0,
    dayChange: 118.4,
  },
  {
    slug: 'btc-usd',
    label: 'Bitcoin',
    symbol: 'BTC/USD',
    quantity: 0.105,
    unit: 'BTC',
    price: 67420.5,
    avgCost: 58900.0,
    dayChange: 196.85,
  },
  {
    slug: 'eth-usd',
    label: 'Ethereum',
    symbol: 'ETH/USD',
    quantity: 1.25,
    unit: 'ETH',
    price: 3482.75,
    avgCost: 3710.0,
    dayChange: 102.3,
  },
  {
    slug: 'sol-usd',
    label: 'Solana',
    symbol: 'SOL/USD',
    quantity: 12,
    unit: 'SOL',
    price: 158.32,
    avgCost: 131.5,
    dayChange: 67.65,
  },
  {
    slug: null,
    label: 'Cash',
    symbol: 'USD',
    quantity: 1498.89,
    unit: 'USD',
    price: 1,
    avgCost: 1,
    dayChange: 0,
  },
]

export const holdingValue = (h: Holding) => round2(h.quantity * h.price)
export const holdingPnl = (h: Holding) => round2((h.price - h.avgCost) * h.quantity)

/** Total portfolio value — $24,850.00 */
export const PORTFOLIO_TOTAL = round2(HOLDINGS.reduce((s, h) => s + holdingValue(h), 0))
/** Today's change — +$485.20 */
export const PORTFOLIO_DAY_CHANGE = round2(HOLDINGS.reduce((s, h) => s + h.dayChange, 0))
export const PORTFOLIO_DAY_CHANGE_PCT =
  (PORTFOLIO_DAY_CHANGE / (PORTFOLIO_TOTAL - PORTFOLIO_DAY_CHANGE)) * 100
/** Unrealised profit / loss across all positions */
export const PORTFOLIO_PNL = round2(HOLDINGS.reduce((s, h) => s + holdingPnl(h), 0))
export const PORTFOLIO_COST = round2(HOLDINGS.reduce((s, h) => s + h.avgCost * h.quantity, 0))

function round2(n: number) {
  return Math.round(n * 100) / 100
}
