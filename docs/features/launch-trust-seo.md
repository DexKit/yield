# Launch Trust, SEO & UX — Feature Summary

Pre-launch milestone: increase trust, clarity, shareability, SEO readiness, and user confidence without adding major product features.

## Shipped (2026-06-18)

| # | Feature | Implementation |
|---|---------|----------------|
| 1 | How calculations work | `CalculationLink` + `CalculationModal` below earnings summary |
| 2 | Supported protocols | `SupportedProtocols` on homepage (chips for protocols + networks) |
| 3 | Empty states | `YieldEmptyState` — empty wallet vs unsupported assets |
| 4 | Dust handling | Positions &lt; $1 hidden in `YieldDetails`; totals unchanged |
| 5 | Open source trust | Footer: Open Source · View Source · Powered by DexKit |
| 6 | SEO validation | Homepage + wallet metadata (canonical, og, twitter) |
| 7 | Sitemap & robots | `sitemap.ts` (home + seed wallets), `robots.ts` |
| 8 | Disclaimer | Footer + calculation modal (`YIELD_DISCLAIMER`) |
| 9 | Share optimization | `ShareQuickActions` below monthly yield in `YieldHero` |
| 10 | Launch checklist | `docs/launch-checklist.md` |
| 11 | Methodology page | `/methodology` — 4-step flow; footer + calculation modal link |

## Key files

```
src/lib/constants/trust.ts          # Protocols, networks, disclaimer, GitHub URL, dust threshold
src/components/yield/calculation-link.tsx
src/components/yield/calculation-modal.tsx
src/components/yield/supported-protocols.tsx
src/components/yield/yield-empty-state.tsx
src/components/yield/share-quick-actions.tsx
src/components/yield/yield-details.tsx   # Dust filter + empty states
src/components/yield/yield-hero.tsx      # Calculation link + quick share
src/components/layout/footer.tsx
src/lib/seo/home-metadata.ts
src/app/(site)/opengraph-image.tsx
src/app/sitemap.ts
```

## Empty state logic

On wallet pages, when `protocolCount === 0`:

- **`hasDetectedAssets`** (idle scan ≥ $1) → “Assets detected, but none currently generate supported yield.”
- Otherwise → “No supported yield positions found.”

`hasDetectedAssets` is returned by `YieldOpportunityService.analyze()`.

## Dust rule

- Threshold: `DUST_MIN_VALUE_USD = 1`
- Positions with `0 < valueUsd < 1` are hidden in the UI
- Server-side yield totals are unchanged

## Verification

Use `docs/launch-checklist.md` before launch.
