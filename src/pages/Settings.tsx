import { Check, LogOut, Moon, RotateCcw, Sun, Monitor } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card, CardHeader } from '../components/common/Card'
import { Toggle } from '../components/common/Toggle'
import { PageHeader } from '../components/layout/PageHeader'
import { useActivity } from '../context/ActivityContext'
import { useAuth } from '../context/AuthContext'
import { usePreferences, type Preferences } from '../context/PreferencesContext'
import { useToast } from '../context/ToastContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useLogout } from '../hooks/useLogout'

const NOTIFICATION_OPTIONS: { key: keyof Preferences; label: string; description: string }[] = [
  { key: 'priceAlerts', label: 'Price alerts', description: 'Notify me when watchlist instruments move significantly.' },
  { key: 'weeklySummary', label: 'Weekly summary', description: 'A short weekly recap of markets and portfolio.' },
  { key: 'productUpdates', label: 'Product updates', description: 'News about new ELVERMONT features.' },
]

export default function Settings() {
  const { user } = useAuth()
  const { preferences, setPreference, reset: resetPrefs } = usePreferences()
  const { reset: resetWatchlist } = useWatchlist()
  const { reset: resetActivity, log } = useActivity()
  const { notify } = useToast()
  const logout = useLogout()

  if (!user) return null

  const profile: [string, string][] = [
    ['Full name', user.name],
    ['Email', user.email],
    ['Account type', 'Demo account'],
    ['Base currency', 'USD'],
    ['Time zone', Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')],
  ]

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and demo preferences." />

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
          <Card>
            <CardHeader title="Profile" subtitle="Information associated with this demo account" />
            <div className="mb-5 flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald text-lg font-semibold text-gold">
                {user.initials}
              </span>
              <div>
                <p className="text-base font-semibold text-ink">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
                <span className="mt-1.5 inline-block rounded-md border border-gold/60 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink uppercase">
                  Demo account
                </span>
              </div>
            </div>
            <dl className="divide-y divide-line border-t border-line">
              {profile.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium break-all text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Notifications" subtitle="Saved locally on this device" />
            <div className="divide-y divide-line border-t border-line">
              {NOTIFICATION_OPTIONS.map((o) => (
                <Toggle
                  key={o.key}
                  label={o.label}
                  description={o.description}
                  checked={preferences[o.key]}
                  onChange={(v) => {
                    setPreference(o.key, v)
                    log('settings', `${v ? 'Enabled' : 'Disabled'} ${o.label.toLowerCase()}`)
                    notify(`${o.label} ${v ? 'enabled' : 'disabled'}`)
                  }}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader title="Appearance" subtitle="Light theme only in this demo" />
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
              {[
                { label: 'Light', icon: Sun, active: true },
                { label: 'Dark', icon: Moon, active: false },
                { label: 'System', icon: Monitor, active: false },
              ].map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={!active}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[13px] font-medium ${
                    active ? 'border-emerald bg-white text-ink' : 'cursor-not-allowed border-line bg-ivory text-muted/70'
                  }`}
                >
                  <Icon className={`size-5 ${active ? 'text-emerald' : ''}`} aria-hidden />
                  {label}
                  {active && (
                    <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-gold">
                      <Check className="size-3 text-emerald" aria-hidden />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Demo data" subtitle="Restore the original presentation state" />
            <p className="mb-4 text-[13px] text-muted">
              Resets the watchlist, activity feed and notification preferences stored in this browser.
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                resetWatchlist()
                resetActivity()
                resetPrefs()
                notify('Demo data has been reset.')
              }}
            >
              <RotateCcw className="size-4" aria-hidden /> Reset demo data
            </Button>
          </Card>

          <Card>
            <CardHeader title="Session" subtitle="Simulated sign-in — not production authentication" />
            <Button className="w-full" onClick={logout}>
              <LogOut className="size-4" aria-hidden /> Logout
            </Button>
          </Card>
        </div>
      </div>
    </>
  )
}
