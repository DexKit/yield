import { SITE_URL } from "@/lib/seo/site";

export function WidgetFooter() {
  return (
    <footer className="border-t border-zinc-200 pt-2 text-center dark:border-zinc-800">
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-zinc-400 transition-colors hover:text-zinc-500 dark:hover:text-zinc-300"
      >
        Powered by DexKit
      </a>
    </footer>
  );
}
