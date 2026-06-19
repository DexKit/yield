import { formatUsd, truncateAddress } from "@/lib/utils";
import type { WalletYieldResult } from "@/types/yield";
import { WidgetFooter } from "./widget-footer";

interface WidgetShellProps {
  result: WalletYieldResult;
  children: React.ReactNode;
}

export function WidgetShell({ result, children }: WidgetShellProps) {
  const label = result.ensName ?? truncateAddress(result.address);

  return (
    <div className="mx-auto w-full max-w-md px-3 py-3 sm:px-4">
      <div className="space-y-3">
        <p className="truncate text-center text-xs text-zinc-500">{label}</p>
        {children}
        <WidgetFooter />
      </div>
    </div>
  );
}

interface CompactWidgetProps {
  result: WalletYieldResult;
}

export function CompactWidget({ result }: CompactWidgetProps) {
  return (
    <WidgetShell result={result}>
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Monthly Yield
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-600 sm:text-4xl">
          {formatUsd(result.summary.monthlyUsd)}
        </p>
      </div>
    </WidgetShell>
  );
}

interface StandardWidgetProps {
  result: WalletYieldResult;
}

export function StandardWidget({ result }: StandardWidgetProps) {
  const { summary } = result;

  return (
    <WidgetShell result={result}>
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Daily
          </dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {formatUsd(summary.dailyUsd)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Monthly
          </dt>
          <dd className="mt-1 text-xl font-bold text-emerald-600">
            {formatUsd(summary.monthlyUsd)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Yearly
          </dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {formatUsd(summary.yearlyUsd)}
          </dd>
        </div>
      </dl>
    </WidgetShell>
  );
}

interface AdvancedWidgetProps {
  result: WalletYieldResult;
}

export function AdvancedWidget({ result }: AdvancedWidgetProps) {
  const protocols = result.chains.flatMap((chain) =>
    chain.protocols.map((protocol) => ({
      key: `${chain.chainId}-${protocol.protocolId}`,
      name: protocol.protocolName,
      chainBadge: chain.chainBadge,
      monthlyYieldUsd: protocol.monthlyYieldUsd,
      totalValueUsd: protocol.totalValueUsd,
      positionCount: protocol.positions.length,
    })),
  );

  protocols.sort((a, b) => b.monthlyYieldUsd - a.monthlyYieldUsd);

  return (
    <WidgetShell result={result}>
      {protocols.length === 0 ? (
        <p className="text-center text-xs text-zinc-500">
          No supported yield positions found.
        </p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {protocols.map((protocol) => (
            <li
              key={protocol.key}
              className="flex items-center justify-between gap-2 rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                  {protocol.name}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {protocol.chainBadge} · {formatUsd(protocol.totalValueUsd)} ·{" "}
                  {protocol.positionCount}{" "}
                  {protocol.positionCount === 1 ? "position" : "positions"}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-emerald-600">
                {formatUsd(protocol.monthlyYieldUsd)}/mo
              </span>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
