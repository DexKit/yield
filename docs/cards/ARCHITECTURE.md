# Yield Cards — Architecture

Dynamic PNG cards for social sharing, OpenGraph, GitHub READMEs, and blog embeds.

## URLs

| Example | Description |
|---------|-------------|
| `/card/vitalik.eth.png` | Default yield card |
| `/card/vitalik.eth.png?theme=light` | Light theme |
| `/card/vitalik.eth.png?theme=dark` | Dark theme (default) |
| `/card/vitalik.eth.png?currency=EUR` | EUR display |

Future (not implemented):

- `/card/vitalik.eth-opportunity.png`
- `/card/vitalik.eth-optimizer.png`
- `/card/vitalik.eth-lido.png` (protocol)
- `/card/vitalik.eth-base.png` (chain)

## Embeds

**GitHub README:**

```markdown
![Yield Card](https://yield.dexkit.com/card/vitalik.eth.png)
```

**Blog:**

```html
<img
  src="https://yield.dexkit.com/card/vitalik.eth.png"
  alt="Estimated DeFi yield for vitalik.eth"
  width="1200"
  height="630"
/>
```

No authentication or JavaScript required. Images revalidate every 15 minutes.

## Card engine (Open/Closed)

```
src/lib/cards/
  card-data-provider.ts    # yieldService.calculateYield — no duplicate logic
  card-theme-provider.ts   # light / dark tokens
  card-layout-registry.ts  # register layouts by CardTypeId
  card-renderer.ts         # ImageResponse generation
  card-url.ts              # slug parsing + absolute URLs
  layouts/
    default-wallet-card.tsx
```

| Component | Responsibility |
|-----------|----------------|
| **CardDataProvider** | Fetch wallet yield via shared Yield Engine; apply currency conversion |
| **CardThemeProvider** | Resolve theme design tokens |
| **CardLayoutRegistry** | Map `CardTypeId` → layout renderer |
| **CardRenderer** | Compose data + theme + layout → `ImageResponse` |

New card types: implement a layout, `cardLayoutRegistry.register(layout)` — no changes to existing layouts.

## Currency

Yield is always calculated in USD (`yieldService`). Display conversion uses `currency-service.ts` (Frankfurter API, 1h rate cache). Supported: `USD`, `EUR`, `GBP`, `BRL`.

## Caching

- Route + CDN: `Cache-Control: public, s-maxage=900, stale-while-revalidate=1800`
- Card route uses **edge runtime** for fast PNG generation

## OpenGraph

Wallet pages (`/[identifier]`) set `og:image` to `/card/{wallet}.png?theme=dark` automatically via `buildWalletPageMetadata()`.

## Future card types (planned)

| Type | Slug suffix | Metrics |
|------|-------------|---------|
| Opportunity | `-opportunity` | Missed vs potential yield |
| Optimizer | `-optimizer` | Current vs optimized yield |
| Protocol | `-{protocolId}` | Single-protocol earnings |
| Chain | `-{chainId}` | Single-chain yield |

See [ROADMAP.md](../ROADMAP.md) for delivery phases.

## Future roadmap cards (not designed in detail)

- Top Yield Wallet Card
- Protocol comparison (Lido vs Ether.fi, Aave vs Morpho)
- Institutional / DAO treasury cards
- Weekly yield snapshot card

Register new `CardTypeId` + layout when implementing.
