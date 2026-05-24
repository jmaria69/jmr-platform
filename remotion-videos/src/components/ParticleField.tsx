import React from "react";
import { useCurrentFrame } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface ParticleFieldProps {
  count?: number;
  color?: string;
  opacity?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 60,
  color = "#6366f1",
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame();

  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 7.3) * 100,
    y: seededRandom(i * 13.7) * 100,
    size: seededRandom(i * 3.1) * 3 + 1,
    speed: seededRandom(i * 5.9) * 0.02 + 0.005,
    opacity: seededRandom(i * 11.1) * 0.6 + 0.2,
    phase: seededRandom(i * 17.3) * Math.PI * 2,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const drift = Math.sin(frame * p.speed + p.phase) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + drift}%`,
              top: `${p.y - (frame * p.speed * 8) % 110}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity * opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export const RadialBloom: React.FC<{
  x?: string;
  y?: string;
  color?: string;
  size?: number;
  pulse?: boolean;
}> = ({ x = "50%", y = "50%", color = "#6366f1", size = 600, pulse = true }) => {
  const frame = useCurrentFrame();
  const scale = pulse ? 1 + Math.sin(frame * 0.03) * 0.1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale})`,
        background: `radial-gradient(circle, ${color}22 0%, ${color}08 40%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
  );
};
