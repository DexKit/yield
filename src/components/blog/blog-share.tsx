"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/analytics";

interface BlogShareProps {
  url: string;
  shareText: string;
  title: string;
}

export function BlogShare({ url, shareText, title }: BlogShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        analyticsService.trackShare("x");
        return;
      } catch {
        // cancelled
      }
    }
    analyticsService.trackShare("x");
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=700",
    );
  }, [shareText, title, url]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    analyticsService.trackShare("copy_link");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [url]);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Link copied
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Copy link
          </>
        )}
      </Button>
    </div>
  );
}
