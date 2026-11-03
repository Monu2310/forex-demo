import { FlaskConical } from 'lucide-react'

export function DemoBadge({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-ink uppercase ${className}`}
    >
      <FlaskConical className="size-3.5 text-emerald" aria-hidden />
      {label}
    </span>
  )
}
