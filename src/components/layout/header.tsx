import Link from "next/link";
import { SiteLogo } from "@/components/layout/site-logo";
import { SITE_NAME } from "@/lib/seo/site";

export function Header() {
  return (
    <header className="py-6">
      <div className="mx-auto max-w-lg px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-sm font-semibold leading-none tracking-tight text-zinc-900 transition-opacity hover:opacity-80 dark:text-zinc-100"
        >
          <SiteLogo alt="" priority decorative />
          <span className="translate-y-px">
            Yield <span className="text-yield-accent">by DexKit</span>
          </span>
          <span className="sr-only">{SITE_NAME}</span>
        </Link>
      </div>
    </header>
  );
}
