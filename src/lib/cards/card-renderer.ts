import { ImageResponse } from "next/og";
import { CARD_CACHE_CONTROL, CARD_HEIGHT, CARD_WIDTH } from "./constants";
import { cardDataProvider } from "./card-data-provider";
import { cardLayoutRegistry } from "./card-layout-registry";
import { cardThemeProvider } from "./card-theme-provider";
import type { CardData, CardRenderOptions, CardTypeId } from "./types";

export { CARD_CACHE_CONTROL, CARD_HEIGHT, CARD_WIDTH } from "./constants";

export const cardRenderer = {
  async renderWalletCard(
    wallet: string,
    cardType: CardTypeId,
    options: CardRenderOptions,
  ): Promise<ImageResponse | null> {
    const layout = cardLayoutRegistry.get(cardType);
    if (!layout) return null;

    const data = await cardDataProvider.getCardData(wallet, cardType, options);
    if (!data) return null;

    const theme = cardThemeProvider.resolve(options.theme);
    const element = layout.render({ data, theme });

    return new ImageResponse(element, {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      headers: {
        "Cache-Control": CARD_CACHE_CONTROL,
        "Content-Type": "image/png",
      },
    });
  },

  /** Synchronous render when card data is already resolved (e.g. tests). */
  renderFromData(data: CardData): ImageResponse {
    const layout = cardLayoutRegistry.get(data.cardType);
    if (!layout) {
      throw new Error(`No layout registered for card type: ${data.cardType}`);
    }

    const theme = cardThemeProvider.resolve(data.theme);
    const element = layout.render({ data, theme });

    return new ImageResponse(element, {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      headers: {
        "Cache-Control": CARD_CACHE_CONTROL,
        "Content-Type": "image/png",
      },
    });
  },
};
