import { formatUsd } from "@/lib/utils";
import { getWalletCardImageAbsoluteUrl } from "@/lib/cards/card-url";
import { CARD_HEIGHT, CARD_WIDTH } from "@/lib/cards/constants";
import type { WalletYieldResult } from "@/types/yield";
import { SITE_NAME, SITE_URL } from "./site";
import {
  getCanonicalWalletSlug,
  getCanonicalWalletUrl,
} from "./wallet-url";
import { getWalletMetaDescription, getWalletPageTitle } from "./wallet-metadata";

interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": Record<string, unknown>[];
}

export function buildWalletStructuredData(
  result: WalletYieldResult,
): JsonLdGraph {
  const pageUrl = getCanonicalWalletUrl(result);
  const wallet = getCanonicalWalletSlug(result);
  const pageId = `${pageUrl}#webpage`;
  const datasetId = `${pageUrl}#dataset`;
  const serviceId = `${SITE_URL}/#financial-service`;
  const websiteId = `${SITE_URL}/#website`;

  const protocolNames = [
    ...new Set(
      result.chains.flatMap((chain) =>
        chain.protocols.map((protocol) => protocol.protocolName),
      ),
    ),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "DexKit",
        url: "https://dexkit.com",
      },
      {
        "@type": "FinancialService",
        "@id": serviceId,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Estimate daily, monthly and annual DeFi yield for any Ethereum wallet or ENS name.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "Worldwide",
        serviceType: "DeFi yield estimation",
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: pageUrl,
        name: getWalletPageTitle(result),
        description: getWalletMetaDescription(result),
        isPartOf: { "@id": websiteId },
        about: { "@id": datasetId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: getWalletCardImageAbsoluteUrl(wallet, { theme: "dark" }),
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
        dateModified: result.calculatedAt,
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: `DeFi yield estimate for ${wallet}`,
        description: getWalletMetaDescription(result),
        url: pageUrl,
        creator: { "@id": serviceId },
        temporalCoverage: result.calculatedAt,
        variableMeasured: [
          {
            "@type": "PropertyValue",
            name: "Daily yield (USD)",
            value: formatUsd(result.summary.dailyUsd),
          },
          {
            "@type": "PropertyValue",
            name: "Monthly yield (USD)",
            value: formatUsd(result.summary.monthlyUsd),
          },
          {
            "@type": "PropertyValue",
            name: "Annual yield (USD)",
            value: formatUsd(result.summary.yearlyUsd),
          },
          {
            "@type": "PropertyValue",
            name: "Protocols",
            value: protocolNames.join(", ") || "None detected",
          },
          {
            "@type": "PropertyValue",
            name: "Chains",
            value: result.chains.map((chain) => chain.chainName).join(", ") || "None",
          },
        ],
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "text/html",
          contentUrl: pageUrl,
        },
      },
    ],
  };
}
