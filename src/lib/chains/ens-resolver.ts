import {
  createPublicClient,
  fallback,
  http,
  type PublicClient,
} from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

let ensClient: PublicClient | null = null;

/** RPC endpoints tried in order for ENS resolution (CCIP-read friendly). */
function ensRpcUrls(): string[] {
  const urls = [
    "https://ethereum.publicnode.com",
    "https://1rpc.io/eth",
    "https://cloudflare-eth.com",
  ];

  const key = process.env.ALCHEMY_API_KEY;
  if (key) {
    urls.push(`https://eth-mainnet.g.alchemy.com/v2/${key}`);
  }

  return urls;
}

function getEnsClient(): PublicClient {
  if (ensClient) return ensClient;

  ensClient = createPublicClient({
    chain: mainnet,
    transport: fallback(
      ensRpcUrls().map((url) => http(url, { timeout: 12_000 })),
      { rank: false },
    ),
  });

  return ensClient;
}

/** HTTP fallback when on-chain CCIP-read fails (e.g. Alchemy timeout). */
async function resolveEnsViaHttp(
  name: string,
): Promise<`0x${string}` | null> {
  try {
    const res = await fetch(
      `https://api.ensideas.com/ens/resolve/${encodeURIComponent(name)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { address?: string };
    const address = data.address;
    if (
      typeof address === "string" &&
      address.startsWith("0x") &&
      address.length === 42
    ) {
      return address as `0x${string}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolve an ENS name to an address with RPC fallbacks + HTTP gateway.
 * Never throws — returns null when resolution fails.
 */
export async function resolveEnsAddress(
  name: string,
): Promise<`0x${string}` | null> {
  let normalized: string;
  try {
    normalized = normalize(name);
  } catch {
    return null;
  }

  try {
    const address = await getEnsClient().getEnsAddress({ name: normalized });
    if (address) return address;
  } catch {
    // CCIP-read / RPC failure — try HTTP gateway below
  }

  return resolveEnsViaHttp(normalized);
}

/**
 * Reverse ENS lookup with graceful failure.
 */
export async function lookupEnsName(
  address: `0x${string}`,
): Promise<string | null> {
  try {
    return await getEnsClient().getEnsName({ address });
  } catch {
    return null;
  }
}
