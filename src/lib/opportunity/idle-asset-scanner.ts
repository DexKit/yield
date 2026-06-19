import type { ChainId } from "@/types/chain";
import type { IdleAssetSymbol, IdleTokenConfig } from "@/types/opportunity";
import { ACTIVE_CHAIN_IDS } from "@/lib/chains/chain-meta";
import { getEvmClient } from "@/lib/chains/clients";
import { getTokenPriceUsd } from "@/lib/services/price-service";
import type { PublicClient } from "viem";
import { erc20Abi, formatUnits, getAddress } from "viem";

/** Idle asset token addresses per active chain. */
const IDLE_TOKENS_BY_CHAIN: Partial<
  Record<ChainId, IdleTokenConfig[]>
> = {
  ethereum: [
    {
      symbol: "WETH",
      address: getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "USDC",
      address: getAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "USDT",
      address: getAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7"),
      decimals: 6,
      priceSymbol: "tether",
    },
    {
      symbol: "DAI",
      address: getAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
      decimals: 18,
      priceSymbol: "dai",
    },
  ],
  base: [
    {
      symbol: "WETH",
      address: getAddress("0x4200000000000000000000000000000000000006"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "USDC",
      address: getAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "DAI",
      address: getAddress("0x50C5725949A6f0c72e6C4a641f24049A917db376"),
      decimals: 18,
      priceSymbol: "dai",
    },
  ],
  arbitrum: [
    {
      symbol: "WETH",
      address: getAddress("0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "USDC",
      address: getAddress("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "USDT",
      address: getAddress("0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"),
      decimals: 6,
      priceSymbol: "tether",
    },
    {
      symbol: "DAI",
      address: getAddress("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"),
      decimals: 18,
      priceSymbol: "dai",
    },
  ],
  optimism: [
    {
      symbol: "WETH",
      address: getAddress("0x4200000000000000000000000000000000000006"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "USDC",
      address: getAddress("0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "USDT",
      address: getAddress("0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"),
      decimals: 6,
      priceSymbol: "tether",
    },
    {
      symbol: "DAI",
      address: getAddress("0xDA10009CBd5d07Dd0Cc65113496b2f4639393697"),
      decimals: 18,
      priceSymbol: "dai",
    },
  ],
};

export interface ScannedIdleBalance {
  symbol: IdleAssetSymbol;
  chainId: ChainId;
  balanceHuman: number;
  valueUsd: number;
}

async function readNativeEthBalance(
  client: PublicClient,
  wallet: `0x${string}`,
): Promise<number> {
  const wei = await client.getBalance({ address: wallet });
  return parseFloat(formatUnits(wei, 18));
}

async function readErc20Balance(
  client: PublicClient,
  token: IdleTokenConfig,
  wallet: `0x${string}`,
): Promise<number> {
  if (!token.address) return 0;
  try {
    const raw = await client.readContract({
      address: token.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [wallet],
    });
    return parseFloat(formatUnits(raw, token.decimals));
  } catch {
    // Wrong address, non-contract, or non-standard token — treat as zero so one
    // bad config does not break the opportunity section.
    return 0;
  }
}

/** Scan wallet for idle ETH / WETH / USDC / USDT / DAI balances on active chains. */
export async function scanIdleAssets(
  wallet: `0x${string}`,
): Promise<ScannedIdleBalance[]> {
  const results: ScannedIdleBalance[] = [];

  await Promise.all(
    ACTIVE_CHAIN_IDS.map(async (chainId) => {
      const client = getEvmClient(chainId);
      const tokens = IDLE_TOKENS_BY_CHAIN[chainId];
      if (!tokens) return;

      const ethBalance = await readNativeEthBalance(client, wallet);
      if (ethBalance > 0) {
        const priceUsd = await getTokenPriceUsd("ethereum");
        results.push({
          symbol: "ETH",
          chainId,
          balanceHuman: ethBalance,
          valueUsd: ethBalance * priceUsd,
        });
      }

      for (const token of tokens) {
        const balanceHuman = await readErc20Balance(client, token, wallet);
        if (balanceHuman <= 0) continue;
        const priceUsd = await getTokenPriceUsd(token.priceSymbol);
        results.push({
          symbol: token.symbol,
          chainId,
          balanceHuman,
          valueUsd: balanceHuman * priceUsd,
        });
      }
    }),
  );

  return results;
}
