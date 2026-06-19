import {
  SUPPORTED_NETWORKS,
  SUPPORTED_PROTOCOLS,
} from "@/lib/constants/trust";

export type YieldEmptyStateVariant = "empty" | "unsupported-assets";

interface YieldEmptyStateProps {
  variant: YieldEmptyStateVariant;
}

const MESSAGES: Record<YieldEmptyStateVariant, { title: string; body: string }> =
  {
    empty: {
      title: "No supported yield positions found.",
      body: "This wallet does not currently hold positions in supported protocols.",
    },
    "unsupported-assets": {
      title: "Assets detected, but none currently generate supported yield.",
      body: "We found token balances, but they are not in supported yield protocols.",
    },
  };

export function YieldEmptyState({ variant }: YieldEmptyStateProps) {
  const message = MESSAGES[variant];

  return (
    <div className="space-y-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {message.title}
        </p>
        <p className="text-sm text-zinc-500">{message.body}</p>
      </div>

      <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="mb-2 font-medium text-zinc-600 dark:text-zinc-400">
          Currently supported
        </p>
        <p>
          {SUPPORTED_NETWORKS.join(", ")} ·{" "}
          {SUPPORTED_PROTOCOLS.slice(0, 5).join(", ")}
        </p>
      </div>
    </div>
  );
}
