"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { AnalyticsChainId, AnalyticsProtocolId } from "@/analytics/events";
import { analyticsService } from "@/analytics/service";

/** Fires a privacy-safe page_view on App Router navigations. */
export function usePageViewTracking(): void {
  const pathname = usePathname();

  useEffect(() => {
    analyticsService.trackPageView(pathname);
  }, [pathname]);
}

interface WalletPageAnalyticsInput {
  chains: AnalyticsChainId[];
  protocols: AnalyticsProtocolId[];
  hasOpportunity: boolean;
  additionalMonthlyUsd: number;
}

/** One-shot wallet page analytics — chains, protocols, opportunity buckets. */
export function useWalletPageAnalytics(input: WalletPageAnalyticsInput): void {
  const trackedRef = useRef(false);
  const {
    chains,
    protocols,
    hasOpportunity,
    additionalMonthlyUsd,
  } = input;

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;

    analyticsService.trackYieldOpportunityView(
      hasOpportunity,
      additionalMonthlyUsd,
    );

    for (const chain of chains) {
      analyticsService.trackChainDetected(chain);
    }

    for (const protocol of protocols) {
      analyticsService.trackProtocolDetected(protocol);
    }
  }, [chains, protocols, hasOpportunity, additionalMonthlyUsd]);
}
