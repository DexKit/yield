import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";

export interface DefiLlamaPool {
  project: string;
  symbol: string;
  apy: number;
  tvlUsd?: number;
}

const POOLS_URL = "https://yields.llama.fi/pools";
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedPools: DefiLlamaPool[] | null = null;
let cacheExpiresAt = 0;
let inflight: Promise<DefiLlamaPool[] | null> | null = null;

async function downloadPools(): Promise<DefiLlamaPool[] | null> {
  try {
    const res = await fetchWithTimeout(POOLS_URL, {
      next: { revalidate: 300 },
      timeoutMs: 12_000,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: DefiLlamaPool[] };
    return data.data ?? null;
  } catch {
    return null;
  }
}

/** Single-flight cache — avoids downloading the ~15MB pools JSON multiple times per request. */
export async function getDefiLlamaPools(): Promise<DefiLlamaPool[] | null> {
  if (cachedPools && Date.now() < cacheExpiresAt) {
    return cachedPools;
  }

  if (!inflight) {
    inflight = downloadPools().then((pools) => {
      inflight = null;
      if (pools?.length) {
        cachedPools = pools;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;
      }
      return pools;
    });
  }

  return inflight;
}
