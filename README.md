# ELVERMONT — Frontend Demo

A frontend-only presentation demo of **ELVERMONT**, a premium market-monitoring platform for Forex, Commodities and Crypto.

> **Demo only.** Authentication is simulated in the browser, and every price, portfolio value and activity item is fictional local data. There is no backend, live market data, broker connection or order execution.

## Quick start

Requires Node.js 18+ (tested on Node 22).

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript only
```

## Demo credentials

| Email | Password |
|---|---|
| `demo@elvermont.com` | `Demo@123` |

You can also click **Use demo credentials** on the login screen to fill them in.

## Demo walkthrough

1. Open the app. You are redirected to `/login`.
2. Sign in with the demo credentials. You land on `/dashboard` with a welcome message.
3. Explore the dashboard:
   - summary cards
   - the Gold (XAU/USD) chart with 1D / 1W / 1M / 3M / 1Y filters
   - the watchlist preview
   - the market overview
   - recent activity
4. **Markets:** filter by All / Forex / Commodities / Crypto. The filter is kept in the URL, so browser back and forward work.
5. Open any instrument for its detail page: chart, time filters, instrument information and Add to Watchlist.
6. **Watchlist:** add instruments from Markets with the ★ button and remove them here. Your list is saved in `localStorage` and survives a refresh.
7. **Portfolio:** shows simulated holdings, allocation and P/L.
8. **Settings:**
   - profile details
   - theme (light only)
   - notification toggles, saved locally
   - Reset demo data
   - Logout

You can also log out from the sidebar or the profile menu.

## Routes

| Route | Page |
|---|---|
| `/login` | Login (redirects to `/dashboard` if already signed in) |
| `/dashboard` | Dashboard |
| `/markets` | Markets (`?category=forex\|commodities\|crypto`) |
| `/markets/:symbol` | Market detail, e.g. `/markets/xau-usd`, `/markets/btc-usd`, `/markets/wti` |
| `/watchlist` | Watchlist |
| `/portfolio` | Portfolio |
| `/settings` | Settings |

All routes except `/login` are protected. If you are signed out, they redirect to `/login`, and after signing in you return to the page you originally requested.

## Logo

The official logo was not included in the project. Until it is supplied, a temporary text wordmark is shown. To use the real logo:

1. Add it as `src/assets/elvermont-logo.svg` (or `.png` / `.webp` / `.jpg`).
2. Restart the dev server.

It is picked up automatically, keeps its aspect ratio, and needs no code changes. It sits on emerald green, so a light or gold version of the logo reads best.

## Editing demo data

Everything lives in `src/data/`:

- `mockMarkets.ts`
  - the 13 instruments and their reference prices
  - the default watchlist
  - the "Markets open" figure
- `mockPortfolio.ts`
  - holdings, which total **$24,850.00**, with a daily change of **+$485.20**
- `mockActivity.ts`
  - seeded activity items and notifications

### How prices move

`PriceContext` nudges every price slightly every 5 seconds, by at most ±0.03% and staying within ±0.4% of the reference price. Every page reads from this one shared source, so an instrument always shows the same value everywhere.

### Chart history

Chart history is generated deterministically from a fixed seed (`src/utils/series.ts`). Each view keeps a stable shape and always ends at the current price.

### Local storage

Browser storage keys are `elvermont.session`, `elvermont.watchlist`, `elvermont.activity` and `elvermont.preferences`.

- If **Remember me** is unticked at login, the session goes in `sessionStorage` instead.
- **Settings → Reset demo data** restores the watchlist, activity and preferences.

## Brand

Colours are defined once as Tailwind theme tokens in `src/index.css`:

| Token | Hex | Use |
|---|---|---|
| `emerald` | `#0D3B2E` | Sidebar, primary buttons, selected nav |
| `gold` | `#DFBD3F` | Active indicators, chart highlight, small accents |
| `ivory` | `#F5F4EF` | Page background |
| `ink` | `#17231F` | Headings, financial values |
| `muted` | `#738078` | Supporting text |
| `line` | `#E5E9E5` | Borders, dividers |
| `surface-dark` | `#10251E` | Hover states, toasts |
| `up` / `down` | `#2F7A55` / `#B4553F` | Gains and losses. Muted, and always shown with an arrow and a +/− sign |

**Fonts:** Inter for the interface, and Cormorant Garamond only for the temporary wordmark and the login headline.

## Tech stack

- React 19, TypeScript and Vite
- Tailwind CSS v4
- React Router
- Recharts
- Lucide icons

```
src/
  assets/       logo drop-in location
  components/   common/, layout/, dashboard/, markets/, charts/
  context/      Auth, Price, Watchlist, Activity, Preferences, Toast
  data/         mockMarkets.ts, mockPortfolio.ts, mockActivity.ts
  hooks/        useSeries, useLogout
  routes/       ProtectedRoute / PublicOnlyRoute
  utils/        format, series (seeded chart data), storage
  pages/        Login, Dashboard, Markets, MarketDetails, Watchlist, Portfolio, Settings, NotFound
```

## Deployment

The build output is a static single-page app (`dist/`) that uses browser history routing. Configure your host to serve `index.html` for unknown paths so that deep links like `/markets/xau-usd` work:

- **Vercel:** already configured with `vercel.json`. Import the GitHub repo in Vercel and it deploys on every push to `main`.
- **Netlify:** add `/* /index.html 200` to `public/_redirects`.
