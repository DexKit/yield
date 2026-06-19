/** Net APY (annual %) from Morpho vault API — same source as app.morpho.org. */
export async function fetchMorphoVaultNetApy(
  vaultAddress: `0x${string}`,
  chainId = 1,
): Promise<number | null> {
  try {
    const res = await fetch("https://api.morpho.org/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ vaultByAddress(address: "${vaultAddress}", chainId: ${chainId}) { state { netApy } } }`,
      }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: { vaultByAddress?: { state?: { netApy?: number } } };
    };
    const netApy = data.data?.vaultByAddress?.state?.netApy;
    return netApy != null ? netApy * 100 : null;
  } catch {
    return null;
  }
}
