import { cache } from "react";
import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";
import { fetchApy } from "@/lib/services/apy-service";

/**
 * Network staking ratio (~32% of supply, mid-2026).
 * Update when beacon aggregates shift materially; supply & APY are fetched live.
 */
export const ETH_STAKING_RATIO_CURRENT = 0.324;

/** Public EF ESP allocation totals (USD). Sources: ethereum.org allocation updates. */
export const EF_GRANTS_Q1_2025_USD = 32_647_065;
export const EF_GRANTS_Q4_2025_USD = 7_385_529;

/**
 * Minimum viable annual funding for Ethereum L1 core R&D (clients, research, coordination).
 * Public estimate used in Protocol Guild materials and validator-revenue debates.
 * @see https://ethresear.ch/t/validator-redirected-revenue/25248
 */
export const CORE_DEV_MIN_VIABLE_ANNUAL_USD = 30_000_000;

/** Approximate Protocol Guild distributions in 2025 (public reporting). */
export const PROTOCOL_GUILD_2025_DISTRIBUTED_USD = 12_000_000;

export const ETHRESEARCH_VALIDATOR_REVENUE_URL =
  "https://ethresear.ch/t/validator-redirected-revenue/25248";

export interface ValidatorRevenueSlice {
  percent: number;
  eth: number;
  usd: number;
}

export interface ValidatorRevenueScenario {
  id: "current" | "fifty_pct" | "seventy_pct";
  label: string;
  stakingRatio: number;
  stakedEth: number;
  validatorApyPercent: number;
  annualRevenueEth: number;
  annualRevenueUsd: number;
  onePercent: ValidatorRevenueSlice;
  tenPercent: ValidatorRevenueSlice;
}

export interface ValidatorRevenuePriceCase {
  id: "live" | "ath";
  label: string;
  ethPriceUsd: number;
  /** ISO date when ATH was reached (ATH case only). */
  athDate?: string;
  scenario: ValidatorRevenueScenario;
}

export interface ValidatorRevenueAnalysis {
  circulatingEth: number;
  /** Spot ETH/USD used for stake-ratio scenarios (CoinGecko). */
  ethPriceUsd: number;
  ethPriceFetchedAt: string;
  ethAthPriceUsd: number;
  ethAthDate?: string;
  livePriceCase: ValidatorRevenuePriceCase;
  athPriceCase: ValidatorRevenuePriceCase;
  liveValidatorApyPercent: number;
  scenarios: ValidatorRevenueScenario[];
  efGrantsQ1_2025Usd: number;
  efGrantsQ4_2025Usd: number;
  coreDevMinViableAnnualUsd: number;
  protocolGuild2025DistributedUsd: number;
  calculatedAt: string;
}

const COINGECKO_SUPPLY_URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false";

const FALLBACK_CIRCULATING_ETH = 120_700_000;
/** CoinGecko ATH fallback (Nov 2021) if market_data fetch fails. */
const FALLBACK_ETH_ATH_USD = 4_878.26;

interface EthereumMarketData {
  circulatingEth: number;
  livePriceUsd: number;
  athPriceUsd: number;
  athDate?: string;
  fetchedAt: string;
}

async function fetchEthereumMarketData(): Promise<EthereumMarketData> {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetchWithTimeout(COINGECKO_SUPPLY_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        circulatingEth: FALLBACK_CIRCULATING_ETH,
        livePriceUsd: 3500,
        athPriceUsd: FALLBACK_ETH_ATH_USD,
        athDate: "2021-11-10T00:00:00.000Z",
        fetchedAt,
      };
    }
    const data = (await res.json()) as {
      market_data?: {
        circulating_supply?: number;
        current_price?: { usd?: number };
        ath?: { usd?: number };
        ath_date?: { usd?: string };
      };
    };
    const market = data.market_data;
    const supply = market?.circulating_supply;
    const livePrice = market?.current_price?.usd;
    const athPrice = market?.ath?.usd;

    return {
      circulatingEth:
        supply && supply > 0 ? supply : FALLBACK_CIRCULATING_ETH,
      livePriceUsd: livePrice && livePrice > 0 ? livePrice : 3500,
      athPriceUsd:
        athPrice && athPrice > 0 ? athPrice : FALLBACK_ETH_ATH_USD,
      athDate: market?.ath_date?.usd,
      fetchedAt,
    };
  } catch {
    return {
      circulatingEth: FALLBACK_CIRCULATING_ETH,
      livePriceUsd: 3500,
      athPriceUsd: FALLBACK_ETH_ATH_USD,
      athDate: "2021-11-10T00:00:00.000Z",
      fetchedAt,
    };
  }
}

/** Protocol APY falls as more ETH stakes — simple ratio scaling from live rate. */
export function scaleValidatorApyForRatio(
  liveApyPercent: number,
  currentRatio: number,
  targetRatio: number,
): number {
  if (targetRatio <= 0 || currentRatio <= 0) return liveApyPercent;
  return liveApyPercent * (currentRatio / targetRatio);
}

function buildRedirectSlice(
  annualRevenueEth: number,
  annualRevenueUsd: number,
  percent: number,
): ValidatorRevenueSlice {
  const factor = percent / 100;
  return {
    percent,
    eth: annualRevenueEth * factor,
    usd: annualRevenueUsd * factor,
  };
}

function buildScenario(
  id: ValidatorRevenueScenario["id"],
  label: string,
  stakingRatio: number,
  circulatingEth: number,
  ethPriceUsd: number,
  apyPercent: number,
): ValidatorRevenueScenario {
  const stakedEth = circulatingEth * stakingRatio;
  const annualRevenueEth = stakedEth * (apyPercent / 100);
  const annualRevenueUsd = annualRevenueEth * ethPriceUsd;

  return {
    id,
    label,
    stakingRatio,
    stakedEth,
    validatorApyPercent: apyPercent,
    annualRevenueEth,
    annualRevenueUsd,
    onePercent: buildRedirectSlice(annualRevenueEth, annualRevenueUsd, 1),
    tenPercent: buildRedirectSlice(annualRevenueEth, annualRevenueUsd, 10),
  };
}

async function calculateValidatorRevenueAnalysis(): Promise<ValidatorRevenueAnalysis> {
  const [market, lidoApy] = await Promise.all([
    fetchEthereumMarketData(),
    fetchApy("lido", "stETH", "ethereum"),
  ]);

  const {
    circulatingEth,
    livePriceUsd: ethPriceUsd,
    athPriceUsd: ethAthPriceUsd,
    athDate: ethAthDate,
    fetchedAt: ethPriceFetchedAt,
  } = market;

  const liveValidatorApyPercent = lidoApy ?? 3.1;
  const currentRatio = ETH_STAKING_RATIO_CURRENT;

  const scenarios: ValidatorRevenueScenario[] = [
    buildScenario(
      "current",
      "Today (~32% staked)",
      currentRatio,
      circulatingEth,
      ethPriceUsd,
      liveValidatorApyPercent,
    ),
    buildScenario(
      "fifty_pct",
      "If 50% of supply staked",
      0.5,
      circulatingEth,
      ethPriceUsd,
      scaleValidatorApyForRatio(
        liveValidatorApyPercent,
        currentRatio,
        0.5,
      ),
    ),
    buildScenario(
      "seventy_pct",
      "If 70% of supply staked",
      0.7,
      circulatingEth,
      ethPriceUsd,
      scaleValidatorApyForRatio(
        liveValidatorApyPercent,
        currentRatio,
        0.7,
      ),
    ),
  ];

  const currentStakeScenario = scenarios[0];
  const athStakeScenario = buildScenario(
    "current",
    "Today (~32% staked) at ATH price",
    currentRatio,
    circulatingEth,
    ethAthPriceUsd,
    liveValidatorApyPercent,
  );

  const livePriceCase: ValidatorRevenuePriceCase = {
    id: "live",
    label: "Live spot (CoinGecko)",
    ethPriceUsd,
    scenario: currentStakeScenario,
  };

  const athPriceCase: ValidatorRevenuePriceCase = {
    id: "ath",
    label: "ETH all-time high",
    ethPriceUsd: ethAthPriceUsd,
    athDate: ethAthDate,
    scenario: athStakeScenario,
  };

  return {
    circulatingEth,
    ethPriceUsd,
    ethPriceFetchedAt,
    ethAthPriceUsd,
    ethAthDate,
    livePriceCase,
    athPriceCase,
    liveValidatorApyPercent,
    scenarios,
    efGrantsQ1_2025Usd: EF_GRANTS_Q1_2025_USD,
    efGrantsQ4_2025Usd: EF_GRANTS_Q4_2025_USD,
    coreDevMinViableAnnualUsd: CORE_DEV_MIN_VIABLE_ANNUAL_USD,
    protocolGuild2025DistributedUsd: PROTOCOL_GUILD_2025_DISTRIBUTED_USD,
    calculatedAt: new Date().toISOString(),
  };
}

export const getCachedValidatorRevenueAnalysis = cache(
  calculateValidatorRevenueAnalysis,
);

export function getScenarioById(
  analysis: ValidatorRevenueAnalysis,
  id: ValidatorRevenueScenario["id"],
): ValidatorRevenueScenario {
  const scenario = analysis.scenarios.find((s) => s.id === id);
  if (!scenario) {
    return analysis.scenarios[0];
  }
  return scenario;
}
