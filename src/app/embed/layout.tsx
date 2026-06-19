import type { Metadata } from "next";

/** Embeds are not indexed — canonical wallet pages live at /[identifier]. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-0 bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );
}
