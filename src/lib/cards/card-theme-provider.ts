import type { CardThemeId, CardThemeTokens } from "./types";

const THEMES: Record<CardThemeId, CardThemeTokens> = {
  light: {
    id: "light",
    background: "linear-gradient(160deg, #fafafa 0%, #f4f4f5 45%, #ecfdf5 100%)",
    surface: "#ffffff",
    textPrimary: "#18181b",
    textSecondary: "#3f3f46",
    textMuted: "#71717a",
    accent: "#059669",
    accentMuted: "#10b981",
    border: "#e4e4e7",
    headerText: "#52525b",
    footerText: "#a1a1aa",
  },
  dark: {
    id: "dark",
    background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #052e16 100%)",
    surface: "#18181b",
    textPrimary: "#fafafa",
    textSecondary: "#e4e4e7",
    textMuted: "#a1a1aa",
    accent: "#34d399",
    accentMuted: "#10b981",
    border: "#27272a",
    headerText: "#a1a1aa",
    footerText: "#71717a",
  },
};

export function resolveCardTheme(themeId: CardThemeId): CardThemeTokens {
  return THEMES[themeId];
}

export const cardThemeProvider = {
  resolve: resolveCardTheme,
  themes: THEMES,
};
