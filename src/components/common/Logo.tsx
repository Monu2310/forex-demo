/**
 * ELVERMONT logo.
 * If the original logo asset is placed at src/assets/elvermont-logo.(svg|png|webp),
 * it is used automatically (aspect ratio preserved). Otherwise a clean, temporary
 * text wordmark is shown — it is a placeholder, not the official logo.
 */

const logoModules = import.meta.glob<string>('../../assets/elvermont-logo.{svg,png,webp,jpg}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const LOGO_SRC: string | undefined = Object.values(logoModules)[0]

interface LogoProps {
  /** "light" = on emerald/dark background, "dark" = on ivory/white background */
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const HEIGHTS = { sm: 'h-6', md: 'h-8', lg: 'h-11' }
const TEXT = { sm: 'text-[1.15rem]', md: 'text-[1.45rem]', lg: 'text-[2.1rem]' }

export function Logo({ tone = 'light', size = 'md', className = '' }: LogoProps) {
  if (LOGO_SRC) {
    return (
      <img
        src={LOGO_SRC}
        alt="ELVERMONT"
        className={`${HEIGHTS[size]} w-auto object-contain ${className}`}
      />
    )
  }

  return (
    <span
      className={`inline-flex flex-col items-start leading-none select-none ${className}`}
      aria-label="ELVERMONT"
      title="Temporary wordmark — replace with the official ELVERMONT logo asset"
    >
      <span
        className={`font-serif font-semibold tracking-[0.22em] ${TEXT[size]} ${
          tone === 'light' ? 'text-ivory' : 'text-emerald'
        }`}
      >
        ELVERMONT
      </span>
      <span className="mt-1.5 h-px w-8 bg-gold" aria-hidden />
    </span>
  )
}
