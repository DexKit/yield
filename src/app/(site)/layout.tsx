import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Analytics } from "@/components/analytics";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Analytics />
      <PageViewTracker />
    </>
  );
}
