# Social Sharing — Architecture

First-class sharing for wallet yield pages, cards, and future reports.

## ShareService

All share URLs and message payloads are built in `src/lib/share/share-service.ts`. **UI never constructs share URLs directly.**

| Method | Purpose |
|--------|---------|
| `buildShareContext(result)` | Serializable payload for client UI |
| `getXShareUrl(ctx)` | Twitter intent URL with pre-filled text |
| `getTelegramShareUrl(ctx)` | `t.me/share` with wallet + yield + URL |
| `getLinkedInShareUrl(ctx)` | LinkedIn offsite share (OG card preview) |
| `getDiscordShareText(ctx)` | Markdown for clipboard (no web share API) |
| `getCanonicalUrl(slug)` | Always `https://yield.dexkit.com/{slug}` |

### Canonical rules

- Always use ENS when available (via `getCanonicalWalletUrl`)
- Never session IDs, query params, or temp paths
- Card download uses `/card/{wallet}.png` absolute URL

## UI placement

| Location | Component | Variant |
|----------|-----------|---------|
| Below yield hero | `SharePanel` | `primary` |
| Above “Check another wallet” | `SharePanel` | `secondary` |

### Platforms (launch)

| Platform | Mechanism |
|----------|-----------|
| **X** | `twitter.com/intent/tweet` |
| **Telegram** | `t.me/share/url` |
| **Discord** | Copy formatted message to clipboard |
| **LinkedIn** | `linkedin.com/sharing/share-offsite` |
| **Copy Link** | Clipboard + “Link copied” feedback |
| **Download Card** | Direct link to PNG |

### Future platforms

- Farcaster (warpcast compose API or frame)
- Reddit (`reddit.com/submit`)

## OpenGraph (social previews)

Wallet metadata uses share-optimized copy:

| Field | Example |
|-------|---------|
| **og:title** | `vitalik.eth generates an estimated $1,245/month` |
| **og:description** | `See estimated daily, monthly and yearly yield.` |
| **og:image** | `/card/vitalik.eth.png?theme=dark` |

Browser tab title remains: `How Much Yield Does {wallet} Generate?`

## X share text format

```
{wallet} is estimated to generate
{monthly}/month
{yearly}/year
via DeFi yield.

Check any wallet:
{canonicalUrl}

Powered by DexKit
```

## Analytics (Plausible)

Custom events via `src/lib/analytics/plausible-events.ts`:

| Event | Props |
|-------|-------|
| `Share Click` | `platform`: `x` · `telegram` · `discord` · `linkedin` · `copy_link` |
| `Card Download` | — |

Requires `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. No cookies, no user profiling.

Configure goals in Plausible dashboard for these event names.

## Future share types (not implemented)

Extend `ShareService` with report-specific builders:

| Report | Example message |
|--------|-----------------|
| Opportunity | “You are missing $350/month in potential yield” |
| Optimizer | “Potential additional yield +$295/month” |
| Protocol comparison | “Ether.fi vs Lido — +$220/year difference” |

Each report gets its own `buildShareContext` variant and optional card URL (`/card/{wallet}-opportunity.png`).

## File map

```
src/lib/share/share-service.ts
src/lib/analytics/plausible-events.ts
src/components/yield/share-panel.tsx
```
