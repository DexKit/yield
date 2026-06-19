import { formatUsd } from "@/lib/utils";
import type { CurrencyCode } from "@/types/currency";
import type { YieldPortfolioStats, YieldSummary } from "@/types/yield";

interface YieldHeroProps {
  summary: YieldSummary;
  stats: YieldPortfolioStats;
  currency?: CurrencyCode;
}

function formatPortfolioContext(stats: YieldPortfolioStats): string {
  const { protocolCount, chainCount } = stats;
  const chainLabel = chainCount === 1 ? "chain" : "chains";
  const protocolLabel = protocolCount === 1 ? "protocol" : "protocols";
  return `Across ${protocolCount} ${protocolLabel} on ${chainCount} ${chainLabel}`;
}

export function YieldHero({ summary, stats, currency = "USD" }: YieldHeroProps) {
  const hasPositions = stats.protocolCount > 0;

  return (
    <section className="space-y-8 text-center">
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
          <p className="text-5xl font-bold tracking-tight text-emerald-600 sm:text-6xl">
            {formatUsd(summary.monthlyUsd, currency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">Yearly</p>
          <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {formatUsd(summary.yearlyUsd, currency)}
          </p>
          {hasPositions && (
            <p className="mt-2 text-sm text-zinc-400">
              {formatPortfolioContext(stats)}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-zinc-400">
        Based on current balances and protocol yields.
      </p>
    </section>
  );
}
