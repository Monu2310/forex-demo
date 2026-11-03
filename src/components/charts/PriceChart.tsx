import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Instrument } from '../../data/mockMarkets'
import { formatPrice } from '../../utils/format'
import { formatAxisTime, formatTooltipTime, type SeriesPoint, type TimeRange } from '../../utils/series'

const EMERALD = '#0D3B2E'
const GOLD = '#DFBD3F'
const MUTED = '#738078'
const LINE = '#E5E9E5'

interface PriceChartProps {
  instrument: Instrument
  series: SeriesPoint[]
  range: TimeRange
  height?: number
}

interface TooltipPayload {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: SeriesPoint }>
}

export function PriceChart({ instrument, series, range, height = 300 }: PriceChartProps) {
  const [min, max] = useMemo(() => {
    let lo = Infinity
    let hi = -Infinity
    for (const p of series) {
      lo = Math.min(lo, p.price)
      hi = Math.max(hi, p.price)
    }
    const pad = (hi - lo) * 0.12 || hi * 0.001
    return [lo - pad, hi + pad]
  }, [series])

  const axisDecimals = Math.max(0, Math.min(instrument.decimals, max - min < 1 ? 4 : max - min < 20 ? 2 : 0))

  const renderTooltip = ({ active, payload }: TooltipPayload) => {
    const p = payload?.[0]?.payload
    if (!active || !p) return null
    return (
      <div className="rounded-lg border border-line bg-white px-3 py-2 shadow-pop">
        <div className="text-[11px] text-muted">{formatTooltipTime(p.t, range)}</div>
        <div className="tabular mt-0.5 text-sm font-semibold text-ink">
          {formatPrice(p.price, instrument.decimals)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ height }} className="w-full" role="img" aria-label={`${instrument.name} simulated price chart, ${range}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={LINE} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(t: number) => formatAxisTime(t, range)}
            tick={{ fill: MUTED, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: LINE }}
            minTickGap={40}
            tickMargin={8}
          />
          <YAxis
            orientation="right"
            domain={[min, max]}
            tickFormatter={(v: number) => formatPrice(v, axisDecimals)}
            tick={{ fill: MUTED, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={axisDecimals >= 4 ? 58 : 64}
            tickCount={5}
          />
          <Tooltip
            content={renderTooltip}
            cursor={{ stroke: MUTED, strokeWidth: 1, strokeDasharray: '3 3' }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={EMERALD}
            strokeWidth={2}
            fill={EMERALD}
            fillOpacity={0.05}
            dot={false}
            activeDot={{ r: 5, fill: GOLD, stroke: '#ffffff', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
