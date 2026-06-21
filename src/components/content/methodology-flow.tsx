import { METHODOLOGY_STEPS } from "@/lib/constants/methodology";

export function MethodologyFlow() {
  return (
    <ol className="space-y-0">
      {METHODOLOGY_STEPS.map((step, index) => (
        <li key={step.id} className="flex flex-col items-center">
          <div className="w-full rounded-lg border border-zinc-100 bg-zinc-50 p-5 text-left dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs font-medium uppercase tracking-wider text-yield-accent">
              Step {index + 1}
            </p>
            <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {step.description}
            </p>
          </div>
          {index < METHODOLOGY_STEPS.length - 1 && (
            <span
              className="my-2 text-lg text-zinc-300 dark:text-zinc-600"
              aria-hidden
            >
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
