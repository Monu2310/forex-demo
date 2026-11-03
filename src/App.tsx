import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ActivityProvider } from './context/ActivityContext'
import { AuthProvider } from './context/AuthContext'
import { PreferencesProvider } from './context/PreferencesContext'
import { PriceProvider } from './context/PriceContext'
import { ToastProvider } from './context/ToastContext'
import { WatchlistProvider } from './context/WatchlistContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import MarketDetails from './pages/MarketDetails'
import Markets from './pages/Markets'
import NotFound from './pages/NotFound'
import Portfolio from './pages/Portfolio'
import Settings from './pages/Settings'
import Watchlist from './pages/Watchlist'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PriceProvider>
            <ActivityProvider>
              <WatchlistProvider>
                <PreferencesProvider>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route element={<PublicOnlyRoute />}>
                      <Route path="/login" element={<Login />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                      <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/markets" element={<Markets />} />
                        <Route path="/markets/:symbol" element={<MarketDetails />} />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Route>
                  </Routes>
                </PreferencesProvider>
              </WatchlistProvider>
            </ActivityProvider>
          </PriceProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
