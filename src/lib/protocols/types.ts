import type { PublicClient } from "viem";
import type { ChainId } from "@/types/chain";
import type { ProtocolId } from "@/types/protocol";
import type { Position } from "@/types/yield";

export interface ProtocolProvider {
  readonly id: ProtocolId;
  readonly chainId: ChainId;
  getProtocolName(): string;
  getPositions(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position[]>;
}
