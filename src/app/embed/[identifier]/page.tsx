import { notFound } from "next/navigation";
import { EmbedRuntime } from "@/components/widgets/embed-runtime";
import { YieldWidget } from "@/components/widgets/yield-widget";
import { getCachedWalletYield } from "@/lib/seo/cached-yield";
import {
  parseWidgetTheme,
  parseWidgetVariant,
  widgetMinHeight,
} from "@/lib/widgets/embed-params";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ identifier: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EmbedPage({ params, searchParams }: PageProps) {
  const [{ identifier }, query] = await Promise.all([params, searchParams]);
  const result = await getCachedWalletYield(identifier);

  if (!result) {
    notFound();
  }

  const variant = parseWidgetVariant(query.variant);
  const theme = parseWidgetTheme(query.theme);
  const minHeight = widgetMinHeight(variant);

  return (
    <>
      <EmbedRuntime theme={theme} />
      <div style={{ minHeight }} aria-label="DexKit yield widget">
        <YieldWidget variant={variant} result={result} />
      </div>
    </>
  );
}
