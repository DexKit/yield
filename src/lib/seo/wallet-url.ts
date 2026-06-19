import { isEvmAddress, isEnsName } from "@/lib/validation/identifier";
import type { WalletYieldResult } from "@/types/yield";
import { absoluteUrl } from "./site";

export function getWalletDisplayName(result: WalletYieldResult): string {
  return result.ensName ?? result.address;
}

/** Preferred public slug for a resolved wallet (ENS name when available). */
export function getCanonicalWalletSlug(result: WalletYieldResult): string {
  return result.ensName ?? result.address;
}

/** Canonical path segment for routing, e.g. `/vitalik.eth`. */
export function getCanonicalWalletPath(result: WalletYieldResult): string {
  return `/${encodeURIComponent(getCanonicalWalletSlug(result))}`;
}

export function getCanonicalWalletUrl(result: WalletYieldResult): string {
  return absoluteUrl(getCanonicalWalletPath(result));
}

/**
 * Whether the requested URL slug should redirect to the canonical slug.
 * Consolidates address → ENS and normalizes address casing.
 */
export function shouldRedirectToCanonical(
  requestSlug: string,
  result: WalletYieldResult,
): boolean {
  const canonical = getCanonicalWalletSlug(result);
  const request = decodeURIComponent(requestSlug).trim();

  if (isEvmAddress(request) && isEvmAddress(canonical)) {
    return request.toLowerCase() !== canonical.toLowerCase();
  }

  if (isEnsName(request) && isEnsName(canonical)) {
    return request.toLowerCase() !== canonical.toLowerCase();
  }

  // Address in URL but ENS is the canonical identity.
  if (isEvmAddress(request) && result.ensName) {
    return true;
  }

  return request !== canonical;
}
