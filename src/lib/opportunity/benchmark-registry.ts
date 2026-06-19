import type { ChainId } from "@/types/chain";
import type { ProtocolId } from "@/types/protocol";
import type { IdleAssetSymbol } from "@/types/opportunity";
import { fetchApy } from "@/lib/services/apy-service";

/** Benchmark APY source — extensible for user-selected providers (future). */
export interface BenchmarkProvider {
  readonly id: string;
  readonly protocolId: ProtocolId;
  readonly protocolName: string;
  readonly asset: IdleAssetSymbol;
  /** Receipt or pool symbol passed to fetchApy. */
  readonly apyAsset: string;
  /** Chain used for APY lookup when rates vary by network. */
  readonly apyChainId: ChainId;
  getApy(): Promise<number | null>;
}

function createApyBenchmarkProvider(config: {
  id: string;
  protocolId: ProtocolId;
  protocolName: string;
  asset: IdleAssetSymbol;
  apyAsset: string;
  apyChainId: ChainId;
}): BenchmarkProvider {
  return {
    ...config,
    async getApy() {
      return fetchApy(config.protocolId, config.apyAsset, config.apyChainId);
    },
  };
}

/** Default benchmark mappings per spec (ETH/WETH → Lido, USDC/USDT → Aave, DAI → Sky). */
const DEFAULT_PROVIDERS: BenchmarkProvider[] = [
  createApyBenchmarkProvider({
    id: "lido-eth",
    protocolId: "lido",
    protocolName: "Lido",
    asset: "ETH",
    apyAsset: "stETH",
    apyChainId: "ethereum",
  }),
  createApyBenchmarkProvider({
    id: "lido-weth",
    protocolId: "lido",
    protocolName: "Lido",
    asset: "WETH",
    apyAsset: "stETH",
    apyChainId: "ethereum",
  }),
  createApyBenchmarkProvider({
    id: "aave-usdc",
    protocolId: "aave",
    protocolName: "Aave",
    asset: "USDC",
    apyAsset: "aUSDC",
    apyChainId: "ethereum",
  }),
  createApyBenchmarkProvider({
    id: "aave-usdt",
    protocolId: "aave",
    protocolName: "Aave",
    asset: "USDT",
    apyAsset: "aUSDT",
    apyChainId: "ethereum",
  }),
  createApyBenchmarkProvider({
    id: "sky-dai",
    protocolId: "sky",
    protocolName: "Sky",
    asset: "DAI",
    apyAsset: "sUSDS",
    apyChainId: "ethereum",
  }),
];

class BenchmarkRegistry {
  private byAsset = new Map<IdleAssetSymbol, BenchmarkProvider[]>();

  constructor(providers: BenchmarkProvider[] = DEFAULT_PROVIDERS) {
    for (const provider of providers) {
      const list = this.byAsset.get(provider.asset) ?? [];
      list.push(provider);
      this.byAsset.set(provider.asset, list);
    }
  }

  /** Primary benchmark for an idle asset (first registered). */
  getDefault(asset: IdleAssetSymbol): BenchmarkProvider | undefined {
    return this.byAsset.get(asset)?.[0];
  }

  /** Future: user-selected or protocol-specific benchmark. */
  getById(id: string): BenchmarkProvider | undefined {
    for (const providers of this.byAsset.values()) {
      const match = providers.find((p) => p.id === id);
      if (match) return match;
    }
    return undefined;
  }

  register(provider: BenchmarkProvider, preferred = false): void {
    const list = this.byAsset.get(provider.asset) ?? [];
    if (preferred) {
      list.unshift(provider);
    } else {
      list.push(provider);
    }
    this.byAsset.set(provider.asset, list);
  }

  /** Resolve benchmark APY for idle asset on a given chain (L2 uses local Aave when applicable). */
  resolveProvider(
    asset: IdleAssetSymbol,
    chainId: ChainId,
  ): BenchmarkProvider | undefined {
    const base = this.getDefault(asset);
    if (!base) return undefined;

    if (asset === "USDC" || asset === "USDT") {
      return createApyBenchmarkProvider({
        id: `${base.id}-${chainId}`,
        protocolId: "aave",
        protocolName: "Aave",
        asset,
        apyAsset: asset === "USDC" ? "aUSDC" : "aUSDT",
        apyChainId: chainId,
      });
    }

    return base;
  }
}

export const benchmarkRegistry = new BenchmarkRegistry();
