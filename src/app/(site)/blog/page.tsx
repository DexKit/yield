import Link from "next/link";
import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { buildContentPageMetadata } from "@/lib/seo/content-metadata";

export const metadata: Metadata = buildContentPageMetadata(
  "/blog",
  "Blog",
  "Short, shareable yield insights from Yield by DexKit.",
);

export default function BlogIndexPage() {
  return (
    <ContentPage
      title="Blog"
      description="Simple yield comparisons and insights — built to share."
    >
      <ul className="space-y-4">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-zinc-100 bg-zinc-50 p-5 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-900"
            >
              <time
                dateTime={post.publishedAt}
                className="text-xs font-medium uppercase tracking-wider text-zinc-400"
              >
                {post.publishedAt}
              </time>
              <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
