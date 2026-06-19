# Launch Readiness Checklist — Yield by DexKit

Pre-launch trust, SEO, and UX milestone. Verify each item before public launch.

## Analytics

- [ ] `NEXT_PUBLIC_UMAMI_WEBSITE_ID` set in production
- [ ] Umami script loads on `(site)` layout
- [ ] `wallet_search`, `share_click`, `download_card` events fire in browser devtools / Umami dashboard
- [ ] Wallet addresses are **not** sent in analytics payloads (see `docs/analytics.md`)

## SEO & social previews

- [ ] Homepage has canonical URL, `og:*`, and `twitter:*` metadata
- [ ] Wallet pages have canonical URL, `og:*`, and `twitter:*` metadata
- [ ] OG images verified:
  - [ ] Homepage: `/opengraph-image` (1200×630)
  - [ ] Wallet: `/card/{wallet}.png?theme=dark`
- [ ] Social previews verified (Twitter/X, Telegram, LinkedIn link unfurl)
- [ ] Wallet page title pattern: `How Much Yield Does {wallet} Generate?`
- [ ] Wallet meta description: `See estimated daily, monthly and yearly yield for {wallet}.`

## Crawl infrastructure

- [ ] `/sitemap.xml` returns homepage, content pages, and seed wallet URLs
- [ ] `/robots.txt` allows `/` and references sitemap
- [ ] Wallet pages indexed correctly (`robots: index, follow` on valid wallets)
- [ ] Embed routes remain `noindex`

## Trust & UX

- [ ] “How is this calculated?” link visible below earnings summary
- [ ] Calculation modal includes disclaimer
- [ ] Supported protocols section visible on homepage
- [ ] Empty wallet state: “No supported yield positions found…”
- [ ] Unsupported assets state: “Assets detected, but none currently generate supported yield.”
- [ ] Dust positions (< $1) hidden by default; totals unchanged
- [ ] “Hidden dust positions: N — click to reveal” works
- [ ] Share / Copy Link / Download Card visible near monthly yield (no scroll on mobile)
- [ ] Footer shows Supported · Roadmap · Open Source · View Source · Powered by DexKit
- [ ] Footer disclaimer visible
- [ ] GitHub link opens https://github.com/DexKit/yield in new tab

## Quality

- [ ] Mobile responsiveness verified (homepage + wallet page)
- [ ] `npm run build` passes
- [ ] Performance acceptable on wallet page (LCP, no layout shift on share buttons)

---

**Last reviewed:** 2026-06-18

See also: `docs/features/launch-trust-seo.md`, `docs/seo/ARCHITECTURE.md`, `docs/ROADMAP.md`.
