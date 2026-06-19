import type { PublicClient } from "viem";
import type { Position } from "@/types/yield";
import type { ProtocolConfig } from "@/types/protocol";
import type { ProtocolProvider } from "./types";
import { buildPositionFromToken } from "./base-provider";

/** Config-driven provider — balanceOf on a static ERC-20 / ERC-4626 token list. */
export class TokenListProvider implements ProtocolProvider {
  constructor(private readonly config: ProtocolConfig) {}

  get id() {
    return this.config.id;
  }

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
