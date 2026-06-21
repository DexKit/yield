# Analytics — Yield by DexKit

Privacy-friendly product analytics via [Umami](https://umami.is). No cookies, no fingerprinting, no user profiling, and no wallet identifiers in event payloads.

## Philosophy

We measure **aggregate product usage**, not individuals:

- Never send wallet addresses, ENS names, portfolio values, or exact dollar amounts
- Never store personal information
- Umami is cookieless and GDPR-friendly by default
- Auto pageview capture is **disabled** (`data-auto-track="false"`) so wallet URLs are not sent to Umami’s Pages report
- All UI code goes through `AnalyticsService` — never call `window.umami` directly

## Architecture

```
src/analytics/
├── events.ts      # Event names, prop types, reserved future events
├── normalize.ts   # Bucketing, page classification, protocol/chain mapping
├── umami.ts       # Umami provider (swappable)
├── service.ts     # AnalyticsService — single application entry point
├── server.ts      # Server-side events (API + card routes)
├── hooks.ts       # usePageViewTracking, useWalletPageAnalytics
└── index.ts       # Public exports
```

### AnalyticsService

| Method | Event | Purpose |
|--------|-------|---------|
| `trackPageView(pathname?)` | `page_view` | Home vs wallet vs compare traffic |
| `trackWalletSearch(type, result)` | `wallet_search` | Search volume + validation outcomes |
| `trackShare(platform)` | `share_click` | Share button usage |
| `trackDownloadCard(cardType?)` | `download_card` | Card PNG downloads |
| `trackYieldOpportunityView(has, usd)` | `yield_opportunity_view` | Opportunity section engagement (bucketed) |
| `trackApiUsage(endpoint, status)` | `api_request` | Public API + card endpoint usage |
| `trackChainDetected(chain)` | `chain_detected` | Chain adoption |
| `trackProtocolDetected(protocol)` | `protocol_detected` | Protocol adoption |

Future providers: implement `AnalyticsProvider` in `umami.ts` (or a sibling file) and inject into `AnalyticsService`.

## Event catalog

### `page_view`

Two payloads are sent on each navigation (privacy-safe):

1. **Umami pageview** (`umami.track({ url, title })`) — powers **Overview** (visitors, views, bounce rate). Wallet URLs are sanitized to `/wallet` (never ENS or `0x…` paths).
2. **Custom event** `page_view` with property `pageType` — powers the **Events** tab breakdown.

| Property | Values |
|----------|--------|
| `pageType` | `home` · `wallet` · `compare` · `other` |

Fired on App Router navigations via `PageViewTracker` in the site layout. Auto pageview capture is disabled (`data-auto-track="false"`).

### `wallet_search`

| Property | Values |
|----------|--------|
| `walletType` | `ens` · `evm` |
| `resultType` | `success` · `error` |

Fired from `SearchForm` on submit. **No address or ENS string is sent.**

### `yield_opportunity_view`

| Property | Values |
|----------|--------|
| `hasOpportunity` | `true` · `false` |
| `opportunityRange` | `0-10` · `10-100` · `100-1000` · `1000+` |

Bucketed from `additionalMonthlyUsd` only — never exact amounts.

### `share_click`

| Property | Values |
|----------|--------|
| `platform` | `x` · `telegram` · `linkedin` · `discord` · `copy_link` |

### `download_card`

| Property | Values |
|----------|--------|
| `cardType` | `default` · `opportunity` · `optimizer` |

### `api_request`

| Property | Values |
|----------|--------|
| `endpoint` | `wallet_yield` · `card` · `compare` |
| `status` | `success` · `error` |

Server-side via Umami `/api/send` on `GET /api/yield/*` and `GET /card/*`.

### `chain_detected`

| Property | Values |
|----------|--------|
| `chain` | `ethereum` · `base` · `arbitrum` · `optimism` · `polygon` · `solana` · `cosmos` |

One event per unique chain on wallet page load.

### `protocol_detected`

| Property | Values |
|----------|--------|
| `protocol` | `lido` · `etherfi` · `morpho` · `sky` · `aave` · `eigenlayer` · `swell` |

One event per unique normalized protocol on wallet page load. Internal IDs like `morpho-sky` map to `morpho`; `spark` / `sparklend` map to `sky`.

## Reserved events (not implemented)

Defined in `ReservedAnalyticsEvents` for future features:

| Event | Future use |
|-------|------------|
| `yield_optimizer_view` | Optimizer report pages |
| `protocol_comparison_view` | Compare pages (e.g. `/compare/lido-vs-etherfi`) |
| `widget_embed` | Third-party embed loads |
| `api_key_created` | Public API keys |
| `notification_created` | Alert subscriptions |

## Umami setup

1. Create a website in [Umami Cloud](https://cloud.umami.is) or on a self-hosted instance.
2. Copy the **Website ID** from Settings → Websites.
3. Set environment variables in production:

   ```bash
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-uuid
   # Optional — defaults to Umami Cloud
   NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
   ```

   For self-hosted Umami, point the script URL at your instance (e.g. `https://analytics.example.com/script.js`). Server-side events use the same host (`/api/send`).

4. Deploy. The script loads from `(site)/layout.tsx` only — **embed routes exclude analytics** (see `docs/widgets/ARCHITECTURE.md`).
5. In Umami:
   - **Overview** — visitors and pageviews (sanitized URLs like `/`, `/wallet`, `/blog`)
   - **Events** — custom events (`wallet_search`, `share_click`, `page_view`, etc.) and Properties filters
6. Without `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, all tracking no-ops safely (dev-friendly).

## Overview vs Events

| Umami screen | What populates it |
|--------------|-------------------|
| **Overview** (visitors, views) | Manual pageviews via `umami.track({ url, title })` |
| **Events** | Custom events via `umami.track('event_name', { … })` |
| **Pages** | Sanitized paths only — `/wallet`, not `/vitalik.eth` |

If Overview is empty but Events works, pageviews were not being sent (fixed in v0.1+ by dual pageview + event tracking).

## Dashboard interpretation

| KPI | Where to look |
|-----|----------------|
| Daily searches | Events → `wallet_search` · filter `resultType=success` |
| Unique visitors | Umami dashboard → Visitors |
| Most used share button | Events → `share_click` · Properties → `platform` |
| Most common protocol | Events → `protocol_detected` · Properties → `protocol` |
| Most common chain | Events → `chain_detected` · Properties → `chain` |
| Card downloads | Events → `download_card` · Properties → `cardType` |
| API usage | Events → `api_request` · Properties → `endpoint` / `status` |
| Wallet vs home traffic | Events → `page_view` · Properties → `pageType` |
| Opportunity engagement | Events → `yield_opportunity_view` · Properties → `hasOpportunity` / `opportunityRange` |

## Integration map

| Location | Tracking |
|----------|----------|
| `src/app/(site)/layout.tsx` | Umami script + `PageViewTracker` |
| `src/components/yield/search-form.tsx` | `wallet_search` |
| `src/components/yield/share-panel.tsx` | `share_click`, `download_card` |
| `src/components/yield/share-quick-actions.tsx` | `share_click`, `download_card` |
| `src/app/(site)/[identifier]/page.tsx` | `WalletPageTracker` → opportunity, chain, protocol |
| `src/app/api/yield/[wallet]/route.ts` | `api_request` (server) |
| `src/app/card/[slug]/route.tsx` | `api_request` (server) |

## Privacy guardrails

`assertPrivacySafeProps()` throws in development if props resemble wallet addresses or ENS names. Production builds should never hit this — it is a safety net for engineers.

---

Last updated: 2026-06-18
