import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogShare } from "@/components/blog/blog-share";
import { ContentBackLink } from "@/components/content/content-page";
import { YIELD_DISCLAIMER } from "@/lib/constants/trust";
import {
  buildAppleEthereumCardPath,
  getAppleEthereumCardAbsoluteUrl,
} from "@/lib/blog/apple-card-url";
import {
  APPLE_COMPANY_NAME,
  APPLE_ETH_ALLOCATION_PCT,
  BITMINE_ETH_HOLDINGS,
  CORP_ETH_TREASURY_TOTAL,
  getCachedAppleEthereumYield,
} from "@/lib/blog/apple-yield-service";
import { getBlogPost } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/seo/site";
import { formatCompactAmount, formatCompactUsd, formatMoney } from "@/lib/utils";
import { notFound } from "next/navigation";

const POST_SLUG = "apple-ethereum-yield";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPost(POST_SLUG);
  if (!post) return { title: "Not found" };

  const url = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardImage = getAppleEthereumCardAbsoluteUrl({ theme: "dark" });

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

export default async function AppleEthereumYieldPost() {
  const post = getBlogPost(POST_SLUG);
  if (!post) notFound();

  const data = await getCachedAppleEthereumYield();
  const pageUrl = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardPath = buildAppleEthereumCardPath();

  const shareText = `${APPLE_COMPANY_NAME} holds ${formatCompactUsd(data.totalTreasuryUsd)} in cash & securities. If ${APPLE_ETH_ALLOCATION_PCT}% were staked ETH (Lido) → ${formatCompactUsd(data.monthlyYieldUsd)}/month in yield.`;

  return (
    <article className="mx-auto max-w-xl space-y-8 px-4 py-12 sm:py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {post.publishedAt} · 3 min read
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {post.title}
        </h1>
      </header>

      <div className="space-y-6 text-center text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          <strong>{APPLE_COMPANY_NAME}</strong> reported{" "}
          <strong>{formatCompactUsd(data.totalTreasuryUsd)}</strong> in cash and
          marketable securities (FY2026 Q2). Apple holds{" "}
          <strong>no crypto</strong> today — mostly U.S. Treasuries and
          investment-grade bonds (~4–5% yield, no price volatility).
        </p>
        <p>
          Hypothetically, if <strong>{APPLE_ETH_ALLOCATION_PCT}%</strong> (
          {formatCompactUsd(data.allocatedUsd)}) were converted to{" "}
          <strong>Ethereum</strong> and staked via <strong>Lido</strong> at{" "}
          <strong>{data.lidoApyPercent.toFixed(1)}% APY</strong>:
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <Image
          src={`${cardPath}?theme=dark`}
          alt={`Estimated ETH yield for ${APPLE_COMPANY_NAME} treasury`}
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
          <dt className="text-xs uppercase tracking-wider text-zinc-400">Daily</dt>
          <dd className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {formatCompactUsd(data.dailyYieldUsd)}
          </dd>
        </div>
      </dl>

      <section className="space-y-4 text-left text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Scale &amp; market impact
        </h2>
        <p>
          At ETH ≈ {formatMoney(data.ethPriceUsd)}, {APPLE_ETH_ALLOCATION_PCT}%
          of Apple&apos;s treasury would buy roughly{" "}
          <strong>{formatCompactAmount(data.equivalentEth)} ETH</strong> — about{" "}
          <strong>{data.pctOfEthSupply.toFixed(0)}%</strong> of circulating
          supply and <strong>{data.pctOfEthMarketCap.toFixed(0)}%</strong> of
          ETH market cap at spot. That exceeds the entire corporate ETH treasury
          sector (~{formatCompactAmount(CORP_ETH_TREASURY_TOTAL)} ETH) by{" "}
          {Math.round(data.equivalentEth / CORP_ETH_TREASURY_TOTAL)}× and
          BitMine&apos;s ~{formatCompactAmount(BITMINE_ETH_HOLDINGS)} ETH stack
          by ~{Math.round(data.equivalentEth / BITMINE_ETH_HOLDINGS)}×.
        </p>
        <p>
          You cannot deploy {formatCompactUsd(data.allocatedUsd)} at today&apos;s
          price without massive slippage — free float is a fraction of total
          supply. A gradual accumulation would likely compress available liquidity
          and move price significantly; staked ETH would stay off-market, amplifying
          any supply squeeze if demand returns.
        </p>
        <p>
          Staking yield is similar to T-bills nominally, but adds full ETH price
          exposure — up and down. Apple&apos;s ROIC is far higher than either;
          this is a thought experiment, not a CFO recommendation.
        </p>
      </section>

      <blockquote className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 px-5 py-4 text-left text-base font-medium text-zinc-800 dark:bg-emerald-950/20 dark:text-zinc-200">
        {shareText}
      </blockquote>

      <BlogShare url={pageUrl} shareText={shareText} title={post.title} />

      <p className="text-center text-sm text-zinc-500">
        Card updates live with ETH price and Lido APY.{" "}
        <Link
          href={cardPath}
          className="text-yield-accent underline-offset-2 hover:underline"
        >
          Open PNG
        </Link>
      </p>

      <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p>
          Hypothetical only: assumes {APPLE_ETH_ALLOCATION_PCT}% of Apple&apos;s
          liquid treasury (cash + marketable securities per FY2026 Q2 10-Q) were
          converted to ETH and staked via Lido stETH at current rates. Apple holds
          no cryptocurrency. Not financial advice. Treasury figures from Apple SEC
          filings (Mar 28, 2026).
        </p>
        <p className="mt-2">{YIELD_DISCLAIMER}</p>
      </div>

      <ContentBackLink />
    </article>
  );
}
