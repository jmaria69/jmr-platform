"use client";

// Neon atom logo — three glowing orbital rings (violet, cyan, teal)
// with animated electron dots and a bright central nucleus.
// Inspired by the Praxia Labs color palette: #7c3aed / #00d4ff / #06ffa5

export function PraxiaLabLogo({ size = 36 }: { size?: number }) {
  // Unique prefix per instance to avoid filter ID collisions when rendered multiple times
  const id = "pl";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Praxia Labs logo"
    >
      <defs>
        {/* ── Glow filters ── */}
        <filter id={`${id}-gv`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.56  0 0 0 0 0.22  0 0 0 0 0.93  0 0 0 1 0" result="colored" />
          <feBlend in="SourceGraphic" in2="colored" mode="screen" />
        </filter>
        <filter id={`${id}-gc`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0.75  0 0 0 0 1  0 0 0 1 0" result="colored" />
          <feBlend in="SourceGraphic" in2="colored" mode="screen" />
        </filter>
        <filter id={`${id}-gt`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0.9  0 0 0 0 0.6  0 0 0 1 0" result="colored" />
          <feBlend in="SourceGraphic" in2="colored" mode="screen" />
        </filter>
        <filter id={`${id}-nucleus`} x="-80%" y="-80%" width="360%" height="360%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.85  0 0 0 0 1  0 0 0 1 0" result="colored" />
          <feBlend in="SourceGraphic" in2="colored" mode="screen" />
        </filter>

        {/* ── Orbit strokes gradients ── */}
        <linearGradient id={`${id}-lv`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-lc`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-lt`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06ffa5" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06ffa5" stopOpacity="0.2" />
        </linearGradient>

        {/* ── Nucleus glow gradient ── */}
        <radialGradient id={`${id}-ng`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#7dd3fc" />
          <stop offset="70%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>

      {/* ── Orbit 1: violet — horizontal ── */}
      <ellipse
        cx="50" cy="50" rx="47" ry="15"
        stroke={`url(#${id}-lv)`} strokeWidth="2.8" fill="none"
        filter={`url(#${id}-gv)`}
      />
      {/* Electrons on orbit 1 */}
      <circle r="3.6" fill="#a78bfa" filter={`url(#${id}-gv)`}>
        <animateMotion dur="5s" repeatCount="indefinite">
          <mpath href={`#${id}-p1`} />
        </animateMotion>
      </circle>
      <circle r="2.2" fill="#c4b5fd" filter={`url(#${id}-gv)`} opacity="0.75">
        <animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite">
          <mpath href={`#${id}-p1`} />
        </animateMotion>
      </circle>

      {/* ── Orbit 2: cyan — 60° ── */}
      <ellipse
        cx="50" cy="50" rx="47" ry="15"
        stroke={`url(#${id}-lc)`} strokeWidth="2.8" fill="none"
        filter={`url(#${id}-gc)`}
        transform="rotate(60 50 50)"
      />
      <circle r="3.6" fill="#38bdf8" filter={`url(#${id}-gc)`}>
        <animateMotion dur="7s" repeatCount="indefinite">
          <mpath href={`#${id}-p2`} />
        </animateMotion>
      </circle>
      <circle r="2.2" fill="#7dd3fc" filter={`url(#${id}-gc)`} opacity="0.75">
        <animateMotion dur="7s" begin="-3.5s" repeatCount="indefinite">
          <mpath href={`#${id}-p2`} />
        </animateMotion>
      </circle>

      {/* ── Orbit 3: teal — 120° ── */}
      <ellipse
        cx="50" cy="50" rx="47" ry="15"
        stroke={`url(#${id}-lt)`} strokeWidth="2.8" fill="none"
        filter={`url(#${id}-gt)`}
        transform="rotate(120 50 50)"
      />
      <circle r="3.6" fill="#2dd4bf" filter={`url(#${id}-gt)`}>
        <animateMotion dur="6s" begin="-1s" repeatCount="indefinite">
          <mpath href={`#${id}-p3`} />
        </animateMotion>
      </circle>
      <circle r="2.2" fill="#5eead4" filter={`url(#${id}-gt)`} opacity="0.75">
        <animateMotion dur="6s" begin="-4s" repeatCount="indefinite">
          <mpath href={`#${id}-p3`} />
        </animateMotion>
      </circle>

      {/* ── Motion paths (hidden) ── */}
      <ellipse id={`${id}-p1`} cx="50" cy="50" rx="47" ry="15" fill="none" />
      <ellipse id={`${id}-p2`} cx="50" cy="50" rx="47" ry="15" fill="none" transform="rotate(60 50 50)" />
      <ellipse id={`${id}-p3`} cx="50" cy="50" rx="47" ry="15" fill="none" transform="rotate(120 50 50)" />

      {/* ── Nucleus ── */}
      {/* Outer glow halo */}
      <circle cx="50" cy="50" r="11" fill="#1e3a8a" filter={`url(#${id}-nucleus)`} opacity="0.9" />
      {/* Main nucleus sphere */}
      <circle cx="50" cy="50" r="8" fill={`url(#${id}-ng)`} />
      {/* Inner bright core */}
      <circle cx="50" cy="50" r="3.5" fill="#ffffff" opacity="0.95" />
      {/* Star burst highlight */}
      <circle cx="47" cy="47" r="1.5" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}