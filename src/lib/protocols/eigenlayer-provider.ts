import type { Address, PublicClient } from "viem";
import { erc20Abi, formatUnits } from "viem";
import type { Position } from "@/types/yield";
import type { SupportedAsset } from "@/types/protocol";
import type { ProtocolProvider } from "./types";
import { EIGENLAYER_CONFIG, PROTOCOL_CONFIGS } from "./tokens";
import {
  DELEGATION_MANAGER,
  EIGEN_POD_MANAGER,
  EIGENPOD_SHARES_TO_WEI,
  delegationManagerAbi,
  eigenPodManagerAbi,
  strategyAbi,
} from "./eigenlayer-contracts";
import { getTokenPriceUsd } from "@/lib/services/price-service";
import { fetchEigenLayerRestakedApy } from "@/lib/services/apy-service";
import { computeYieldFromBalance } from "./base-provider";

const UNDERLYING_TO_ASSET = buildUnderlyingAssetMap();

function buildUnderlyingAssetMap(): Map<string, SupportedAsset> {
  const map = new Map<string, SupportedAsset>();
  for (const protocol of PROTOCOL_CONFIGS) {
    for (const token of protocol.tokens) {
      map.set(token.address.toLowerCase(), token.symbol);
    }
  }
  return map;
}

function resolveAsset(underlying: Address, symbol: string): SupportedAsset {
  return (
    UNDERLYING_TO_ASSET.get(underlying.toLowerCase()) ??
    (symbol === "WETH" ? "aWETH" : "stETH")
  );
}

export class EigenLayerProvider implements ProtocolProvider {
  readonly id = "eigenlayer" as const;
  readonly chainId = "ethereum" as const;

  getProtocolName(): string {
    return EIGENLAYER_CONFIG.name;
  }

  async getPositions(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position[]> {
    const [lstPositions, nativePosition] = await Promise.all([
      this.getLstRestakedPositions(address, client),
      this.getNativeRestakedPosition(address, client),
    ]);

    return [...lstPositions, ...(nativePosition ? [nativePosition] : [])];
  }

  private async getLstRestakedPositions(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position[]> {
    const [strategies, shares] = await client.readContract({
      address: DELEGATION_MANAGER,
      abi: delegationManagerAbi,
      functionName: "getDepositedShares",
      args: [address],
    });

    const positions: Position[] = [];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      const shareAmount = shares[i];
      if (shareAmount === 0n) continue;

      const position = await this.buildStrategyPosition(
        client,
        address,
        strategy,
        shareAmount,
      );
      if (position) positions.push(position);
    }

    return positions;
  }

  private async buildStrategyPosition(
    client: PublicClient,
    address: `0x${string}`,
    strategy: Address,
    shareAmount: bigint,
  ): Promise<Position | null> {
    try {
      const [underlyingAmount, underlyingToken] = await Promise.all([
        client.readContract({
          address: strategy,
          abi: strategyAbi,
          functionName: "sharesToUnderlyingView",
          args: [shareAmount],
        }),
        client.readContract({
          address: strategy,
          abi: strategyAbi,
          functionName: "underlyingToken",
        }),
      ]);

      if (underlyingAmount === 0n) return null;

      const [symbol, decimals] = await Promise.all([
        client.readContract({
          address: underlyingToken,
          abi: erc20Abi,
          functionName: "symbol",
        }),
        client.readContract({
          address: underlyingToken,
          abi: erc20Abi,
          functionName: "decimals",
        }),
      ]);

      const balanceHuman = parseFloat(
        formatUnits(underlyingAmount, decimals),
      );
      if (balanceHuman <= 0) return null;

      const asset = resolveAsset(underlyingToken, symbol);
      const priceUsd = await getTokenPriceUsd("ethereum");
      const valueUsd = balanceHuman * priceUsd;
      const apy = await fetchEigenLayerRestakedApy(symbol, asset);

      return computeYieldFromBalance(balanceHuman, valueUsd, apy, {
        protocolId: "eigenlayer",
        protocolName: this.getProtocolName(),
        asset,
        label: `restaked ${symbol}`,
        sourceId: `eigenlayer-lst-${strategy.toLowerCase()}`,
        balance: balanceHuman.toString(),
        balanceRaw: underlyingAmount,
        chainId: this.chainId,
      });
    } catch {
      return null;
    }
  }

  private async getNativeRestakedPosition(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position | null> {
    try {
      const depositShares = await client.readContract({
        address: EIGEN_POD_MANAGER,
        abi: eigenPodManagerAbi,
        functionName: "podOwnerDepositShares",
        args: [address],
      });

      if (depositShares === 0n) return null;

      const balanceWei = depositShares * EIGENPOD_SHARES_TO_WEI;
      const balanceHuman = parseFloat(formatUnits(balanceWei, 18));
      if (balanceHuman <= 0) return null;

      const priceUsd = await getTokenPriceUsd("ethereum");
      const valueUsd = balanceHuman * priceUsd;
      const apy = await fetchEigenLayerRestakedApy("ETH", "stETH");

      return computeYieldFromBalance(balanceHuman, valueUsd, apy, {
        protocolId: "eigenlayer",
        protocolName: this.getProtocolName(),
        asset: "stETH",
        label: "restaked ETH (native)",
        sourceId: `eigenlayer-native-${address.toLowerCase()}`,
        balance: balanceHuman.toString(),
        balanceRaw: balanceWei,
        chainId: this.chainId,
      });
    } catch {
      return null;
    }
  }
}

export const eigenLayerProvider = new EigenLayerProvider();
