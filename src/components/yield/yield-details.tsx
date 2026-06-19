"use client";

import { memo, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DUST_MIN_VALUE_USD } from "@/lib/constants/trust";
import { formatApy, formatTokenAmount, formatUsd } from "@/lib/utils";
import type { ChainYieldGroup, Position, ProtocolYieldGroup } from "@/types/yield";
import { ChainBadge } from "./chain-badge";
import {
  YieldEmptyState,
  type YieldEmptyStateVariant,
} from "./yield-empty-state";

interface YieldDetailsProps {
  chains: ChainYieldGroup[];
  emptyStateVariant?: YieldEmptyStateVariant | null;
}

function formatPortfolioContext(chainCount: number, protocolCount: number): string {
  const chainLabel = chainCount === 1 ? "chain" : "chains";
  const protocolLabel = protocolCount === 1 ? "protocol" : "protocols";
  return `Across ${protocolCount} ${protocolLabel} on ${chainCount} ${chainLabel}`;
}

function isDustPosition(position: Position): boolean {
  return position.valueUsd > 0 && position.valueUsd < DUST_MIN_VALUE_USD;
}

function filterVisiblePositions(
  positions: Position[],
  showDust: boolean,
): Position[] {
  if (showDust) return positions;
  return positions.filter((pos) => !isDustPosition(pos));
}

function countDustPositions(chains: ChainYieldGroup[]): number {
  let count = 0;
  for (const chain of chains) {
    for (const protocol of chain.protocols) {
      for (const position of protocol.positions) {
        if (isDustPosition(position)) count += 1;
      }
    }
  }
  return count;
}

const PositionCard = memo(function PositionCard({
  balance,
  label,
  asset,
  valueUsd,
  apy,
  monthlyYieldUsd,
}: {
  balance: string;
  label?: string;
  asset: string;
  valueUsd: number;
  apy: number | null;
  monthlyYieldUsd: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-zinc-500">Balance</dt>
        <dd className="text-right font-medium">
          {formatTokenAmount(balance)} {label ?? asset}
        </dd>
        <dt className="text-zinc-500">Value</dt>
        <dd className="text-right font-medium">{formatUsd(valueUsd)}</dd>
        <dt className="text-zinc-500">Estimated APY</dt>
        <dd className="text-right font-medium">{formatApy(apy)}</dd>
        <dt className="text-zinc-500">Monthly Yield</dt>
        <dd className="text-right font-medium text-emerald-600">
          {apy !== null ? formatUsd(monthlyYieldUsd) : "—"}
        </dd>
      </dl>
    </div>
  );
});

const ProtocolSection = memo(function ProtocolSection({
  protocol,
  showDust,
}: {
  protocol: ProtocolYieldGroup;
  showDust: boolean;
}) {
  const visiblePositions = filterVisiblePositions(protocol.positions, showDust);
  if (visiblePositions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
          {protocol.protocolName}
        </h4>
        <span className="text-sm font-medium text-emerald-600">
          {formatUsd(protocol.monthlyYieldUsd)}/mo
        </span>
      </div>
      <div className="space-y-3">
        {visiblePositions.map((pos) => (
          <PositionCard
            key={pos.sourceId ?? `${pos.chainId}-${pos.protocolId}-${pos.asset}-${pos.balance}`}
            balance={pos.balance}
            label={pos.label}
            asset={pos.asset}
            valueUsd={pos.valueUsd}
            apy={pos.apy}
            monthlyYieldUsd={pos.monthlyYieldUsd}
          />
        ))}
      </div>
    </div>
  );
});

const ChainSection = memo(function ChainSection({
  chain,
  showDust,
}: {
  chain: ChainYieldGroup;
  showDust: boolean;
}) {
  const visibleProtocols = chain.protocols
    .map((protocol) => ({
      protocol,
      visibleCount: filterVisiblePositions(protocol.positions, showDust).length,
    }))
    .filter(({ visibleCount }) => visibleCount > 0);

  if (visibleProtocols.length === 0) return null;

  return (
    <AccordionItem value={chain.chainId} className="border-zinc-200 dark:border-zinc-800">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-1 items-center gap-2 text-left">
          <ChainBadge badge={chain.chainBadge} />
          <span className="font-semibold">{chain.chainName}</span>
          <span className="ml-auto text-sm font-medium text-emerald-600">
            {formatUsd(chain.monthlyYieldUsd)}/mo
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-2">
          <dl className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <dt className="text-zinc-500">Value</dt>
            <dd className="text-right font-medium">{formatUsd(chain.totalValueUsd)}</dd>
            <dt className="text-zinc-500">Monthly Yield</dt>
            <dd className="text-right font-medium text-emerald-600">
              {formatUsd(chain.monthlyYieldUsd)}
            </dd>
            <dt className="text-zinc-500">Protocols</dt>
            <dd className="text-right font-medium">{chain.protocolCount}</dd>
          </dl>

          <div className="space-y-6">
            {visibleProtocols.map(({ protocol }) => (
              <ProtocolSection
                key={`${chain.chainId}-${protocol.protocolId}`}
                protocol={protocol}
                showDust={showDust}
              />
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

export function YieldDetails({ chains, emptyStateVariant }: YieldDetailsProps) {
  const [showDust, setShowDust] = useState(false);
  const dustCount = useMemo(() => countDustPositions(chains), [chains]);

  const defaultOpen = useMemo(
    () => (chains.length > 0 ? [chains[0].chainId] : []),
    [chains],
  );

  const { chainCount, protocolCount } = useMemo(() => {
    const protocolIds = new Set<string>();
    for (const chain of chains) {
      for (const protocol of chain.protocols) {
        protocolIds.add(protocol.protocolId);
      }
    }
    return { chainCount: chains.length, protocolCount: protocolIds.size };
  }, [chains]);

  if (chains.length === 0 && emptyStateVariant) {
    return <YieldEmptyState variant={emptyStateVariant} />;
  }

  if (chains.length === 0) {
    return <YieldEmptyState variant="empty" />;
  }

  const visibleChains = chains.filter((chain) =>
    chain.protocols.some(
      (protocol) =>
        filterVisiblePositions(protocol.positions, showDust).length > 0,
    ),
  );

  if (visibleChains.length === 0 && dustCount > 0 && !showDust) {
    return (
      <section className="space-y-4">
        <p className="text-center text-sm text-zinc-500">
          All positions are below {formatUsd(DUST_MIN_VALUE_USD)} and hidden by
          default.
        </p>
        <button
          type="button"
          onClick={() => setShowDust(true)}
          className="mx-auto block text-sm text-emerald-600 underline-offset-2 hover:underline"
        >
          Hidden dust positions: {dustCount} — click to reveal
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="text-center">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Yield by Chain
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          {formatPortfolioContext(chainCount, protocolCount)}
        </p>
      </div>

      <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
        {visibleChains.map((chain) => (
          <ChainSection key={chain.chainId} chain={chain} showDust={showDust} />
        ))}
      </Accordion>

      {dustCount > 0 && !showDust && (
        <button
          type="button"
          onClick={() => setShowDust(true)}
          className="mx-auto block text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-emerald-600 hover:underline"
        >
          Hidden dust positions: {dustCount} — click to reveal
        </button>
      )}
    </section>
  );
}
