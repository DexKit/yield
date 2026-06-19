import type { ChainId, ChainMeta } from "@/types/chain";

export const CHAIN_METADATA: Record<ChainId, ChainMeta> = {
  ethereum: { id: "ethereum", name: "Ethereum", badge: "ETH" },
  base: { id: "base", name: "Base", badge: "BASE" },
  arbitrum: { id: "arbitrum", name: "Arbitrum", badge: "ARB" },
  optimism: { id: "optimism", name: "Optimism", badge: "OP" },
  polygon: { id: "polygon", name: "Polygon", badge: "POL" },
  solana: { id: "solana", name: "Solana", badge: "SOL" },
  cosmos: { id: "cosmos", name: "Cosmos", badge: "ATOM" },
};

/** Chains actively scanned for yield positions. */
export const ACTIVE_CHAIN_IDS: ChainId[] = [
  "ethereum",
  "base",
  "arbitrum",
  "optimism",
];

export function getChainMeta(chainId: ChainId): ChainMeta {
  return CHAIN_METADATA[chainId];
}
