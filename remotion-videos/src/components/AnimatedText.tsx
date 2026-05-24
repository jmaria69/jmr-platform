import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

interface AnimatedTextProps {
  text: string;
  startFrame: number;
  style?: React.CSSProperties;
  delay?: number;
}

export const FadeSlideIn: React.FC<AnimatedTextProps> = ({
  text,
  startFrame,
  style = {},
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame - delay);
  const progress = spring({ frame: localFrame, fps, config: { damping: 80, stiffness: 200, mass: 0.5 } });
  const opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

interface TypewriterProps {
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  startFrame,
  charsPerFrame = 0.5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);
  const charsVisible = Math.floor(localFrame * charsPerFrame);
  const visible = text.slice(0, charsVisible);

  return (
    <div style={style}>
      {visible}
      {charsVisible < text.length && (
        <span style={{ opacity: Math.floor(localFrame / 15) % 2 === 0 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};
