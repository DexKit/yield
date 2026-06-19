import type { ChainId } from "@/types/chain";
import { ACTIVE_CHAIN_IDS } from "@/lib/chains/chain-meta";
import type { ProtocolProvider } from "./types";
import { lidoProvider } from "./lido-provider";
import { etherFiProvider } from "./etherfi-provider";
import { swellProvider } from "./swell-provider";
import { AaveProvider } from "./aave-provider";
import { eigenLayerProvider } from "./eigenlayer-provider";
import { CompoundProvider } from "./compound-provider";
import {
  AAVE_ARBITRUM_CONFIG,
  AAVE_BASE_CONFIG,
  AAVE_ETHEREUM_CONFIG,
  AAVE_OPTIMISM_CONFIG,
  COINBASE_CONFIG,
  COMPOUND_CONFIGS,
  ETHENA_CONFIG,
  FRAX_CONFIG,
  KELP_CONFIG,
  MOONWELL_BASE_CONFIG,
  MORPHO_ARBITRUM_CONFIG,
  MORPHO_BASE_CONFIG,
  MORPHO_CONFIG,
  MORPHO_SKY_CONFIG,
  PUFFER_CONFIG,
  RENZO_CONFIG,
  ROCKETPOOL_CONFIG,
  SEAMLESS_BASE_CONFIG,
  SKY_CONFIG,
  SPARK_CONFIG,
  SPARKLEND_CONFIG,
} from "./tokens";
import { TokenListProvider } from "./token-list-provider";

export const aaveEthereumProvider = new AaveProvider(AAVE_ETHEREUM_CONFIG);
export const aaveBaseProvider = new AaveProvider(AAVE_BASE_CONFIG);
export const aaveArbitrumProvider = new AaveProvider(AAVE_ARBITRUM_CONFIG);
export const aaveOptimismProvider = new AaveProvider(AAVE_OPTIMISM_CONFIG);

export const morphoProvider = new TokenListProvider(MORPHO_CONFIG);
export const morphoBaseProvider = new TokenListProvider(MORPHO_BASE_CONFIG);
export const morphoArbitrumProvider = new TokenListProvider(MORPHO_ARBITRUM_CONFIG);
export const morphoSkyProvider = new TokenListProvider(MORPHO_SKY_CONFIG);
export const sparkProvider = new TokenListProvider(SPARK_CONFIG);
export const skyProvider = new TokenListProvider(SKY_CONFIG);
export const sparkLendProvider = new TokenListProvider(SPARKLEND_CONFIG);
export const rocketPoolProvider = new TokenListProvider(ROCKETPOOL_CONFIG);
export const coinbaseProvider = new TokenListProvider(COINBASE_CONFIG);
export const ethenaProvider = new TokenListProvider(ETHENA_CONFIG);
export const kelpProvider = new TokenListProvider(KELP_CONFIG);
export const renzoProvider = new TokenListProvider(RENZO_CONFIG);
export const pufferProvider = new TokenListProvider(PUFFER_CONFIG);
export const fraxProvider = new TokenListProvider(FRAX_CONFIG);
export const moonwellBaseProvider = new TokenListProvider(MOONWELL_BASE_CONFIG);
export const seamlessBaseProvider = new TokenListProvider(SEAMLESS_BASE_CONFIG);

const compoundProviders = COMPOUND_CONFIGS.map((config) => new CompoundProvider(config));
const compoundEthereumProvider = compoundProviders.find((p) => p.chainId === "ethereum")!;
const compoundBaseProvider = compoundProviders.find((p) => p.chainId === "base")!;

const PROVIDERS_BY_CHAIN: Record<ChainId, ProtocolProvider[]> = {
  ethereum: [
    lidoProvider,
    etherFiProvider,
    swellProvider,
    aaveEthereumProvider,
    morphoProvider,
    morphoSkyProvider,
    sparkProvider,
    skyProvider,
    sparkLendProvider,
    rocketPoolProvider,
    coinbaseProvider,
    ethenaProvider,
    kelpProvider,
    renzoProvider,
    pufferProvider,
    fraxProvider,
    compoundEthereumProvider,
    eigenLayerProvider,
  ],
  base: [
    aaveBaseProvider,
    morphoBaseProvider,
    moonwellBaseProvider,
    seamlessBaseProvider,
    compoundBaseProvider,
  ],
  arbitrum: [aaveArbitrumProvider, morphoArbitrumProvider],
  optimism: [aaveOptimismProvider],
  polygon: [],
  solana: [],
  cosmos: [],
};

/** All protocol providers for actively scanned chains. */
export function getProvidersForActiveChains(): Array<{
  chainId: ChainId;
  providers: ProtocolProvider[];
}> {
  return ACTIVE_CHAIN_IDS.map((chainId) => ({
    chainId,
    providers: PROVIDERS_BY_CHAIN[chainId] ?? [],
  }));
}

export function getProtocolProvider(
  id: string,
  chainId: ChainId,
): ProtocolProvider | undefined {
  return PROVIDERS_BY_CHAIN[chainId]?.find((p) => p.id === id);
}
