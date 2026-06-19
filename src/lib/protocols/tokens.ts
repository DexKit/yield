import type { ProtocolConfig } from "@/types/protocol";
import { getAddress } from "viem";
import { validateProtocolTokenConfigs } from "./validate-token-configs";
import {
  COMPOUND_CONFIGS,
  EXTENDED_PROTOCOL_CONFIGS,
} from "./tokens/extended-configs";

/**
 * Ethereum mainnet token addresses for supported yield assets.
 * Every address MUST use getAddress() — see docs/protocols/address-validation.md
 */
export const LIDO_CONFIG: ProtocolConfig = {
  id: "lido",
  name: "Lido",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "stETH",
      address: getAddress("0xae7ab96520de3a18e5e111b5eaab095312d7fe84"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "wstETH",
      address: getAddress("0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

export const ETHERFI_CONFIG: ProtocolConfig = {
  id: "etherfi",
  name: "Ether.fi",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "eETH",
      address: getAddress("0x35fa164735182de50811e8e2e824cfb9b6118ac2"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "weETH",
      address: getAddress("0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "weETHs",
      address: getAddress("0x917cee801a67f933f2e6b33fc0cd1ed2d5909d88"),
      decimals: 18,
      priceSymbol: "ethereum",
      shareRateAccountant: getAddress("0xbe16605b22a7facef247363312121670dfe5afbe"),
    },
  ],
};

export const SWELL_CONFIG: ProtocolConfig = {
  id: "swell",
  name: "Swell",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "swETH",
      address: getAddress("0xf951e335afb289353dc249e82926178eac7ded78"),
      decimals: 18,
      priceSymbol: "ethereum",
      shareRateAccountant: getAddress("0xf951e335afb289353dc249e82926178eac7ded78"),
    },
    {
      symbol: "rswETH",
      address: getAddress("0xfae103dc9cf190ed75350761e95403b7b8afa6c0"),
      decimals: 18,
      priceSymbol: "ethereum",
      shareRateAccountant: getAddress("0xfae103dc9cf190ed75350761e95403b7b8afa6c0"),
    },
  ],
};

export const AAVE_ETHEREUM_CONFIG: ProtocolConfig = {
  id: "aave",
  name: "Aave",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "aUSDC",
      address: getAddress("0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "aUSDT",
      address: getAddress("0x23878914efe38d27c4d67ab83ed1b93a74d4086a"),
      decimals: 6,
      priceSymbol: "tether",
    },
    {
      symbol: "aWETH",
      address: getAddress("0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "awstETH",
      address: getAddress("0x0B925eD163218f6662a35e0f0371Ac234f9E9371"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "aweETH",
      address: getAddress("0xBdfa7b7893081B35Fb54027489e2Bc7A38275129"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
    {
      symbol: "aWBTC",
      address: getAddress("0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8"),
      decimals: 8,
      priceSymbol: "wrapped-bitcoin",
    },
  ],
};

/** Aave v3 on Base — see https://github.com/bgd-labs/aave-address-book */
export const AAVE_BASE_CONFIG: ProtocolConfig = {
  id: "aave",
  name: "Aave",
  chainId: "base",
  tokens: [
    {
      symbol: "aUSDC",
      address: getAddress("0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "aWETH",
      address: getAddress("0xD4a0e0b9149BCee3C920d2E03ef068f299c78aB6"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** EigenLayer — position visibility only (restaked ETH via eETH/weETH or direct). */
export const EIGENLAYER_CONFIG: ProtocolConfig = {
  id: "eigenlayer",
  name: "EigenLayer",
  chainId: "ethereum",
  tokens: [],
  visibilityOnly: true,
};

/**
 * Top generic Morpho MetaMorpho vaults on Ethereum (by TVL).
 * @see https://app.morpho.org/ethereum/explore
 */
export const MORPHO_CONFIG: ProtocolConfig = {
  id: "morpho",
  name: "Morpho",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "mvSteakUSDC",
      address: getAddress("0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "mvSteakUSDT",
      address: getAddress("0xbEef047a543E45807105E51A8BBEFCc5950fcfBa"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "tether",
      erc4626: true,
    },
    {
      symbol: "mvGtUSDC",
      address: getAddress("0xdd0f28e19C1780eb6396170735D45153D261490d"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
  ],
};

/**
 * Top sky.money Morpho Vault V2 deployments on Ethereum (by TVL).
 * @see https://app.morpho.org/curator/sky-money
 */
export const MORPHO_SKY_CONFIG: ProtocolConfig = {
  id: "morpho-sky",
  name: "Morpho Sky",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "skyMvUSDT",
      address: getAddress("0x23f5E9c35820f4baB695Ac1F19c203cC3f8e1e11"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "tether",
      erc4626: true,
    },
    {
      symbol: "skyMvUSDS",
      address: getAddress("0xE15fcC81118895b67b6647BBd393182dF44E11E0"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "skyMvUSDC",
      address: getAddress("0x56bfa6f53669B836D1E0Dfa5e99706b12c373ecf"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
  ],
};

/**
 * Sky Savings products on Ethereum (by TVL: sUSDS, legacy sDAI).
 * @see https://developers.sky.money/protocol/tokens/susds/
 */
export const SKY_CONFIG: ProtocolConfig = {
  id: "sky",
  name: "Sky",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "sUSDS",
      address: getAddress("0xa3931d71877c0e7a3148cb7eb4463524fec27fbd"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "sDAI",
      address: getAddress("0x83f20f44975f03d1cab46e0ca68065d4dd365b5f"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "dai",
      erc4626: true,
    },
    {
      symbol: "stUSDS",
      address: getAddress("0x99cd4ec3f88a45940936f469e4bb72a2a701eeb9"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
  ],
};

/**
 * Top Spark Savings V2 vaults on Ethereum (by TVL: USDT, USDC, ETH).
 * @see https://docs.spark.fi/dev/savings/spark-vaults-v2
 */
export const SPARK_CONFIG: ProtocolConfig = {
  id: "spark",
  name: "Spark",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "spUSDT",
      address: getAddress("0xe2e7a17dFf93280dec073C995595155283e3C372"),
      decimals: 6,
      priceSymbol: "tether",
      erc4626: true,
    },
    {
      symbol: "spUSDC",
      address: getAddress("0x28B3a8fb53B741A8Fd78c0fb9A6B2393d896a43d"),
      decimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "spETH",
      address: getAddress("0xfE6eb3b609a7C8352A241f7F3A21CEA4e9209B8f"),
      decimals: 18,
      priceSymbol: "ethereum",
      erc4626: true,
    },
  ],
};

export const PROTOCOL_CONFIGS: ProtocolConfig[] = [
  LIDO_CONFIG,
  ETHERFI_CONFIG,
  SWELL_CONFIG,
  AAVE_ETHEREUM_CONFIG,
  AAVE_BASE_CONFIG,
  EIGENLAYER_CONFIG,
  MORPHO_CONFIG,
  MORPHO_SKY_CONFIG,
  SPARK_CONFIG,
  SKY_CONFIG,
  ...EXTENDED_PROTOCOL_CONFIGS,
];

validateProtocolTokenConfigs(PROTOCOL_CONFIGS);
export { COMPOUND_CONFIGS };
export {
  AAVE_ARBITRUM_CONFIG,
  AAVE_OPTIMISM_CONFIG,
  COINBASE_CONFIG,
  ETHENA_CONFIG,
  FRAX_CONFIG,
  KELP_CONFIG,
  MOONWELL_BASE_CONFIG,
  MORPHO_ARBITRUM_CONFIG,
  MORPHO_BASE_CONFIG,
  PUFFER_CONFIG,
  RENZO_CONFIG,
  ROCKETPOOL_CONFIG,
  SEAMLESS_BASE_CONFIG,
  SPARKLEND_CONFIG,
} from "./tokens/extended-configs";
