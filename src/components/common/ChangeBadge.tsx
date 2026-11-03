import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatPercent, formatSignedCurrency } from '../../utils/format'

interface ChangeBadgeProps {
  /** Percent change */
  value: number
  /** Optional absolute USD change shown before the percentage */
  amount?: number
  variant?: 'text' | 'pill'
  className?: string
}

/** Positive/negative indicator — colour is always paired with an arrow and a sign. */
export function ChangeBadge({ value, amount, variant = 'text', className = '' }: ChangeBadgeProps) {
  const dir = value > 0.0005 ? 'up' : value < -0.0005 ? 'down' : 'flat'
  const Icon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus
  const tone = dir === 'up' ? 'text-up' : dir === 'down' ? 'text-down' : 'text-muted'
  const pill =
    variant === 'pill'
      ? `rounded-full px-2 py-0.5 ${dir === 'up' ? 'bg-up/10' : dir === 'down' ? 'bg-down/10' : 'bg-line'}`
      : ''
  return (
    <span className={`tabular inline-flex items-center gap-0.5 text-[13px] font-medium ${tone} ${pill} ${className}`}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {amount !== undefined && <span className="mr-1">{formatSignedCurrency(amount)}</span>}
      <span>{formatPercent(value)}</span>
      <span className="sr-only">{dir === 'up' ? 'increase' : dir === 'down' ? 'decrease' : 'unchanged'}</span>
    </span>
  )
}
