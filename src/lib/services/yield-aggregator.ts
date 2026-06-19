import { getChainMeta } from "@/lib/chains/chain-meta";
import type { ChainId } from "@/types/chain";
import type { ProtocolId } from "@/types/protocol";
import type {
  ChainYieldGroup,
  Position,
  ProtocolYieldGroup,
  YieldPortfolioStats,
  YieldSummary,
} from "@/types/yield";

function sumYield(
  positions: Position[],
): Pick<ProtocolYieldGroup, "dailyYieldUsd" | "monthlyYieldUsd" | "yearlyYieldUsd"> {
  return positions.reduce(
    (acc, p) => ({
      dailyYieldUsd: acc.dailyYieldUsd + p.dailyYieldUsd,
      monthlyYieldUsd: acc.monthlyYieldUsd + p.monthlyYieldUsd,
      yearlyYieldUsd: acc.yearlyYieldUsd + p.yearlyYieldUsd,
    }),
    { dailyYieldUsd: 0, monthlyYieldUsd: 0, yearlyYieldUsd: 0 },
  );
}

function sumValue(positions: Position[]): number {
  return positions.reduce((acc, p) => acc + p.valueUsd, 0);
}

function sortByMonthlyYieldDesc<T extends { monthlyYieldUsd: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.monthlyYieldUsd - a.monthlyYieldUsd);
}

function buildProtocolGroups(positions: Position[]): ProtocolYieldGroup[] {
  const byProtocol = new Map<string, Position[]>();

  for (const position of positions) {
    const key = position.protocolId;
    const list = byProtocol.get(key) ?? [];
    list.push(position);
    byProtocol.set(key, list);
  }

  const groups: ProtocolYieldGroup[] = [];

  for (const [, protocolPositions] of byProtocol) {
    const sortedPositions = [...protocolPositions].sort((a, b) => b.monthlyYieldUsd - a.monthlyYieldUsd);
    const first = sortedPositions[0];
    const yields = sumYield(sortedPositions);

    groups.push({
      protocolId: first.protocolId,
      protocolName: first.protocolName,
      totalValueUsd: sumValue(sortedPositions),
      ...yields,
      positions: sortedPositions,
    });
  }

  return sortByMonthlyYieldDesc(groups);
}

export function buildChainYieldGroups(positions: Position[]): ChainYieldGroup[] {
  const byChain = new Map<ChainId, Position[]>();

  for (const position of positions) {
    const list = byChain.get(position.chainId) ?? [];
    list.push(position);
    byChain.set(position.chainId, list);
  }

  const chains: ChainYieldGroup[] = [];

  for (const [chainId, chainPositions] of byChain) {
    const meta = getChainMeta(chainId);
    const protocols = buildProtocolGroups(chainPositions);
    const yields = sumYield(chainPositions);

    chains.push({
      chainId,
      chainName: meta.name,
      chainBadge: meta.badge,
      totalValueUsd: sumValue(chainPositions),
      ...yields,
      protocolCount: protocols.length,
      protocols,
    });
  }

  return sortByMonthlyYieldDesc(chains);
}

export function aggregateSummaryFromChains(chains: ChainYieldGroup[]): YieldSummary {
  return chains.reduce(
    (acc, chain) => ({
      dailyUsd: acc.dailyUsd + chain.dailyYieldUsd,
      monthlyUsd: acc.monthlyUsd + chain.monthlyYieldUsd,
      yearlyUsd: acc.yearlyUsd + chain.yearlyYieldUsd,
    }),
    { dailyUsd: 0, monthlyUsd: 0, yearlyUsd: 0 },
  );
}

export function buildPortfolioStats(chains: ChainYieldGroup[]): YieldPortfolioStats {
  const protocolIds = new Set<ProtocolId>();

  for (const chain of chains) {
    for (const protocol of chain.protocols) {
      protocolIds.add(protocol.protocolId);
    }
  }

  return {
    chainCount: chains.length,
    protocolCount: protocolIds.size,
  };
}
