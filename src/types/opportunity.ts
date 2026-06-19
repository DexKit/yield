import type { ChainId } from "@/types/chain";

/** Idle wallet assets eligible for opportunity analysis. */
export type IdleAssetSymbol = "ETH" | "WETH" | "USDC" | "USDT" | "DAI";

export interface IdleTokenConfig {
  symbol: IdleAssetSymbol;
  /** Native ETH when undefined. */
  address?: `0x${string}`;
  decimals: number;
  priceSymbol: string;
}

export interface IdleAssetBalance {
  symbol: IdleAssetSymbol;
  chainId: ChainId;
  balanceHuman: number;
  valueUsd: number;
}

export interface OpportunityLineItem {
  asset: IdleAssetSymbol;
  chainId: ChainId;
  chainBadge: string;
  balanceHuman: number;
  valueUsd: number;
  benchmarkId: string;
  benchmarkProtocolId: string;
  benchmarkProtocolName: string;
  benchmarkApy: number;
  estimatedDailyUsd: number;
  estimatedMonthlyUsd: number;
  estimatedYearlyUsd: number;
}

export interface YieldOpportunitySummary {
  currentMonthlyUsd: number;
  additionalMonthlyUsd: number;
  potentialTotalMonthlyUsd: number;
  additionalDailyUsd: number;
  additionalYearlyUsd: number;
}

export interface YieldOpportunityResult {
  items: OpportunityLineItem[];
  summary: YieldOpportunitySummary;
  hasOpportunity: boolean;
  /** True when idle token balances were detected (even if no yield opportunity). */
  hasDetectedAssets: boolean;
}

/** Minimum idle balance value (USD) to include in opportunity estimates. */
export const OPPORTUNITY_MIN_VALUE_USD = 1;

export const OPPORTUNITY_DISCLAIMER =
  "Based on currently idle assets and available protocol yields. Estimates only — not financial advice.";
