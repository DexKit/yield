import type {
  ChainYieldGroup,
  Position,
  ProtocolYieldGroup,
  WalletYieldResult,
  YieldPortfolioStats,
  YieldSummary,
} from "@/types/yield";

/** JSON-safe position (bigint → string). */
export interface SerializedPosition
  extends Omit<Position, "balanceRaw"> {
  balanceRaw: string;
}

export interface SerializedProtocolYieldGroup
  extends Omit<ProtocolYieldGroup, "positions"> {
  positions: SerializedPosition[];
}

export interface SerializedChainYieldGroup
  extends Omit<ChainYieldGroup, "protocols"> {
  protocols: SerializedProtocolYieldGroup[];
}

/** Public API response for widgets and third-party consumers. */
export interface WalletYieldApiResponse {
  identifier: string;
  address: string;
  ensName: string | null;
  summary: YieldSummary;
  stats: YieldPortfolioStats;
  chains: SerializedChainYieldGroup[];
  currency: string;
  calculatedAt: string;
}

function serializePosition(position: Position): SerializedPosition {
  return {
    ...position,
    balanceRaw: position.balanceRaw.toString(),
  };
}

function serializeProtocolGroup(
  group: ProtocolYieldGroup,
): SerializedProtocolYieldGroup {
  return {
    ...group,
    positions: group.positions.map(serializePosition),
  };
}

function serializeChainGroup(chain: ChainYieldGroup): SerializedChainYieldGroup {
  return {
    ...chain,
    protocols: chain.protocols.map(serializeProtocolGroup),
  };
}

export function serializeWalletYield(
  result: WalletYieldResult,
): WalletYieldApiResponse {
  return {
    identifier: result.identifier,
    address: result.address,
    ensName: result.ensName,
    summary: result.summary,
    stats: result.stats,
    chains: result.chains.map(serializeChainGroup),
    currency: result.currency,
    calculatedAt: result.calculatedAt,
  };
}
