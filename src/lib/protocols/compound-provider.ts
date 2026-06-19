import type { PublicClient } from "viem";
import { formatUnits, parseAbi } from "viem";
import type { Position } from "@/types/yield";
import type { CompoundConfig } from "@/types/protocol";
import type { ProtocolProvider } from "./types";
import { computeYieldFromBalance } from "./base-provider";
import { fetchApy } from "@/lib/services/apy-service";
import { getTokenPriceUsd } from "@/lib/services/price-service";

const cometAbi = parseAbi(["function balanceOf(address account) view returns (uint256)"]);

export class CompoundProvider implements ProtocolProvider {
  readonly id = "compound" as const;

  constructor(private readonly config: CompoundConfig) {}

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
      this.config.markets.map((market) =>
        this.buildPositionFromComet(client, market, address),
      ),
    );
    return positions.filter((p): p is Position => p !== null);
  }

  private async buildPositionFromComet(
    client: PublicClient,
    market: CompoundConfig["markets"][number],
    wallet: `0x${string}`,
  ): Promise<Position | null> {
    let balanceRaw = 0n;
    try {
      balanceRaw = await client.readContract({
        address: market.cometAddress,
        abi: cometAbi,
        functionName: "balanceOf",
        args: [wallet],
      });
    } catch {
      return null;
    }
    if (balanceRaw === 0n) return null;

    const balanceHuman = parseFloat(formatUnits(balanceRaw, market.decimals));
    const priceUsd = await getTokenPriceUsd(market.priceSymbol);
    const valueUsd = balanceHuman * priceUsd;
    const apy = await fetchApy(this.id, market.symbol, this.config.chainId);

    return computeYieldFromBalance(balanceHuman, valueUsd, apy, {
      protocolId: this.id,
      protocolName: this.getProtocolName(),
      asset: market.symbol,
      balance: balanceHuman.toString(),
      balanceRaw,
      chainId: this.config.chainId,
    });
  }
}
