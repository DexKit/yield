/** Registered scenario card slugs (non-wallet PNG cards). */
export const SCENARIO_CARD_SLUGS = {
  strategyEthereum: "compare-strategy-ethereum",
  foundationStaking: "compare-ethereum-foundation-staking",
  validatorRevenueTenPct: "compare-validator-revenue-10pct",
} as const;

export type ScenarioCardSlug =
  (typeof SCENARIO_CARD_SLUGS)[keyof typeof SCENARIO_CARD_SLUGS];

export function isScenarioCardSlug(slug: string): slug is ScenarioCardSlug {
  return Object.values(SCENARIO_CARD_SLUGS).includes(slug as ScenarioCardSlug);
}
