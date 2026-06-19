import type {
  CardRenderOptions,
  CardThemeId,
  CardTypeId,
  ParsedCardSlug,
} from "@/lib/cards/types";
import type { CurrencyCode } from "@/types/currency";
import { isSupportedCurrency } from "@/lib/services/currency-service";
import { absoluteUrl } from "@/lib/seo/site";

const THEMES: CardThemeId[] = ["light", "dark"];

/** Future card suffixes — layouts registered via cardLayoutRegistry when implemented. */
const SUFFIX_TO_TYPE: Record<string, CardTypeId> = {
  "-opportunity": "opportunity",
  "-optimizer": "optimizer",
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseCardTheme(
  raw: string | null | undefined,
): CardThemeId {
  const value = raw?.toLowerCase();
  if (value && THEMES.includes(value as CardThemeId)) {
    return value as CardThemeId;
  }
  return "dark";
}

export function parseCardCurrency(
  raw: string | null | undefined,
): CurrencyCode {
  const value = raw?.toUpperCase();
  if (value && isSupportedCurrency(value)) {
    return value;
  }
  return "USD";
}

export function parseCardRenderOptions(
  searchParams: Record<string, string | string[] | undefined>,
): CardRenderOptions {
  return {
    theme: parseCardTheme(firstParam(searchParams.theme)),
    currency: parseCardCurrency(firstParam(searchParams.currency)),
  };
}

/**
 * Parse `/card/vitalik.eth.png` or future `/card/vitalik.eth-opportunity.png`.
 */
export function parseCardSlug(rawSlug: string): ParsedCardSlug | null {
  if (!rawSlug.endsWith(".png")) return null;

  const name = decodeURIComponent(rawSlug.slice(0, -4));
  if (!name) return null;

  for (const [suffix, cardType] of Object.entries(SUFFIX_TO_TYPE)) {
    if (name.endsWith(suffix)) {
      const wallet = name.slice(0, -suffix.length);
      if (!wallet) return null;
      return { wallet, cardType };
    }
  }

  const dash = name.lastIndexOf("-");
  if (dash > 0) {
    const variant = name.slice(dash + 1);
    const wallet = name.slice(0, dash);
    if (variant === "base" || variant === "arbitrum" || variant === "optimism") {
      return { wallet, cardType: "chain", variant };
    }
    if (wallet && variant.length > 0) {
      return { wallet, cardType: "protocol", variant };
    }
  }

  return { wallet: name, cardType: "default" };
}

export function buildCardPath(
  wallet: string,
  cardType: CardTypeId = "default",
  variant?: string,
): string {
  let filename = wallet;
  if (cardType === "opportunity") filename += "-opportunity";
  else if (cardType === "optimizer") filename += "-optimizer";
  else if (cardType === "protocol" && variant) filename += `-${variant}`;
  else if (cardType === "chain" && variant) filename += `-${variant}`;
  return `/card/${encodeURIComponent(filename)}.png`;
}

/** Absolute PNG card URL for Open Graph, README, and blog embeds. */
export function getWalletCardImageAbsoluteUrl(
  wallet: string,
  options?: Partial<CardRenderOptions>,
): string {
  const path = buildCardPath(wallet, "default");
  const url = new URL(path, absoluteUrl("/"));
  if (options?.theme) {
    url.searchParams.set("theme", options.theme);
  }
  if (options?.currency && options.currency !== "USD") {
    url.searchParams.set("currency", options.currency);
  }
  return url.toString();
}
