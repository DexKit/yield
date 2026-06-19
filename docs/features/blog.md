# Blog — Yield by DexKit

Short, shareable posts with **live dynamic PNG cards**.

## Posts

| URL | Card |
|-----|------|
| `/blog/ethereum-foundation-staking-yield` | `/card/compare-ethereum-foundation-staking.png` |
| `/blog/strategy-ethereum-yield` | `/card/compare-strategy-ethereum.png` |

## Ethereum Foundation staking post

**Hook:** EF DeFi multisig holds live ETH on-chain. Most sits idle. What if it were staked via Lido?

- On-chain ETH + WETH balance (wallet `0x9fC3…213e`)
- Live Lido stETH APY
- Compares hypothetical staking yield vs current DeFi earnings
- Dynamic card: `/card/compare-ethereum-foundation-staking.png`

## Strategy / ETH yield post

**Hook:** Strategy (MSTR) holds ~528k BTC. Bitcoin earns 0% yield. What if the same treasury were in Ethereum, staked via Lido?

- Live BTC & ETH prices (CoinGecko)
- Live Lido stETH APY
- Dynamic card embed — updates every 15 minutes (CDN cache)

**Share copy (auto-generated on page):**

> Strategy (MSTR) holds 528k BTC. Same value in ETH (Lido) → $XM/month in yield. Bitcoin earns $0.

## Adding a post

1. Add metadata to `src/lib/blog/posts.ts`
2. Create `src/app/(site)/blog/{slug}/page.tsx`
3. Add slug to `SITEMAP_CONTENT_PATHS` in `src/lib/constants/trust.ts`
4. Optional: new scenario card type in `src/lib/cards/` (see `compare-strategy-ethereum`)

## Scenario cards

Non-wallet cards use slug `compare-*` and `CardTypeId: "scenario"`.

Example embed:

```html
<img
  src="https://yield.dexkit.com/card/compare-strategy-ethereum.png?theme=dark"
  alt="Strategy ETH yield estimate"
  width="1200"
  height="630"
/>
```

---

Last updated: 2026-06-18
