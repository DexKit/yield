import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo/site";

export const alt = `${SITE_NAME} — DeFi yield estimates for any wallet`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: -1,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          How much yield does your wallet generate?
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: "#10b981",
            fontWeight: 600,
          }}
        >
          yield.dexkit.com
        </div>
      </div>
    ),
    { ...size },
  );
}
