"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  formatMinutesAgo,
  formatUtcRefreshTime,
  type ProtocolRateLine,
} from "@/lib/yield/rates-display";
import { formatApy } from "@/lib/utils";

interface RatesUpdatedIndicatorProps {
  calculatedAt: string;
  protocolRates: ProtocolRateLine[];
}

export function RatesUpdatedIndicator({
  calculatedAt,
  protocolRates,
}: RatesUpdatedIndicatorProps) {
  const [open, setOpen] = useState(false);
  const [minutesLabel, setMinutesLabel] = useState(() =>
    formatMinutesAgo(calculatedAt),
  );
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinutesLabel(formatMinutesAgo(calculatedAt));
    const interval = window.setInterval(() => {
      setMinutesLabel(formatMinutesAgo(calculatedAt));
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [calculatedAt]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const refreshedUtc = formatUtcRefreshTime(calculatedAt);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-zinc-600 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        Rates updated {minutesLabel}
      </button>

      {open && (
        <div
          id={panelId}
          role="tooltip"
          className="absolute top-full left-1/2 z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
            Yield estimates use the latest protocol rates available.
          </p>

          {protocolRates.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-200">
              {protocolRates.map((line) => (
                <li key={line.label} className="flex justify-between gap-3">
                  <span>{line.label}</span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {formatApy(line.apy)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">
              Based on protocol rates updated within the last hour.
            </p>
          )}

          <p className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-400 dark:border-zinc-800">
            Last refreshed:
            <br />
            <time dateTime={calculatedAt}>{refreshedUtc}</time>
          </p>
        </div>
      )}
    </div>
  );
}
