export interface MethodologyStep {
  id: string;
  title: string;
  description: string;
}

export const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    id: "balance-detection",
    title: "Balance detection",
    description:
      "We read your wallet on supported networks and detect token balances held in known DeFi positions — liquid staking tokens, lending receipts, vault shares, and similar assets.",
  },
  {
    id: "protocol-identification",
    title: "Protocol identification",
    description:
      "Each balance is matched to a supported protocol (Lido, Aave, Morpho, Sky, and others). Unsupported or unknown tokens are not included in yield estimates.",
  },
  {
    id: "apy-source",
    title: "Current APY source",
    description:
      "We fetch up-to-date yield rates from protocol APIs and public data sources, with on-chain reads where available. Rates refresh regularly — they reflect current conditions, not historical averages.",
  },
  {
    id: "yield-estimation",
    title: "Yield estimation",
    description:
      "For each position we estimate daily, monthly, and yearly earnings using current balance, USD value, and APY. Wallet totals are the sum of all supported positions.",
  },
];

export const METHODOLOGY_FORMULA =
  "Position value × current APY → estimated yield";
