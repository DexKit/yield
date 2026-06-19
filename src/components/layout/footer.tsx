import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mx-auto max-w-2xl px-4 text-center text-sm text-zinc-500">
        <Link
          href="https://dexkit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-emerald-600"
        >
          Powered by DexKit
        </Link>
      </div>
    </footer>
  );
}
