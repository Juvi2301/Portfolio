import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.fullName} — Full Stack & MERN Stack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 20%, #1a3a6b 0%, #0a0e1a 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#559cff",
            fontWeight: 700,
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 800,
            marginTop: 12,
            lineHeight: 1.05,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 600,
            marginTop: 24,
            color: "#cfd8e8",
          }}
        >
          Full Stack &amp; MERN Stack Developer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 40,
            color: "#8a97ad",
          }}
        >
          React · Node.js · Express · MongoDB
        </div>
      </div>
    ),
    { ...size }
  );
}
