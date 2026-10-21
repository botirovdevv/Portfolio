import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Same monogram as components/logo.tsx, scaled to the favicon.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070611",
          borderRadius: 16,
        }}
      >
        <svg width="56" height="56" viewBox="0 0 32 32" fill="none" stroke="#ffc24b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 22V10l5 7 5-7v12M18 10h3.5a3 3 0 0 1 0 6H18m0 0h4a3 3 0 0 1 0 6h-4" />
        </svg>
      </div>
    ),
    size,
  );
}
