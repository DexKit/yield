# Changelog

All notable changes to Yield by DexKit.

## [Unreleased]

### Added

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
  - Plausible custom events: `Share Click`, `Card Download`
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
