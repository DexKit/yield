"use client";

import { useWalletPageAnalytics } from "@/analytics/hooks";
import type { AnalyticsChainId, AnalyticsProtocolId } from "@/analytics/events";

interface WalletPageTrackerProps {
  chains: AnalyticsChainId[];
  protocols: AnalyticsProtocolId[];
  hasOpportunity: boolean;
  additionalMonthlyUsd: number;
}

export function WalletPageTracker({
  chains,
  protocols,
  hasOpportunity,
  additionalMonthlyUsd,
}: WalletPageTrackerProps) {
  useWalletPageAnalytics({
    chains,
    protocols,
    hasOpportunity,
    additionalMonthlyUsd,
  });

  return null;
}
