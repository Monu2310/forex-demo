import { Link } from 'react-router-dom'
import { AllocationBars } from '../components/charts/AllocationBars'
import { Card, CardHeader } from '../components/common/Card'
import { ChangeBadge } from '../components/common/ChangeBadge'
import { DemoBadge } from '../components/common/DemoBadge'
import { PageHeader } from '../components/layout/PageHeader'
import {
  HOLDINGS,
  holdingPnl,
  holdingValue,
  PORTFOLIO_COST,
  PORTFOLIO_DAY_CHANGE,
  PORTFOLIO_DAY_CHANGE_PCT,
  PORTFOLIO_PNL,
  PORTFOLIO_TOTAL,
} from '../data/mockPortfolio'
import { formatCurrency, formatPercent, formatPrice, formatQuantity, formatSignedCurrency } from '../utils/format'

function Pnl({ value }: { value: number }) {
  if (value === 0) return <span className="text-muted">—</span>
  return <span className={value > 0 ? 'text-up' : 'text-down'}>{formatSignedCurrency(value)}</span>
}

export default function Portfolio() {
  const invested = HOLDINGS.filter((h) => h.slug)
  const cash = HOLDINGS.find((h) => !h.slug)
  const pnlPct = (PORTFOLIO_PNL / (PORTFOLIO_COST - (cash ? holdingValue(cash) : 0))) * 100

  const stats = [
    { label: 'Total value', value: formatCurrency(PORTFOLIO_TOTAL) },
    {
      label: 'Today',
      value: formatSignedCurrency(PORTFOLIO_DAY_CHANGE),
      extra: <ChangeBadge value={PORTFOLIO_DAY_CHANGE_PCT} className="text-[12px]" />,
      tone: 'up' as const,
    },
    {
      label: 'Unrealised P/L',
      value: formatSignedCurrency(PORTFOLIO_PNL),
      extra: <ChangeBadge value={pnlPct} className="text-[12px]" />,
      tone: PORTFOLIO_PNL >= 0 ? ('up' as const) : ('down' as const),
    },
    { label: 'Cash balance', value: formatCurrency(cash ? holdingValue(cash) : 0) },
  ]

  return (
    <>
      <PageHeader title="Portfolio" description="An overview of your simulated holdings and allocation.">
        <DemoBadge label="Demo portfolio — simulated values" />
      </PageHeader>

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {stats.map((s, i) => (
              <div key={s.label} className={i > 0 ? 'lg:pl-6' : ''}>
                <p className="text-[13px] text-muted">{s.label}</p>
                <p
                  className={`tabular mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl ${
                    s.tone === 'up' ? 'text-up' : s.tone === 'down' ? 'text-down' : 'text-ink'
                  }`}
                >
                  {s.value}
                </p>
                {s.extra && <div className="mt-1">{s.extra}</div>}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
          <Card className="xl:col-span-2">
            <CardHeader title="Asset allocation" subtitle="Share of total portfolio value" />
            <AllocationBars
              total={PORTFOLIO_TOTAL}
              items={HOLDINGS.map((h) => ({ label: h.label, sublabel: h.symbol, value: holdingValue(h) }))}
            />
          </Card>

          <Card padded={false} className="overflow-hidden xl:col-span-3">
            <div className="px-5 pt-5 sm:px-6 sm:pt-6">
              <CardHeader title="Holdings" subtitle={`${invested.length} positions plus cash`} />
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-line bg-ivory/60 text-left text-[12px] text-muted">
                    <th className="px-6 py-2.5 font-medium">Asset</th>
                    <th className="px-4 py-2.5 text-right font-medium">Quantity</th>
                    <th className="px-4 py-2.5 text-right font-medium">Avg. price</th>
                    <th className="px-4 py-2.5 text-right font-medium">Value</th>
                    <th className="px-6 py-2.5 text-right font-medium">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {HOLDINGS.map((h) => (
                    <tr key={h.label}>
                      <td className="px-6 py-3.5">
                        {h.slug ? (
                          <Link to={`/markets/${h.slug}`} className="group">
                            <span className="block font-semibold text-ink group-hover:underline">{h.label}</span>
                            <span className="block text-[12px] text-muted">{h.symbol}</span>
                          </Link>
                        ) : (
                          <>
                            <span className="block font-semibold text-ink">{h.label}</span>
                            <span className="block text-[12px] text-muted">{h.symbol}</span>
                          </>
                        )}
                      </td>
                      <td className="tabular px-4 py-3.5 text-right text-ink">
                        {h.slug ? `${formatQuantity(h.quantity)} ${h.unit}` : '—'}
                      </td>
                      <td className="tabular px-4 py-3.5 text-right text-muted">
                        {h.slug ? formatPrice(h.avgCost, 2) : '—'}
                      </td>
                      <td className="tabular px-4 py-3.5 text-right font-medium text-ink">
                        {formatCurrency(holdingValue(h))}
                      </td>
                      <td className="tabular px-6 py-3.5 text-right font-medium">
                        <Pnl value={holdingPnl(h)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-line bg-ivory/60">
                    <td className="px-6 py-3 text-[13px] font-semibold text-ink" colSpan={3}>
                      Total
                    </td>
                    <td className="tabular px-4 py-3 text-right font-semibold text-ink">
                      {formatCurrency(PORTFOLIO_TOTAL)}
                    </td>
                    <td className="tabular px-6 py-3 text-right font-semibold">
                      <Pnl value={PORTFOLIO_PNL} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <ul className="divide-y divide-line border-t border-line md:hidden">
              {HOLDINGS.map((h) => (
                <li key={h.label} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{h.label}</p>
                      <p className="text-[12px] text-muted">
                        {h.slug ? `${formatQuantity(h.quantity)} ${h.unit} · avg ${formatPrice(h.avgCost, 2)}` : h.symbol}
                      </p>
                    </div>
                    <div className="tabular text-right text-sm">
                      <p className="font-semibold text-ink">{formatCurrency(holdingValue(h))}</p>
                      <p className="text-[12px] font-medium">
                        <Pnl value={holdingPnl(h)} />
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="border-t border-line px-5 py-3 text-[12px] text-muted sm:px-6">
              Values use fixed demo reference prices. Today’s change: {formatPercent(PORTFOLIO_DAY_CHANGE_PCT)}. No real
              trading, deposits or withdrawals are available in this demo.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
