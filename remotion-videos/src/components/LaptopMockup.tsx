import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface LaptopMockupProps {
  startFrame: number;
  children: React.ReactNode;
  scale?: number;
}

export const LaptopMockup: React.FC<LaptopMockupProps> = ({
  startFrame,
  children,
  scale = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);
  const progress = spring({ frame: localFrame, fps, config: { damping: 100, stiffness: 150, mass: 1 } });
  const scaleAnim = interpolate(progress, [0, 1], [0.7, scale]);
  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scaleAnim})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Screen bezel */}
      <div
        style={{
          width: 1200,
          height: 750,
          background: "#1a1a2e",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 0 80px rgba(99,102,241,0.3), 0 40px 80px rgba(0,0,0,0.8)",
          border: "1px solid #333",
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 8,
            overflow: "hidden",
            background: "#09090b",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
      {/* Base */}
      <div
        style={{
          width: 1400,
          height: 20,
          background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a)",
          borderRadius: "0 0 20px 20px",
        }}
      />
      <div
        style={{
          width: 1600,
          height: 8,
          background: "#111",
          borderRadius: "0 0 12px 12px",
        }}
      />
    </div>
  );
};
