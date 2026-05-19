import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #09090b 0%, #0f0a1e 100%)",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* SVG orbital logo — static for raster export */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="go"
              x1="0"
              y1="0"
              x2="72"
              y2="72"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* Orbit rings */}
          <ellipse
            cx="36" cy="36" rx="34" ry="11"
            stroke="url(#go)" strokeWidth="1.8" fill="none" opacity="0.6"
          />
          <ellipse
            cx="36" cy="36" rx="34" ry="11"
            stroke="url(#go)" strokeWidth="1.8" fill="none" opacity="0.6"
            transform="rotate(60 36 36)"
          />
          <ellipse
            cx="36" cy="36" rx="34" ry="11"
            stroke="url(#go)" strokeWidth="1.8" fill="none" opacity="0.6"
            transform="rotate(120 36 36)"
          />
          {/* Nucleus glow */}
          <circle cx="36" cy="36" r="9" fill="#a78bfa" opacity="0.35" />
          <circle cx="36" cy="36" r="6" fill="url(#go)" />
          <circle cx="36" cy="36" r="3" fill="white" opacity="0.95" />
          {/* Electrons */}
          <circle cx="70" cy="36" r="4.5" fill="#22d3ee" opacity="0.95" />
          <circle cx="70" cy="36" r="7" fill="#22d3ee" opacity="0.15" />
          <circle cx="17" cy="9"  r="4.5" fill="#f472b6" opacity="0.95" />
          <circle cx="17" cy="9"  r="7" fill="#f472b6" opacity="0.15" />
          <circle cx="17" cy="63" r="4.5" fill="#a78bfa" opacity="0.95" />
          <circle cx="17" cy="63" r="7" fill="#a78bfa" opacity="0.15" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
