import { cn } from "@/lib/utils";

interface ChainBadgeProps {
  badge: string;
  className?: string;
}

export function ChainBadge({ badge, className }: ChainBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
        className,
      )}
    >
      {badge}
    </span>
  );
}
