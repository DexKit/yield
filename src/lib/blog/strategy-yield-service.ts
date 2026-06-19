import { cache } from "react";
import { computeYieldFromValue } from "@/lib/blog/yield-math";
import { fetchApy } from "@/lib/services/apy-service";
import { getTokenPriceUsd } from "@/lib/services/price-service";

/** MicroStrategy BTC treasury — update periodically from public filings. */
export const STRATEGY_BTC_HOLDINGS = 528_185;

export const STRATEGY_COMPANY_NAME = "Strategy (MSTR)";

export interface StrategyEthereumYieldResult {
  btcHoldings: number;
  btcPriceUsd: number;
  ethPriceUsd: number;
  treasuryValueUsd: number;
  equivalentEth: number;
  lidoApyPercent: number;
  dailyYieldUsd: number;
  monthlyYieldUsd: number;
  yearlyYieldUsd: number;
  calculatedAt: string;
}

async function calculateStrategyEthereumYield(): Promise<StrategyEthereumYieldResult> {
  const [btcPriceUsd, ethPriceUsd, lidoApy] = await Promise.all([
    getTokenPriceUsd("wrapped-bitcoin"),
    getTokenPriceUsd("ethereum"),
    fetchApy("lido", "stETH", "ethereum"),
  ]);

  const apyPercent = lidoApy ?? 3.1;
  const treasuryValueUsd = STRATEGY_BTC_HOLDINGS * btcPriceUsd;
  const equivalentEth = treasuryValueUsd / ethPriceUsd;
  const yields = computeYieldFromValue(treasuryValueUsd, apyPercent);

  return {
    btcHoldings: STRATEGY_BTC_HOLDINGS,
    btcPriceUsd,
    ethPriceUsd,
    treasuryValueUsd,
    equivalentEth,
    lidoApyPercent: apyPercent,
    ...yields,
    calculatedAt: new Date().toISOString(),
  };
}

export const getCachedStrategyEthereumYield = cache(calculateStrategyEthereumYield);
