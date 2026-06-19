/** Public site origin — set in production via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yield.dexkit.com";

export const SITE_NAME = "Yield by DexKit";

export const SITE_DESCRIPTION =
  "Paste any wallet or ENS name and instantly estimate daily, monthly and yearly DeFi earnings.";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
