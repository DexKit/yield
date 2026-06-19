import {
  AnalyticsEvents,
  type AnalyticsChainId,
  type AnalyticsProtocolId,
  type ApiEndpoint,
  type ApiRequestStatus,
  type DownloadCardType,
  type SharePlatform,
  type WalletSearchResultType,
  type WalletSearchType,
} from "@/analytics/events";
import {
  bucketOpportunityRange,
  classifyPageType,
} from "@/analytics/normalize";
import {
  createUmamiProvider,
  type AnalyticsProvider,
} from "@/analytics/umami";

export class AnalyticsService {
  constructor(private readonly provider: AnalyticsProvider) {}

  isEnabled(): boolean {
    return this.provider.isEnabled();
  }

  trackPageView(pathname = "/"): void {
    this.provider.track(AnalyticsEvents.PAGE_VIEW, {
      pageType: classifyPageType(pathname),
    });
  }

  trackWalletSearch(
    walletType: WalletSearchType,
    resultType: WalletSearchResultType,
  ): void {
    this.provider.track(AnalyticsEvents.WALLET_SEARCH, {
      walletType,
      resultType,
    });
  }

  trackShare(platform: SharePlatform): void {
    this.provider.track(AnalyticsEvents.SHARE_CLICK, { platform });
  }

  trackDownloadCard(cardType: DownloadCardType = "default"): void {
    this.provider.track(AnalyticsEvents.DOWNLOAD_CARD, { cardType });
  }

  trackYieldOpportunityView(
    hasOpportunity: boolean,
    additionalMonthlyUsd: number,
  ): void {
    this.provider.track(AnalyticsEvents.YIELD_OPPORTUNITY_VIEW, {
      hasOpportunity: hasOpportunity ? "true" : "false",
      opportunityRange: bucketOpportunityRange(additionalMonthlyUsd),
    });
  }

  trackApiUsage(endpoint: ApiEndpoint, status: ApiRequestStatus): void {
    this.provider.track(AnalyticsEvents.API_REQUEST, { endpoint, status });
  }

  trackChainDetected(chain: AnalyticsChainId): void {
    this.provider.track(AnalyticsEvents.CHAIN_DETECTED, { chain });
  }

  trackProtocolDetected(protocol: AnalyticsProtocolId): void {
    this.provider.track(AnalyticsEvents.PROTOCOL_DETECTED, { protocol });
  }
}

export const analyticsService = new AnalyticsService(createUmamiProvider());
