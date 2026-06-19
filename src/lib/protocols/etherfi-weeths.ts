import type { Address, PublicClient } from "viem";
import { parseAbi } from "viem";

/** weETHs (Super Symbiotic) boring-vault accountant — share price in ETH (1e18 scale). */
export const WEETHS_ACCOUNTANT = "0xbe16605B22a7faCEf247363312121670DFe5afBE" as Address;

const accountantAbi = parseAbi(["function getRate() view returns (uint256)"]);

/** ~1 day of blocks at 12s slot time. */
const BLOCKS_PER_DAY = 7200n;

/** Ether.fi documents weETHs yield as a 7-day trailing average APY. */
const TRAILING_DAYS = 7;

function rateToFloat(rate: bigint): number {
  return Number(rate) / 1e18;
}

function simpleAnnualizedPercent(rateNow: number, ratePast: number, days: number): number {
  if (ratePast <= 0 || days <= 0) return 0;
  return ((rateNow - ratePast) / ratePast) * (365 / days) * 100;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export async function fetchWeethsShareRate(client: PublicClient): Promise<number> {
  const rate = await client.readContract({
    address: WEETHS_ACCOUNTANT,
    abi: accountantAbi,
    functionName: "getRate",
  });
  return rateToFloat(rate);
}

async function readRateAtDayOffset(
  client: PublicClient,
  latestBlock: bigint,
  dayOffset: number,
): Promise<bigint> {
  const blockNumber =
    dayOffset === 0 ? undefined : latestBlock - BigInt(dayOffset) * BLOCKS_PER_DAY;

  return client.readContract({
    address: WEETHS_ACCOUNTANT,
    abi: accountantAbi,
    functionName: "getRate",
    ...(blockNumber !== undefined ? { blockNumber } : {}),
  });
}

/**
 * weETHs APY aligned with Ether.fi UI:
 * 7-day trailing average of daily simple-annualized share-price returns (FAQ).
 * Uses median across the 7 daily readings so one-off rebase spikes do not
 * inflate the figure (median ~3.45% → UI shows 3.5%).
 */
export async function fetchWeethsApyFromChain(client: PublicClient): Promise<number | null> {
  try {
    const latest = await client.getBlockNumber();
    const dailyApys: number[] = [];

    for (let day = 1; day <= TRAILING_DAYS; day++) {
      try {
        const [rateNow, ratePast] = await Promise.all([
          readRateAtDayOffset(client, latest, day - 1),
          readRateAtDayOffset(client, latest, day),
        ]);
        dailyApys.push(
          simpleAnnualizedPercent(rateToFloat(rateNow), rateToFloat(ratePast), 1),
        );
      } catch {
        // Archive gap — skip this day; need enough samples below.
      }
    }

    if (dailyApys.length >= 4) {
      return median(dailyApys);
    }

    // Fallback: 7-day simple APR (not compound) when daily history is unavailable.
    const lookback = BigInt(TRAILING_DAYS) * BLOCKS_PER_DAY;
    const pastBlock = latest > lookback ? latest - lookback : 0n;
    const [rateNow, ratePast] = await Promise.all([
      readRateAtDayOffset(client, latest, 0),
      client.readContract({
        address: WEETHS_ACCOUNTANT,
        abi: accountantAbi,
        functionName: "getRate",
        blockNumber: pastBlock,
      }),
    ]);

    if (ratePast === 0n) return null;

    const apy = simpleAnnualizedPercent(rateToFloat(rateNow), rateToFloat(ratePast), TRAILING_DAYS);
    return Number.isFinite(apy) && apy > 0 ? apy : null;
  } catch {
    return null;
  }
}
