# Ether.fi

## Supported assets

| Symbol | Contract | Verified source |
|--------|----------|-----------------|
| eETH | `0x35fA164735182de50811E8e2E824cFb9B6118ac2` | [Ether.fi deployed contracts](https://etherfi.gitbook.io/etherfi/contracts-and-integrations/deployed-contracts) |
| weETH | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` | [Ether.fi deployed contracts](https://etherfi.gitbook.io/etherfi/contracts-and-integrations/deployed-contracts) |
| weETHs | `0x917ceE801a67f933F2e6b33fC0cD1ED2d5909D88` | [weETHs (Super Symbiotic)](https://etherfi.gitbook.io/etherfi/staking/weeths-super-symbiotic) |

## Data sources

| Asset | APY source | Valuation |
|-------|------------|-----------|
| eETH, weETH | [Ether.fi APR API](https://www.etherfi.bid/api/etherfi/apr) (`latest_aprs` ÷ 100) | ETH price × balance |
| weETHs | On-chain accountant `getRate()` — **7-day trailing median** of daily simple-annualised returns (per [Ether.fi FAQ](https://etherfi.gitbook.io/etherfi/getting-started/faq)). Fallback: 3.5%. | ETH price × balance × share rate |

weETHs is a Veda boring vault with a **composite** yield (staking + Symbiotic + delegations). It does **not** use the eETH APR feed.

Accountant: `0xbe16605B22a7faCEf247363312121670DFe5afBE`

## RPC calls

* `balanceOf(wallet)` on eETH, weETH, and weETHs
* `getRate()` on weETHs accountant (share price in ETH)

## Yield calculation

Standard APY × USD position value. weETHs USD value uses the vault share rate so accrued yield in the token price is reflected.

## Risks

* Restaking and liquid staking risks
* weETH / weETHs exchange-rate and vault delegation risks
