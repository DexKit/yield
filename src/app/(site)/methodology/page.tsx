import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentBackLink,
  ContentPage,
  ContentSection,
} from "@/components/content/content-page";
import { MethodologyFlow } from "@/components/content/methodology-flow";
import { YIELD_DISCLAIMER } from "@/lib/constants/trust";
import { METHODOLOGY_FORMULA } from "@/lib/constants/methodology";
import { buildContentPageMetadata } from "@/lib/seo/content-metadata";

export const metadata: Metadata = buildContentPageMetadata(
  "/methodology",
  "Methodology",
  "How Yield by DexKit detects wallet balances, identifies protocols, sources APY rates, and estimates earnings.",
);

export default function MethodologyPage() {
  return (
    <ContentPage
      title="Methodology"
      description="A simple overview of how we estimate DeFi yield for any wallet. No black boxes — just balances, rates, and math."
    >
      <ContentSection title="How estimates are built">
        <MethodologyFlow />
      </ContentSection>

      <ContentSection
        title="The formula"
        description="At its core, every position uses the same idea."
      >
        <p className="rounded-lg border border-zinc-100 bg-zinc-50 px-5 py-4 text-center text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
          {METHODOLOGY_FORMULA}
        </p>
      </ContentSection>

      <ContentSection title="What to expect">
        <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <li className="flex gap-2">
            <span className="text-yield-accent" aria-hidden>
              ·
            </span>
            Estimates use <strong className="font-medium text-zinc-800 dark:text-zinc-100">current</strong> balances and rates — not guaranteed future returns.
          </li>
          <li className="flex gap-2">
            <span className="text-yield-accent" aria-hidden>
              ·
            </span>
            Only{" "}
            <Link href="/supported" className="text-yield-accent hover:underline">
              supported protocols and networks
            </Link>{" "}
            are included.
          </li>
          <li className="flex gap-2">
            <span className="text-yield-accent" aria-hidden>
              ·
            </span>
            Small positions (under $1) may be hidden in the UI but still count toward totals.
          </li>
          <li className="flex gap-2">
            <span className="text-yield-accent" aria-hidden>
              ·
            </span>
            This is informational only — not financial advice.
          </li>
        </ul>
      </ContentSection>

      <p className="text-center text-xs text-zinc-400">{YIELD_DISCLAIMER}</p>

      <ContentBackLink />
    </ContentPage>
  );
}
