import {
  isEvmAddress,
  isEnsName,
  isSolanaAddress,
} from "@/lib/validation/identifier";
import {
  lookupEnsName as resolveEnsNameReverse,
  resolveEnsAddress,
} from "@/lib/chains/ens-resolver";
import type { ChainAdapter } from "./types";
import type { ResolvedIdentifier } from "@/types/yield";

export class EvmChainAdapter implements ChainAdapter {
  readonly family = "evm" as const;

  canHandle(identifier: string): boolean {
    return isEvmAddress(identifier) || isEnsName(identifier);
  }

  async resolveIdentifier(identifier: string): Promise<ResolvedIdentifier> {
    const trimmed = identifier.trim();

    if (isEvmAddress(trimmed)) {
      return {
        raw: trimmed,
        type: "evm-address",
        address: trimmed.toLowerCase() as `0x${string}`,
        ensName: null,
        chainId: "ethereum",
      };
    }

    if (isEnsName(trimmed)) {
      const address = await resolveEnsAddress(trimmed);
      if (!address) {
        return {
          raw: trimmed,
          type: "ens",
          address: null,
          ensName: trimmed,
          chainId: null,
        };
      }
      return {
        raw: trimmed,
        type: "ens",
        address,
        ensName: trimmed,
        chainId: "ethereum",
      };
    }

    if (isSolanaAddress(trimmed)) {
      return {
        raw: trimmed,
        type: "solana-address",
        address: null,
        ensName: null,
        chainId: null,
      };
    }

    return {
      raw: trimmed,
      type: "unknown",
      address: null,
      ensName: null,
      chainId: null,
    };
  }

  async lookupEnsName(address: `0x${string}`): Promise<string | null> {
    return resolveEnsNameReverse(address);
  }
}

export const evmChainAdapter = new EvmChainAdapter();
