import { NextResponse } from "next/server";
import { serializeWalletYield } from "@/lib/api/serialize-yield";
import { getCachedWalletYield } from "@/lib/seo/cached-yield";

export const revalidate = 300;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface RouteContext {
  params: Promise<{ wallet: string }>;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(_request: Request, context: RouteContext) {
  const { wallet } = await context.params;
  const result = await getCachedWalletYield(wallet);

  if (!result) {
    return NextResponse.json(
      { error: "Wallet not found or could not be resolved" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  return NextResponse.json(serializeWalletYield(result), {
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
