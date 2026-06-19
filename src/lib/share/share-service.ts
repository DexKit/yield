import { getWalletCardImageAbsoluteUrl } from "@/lib/cards/card-url";
import {
  buildDiscordShareText,
  buildTelegramShareText,
  buildXShareText,
  getOpenGraphShareDescription,
  getOpenGraphShareTitle,
} from "@/lib/share/share-copy";
import { absoluteUrl } from "@/lib/seo/site";
import {
  getCanonicalWalletSlug,
  getCanonicalWalletUrl,
  getWalletDisplayName,
} from "@/lib/seo/wallet-url";
import { formatUsd } from "@/lib/utils";
import type { WalletYieldResult } from "@/types/yield";

/** Supported share destinations at launch. */
export type SharePlatform =
  | "x"
  | "telegram"
  | "discord"
  | "linkedin"
  | "copy_link";

/** Serializable share payload passed from server to client UI. */
export interface ShareContext {
  walletLabel: string;
  canonicalSlug: string;
  canonicalUrl: string;
  cardDownloadUrl: string;
  monthlyFormatted: string;
  yearlyFormatted: string;
  openGraphTitle: string;
  openGraphDescription: string;
}

function buildCanonicalUrl(slug: string): string {
  return absoluteUrl(`/${encodeURIComponent(slug)}`);
}

export const shareService = {
  buildShareContext(result: WalletYieldResult): ShareContext {
    const slug = getCanonicalWalletSlug(result);
    const walletLabel = getWalletDisplayName(result);
    const monthlyFormatted = formatUsd(result.summary.monthlyUsd);
    const yearlyFormatted = formatUsd(result.summary.yearlyUsd);

    return {
      walletLabel,
      canonicalSlug: slug,
      canonicalUrl: getCanonicalWalletUrl(result),
      cardDownloadUrl: getWalletCardImageAbsoluteUrl(slug, { theme: "dark" }),
      monthlyFormatted,
      yearlyFormatted,
      openGraphTitle: getOpenGraphShareTitle(walletLabel, monthlyFormatted),
      openGraphDescription: getOpenGraphShareDescription(),
    };
  },

  getCanonicalUrl(slug: string): string {
    return buildCanonicalUrl(slug);
  },

  getXShareUrl(ctx: ShareContext): string {
    const text = buildXShareText({
      walletLabel: ctx.walletLabel,
      monthlyFormatted: ctx.monthlyFormatted,
      yearlyFormatted: ctx.yearlyFormatted,
      canonicalUrl: ctx.canonicalUrl,
    });
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  },

  getTelegramShareUrl(ctx: ShareContext): string {
    const text = buildTelegramShareText({
      walletLabel: ctx.walletLabel,
      monthlyFormatted: ctx.monthlyFormatted,
    });
    return `https://t.me/share/url?url=${encodeURIComponent(ctx.canonicalUrl)}&text=${encodeURIComponent(text)}`;
  },

  getLinkedInShareUrl(ctx: ShareContext): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ctx.canonicalUrl)}`;
  },

  getDiscordShareText(ctx: ShareContext): string {
    return buildDiscordShareText({
      walletLabel: ctx.walletLabel,
      monthlyFormatted: ctx.monthlyFormatted,
      yearlyFormatted: ctx.yearlyFormatted,
      canonicalUrl: ctx.canonicalUrl,
    });
  },
};
