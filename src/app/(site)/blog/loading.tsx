export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-8 px-4 py-12 sm:py-16">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mx-auto h-8 w-full max-w-md rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-zinc-100 dark:bg-zinc-900/50"
          />
        ))}
      </div>
      <div className="h-48 rounded-xl bg-zinc-100 dark:bg-zinc-900/50" />
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-32 rounded-lg bg-zinc-100 dark:bg-zinc-900/50" />
      </div>
    </div>
  );
}
