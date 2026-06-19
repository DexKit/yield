import { getChainMeta } from "@/lib/chains/chain-meta";
import { benchmarkRegistry } from "@/lib/opportunity/benchmark-registry";
import { scanIdleAssets } from "@/lib/opportunity/idle-asset-scanner";
import type { YieldSummary } from "@/types/yield";
import type {
  OpportunityLineItem,
  YieldOpportunityResult,
  YieldOpportunitySummary,
} from "@/types/opportunity";
import { OPPORTUNITY_MIN_VALUE_USD } from "@/types/opportunity";

function computeYieldFromValue(
  valueUsd: number,
  apyPercent: number,
): Pick<
  OpportunityLineItem,
  "estimatedDailyUsd" | "estimatedMonthlyUsd" | "estimatedYearlyUsd"
> {
  const yearlyUsd = valueUsd * (apyPercent / 100);
  return {
    estimatedYearlyUsd: yearlyUsd,
    estimatedMonthlyUsd: yearlyUsd / 12,
    estimatedDailyUsd: yearlyUsd / 365,
  };
}

function buildSummary(
  current: YieldSummary,
  items: OpportunityLineItem[],
): YieldOpportunitySummary {
  const additionalDailyUsd = items.reduce(
    (sum, item) => sum + item.estimatedDailyUsd,
    0,
  );
  const additionalMonthlyUsd = items.reduce(
    (sum, item) => sum + item.estimatedMonthlyUsd,
    0,
  );
  const additionalYearlyUsd = items.reduce(
    (sum, item) => sum + item.estimatedYearlyUsd,
    0,
  );

  return {
    currentMonthlyUsd: current.monthlyUsd,
    additionalMonthlyUsd,
    potentialTotalMonthlyUsd: current.monthlyUsd + additionalMonthlyUsd,
    additionalDailyUsd,
    additionalYearlyUsd,
  };
}

export class YieldOpportunityService {
  /**
   * Estimate additional yield from idle assets using benchmark protocol APYs.
   * Not financial advice — objective calculation only.
   */
  async analyze(
    wallet: `0x${string}`,
    currentYield: YieldSummary,
  ): Promise<YieldOpportunityResult> {
    const idleBalances = await scanIdleAssets(wallet);

    const eligible = idleBalances.filter(
      (b) => b.valueUsd >= OPPORTUNITY_MIN_VALUE_USD,
    );

    const items: OpportunityLineItem[] = [];

    for (const balance of eligible) {
      const benchmark = benchmarkRegistry.resolveProvider(
        balance.symbol,
        balance.chainId,
      );
      if (!benchmark) continue;

      const apy = await benchmark.getApy();
      if (apy === null || apy <= 0) continue;

      const yields = computeYieldFromValue(balance.valueUsd, apy);
      const meta = getChainMeta(balance.chainId);

      items.push({
        asset: balance.symbol,
        chainId: balance.chainId,
        chainBadge: meta.badge,
        balanceHuman: balance.balanceHuman,
        valueUsd: balance.valueUsd,
        benchmarkId: benchmark.id,
        benchmarkProtocolId: benchmark.protocolId,
        benchmarkProtocolName: benchmark.protocolName,
        benchmarkApy: apy,
        ...yields,
      });
    }

    items.sort((a, b) => b.estimatedMonthlyUsd - a.estimatedMonthlyUsd);

    const summary = buildSummary(currentYield, items);

    return {
      items,
      summary,
      hasOpportunity:
        summary.additionalMonthlyUsd >= OPPORTUNITY_MIN_VALUE_USD / 12,
    };
  }
}

export const yieldOpportunityService = new YieldOpportunityService();
