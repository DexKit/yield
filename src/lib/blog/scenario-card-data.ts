import type { CardData, CardRenderOptions, CardSummary } from "@/lib/cards/types";
import {
  getCachedFoundationStakingYield,
  ETHEREUM_FOUNDATION_NAME,
} from "@/lib/blog/foundation-yield-service";
import { FOUNDATION_STAKING_CARD_SLUG } from "@/lib/blog/foundation-card-url";
import {
  getCachedStrategyEthereumYield,
  STRATEGY_BTC_HOLDINGS,
  STRATEGY_COMPANY_NAME,
} from "@/lib/blog/strategy-yield-service";
import {
  getCachedValidatorRevenueAnalysis,
  getScenarioById,
} from "@/lib/blog/validator-revenue-service";
import { VALIDATOR_REVENUE_CARD_SLUG } from "@/lib/blog/validator-revenue-card-url";
import { SCENARIO_CARD_SLUGS } from "@/lib/blog/scenario-card-slugs";
import { formatCompactAmount, formatCompactUsd, formatMoney } from "@/lib/utils";
import type { YieldSummary } from "@/types/yield";

async function buildCardSummary(
  summaryUsd: YieldSummary,
  currency: CardSummary["currency"],
): Promise<CardSummary> {
  if (currency === "USD") {
    return { ...summaryUsd, currency };
  }

  const { convertUsdAmount } = await import("@/lib/services/currency-service");
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

async function buildStrategyScenarioCard(
  options: CardRenderOptions,
): Promise<CardData> {
  const result = await getCachedStrategyEthereumYield();
  const summary = await buildCardSummary(
    {
      dailyUsd: result.dailyYieldUsd,
      monthlyUsd: result.monthlyYieldUsd,
      yearlyUsd: result.yearlyYieldUsd,
    },
    options.currency,
  );

  const btcLabel =
    STRATEGY_BTC_HOLDINGS >= 1000
      ? `${Math.round(STRATEGY_BTC_HOLDINGS / 1000)}k BTC`
      : `${STRATEGY_BTC_HOLDINGS} BTC`;

  return {
    cardType: "scenario",
    walletLabel: `${STRATEGY_COMPANY_NAME} · ETH yield?`,
    subtitle: `${btcLabel} treasury → ETH at ${result.lidoApyPercent.toFixed(1)}% APY (Lido)`,
    heroLine: "Estimated monthly yield if treasury were in ETH (Lido)",
    comparisonLine: "vs $0/mo holding Bitcoin",
    footerLine: `${STRATEGY_COMPANY_NAME} · Powered by DexKit`,
    summary,
    theme: options.theme,
    calculatedAt: result.calculatedAt,
  };
}

async function buildFoundationScenarioCard(
  options: CardRenderOptions,
): Promise<CardData> {
  const result = await getCachedFoundationStakingYield();
  const summary = await buildCardSummary(
    {
      dailyUsd: result.dailyYieldUsd,
      monthlyUsd: result.monthlyYieldUsd,
      yearlyUsd: result.yearlyYieldUsd,
    },
    options.currency,
  );

  const ethLabel =
    result.ethBalance >= 1000
      ? `${formatCompactAmount(result.ethBalance)} ETH`
      : `${result.ethBalance.toFixed(2)} ETH`;

  const currentMonthly = formatMoney(result.currentMonthlyYieldUsd);
  const comparisonLine =
    result.currentMonthlyYieldUsd > 0
      ? `vs ${currentMonthly}/mo earned today`
      : "vs $0/mo — idle ETH not staked";

  return {
    cardType: "scenario",
    walletLabel: `${ETHEREUM_FOUNDATION_NAME} · stake idle ETH?`,
    subtitle: `${ethLabel} in wallet · ${result.lidoApyPercent.toFixed(1)}% APY (Lido)`,
    heroLine: "Estimated monthly yield if wallet ETH were staked",
    comparisonLine,
    footerLine: `${ETHEREUM_FOUNDATION_NAME} · Powered by DexKit`,
    summary,
    theme: options.theme,
    calculatedAt: result.calculatedAt,
  };
}

async function buildValidatorRevenueScenarioCard(
  options: CardRenderOptions,
): Promise<CardData> {
  const analysis = await getCachedValidatorRevenueAnalysis();
  const scenario = getScenarioById(analysis, "current");

  const summary = await buildCardSummary(
    {
      dailyUsd: scenario.tenPercent.usd / 365,
      monthlyUsd: scenario.tenPercent.usd / 12,
      yearlyUsd: scenario.tenPercent.usd,
    },
    options.currency,
  );

  const stakedM = Math.round(scenario.stakedEth / 1_000_000);
  const ratioPct = (scenario.stakingRatio * 100).toFixed(0);
  const onePctUsd = scenario.onePercent.usd;
  const coreDevM = analysis.coreDevMinViableAnnualUsd / 1_000_000;

  return {
    cardType: "scenario",
    walletLabel: "10% of validator revenue",
    subtitle: `${stakedM}M ETH staked (${ratioPct}%) · ${scenario.validatorApyPercent.toFixed(1)}% APY`,
    heroLine: "Estimated annual funding from 10% of validator revenue",
    comparisonLine: `1% alone ≈ ${formatCompactUsd(onePctUsd)}/yr · core dev floor ~$${coreDevM.toFixed(0)}M`,
    footerLine: "Ethereum network · Powered by DexKit",
    summary,
    theme: options.theme,
    calculatedAt: analysis.calculatedAt,
  };
}

export async function buildScenarioCardData(
  slug: string,
  options: CardRenderOptions,
): Promise<CardData | null> {
  switch (slug) {
    case SCENARIO_CARD_SLUGS.strategyEthereum:
      return buildStrategyScenarioCard(options);
    case SCENARIO_CARD_SLUGS.foundationStaking:
    case FOUNDATION_STAKING_CARD_SLUG:
      return buildFoundationScenarioCard(options);
    case SCENARIO_CARD_SLUGS.validatorRevenueTenPct:
    case VALIDATOR_REVENUE_CARD_SLUG:
      return buildValidatorRevenueScenarioCard(options);
    default:
      return null;
  }
}
