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
