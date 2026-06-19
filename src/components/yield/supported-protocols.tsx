import Link from "next/link";
import {
  ACTIVE_NETWORK_NAMES,
  FEATURED_PROTOCOL_NAMES,
  PLANNED_NETWORK_NAMES,
} from "@/lib/constants/coverage";
import { CoverageChip } from "@/components/content/coverage-chip";

export function SupportedProtocols() {
  return (
    <section
      className="w-full space-y-6 text-center"
      aria-label="Supported protocols and networks"
    >
      <div className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Supported Protocols
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {FEATURED_PROTOCOL_NAMES.map((name) => (
            <CoverageChip key={name} label={name} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Supported Networks
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {ACTIVE_NETWORK_NAMES.map((name) => (
            <CoverageChip key={name} label={name} />
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs text-zinc-400">Future support</p>
          <div className="flex flex-wrap justify-center gap-2">
            {PLANNED_NETWORK_NAMES.map((name) => (
              <CoverageChip key={name} label={name} muted />
            ))}
          </div>
        </div>
      </div>

      <p>
        <Link
          href="/supported"
          className="text-xs text-emerald-600 underline-offset-2 hover:underline"
        >
          View full coverage →
        </Link>
      </p>
    </section>
  );
}
