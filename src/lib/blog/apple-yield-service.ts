import { cache } from "react";
import { computeYieldFromValue } from "@/lib/blog/yield-math";
import { fetchApy } from "@/lib/services/apy-service";
import { getTokenPriceUsd } from "@/lib/services/price-service";

/** Apple liquid treasury — FY2026 Q2 (Mar 28, 2026), millions USD per 10-Q. */
export const APPLE_TREASURY_Q2_FY2026 = {
  cashAndEquivalentsMillions: 45_572,
  marketableSecuritiesCurrentMillions: 22_935,
  marketableSecuritiesNonCurrentMillions: 78_088,
} as const;

export function appleTotalTreasuryUsd(): number {
  const t = APPLE_TREASURY_Q2_FY2026;
  return (
    (t.cashAndEquivalentsMillions +
      t.marketableSecuritiesCurrentMillions +
      t.marketableSecuritiesNonCurrentMillions) *
    1_000_000
  );
}

/** Hypothetical allocation: 50% of liquid treasury to ETH. */
export const APPLE_ETH_ALLOCATION_PCT = 50;

export const APPLE_COMPANY_NAME = "Apple (AAPL)";

/** Reference holdings for comparison copy — update periodically. */
export const CORP_ETH_TREASURY_TOTAL = 7_684_372;
export const BITMINE_ETH_HOLDINGS = 5_620_000;

const ETH_CIRCULATING_SUPPLY_FALLBACK = 120_683_512;

export interface AppleEthereumYieldResult {
  totalTreasuryUsd: number;
  allocationPct: number;
  allocatedUsd: number;
  ethPriceUsd: number;
  equivalentEth: number;
  ethCirculatingSupply: number;
  pctOfEthSupply: number;
  pctOfEthMarketCap: number;
  lidoApyPercent: number;
  dailyYieldUsd: number;
  monthlyYieldUsd: number;
  yearlyYieldUsd: number;
  calculatedAt: string;
}

async function fetchEthCirculatingSupply(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false",
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return ETH_CIRCULATING_SUPPLY_FALLBACK;
    const data = (await res.json()) as {
      market_data?: { circulating_supply?: number };
    };
    return data.market_data?.circulating_supply ?? ETH_CIRCULATING_SUPPLY_FALLBACK;
  } catch {
    return ETH_CIRCULATING_SUPPLY_FALLBACK;
  }
}

async function calculateAppleEthereumYield(): Promise<AppleEthereumYieldResult> {
  const [ethPriceUsd, lidoApy, ethSupply] = await Promise.all([
    getTokenPriceUsd("ethereum"),
    fetchApy("lido", "stETH", "ethereum"),
    fetchEthCirculatingSupply(),
  ]);

  const apyPercent = lidoApy ?? 3.1;
  const totalTreasuryUsd = appleTotalTreasuryUsd();
  const allocatedUsd = totalTreasuryUsd * (APPLE_ETH_ALLOCATION_PCT / 100);
  const equivalentEth = allocatedUsd / ethPriceUsd;
  const ethMarketCap = ethPriceUsd * ethSupply;
  const yields = computeYieldFromValue(allocatedUsd, apyPercent);

  return {
    totalTreasuryUsd,
    allocationPct: APPLE_ETH_ALLOCATION_PCT,
    allocatedUsd,
    ethPriceUsd,
    equivalentEth,
    ethCirculatingSupply: ethSupply,
    pctOfEthSupply: (equivalentEth / ethSupply) * 100,
    pctOfEthMarketCap: (allocatedUsd / ethMarketCap) * 100,
    lidoApyPercent: apyPercent,
    ...yields,
    calculatedAt: new Date().toISOString(),
  };
}

export const getCachedAppleEthereumYield = cache(calculateAppleEthereumYield);
