/** Analytics event catalog — privacy-safe, aggregate metadata only. */

export const AnalyticsEvents = {
  PAGE_VIEW: "page_view",
  WALLET_SEARCH: "wallet_search",
  YIELD_OPPORTUNITY_VIEW: "yield_opportunity_view",
  SHARE_CLICK: "share_click",
  DOWNLOAD_CARD: "download_card",
  API_REQUEST: "api_request",
  CHAIN_DETECTED: "chain_detected",
  PROTOCOL_DETECTED: "protocol_detected",
} as const;

/** Reserved for future features — do not emit yet. */
export const ReservedAnalyticsEvents = {
  YIELD_OPTIMIZER_VIEW: "yield_optimizer_view",
  PROTOCOL_COMPARISON_VIEW: "protocol_comparison_view",
  WIDGET_EMBED: "widget_embed",
  API_KEY_CREATED: "api_key_created",
  NOTIFICATION_CREATED: "notification_created",
} as const;

export type AnalyticsEventName =
  | (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]
  | (typeof ReservedAnalyticsEvents)[keyof typeof ReservedAnalyticsEvents];

export type PageViewType = "home" | "wallet" | "compare" | "other";

export type WalletSearchType = "ens" | "evm";

export type WalletSearchResultType = "success" | "error";

export type SharePlatform =
  | "x"
  | "telegram"
  | "linkedin"
  | "discord"
  | "copy_link";

export type DownloadCardType = "default" | "opportunity" | "optimizer";

export type OpportunityRangeBucket = "0-10" | "10-100" | "100-1000" | "1000+";

export type ApiEndpoint = "wallet_yield" | "card" | "compare";

export type ApiRequestStatus = "success" | "error";

export type AnalyticsChainId =
  | "ethereum"
  | "base"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "solana"
  | "cosmos";

export type AnalyticsProtocolId =
  | "lido"
  | "etherfi"
  | "morpho"
  | "sky"
  | "aave"
  | "eigenlayer"
  | "swell";

export interface PageViewProps {
  pageType: PageViewType;
}

export interface WalletSearchProps {
  walletType: WalletSearchType;
  resultType: WalletSearchResultType;
}

export interface YieldOpportunityViewProps {
  hasOpportunity: "true" | "false";
  opportunityRange: OpportunityRangeBucket;
}

export interface ShareClickProps {
  platform: SharePlatform;
}

export interface DownloadCardProps {
  cardType: DownloadCardType;
}

export interface ApiRequestProps {
  endpoint: ApiEndpoint;
  status: ApiRequestStatus;
}

export interface ChainDetectedProps {
  chain: AnalyticsChainId;
}

export interface ProtocolDetectedProps {
  protocol: AnalyticsProtocolId;
}
