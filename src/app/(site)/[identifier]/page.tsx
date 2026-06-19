import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  uniqueNormalizedChains,
  uniqueNormalizedProtocols,
} from "@/analytics";
import { WalletPageTracker } from "@/components/analytics/wallet-page-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { SharePanel } from "@/components/yield/share-panel";
import { YieldDetails } from "@/components/yield/yield-details";
import { YieldOpportunity } from "@/components/yield/yield-opportunity";
import { SearchForm } from "@/components/yield/search-form";
import { WalletInfo } from "@/components/yield/wallet-info";
import { WalletPageTitle } from "@/components/yield/wallet-page-title";
import { YieldHero } from "@/components/yield/yield-hero";
import { getCachedWalletYield, getCachedYieldOpportunity } from "@/lib/seo/cached-yield";
import { shareService } from "@/lib/share/share-service";
import { buildWalletStructuredData } from "@/lib/seo/structured-data";
import {
  buildWalletPageMetadata,
  getWalletMetaDescription,
} from "@/lib/seo/wallet-metadata";
import {
  getCanonicalWalletPath,
  shouldRedirectToCanonical,
} from "@/lib/seo/wallet-url";
import { sanitizeIdentifierParam } from "@/lib/validation/identifier";

/** Revalidate public wallet pages every 5 minutes. */
export const revalidate = 300;

interface PageProps {
  params: Promise<{ identifier: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const result = await getCachedWalletYield(identifier);

  if (!result) {
    return {
      title: "Wallet not found",
      robots: { index: false, follow: false },
    };
  }

  return buildWalletPageMetadata(result);
}

export default async function YieldResultPage({ params }: PageProps) {
  const { identifier } = await params;
  const sanitized = sanitizeIdentifierParam(identifier);
  const result = await getCachedWalletYield(identifier);

  if (!result) {
    notFound();
  }

  if (shouldRedirectToCanonical(sanitized, result)) {
    redirect(getCanonicalWalletPath(result));
  }

  const structuredData = buildWalletStructuredData(result);
  const shareContext = shareService.buildShareContext(result);
  const opportunity = await getCachedYieldOpportunity(
    result.address,
    result.summary,
  );
  const analyticsChains = uniqueNormalizedChains(
    result.chains.map((chain) => chain.chainId),
  );
  const analyticsProtocols = uniqueNormalizedProtocols(
    result.chains.flatMap((chain) =>
      chain.protocols.map((protocol) => protocol.protocolId),
    ),
  );

  return (
    <>
      <WalletPageTracker
        chains={analyticsChains}
        protocols={analyticsProtocols}
        hasOpportunity={opportunity.hasOpportunity}
        additionalMonthlyUsd={opportunity.summary.additionalMonthlyUsd}
      />
      <JsonLd data={structuredData} />

      <div className="mx-auto max-w-lg space-y-12 px-4 py-12">
        <header className="space-y-6 text-center">
          <WalletPageTitle result={result} />
          <p className="text-sm text-zinc-500">{getWalletMetaDescription(result)}</p>
          <WalletInfo result={result} />
        </header>

        <YieldHero
          summary={result.summary}
          stats={result.stats}
          currency={result.currency}
          shareContext={shareContext}
        />

        <YieldOpportunity opportunity={opportunity} />

        <YieldDetails
          chains={result.chains}
          emptyStateVariant={
            result.stats.protocolCount === 0
              ? opportunity.hasDetectedAssets
                ? "unsupported-assets"
                : "empty"
              : null
          }
        />

        <SharePanel context={shareContext} variant="secondary" />

        <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="mb-4 text-center text-sm text-zinc-500">
            Check another wallet
          </p>
          <SearchForm defaultValue={result.ensName ?? result.address} />
        </div>
      </div>
    </>
  );
}
