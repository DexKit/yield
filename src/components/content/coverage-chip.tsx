import { cn } from "@/lib/utils";

export function CoverageChip({
  label,
  muted = false,
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        muted
          ? "border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500"
          : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
      )}
    >
      {label}
    </span>
  );
}
