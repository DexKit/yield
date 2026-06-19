/** Share copy and OpenGraph text — safe for client and server imports. */

export function getOpenGraphShareTitle(
  walletLabel: string,
  monthlyFormatted: string,
): string {
  return `${walletLabel} generates an estimated ${monthlyFormatted}/month`;
}

export function getOpenGraphShareDescription(): string {
  return "See estimated daily, monthly and yearly yield.";
}

export function buildXShareText(params: {
  walletLabel: string;
  monthlyFormatted: string;
  yearlyFormatted: string;
  canonicalUrl: string;
}): string {
  const { walletLabel, monthlyFormatted, yearlyFormatted, canonicalUrl } =
    params;
  return `${walletLabel} is estimated to generate
${monthlyFormatted}/month
${yearlyFormatted}/year
via DeFi yield.

Check any wallet:
${canonicalUrl}

Powered by DexKit`;
}

export function buildTelegramShareText(params: {
  walletLabel: string;
  monthlyFormatted: string;
}): string {
  return `${params.walletLabel} — estimated ${params.monthlyFormatted}/month via DeFi yield`;
}

export function buildDiscordShareText(params: {
  walletLabel: string;
  monthlyFormatted: string;
  yearlyFormatted: string;
  canonicalUrl: string;
}): string {
  return `**${params.walletLabel}** is estimated to generate **${params.monthlyFormatted}/month** (${params.yearlyFormatted}/year) via DeFi yield.\n\n${params.canonicalUrl}\n\n_Powered by DexKit_`;
}
