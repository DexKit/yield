import type { Address } from "viem";
import type { ChainId } from "./chain";

export type ProtocolId =
  | "lido"
  | "etherfi"
  | "swell"
  | "aave"
  | "eigenlayer"
  | "morpho"
  | "morpho-sky"
  | "spark"
  | "sparklend"
  | "sky"
  | "ethena"
  | "rocketpool"
  | "coinbase"
  | "kelp"
  | "renzo"
  | "puffer"
  | "frax"
  | "compound"
  | "moonwell"
  | "seamless";

/** Receipt-token or position symbol shown in the UI. */
export type SupportedAsset = string;

export interface TokenConfig {
  symbol: SupportedAsset;
  address: Address;
  decimals: number;
  priceSymbol: string;
  /** Boring-vault accountant for share → ETH conversion (weETHs). */
  shareRateAccountant?: Address;
  /** ERC-4626 vault share — underlying amount via convertToAssets. */
  erc4626?: boolean;
  /** Underlying asset decimals when erc4626 is true (defaults to decimals). */
  underlyingDecimals?: number;
  /** Compound / Moonwell-style market token — convert via exchangeRateStored. */
  mToken?: boolean;
}

/** Compound III Comet market — supply balance read from the Comet contract. */
export interface CometMarketConfig {
  symbol: SupportedAsset;
  cometAddress: Address;
  decimals: number;
  priceSymbol: string;
}

export interface CompoundConfig {
  id: "compound";
  name: string;
  chainId: ChainId;
  markets: CometMarketConfig[];
}

export interface ProtocolConfig {
  id: ProtocolId;
  name: string;
  chainId: ChainId;
  tokens: TokenConfig[];
  visibilityOnly?: boolean;
}
