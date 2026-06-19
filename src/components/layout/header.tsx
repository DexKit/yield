import Link from "next/link";

export function Header() {
  return (
    <header className="py-6">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Yield <span className="text-emerald-600">by DexKit</span>
        </Link>
      </div>
    </header>
  );
}
