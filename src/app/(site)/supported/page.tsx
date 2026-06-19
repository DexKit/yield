import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentBackLink,
  ContentPage,
  ContentSection,
} from "@/components/content/content-page";
import { CoverageChip } from "@/components/content/coverage-chip";
import {
  COVERAGE_NETWORKS,
  COVERAGE_PROTOCOLS,
} from "@/lib/constants/coverage";
import { buildContentPageMetadata } from "@/lib/seo/content-metadata";

export const metadata: Metadata = buildContentPageMetadata(
  "/supported",
  "Supported Chains & Protocols",
  "See which networks and DeFi protocols Yield by DexKit currently tracks for wallet yield estimates.",
);

export default function SupportedPage() {
  const activeNetworks = COVERAGE_NETWORKS.filter((n) => n.status === "active");
  const plannedNetworks = COVERAGE_NETWORKS.filter((n) => n.status === "planned");

  return (
    <ContentPage
      title="Supported Chains & Protocols"
      description="Yield by DexKit scans wallet balances across these networks and DeFi protocols. Coverage expands over time — see the roadmap for what's next."
    >
      <ContentSection
        title="Supported networks"
        description="Networks actively scanned when you search a wallet."
      >
        <ul className="space-y-3">
          {activeNetworks.map((network) => (
            <li
              key={network.name}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="mb-2 flex items-center gap-2">
                <CoverageChip label={network.name} />
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                  Active
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {network.description}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        title="Supported protocols"
        description="DeFi protocols included in yield estimates today."
      >
        <ul className="space-y-3">
          {COVERAGE_PROTOCOLS.map((protocol) => (
            <li
              key={protocol.name}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {protocol.name}
                </span>
                {protocol.chains.map((chain) => (
                  <CoverageChip key={chain} label={chain} />
                ))}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {protocol.description}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        title="Planned networks"
        description="Chains on the roadmap — not yet included in wallet scans."
      >
        <ul className="space-y-3">
          {plannedNetworks.map((network) => (
            <li
              key={network.name}
              className="rounded-lg border border-dashed border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="mb-2 flex items-center gap-2">
                <CoverageChip label={network.name} muted />
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Planned
                </span>
              </div>
              <p className="text-sm text-zinc-500">{network.description}</p>
            </li>
          ))}
        </ul>
        <p className="text-center text-sm text-zinc-500">
          Want to know when new chains ship?{" "}
          <Link
            href="/roadmap"
            className="text-emerald-600 underline-offset-2 hover:underline"
          >
            View the roadmap
          </Link>
          .
        </p>
      </ContentSection>

      <ContentBackLink />
    </ContentPage>
  );
}
