import { ImageResponse } from "next/og";
import { profile, siteUrl } from "@/content/profile";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card: midnight background with a yellow accent. */
export function renderOg({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#070611",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(255,194,75,0.25), transparent 45%), linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          color: "#e8e9ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ffc24b",
              color: "#070611",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 26, color: "#ffc24b", letterSpacing: 4, textTransform: "uppercase" }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 60 ? 56 : 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          {subtitle && <div style={{ marginTop: 24, fontSize: 30, color: "#9aa0a8" }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#9aa0a8" }}>
          <span>{profile.name}</span>
          <span style={{ color: "#ffc24b" }}>{siteUrl.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
