import { DefaultWalletCardLayout } from "@/lib/cards/layouts/default-wallet-card";
import { ScenarioYieldCardLayout } from "@/lib/cards/layouts/scenario-yield-card";
import type { CardLayout, CardTypeId } from "@/lib/cards/types";

const layouts = new Map<CardTypeId, CardLayout>([
  [DefaultWalletCardLayout.id, DefaultWalletCardLayout],
  [ScenarioYieldCardLayout.id, ScenarioYieldCardLayout],
]);

export const cardLayoutRegistry = {
  get(cardType: CardTypeId): CardLayout | undefined {
    return layouts.get(cardType);
  },

  register(layout: CardLayout): void {
    layouts.set(layout.id, layout);
  },

  implementedTypes(): CardTypeId[] {
    return [...layouts.keys()];
  },
};
