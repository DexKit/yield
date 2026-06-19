import type { CompoundConfig, ProtocolConfig } from "@/types/protocol";
import { getAddress } from "viem";

/** Liquid staking — Rocket Pool. */
export const ROCKETPOOL_CONFIG: ProtocolConfig = {
  id: "rocketpool",
  name: "Rocket Pool",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "rETH",
      address: getAddress("0xae78736Cd615f374D3085123A210448E74Fa6393"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Coinbase wrapped staked ETH. */
export const COINBASE_CONFIG: ProtocolConfig = {
  id: "coinbase",
  name: "Coinbase",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "cbETH",
      address: getAddress("0xBe9895146f7AF43049ca1c1AE358B0541Ea49704"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Ethena synthetic dollar yield (sUSDe vault). */
export const ETHENA_CONFIG: ProtocolConfig = {
  id: "ethena",
  name: "Ethena",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "sUSDe",
      address: getAddress("0x9D39A5DE30e57443BfF2A8307a4256c8797A3497"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
  ],
};

/** Kelp DAO rsETH. */
export const KELP_CONFIG: ProtocolConfig = {
  id: "kelp",
  name: "Kelp",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "rsETH",
      address: getAddress("0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Renzo ezETH. */
export const RENZO_CONFIG: ProtocolConfig = {
  id: "renzo",
  name: "Renzo",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "ezETH",
      address: getAddress("0xbf5495Efe5DB9ce00f80364C8B423296e8e67E2b"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Puffer pufETH. */
export const PUFFER_CONFIG: ProtocolConfig = {
  id: "puffer",
  name: "Puffer",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "pufETH",
      address: getAddress("0xD9A442856C234a39a81a089C06451EBAa43064a2"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Frax ETH + stable yield tokens. */
export const FRAX_CONFIG: ProtocolConfig = {
  id: "frax",
  name: "Frax",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "sfrxETH",
      address: getAddress("0xac3E018457B222d9321442585F3852af3535c9Ce"),
      decimals: 18,
      priceSymbol: "ethereum",
      erc4626: true,
    },
    {
      symbol: "sFRAX",
      address: getAddress("0xA663B02CF0a152b006d677Bbfb74B83274C2F961"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "frax",
      erc4626: true,
    },
  ],
};

/**
 * SparkLend supply tokens unique to Spark (avoids duplicate Aave USDC/USDT addresses).
 * @see https://github.com/sparkdotfi/spark-address-registry
 */
export const SPARKLEND_CONFIG: ProtocolConfig = {
  id: "sparklend",
  name: "SparkLend",
  chainId: "ethereum",
  tokens: [
    {
      symbol: "slUSDS",
      address: getAddress("0x32a6268f9Ba3642Dda7892aDd74f1D34469A4259"),
      decimals: 18,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "slUSDE",
      address: getAddress("0x4F5923Fc5FD4a93352581b38B7cD26943012DECF"),
      decimals: 18,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "slPrimeUSDS",
      address: getAddress("0x09AA30b182488f769a9824F15E6Ce58591Da4781"),
      decimals: 18,
      priceSymbol: "usd-coin",
    },
  ],
};

/** Compound III (Comet) markets on Ethereum. */
export const COMPOUND_ETHEREUM_CONFIG: CompoundConfig = {
  id: "compound",
  name: "Compound",
  chainId: "ethereum",
  markets: [
    {
      symbol: "cUSDCv3",
      cometAddress: getAddress("0xc3d688B667034D54525dCC6fea7FC7E0203391D0"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "cWETHv3",
      cometAddress: getAddress("0xA17581A9E3356d9A858b789D68B4d866e593aE94"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Compound III on Base. */
export const COMPOUND_BASE_CONFIG: CompoundConfig = {
  id: "compound",
  name: "Compound",
  chainId: "base",
  markets: [
    {
      symbol: "cUSDCv3",
      cometAddress: getAddress("0xb125E6687d4313864e53df431d4897B8243b94bd"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "cWETHv3",
      cometAddress: getAddress("0x46e6b214b5923ec8099adbb99377d4bAfB2bA2f6"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Top Morpho vaults on Base (by TVL). */
export const MORPHO_BASE_CONFIG: ProtocolConfig = {
  id: "morpho",
  name: "Morpho",
  chainId: "base",
  tokens: [
    {
      symbol: "mvGtUSDC",
      address: getAddress("0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "mvSteakUSDC",
      address: getAddress("0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
  ],
};

/** Top Morpho vaults on Arbitrum (by TVL). */
export const MORPHO_ARBITRUM_CONFIG: ProtocolConfig = {
  id: "morpho",
  name: "Morpho",
  chainId: "arbitrum",
  tokens: [
    {
      symbol: "mvGtUSDC",
      address: getAddress("0x7e97fa6893871A2751B5fE961978DCCb2c201E65"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "mvBbqUSDC",
      address: getAddress("0x5c0C306Aaa9F877de636f4d5822cA9F2E81563BA"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
  ],
};

/** Moonwell lending markets on Base. */
export const MOONWELL_BASE_CONFIG: ProtocolConfig = {
  id: "moonwell",
  name: "Moonwell",
  chainId: "base",
  tokens: [
    {
      symbol: "mUSDC",
      address: getAddress("0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22"),
      decimals: 8,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      mToken: true,
    },
    {
      symbol: "mWETH",
      address: getAddress("0x628ff693426583D9a7FB391E54366292F509D457"),
      decimals: 8,
      underlyingDecimals: 18,
      priceSymbol: "ethereum",
      mToken: true,
    },
  ],
};

/** Seamless yield vaults on Base (ERC-4626). */
export const SEAMLESS_BASE_CONFIG: ProtocolConfig = {
  id: "seamless",
  name: "Seamless",
  chainId: "base",
  tokens: [
    {
      symbol: "seamUSDC",
      address: getAddress("0x616a4E1db48e22028f6bbf20444Cd3b8e3273738"),
      decimals: 18,
      underlyingDecimals: 6,
      priceSymbol: "usd-coin",
      erc4626: true,
    },
    {
      symbol: "seamWETH",
      address: getAddress("0x27d8c7273fd3fcc6956a0b370ce5fd4a7fc65c18"),
      decimals: 18,
      underlyingDecimals: 18,
      priceSymbol: "ethereum",
      erc4626: true,
    },
  ],
};

/** Aave v3 on Arbitrum — top supplied assets. */
export const AAVE_ARBITRUM_CONFIG: ProtocolConfig = {
  id: "aave",
  name: "Aave",
  chainId: "arbitrum",
  tokens: [
    {
      symbol: "aUSDC",
      address: getAddress("0x724dc807b04555b71ed48a6896b6F41593b8C637"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "aWETH",
      address: getAddress("0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

/** Aave v3 on Optimism — top supplied assets. */
export const AAVE_OPTIMISM_CONFIG: ProtocolConfig = {
  id: "aave",
  name: "Aave",
  chainId: "optimism",
  tokens: [
    {
      symbol: "aUSDC",
      address: getAddress("0x38d693cE1dF5AaDF7bC62595A37D667aD57922e5"),
      decimals: 6,
      priceSymbol: "usd-coin",
    },
    {
      symbol: "aWETH",
      address: getAddress("0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8"),
      decimals: 18,
      priceSymbol: "ethereum",
    },
  ],
};

export const EXTENDED_PROTOCOL_CONFIGS: ProtocolConfig[] = [
  ROCKETPOOL_CONFIG,
  COINBASE_CONFIG,
  ETHENA_CONFIG,
  KELP_CONFIG,
  RENZO_CONFIG,
  PUFFER_CONFIG,
  FRAX_CONFIG,
  SPARKLEND_CONFIG,
  MORPHO_BASE_CONFIG,
  MORPHO_ARBITRUM_CONFIG,
  MOONWELL_BASE_CONFIG,
  SEAMLESS_BASE_CONFIG,
  AAVE_ARBITRUM_CONFIG,
  AAVE_OPTIMISM_CONFIG,
];

export const COMPOUND_CONFIGS: CompoundConfig[] = [
  COMPOUND_ETHEREUM_CONFIG,
  COMPOUND_BASE_CONFIG,
];
