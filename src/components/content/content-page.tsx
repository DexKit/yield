import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContentPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentPage({
  title,
  description,
  children,
  className,
}: ContentPageProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl space-y-10 px-4 py-12 sm:py-16",
        className,
      )}
    >
      <header className="space-y-3 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 sm:text-base">{description}</p>
      </header>
      {children}
    </div>
  );
}

export function ContentSection({
  title,
  description,
  children,
  id,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function ContentBackLink() {
  return (
    <p className="text-center">
      <Link
        href="/"
        className="text-sm text-yield-accent text-yield-accent-hover underline-offset-2 transition-colors hover:underline"
      >
        ← Check a wallet
      </Link>
    </p>
  );
}
