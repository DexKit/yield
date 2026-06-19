import type { CardLayoutContext } from "@/lib/cards/types";
import { formatMoney } from "@/lib/utils";

const DEFAULT_HERO =
  "Estimated monthly yield if idle ETH were staked (Lido)";

/** Shareable scenario card — blog comparisons with live yield figures. */
export const ScenarioYieldCardLayout = {
  id: "scenario" as const,

  render({ data, theme }: CardLayoutContext) {
    const { summary, walletLabel, subtitle, heroLine, comparisonLine, footerLine } =
      data;
    const daily = formatMoney(summary.dailyUsd, summary.currency);
    const monthly = formatMoney(summary.monthlyUsd, summary.currency);
    const yearly = formatMoney(summary.yearlyUsd, summary.currency);

    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: theme.background,
          color: theme.textPrimary,
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 600,
              color: theme.headerText,
              letterSpacing: "0.02em",
            }}
          >
            Yield by DexKit
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 700,
              color: theme.textPrimary,
              lineHeight: 1.15,
            }}
          >
            {walletLabel}
          </p>
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: 24,
                color: theme.textMuted,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            flex: 1,
            justifyContent: "center",
            padding: "16px 0",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 500,
              color: theme.textMuted,
              textAlign: "center",
            }}
          >
            {heroLine ?? DEFAULT_HERO}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 92,
              fontWeight: 800,
              color: theme.accent,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {monthly}
          </p>
          {comparisonLine && (
            <p
              style={{
                margin: 0,
                fontSize: 26,
                color: theme.textSecondary,
                textAlign: "center",
              }}
            >
              {comparisonLine}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${theme.border}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ margin: 0, fontSize: 22, color: theme.textMuted }}>
              Daily
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 700,
                color: theme.textSecondary,
              }}
            >
              {daily}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "flex-end",
            }}
          >
            <p style={{ margin: 0, fontSize: 22, color: theme.textMuted }}>
              Yearly
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 700,
                color: theme.textSecondary,
              }}
            >
              {yearly}
            </p>
          </div>
        </div>

        <p
          style={{
            margin: "24px 0 0",
            fontSize: 20,
            color: theme.footerText,
            textAlign: "center",
          }}
        >
          {footerLine ?? "Powered by DexKit"}
        </p>
      </div>
    );
  },
};
