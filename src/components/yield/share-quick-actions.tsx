"use client";

import { Check, Download, Link2, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/analytics";
import type { DownloadCardType } from "@/analytics/events";
import { buildXShareText } from "@/lib/share/share-copy";
import type { ShareContext } from "@/lib/share/share-service";
import { shareService } from "@/lib/share/share-service";

interface ShareQuickActionsProps {
  context: ShareContext;
  cardType?: DownloadCardType;
}

export function ShareQuickActions({
  context,
  cardType = "default",
}: ShareQuickActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: context.walletLabel,
      text: buildXShareText({
        walletLabel: context.walletLabel,
        monthlyFormatted: context.monthlyFormatted,
        yearlyFormatted: context.yearlyFormatted,
        canonicalUrl: context.canonicalUrl,
      }),
      url: context.canonicalUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        analyticsService.trackShare("x");
        return;
      } catch {
        // User cancelled or share failed — fall through to X intent.
      }
    }

    analyticsService.trackShare("x");
    window.open(
      shareService.getXShareUrl(context),
      "_blank",
      "noopener,noreferrer,width=600,height=700",
    );
  }, [context]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(context.canonicalUrl);
    analyticsService.trackShare("copy_link");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [context.canonicalUrl]);

  const handleDownloadCard = useCallback(() => {
    analyticsService.trackDownloadCard(cardType);
  }, [cardType]);

  return (
    <div className="space-y-2" aria-label="Quick share actions">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Link copied
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a
            href={context.cardDownloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadCard}
          >
            <Download className="h-4 w-4" />
            Download Card
          </a>
        </Button>
      </div>
    </div>
  );
}
