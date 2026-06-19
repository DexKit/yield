import { SearchForm } from "@/components/yield/search-form";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 sm:py-24">
      <div className="w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How much yield does your wallet generate?
          </h1>
          <p className="text-lg text-zinc-500">
            Paste any wallet or ENS name and instantly estimate daily, monthly
            and yearly earnings.
          </p>
        </div>

        <SearchForm />
      </div>
    </div>
  );
}
