"use client";

import { useEffect } from "react";
import type { WidgetTheme } from "@/lib/widgets/embed-params";

const RESIZE_MESSAGE = "dexkit-yield:resize";

export function postEmbedHeight(): void {
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: RESIZE_MESSAGE, height }, "*");
}

/** Syncs theme to <html> and notifies parent iframe of content height changes. */
export function EmbedRuntime({ theme }: { theme: WidgetTheme }) {
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.dataset.theme = "dark";
    } else if (theme === "light") {
      root.classList.remove("dark");
      root.dataset.theme = "light";
    } else {
      root.classList.remove("dark");
      delete root.dataset.theme;
    }

    return () => {
      delete root.dataset.theme;
    };
  }, [theme]);

  useEffect(() => {
    postEmbedHeight();

    const observer = new ResizeObserver(() => postEmbedHeight());
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return null;
}
