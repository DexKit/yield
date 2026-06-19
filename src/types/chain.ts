/** Supported chains — extend this union as new chains ship. */
export type ChainId =
  | "ethereum"
  | "base"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "solana"
  | "cosmos";

export interface ChainMeta {
  id: ChainId;
  name: string;
  badge: string;
}
