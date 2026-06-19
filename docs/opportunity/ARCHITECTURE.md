# Yield Opportunity Engine

Estimates additional yield from **idle** wallet assets (ETH, WETH, USDC, USDT, DAI) using benchmark protocol APYs. Objective calculations only — not financial advice.

## UX

Wallet pages show a section below the main yield hero:

| Current Yield | Yield Opportunity | Potential Total Yield |
|---------------|-------------------|------------------------|
| $420/mo       | +$180/mo          | $600/mo                |

Supporting copy: *"Based on currently idle assets and available protocol yields."*

Neutral language only: Potential, Estimated, Available, Current.

## Methodology

For each eligible idle balance on active chains:

```
Potential Yield = Asset Value (USD) × Benchmark APY / 100
```

Default benchmarks:

| Asset   | Benchmark |
|---------|-----------|
| ETH     | Lido (stETH APY) |
| WETH    | Lido (stETH APY) |
| USDC    | Aave (aUSDC APY, chain-local on L2) |
| USDT    | Aave (aUSDT APY, chain-local on L2) |
| DAI     | Sky (sUSDS APY) |

Minimum balance: `OPPORTUNITY_MIN_VALUE_USD` ($1) in `src/types/opportunity.ts`.

Deployed yield positions use receipt tokens (stETH, aUSDC, …) and are tracked separately by the yield engine. Idle scanning reads **wallet balances** of base assets only.

## Architecture

```
src/lib/opportunity/
├── benchmark-registry.ts    # BenchmarkProvider + default mappings
├── idle-asset-scanner.ts    # Multi-chain wallet balance scan
└── yield-opportunity-service.ts  # Orchestration + aggregation

src/components/yield/yield-opportunity.tsx   # Presentation only
src/types/opportunity.ts                     # Shared types
```

### YieldOpportunityService

- `analyze(wallet, currentYield)` → `YieldOpportunityResult`
- No UI imports

### BenchmarkRegistry (extensibility)

Designed for future features **not implemented yet**:

- Multiple benchmark providers per asset (`register`, `getById`)
- User-selected benchmark protocol
- Protocol-specific opportunity analysis

`resolveProvider(asset, chainId)` picks chain-local Aave APY for stablecoins on L2.

## Caching

`getCachedYieldOpportunity` in `src/lib/seo/cached-yield.ts` dedupes within one SSR request.

## Future

- Opportunity card (`/card/{wallet}-opportunity.png`) — see `docs/ROADMAP.md`
- Exclude partial overlaps with native restaking positions
- User benchmark preferences (API + UI)
