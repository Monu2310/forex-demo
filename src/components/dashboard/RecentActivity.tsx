import { Eye, LogIn, SlidersHorizontal, Star, StarOff, type LucideIcon } from 'lucide-react'
import { useActivity } from '../../context/ActivityContext'
import type { ActivityKind } from '../../data/mockActivity'
import { formatRelativeTime } from '../../utils/format'
import { Card, CardHeader } from '../common/Card'

const ICONS: Record<ActivityKind, LucideIcon> = {
  'watchlist-add': Star,
  'watchlist-remove': StarOff,
  view: Eye,
  settings: SlidersHorizontal,
  login: LogIn,
}

export function RecentActivity({ limit = 5 }: { limit?: number }) {
  const { activities } = useActivity()
  const items = activities.slice(0, limit)

  return (
    <Card className="h-full">
      <CardHeader
        title="Recent activity"
        subtitle="Workspace events"
        action={
          <span className="rounded-md bg-ivory px-2 py-1 text-[11px] font-medium tracking-wide text-muted uppercase">
            Demo activity
          </span>
        }
      />
      <ol className="relative space-y-4">
        {items.map((a, idx) => {
          const Icon = ICONS[a.kind]
          return (
            <li key={a.id} className="relative flex gap-3">
              {idx < items.length - 1 && (
                <span className="absolute top-9 bottom-[-12px] left-4 w-px bg-line" aria-hidden />
              )}
              <span
                className={`relative flex size-8 shrink-0 items-center justify-center rounded-full border ${
                  idx === 0 ? 'border-gold/60 bg-gold/10 text-emerald' : 'border-line bg-ivory text-muted'
                }`}
              >
                <Icon className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-sm text-ink">{a.message}</p>
                <p className="mt-0.5 text-[12px] text-muted">{formatRelativeTime(a.at)}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
