import { formatUsd } from "@/lib/utils";
import { OPPORTUNITY_DISCLAIMER } from "@/types/opportunity";
import type { YieldOpportunityResult } from "@/types/opportunity";

interface YieldOpportunityProps {
  opportunity: YieldOpportunityResult;
}

export function YieldOpportunity({ opportunity }: YieldOpportunityProps) {
  const { summary, items, hasOpportunity } = opportunity;

  return (
    <section
      className="space-y-6 rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30"
      aria-label="Yield opportunity estimate"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Yield Opportunity
        </h2>
        <p className="text-xs text-zinc-400">{OPPORTUNITY_DISCLAIMER}</p>
      </div>

      <dl className="space-y-4">
        <div className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-700">
          <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Current Yield
          </dt>
          <dd className="text-right text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {formatUsd(summary.currentMonthlyUsd)}
            <span className="text-sm font-normal text-zinc-400">/mo</span>
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-700">
          <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Yield Opportunity
          </dt>
          <dd className="text-right text-xl font-bold tabular-nums text-yield-accent sm:text-2xl">
            {hasOpportunity ? "+" : ""}
            {formatUsd(summary.additionalMonthlyUsd)}
            <span className="text-sm font-normal text-zinc-400">/mo</span>
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Potential Total Yield
          </dt>
          <dd className="text-right text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {formatUsd(summary.potentialTotalMonthlyUsd)}
            <span className="text-sm font-normal text-zinc-400">/mo</span>
          </dd>
        </div>
      </dl>

      {hasOpportunity && items.length > 0 && (
        <div className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
            Estimated from idle assets
          </p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={`${item.chainId}-${item.asset}-${item.benchmarkId}`}
                className="flex flex-col gap-1 rounded-lg border border-zinc-100 bg-white px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-2 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <span className="min-w-0 text-zinc-700 dark:text-zinc-300">
                  {item.balanceHuman.toLocaleString("en-US", {
                    maximumFractionDigits: 4,
                  })}{" "}
                  {item.asset}
                  <span className="ml-1 text-xs text-zinc-400">
                    ({item.chainBadge})
                  </span>
                </span>
                <span className="shrink-0 text-left text-xs text-zinc-500 sm:text-right">
                  {item.benchmarkProtocolName} ~{item.benchmarkApy.toFixed(1)}%
                  · +{formatUsd(item.estimatedMonthlyUsd)}/mo
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasOpportunity && (
        <p className="text-center text-sm text-zinc-500">
          No estimated opportunity from idle assets at this time.
        </p>
      )}
    </section>
  );
}
