import { ImageResponse } from "next/og";

export const alt = "golfsilly — Design, code & curiosity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#080e15",
        color: "#f0f7fc",
        padding: 80,
        fontFamily: "sans-serif",
        backgroundImage:
          "radial-gradient(ellipse at 90% 20%, #0d414c 0%, #080e15 65%)",
      }}
    >
      <div style={{ display: "flex", fontSize: 32 }}>
        golfsilly<span style={{ color: "#67e8f9" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <div>Ideas into</div>
        <div style={{ color: "#67e8f9" }}>digital experiences.</div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 20,
          letterSpacing: 5,
          color: "#a2b5c5",
        }}
      >
        DESIGN × CODE × CURIOSITY
      </div>
    </div>,
    size,
  );
}
