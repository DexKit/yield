import type { PublicClient } from "viem";
import type { Position } from "@/types/yield";
import type { ProtocolConfig } from "@/types/protocol";
import type { ProtocolProvider } from "./types";
import { buildPositionFromToken } from "./base-provider";

export class AaveProvider implements ProtocolProvider {
  readonly id = "aave" as const;

  constructor(private readonly config: ProtocolConfig) {}

  get chainId() {
    return this.config.chainId;
  }

  getProtocolName(): string {
    return this.config.name;
  }

  async getPositions(
    address: `0x${string}`,
    client: PublicClient,
  ): Promise<Position[]> {
    const positions = await Promise.all(
      this.config.tokens.map((token) =>
        buildPositionFromToken(
          client,
          token,
          address,
          this.id,
          this.getProtocolName(),
          this.config.chainId,
        ),
      ),
    );
    return positions.filter((p): p is Position => p !== null);
  }
}
