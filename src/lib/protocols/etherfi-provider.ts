import type { PublicClient } from "viem";
import type { Position } from "@/types/yield";
import type { ProtocolProvider } from "./types";
import { ETHERFI_CONFIG } from "./tokens";
import { buildPositionFromToken } from "./base-provider";

export class EtherFiProvider implements ProtocolProvider {
  readonly id = "etherfi" as const;
  readonly chainId = "ethereum" as const;

  getProtocolName(): string {
    return ETHERFI_CONFIG.name;
  }

  async getPositions(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position[]> {
    const positions = await Promise.all(
      ETHERFI_CONFIG.tokens.map((token) =>
        buildPositionFromToken(
          client,
          token,
          address,
          this.id,
          this.getProtocolName(),
          this.chainId,
        ),
      ),
    );
    return positions.filter((p): p is Position => p !== null);
  }
}

export const etherFiProvider = new EtherFiProvider();
