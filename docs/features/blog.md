# Blog — Yield by DexKit

Short, shareable posts with **live dynamic PNG cards**.

## Posts

| URL | Card |
|-----|------|
| `/blog/apple-ethereum-yield` | `/card/compare-apple-ethereum.png` |
| `/blog/validator-revenue-10-percent-funding` | `/card/compare-validator-revenue-10pct.png` |
| `/blog/ethereum-foundation-staking-yield` | `/card/compare-ethereum-foundation-staking.png` |
| `/blog/strategy-ethereum-yield` | `/card/compare-strategy-ethereum.png` |

## Validator revenue 10% post

**Hook:** [Validator Redirected Revenue](https://ethresear.ch/t/validator-redirected-revenue/25248) on Ethereum Research — debated on X — what if 1% or 10% of validator revenue funded core work?

- Live circulating ETH + **spot ETH price** + ATH from CoinGecko (price labeled on page)
- Live Lido stETH APY as network yield proxy
- **1%** and **10%** redirect slices per scenario
- **Live vs ATH** ETH price comparison (same stake/APY, USD scales)
- Scenarios at **50%** and **70%** stake (APY scales down)
- Compares to **~$30M/yr core dev floor** (Protocol Guild benchmark) and **EF ESP** grants (Q1 & Q4 2025)
- Dynamic card: `/card/compare-validator-revenue-10pct.png`

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

## Apple / ETH yield post

**Hook:** Apple holds ~$147B in cash & marketable securities (FY2026 Q2). What if 50% were staked ETH?

- Treasury from Apple 10-Q (Mar 28, 2026): cash + current + non-current marketable securities
- Live ETH price + Lido stETH APY + circulating supply (CoinGecko)
- **50%** allocation scenario with supply / market-cap context vs corp treasuries
- Dynamic card: `/card/compare-apple-ethereum.png`

**Share copy (auto-generated on page):**

> Apple (AAPL) holds $147B in cash & securities. If 50% were staked ETH (Lido) → $XM/month in yield.

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

Last updated: 2026-06-27
