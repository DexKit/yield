/** Public trust, coverage, and disclaimer copy — shared across UI and docs. */

import {
  ACTIVE_NETWORK_NAMES,
  FEATURED_PROTOCOL_NAMES,
  PLANNED_NETWORK_NAMES,
} from "@/lib/constants/coverage";

export const GITHUB_REPO_URL = "https://github.com/DexKit/yield";

export const YIELD_DISCLAIMER =
  "Yield estimates are based on current protocol rates and market prices. Actual earnings may vary and are not guaranteed.";

/** Featured protocol names for compact UI (homepage chips, empty states). */
export const SUPPORTED_PROTOCOLS = FEATURED_PROTOCOL_NAMES;

export const SUPPORTED_NETWORKS = ACTIVE_NETWORK_NAMES;

export const FUTURE_NETWORKS = PLANNED_NETWORK_NAMES;

/** Positions below this USD value are hidden in the UI but still counted in totals. */
export const DUST_MIN_VALUE_USD = 1;

/** Seed wallet slugs included in sitemap for crawl discovery. */
export const SITEMAP_WALLET_SLUGS = ["vitalik.eth"] as const;

/** Static content pages included in sitemap. */
export const SITEMAP_CONTENT_PATHS = [
  "/methodology",
  "/supported",
  "/roadmap",
  "/blog",
  "/blog/ethereum-foundation-staking-yield",
  "/blog/strategy-ethereum-yield",
] as const;
