export type WidgetVariant = "compact" | "standard" | "advanced";
export type WidgetTheme = "light" | "dark" | "auto";

const VARIANTS: WidgetVariant[] = ["compact", "standard", "advanced"];
const THEMES: WidgetTheme[] = ["light", "dark", "auto"];

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseWidgetVariant(
  raw: string | string[] | undefined,
): WidgetVariant {
  const value = firstParam(raw)?.toLowerCase();
  if (value && VARIANTS.includes(value as WidgetVariant)) {
    return value as WidgetVariant;
  }
  return "standard";
}

export function parseWidgetTheme(
  raw: string | string[] | undefined,
): WidgetTheme {
  const value = firstParam(raw)?.toLowerCase();
  if (value && THEMES.includes(value as WidgetTheme)) {
    return value as WidgetTheme;
  }
  return "auto";
}

export function widgetMinHeight(variant: WidgetVariant): number {
  switch (variant) {
    case "compact":
      return 140;
    case "standard":
      return 220;
    case "advanced":
      return 320;
    default:
      return 220;
  }
}
