import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogShare } from "@/components/blog/blog-share";
import { ContentBackLink } from "@/components/content/content-page";
import { YIELD_DISCLAIMER } from "@/lib/constants/trust";
import { getBlogPost } from "@/lib/blog/posts";
import {
  buildStrategyEthereumCardPath,
  getStrategyEthereumCardAbsoluteUrl,
} from "@/lib/blog/strategy-card-url";
import {
  getCachedStrategyEthereumYield,
  STRATEGY_BTC_HOLDINGS,
  STRATEGY_COMPANY_NAME,
} from "@/lib/blog/strategy-yield-service";
import { absoluteUrl } from "@/lib/seo/site";
import { formatCompactAmount, formatCompactUsd, formatMoney } from "@/lib/utils";
import { notFound } from "next/navigation";

const POST_SLUG = "strategy-ethereum-yield";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPost(POST_SLUG);
  if (!post) return { title: "Not found" };

  const url = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardImage = getStrategyEthereumCardAbsoluteUrl({ theme: "dark" });

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      images: [{ url: cardImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [cardImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function StrategyEthereumYieldPost() {
  const post = getBlogPost(POST_SLUG);
  if (!post) notFound();

  const data = await getCachedStrategyEthereumYield();
  const pageUrl = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardPath = buildStrategyEthereumCardPath();

  const shareText = `${STRATEGY_COMPANY_NAME} holds ${formatCompactAmount(STRATEGY_BTC_HOLDINGS)} BTC. Same value in ETH (Lido) → ${formatCompactUsd(data.monthlyYieldUsd)}/month in yield. Bitcoin earns $0.`;

  return (
    <article className="mx-auto max-w-xl space-y-8 px-4 py-12 sm:py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {post.publishedAt} · 2 min read
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {post.title}
        </h1>
      </header>

      <div className="space-y-6 text-center text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          <strong>{STRATEGY_COMPANY_NAME}</strong> holds about{" "}
          <strong>{formatCompactAmount(STRATEGY_BTC_HOLDINGS)} BTC</strong> (
          {formatCompactUsd(data.treasuryValueUsd)}). Bitcoin sits idle —{" "}
          <strong>0% yield</strong>.
        </p>
        <p>
          Same treasury in <strong>Ethereum</strong>, staked via{" "}
          <strong>Lido</strong> at{" "}
          <strong>{data.lidoApyPercent.toFixed(1)}% APY</strong>:
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <Image
          src={`${cardPath}?theme=dark`}
          alt={`Estimated ETH yield for ${STRATEGY_COMPANY_NAME} treasury`}
          width={1200}
          height={630}
          className="h-auto w-full"
          priority
          unoptimized
        />
      </div>

      <dl className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">Monthly</dt>
          <dd className="mt-1 text-2xl font-bold text-yield-accent sm:text-3xl">
            {formatMoney(data.monthlyYieldUsd)}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">Yearly</dt>
          <dd className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {formatCompactUsd(data.yearlyYieldUsd)}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">BTC yield</dt>
          <dd className="mt-1 text-2xl font-bold text-zinc-400 sm:text-3xl">$0</dd>
        </div>
      </dl>

      <blockquote className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 px-5 py-4 text-left text-base font-medium text-zinc-800 dark:bg-emerald-950/20 dark:text-zinc-200">
        {shareText}
      </blockquote>

      <BlogShare url={pageUrl} shareText={shareText} title={post.title} />

      <p className="text-center text-sm text-zinc-500">
        Card updates live with BTC/ETH prices and Lido APY.{" "}
        <Link
          href={cardPath}
          className="text-yield-accent underline-offset-2 hover:underline"
        >
          Open PNG
        </Link>
      </p>

      <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p>
          Hypothetical only: assumes the full BTC treasury were converted to ETH
          and staked via Lido stETH at current rates. Not financial advice. BTC
          holdings figure from public Strategy disclosures (~
          {STRATEGY_BTC_HOLDINGS.toLocaleString()} BTC).
        </p>
        <p className="mt-2">{YIELD_DISCLAIMER}</p>
      </div>

      <ContentBackLink />
    </article>
  );
}
