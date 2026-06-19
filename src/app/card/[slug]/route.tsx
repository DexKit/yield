import { cardLayoutRegistry } from "@/lib/cards/card-layout-registry";
import { cardRenderer } from "@/lib/cards/card-renderer";
import {
  parseCardCurrency,
  parseCardSlug,
  parseCardTheme,
} from "@/lib/cards/card-url";
import type { CardRenderOptions } from "@/lib/cards/types";

export const runtime = "edge";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { slug } = await context.params;
  const parsed = parseCardSlug(slug);

  if (!parsed) {
    return new Response("Invalid card URL", { status: 400 });
  }

  if (!cardLayoutRegistry.get(parsed.cardType)) {
    return new Response("Card type not yet available", { status: 404 });
  }

  const url = new URL(request.url);
  const options: CardRenderOptions = {
    theme: parseCardTheme(url.searchParams.get("theme")),
    currency: parseCardCurrency(url.searchParams.get("currency")),
  };

  const image = await cardRenderer.renderWalletCard(
    parsed.wallet,
    parsed.cardType,
    options,
  );

  if (!image) {
    return new Response("Wallet not found", { status: 404 });
  }

  return image;
}
