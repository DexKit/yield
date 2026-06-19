import type { Metadata } from "next";
import { formatUsd } from "@/lib/utils";
import { getWalletCardImageAbsoluteUrl } from "@/lib/cards/card-url";
import { CARD_HEIGHT, CARD_WIDTH } from "@/lib/cards/constants";
import {
  getOpenGraphShareTitle,
} from "@/lib/share/share-copy";
import type { WalletYieldResult } from "@/types/yield";
import { SITE_NAME } from "./site";
import {
  getCanonicalWalletSlug,
  getCanonicalWalletUrl,
  getWalletDisplayName,
} from "./wallet-url";

export function getWalletPageTitle(result: WalletYieldResult): string {
  return `How Much Yield Does ${getWalletDisplayName(result)} Generate?`;
}

export function getWalletMetaDescription(result: WalletYieldResult): string {
  const wallet = getWalletDisplayName(result);
  return `See estimated daily, monthly and yearly yield for ${wallet}.`;
}

export function buildWalletPageMetadata(result: WalletYieldResult): Metadata {
  const pageTitle = getWalletPageTitle(result);
  const pageDescription = getWalletMetaDescription(result);
  const socialTitle = getOpenGraphShareTitle(
    getWalletDisplayName(result),
    formatUsd(result.summary.monthlyUsd),
  );
  const canonicalUrl = getCanonicalWalletUrl(result);
  const wallet = getCanonicalWalletSlug(result);
  const cardImageUrl = getWalletCardImageAbsoluteUrl(wallet, { theme: "dark" });

  return {
    title: {
      absolute: pageTitle,
    },
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: canonicalUrl,
      title: socialTitle,
      description: pageDescription,
      locale: "en_US",
      images: [
        {
          url: cardImageUrl,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: pageDescription,
      images: [cardImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      "DeFi yield",
      "wallet yield",
      "crypto earnings",
      wallet,
      "ENS",
      "staking yield",
    ],
  };
}
