import type { ChainId } from "@/types/chain";
import type { ProtocolId } from "@/types/protocol";
import type {
  AnalyticsChainId,
  AnalyticsProtocolId,
  OpportunityRangeBucket,
  PageViewType,
  WalletSearchType,
} from "@/analytics/events";
import { isEnsName } from "@/lib/validation/identifier";

const ANALYTICS_CHAINS = new Set<AnalyticsChainId>([
  "ethereum",
  "base",
  "arbitrum",
  "optimism",
  "polygon",
  "solana",
  "cosmos",
]);

const PROTOCOL_TO_ANALYTICS: Partial<Record<ProtocolId, AnalyticsProtocolId>> =
  {
    lido: "lido",
    etherfi: "etherfi",
    morpho: "morpho",
    "morpho-sky": "morpho",
    sky: "sky",
    spark: "sky",
    sparklend: "sky",
    aave: "aave",
    eigenlayer: "eigenlayer",
    swell: "swell",
  };

export function classifyPageType(pathname: string): PageViewType {
  const path = pathname.split("?")[0] ?? "/";

  if (path === "/" || path === "") {
    return "home";
  }

  if (path.startsWith("/compare/")) {
    return "compare";
  }

  const topSegment = path.split("/").filter(Boolean)[0];
  if (
    topSegment &&
    ![
      "embed",
      "card",
      "api",
      "_next",
      "blog",
      "roadmap",
      "supported",
      "methodology",
    ].includes(topSegment)
  ) {
    return "wallet";
  }

  return "other";
}

/** Privacy-safe URL for Umami pageviews — never wallet or ENS paths. */
export function sanitizeAnalyticsPath(pathname: string): string {
  const path = pathname.split("?")[0] ?? "/";
  const pageType = classifyPageType(pathname);

  switch (pageType) {
    case "home":
      return "/";
    case "wallet":
      return "/wallet";
    case "compare":
      return path.startsWith("/compare/") ? path : "/compare";
    default:
      if (
        path.startsWith("/embed/") ||
        path.startsWith("/card/") ||
        path.startsWith("/api/")
      ) {
        return "/other";
      }
      return path.length > 96 ? "/other" : path;
  }
}

export function sanitizeAnalyticsTitle(pageType: PageViewType): string {
  const titles: Record<PageViewType, string> = {
    home: "Yield by DexKit",
    wallet: "Wallet yield",
    compare: "Protocol comparison",
    other: "Yield by DexKit",
  };
  return titles[pageType];
}

export function classifyWalletSearchType(input: string): WalletSearchType {
  return isEnsName(input.trim()) ? "ens" : "evm";
}

export function bucketOpportunityRange(monthlyUsd: number): OpportunityRangeBucket {
  const amount = Math.max(0, monthlyUsd);

  if (amount < 10) return "0-10";
  if (amount < 100) return "10-100";
  if (amount < 1000) return "100-1000";
  return "1000+";
}

export function normalizeChainForAnalytics(
  chainId: ChainId,
): AnalyticsChainId | null {
  return ANALYTICS_CHAINS.has(chainId as AnalyticsChainId)
    ? (chainId as AnalyticsChainId)
    : null;
}

export function normalizeProtocolForAnalytics(
  protocolId: ProtocolId,
): AnalyticsProtocolId | null {
  return PROTOCOL_TO_ANALYTICS[protocolId] ?? null;
}

export function uniqueNormalizedProtocols(
  protocolIds: ProtocolId[],
): AnalyticsProtocolId[] {
  const seen = new Set<AnalyticsProtocolId>();

  for (const id of protocolIds) {
    const normalized = normalizeProtocolForAnalytics(id);
    if (normalized) {
      seen.add(normalized);
    }
  }

  return [...seen];
}

export function uniqueNormalizedChains(chainIds: ChainId[]): AnalyticsChainId[] {
  const seen = new Set<AnalyticsChainId>();

  for (const id of chainIds) {
    const normalized = normalizeChainForAnalytics(id);
    if (normalized) {
      seen.add(normalized);
    }
  }

  return [...seen];
}

/** Guard against accidentally sending wallet-like strings in analytics props. */
export function assertPrivacySafeProps(
  props: Record<string, string>,
): Record<string, string> {
  const evmAddress = /^0x[a-fA-F0-9]{40}$/;
  const ensLike = /\.(eth|xyz|com|org|io)$/i;

  for (const value of Object.values(props)) {
    if (evmAddress.test(value)) {
      throw new Error("Analytics props must not contain wallet addresses");
    }
    if (ensLike.test(value)) {
      throw new Error("Analytics props must not contain ENS names");
    }
  }

  return props;
}
