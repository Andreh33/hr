import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generative OG: brand-true gradient on charcoal, oversized HR+ wordmark,
// tagline in italic, and the address as a metadata tag. Edge runtime keeps
// generation under ~150ms.
export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#F6F1E8",
          background:
            "radial-gradient(60% 60% at 25% 20%, rgba(0,168,255,0.55), transparent 65%), radial-gradient(60% 60% at 80% 90%, rgba(139,77,255,0.55), transparent 65%), #07060A",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "rgba(246,241,232,0.6)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>HR+ WORLD FOOD</span>
          <span>{SITE.address.locality.toUpperCase()} · {SITE.address.region.toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 192, lineHeight: 0.92, fontWeight: 700, color: "#F6F1E8" }}>
            Sabor
          </span>
          <span
            style={{
              fontSize: 192,
              lineHeight: 0.92,
              fontWeight: 700,
              backgroundImage: "linear-gradient(110deg,#38B6FF 0%,#A87BFF 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            sin fronteras.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "rgba(246,241,232,0.7)",
          }}
        >
          <span style={{ fontStyle: "italic", maxWidth: 720, lineHeight: 1.3 }}>
            Hamburguesas, bocadillos y la casa de las papas — hechos como en casa.
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: "ui-monospace, monospace",
              fontSize: 18,
              color: "rgba(246,241,232,0.85)",
            }}
          >
            <span style={{ color: "#FFB23F" }}>★ {SITE.rating.value}</span>
            <span>·</span>
            <span>{SITE.rating.count} reseñas</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
