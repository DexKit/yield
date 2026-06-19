import Link from "next/link";
import { GITHUB_REPO_URL, YIELD_DISCLAIMER } from "@/lib/constants/trust";

const FOOTER_LINKS = [
  { href: "/methodology", label: "Methodology" },
  { href: "/blog", label: "Blog" },
  { href: "/supported", label: "Supported" },
  { href: "/roadmap", label: "Roadmap" },
] as const;

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "transition-colors hover:text-emerald-600 dark:hover:text-emerald-500";

  if (external) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </Link>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mx-auto max-w-2xl space-y-4 px-4 text-center text-sm text-zinc-500">
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          {FOOTER_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="font-medium text-zinc-600 dark:text-zinc-400">
            Open Source
          </span>
          <FooterLink href={GITHUB_REPO_URL} label="View Source" external />
          <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
            ·
          </span>
          <FooterLink href="https://dexkit.com" label="Powered by DexKit" external />
        </div>

        <p className="text-xs text-zinc-400">{YIELD_DISCLAIMER}</p>
      </div>
    </footer>
  );
}
