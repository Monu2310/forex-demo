import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold-outline'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-emerald text-ivory hover:bg-surface-dark',
  secondary: 'border border-line bg-white text-ink hover:border-muted/40 hover:bg-ivory',
  ghost: 'text-muted hover:bg-ivory hover:text-ink',
  'gold-outline': 'border border-gold/70 bg-white text-ink hover:bg-gold/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-[15px]',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />
}

interface ButtonLinkProps extends LinkProps {
  variant?: Variant
  size?: Size
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />
}
