import type { Address, PublicClient } from "viem";
import { parseAbi } from "viem";

/** Swell swETH — exchange rate via getRate() (ETH per swETH, 1e18 scale). */
export const SWETH_TOKEN = "0xf951E335afb289353dc249e82926178EaC7DEd78" as Address;

/** Swell rswETH — liquid restaking token; getRate() is the on-chain rate provider. */
export const RSWETH_TOKEN = "0xfAe103DC9cf190eD75350761e95403b7b8aFa6c0" as Address;

const rateAbi = parseAbi(["function getRate() view returns (uint256)"]);

/** ~1 day of blocks at 12s slot time. */
const BLOCKS_PER_DAY = 7200n;

/**
 * Swell reprices via oracle snapshots (not every block), so use a longer
 * trailing window with endpoint simple APR — not daily median.
 */
const TRAILING_DAYS = 30;

function rateToFloat(rate: bigint): number {
  return Number(rate) / 1e18;
}

function simpleAnnualizedPercent(rateNow: number, ratePast: number, days: number): number {
  if (ratePast <= 0 || days <= 0) return 0;
  return ((rateNow - ratePast) / ratePast) * (365 / days) * 100;
}

function tokenAddressForAsset(asset: string): Address | null {
  if (asset === "swETH") return SWETH_TOKEN;
  if (asset === "rswETH") return RSWETH_TOKEN;
  return null;
}

export async function fetchSwellShareRate(
  client: PublicClient,
  asset: "swETH" | "rswETH",
): Promise<number> {
  const address = tokenAddressForAsset(asset);
  if (!address) throw new Error(`Unknown Swell asset: ${asset}`);

  const rate = await client.readContract({
    address,
    abi: rateAbi,
    functionName: "getRate",
  });
  return rateToFloat(rate);
}

/** Trailing simple APR from on-chain getRate() — matches Swell app methodology. */
export async function fetchSwellApyFromChain(
  client: PublicClient,
  asset: string,
): Promise<number | null> {
  const address = tokenAddressForAsset(asset);
  if (!address) return null;

  try {
    const latest = await client.getBlockNumber();
    const lookback = BigInt(TRAILING_DAYS) * BLOCKS_PER_DAY;
    const pastBlock = latest > lookback ? latest - lookback : 0n;

    const [rateNow, ratePast] = await Promise.all([
      client.readContract({ address, abi: rateAbi, functionName: "getRate" }),
      client.readContract({
        address,
        abi: rateAbi,
        functionName: "getRate",
        blockNumber: pastBlock,
      }),
    ]);

    if (ratePast === 0n) return null;

    const apy = simpleAnnualizedPercent(
      rateToFloat(rateNow),
      rateToFloat(ratePast),
      TRAILING_DAYS,
    );
    return Number.isFinite(apy) && apy > 0 ? apy : null;
  } catch {
    return null;
  }
}
