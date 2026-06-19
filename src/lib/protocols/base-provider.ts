import type { ChainId } from "@/types/chain";
import type { TokenConfig } from "@/types/protocol";
import type { Position } from "@/types/yield";
import type { PublicClient } from "viem";
import { erc20Abi, formatUnits, parseAbi } from "viem";
import { fetchApy } from "@/lib/services/apy-service";
import { getTokenPriceUsd } from "@/lib/services/price-service";

const ERC20_BALANCE_ABI = erc20Abi;
const accountantAbi = parseAbi(["function getRate() view returns (uint256)"]);
const erc4626Abi = parseAbi([
  "function convertToAssets(uint256 shares) view returns (uint256)",
]);

async function resolveErc4626UnderlyingBalance(
  client: PublicClient,
  token: TokenConfig,
  balanceRaw: bigint,
): Promise<number> {
  const assetsRaw = await client.readContract({
    address: token.address,
    abi: erc4626Abi,
    functionName: "convertToAssets",
    args: [balanceRaw],
  });
  const decimals = token.underlyingDecimals ?? token.decimals;
  return parseFloat(formatUnits(assetsRaw, decimals));
}

const mTokenAbi = parseAbi([
  "function exchangeRateStored() view returns (uint256)",
]);

async function resolveMTokenUnderlyingBalance(
  client: PublicClient,
  token: TokenConfig,
  balanceRaw: bigint,
): Promise<number> {
  const exchangeRate = await client.readContract({
    address: token.address,
    abi: mTokenAbi,
    functionName: "exchangeRateStored",
  });
  const underlyingRaw = (balanceRaw * exchangeRate) / 10n ** 18n;
  const underlyingDecimals = token.underlyingDecimals ?? token.decimals;
  return parseFloat(formatUnits(underlyingRaw, underlyingDecimals));
}

async function resolveUnderlyingBalance(
  client: PublicClient,
  token: TokenConfig,
  balanceRaw: bigint,
): Promise<number> {
  if (token.erc4626) {
    return resolveErc4626UnderlyingBalance(client, token, balanceRaw);
  }
  if (token.mToken) {
    return resolveMTokenUnderlyingBalance(client, token, balanceRaw);
  }
  return parseFloat(formatUnits(balanceRaw, token.decimals));
}

async function resolveEthEquivalentBalance(
  client: PublicClient,
  token: TokenConfig,
  balanceHuman: number,
): Promise<number> {
  if (!token.shareRateAccountant) return balanceHuman;

  const rate = await client.readContract({
    address: token.shareRateAccountant,
    abi: accountantAbi,
    functionName: "getRate",
  });

  return balanceHuman * (Number(rate) / 1e18);
}

export async function fetchTokenBalance(
  client: PublicClient,
  token: TokenConfig,
  wallet: `0x${string}`,
): Promise<bigint> {
  try {
    return await client.readContract({
      address: token.address,
      abi: ERC20_BALANCE_ABI,
      functionName: "balanceOf",
      args: [wallet],
    });
  } catch {
    // Wrong address, non-contract, or non-standard token — treat as zero balance
    // so one bad config does not break the entire yield page.
    return 0n;
  }
}

export function computeYieldFromBalance(
  balanceHuman: number,
  valueUsd: number,
  apy: number | null,
  base: {
    protocolId: Position["protocolId"];
    protocolName: string;
    asset: Position["asset"];
    balance: string;
    balanceRaw: bigint;
    chainId: Position["chainId"];
    label?: string;
    sourceId?: string;
  },
): Position {
  if (apy === null || valueUsd <= 0) {
    return {
      ...base,
      valueUsd,
      apy: null,
      dailyYieldUsd: 0,
      monthlyYieldUsd: 0,
      yearlyYieldUsd: 0,
    };
  }

  const yearlyYieldUsd = valueUsd * (apy / 100);
  const monthlyYieldUsd = yearlyYieldUsd / 12;
  const dailyYieldUsd = yearlyYieldUsd / 365;

  return {
    ...base,
    valueUsd,
    apy,
    dailyYieldUsd,
    monthlyYieldUsd,
    yearlyYieldUsd,
  };
}

export async function buildPositionFromToken(
  client: PublicClient,
  token: TokenConfig,
  wallet: `0x${string}`,
  protocolId: Position["protocolId"],
  protocolName: string,
  chainId: ChainId,
  visibilityOnly = false,
): Promise<Position | null> {
  const balanceRaw = await fetchTokenBalance(client, token, wallet);
  if (balanceRaw === 0n) return null;

  const balanceHuman = await resolveUnderlyingBalance(client, token, balanceRaw);
  const ethEquivalent =
    token.erc4626 || token.mToken
      ? balanceHuman
      : await resolveEthEquivalentBalance(client, token, balanceHuman);
  const priceUsd = await getTokenPriceUsd(token.priceSymbol);
  const valueUsd = ethEquivalent * priceUsd;
  const apy = visibilityOnly
    ? null
    : await fetchApy(protocolId, token.symbol, chainId);

  return computeYieldFromBalance(balanceHuman, valueUsd, apy, {
    protocolId,
    protocolName,
    asset: token.symbol,
    balance: balanceHuman.toString(),
    balanceRaw,
    chainId,
  });
}
