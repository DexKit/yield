# Changelog

All notable changes to Yield by DexKit.

## [Unreleased]

### Changed

- Analytics provider migrated from Plausible to Umami (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`)

### Added

- **Methodology page** (`/methodology`) — balance detection → protocol ID → APY source → yield estimation; linked from footer and calculation modal

- **Blog: Ethereum Foundation staking yield**
  - `/blog/ethereum-foundation-staking-yield` — live EF wallet ETH vs hypothetical Lido staking
  - Dynamic card: `/card/compare-ethereum-foundation-staking.png`

- **Blog: Strategy vs ETH yield**
  - `/blog/strategy-ethereum-yield` — shareable post comparing MSTR BTC treasury to hypothetical Lido ETH yield
  - Dynamic scenario card: `/card/compare-strategy-ethereum.png` (live BTC/ETH prices + Lido APY)
  - Blog index at `/blog`
  - Footer link: Blog

- **Public content pages**
  - `/supported` — active networks, protocols, and planned chain coverage
  - `/roadmap` — shipped highlights and future roadmap
  - Footer links: Supported · Roadmap
  - Sitemap entries for both pages

- **Launch trust, SEO & UX pass (pre-launch milestone)**
  - “How is this calculated?” modal with disclaimer below earnings summary
  - Supported protocols & networks section on homepage
  - Polished empty states (no positions vs unsupported assets)
  - Dust positions (< $1) hidden by default in position list; totals unchanged
  - Footer: Open Source · View Source · Powered by DexKit + disclaimer
  - Share / Copy Link / Download Card moved next to monthly yield (`ShareQuickActions`)
  - Homepage SEO metadata + `/opengraph-image`
  - Sitemap seed URLs for homepage + notable wallets
  - Launch checklist: `docs/launch-checklist.md`
  - Documentation: `docs/features/launch-trust-seo.md`

- **Privacy analytics (Umami)**
  - `AnalyticsService` abstraction in `src/analytics/` — swappable provider
  - Events: `page_view`, `wallet_search`, `share_click`, `download_card`, `yield_opportunity_view`, `api_request`, `chain_detected`, `protocol_detected`
  - Auto pageview disabled — wallet URLs never sent to Umami
  - Server-side API tracking on `/api/yield/*` and `/card/*`
  - Documentation: `docs/analytics.md`

- **Yield Opportunity Engine (Feature #1)**
  - `YieldOpportunityService` — idle asset scan + benchmark APY estimates
  - `BenchmarkRegistry` — extensible default mappings (Lido / Aave / Sky)
  - Wallet page section: Current Yield · Yield Opportunity · Potential Total Yield
  - Neutral copy only; disclaimer on estimates
  - Documentation: `docs/opportunity/ARCHITECTURE.md`

- **Social Sharing System (Feature #7)**
  - `ShareService` — canonical URLs, X/Telegram/LinkedIn intents, Discord copy text
  - `SharePanel` below yield hero (primary) and page footer (secondary)
  - Platforms: X, Telegram, Discord (clipboard), LinkedIn, Copy Link
  - Download Card button → `/card/{wallet}.png`
  - OpenGraph title: `{wallet} generates an estimated ${monthly}/month`
  - Umami custom events via `AnalyticsService` (`share_click`, `download_card`)
  - Documentation: `docs/share/ARCHITECTURE.md`

- **Dynamic Yield Cards (Feature #6)**
  - PNG cards at `/card/[wallet].png` via `ImageResponse` (edge)
  - Default layout: monthly yield hero + daily/yearly supporting metrics
  - Themes: `?theme=light` · `?theme=dark` (default)
  - Currency: `?currency=EUR|GBP|BRL` via shared `currency-service`
  - Card engine: `CardDataProvider`, `CardThemeProvider`, `CardLayoutRegistry`, `CardRenderer`
  - 15-minute CDN cache (`s-maxage=900`, stale-while-revalidate)
  - Wallet pages auto-use card as OpenGraph/Twitter image
  - GitHub README and blog embed support (direct PNG URL)
  - Documentation: `docs/cards/ARCHITECTURE.md`

### Changed

- Removed per-route `opengraph-image.tsx` in favor of unified card URLs
- Schema.org `primaryImageOfPage` now points to `/card/*.png`
- `formatMoney()` added; `formatUsd()` delegates to it

### Architecture (not implemented)

- Future card types: opportunity, optimizer, protocol, chain
- Documented in `docs/cards/ARCHITECTURE.md` and `docs/ROADMAP.md`

## Previous features

- Embeddable iframe widgets (`/embed/*`) and public API (`/api/yield/*`)
- Public wallet pages with SEO, JSON-LD, canonical URLs
- Multi-chain yield engine (Ethereum, Base, Arbitrum, Optimism)

---

Format based on [Keep a Changelog](https://keepachangelog.com/).
