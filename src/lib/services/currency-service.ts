import type { CurrencyCode } from "@/types/currency";

const SUPPORTED: CurrencyCode[] = ["USD", "EUR", "GBP", "BRL"];

const rateCache = new Map<
  CurrencyCode,
  { rate: number; expiresAt: number }
>();

const RATE_TTL_MS = 60 * 60 * 1000;

async function fetchUsdRate(target: CurrencyCode): Promise<number | null> {
  if (target === "USD") return 1;

  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${target}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: Record<string, number> };
    return data.rates?.[target] ?? null;
  } catch {
    return null;
  }
}

/** USD → target currency exchange rate (single source for all UI + cards). */
export async function getUsdExchangeRate(
  currency: CurrencyCode,
): Promise<number> {
  if (currency === "USD") return 1;

  const cached = rateCache.get(currency);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.rate;
  }

  const rate = await fetchUsdRate(currency);
  const resolved = rate ?? 1;
  rateCache.set(currency, {
    rate: resolved,
    expiresAt: Date.now() + RATE_TTL_MS,
  });
  return resolved;
}

export function isSupportedCurrency(value: string): value is CurrencyCode {
  return SUPPORTED.includes(value as CurrencyCode);
}

export async function convertUsdAmount(
  amountUsd: number,
  currency: CurrencyCode,
): Promise<number> {
  const rate = await getUsdExchangeRate(currency);
  return amountUsd * rate;
}
