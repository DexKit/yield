import { z } from "zod";

const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const ensRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

/** Solana base58 address (32–44 chars) — reserved for future use. */
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const identifierSchema = z
  .string()
  .trim()
  .min(1, "Please enter a wallet address or ENS name")
  .max(255, "Identifier is too long")
  .refine(
    (val) =>
      evmAddressRegex.test(val) ||
      ensRegex.test(val.toLowerCase()) ||
      solanaAddressRegex.test(val),
    { message: "Enter a valid Ethereum address or ENS name" },
  );

export type IdentifierInput = z.infer<typeof identifierSchema>;

export function isEvmAddress(value: string): boolean {
  return evmAddressRegex.test(value);
}

export function isEnsName(value: string): boolean {
  return ensRegex.test(value.toLowerCase());
}

export function isSolanaAddress(value: string): boolean {
  return solanaAddressRegex.test(value);
}

/** Sanitize URL path segment — strip dangerous characters. */
export function sanitizeIdentifierParam(raw: string): string {
  return decodeURIComponent(raw).trim().slice(0, 255);
}
