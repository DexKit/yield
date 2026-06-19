import type { ReactElement } from "react";
import type { YieldSummary } from "@/types/yield";
import type { CurrencyCode } from "@/types/currency";

export type CardThemeId = "light" | "dark";

/** Implemented and planned card template identifiers. */
export type CardTypeId =
  | "default"
  | "scenario"
  | "opportunity"
  | "optimizer"
  | "protocol"
  | "chain";

export interface ParsedCardSlug {
  wallet: string;
  cardType: CardTypeId;
  /** Set for protocol/chain card variants (future). */
  variant?: string;
}

export interface CardRenderOptions {
  theme: CardThemeId;
  currency: CurrencyCode;
}

export interface CardSummary extends YieldSummary {
  currency: CurrencyCode;
}

/** Normalized payload passed to layout renderers. */
export interface CardData {
  cardType: CardTypeId;
  walletLabel: string;
  subtitle?: string;
  heroLine?: string;
  comparisonLine?: string;
  footerLine?: string;
  summary: CardSummary;
  theme: CardThemeId;
  calculatedAt: string;
}

export interface CardThemeTokens {
  id: CardThemeId;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
  border: string;
  headerText: string;
  footerText: string;
}

export interface CardLayoutContext {
  data: CardData;
  theme: CardThemeTokens;
}

export interface CardLayout {
  readonly id: CardTypeId;
  render(context: CardLayoutContext): ReactElement;
}
