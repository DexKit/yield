import type { ChainId } from "@/types/chain";
import type { ResolvedIdentifier } from "@/types/yield";

export interface ChainAdapter {
  readonly family: "evm" | "solana" | "cosmos";
  canHandle(identifier: string): boolean;
  resolveIdentifier(identifier: string): Promise<ResolvedIdentifier>;
}

export type { ChainId };
