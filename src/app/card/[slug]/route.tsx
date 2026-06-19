import { cardLayoutRegistry } from "@/lib/cards/card-layout-registry";
import { cardRenderer } from "@/lib/cards/card-renderer";
import {
  parseCardCurrency,
  parseCardSlug,
  parseCardTheme,
} from "@/lib/cards/card-url";
import type { CardRenderOptions } from "@/lib/cards/types";
import { AnalyticsEvents } from "@/analytics/events";
import { trackServerEvent } from "@/analytics/server";

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
    void trackServerEvent(AnalyticsEvents.API_REQUEST, {
      endpoint: "card",
      status: "error",
    });
    return new Response("Invalid card URL", { status: 400 });
  }

  if (!cardLayoutRegistry.get(parsed.cardType)) {
    void trackServerEvent(AnalyticsEvents.API_REQUEST, {
      endpoint: "card",
      status: "error",
    });
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
    void trackServerEvent(AnalyticsEvents.API_REQUEST, {
      endpoint: "card",
      status: "error",
    });
    return new Response("Wallet not found", { status: 404 });
  }

  void trackServerEvent(AnalyticsEvents.API_REQUEST, {
    endpoint: "card",
    status: "success",
  });

  return image;
}
