const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** $24,850.00 */
export function formatCurrency(value: number): string {
  return usd.format(value)
}

/** +$485.20 / −$12.40 */
export function formatSignedCurrency(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${usd.format(Math.abs(value))}`
}

/** Price with instrument-specific precision, e.g. 1.0862 or 67,420.50 */
export function formatPrice(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** +0.82% / −1.12% */
export function formatPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(digits)}%`
}

export function formatQuantity(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatRelativeTime(at: number, now = Date.now()): string {
  const diff = Math.max(0, now - at)
  const min = Math.round(diff / 60_000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min} min ago`
  const hours = Math.round(min / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}

export function greetingFor(date: Date): string {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
