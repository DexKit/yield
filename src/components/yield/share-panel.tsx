"use client";

import { Check, Download, Link2, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyticsService, type SharePlatform } from "@/analytics";
import type { DownloadCardType } from "@/analytics/events";
import type { ShareContext } from "@/lib/share/share-service";
import { shareService } from "@/lib/share/share-service";

interface SharePanelProps {
  context: ShareContext;
  /** Primary: below yield hero. Secondary: page footer. */
  variant?: "primary" | "secondary";
  cardType?: DownloadCardType;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function SharePanel({
  context,
  variant = "primary",
  cardType = "default",
}: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);

  const openShare = useCallback(
    (platform: SharePlatform, url: string) => {
      analyticsService.trackShare(platform);
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
    },
    [],
  );

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(context.canonicalUrl);
    analyticsService.trackShare("copy_link");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [context.canonicalUrl]);

  const handleDiscord = useCallback(async () => {
    await navigator.clipboard.writeText(shareService.getDiscordShareText(context));
    analyticsService.trackShare("discord");
    setDiscordCopied(true);
    setTimeout(() => setDiscordCopied(false), 2500);
  }, [context]);

  const handleDownloadCard = useCallback(() => {
    analyticsService.trackDownloadCard(cardType);
  }, [cardType]);

  const isPrimary = variant === "primary";

  return (
    <section
      className={
        isPrimary
          ? "space-y-4"
          : "space-y-3 border-t border-zinc-200 pt-8 dark:border-zinc-800"
      }
      aria-label="Share yield results"
    >
      <h2
        className={
          isPrimary
            ? "text-center text-sm font-medium uppercase tracking-wider text-zinc-500"
            : "text-center text-xs font-medium uppercase tracking-wider text-zinc-400"
        }
      >
        Share
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size={isPrimary ? "default" : "sm"}
          className="gap-2"
          onClick={() => openShare("x", shareService.getXShareUrl(context))}
        >
          <XIcon className="h-4 w-4" />
          Share on X
        </Button>

        <Button
          type="button"
          variant="outline"
          size={isPrimary ? "default" : "sm"}
          className="gap-2"
          onClick={() =>
            openShare("telegram", shareService.getTelegramShareUrl(context))
          }
        >
          <Send className="h-4 w-4" />
          Telegram
        </Button>

        <Button
          type="button"
          variant="outline"
          size={isPrimary ? "default" : "sm"}
          className="gap-2"
          onClick={handleDiscord}
        >
          {discordCopied ? (
            <>
              <Check className="h-4 w-4" />
              Copied for Discord
            </>
          ) : (
            <>Discord</>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size={isPrimary ? "default" : "sm"}
          className="gap-2"
          onClick={() =>
            openShare("linkedin", shareService.getLinkedInShareUrl(context))
          }
        >
          <LinkedInIcon className="h-4 w-4" />
          LinkedIn
        </Button>

        <Button
          type="button"
          variant="outline"
          size={isPrimary ? "default" : "sm"}
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
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size={isPrimary ? "default" : "sm"}
          className="gap-2"
          asChild
        >
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

      {copied && isPrimary && (
        <p className="text-center text-sm text-emerald-600" role="status">
          Link copied to clipboard
        </p>
      )}
    </section>
  );
}
