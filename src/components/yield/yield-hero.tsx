import { formatUsd } from "@/lib/utils";
import type { ProtocolRateLine } from "@/lib/yield/rates-display";
import type { CurrencyCode } from "@/types/currency";
import type { YieldPortfolioStats, YieldSummary } from "@/types/yield";
import { CalculationLink } from "./calculation-link";
import { RatesUpdatedIndicator } from "./rates-updated-indicator";
import { ShareQuickActions } from "./share-quick-actions";
import type { ShareContext } from "@/lib/share/share-service";

interface YieldHeroProps {
  summary: YieldSummary;
  stats: YieldPortfolioStats;
  currency?: CurrencyCode;
  calculatedAt: string;
  protocolRates: ProtocolRateLine[];
  shareContext?: ShareContext;
}

function formatPortfolioContext(stats: YieldPortfolioStats): string {
  const { protocolCount, chainCount } = stats;
  const chainLabel = chainCount === 1 ? "chain" : "chains";
  const protocolLabel = protocolCount === 1 ? "protocol" : "protocols";
  return `Across ${protocolCount} ${protocolLabel} on ${chainCount} ${chainLabel}`;
}

export function YieldHero({
  summary,
  stats,
  currency = "USD",
  calculatedAt,
  protocolRates,
  shareContext,
}: YieldHeroProps) {
  const hasPositions = stats.protocolCount > 0;

  return (
    <section className="space-y-6 text-center">
      <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
        Estimated Earnings
      </h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-zinc-500">Daily</p>
          <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {formatUsd(summary.dailyUsd, currency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">Monthly</p>
          <p className="text-5xl font-bold tracking-tight text-yield-accent sm:text-6xl">
            {formatUsd(summary.monthlyUsd, currency)}
          </p>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-zinc-500">Yearly</p>
            <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {formatUsd(summary.yearlyUsd, currency)}
            </p>
          </div>

          {hasPositions && (
            <p className="text-sm text-zinc-400">
              {formatPortfolioContext(stats)}
            </p>
          )}

          <RatesUpdatedIndicator
            calculatedAt={calculatedAt}
            protocolRates={protocolRates}
          />
        </div>
      </div>

      {shareContext && (
        <ShareQuickActions context={shareContext} />
      )}

      <CalculationLink />
    </section>
  );
}
