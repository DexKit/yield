import type { ChainYieldGroup } from "@/types/yield";

export interface ProtocolRateLine {
  label: string;
  apy: number;
}

/** Extract displayable protocol APY lines from wallet positions (highest APY per label). */
export function extractProtocolRates(chains: ChainYieldGroup[]): ProtocolRateLine[] {
  const byLabel = new Map<string, number>();

  for (const chain of chains) {
    for (const protocol of chain.protocols) {
      for (const position of protocol.positions) {
        if (position.apy === null) continue;

        const assetSuffix =
          position.label && position.label !== position.asset
            ? ` ${position.label}`
            : position.asset && !["stETH", "wstETH", "eETH", "weETH"].includes(position.asset)
              ? ` ${position.asset}`
              : "";

        const label = `${protocol.protocolName}${assetSuffix}`.trim();
        const existing = byLabel.get(label);
        if (existing === undefined || position.apy > existing) {
          byLabel.set(label, position.apy);
        }
      }
    }
  }

  return [...byLabel.entries()]
    .map(([label, apy]) => ({ label, apy }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function formatMinutesAgo(iso: string, nowMs = Date.now()): string {
  const diffMs = Math.max(0, nowMs - new Date(iso).getTime());
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}

export function formatUtcRefreshTime(iso: string): string {
  const date = new Date(iso);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
}
