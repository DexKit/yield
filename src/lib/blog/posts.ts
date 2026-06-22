export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  cardPath?: string;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "validator-revenue-10-percent-funding",
    title: "How Much Could 10% of Ethereum Validator Revenue Fund?",
    description:
      "Estimate validator revenue at 1% and 10% redirects — vs core dev costs and EF grants — with 32%, 50%, and 70% stake scenarios. Based on the ethresear.ch validator-redirect debate.",
    publishedAt: "2026-06-19",
    cardPath: "/card/compare-validator-revenue-10pct.png",
  },
  {
    slug: "ethereum-foundation-staking-yield",
    title: "How Much Could the Ethereum Foundation Earn If They Staked Their ETH?",
    description:
      "The EF DeFi wallet holds live ETH on-chain. See how much monthly yield they'd earn if idle ETH were staked via Lido — vs what they earn today.",
    publishedAt: "2026-06-18",
    cardPath: "/card/compare-ethereum-foundation-staking.png",
  },
  {
    slug: "strategy-ethereum-yield",
    title: "Strategy Holds Bitcoin. What If They Earned ETH Yield Instead?",
    description:
      "Strategy (MSTR) holds hundreds of thousands of BTC. See how much monthly yield they could earn if the same treasury were in Ethereum — live rates, shareable card.",
    publishedAt: "2026-06-18",
    cardPath: "/card/compare-strategy-ethereum.png",
  },
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
