import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import type { SeriesPoint } from '../../utils/series'

/** Tiny trend line (decorative; values are shown alongside as text). */
export function Sparkline({ series, className = '' }: { series: SeriesPoint[]; className?: string }) {
  return (
    <div className={`h-9 w-24 ${className}`} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0D3B2E"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
