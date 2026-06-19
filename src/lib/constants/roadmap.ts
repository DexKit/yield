/** Public roadmap items for /roadmap. */

export type RoadmapStatus = "shipped" | "in-progress" | "planned";

export interface RoadmapItem {
  title: string;
  status: RoadmapStatus;
  priority?: "P1" | "P2";
  description?: string;
}

export interface RoadmapSection {
  id: string;
  title: string;
  description?: string;
  items: RoadmapItem[];
}

export const ROADMAP_SECTIONS: RoadmapSection[] = [
  {
    id: "next",
    title: "In progress / next",
    description: "What the team is building toward public launch and wider distribution.",
    items: [
      {
        title: "widget.js web component",
        status: "in-progress",
        priority: "P1",
        description: "Drop-in embed script for third-party sites beyond iframe widgets.",
      },
      {
        title: "API rate limiting",
        status: "in-progress",
        priority: "P1",
        description: "Protect public endpoints before wide widget distribution.",
      },
      {
        title: "Dynamic wallet sitemap index",
        status: "planned",
        priority: "P2",
        description: "Automatic sitemap entries for popular searched wallets.",
      },
      {
        title: "EUR / GBP / BRL on main UI",
        status: "planned",
        priority: "P2",
        description: "Currency display on wallet pages — cards already support this.",
      },
    ],
  },
  {
    id: "cards",
    title: "Future card types",
    description: "Additional shareable PNG cards beyond the default wallet card.",
    items: [
      { title: "Opportunity card", status: "planned", description: "/card/{wallet}-opportunity.png" },
      { title: "Optimizer card", status: "planned", description: "/card/{wallet}-optimizer.png" },
      { title: "Protocol card", status: "planned", description: "/card/{wallet}-{protocol}.png" },
      { title: "Chain card", status: "planned", description: "/card/{wallet}-{chain}.png" },
      { title: "Comparison cards", status: "planned", description: "e.g. Lido vs Ether.fi" },
      { title: "DAO treasury cards", status: "planned", description: "Institutional treasury snapshots" },
    ],
  },
  {
    id: "seo",
    title: "Programmatic SEO pages",
    description: "Discovery pages to increase organic reach and internal linking.",
    items: [
      { title: "Top Yield Wallets", status: "planned" },
      { title: "Per-protocol rankings", status: "planned", description: "Lido, Ether.fi, Aave, and more" },
      { title: "DAO & treasury reports", status: "planned" },
    ],
  },
  {
    id: "sharing",
    title: "Sharing & distribution",
    items: [
      { title: "Farcaster share", status: "planned" },
      { title: "Reddit share", status: "planned" },
      { title: "Opportunity report share", status: "planned" },
      { title: "Telegram bot previews", status: "planned" },
      { title: "Discord bot integration", status: "planned" },
      { title: "Weekly snapshot email", status: "planned" },
    ],
  },
  {
    id: "coverage",
    title: "Chain & protocol coverage",
    items: [
      {
        title: "Arbitrum & Optimism",
        status: "planned",
        description: "Expand beyond Ethereum and Base.",
      },
      {
        title: "Polygon",
        status: "planned",
      },
      {
        title: "Solana wallets",
        status: "planned",
        description: "Non-EVM address support.",
      },
    ],
  },
];

export const SHIPPED_HIGHLIGHTS = [
  "Multi-chain yield engine & wallet pages",
  "Embeddable iframe widgets & public API",
  "Dynamic shareable yield cards (PNG)",
  "Social sharing & Open Graph integration",
  "Yield opportunity estimates",
  "Privacy-friendly analytics",
  "Launch trust, SEO & UX pass",
] as const;
