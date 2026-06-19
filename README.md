# Yield by DexKit

Estimate daily, monthly, and annual DeFi yield for any Ethereum wallet or ENS name.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search a wallet or ENS (e.g. `/vitalik.eth`).

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Public origin for canonical URLs and OG (default `https://yield.dexkit.com`) |
| `ALCHEMY_API_KEY` | Optional RPC key for Ethereum, Base, Arbitrum, Optimism |

## Public wallet pages

Every searched wallet becomes a permanent, indexable profile:

- `yield.dexkit.com/vitalik.eth`
- `yield.dexkit.com/0x…` (redirects to ENS when available)

Features: SSR, canonical URLs, Open Graph images, Schema.org JSON-LD.

See [docs/seo/ARCHITECTURE.md](./docs/seo/ARCHITECTURE.md) for SEO design and future roadmap.

## Embeddable widgets (Phase 1)

Iframe embeds for third-party sites:

```html
<iframe
  src="https://yield.dexkit.com/embed/vitalik.eth?variant=standard"
  title="Wallet yield"
  style="width:100%;max-width:420px;border:0;"
></iframe>
```

Variants: `compact` · `standard` (default) · `advanced` · `?theme=light|dark|auto`

Public API: `GET /api/yield/vitalik.eth` — JSON yield snapshot (CORS-enabled).

See [docs/widgets/ARCHITECTURE.md](./docs/widgets/ARCHITECTURE.md) for embed docs and Phase 2 `widget.js` plan.

## Shareable yield cards

Dynamic PNG cards for social, GitHub, and blogs:

```markdown
![Yield](https://yield.dexkit.com/card/vitalik.eth.png)
```

- `?theme=light|dark` · `?currency=EUR|GBP|BRL`
- Wallet pages automatically use the card as OpenGraph image

See [docs/cards/ARCHITECTURE.md](./docs/cards/ARCHITECTURE.md) · [ROADMAP.md](./docs/ROADMAP.md) · [CHANGELOG.md](./CHANGELOG.md)

## Social sharing

Share wallet results on X, Telegram, Discord, LinkedIn, or copy the canonical link. Download the yield card PNG directly.

See [docs/share/ARCHITECTURE.md](./docs/share/ARCHITECTURE.md).

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
