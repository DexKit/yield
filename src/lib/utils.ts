import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyCode } from "@/types/currency";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number, currency: CurrencyCode = "USD"): string {
  const locale =
    currency === "BRL" ? "pt-BR" : currency === "EUR" ? "de-DE" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** @deprecated Use formatMoney */
export function formatUsd(amount: number, currency: CurrencyCode = "USD"): string {
  return formatMoney(amount, currency);
}

export function formatTokenAmount(amount: string, maxDecimals = 4): string {
  const num = parseFloat(amount);
  if (Number.isNaN(num)) return "0";
  if (num === 0) return "0";
  if (num < 0.0001) return "<0.0001";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

export function formatApy(apy: number | null): string {
  if (apy === null) return "—";
  return `${apy.toFixed(1)}%`;
}

export function truncateAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Compact USD for headlines ($1.2B, $45M). */
export function formatCompactUsd(amount: number, currency: CurrencyCode = "USD"): string {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "R$";
  const abs = Math.abs(amount);
  if (abs >= 1e9) return `${symbol}${(amount / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${symbol}${(amount / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${symbol}${(amount / 1e3).toFixed(0)}K`;
  return formatMoney(amount, currency);
}

/** Compact token amounts (528k, 1.2M). */
export function formatCompactAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(amount / 1e3).toFixed(0)}k`;
  return amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
