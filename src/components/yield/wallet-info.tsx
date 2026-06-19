import { truncateAddress } from "@/lib/utils";
import type { WalletYieldResult } from "@/types/yield";

interface WalletInfoProps {
  result: WalletYieldResult;
}

export function WalletInfo({ result }: WalletInfoProps) {
  const displayName = result.ensName ?? truncateAddress(result.address);

  return (
    <div className="space-y-1 text-center">
      <p className="text-sm text-zinc-500">Wallet</p>
      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {displayName}
      </p>
      {result.ensName && (
        <p className="font-mono text-xs text-zinc-400">{result.address}</p>
      )}
    </div>
  );
}
