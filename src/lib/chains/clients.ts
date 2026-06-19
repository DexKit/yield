import {
  createPublicClient,
  fallback,
  http,
  type Chain,
  type PublicClient,
} from "viem";
import { arbitrum, base, mainnet, optimism } from "viem/chains";
import type { ChainId } from "@/types/chain";
import { ACTIVE_CHAIN_IDS } from "./chain-meta";

const VIEM_CHAINS: Partial<Record<ChainId, Chain>> = {
  ethereum: mainnet,
  base,
  arbitrum,
  optimism,
};

/** Morpho GraphQL / external APIs use numeric EVM chain ids. */
export const EVM_CHAIN_NUMERIC: Partial<Record<ChainId, number>> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  optimism: 10,
};

const clients = new Map<ChainId, PublicClient>();

function publicRpcUrl(chainId: ChainId): string {
  if (chainId === "ethereum") return "https://ethereum.publicnode.com";
  if (chainId === "base") return "https://base.publicnode.com";
  if (chainId === "arbitrum") return "https://arbitrum.publicnode.com";
  if (chainId === "optimism") return "https://optimism.publicnode.com";
  throw new Error(`No RPC URL configured for chain: ${chainId}`);
}

function alchemyRpcUrl(chainId: ChainId): string | null {
  const key = process.env.ALCHEMY_API_KEY;
  if (!key) return null;

  if (chainId === "ethereum") {
    return `https://eth-mainnet.g.alchemy.com/v2/${key}`;
  }
  if (chainId === "base") {
    return `https://base-mainnet.g.alchemy.com/v2/${key}`;
  }
  if (chainId === "arbitrum") {
    return `https://arb-mainnet.g.alchemy.com/v2/${key}`;
  }
  if (chainId === "optimism") {
    return `https://opt-mainnet.g.alchemy.com/v2/${key}`;
  }
  return null;
}

/** Primary + fallback RPC — public node first for reliability. */
function rpcUrls(chainId: ChainId): string[] {
  const urls = [publicRpcUrl(chainId)];
  const alchemy = alchemyRpcUrl(chainId);
  if (alchemy) urls.push(alchemy);
  return urls;
}

export function getEvmClient(chainId: ChainId): PublicClient {
  const cached = clients.get(chainId);
  if (cached) return cached;

  const chain = VIEM_CHAINS[chainId];
  if (!chain) {
    throw new Error(`No viem chain config for: ${chainId}`);
  }

  const client = createPublicClient({
    chain,
    transport: fallback(
      rpcUrls(chainId).map((url) => http(url, { timeout: 15_000 })),
      { rank: false },
    ),
  });
  clients.set(chainId, client);
  return client;
}

/** @deprecated Use getEvmClient("ethereum") */
export function getEthereumClient(): PublicClient {
  return getEvmClient("ethereum");
}

export function getActiveEvmClients(): Array<{ chainId: ChainId; client: PublicClient }> {
  return ACTIVE_CHAIN_IDS.filter((id) => VIEM_CHAINS[id]).map((chainId) => ({
    chainId,
    client: getEvmClient(chainId),
  }));
}
