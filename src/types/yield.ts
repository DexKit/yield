import type { ChainId } from "./chain";
import type { CurrencyCode } from "./currency";
import type { ProtocolId, SupportedAsset } from "./protocol";

export type IdentifierType =
  | "evm-address"
  | "ens"
  | "solana-address"
  | "unknown";

export interface ResolvedIdentifier {
  raw: string;
  type: IdentifierType;
  address: `0x${string}` | null;
  ensName: string | null;
  /** Primary chain for ENS resolution; EVM wallets span all active chains. */
  chainId: ChainId | null;
}

export interface Position {
  protocolId: ProtocolId;
  protocolName: string;
  asset: SupportedAsset;
  label?: string;
  sourceId?: string;
  balance: string;
  balanceRaw: bigint;
  chainId: ChainId;
  valueUsd: number;
  apy: number | null;
  dailyYieldUsd: number;
  monthlyYieldUsd: number;
  yearlyYieldUsd: number;
}

export interface YieldSummary {
  dailyUsd: number;
  monthlyUsd: number;
  yearlyUsd: number;
}

export interface ProtocolYieldGroup {
  protocolId: ProtocolId;
  protocolName: string;
  totalValueUsd: number;
  dailyYieldUsd: number;
  monthlyYieldUsd: number;
  yearlyYieldUsd: number;
  positions: Position[];
}

export interface ChainYieldGroup {
  chainId: ChainId;
  chainName: string;
  chainBadge: string;
  totalValueUsd: number;
  dailyYieldUsd: number;
  monthlyYieldUsd: number;
  yearlyYieldUsd: number;
  protocolCount: number;
  protocols: ProtocolYieldGroup[];
}

export interface YieldPortfolioStats {
  chainCount: number;
  protocolCount: number;
}

export interface WalletYieldResult {
  identifier: string;
  address: `0x${string}`;
  ensName: string | null;
  chains: ChainYieldGroup[];
  summary: YieldSummary;
  stats: YieldPortfolioStats;
  currency: CurrencyCode;
  calculatedAt: string;
}
