# Roadmap — Yield by DexKit

## Shipped

| Feature | Status | Notes |
|---------|--------|-------|
| Yield engine + wallet pages | ✅ | Multi-chain, multi-protocol |
| SEO + canonical URLs | ✅ | Feature #3 |
| Embeddable iframe widgets | ✅ | Feature #4 — `/embed/*` |
| Public yield API | ✅ | `GET /api/yield/[wallet]` |
| Dynamic yield cards | ✅ | Feature #6 — `/card/*.png` |
| OpenGraph card integration | ✅ | Auto `og:image` on wallet pages |
| Social sharing system | ✅ | Feature #7 — ShareService + SharePanel |
| Yield opportunity engine | ✅ | Feature #1 — idle asset estimates |

## In progress / next

| Feature | Priority | Notes |
|---------|----------|-------|
| `widget.js` web component | P1 | See `docs/widgets/ARCHITECTURE.md` |
| API rate limiting | P1 | Before wide widget distribution |
| Wallet index + sitemap | P2 | See `docs/seo/ARCHITECTURE.md` |
| EUR/GBP/BRL on main UI | P2 | Currency service exists for cards |

## Future — card types (Feature #6 phase 2)

| Card | URL pattern | Status |
|------|-------------|--------|
| Opportunity | `/card/{wallet}-opportunity.png` | 🔲 Architecture only |
| Optimizer | `/card/{wallet}-optimizer.png` | 🔲 Architecture only |
| Protocol | `/card/{wallet}-{protocol}.png` | 🔲 Architecture only |
| Chain | `/card/{wallet}-{chain}.png` | 🔲 Architecture only |
| Comparison | `/card/compare/lido-vs-etherfi.png` | 🔲 Idea |
| DAO treasury | `/card/dao/{slug}.png` | 🔲 Idea |

## Future — SEO programmatic pages

See `docs/seo/ARCHITECTURE.md`:

- Top Yield Wallets
- Per-protocol rankings (Lido, Ether.fi, Aave, …)
- Institutional / DAO treasury reports

## Future — sharing (Feature #7 phase 2)

| Feature | Status |
|---------|--------|
| Farcaster share | 🔲 Planned |
| Reddit share | 🔲 Planned |
| Opportunity report share | 🔲 Architecture only |
| Optimizer report share | 🔲 Architecture only |
| Protocol comparison share | 🔲 Architecture only |

See `docs/share/ARCHITECTURE.md`.

## Future — distribution

- Telegram bot share previews
- Discord bot integration
- Weekly snapshot email / card

---

Last updated: 2026-06-18
