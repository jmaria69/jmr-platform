import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Video,
  staticFile,
} from "remotion";
import { ParticleField, RadialBloom } from "../components/ParticleField";
import { FadeSlideIn } from "../components/AnimatedText";
import { LaptopMockup } from "../components/LaptopMockup";

const VIOLET = "#8b5cf6";
const PINK = "#f472b6";

// Nebula particle explosion intro
const NebulaIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const explosionProgress = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Particles radiating outward
  const numParticles = 30;

  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut }}>
        <RadialBloom x="50%" y="50%" color={VIOLET} size={900} />
        <RadialBloom x="50%" y="50%" color={PINK} size={600} />

        {/* Nebula particles */}
        <div style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: numParticles }).map((_, i) => {
            const angle = (i / numParticles) * Math.PI * 2;
            const dist = explosionProgress * (200 + Math.sin(i * 7.3) * 100);
            const x = 50 + Math.cos(angle) * (dist / 19.2);
            const y = 50 + Math.sin(angle) * (dist / 10.8);
            const color = i % 2 === 0 ? VIOLET : PINK;
            const size = 4 + Math.sin(i * 3.7) * 3;
            const opacity = Math.max(0, 1 - explosionProgress * 0.8);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: color,
                  transform: "translate(-50%, -50%)",
                  opacity,
                  boxShadow: `0 0 ${size * 2}px ${color}`,
                }}
              />
            );
          })}
        </div>

        {/* OLGA logo assembling */}
        <div
          style={{
            position: "relative",
            width: 140,
            height: 140,
            opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${VIOLET}`,
              boxShadow: `0 0 40px ${VIOLET}88, inset 0 0 40px ${VIOLET}22`,
            }}
          />
          {/* Middle ring */}
          <div
            style={{
              position: "absolute",
              inset: 16,
              borderRadius: "50%",
              border: `1px solid ${PINK}66`,
              transform: `rotate(${frame * 3}deg)`,
            }}
          >
            {[0, 120, 240].map((angle, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: i === 0 ? VIOLET : i === 1 ? "#3b82f6" : PINK,
                  transform: `rotate(${angle}deg) translateY(-50px) translate(-50%, -50%)`,
                  boxShadow: `0 0 8px ${i === 0 ? VIOLET : i === 1 ? "#3b82f6" : PINK}`,
                }}
              />
            ))}
          </div>
          {/* Inner circle */}
          <div
            style={{
              position: "absolute",
              inset: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${VIOLET}cc, ${PINK}cc)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "sans-serif",
            }}
          >
            OLGA
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Title Scene
const OlgaTitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
      <RadialBloom x="50%" y="50%" color={VIOLET} size={1000} />
      <RadialBloom x="30%" y="40%" color={PINK} size={500} />
      <RadialBloom x="70%" y="60%" color={VIOLET} size={500} />
      <ParticleField count={80} color={VIOLET} opacity={0.5} />
      <ParticleField count={40} color={PINK} opacity={0.3} />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <FadeSlideIn
          text="OLGA.ai"
          startFrame={10}
          style={{
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: -3,
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: `linear-gradient(135deg, ${VIOLET} 0%, #c084fc 40%, ${PINK} 80%, #fb923c 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        />
        <FadeSlideIn
          text="Operative Logistics & General Assistant"
          startFrame={25}
          style={{
            fontSize: 22,
            color: "#aaa",
            letterSpacing: 2,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 300,
            marginTop: 20,
          }}
        />
        <div
          style={{
            marginTop: 16,
            display: "inline-block",
            background: `${VIOLET}22`,
            border: `1px solid ${VIOLET}55`,
            borderRadius: 20,
            padding: "6px 20px",
            color: VIOLET,
            fontSize: 13,
            fontWeight: 600,
            opacity: Math.min(1, Math.max(0, (frame - 40) / 20)),
          }}
        >
          Sistema Multi-Agente IA
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Agent Network Screen
const AgentNetworkScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const localFrame = Math.max(0, frame - startFrame);

  const agents = [
    { name: "OLGA", role: "Orchestrator", color: VIOLET, x: 50, y: 50, tasks: 12, isCenter: true },
    { name: "Cleo", role: "Analytics", color: "#3b82f6", x: 25, y: 25, tasks: 4 },
    { name: "Miguel", role: "Comms", color: "#f97316", x: 75, y: 25, tasks: 7 },
    { name: "Valentina", role: "Media", color: PINK, x: 25, y: 75, tasks: 3 },
    { name: "Atlas", role: "Data", color: "#22c55e", x: 75, y: 75, tasks: 5 },
  ];

  const orbit = (frame * 0.8 * Math.PI) / 180;

  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 24, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", gap: 20 }}>
      {/* Network diagram */}
      <div style={{ flex: 2, position: "relative", background: "#0a0a0f", borderRadius: 12, border: `1px solid ${VIOLET}22`, overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {agents.slice(1).map((a, i) => {
            const orbitAngle = orbit + (i * Math.PI * 2) / 4;
            const r = 120;
            const cx = 50, cy = 50;
            const ax = cx + Math.cos(orbitAngle) * 35;
            const ay = cy + Math.sin(orbitAngle) * 30;
            return (
              <g key={i}>
                <line x1={`${cx}%`} y1={`${cy}%`} x2={`${ax}%`} y2={`${ay}%`}
                  stroke={a.color} strokeWidth={1.5} strokeOpacity={0.4} />
                <circle cx={`${ax}%`} cy={`${ay}%`} r={28}
                  fill={`${a.color}22`} stroke={a.color} strokeWidth={2}
                  opacity={Math.min(1, Math.max(0, (localFrame - i * 10) / 20))} />
                <text x={`${ax}%`} y={`${ay - 1}%`} fill={a.color} fontSize={11} fontWeight={700}
                  textAnchor="middle" dominantBaseline="middle">
                  {a.name}
                </text>
                <text x={`${ax}%`} y={`${ay + 4}%`} fill="#888" fontSize={8}
                  textAnchor="middle" dominantBaseline="middle">
                  {a.tasks} tasks
                </text>
              </g>
            );
          })}

          {/* Center — OLGA */}
          <circle cx="50%" cy="50%" r={40}
            fill={`${VIOLET}33`} stroke={VIOLET} strokeWidth={3}
            filter="url(#glow)" />
          <text x="50%" y="49%" fill="#fff" fontSize={14} fontWeight={900}
            textAnchor="middle" dominantBaseline="middle">
            OLGA
          </text>
          <text x="50%" y="57%" fill={VIOLET} fontSize={9}
            textAnchor="middle" dominantBaseline="middle">
            Orchestrator
          </text>
          <defs>
            <filter id="glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Live task feeds */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: "#888", fontSize: 11 }}>AGENTES · ESTADO EN VIVO</div>
        {agents.slice(1).map((a, i) => (
          <div
            key={i}
            style={{
              background: "#111113",
              border: `1px solid ${a.color}33`,
              borderRadius: 8,
              padding: "10px 12px",
              opacity: Math.min(1, Math.max(0, (localFrame - 15 - i * 8) / 15)),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: a.color, fontWeight: 700, fontSize: 13 }}>{a.name}</span>
              <span style={{ color: "#22c55e", fontSize: 10 }}>● activo</span>
            </div>
            <div style={{ color: "#aaa", fontSize: 11 }}>{a.role} · {a.tasks} tareas</div>
            <div style={{ marginTop: 6, height: 3, background: "#222", borderRadius: 2 }}>
              <div style={{ width: `${(a.tasks / 12) * 100}%`, height: "100%", background: a.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Telegram Bot Screen
const TelegramScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const localFrame = Math.max(0, frame - startFrame);

  const messages = [
    { from: "user", text: "Crea un episodio de podcast sobre IA en 2026", delay: 0 },
    { from: "olga", text: "Procesando... Generando guión con 5 capítulos", delay: 20 },
    { from: "olga", text: "Audio generado: 'El futuro del trabajo con IA'", delay: 45, hasWaveform: true },
    { from: "user", text: "Publícalo en todas las plataformas", delay: 65 },
    { from: "olga", text: "Publicado en Spotify, Apple Podcasts y YouTube. 387 listeners en 30 min.", delay: 80 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 24, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", gap: 20 }}>
      {/* Phone mockup */}
      <div
        style={{
          width: 240,
          background: "#111113",
          border: `1px solid ${VIOLET}44`,
          borderRadius: 36,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 0 40px ${VIOLET}33`,
          flexShrink: 0,
        }}
      >
        {/* Phone top bar */}
        <div style={{ width: 60, height: 6, background: "#333", borderRadius: 3, margin: "4px auto 12px" }} />

        {/* Telegram header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #222" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${PINK})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>
            O
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>OLGA.ai</div>
            <div style={{ color: "#22c55e", fontSize: 10 }}>en línea</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
          {messages.map((msg, i) => {
            const vis = Math.min(1, Math.max(0, (localFrame - msg.delay) / 12));
            return (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", opacity: vis }}>
                <div
                  style={{
                    maxWidth: "80%",
                    background: msg.from === "user" ? VIOLET : "#1f1f2e",
                    borderRadius: msg.from === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    padding: "8px 10px",
                    color: "#fff",
                    fontSize: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                  {msg.hasWaveform && (
                    <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 6 }}>
                      {[...Array(16)].map((_, j) => (
                        <div key={j} style={{ width: 3, background: PINK, borderRadius: 1, height: 4 + Math.sin(j * 0.8 + localFrame * 0.1) * 6 }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Podcast Engine</div>
        <div style={{ color: "#888", fontSize: 14 }}>Generación automatizada end-to-end</div>
        {[
          { label: "Episodios generados", value: "47", color: VIOLET },
          { label: "Oyentes totales", value: "12.4K", color: PINK },
          { label: "Plataformas activas", value: "6", color: "#22c55e" },
          { label: "Tiempo medio generación", value: "2.3 min", color: VIOLET },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#111113",
              border: `1px solid ${stat.color}33`,
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: Math.min(1, Math.max(0, (localFrame - 20 - i * 8) / 15)),
            }}
          >
            <span style={{ color: "#aaa", fontSize: 13 }}>{stat.label}</span>
            <span style={{ color: stat.color, fontSize: 24, fontWeight: 800 }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Podcast + Workspace split screen
const PodcastAndWorkspaceScreen: React.FC<{ side: "podcast" | "workspace"; startFrame: number }> = ({ side, startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const localFrame = Math.max(0, frame - startFrame);

  if (side === "podcast") {
    const chapters = ["Intro: El estado de la IA", "Cap 1: Agentes autónomos", "Cap 2: Casos de uso reales", "Cap 3: Futuro del trabajo", "Outro: Conclusiones"];
    return (
      <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>PODCAST ENGINE · REMOTION</div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Generando episodio 47</div>

        {/* Waveform */}
        <div style={{ background: "#111113", border: `1px solid ${VIOLET}33`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 60 }}>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: `linear-gradient(to top, ${VIOLET}, ${PINK})`,
                  borderRadius: 2,
                  height: `${20 + Math.abs(Math.sin(i * 0.5 + localFrame * 0.05)) * 80}%`,
                  opacity: i < (localFrame / 5) % 50 ? 1 : 0.2,
                }}
              />
            ))}
          </div>
          <div style={{ color: VIOLET, fontSize: 11, marginTop: 8, fontFamily: "monospace" }}>
            ▶ 00:24:18 / 00:38:45 — AI voices: Valentina + Miguel
          </div>
        </div>

        {/* Chapters */}
        {chapters.map((ch, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
              borderBottom: "1px solid #222",
              opacity: Math.min(1, Math.max(0, (localFrame - i * 5) / 12)),
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: i < 3 ? `${VIOLET}33` : "#222", border: `1px solid ${i < 3 ? VIOLET : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: i < 3 ? VIOLET : "#888" }}>
              {i < 3 ? "✓" : i + 1}
            </div>
            <div style={{ color: i < 3 ? "#ccc" : "#666", fontSize: 12 }}>{ch}</div>
          </div>
        ))}
      </div>
    );
  }

  // Google Workspace
  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>GOOGLE WORKSPACE SYNC · Cleo</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Automatización en tiempo real</div>

      {[
        { service: "Gmail", action: "3 borradores generados por Cleo", color: "#ea4335", icon: "M" },
        { service: "Calendar", action: "5 eventos sincronizados hoy", color: VIOLET, icon: "C" },
        { service: "Drive", action: "12 archivos actualizados", color: "#34a853", icon: "D" },
        { service: "Sheets", action: "Informe KPI actualizado ahora", color: "#34a853", icon: "S" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#111113",
            border: `1px solid ${item.color}22`,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 10,
            opacity: Math.min(1, Math.max(0, (localFrame - i * 8) / 15)),
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}22`, border: `1px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, fontSize: 14, fontWeight: 700 }}>
            {item.icon}
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{item.service}</div>
            <div style={{ color: "#888", fontSize: 11 }}>{item.action}</div>
          </div>
          <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
        </div>
      ))}
    </div>
  );
};

// Container Dashboard Screen
const ContainerScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const localFrame = Math.max(0, frame - startFrame);

  const containers = [
    { name: "bot-x", desc: "Telegram Bot", color: VIOLET },
    { name: "api-x", desc: "REST API", color: VIOLET },
    { name: "tunnel-x", desc: "Cloudflare Tunnel", color: PINK },
    { name: "podcast-x", desc: "Podcast Engine", color: PINK },
    { name: "db-x", desc: "PostgreSQL", color: "#22c55e" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 28, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>INFRAESTRUCTURA DOCKER · OLGA</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>5 Contenedores · Todo en verde</div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Containers */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
          {containers.map((c, i) => {
            const pingProgress = Math.max(0, localFrame - 20 - i * 15);
            const pinged = pingProgress > 20;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "#111113",
                  border: `1px solid ${c.color}33`,
                  borderRadius: 10,
                  padding: "14px 18px",
                  opacity: Math.min(1, Math.max(0, (localFrame - i * 8) / 15)),
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${c.color}22`,
                    border: `2px solid ${c.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: c.color,
                    fontWeight: 700,
                    boxShadow: pinged ? `0 0 20px ${c.color}66` : "none",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  {c.name}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{c.desc}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#22c55e22",
                    border: "1px solid #22c55e44",
                    borderRadius: 20,
                    padding: "4px 12px",
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 600 }}>running</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security + tokens panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Security shield */}
          <div
            style={{
              background: "#111113",
              border: `1px solid ${VIOLET}33`,
              borderRadius: 10,
              padding: 16,
              textAlign: "center",
              opacity: Math.min(1, Math.max(0, (localFrame - 30) / 20)),
            }}
          >
            <div style={{ fontSize: 36 }}>🛡️</div>
            <div style={{ color: VIOLET, fontSize: 13, fontWeight: 700, marginTop: 8 }}>Seguridad</div>
            <div style={{ color: "#22c55e", fontSize: 12, marginTop: 4 }}>100% protegido</div>
          </div>

          {/* Token graph */}
          <div
            style={{
              background: "#111113",
              border: `1px solid ${PINK}33`,
              borderRadius: 10,
              padding: 16,
              flex: 1,
              opacity: Math.min(1, Math.max(0, (localFrame - 40) / 20)),
            }}
          >
            <div style={{ color: "#888", fontSize: 10, marginBottom: 8 }}>TOKENS IA HOY</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: PINK }}>1.2M</div>
            <div style={{ color: "#aaa", fontSize: 11, marginTop: 4 }}>GPT-4 + Claude + Gemini</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "flex-end", gap: 3, height: 50 }}>
              {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 1.0, 0.85].map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v * 100}%`, background: `linear-gradient(to top, ${VIOLET}, ${PINK})`, borderRadius: 2 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OlgaAiVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scene1End = 90;
  const scene2End = 210;
  const scene3End = 360;
  const scene4End = 510;
  const scene5End = 660;
  const scene6End = 810;

  return (
    <AbsoluteFill style={{ background: "#09090b" }}>
      {/* Background video */}
      <AbsoluteFill style={{ opacity: 0.06 }}>
        <Video
          src={staticFile("videos/bg-ai.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={0}
          loop
        />
      </AbsoluteFill>

      {/* Scene 1: Nebula intro */}
      {frame < scene1End && (
        <AbsoluteFill><NebulaIntro /></AbsoluteFill>
      )}

      {/* Scene 2: Title */}
      {frame >= scene1End && frame < scene2End && (
        <AbsoluteFill><OlgaTitleScene /></AbsoluteFill>
      )}

      {/* Scene 3: Agent Network */}
      {frame >= scene2End && frame < scene3End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene2End;
            const opacity = interpolate(localFrame, [0, 20, 130, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const scale = interpolate(localFrame, [0, 150], [1, 1.04]);
            return (
              <div style={{ opacity, transform: `scale(${scale})` }}>
                <RadialBloom x="50%" y="50%" color={VIOLET} size={700} />
                <ParticleField count={40} color={VIOLET} opacity={0.3} />
                <LaptopMockup startFrame={0} scale={0.85}>
                  <AgentNetworkScreen startFrame={10} />
                </LaptopMockup>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 4: Telegram Phone */}
      {frame >= scene3End && frame < scene4End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene3End;
            const slideX = interpolate(
              spring({ frame: localFrame, fps, config: { damping: 80, stiffness: 180 } }),
              [0, 1], [-200, 0]
            );
            const opacity = interpolate(localFrame, [0, 20, 120, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            return (
              <div style={{ opacity, transform: `translateX(${slideX}px)` }}>
                <RadialBloom x="40%" y="50%" color={VIOLET} size={700} />
                <RadialBloom x="70%" y="30%" color={PINK} size={400} />
                <LaptopMockup startFrame={0} scale={0.85}>
                  <TelegramScreen startFrame={10} />
                </LaptopMockup>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 5: Podcast + Workspace split */}
      {frame >= scene4End && frame < scene5End && (
        <AbsoluteFill style={{ display: "flex", background: "#09090b" }}>
          {(() => {
            const localFrame = frame - scene4End;
            const leftOp = interpolate(localFrame, [0, 20, 120, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const rightOp = interpolate(localFrame, [15, 35, 120, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            return (
              <>
                <RadialBloom x="25%" y="50%" color={VIOLET} size={500} />
                <RadialBloom x="75%" y="50%" color={PINK} size={500} />
                <div style={{ flex: 1, opacity: leftOp, borderRight: `1px solid ${VIOLET}22`, overflow: "hidden" }}>
                  <PodcastAndWorkspaceScreen side="podcast" startFrame={0} />
                </div>
                <div style={{ flex: 1, opacity: rightOp, overflow: "hidden" }}>
                  <PodcastAndWorkspaceScreen side="workspace" startFrame={15} />
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 6: Containers */}
      {frame >= scene5End && frame < scene6End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene5End;
            const opacity = interpolate(localFrame, [0, 20, 120, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            return (
              <div style={{ opacity, width: "100%", height: "100%" }}>
                <RadialBloom x="50%" y="50%" color={VIOLET} size={700} />
                <ParticleField count={40} color={PINK} opacity={0.25} />
                <LaptopMockup startFrame={0} scale={0.85}>
                  <ContainerScreen startFrame={10} />
                </LaptopMockup>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 7: Outro — all agents converge */}
      {frame >= scene6End && (
        <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene6End;
            const opacity = interpolate(localFrame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const scaleVal = spring({ frame: localFrame, fps, config: { damping: 100, stiffness: 200 } });

            return (
              <div style={{ opacity, transform: `scale(${scaleVal})`, textAlign: "center" }}>
                <RadialBloom x="50%" y="50%" color={VIOLET} size={700} />
                <RadialBloom x="50%" y="50%" color={PINK} size={400} />
                <ParticleField count={60} color={VIOLET} opacity={0.5} />
                <div
                  style={{
                    fontSize: 32,
                    color: "#888",
                    fontFamily: "sans-serif",
                    letterSpacing: 3,
                    marginBottom: 8,
                  }}
                >
                  PraxiaLab
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 900,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    background: `linear-gradient(135deg, ${VIOLET}, ${PINK})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: -2,
                  }}
                >
                  OLGA.ai
                </div>
                <div style={{ color: VIOLET, fontSize: 18, letterSpacing: 4, fontFamily: "monospace", marginTop: 8 }}>
                  praxialab.dev
                </div>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
