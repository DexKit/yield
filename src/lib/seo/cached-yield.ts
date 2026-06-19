import { cache } from "react";
import { yieldOpportunityService } from "@/lib/opportunity/yield-opportunity-service";
import { yieldService } from "@/lib/services/yield-service";
import { sanitizeIdentifierParam } from "@/lib/validation/identifier";
import type { YieldOpportunityResult } from "@/types/opportunity";
import type { WalletYieldResult, YieldSummary } from "@/types/yield";

/** Dedupes yield fetches within a single SSR request (page + metadata + OG). */
export const getCachedWalletYield = cache(
  async (rawIdentifier: string): Promise<WalletYieldResult | null> => {
    const sanitized = sanitizeIdentifierParam(rawIdentifier);
    return yieldService.calculateYield(sanitized);
  },
);

/** Dedupes opportunity analysis within a single SSR request. */
export const getCachedYieldOpportunity = cache(
  async (
    address: `0x${string}`,
    summary: YieldSummary,
  ): Promise<YieldOpportunityResult> => {
    return yieldOpportunityService.analyze(address, summary);
  },
);
