import type { WalletYieldResult } from "@/types/yield";
import type { WidgetVariant } from "@/lib/widgets/embed-params";
import {
  AdvancedWidget,
  CompactWidget,
  StandardWidget,
} from "./yield-widgets";

interface YieldWidgetProps {
  variant: WidgetVariant;
  result: WalletYieldResult;
}

export function YieldWidget({ variant, result }: YieldWidgetProps) {
  switch (variant) {
    case "compact":
      return <CompactWidget result={result} />;
    case "advanced":
      return <AdvancedWidget result={result} />;
    case "standard":
    default:
      return <StandardWidget result={result} />;
  }
}
