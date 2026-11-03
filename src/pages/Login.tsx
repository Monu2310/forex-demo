import { AlertCircle, ArrowRight, Eye, EyeOff, Info, Lock, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Logo } from '../components/common/Logo'
import { useActivity } from '../context/ActivityContext'
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const { notify } = useToast()
  const { log } = useActivity()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email address and password.')
      setShakeKey((k) => k + 1)
      return
    }
    setSubmitting(true)
    // brief, deliberate delay so the interaction feels considered
    window.setTimeout(() => {
      const ok = login(email, password, remember)
      setSubmitting(false)
      if (!ok) {
        setError('The email or password you entered is incorrect. Please use the demo credentials below.')
        setShakeKey((k) => k + 1)
        return
      }
      log('login', 'Signed in to the demo workspace')
      notify('Welcome back, Alex. You are viewing simulated demo data.')
      // PublicOnlyRoute also redirects once the session exists; navigate explicitly for clarity
      navigate(from && from !== '/login' ? from : '/dashboard', { replace: true })
    }, 450)
  }

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setError(null)
  }

  return (
    <div className="flex min-h-dvh bg-ivory">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-[640px] flex-col justify-between overflow-hidden bg-emerald p-12 text-ivory lg:flex">
        <BrandMotif />
        <div className="relative">
          <Logo tone="light" size="lg" />
        </div>
        <div className="relative max-w-md">
          <p className="mb-4 text-[12px] font-medium tracking-[0.2em] text-gold uppercase">Market monitoring</p>
          <h2 className="font-serif text-[44px] leading-[1.08] font-medium">
            Clarity across the world’s markets.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ivory/70">
            Follow Forex, Commodities and Crypto from a single, considered workspace — designed for focus, not noise.
          </p>
          <ul className="mt-8 flex gap-6 text-sm text-ivory/80">
            {['Forex', 'Commodities', 'Crypto'].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12px] text-ivory/45">© {new Date().getFullYear()} ELVERMONT · Demonstration environment</p>
      </aside>

      {/* Form */}
      <main className="flex flex-1 flex-col">
        <div className="flex h-16 items-center bg-emerald px-5 lg:hidden">
          <Logo tone="light" size="sm" />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h1 className="text-[28px] font-semibold tracking-tight text-ink">Welcome back</h1>
              <p className="mt-2 text-[15px] text-muted">Sign in to your ELVERMONT workspace.</p>
            </div>

            <form key={shakeKey} onSubmit={onSubmit} noValidate className={shakeKey ? 'animate-shake' : ''}>
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl border border-down/25 bg-down/5 px-3.5 py-3 text-[13px] text-ink"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-down" aria-hidden />
                  <span>{error}</span>
                </div>
              )}

              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-ink">
                Email address
              </label>
              <div className="relative mb-4">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(error)}
                  className="h-12 w-full rounded-xl border border-line bg-white pr-3 pl-10 text-[15px] text-ink transition-colors outline-none placeholder:text-muted/70 focus:border-emerald/50"
                />
              </div>

              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-[13px] font-medium text-ink">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => notify('Password recovery is not available in this demo.', 'info')}
                  className="text-[13px] font-medium text-emerald underline-offset-4 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mb-4">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(error)}
                  className="h-12 w-full rounded-xl border border-line bg-white pr-12 pl-10 text-[15px] text-ink transition-colors outline-none placeholder:text-muted/70 focus:border-emerald/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-ivory hover:text-ink"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              <label className="mb-6 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-line accent-emerald"
                />
                Remember me
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
                {!submitting && <ArrowRight className="size-4" aria-hidden />}
              </Button>
            </form>

            <div className="mt-8 rounded-xl border border-gold/50 bg-white p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="font-semibold text-ink">Demo mode</p>
                  <p className="mt-1 text-muted">
                    This is a presentation build with simulated authentication and data. Use:
                  </p>
                  <dl className="tabular mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ink">
                    <dt className="text-muted">Email</dt>
                    <dd className="truncate font-medium">{DEMO_CREDENTIALS.email}</dd>
                    <dt className="text-muted">Password</dt>
                    <dd className="font-medium">{DEMO_CREDENTIALS.password}</dd>
                  </dl>
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="mt-3 text-[13px] font-semibold text-emerald underline-offset-4 hover:underline"
                  >
                    Use demo credentials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/** Thin gold line motif evoking a price contour — decorative only. */
function BrandMotif() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-24 h-64 w-full opacity-[0.22]"
      viewBox="0 0 600 240"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 190 C 60 180, 90 150, 140 158 S 220 120, 270 128 S 350 70, 400 86 S 480 40, 530 52 S 580 30, 600 26"
        fill="none"
        stroke="#DFBD3F"
        strokeWidth="1.5"
      />
      <path
        d="M0 215 C 70 210, 110 190, 160 196 S 250 168, 300 172 S 380 130, 430 140 S 510 104, 560 110 S 590 96, 600 92"
        fill="none"
        stroke="#DFBD3F"
        strokeWidth="1"
        opacity="0.55"
      />
      <line x1="0" y1="239" x2="600" y2="239" stroke="#DFBD3F" strokeWidth="0.75" opacity="0.4" />
    </svg>
  )
}
