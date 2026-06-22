import { cache } from "react";
import { scanIdleAssets } from "@/lib/opportunity/idle-asset-scanner";
import { fetchApy } from "@/lib/services/apy-service";
import { getTokenPriceUsd } from "@/lib/services/price-service";
import { computeYieldFromValue } from "@/lib/blog/yield-math";
import type { WalletYieldResult } from "@/types/yield";

/**
 * EF DeFi multisig — labeled on Etherscan, used for treasury DeFi participation.
 * @see https://etherscan.io/address/0x9fC3dc011b461664c835F2527fffb1169b3C213e
 */
export const ETHEREUM_FOUNDATION_WALLET =
  "0x9fC3dc011b461664c835F2527fffb1169b3C213e" as const;

export const ETHEREUM_FOUNDATION_NAME = "Ethereum Foundation";

export interface FoundationStakingYieldResult {
  wallet: typeof ETHEREUM_FOUNDATION_WALLET;
  ethBalance: number;
  ethPriceUsd: number;
  stakeValueUsd: number;
  lidoApyPercent: number;
  dailyYieldUsd: number;
  monthlyYieldUsd: number;
  yearlyYieldUsd: number;
  currentDailyYieldUsd: number;
  currentMonthlyYieldUsd: number;
  currentYearlyYieldUsd: number;
  calculatedAt: string;
}

function sumEthEquivalent(
  balances: Awaited<ReturnType<typeof scanIdleAssets>>,
): { ethBalance: number; stakeValueUsd: number } {
  let ethBalance = 0;
  let stakeValueUsd = 0;

  for (const balance of balances) {
    if (balance.symbol !== "ETH" && balance.symbol !== "WETH") continue;
    ethBalance += balance.balanceHuman;
    stakeValueUsd += balance.valueUsd;
  }

  return { ethBalance, stakeValueUsd };
}

const BLOG_YIELD_TIMEOUT_MS = 6_000;

/** Full wallet scan is slow; cap wait so blog pages do not hang compile/render. */
async function fetchFoundationCurrentYield(
  wallet: typeof ETHEREUM_FOUNDATION_WALLET,
): Promise<WalletYieldResult | null> {
  const { yieldService } = await import("@/lib/services/yield-service");
  return Promise.race([
    yieldService.calculateYield(wallet, "USD"),
    new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), BLOG_YIELD_TIMEOUT_MS),
    ),
  ]);
}

async function calculateFoundationStakingYield(): Promise<FoundationStakingYieldResult> {
  const wallet = ETHEREUM_FOUNDATION_WALLET;

  const [idleBalances, lidoApy, ethPriceUsd, currentYield] = await Promise.all([
    scanIdleAssets(wallet),
    fetchApy("lido", "stETH", "ethereum"),
    getTokenPriceUsd("ethereum"),
    fetchFoundationCurrentYield(wallet),
  ]);

  const apyPercent = lidoApy ?? 3.1;
  const { ethBalance, stakeValueUsd } = sumEthEquivalent(idleBalances);
  const yields = computeYieldFromValue(stakeValueUsd, apyPercent);

  return {
    wallet,
    ethBalance,
    ethPriceUsd,
    stakeValueUsd,
    lidoApyPercent: apyPercent,
    ...yields,
    currentDailyYieldUsd: currentYield?.summary.dailyUsd ?? 0,
    currentMonthlyYieldUsd: currentYield?.summary.monthlyUsd ?? 0,
    currentYearlyYieldUsd: currentYield?.summary.yearlyUsd ?? 0,
    calculatedAt: new Date().toISOString(),
  };
}

export const getCachedFoundationStakingYield = cache(calculateFoundationStakingYield);
