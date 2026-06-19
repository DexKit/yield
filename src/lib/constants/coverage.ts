/** Public coverage data for /supported and homepage chips. */

export interface CoverageProtocol {
  name: string;
  chains: string[];
  description: string;
}

export interface CoverageNetwork {
  name: string;
  status: "active" | "planned";
  description: string;
}

export const COVERAGE_NETWORKS: CoverageNetwork[] = [
  {
    name: "Ethereum",
    status: "active",
    description: "Primary network — liquid staking, lending, restaking, and vault positions.",
  },
  {
    name: "Base",
    status: "active",
    description: "L2 yield from lending, vaults, and native Base DeFi protocols.",
  },
  {
    name: "Arbitrum",
    status: "planned",
    description: "Aave and Morpho coverage planned for a future release.",
  },
  {
    name: "Optimism",
    status: "planned",
    description: "Aave lending markets planned for a future release.",
  },
  {
    name: "Polygon",
    status: "planned",
    description: "Multi-protocol L2 support on the roadmap.",
  },
  {
    name: "Solana",
    status: "planned",
    description: "Non-EVM wallet support is planned for a future release.",
  },
];

export const COVERAGE_PROTOCOLS: CoverageProtocol[] = [
  {
    name: "Lido",
    chains: ["Ethereum"],
    description: "Liquid staking — stETH and wrapped variants.",
  },
  {
    name: "Ether.fi",
    chains: ["Ethereum"],
    description: "Liquid restaking — eETH and weETH positions.",
  },
  {
    name: "Aave",
    chains: ["Ethereum", "Base"],
    description: "Supply-side lending yield on aTokens.",
  },
  {
    name: "Morpho",
    chains: ["Ethereum", "Base"],
    description: "Optimized lending vaults and MetaMorpho markets.",
  },
  {
    name: "Sky",
    chains: ["Ethereum"],
    description: "sUSDS and related Sky Protocol savings yield.",
  },
  {
    name: "EigenLayer",
    chains: ["Ethereum"],
    description: "Restaking positions and delegated strategies.",
  },
  {
    name: "Swell",
    chains: ["Ethereum"],
    description: "Liquid staking and restaking — swETH and rswETH.",
  },
  {
    name: "Compound",
    chains: ["Ethereum", "Base"],
    description: "Classic lending markets on cToken supply.",
  },
  {
    name: "Spark",
    chains: ["Ethereum"],
    description: "Spark Protocol lending and savings products.",
  },
];

export const ACTIVE_NETWORK_NAMES = COVERAGE_NETWORKS.filter(
  (n) => n.status === "active",
).map((n) => n.name);

export const PLANNED_NETWORK_NAMES = COVERAGE_NETWORKS.filter(
  (n) => n.status === "planned",
).map((n) => n.name);

export const FEATURED_PROTOCOL_NAMES = COVERAGE_PROTOCOLS.slice(0, 7).map(
  (p) => p.name,
);
