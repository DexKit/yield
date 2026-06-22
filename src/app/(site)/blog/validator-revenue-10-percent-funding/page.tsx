import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogShare } from "@/components/blog/blog-share";
import { ContentBackLink } from "@/components/content/content-page";
import { YIELD_DISCLAIMER } from "@/lib/constants/trust";
import { getBlogPost } from "@/lib/blog/posts";
import {
  buildValidatorRevenueCardPath,
  getValidatorRevenueCardAbsoluteUrl,
} from "@/lib/blog/validator-revenue-card-url";
import {
  ETH_STAKING_RATIO_CURRENT,
  ETHRESEARCH_VALIDATOR_REVENUE_URL,
  getCachedValidatorRevenueAnalysis,
  type ValidatorRevenuePriceCase,
  type ValidatorRevenueScenario,
} from "@/lib/blog/validator-revenue-service";
import { absoluteUrl } from "@/lib/seo/site";
import {
  formatCompactAmount,
  formatCompactUsd,
  formatMoney,
} from "@/lib/utils";

const POST_SLUG = "validator-revenue-10-percent-funding";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPost(POST_SLUG);
  if (!post) return { title: "Not found" };

  const url = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardImage = getValidatorRevenueCardAbsoluteUrl({ theme: "dark" });

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

function formatEth(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M ETH`;
  }
  if (amount >= 1_000) {
    return `${formatCompactAmount(amount)} ETH`;
  }
  return `${amount.toFixed(0)} ETH`;
}

function formatAthDate(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ScenarioTableRow({ scenario }: { scenario: ValidatorRevenueScenario }) {
  const ratioLabel = `${(scenario.stakingRatio * 100).toFixed(0)}%`;

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">
      <td className="py-3 pr-3 text-left text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {scenario.label}
      </td>
      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
        {ratioLabel}
      </td>
      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
        {formatEth(scenario.stakedEth)}
      </td>
      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
        {scenario.validatorApyPercent.toFixed(2)}%
      </td>
      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
        {formatCompactUsd(scenario.annualRevenueUsd)}
      </td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums text-yield-accent">
        {formatCompactUsd(scenario.onePercent.usd)}
      </td>
      <td className="py-3 pl-3 text-right text-sm font-semibold tabular-nums text-yield-accent">
        {formatCompactUsd(scenario.tenPercent.usd)}
      </td>
    </tr>
  );
}

function PriceCaseTableRow({ priceCase }: { priceCase: ValidatorRevenuePriceCase }) {
  const scenario = priceCase.scenario;
  const athLabel = formatAthDate(priceCase.athDate);

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">
      <td className="py-3 pr-3 text-left text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {priceCase.label}
        {athLabel ? (
          <span className="mt-0.5 block text-xs font-normal text-zinc-400">
            reached {athLabel} (UTC)
          </span>
        ) : null}
      </td>
      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
        {formatMoney(priceCase.ethPriceUsd)}
      </td>
      <td className="px-3 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
        {formatCompactUsd(scenario.annualRevenueUsd)}
      </td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums text-yield-accent">
        {formatCompactUsd(scenario.onePercent.usd)}
      </td>
      <td className="py-3 pl-3 text-right text-sm font-semibold tabular-nums text-yield-accent">
        {formatCompactUsd(scenario.tenPercent.usd)}
      </td>
    </tr>
  );
}

export default async function ValidatorRevenueBlogPost() {
  const post = getBlogPost(POST_SLUG);
  if (!post) notFound();

  const data = await getCachedValidatorRevenueAnalysis();
  const current = data.scenarios[0];
  const pageUrl = absoluteUrl(`/blog/${POST_SLUG}`);
  const cardPath = buildValidatorRevenueCardPath();
  const athDateLabel = formatAthDate(data.ethAthDate);
  const priceFetchedLabel = new Date(data.ethPriceFetchedAt).toLocaleString(
    "en-US",
    { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" },
  );

  const onePctVsCoreDev = (
    (current.onePercent.usd / data.coreDevMinViableAnnualUsd) *
    100
  ).toFixed(0);

  const shareText = `1% of Ethereum validator revenue ≈ ${formatCompactUsd(current.onePercent.usd)}/year at ${formatMoney(data.ethPriceUsd)} ETH (live). 10% ≈ ${formatCompactUsd(current.tenPercent.usd)}/year. From the ethresear.ch validator-redirect debate.`;

  return (
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {post.publishedAt} · 5 min read
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {post.title}
        </h1>
      </header>

      <div className="space-y-5 text-left text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          Ethereum validators earn issuance and tips on every block. That revenue
          is paid in ETH to stakers — not to the Ethereum Foundation, not to a
          treasury, and not automatically to core protocol development.
        </p>
        <p>
          A{" "}
          <a
            href={ETHRESEARCH_VALIDATOR_REVENUE_URL}
            className="text-yield-accent underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Validator Redirected Revenue
          </a>{" "}
          proposal on Ethereum Research sparked follow-on debate on X:{" "}
          <strong>
            if a slice of staking rewards were redirected, how large could it be
          </strong>
          — and what could it fund? Here is a transparent estimate using live
          supply, staking ratio, and network yield, with scenarios at{" "}
          <strong>1%</strong> and <strong>10%</strong> (the post&apos;s proposed
          cap), plus stake levels of <strong>50%</strong> and{" "}
          <strong>70%</strong>.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
        <p>
          <strong className="text-zinc-800 dark:text-zinc-200">
            Assumptions for USD figures:
          </strong>{" "}
          live ETH spot{" "}
          <strong>{formatMoney(data.ethPriceUsd)}</strong> (CoinGecko, fetched{" "}
          {priceFetchedLabel} UTC). Stake-ratio scenarios below all use this
          price. ATH sensitivity uses CoinGecko ATH{" "}
          <strong>{formatMoney(data.ethAthPriceUsd)}</strong>
          {athDateLabel ? ` (${athDateLabel})` : ""}.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            ETH supply
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatEth(data.circulatingEth)}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            Staked
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {(ETH_STAKING_RATIO_CURRENT * 100).toFixed(1)}%
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            Validator APY
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-yield-accent">
            {data.liveValidatorApyPercent.toFixed(2)}%
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            ETH price (live)
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatMoney(data.ethPriceUsd)}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            1% slice (today)
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-yield-accent">
            {formatCompactUsd(current.onePercent.usd)}
            <span className="block text-xs font-normal text-zinc-400">/yr</span>
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs uppercase tracking-wider text-zinc-400">
            10% slice (today)
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-yield-accent">
            {formatCompactUsd(current.tenPercent.usd)}
            <span className="block text-xs font-normal text-zinc-400">/yr</span>
          </dd>
        </div>
      </dl>

      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <Image
          src={`${cardPath}?theme=dark`}
          alt="Ethereum validator revenue redirect estimate"
          width={1200}
          height={630}
          className="h-auto w-full"
          priority
          unoptimized
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Methodology
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
          <li>
            <strong>Total ETH staked</strong> = circulating supply × staking
            ratio (~{(ETH_STAKING_RATIO_CURRENT * 100).toFixed(1)}% today, from
            beacon-chain aggregates).
          </li>
          <li>
            <strong>Validator yield</strong> = live network staking APY (Lido
            stETH rate as proxy: {data.liveValidatorApyPercent.toFixed(2)}%).
          </li>
          <li>
            <strong>Annual validator revenue (USD)</strong> = staked ETH × APY ×
            ETH price. Main scenarios use live spot{" "}
            <strong>{formatMoney(data.ethPriceUsd)}</strong> (CoinGecko).
          </li>
          <li>
            <strong>ATH price case</strong> re-runs today&apos;s stake at
            CoinGecko&apos;s recorded ATH of{" "}
            <strong>{formatMoney(data.ethAthPriceUsd)}</strong>
            {athDateLabel ? ` (${athDateLabel})` : ""} — same ETH flows, higher
            USD denomination.
          </li>
          <li>
            <strong>1% / 10% slices</strong> = that annual revenue × 1% or 10%
            (ETH and USD). The ethresear.ch proposal caps redirects at 10%.
          </li>
          <li>
            <strong>50% / 70% scenarios</strong> = higher stake, lower APY
            (scaled inversely with participation — more stake dilutes per-validator
            rewards). All use live ETH price.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Price sensitivity: live spot vs ETH ATH
        </h2>
        <p className="text-sm text-zinc-500">
          Same stake and APY as today (~{(ETH_STAKING_RATIO_CURRENT * 100).toFixed(1)}%
          staked, {data.liveValidatorApyPercent.toFixed(2)}% APY). Only the ETH/USD
          rate changes — redirect amounts in ETH are identical; USD scales with
          price.
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="py-3 pr-3 text-left font-medium">Price case</th>
                <th className="px-3 py-3 text-right font-medium">ETH/USD</th>
                <th className="px-3 py-3 text-right font-medium">
                  Annual revenue
                </th>
                <th className="px-3 py-3 text-right font-medium">1% slice</th>
                <th className="py-3 pl-3 text-right font-medium">10% slice</th>
              </tr>
            </thead>
            <tbody>
              <PriceCaseTableRow priceCase={data.livePriceCase} />
              <PriceCaseTableRow priceCase={data.athPriceCase} />
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500">
          At ATH, a <strong>1%</strong> redirect would be{" "}
          <strong>
            {formatCompactUsd(data.athPriceCase.scenario.onePercent.usd)}/year
          </strong>{" "}
          ({formatEth(data.athPriceCase.scenario.onePercent.eth)} — unchanged in
          ETH) vs{" "}
          <strong>
            {formatCompactUsd(data.livePriceCase.scenario.onePercent.usd)}/year
          </strong>{" "}
          at today&apos;s {formatMoney(data.ethPriceUsd)} spot.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Scenarios: 1% and 10% at current, 50%, and 70% stake
        </h2>
        <p className="text-sm text-zinc-500">
          All rows priced at live ETH{" "}
          <strong>{formatMoney(data.ethPriceUsd)}</strong> (CoinGecko spot).
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="py-3 pr-3 text-left font-medium">Scenario</th>
                <th className="px-3 py-3 text-right font-medium">Staked</th>
                <th className="px-3 py-3 text-right font-medium">ETH locked</th>
                <th className="px-3 py-3 text-right font-medium">APY</th>
                <th className="px-3 py-3 text-right font-medium">
                  Annual revenue
                </th>
                <th className="px-3 py-3 text-right font-medium">1% slice</th>
                <th className="py-3 pl-3 text-right font-medium">10% slice</th>
              </tr>
            </thead>
            <tbody>
              {data.scenarios.map((scenario) => (
                <ScenarioTableRow key={scenario.id} scenario={scenario} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500">
          At today&apos;s stake level, validators earn roughly{" "}
          <strong>{formatCompactUsd(current.annualRevenueUsd)}/year</strong> in
          aggregate ({formatEth(current.annualRevenueEth)}). A{" "}
          <strong>1%</strong> redirect would be{" "}
          <strong>{formatCompactUsd(current.onePercent.usd)}/year</strong> (
          {formatEth(current.onePercent.eth)}); <strong>10%</strong> would be{" "}
          <strong>{formatCompactUsd(current.tenPercent.usd)}/year</strong> —
          before any discussion of who receives it or how it is governed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Compared to core development costs
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Ethereum&apos;s layer-1 kernel — execution and consensus clients,
          research, testing, and coordination — is often framed as needing on the
          order of <strong>{formatCompactUsd(data.coreDevMinViableAnnualUsd)}/year</strong>{" "}
          in neutral funding to stay viable (the &quot;minimum viable&quot;
          estimate used by{" "}
          <a
            href="https://protocol-guild.readthedocs.io/"
            className="text-yield-accent underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Protocol Guild
          </a>{" "}
          and cited in the{" "}
          <a
            href={ETHRESEARCH_VALIDATOR_REVENUE_URL}
            className="text-yield-accent underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            validator-redirect discussion
          </a>
          ). That is separate from EF ecosystem grants and from voluntary
          donations.
        </p>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <li>
            <strong>1% redirect today:</strong>{" "}
            {formatCompactUsd(current.onePercent.usd)}/year — about{" "}
            <strong>{onePctVsCoreDev}%</strong> of the ~
            {formatCompactUsd(data.coreDevMinViableAnnualUsd)} core-dev floor,
            and roughly{" "}
            <strong>
              {(current.onePercent.usd / data.protocolGuild2025DistributedUsd).toFixed(1)}×
            </strong>{" "}
            Protocol Guild&apos;s reported ~
            {formatCompactUsd(data.protocolGuild2025DistributedUsd)} distributed
            in 2025.
          </li>
          <li>
            <strong>10% redirect today:</strong>{" "}
            {formatCompactUsd(current.tenPercent.usd)}/year — about{" "}
            <strong>
              {Math.round(
                current.tenPercent.usd / data.coreDevMinViableAnnualUsd,
              )}
              ×
            </strong>{" "}
            the core-dev floor.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          The ethresear.ch post notes that even a single-digit redirect on
          today&apos;s ~700k ETH/year issuance budget is material in ETH terms.
          This model uses live APY (higher than issuance-only) so USD figures
          may read larger — treat both as order-of-magnitude illustrations, not
          forecasts.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Compared to EF ecosystem grants
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Ecosystem Support Program grants fund apps, research, and community
          work — a different bucket from core client maintenance. Public quarterly
          totals:
        </p>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <li>
            <strong>Q1 2025:</strong>{" "}
            {formatCompactUsd(data.efGrantsQ1_2025Usd)} awarded (
            <a
              href="https://blog.ethereum.org/2025/05/08/allocation-q1-25"
              className="text-yield-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EF allocation update
            </a>
            )
          </li>
          <li>
            <strong>Q4 2025:</strong>{" "}
            {formatCompactUsd(data.efGrantsQ4_2025Usd)} awarded (
            <a
              href="https://blog.ethereum.org/2026/01/27/allocation-q4-25"
              className="text-yield-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EF allocation update
            </a>
            )
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          A <strong>1%</strong> slice today (
          {formatCompactUsd(current.onePercent.usd)}/year) still exceeds a
          typical ESP quarter; <strong>10%</strong> (
          {formatCompactUsd(current.tenPercent.usd)}/year) dwarfs both. This is
          illustrative math — not a policy endorsement. Redirecting validator
          revenue would require consensus-layer changes discussed in the{" "}
          <a
            href={ETHRESEARCH_VALIDATOR_REVENUE_URL}
            className="text-yield-accent underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ethresear.ch thread
          </a>
          , not shipped today.
        </p>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          If staking rises to <strong>70%</strong> of supply, a{" "}
          <strong>1%</strong> redirect is about{" "}
          <strong>
            {formatCompactUsd(data.scenarios[2].onePercent.usd)}/year
          </strong>{" "}
          and <strong>10%</strong> about{" "}
          <strong>
            {formatCompactUsd(data.scenarios[2].tenPercent.usd)}/year
          </strong>{" "}
          in this model — APY compresses as participation grows, so totals do
          not scale linearly with stake.
        </p>
      </section>

      <blockquote className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 px-5 py-4 text-left text-base font-medium text-zinc-800 dark:bg-emerald-950/20 dark:text-zinc-200">
        {shareText}
      </blockquote>

      <BlogShare url={pageUrl} shareText={shareText} title={post.title} />

      <p className="text-center text-sm text-zinc-500">
        Live ETH {formatMoney(data.ethPriceUsd)} + Lido APY.{" "}
        <Link
          href={cardPath}
          className="text-yield-accent underline-offset-2 hover:underline"
        >
          Open PNG card
        </Link>
      </p>

      <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p>
          Estimates only. Staking ratio uses a published network aggregate;
          supply, spot price, and ATH from CoinGecko; APY from Lido stETH (proxy
          for consensus + execution yield). Core-dev floor (~$30M/yr) and Protocol
          Guild 2025 distributions (~$12M) are public benchmarks cited in funding
          debates, not audited budgets. EF grant figures are ESP allocation
          totals. Not financial or policy advice.
        </p>
        <p className="mt-2">{YIELD_DISCLAIMER}</p>
      </div>

      <ContentBackLink />
    </article>
  );
}
