import { absoluteUrl } from "@/lib/seo/site";

import { SCENARIO_CARD_SLUGS } from "@/lib/blog/scenario-card-slugs";

/** @deprecated Use SCENARIO_CARD_SLUGS.appleEthereum */
export const APPLE_ETHEREUM_CARD_SLUG = SCENARIO_CARD_SLUGS.appleEthereum;

export function buildAppleEthereumCardPath(): string {
  return `/card/${APPLE_ETHEREUM_CARD_SLUG}.png`;
}

export function getAppleEthereumCardAbsoluteUrl(options?: {
  theme?: "light" | "dark";
}): string {
  const url = new URL(buildAppleEthereumCardPath(), absoluteUrl("/"));
  if (options?.theme) {
    url.searchParams.set("theme", options.theme);
  }
  return url.toString();
}
