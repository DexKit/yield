import type {
  CardData,
  CardRenderOptions,
  CardSummary,
  CardTypeId,
} from "@/lib/cards/types";
import { buildScenarioCardData } from "@/lib/blog/scenario-card-data";
import { isScenarioCardSlug } from "@/lib/blog/scenario-card-slugs";
import {
  convertUsdAmount,
  getUsdExchangeRate,
} from "@/lib/services/currency-service";
import { yieldService } from "@/lib/services/yield-service";
import { getWalletDisplayName } from "@/lib/seo/wallet-url";
import { sanitizeIdentifierParam } from "@/lib/validation/identifier";
import type { YieldSummary } from "@/types/yield";

async function buildCardSummary(
  summaryUsd: YieldSummary,
  currency: CardSummary["currency"],
): Promise<CardSummary> {
  if (currency === "USD") {
    return { ...summaryUsd, currency };
  }

  const [daily, monthly, yearly] = await Promise.all([
    convertUsdAmount(summaryUsd.dailyUsd, currency),
    convertUsdAmount(summaryUsd.monthlyUsd, currency),
    convertUsdAmount(summaryUsd.yearlyUsd, currency),
  ]);

  return {
    dailyUsd: daily,
    monthlyUsd: monthly,
    yearlyUsd: yearly,
    currency,
  };
}

/**
 * Fetches yield via the shared Yield Engine — never recalculates protocol data here.
 */
export const cardDataProvider = {
  async getCardData(
    wallet: string,
    cardType: CardTypeId,
    options: CardRenderOptions,
  ): Promise<CardData | null> {
    if (cardType === "scenario" && isScenarioCardSlug(wallet)) {
      return buildScenarioCardData(wallet, options);
    }

    const sanitized = sanitizeIdentifierParam(wallet);
    const result = await yieldService.calculateYield(sanitized, "USD");

    if (!result) return null;

    const summary = await buildCardSummary(result.summary, options.currency);

    return {
      cardType,
      walletLabel: getWalletDisplayName(result),
      summary,
      theme: options.theme,
      calculatedAt: result.calculatedAt,
    };
  },

  /** Exposed for tests and future layouts that need raw USD + rate. */
  async getExchangeRate(currency: CardSummary["currency"]): Promise<number> {
    return getUsdExchangeRate(currency);
  },
};

export type CardDataProvider = typeof cardDataProvider;
