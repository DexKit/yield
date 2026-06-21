import Link from "next/link";
import { SearchForm } from "@/components/yield/search-form";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Wallet not found
      </h1>
      <p className="mt-2 text-zinc-500">
        We couldn&apos;t resolve this address or ENS name. Check the input and
        try again.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm text-yield-accent hover:underline"
      >
        Back to home
      </Link>
      <div className="mt-8 w-full">
        <SearchForm />
      </div>
    </div>
  );
}
