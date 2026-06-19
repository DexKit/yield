import type { PublicClient } from "viem";
import type { Position } from "@/types/yield";
import type { ProtocolProvider } from "./types";
import { SWELL_CONFIG } from "./tokens";
import { buildPositionFromToken } from "./base-provider";

export class SwellProvider implements ProtocolProvider {
  readonly id = "swell" as const;
  readonly chainId = "ethereum" as const;

  getProtocolName(): string {
    return SWELL_CONFIG.name;
  }

  async getPositions(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position[]> {
    const positions = await Promise.all(
      SWELL_CONFIG.tokens.map((token) =>
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

export const swellProvider = new SwellProvider();
