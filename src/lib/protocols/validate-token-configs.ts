import { getAddress, isAddress } from "viem";
import type { ProtocolConfig } from "@/types/protocol";

/**
 * Fail fast at module load when any protocol token address is invalid.
 * viem rejects non-checksummed or wrong-length addresses at RPC call time;
 * this surfaces mistakes during build with protocol + symbol context.
 *
 * @see docs/protocols/address-validation.md
 */
export function validateProtocolTokenConfigs(configs: ProtocolConfig[]): void {
  for (const protocol of configs) {
    for (const token of protocol.tokens) {
      const label = `${protocol.id}/${token.symbol}`;

      if (!isAddress(token.address, { strict: false })) {
        throw new Error(
          `[${label}] Invalid EVM address "${token.address}". ` +
            "Must be 20 bytes (40 hex chars). See docs/protocols/address-validation.md",
        );
      }

      let checksummed: `0x${string}`;
      try {
        checksummed = getAddress(token.address);
      } catch {
        throw new Error(
          `[${label}] Address "${token.address}" failed EIP-55 checksum. ` +
            "Wrap the literal in getAddress() with the correct lowercase hex from an official source.",
        );
      }

      if (checksummed !== token.address) {
        throw new Error(
          `[${label}] Address must be checksummed. ` +
            `Use getAddress("${token.address.toLowerCase()}") → ${checksummed}`,
        );
      }
    }
  }
}
