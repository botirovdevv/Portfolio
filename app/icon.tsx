import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "#ffc24b",
          color: "#070611",
          borderRadius: 16,
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        MB
      </div>
    ),
    size,
  );
}
