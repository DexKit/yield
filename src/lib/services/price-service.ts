import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";

const priceCache = new Map<string, { price: number; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 1000;

const STABLECOINS = new Set(["usd-coin", "tether", "dai", "susds", "frax", "usde"]);

async function fetchFromCoinGecko(symbol: string): Promise<number | null> {
  try {
    const res = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, { usd?: number }>;
    return data[symbol]?.usd ?? null;
  } catch {
    return null;
  }
}

export async function getTokenPriceUsd(priceSymbol: string): Promise<number> {
  if (STABLECOINS.has(priceSymbol)) return 1;

  const cached = priceCache.get(priceSymbol);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.price;
  }

  const price = await fetchFromCoinGecko(priceSymbol);
  const resolved =
    price ??
    (priceSymbol === "ethereum"
      ? 3500
      : priceSymbol === "wrapped-bitcoin"
        ? 100_000
        : 1);

  priceCache.set(priceSymbol, {
    price: resolved,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return resolved;
}
