/** Demo activity feed entries — illustrative only, not financial transactions. */

export type ActivityKind = 'watchlist-add' | 'watchlist-remove' | 'view' | 'settings' | 'login'

export interface Activity {
  id: string
  kind: ActivityKind
  message: string
  /** epoch ms */
  at: number
}

const MIN = 60_000
const HOUR = 60 * MIN

/** Seeded entries, timestamped relative to when the demo is opened. */
export function seedActivity(now = Date.now()): Activity[] {
  return [
    { id: 'seed-1', kind: 'watchlist-add', message: 'Added XAU/USD to watchlist', at: now - 18 * MIN },
    { id: 'seed-2', kind: 'view', message: 'Viewed BTC/USD market', at: now - 2 * HOUR },
    { id: 'seed-3', kind: 'settings', message: 'Updated portfolio preferences', at: now - 5 * HOUR },
    { id: 'seed-4', kind: 'watchlist-add', message: 'Added ETH/USD to watchlist', at: now - 26 * HOUR },
  ]
}

export interface DemoNotification {
  id: string
  title: string
  body: string
  minutesAgo: number
}

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'n1',
    title: 'Gold moved above 2,380',
    body: 'XAU/USD crossed your demo price level.',
    minutesAgo: 12,
  },
  {
    id: 'n2',
    title: 'Weekly summary ready',
    body: 'Your simulated portfolio summary is available.',
    minutesAgo: 95,
  },
  {
    id: 'n3',
    title: 'BTC/USD volatility',
    body: 'Bitcoin is up more than 2% in the last 24 hours.',
    minutesAgo: 240,
  },
]
