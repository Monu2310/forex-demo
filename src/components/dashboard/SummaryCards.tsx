import { Activity, Globe2, Star, Wallet, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../../context/WatchlistContext'
import { MARKETS_OPEN } from '../../data/mockMarkets'
import { PORTFOLIO_DAY_CHANGE, PORTFOLIO_DAY_CHANGE_PCT, PORTFOLIO_TOTAL } from '../../data/mockPortfolio'
import { formatCurrency, formatPercent, formatSignedCurrency } from '../../utils/format'

interface SummaryItem {
  label: string
  value: string
  note: string
  icon: LucideIcon
  to: string
  tone?: 'up'
}

export function SummaryCards() {
  const { slugs } = useWatchlist()

  const items: SummaryItem[] = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(PORTFOLIO_TOTAL),
      note: 'Simulated holdings',
      icon: Wallet,
      to: '/portfolio',
    },
    {
      label: 'Daily Change',
      value: formatSignedCurrency(PORTFOLIO_DAY_CHANGE),
      note: `${formatPercent(PORTFOLIO_DAY_CHANGE_PCT)} today`,
      icon: Activity,
      to: '/portfolio',
      tone: 'up',
    },
    {
      label: 'Watchlist Assets',
      value: String(slugs.length),
      note: 'Instruments followed',
      icon: Star,
      to: '/watchlist',
    },
    {
      label: 'Markets Open',
      value: String(MARKETS_OPEN),
      note: 'Trading sessions & venues',
      icon: Globe2,
      to: '/markets',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {items.map(({ label, value, note, icon: Icon, to, tone }) => (
        <Link
          key={label}
          to={to}
          className="group rounded-2xl border border-line bg-white p-4 shadow-card transition-colors hover:border-muted/30 sm:p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] font-medium text-muted sm:text-[13px]">{label}</p>
            <span className="hidden size-8 items-center justify-center rounded-lg bg-ivory text-emerald transition-colors group-hover:text-gold sm:flex">
              <Icon className="size-4" aria-hidden />
            </span>
          </div>
          <p
            className={`tabular mt-2 text-xl font-semibold tracking-tight sm:mt-3 sm:text-[26px] ${
              tone === 'up' ? 'text-up' : 'text-ink'
            }`}
          >
            {value}
          </p>
          <p className="mt-1 text-[12px] text-muted">{note}</p>
        </Link>
      ))}
    </div>
  )
}
