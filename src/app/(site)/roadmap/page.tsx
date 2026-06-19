import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentBackLink,
  ContentPage,
  ContentSection,
} from "@/components/content/content-page";
import {
  ROADMAP_SECTIONS,
  SHIPPED_HIGHLIGHTS,
  type RoadmapStatus,
} from "@/lib/constants/roadmap";
import { buildContentPageMetadata } from "@/lib/seo/content-metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildContentPageMetadata(
  "/roadmap",
  "Roadmap",
  "What's shipped, in progress, and planned for Yield by DexKit — chains, protocols, cards, SEO, and distribution.",
);

const STATUS_LABELS: Record<RoadmapStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  planned: "Planned",
};

const STATUS_STYLES: Record<RoadmapStatus, string> = {
  shipped: "text-emerald-600",
  "in-progress": "text-amber-600",
  planned: "text-zinc-400",
};

function RoadmapItemRow({
  title,
  status,
  priority,
  description,
}: {
  title: string;
  status: RoadmapStatus;
  priority?: "P1" | "P2";
  description?: string;
}) {
  return (
    <li className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </span>
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          {priority && (
            <span className="text-zinc-400">{priority}</span>
          )}
          <span className={cn(STATUS_STYLES[status])}>
            {STATUS_LABELS[status]}
          </span>
        </span>
      </div>
      {description && (
        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      )}
    </li>
  );
}

export default function RoadmapPage() {
  return (
    <ContentPage
      title="Roadmap"
      description="Yield by DexKit is open source and actively developed. Here's what's live today and what we're building next."
    >
      <ContentSection title="Already shipped">
        <ul className="grid gap-2 sm:grid-cols-2">
          {SHIPPED_HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
            >
              <span className="text-emerald-600" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </ContentSection>

      {ROADMAP_SECTIONS.map((section) => (
        <ContentSection
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
        >
          <ul className="space-y-3">
            {section.items.map((item) => (
              <RoadmapItemRow key={item.title} {...item} />
            ))}
          </ul>
        </ContentSection>
      ))}

      <p className="text-center text-sm text-zinc-500">
        Track progress or contribute on{" "}
        <Link
          href="https://github.com/DexKit/yield"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 underline-offset-2 hover:underline"
        >
          GitHub
        </Link>
        . Current protocol coverage is on the{" "}
        <Link
          href="/supported"
          className="text-emerald-600 underline-offset-2 hover:underline"
        >
          supported page
        </Link>
        .
      </p>

      <ContentBackLink />
    </ContentPage>
  );
}
