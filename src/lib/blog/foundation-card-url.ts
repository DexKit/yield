import { absoluteUrl } from "@/lib/seo/site";

import { SCENARIO_CARD_SLUGS } from "@/lib/blog/scenario-card-slugs";

export const FOUNDATION_STAKING_CARD_SLUG = SCENARIO_CARD_SLUGS.foundationStaking;

export function buildFoundationStakingCardPath(): string {
  return `/card/${FOUNDATION_STAKING_CARD_SLUG}.png`;
}

export function getFoundationStakingCardAbsoluteUrl(options?: {
  theme?: "light" | "dark";
}): string {
  const url = new URL(buildFoundationStakingCardPath(), absoluteUrl("/"));
  if (options?.theme) {
    url.searchParams.set("theme", options.theme);
  }
  return url.toString();
}
