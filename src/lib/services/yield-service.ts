import { getEvmClient } from "@/lib/chains/clients";
import { evmChainAdapter } from "@/lib/chains/evm-adapter";
import { getProvidersForActiveChains } from "@/lib/protocols/registry";
import { sanitizeIdentifierParam } from "@/lib/validation/identifier";
import {
  aggregateSummaryFromChains,
  buildChainYieldGroups,
  buildPortfolioStats,
} from "@/lib/services/yield-aggregator";
import type { CurrencyCode } from "@/types/currency";
import type { Position, WalletYieldResult } from "@/types/yield";

export class YieldService {
  async calculateYield(
    rawIdentifier: string,
    currency: CurrencyCode = "USD",
  ): Promise<WalletYieldResult | null> {
    const identifier = sanitizeIdentifierParam(rawIdentifier);
    const resolved = await evmChainAdapter.resolveIdentifier(identifier);

    if (!resolved.address) {
      return null;
    }

    let ensName = resolved.ensName;
    if (!ensName && resolved.type === "evm-address") {
      ensName = await evmChainAdapter.lookupEnsName(resolved.address);
    }

    const chainProviderSets = getProvidersForActiveChains();
    const positionBatches = await Promise.all(
      chainProviderSets.map(async ({ chainId, providers }) => {
        if (providers.length === 0) return [] as Position[];

        const client = getEvmClient(chainId);
        const results = await Promise.all(
          providers.map((provider) =>
            provider.getPositions(resolved.address!, client),
          ),
        );
        return results.flat();
      }),
    );

    const positions = positionBatches.flat();
    const chains = buildChainYieldGroups(positions);
    const summary = aggregateSummaryFromChains(chains);
    const stats = buildPortfolioStats(chains);

    return {
      identifier: resolved.ensName ?? resolved.raw,
      address: resolved.address,
      ensName,
      chains,
      summary,
      stats,
      currency,
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const yieldService = new YieldService();
