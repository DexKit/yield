"use client";

import { usePageViewTracking } from "@/analytics/hooks";

export function PageViewTracker() {
  usePageViewTracking();
  return null;
}
