import { getWalletDisplayName } from "@/lib/seo/wallet-url";
import type { WalletYieldResult } from "@/types/yield";

interface WalletPageTitleProps {
  result: WalletYieldResult;
}

export function WalletPageTitle({ result }: WalletPageTitleProps) {
  const wallet = getWalletDisplayName(result);
  const isAddress = !result.ensName;

  return (
    <h1 className="flex flex-col items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:gap-2.5 sm:text-3xl">
      <span className="leading-snug">How Much Yield Does</span>
      <span
        className={
          isAddress
            ? "max-w-full px-1 font-mono text-base leading-relaxed break-all text-yield-accent sm:text-lg"
            : "leading-snug text-yield-accent"
        }
      >
        {wallet}
      </span>
      <span className="leading-snug">Generate?</span>
    </h1>
  );
}
