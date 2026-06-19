import type { Metadata } from "next";
import { SiteLogo } from "@/components/layout/site-logo";
import { SearchForm } from "@/components/yield/search-form";
import { SupportedProtocols } from "@/components/yield/supported-protocols";
import { buildHomePageMetadata } from "@/lib/seo/home-metadata";

export const metadata: Metadata = buildHomePageMetadata();

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 sm:py-24">
      <div className="w-full space-y-10 text-center">
        <div className="space-y-4">
          <SiteLogo variant="hero" priority />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How much yield does your wallet generate?
          </h1>
          <p className="text-lg text-zinc-500">
            Paste any wallet or ENS name and instantly estimate daily, monthly
            and yearly earnings.
          </p>
        </div>

        <SearchForm />

        <SupportedProtocols />
      </div>
    </div>
  );
}
