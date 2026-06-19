import { absoluteUrl } from "@/lib/seo/site";

import { SCENARIO_CARD_SLUGS } from "@/lib/blog/scenario-card-slugs";

/** @deprecated Use SCENARIO_CARD_SLUGS.strategyEthereum */
export const STRATEGY_ETHEREUM_CARD_SLUG = SCENARIO_CARD_SLUGS.strategyEthereum;

export function buildStrategyEthereumCardPath(): string {
  return `/card/${STRATEGY_ETHEREUM_CARD_SLUG}.png`;
}

export function getStrategyEthereumCardAbsoluteUrl(options?: {
  theme?: "light" | "dark";
}): string {
  const url = new URL(buildStrategyEthereumCardPath(), absoluteUrl("/"));
  if (options?.theme) {
    url.searchParams.set("theme", options.theme);
  }
  return url.toString();
}
