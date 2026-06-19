import type { ProtocolId } from "@/types/protocol";
import type { ChainId } from "@/types/chain";
import type { Address } from "viem";
import { EVM_CHAIN_NUMERIC, getEthereumClient } from "@/lib/chains/clients";
import { fetchMorphoVaultNetApy } from "@/lib/protocols/morpho-vault-apy";
import { fetchWeethsApyFromChain } from "@/lib/protocols/etherfi-weeths";
import { fetchSwellApyFromChain } from "@/lib/protocols/swell-rates";
import { PROTOCOL_CONFIGS } from "@/lib/protocols/tokens";

/** Fallback APY rates when live APIs are unavailable (annual %). */
const FALLBACK_APY: Record<string, number> = {
  "lido:stETH": 3.1,
  "lido:wstETH": 3.1,
  "etherfi:eETH": 2.9,
  "etherfi:weETH": 2.9,
  "etherfi:weETHs": 3.5,
  "swell:swETH": 2.5,
  "swell:rswETH": 2.5,
  "aave:aUSDC": 4.5,
  "aave:aUSDT": 4.2,
  "aave:aWETH": 2.8,
  "aave:awstETH": 2.5,
  "aave:aweETH": 2.8,
  "aave:aWBTC": 0.5,
  "morpho:mvSteakUSDC": 3.5,
  "morpho:mvSteakUSDT": 2.4,
  "morpho:mvGtUSDC": 3.7,
  "morpho:mvBbqUSDC": 3.2,
  "morpho-sky:skyMvUSDT": 2.7,
  "morpho-sky:skyMvUSDS": 4.9,
  "morpho-sky:skyMvUSDC": 4.9,
  "spark:spUSDC": 3.6,
  "spark:spUSDT": 2.5,
  "spark:spETH": 1.6,
  "sky:sUSDS": 3.6,
  "sky:sDAI": 1.25,
  "sky:stUSDS": 4.0,
  "rocketpool:rETH": 3.0,
  "coinbase:cbETH": 3.0,
  "ethena:sUSDe": 4.0,
  "kelp:rsETH": 3.2,
  "renzo:ezETH": 3.2,
  "puffer:pufETH": 3.0,
  "frax:sfrxETH": 3.5,
  "frax:sFRAX": 5.0,
  "sparklend:slUSDS": 4.0,
  "sparklend:slUSDE": 3.5,
  "sparklend:slPrimeUSDS": 4.5,
  "compound:cUSDCv3": 4.0,
  "compound:cWETHv3": 2.5,
  "moonwell:mUSDC": 4.0,
  "moonwell:mWETH": 2.5,
  "seamless:seamUSDC": 3.5,
  "seamless:seamWETH": 2.5,
};

/** Extra AVS restaking yield on top of base LST staking (annual %). */
const EIGENLAYER_RESTAKING_PREMIUM_FALLBACK = 1.8;

const apyCache = new Map<string, { apy: number; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(protocolId: ProtocolId, asset: string, chainId?: ChainId): string {
  return chainId ? `${chainId}:${protocolId}:${asset}` : `${protocolId}:${asset}`;
}

function fallbackKey(protocolId: ProtocolId, asset: string): string {
  return `${protocolId}:${asset}`;
}

function findTokenVaultAddress(
  protocolId: ProtocolId,
  asset: string,
  chainId: ChainId,
): Address | undefined {
  const config = PROTOCOL_CONFIGS.find(
    (c) => c.id === protocolId && c.chainId === chainId,
  );
  return config?.tokens.find((t) => t.symbol === asset)?.address;
}

function getCached(key: string): number | undefined {
  const entry = apyCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    apyCache.delete(key);
    return undefined;
  }
  return entry.apy;
}

function setCache(key: string, apy: number): void {
  apyCache.set(key, { apy, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function fetchLidoApy(): Promise<number | null> {
  try {
    const res = await fetch("https://eth-api.lido.fi/v1/protocol/steth/apr/last", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: { apr?: number } };
    const apr = data.data?.apr;
    // Lido API returns APR already as a percentage (e.g. 2.386 = 2.386%), not a decimal.
    return apr != null ? apr : null;
  } catch {
    return null;
  }
}

/** Ether.fi public APR feed — same source as app.ether.fi UI. */
async function fetchEtherFiApy(): Promise<number | null> {
  try {
    const res = await fetch("https://www.etherfi.bid/api/etherfi/apr", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { latest_aprs?: string[] };
    const aprs = data.latest_aprs
      ?.map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    if (!aprs?.length) return null;
    // API returns hundredths of a percent (e.g. 239 → 2.39% annualised).
    const avg = aprs.reduce((sum, value) => sum + value, 0) / aprs.length;
    return avg / 100;
  } catch {
    return null;
  }
}

async function fetchDefiLlamaApy(protocol: string, pool: string): Promise<number | null> {
  try {
    const res = await fetch(`https://yields.llama.fi/pools`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: Array<{ project: string; symbol: string; apy: number }>;
    };
    const match = data.data?.find(
      (p) =>
        p.project.toLowerCase().includes(protocol) &&
        p.symbol.toLowerCase().includes(pool.toLowerCase()),
    );
    return match?.apy ?? null;
  } catch {
    return null;
  }
}

/** DefiLlama pool match by exact project + symbol (case-insensitive). */
async function fetchDefiLlamaApyExact(
  project: string,
  symbol: string,
): Promise<number | null> {
  try {
    const res = await fetch(`https://yields.llama.fi/pools`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: Array<{ project: string; symbol: string; apy: number; tvlUsd?: number }>;
    };
    const projectLower = project.toLowerCase();
    const symbolLower = symbol.toLowerCase();
    const matches =
      data.data?.filter(
        (p) =>
          p.project.toLowerCase() === projectLower &&
          p.symbol.toLowerCase() === symbolLower,
      ) ?? [];
    if (!matches.length) return null;
    const best = matches.reduce((a, b) =>
      (b.tvlUsd ?? 0) > (a.tvlUsd ?? 0) ? b : a,
    );
    return best.apy ?? null;
  } catch {
    return null;
  }
}

/** Morpho MetaMorpho vault addresses for generic curator vaults. */
const MORPHO_VAULT_ADDRESS: Record<string, `0x${string}`> = {
  mvSteakUSDC: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
  mvSteakUSDT: "0xbEef047a543E45807105E51A8BBEFCc5950fcfBa",
  mvGtUSDC: "0xdd0f28e19C1780eb6396170735D45153D261490d",
};

/** DefiLlama symbols for sky.money Morpho Vault V2 deployments. */
const MORPHO_SKY_DEFILLAMA_SYMBOL: Record<string, string> = {
  skyMvUSDT: "SKYMONEYUSDTSAVINGS",
  skyMvUSDS: "SKYMONEYUSDSFLAGSHIP",
  skyMvUSDC: "SKYMONEYUSDCRISKCAPITAL",
};

/** Spark Savings underlying asset labels on DefiLlama. */
const SPARK_DEFILLAMA_UNDERLYING: Record<string, string> = {
  spUSDC: "USDC",
  spUSDT: "USDT",
  spETH: "ETH",
};

/** Sky Savings products on DefiLlama (sky-lending). */
const SKY_DEFILLAMA_SYMBOL: Record<string, string> = {
  sUSDS: "SUSDS",
  sDAI: "SDAI",
  stUSDS: "STUSDS",
};

/** SparkLend supply tokens on DefiLlama. */
const SPARKLEND_DEFILLAMA_SYMBOL: Record<string, string> = {
  slUSDS: "USDS",
  slUSDE: "USDE",
  slPrimeUSDS: "USDS",
};

async function fetchEthenaSusdeApy(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://app.ethena.fi/api/yields/protocol-and-staking-yield",
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      avg30dSusdeYield?: { value?: number };
    };
    return data.avg30dSusdeYield?.value ?? null;
  } catch {
    return null;
  }
}

export async function fetchApy(
  protocolId: ProtocolId,
  asset: string,
  chainId?: ChainId,
): Promise<number | null> {
  const key = cacheKey(protocolId, asset, chainId);
  const cached = getCached(key);
  if (cached !== undefined) return cached;

  let apy: number | null = null;
  const numericChain = chainId ? (EVM_CHAIN_NUMERIC[chainId] ?? 1) : 1;

  if (protocolId === "lido") {
    apy = await fetchLidoApy();
  } else if (protocolId === "etherfi") {
    if (asset === "weETHs") {
      apy = await fetchWeethsApyFromChain(getEthereumClient());
    } else {
      apy = await fetchEtherFiApy();
    }
  } else if (protocolId === "swell") {
    apy = await fetchSwellApyFromChain(getEthereumClient(), asset);
  } else if (protocolId === "aave") {
    apy = await fetchDefiLlamaApy("aave", asset.replace(/^a/, ""));
  } else if (protocolId === "morpho") {
    const vault =
      (chainId && findTokenVaultAddress("morpho", asset, chainId)) ??
      MORPHO_VAULT_ADDRESS[asset];
    apy = vault ? await fetchMorphoVaultNetApy(vault, numericChain) : null;
  } else if (protocolId === "morpho-sky") {
    const llamaSymbol = MORPHO_SKY_DEFILLAMA_SYMBOL[asset];
    apy = llamaSymbol
      ? await fetchDefiLlamaApyExact("morpho-blue", llamaSymbol)
      : null;
  } else if (protocolId === "spark") {
    const underlying = SPARK_DEFILLAMA_UNDERLYING[asset];
    apy = underlying
      ? await fetchDefiLlamaApyExact("spark-savings", underlying)
      : null;
  } else if (protocolId === "sky") {
    const llamaSymbol = SKY_DEFILLAMA_SYMBOL[asset];
    apy = llamaSymbol
      ? await fetchDefiLlamaApyExact("sky-lending", llamaSymbol)
      : null;
  } else if (protocolId === "rocketpool") {
    apy = await fetchDefiLlamaApyExact("rocket-pool-staking", "RETH");
  } else if (protocolId === "coinbase") {
    apy =
      (await fetchDefiLlamaApyExact("coinbase-wrapped-staked-eth", "CBETH")) ??
      (await fetchLidoApy());
  } else if (protocolId === "ethena") {
    apy = await fetchEthenaSusdeApy();
  } else if (protocolId === "kelp") {
    apy = await fetchDefiLlamaApyExact("kelp-dao", "RSETH");
  } else if (protocolId === "renzo") {
    apy = await fetchDefiLlamaApyExact("renzo", "EZETH");
  } else if (protocolId === "puffer") {
    apy = await fetchDefiLlamaApyExact("puffer-finance", "PUFETH");
  } else if (protocolId === "frax") {
    if (asset === "sfrxETH") {
      apy = await fetchDefiLlamaApyExact("frax-ether", "SFRXETH");
    } else {
      apy = await fetchDefiLlamaApyExact("frax", "SFRAX");
    }
  } else if (protocolId === "sparklend") {
    const llamaSymbol = SPARKLEND_DEFILLAMA_SYMBOL[asset];
    apy = llamaSymbol
      ? await fetchDefiLlamaApyExact("spark", llamaSymbol)
      : null;
  } else if (protocolId === "compound") {
    apy = await fetchDefiLlamaApyExact("compound-v3", asset);
  } else if (protocolId === "moonwell") {
    apy = await fetchDefiLlamaApyExact("moonwell", asset.replace(/^m/, ""));
  } else if (protocolId === "seamless") {
    apy = await fetchDefiLlamaApyExact("seamless", asset);
  }

  if (apy === null) {
    apy = FALLBACK_APY[fallbackKey(protocolId, asset)] ?? null;
  }

  if (apy !== null) {
    setCache(key, apy);
  }

  return apy;
}

/** Base ETH/LST staking APY for an underlying token restaked on EigenLayer. */
async function fetchBaseLstStakingApy(
  underlyingSymbol: string,
  asset: string,
): Promise<number> {
  const symbol = underlyingSymbol.toUpperCase();

  if (symbol === "STETH" || symbol === "WSTETH" || asset === "stETH" || asset === "wstETH") {
    return (await fetchLidoApy()) ?? FALLBACK_APY["lido:stETH"];
  }

  if (symbol === "RETH" || symbol === "CBETH" || asset === "rETH" || asset === "cbETH") {
    const rEthApy =
      asset === "rETH"
        ? await fetchDefiLlamaApyExact("rocket-pool-staking", "RETH")
        : null;
    if (rEthApy != null) return rEthApy;
    return (await fetchLidoApy()) ?? FALLBACK_APY["lido:stETH"];
  }

  if (symbol === "RSETH" || symbol === "EZETH" || symbol === "PUFETH" || asset === "rsETH" || asset === "ezETH" || asset === "pufETH") {
    return (await fetchLidoApy()) ?? FALLBACK_APY["lido:stETH"];
  }

  if (symbol === "EETH" || asset === "eETH") {
    return (await fetchApy("etherfi", "eETH")) ?? FALLBACK_APY["etherfi:eETH"];
  }

  if (symbol === "WEETH" || asset === "weETH") {
    return (await fetchApy("etherfi", "weETH")) ?? FALLBACK_APY["etherfi:weETH"];
  }

  // Native beacon ETH and unknown LSTs — ETH staking benchmark.
  return (await fetchLidoApy()) ?? FALLBACK_APY["lido:stETH"];
}

/**
 * EigenLayer AVS restaking premium (annual %), on top of base LST staking.
 * Estimated as liquid restaking token APY minus base Lido staking when available.
 */
async function fetchEigenLayerRestakingPremium(): Promise<number> {
  const cacheKey = "eigenlayer:restaking-premium";
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  const baseStaking = await fetchLidoApy();
  const liquidRestakingTotal =
    (await fetchEtherFiApy()) ?? FALLBACK_APY["etherfi:weETH"];

  let premium = EIGENLAYER_RESTAKING_PREMIUM_FALLBACK;
  if (baseStaking != null && liquidRestakingTotal > baseStaking) {
    premium = liquidRestakingTotal - baseStaking;
  }

  setCache(cacheKey, premium);
  return premium;
}

/**
 * Combined APY for assets restaked on EigenLayer: base LST staking + restaking premium.
 * Example: ~2.4% Lido + ~1.8% EigenLayer ≈ ~4.2% total for restaked stETH.
 */
export async function fetchEigenLayerRestakedApy(
  underlyingSymbol: string,
  asset: string,
): Promise<number> {
  const cacheKey = `eigenlayer:combined:${underlyingSymbol.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  const [baseApy, restakingPremium] = await Promise.all([
    fetchBaseLstStakingApy(underlyingSymbol, asset),
    fetchEigenLayerRestakingPremium(),
  ]);

  const combined = baseApy + restakingPremium;
  setCache(cacheKey, combined);
  return combined;
}
