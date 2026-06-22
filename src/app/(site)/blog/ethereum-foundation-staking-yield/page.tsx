import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogShare } from "@/components/blog/blog-share";
import { ContentBackLink } from "@/components/content/content-page";
import { YIELD_DISCLAIMER } from "@/lib/constants/trust";
import {
  buildFoundationStakingCardPath,
  getFoundationStakingCardAbsoluteUrl,
} from "@/lib/blog/foundation-card-url";
import {
  ETHEREUM_FOUNDATION_NAME,
  ETHEREUM_FOUNDATION_WALLET,
  getCachedFoundationStakingYield,
} from "@/lib/blog/foundation-yield-service";
import { getBlogPost } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/seo/site";
import {
  formatCompactAmount,
  formatCompactUsd,
  formatMoney,
  truncateAddress,
} from "@/lib/utils";
import { notFound } from "next/navigation";

const POST_SLUG = "ethereum-foundation-staking-yield";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPost(POST_SLUG);
  if (!post) return { title: "Not found" };

  const url = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardImage = getFoundationStakingCardAbsoluteUrl({ theme: "dark" });

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

export default async function EthereumFoundationStakingPost() {
  const post = getBlogPost(POST_SLUG);
  if (!post) notFound();

  const data = await getCachedFoundationStakingYield();
  const pageUrl = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardPath = buildFoundationStakingCardPath();
  const walletPath = `/${ETHEREUM_FOUNDATION_WALLET}`;

  const ethLabel = formatCompactAmount(data.ethBalance);
  const shareText = `${ETHEREUM_FOUNDATION_NAME} holds ${ethLabel} ETH (${formatCompactUsd(data.stakeValueUsd)}). Staked via Lido → ${formatCompactUsd(data.monthlyYieldUsd)}/month. Currently ${formatCompactUsd(data.currentMonthlyYieldUsd)}/month.`;

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
          The <strong>{ETHEREUM_FOUNDATION_NAME}</strong> wallet holds about{" "}
          <strong>{ethLabel} ETH</strong> ({formatCompactUsd(data.stakeValueUsd)}{" "}
          idle). Today it earns{" "}
          <strong>{formatCompactUsd(data.currentMonthlyYieldUsd)}/month</strong>{" "}
          from DeFi positions.
        </p>
        <p>
          If that ETH were staked via <strong>Lido</strong> at{" "}
          <strong>{data.lidoApyPercent.toFixed(1)}% APY</strong>:
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <Image
          src={`${cardPath}?theme=dark`}
          alt={`Estimated staking yield for ${ETHEREUM_FOUNDATION_NAME}`}
          width={1200}
          height={630}
          className="h-auto w-full"
          priority
          unoptimized
        />
      </div>

      <dl className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            If staked
          </dt>
          <dd className="mt-1 text-2xl font-bold text-yield-accent sm:text-3xl">
            {formatMoney(data.monthlyYieldUsd)}
            <span className="block text-xs font-normal text-zinc-400">/mo</span>
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            Yearly
          </dt>
          <dd className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {formatCompactUsd(data.yearlyYieldUsd)}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            Today
          </dt>
          <dd className="mt-1 text-2xl font-bold text-zinc-400 sm:text-3xl">
            {formatCompactUsd(data.currentMonthlyYieldUsd)}
            <span className="block text-xs font-normal text-zinc-400">/mo</span>
          </dd>
        </div>
      </dl>

      <blockquote className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 px-5 py-4 text-left text-base font-medium text-zinc-800 dark:bg-emerald-950/20 dark:text-zinc-200">
        {shareText}
      </blockquote>

      <BlogShare url={pageUrl} shareText={shareText} title={post.title} />

      <p className="text-center text-sm text-zinc-500">
        Live wallet balance + Lido APY.{" "}
        <Link
          href={walletPath}
          className="text-yield-accent underline-offset-2 hover:underline"
        >
          View wallet
        </Link>
        {" · "}
        <Link
          href={cardPath}
          className="text-yield-accent underline-offset-2 hover:underline"
        >
          Open PNG
        </Link>
      </p>

      <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p>
          Hypothetical only: assumes idle ETH + WETH in{" "}
          {truncateAddress(ETHEREUM_FOUNDATION_WALLET)} (EF DeFi multisig) were
          staked via Lido stETH at current rates. Balances read on-chain;
          existing DeFi yield shown separately. Not financial advice.
        </p>
        <p className="mt-2">{YIELD_DISCLAIMER}</p>
      </div>

      <ContentBackLink />
    </article>
  );
}
