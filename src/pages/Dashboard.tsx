import { useEffect, useState } from 'react'
import { DemoBadge } from '../components/common/DemoBadge'
import { InstrumentChartCard } from '../components/dashboard/InstrumentChartCard'
import { MarketOverview } from '../components/dashboard/MarketOverview'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { WatchlistPreview } from '../components/dashboard/WatchlistPreview'
import { PageHeader } from '../components/layout/PageHeader'
import { useAuth } from '../context/AuthContext'
import { formatLongDate, greetingFor } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <>
      <PageHeader
        eyebrow={formatLongDate(now)}
        title={`${greetingFor(now)}, ${user?.firstName ?? 'Alex'}`}
        description="Here is an overview of your markets and simulated portfolio today."
      />

      <div className="space-y-4 sm:space-y-6">
        <SummaryCards />

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <InstrumentChartCard slug="xau-usd" title="Gold / USD" />
          </div>
          <WatchlistPreview />
        </div>

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <MarketOverview />
          </div>
          <RecentActivity />
        </div>

        <div className="flex justify-center pt-2">
          <DemoBadge label="Demo data — not live market prices" />
        </div>
      </div>
    </>
  )
}
