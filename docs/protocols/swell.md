# Swell

## Supported assets

| Symbol | Contract | Verified source |
|--------|----------|-----------------|
| swETH | `0xf951E335afb289353dc249e82926178EaC7DEd78` | [Swell docs](https://docs.swellnetwork.io/) |
| rswETH | `0xfAe103DC9cf190eD75350761e95403b7b8aFa6c0` | [Swell rswETH](https://docs.swellnetwork.io/swell/liquid-staking/sweth/rsweth) |

## Data sources

| Asset | APY source | Valuation |
|-------|------------|-----------|
| swETH | On-chain `getRate()` — **30-day trailing simple APR** | ETH price × balance × `getRate()` |
| rswETH | On-chain `getRate()` — **30-day trailing simple APR** | ETH price × balance × `getRate()` |

Swell tokens reprice via oracle snapshots (not every block). DeFi Llama’s `swell-liquid-restaking` pool (~1.5%) understates rswETH; we read the token’s own rate provider instead.

## RPC calls

* `balanceOf(wallet)` on swETH and rswETH
* `getRate()` on each token (ETH per share, 1e18 scale)

## Yield calculation

Standard APY × USD position value. Share rate adjusts USD value so accrued yield in the exchange rate is reflected.

## Risks

* Liquid restaking and EigenLayer operator risks
* rswETH / swETH exchange-rate risk
