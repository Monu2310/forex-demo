/**
 * Central mock market data for the ELVERMONT demo.
 * All prices are FICTIONAL reference values — not live market data.
 * Update instruments and prices here; every page reads from this file
 * (via PriceContext for the gently simulated "current" price).
 */

export type MarketCategory = 'forex' | 'commodities' | 'crypto'

export type MarketStatus = 'Open' | '24/7' | 'Closed'

export interface InstrumentInfo {
  venue: string
  tradingHours: string
  tickSize: string
  baseAsset: string
  quoteAsset: string
  contractUnit: string
}

export interface Instrument {
  /** URL-safe identifier used in /markets/:symbol */
  slug: string
  /** Display symbol, e.g. EUR/USD */
  symbol: string
  name: string
  category: MarketCategory
  /** Reference "last" price at the start of the demo session */
  basePrice: number
  /** Reference 24h change in percent at the start of the demo session */
  change24hPct: number
  /** Decimal places used when displaying the price */
  decimals: number
  status: MarketStatus
  description: string
  info: InstrumentInfo
}

export const CATEGORY_LABELS: Record<MarketCategory, string> = {
  forex: 'Forex',
  commodities: 'Commodities',
  crypto: 'Crypto',
}

const fxInfo = (base: string, quote: string, tick = '0.00001'): InstrumentInfo => ({
  venue: 'Interbank OTC',
  tradingHours: 'Sun 22:00 – Fri 22:00 UTC',
  tickSize: tick,
  baseAsset: base,
  quoteAsset: quote,
  contractUnit: `1 ${base}`,
})

const cryptoInfo = (base: string, tick: string): InstrumentInfo => ({
  venue: 'Aggregated spot',
  tradingHours: '24 hours, 7 days',
  tickSize: tick,
  baseAsset: base,
  quoteAsset: 'USD',
  contractUnit: `1 ${base}`,
})

export const INSTRUMENTS: Instrument[] = [
  // ── Forex ──────────────────────────────────────────────
  {
    slug: 'eur-usd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    basePrice: 1.0862,
    change24hPct: 0.24,
    decimals: 4,
    status: 'Open',
    description:
      'The most traded currency pair globally, reflecting the relative strength of the euro area and United States economies.',
    info: fxInfo('EUR', 'USD'),
  },
  {
    slug: 'gbp-usd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    basePrice: 1.2718,
    change24hPct: 0.12,
    decimals: 4,
    status: 'Open',
    description:
      'Known as "Cable", this pair tracks sterling against the US dollar and is sensitive to UK and US monetary policy.',
    info: fxInfo('GBP', 'USD'),
  },
  {
    slug: 'usd-jpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    basePrice: 151.42,
    change24hPct: -0.31,
    decimals: 2,
    status: 'Open',
    description:
      'A major Asia-session pair, closely linked to the interest-rate differential between the US and Japan.',
    info: fxInfo('USD', 'JPY', '0.001'),
  },
  {
    slug: 'usd-chf',
    symbol: 'USD/CHF',
    name: 'US Dollar / Swiss Franc',
    category: 'forex',
    basePrice: 0.8846,
    change24hPct: -0.08,
    decimals: 4,
    status: 'Open',
    description:
      'Pairs the US dollar with the Swiss franc, a currency traditionally viewed as a defensive asset.',
    info: fxInfo('USD', 'CHF'),
  },
  {
    slug: 'aud-usd',
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'forex',
    basePrice: 0.6584,
    change24hPct: 0.41,
    decimals: 4,
    status: 'Open',
    description:
      'A commodity-linked currency pair influenced by Australian exports and broader Asia-Pacific growth.',
    info: fxInfo('AUD', 'USD'),
  },
  {
    slug: 'usd-cad',
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    category: 'forex',
    basePrice: 1.3672,
    change24hPct: -0.15,
    decimals: 4,
    status: 'Open',
    description:
      'Nicknamed the "Loonie", this pair often moves with crude oil prices given Canada’s energy exports.',
    info: fxInfo('USD', 'CAD'),
  },

  // ── Commodities ────────────────────────────────────────
  {
    slug: 'xau-usd',
    symbol: 'XAU/USD',
    name: 'Gold',
    category: 'commodities',
    basePrice: 2385.4,
    change24hPct: 0.82,
    decimals: 2,
    status: 'Open',
    description:
      'Spot gold priced in US dollars per troy ounce — a long-standing store of value and portfolio diversifier.',
    info: {
      venue: 'London OTC / COMEX reference',
      tradingHours: 'Sun 23:00 – Fri 22:00 UTC',
      tickSize: '0.01',
      baseAsset: 'XAU',
      quoteAsset: 'USD',
      contractUnit: '1 troy ounce',
    },
  },
  {
    slug: 'wti',
    symbol: 'WTI',
    name: 'WTI Crude Oil',
    category: 'commodities',
    basePrice: 78.64,
    change24hPct: -1.12,
    decimals: 2,
    status: 'Open',
    description:
      'West Texas Intermediate, the principal US crude oil benchmark, priced in US dollars per barrel.',
    info: {
      venue: 'NYMEX reference',
      tradingHours: 'Sun 23:00 – Fri 22:00 UTC',
      tickSize: '0.01',
      baseAsset: 'WTI',
      quoteAsset: 'USD',
      contractUnit: '1 barrel',
    },
  },
  {
    slug: 'brent',
    symbol: 'BRENT',
    name: 'Brent Crude Oil',
    category: 'commodities',
    basePrice: 82.91,
    change24hPct: -0.86,
    decimals: 2,
    status: 'Open',
    description:
      'The international crude oil benchmark sourced from the North Sea, priced in US dollars per barrel.',
    info: {
      venue: 'ICE reference',
      tradingHours: 'Mon 00:00 – Fri 22:00 UTC',
      tickSize: '0.01',
      baseAsset: 'BRENT',
      quoteAsset: 'USD',
      contractUnit: '1 barrel',
    },
  },

  // ── Crypto ─────────────────────────────────────────────
  {
    slug: 'btc-usd',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    basePrice: 67420.5,
    change24hPct: 2.14,
    decimals: 2,
    status: '24/7',
    description:
      'The original and largest cryptocurrency by market capitalisation, with a fixed maximum supply of 21 million coins.',
    info: cryptoInfo('BTC', '0.01'),
  },
  {
    slug: 'eth-usd',
    symbol: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    basePrice: 3482.75,
    change24hPct: 1.67,
    decimals: 2,
    status: '24/7',
    description:
      'The native asset of the Ethereum network, a programmable blockchain supporting smart contracts and decentralised applications.',
    info: cryptoInfo('ETH', '0.01'),
  },
  {
    slug: 'sol-usd',
    symbol: 'SOL/USD',
    name: 'Solana',
    category: 'crypto',
    basePrice: 158.32,
    change24hPct: 3.48,
    decimals: 2,
    status: '24/7',
    description:
      'The native asset of the Solana network, a high-throughput blockchain designed for fast, low-cost transactions.',
    info: cryptoInfo('SOL', '0.01'),
  },
  {
    slug: 'xrp-usd',
    symbol: 'XRP/USD',
    name: 'XRP',
    category: 'crypto',
    basePrice: 0.5824,
    change24hPct: -0.92,
    decimals: 4,
    status: '24/7',
    description:
      'The native asset of the XRP Ledger, designed with a focus on cross-border payments and settlement.',
    info: cryptoInfo('XRP', '0.0001'),
  },
]

const BY_SLUG = new Map(INSTRUMENTS.map((i) => [i.slug, i]))

export function getInstrument(slug: string | undefined): Instrument | undefined {
  return slug ? BY_SLUG.get(slug.toLowerCase()) : undefined
}

/** Default demo watchlist (12 instruments). The first five appear in the dashboard preview. */
export const DEFAULT_WATCHLIST: string[] = [
  'xau-usd',
  'eur-usd',
  'gbp-usd',
  'btc-usd',
  'eth-usd',
  'usd-jpy',
  'usd-chf',
  'aud-usd',
  'usd-cad',
  'wti',
  'brent',
  'xrp-usd',
]

/** Instruments shown in the dashboard "Market overview" table. */
export const OVERVIEW_SLUGS = ['xau-usd', 'eur-usd', 'btc-usd', 'wti', 'usd-jpy', 'eth-usd']

/** Summary figure: trading sessions & venues currently open (static demo value). */
export const MARKETS_OPEN = 18
