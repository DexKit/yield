export {
  AnalyticsEvents,
  ReservedAnalyticsEvents,
  type AnalyticsChainId,
  type AnalyticsEventName,
  type AnalyticsProtocolId,
  type ApiEndpoint,
  type ApiRequestStatus,
  type DownloadCardType,
  type OpportunityRangeBucket,
  type PageViewType,
  type SharePlatform,
  type WalletSearchResultType,
  type WalletSearchType,
} from "@/analytics/events";

export {
  bucketOpportunityRange,
  classifyPageType,
  classifyWalletSearchType,
  normalizeChainForAnalytics,
  normalizeProtocolForAnalytics,
  sanitizeAnalyticsPath,
  sanitizeAnalyticsTitle,
  uniqueNormalizedChains,
  uniqueNormalizedProtocols,
} from "@/analytics/normalize";

export {
  createUmamiProvider,
  getUmamiApiHost,
  getUmamiScriptUrl,
  UmamiAnalyticsProvider,
  type AnalyticsProvider,
} from "@/analytics/umami";

export { analyticsService, AnalyticsService } from "@/analytics/service";
export { trackServerEvent } from "@/analytics/server";
export { usePageViewTracking, useWalletPageAnalytics } from "@/analytics/hooks";
