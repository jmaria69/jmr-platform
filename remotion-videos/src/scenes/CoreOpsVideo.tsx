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

const ACCENT = "#06b6d4";

// Network topology map screen
const NetworkMapScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));

  const servers = [
    { x: 50, y: 50, name: "CORE-01", status: "ok" },
    { x: 20, y: 25, name: "WEB-01", status: "ok" },
    { x: 80, y: 25, name: "WEB-02", status: "ok" },
    { x: 15, y: 55, name: "DB-01", status: "ok" },
    { x: 85, y: 55, name: "DB-02", status: "alert" },
    { x: 30, y: 80, name: "CACHE-01", status: "ok" },
    { x: 70, y: 80, name: "CACHE-02", status: "alert" },
    { x: 10, y: 75, name: "BACKUP", status: "ok" },
    { x: 90, y: 75, name: "CDN-01", status: "ok" },
    { x: 50, y: 15, name: "LB-01", status: "ok" },
    { x: 35, y: 45, name: "API-01", status: "ok" },
    { x: 65, y: 45, name: "API-02", status: "alert" },
  ];

  const localFrame = Math.max(0, frame - startFrame);
  const progress = Math.min(1, localFrame / 60);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        opacity,
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ color: "#888", fontSize: 11 }}>TOPOLOGÍA DE RED</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Infraestructura Enterprise</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ color: "#22c55e", fontSize: 12 }}>● 9 OK</div>
          <div style={{ color: "#ef4444", fontSize: 12 }}>● 3 ALERTA</div>
        </div>
      </div>

      <div style={{ position: "relative", height: 340, background: "#0a0a0f", borderRadius: 12, border: `1px solid ${ACCENT}22`, overflow: "hidden" }}>
        {/* Grid lines */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${(i + 1) * 12.5}%`, top: 0, bottom: 0, borderLeft: "1px solid #ffffff08" }} />
        ))}

        {/* Connections */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {servers.slice(1).map((s, i) => {
            const center = servers[0];
            const vis = Math.min(1, progress * 2);
            return (
              <line
                key={i}
                x1={`${center.x}%`} y1={`${center.y}%`}
                x2={`${s.x}%`} y2={`${s.y}%`}
                stroke={s.status === "alert" ? "#ef4444" : ACCENT}
                strokeWidth={1}
                strokeOpacity={vis * 0.4}
                strokeDasharray={s.status === "alert" ? "4 4" : "none"}
              />
            );
          })}
        </svg>

        {/* Server nodes */}
        {servers.map((s, i) => {
          const nodeVis = Math.min(1, Math.max(0, (localFrame - i * 5) / 20));
          const pulse = Math.sin(frame * 0.1 + i) * 0.3 + 0.7;
          const color = s.status === "alert" ? "#ef4444" : s.name === "CORE-01" ? ACCENT : "#22c55e";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: "translate(-50%, -50%)",
                opacity: nodeVis,
              }}
            >
              <div
                style={{
                  width: s.name === "CORE-01" ? 52 : 36,
                  height: s.name === "CORE-01" ? 52 : 36,
                  borderRadius: 8,
                  background: `${color}22`,
                  border: `2px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 ${12 * pulse}px ${color}66`,
                  flexDirection: "column",
                }}
              >
                <div style={{ color, fontSize: 7, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                  {s.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ERP Screen
const ERPScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));

  const kanbanItems = [
    { title: "Servidor Dell R740", stage: "Recibido", color: "#22c55e" },
    { title: "Switch Cisco 9300", stage: "En tránsito", color: ACCENT },
    { title: "Licencias Office 365", stage: "Pendiente", color: "#f59e0b" },
    { title: "Cables Cat6A ×200m", stage: "Recibido", color: "#22c55e" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>MÓDULO ERP</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Centro de Mando Empresarial</div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* RRHH */}
        <div style={{ flex: 1, background: "#111113", border: `1px solid ${ACCENT}22`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#888", fontSize: 11, marginBottom: 12 }}>RECURSOS HUMANOS</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: ACCENT, lineHeight: 1 }}>47</div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>Empleados activos</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {["Ingeniería: 18", "Operaciones: 12", "Ventas: 9", "Admin: 8"].map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: 11 }}>
                <span>{d.split(":")[0]}</span>
                <span style={{ color: ACCENT }}>{d.split(":")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban */}
        <div style={{ flex: 2, background: "#111113", border: `1px solid ${ACCENT}22`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#888", fontSize: 11, marginBottom: 12 }}>ÓRDENES DE COMPRA</div>
          {kanbanItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: "#09090b",
                borderRadius: 8,
                marginBottom: 8,
                border: `1px solid ${item.color}22`,
                opacity: Math.min(1, Math.max(0, (frame - startFrame - 15 - i * 8) / 15)),
              }}
            >
              <div style={{ color: "#fff", fontSize: 13 }}>{item.title}</div>
              <div style={{ background: `${item.color}22`, border: `1px solid ${item.color}55`, borderRadius: 4, padding: "3px 8px", color: item.color, fontSize: 10, fontWeight: 700 }}>
                {item.stage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Docker telemetry screen
const DockerScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));

  const containers = [
    { name: "web-proxy", cpu: 12, ram: 34, status: "running" },
    { name: "api-gateway", cpu: 28, ram: 56, status: "running" },
    { name: "db-primary", cpu: 45, ram: 72, status: "running" },
    { name: "cache-redis", cpu: 8, ram: 28, status: "running" },
    { name: "worker-01", cpu: 67, ram: 61, status: "warning" },
    { name: "worker-02", cpu: 71, ram: 58, status: "running" },
    { name: "monitoring", cpu: 5, ram: 22, status: "running" },
    { name: "backup-svc", cpu: 3, ram: 18, status: "running" },
    { name: "ml-inference", cpu: 89, ram: 85, status: "running" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 20, fontFamily: "monospace, sans-serif" }}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>DOCKER TELEMETRY</div>
      <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
        9 Containers · 8 Running · 1 Warning
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {containers.map((c, i) => {
          const color = c.status === "warning" ? "#f59e0b" : ACCENT;
          const vis = Math.min(1, Math.max(0, (frame - startFrame - i * 4) / 12));
          return (
            <div
              key={i}
              style={{
                background: "#111113",
                border: `1px solid ${color}33`,
                borderRadius: 8,
                padding: "10px 12px",
                opacity: vis,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: color, fontSize: 11, fontWeight: 700 }}>{c.name}</div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, marginTop: 2 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#666", fontSize: 9, marginBottom: 3 }}>CPU</div>
                  <div style={{ height: 4, background: "#222", borderRadius: 2 }}>
                    <div style={{ width: `${c.cpu}%`, height: "100%", background: c.cpu > 80 ? "#ef4444" : color, borderRadius: 2 }} />
                  </div>
                  <div style={{ color: "#aaa", fontSize: 10, marginTop: 2 }}>{c.cpu}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#666", fontSize: 9, marginBottom: 3 }}>RAM</div>
                  <div style={{ height: 4, background: "#222", borderRadius: 2 }}>
                    <div style={{ width: `${c.ram}%`, height: "100%", background: color, borderRadius: 2 }} />
                  </div>
                  <div style={{ color: "#aaa", fontSize: 10, marginTop: 2 }}>{c.ram}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Threat Detection Screen
const ThreatScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  const threats = [
    { type: "SSH Brute Force", source: "185.234.x.x", severity: "ALTO", color: "#ef4444" },
    { type: "Port Scan", source: "91.108.x.x", severity: "MEDIO", color: "#f59e0b" },
    { type: "SQL Injection", source: "193.32.x.x", severity: "ALTO", color: "#ef4444" },
    { type: "DDoS Attempt", source: "45.227.x.x", severity: "CRÍTICO", color: "#dc2626" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#09090b", opacity, padding: 20, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>DETECCIÓN DE AMENAZAS</div>
        <div
          style={{
            color: "#ef4444",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
            textShadow: `0 0 ${10 * pulse}px #ef4444`,
          }}
        >
          4 Amenazas Activas
        </div>
        {threats.map((t, i) => (
          <div
            key={i}
            style={{
              background: "#111113",
              border: `1px solid ${t.color}33`,
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: Math.min(1, Math.max(0, (frame - startFrame - i * 6) / 15)),
            }}
          >
            <div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{t.type}</div>
              <div style={{ color: "#888", fontSize: 10, fontFamily: "monospace" }}>{t.source}</div>
            </div>
            <div
              style={{
                background: `${t.color}22`,
                border: `1px solid ${t.color}55`,
                borderRadius: 4,
                padding: "3px 8px",
                color: t.color,
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {t.severity}
            </div>
          </div>
        ))}
      </div>

      {/* VERA Analysis panel */}
      <div
        style={{
          width: 220,
          background: "#111113",
          border: `1px solid ${ACCENT}33`,
          borderRadius: 12,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ color: ACCENT, fontSize: 12, fontWeight: 700 }}>VERA · Análisis IA</div>
        <div style={{ color: "#aaa", fontSize: 11, lineHeight: 1.6 }}>
          Detectado patrón de ataque coordinado. Recomiendo bloqueo automático de rangos IP y notificación al SOC.
        </div>
        <div
          style={{
            background: `${ACCENT}22`,
            border: `1px solid ${ACCENT}44`,
            borderRadius: 8,
            padding: "8px 12px",
            color: ACCENT,
            fontSize: 11,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Bloquear Automáticamente
        </div>
        <div style={{ color: "#666", fontSize: 10, textAlign: "center" }}>
          Confianza: 96.4%
        </div>
      </div>
    </div>
  );
};

// AutoPilot Screen
const AutoPilotScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  const actions = [
    "Escaleando API workers: 2 → 4 instancias",
    "Limpiando caché Redis expirado (2.4 GB)",
    "Reiniciando contenedor backup-svc",
    "Actualizando certificados SSL (3 dominios)",
    "Generando informe nocturno de infraestructura",
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <RadialBloom x="50%" y="50%" color={ACCENT} size={800} />

      <div
        style={{
          zIndex: 1,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: ACCENT,
            letterSpacing: 4,
            textShadow: `0 0 ${30 * pulse}px ${ACCENT}`,
          }}
        >
          SISTEMA EN AUTOPILOT
        </div>
        <div style={{ color: "#888", fontSize: 18, marginTop: 8, letterSpacing: 2 }}>
          Gestión autónoma 24/7 activa
        </div>
        <div
          style={{
            display: "inline-block",
            background: "#22c55e22",
            border: "1px solid #22c55e55",
            borderRadius: 20,
            padding: "6px 20px",
            color: "#22c55e",
            fontSize: 12,
            fontWeight: 600,
            marginTop: 12,
          }}
        >
          ● 99.97% Uptime
        </div>
      </div>

      <div
        style={{
          zIndex: 1,
          background: "#111113",
          border: `1px solid ${ACCENT}33`,
          borderRadius: 12,
          padding: 20,
          width: 600,
        }}
      >
        <div style={{ color: "#888", fontSize: 11, marginBottom: 12, fontFamily: "monospace" }}>
          ACCIONES AUTÓNOMAS EN CURSO
        </div>
        {actions.map((action, i) => {
          const vis = Math.min(1, Math.max(0, (frame - startFrame - 20 - i * 8) / 15));
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: i < actions.length - 1 ? "1px solid #222" : "none",
                opacity: vis,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, flexShrink: 0, boxShadow: `0 0 8px ${ACCENT}` }} />
              <div style={{ color: "#ccc", fontSize: 12, fontFamily: "monospace" }}>{action}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CoreOpsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scene1End = 90;
  const scene2End = 210;
  const scene3End = 390;
  const scene4End = 540;
  const scene5End = 660;
  const scene6End = 810;

  return (
    <AbsoluteFill style={{ background: "#09090b" }}>
      {/* Background video */}
      <AbsoluteFill style={{ opacity: 0.07 }}>
        <Video
          src={staticFile("videos/bg-network.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={0}
          loop
        />
      </AbsoluteFill>

      {/* Scene 1: Server rack intro */}
      {frame < scene1End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const scanX = interpolate(frame, [10, 60], [-1920, 1920], { extrapolateRight: "clamp" });
            const logoOpacity = interpolate(frame, [40, 70, 75, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const rackOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

            return (
              <>
                <ParticleField count={50} color={ACCENT} opacity={0.4} />
                <RadialBloom x="50%" y="50%" color={ACCENT} size={700} />

                {/* Server rack silhouette */}
                <div style={{ opacity: rackOpacity, position: "absolute", display: "flex", gap: 12, bottom: 200 }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ width: 40, height: 180, background: "#111113", border: `1px solid ${ACCENT}33`, borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: 4 }}>
                      {[...Array(6)].map((_, j) => (
                        <div key={j} style={{ height: 12, background: `${ACCENT}${Math.random() > 0.3 ? "44" : "22"}`, borderRadius: 2 }} />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Scan line */}
                <div
                  style={{
                    position: "absolute",
                    left: scanX,
                    top: 0,
                    width: 4,
                    height: "100%",
                    background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
                    boxShadow: `0 0 30px ${ACCENT}`,
                  }}
                />

                {/* Logo reveal */}
                <div style={{ opacity: logoOpacity, zIndex: 1, textAlign: "center" }}>
                  <div style={{ color: "#fff", fontSize: 64, fontWeight: 900, letterSpacing: -2, fontFamily: "sans-serif" }}>
                    Core <span style={{ color: ACCENT }}>OPS</span>
                  </div>
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 2: Title */}
      {frame >= scene1End && frame < scene2End && (() => {
        const localFrame = frame - scene1End;
        const codeRainOpacity = interpolate(localFrame, [0, 30, 90, 120], [0, 0.3, 0.2, 0], { extrapolateRight: "clamp" });
        return (
          <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
            {/* Code rain effect */}
            <div style={{ position: "absolute", inset: 0, opacity: codeRainOpacity, overflow: "hidden" }}>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${i * 5}%`,
                    top: `${((localFrame * (1 + i * 0.1)) % 140) - 20}%`,
                    color: ACCENT,
                    fontSize: 14,
                    fontFamily: "monospace",
                    lineHeight: 1.8,
                    writingMode: "vertical-lr",
                    opacity: 0.6,
                  }}
                >
                  {["01", "10", "11", "00", "1A", "FF"][i % 6]}
                </div>
              ))}
            </div>

            <RadialBloom x="50%" y="50%" color={ACCENT} size={1000} />
            <ParticleField count={60} color={ACCENT} opacity={0.4} />

            <div style={{ textAlign: "center", zIndex: 1 }}>
              <FadeSlideIn
                text="Core OPS"
                startFrame={10}
                style={{
                  fontSize: 120,
                  fontWeight: 900,
                  letterSpacing: -4,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 50%, #67e8f9 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              />
              <FadeSlideIn
                text="Centro de mando enterprise"
                startFrame={25}
                style={{
                  fontSize: 26,
                  color: "#aaa",
                  letterSpacing: 3,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 300,
                  marginTop: 16,
                }}
              />
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* Scene 3: Network map */}
      {frame >= scene2End && frame < scene3End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene2End;
            const opacity = interpolate(localFrame, [0, 20, 150, 180], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const scale = interpolate(localFrame, [0, 180], [1, 1.04]);
            return (
              <div style={{ opacity, transform: `scale(${scale})` }}>
                <RadialBloom x="50%" y="40%" color={ACCENT} size={700} />
                <LaptopMockup startFrame={0} scale={0.85}>
                  <NetworkMapScreen startFrame={10} />
                </LaptopMockup>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 4: ERP */}
      {frame >= scene3End && frame < scene4End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene3End;
            const slideX = interpolate(
              spring({ frame: localFrame, fps, config: { damping: 80, stiffness: 200 } }),
              [0, 1], [200, 0]
            );
            const opacity = interpolate(localFrame, [0, 20, 110, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            return (
              <div style={{ opacity, transform: `translateX(${slideX}px)` }}>
                <RadialBloom x="60%" y="40%" color={ACCENT} size={600} />
                <LaptopMockup startFrame={0} scale={0.85}>
                  <ERPScreen startFrame={10} />
                </LaptopMockup>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 5: Docker + Threats side by side */}
      {frame >= scene4End && frame < scene5End && (
        <AbsoluteFill style={{ display: "flex", background: "#09090b" }}>
          {(() => {
            const localFrame = frame - scene4End;
            const leftOpacity = interpolate(localFrame, [0, 20, 100, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const rightOpacity = interpolate(localFrame, [15, 35, 100, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            return (
              <>
                <RadialBloom x="25%" y="50%" color={ACCENT} size={500} />
                <RadialBloom x="75%" y="50%" color="#ef4444" size={500} />
                <div style={{ flex: 1, opacity: leftOpacity, borderRight: `1px solid ${ACCENT}22`, overflow: "hidden" }}>
                  <DockerScreen startFrame={0} />
                </div>
                <div style={{ flex: 1, opacity: rightOpacity, overflow: "hidden" }}>
                  <ThreatScreen startFrame={15} />
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 6: AutoPilot */}
      {frame >= scene5End && frame < scene6End && (
        <AbsoluteFill>
          {(() => {
            const localFrame = frame - scene5End;
            const opacity = interpolate(localFrame, [0, 25, 110, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            return (
              <div style={{ opacity, width: "100%", height: "100%" }}>
                <ParticleField count={50} color={ACCENT} opacity={0.3} />
                <AutoPilotScreen startFrame={0} />
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* Scene 7: Outro */}
      {frame >= scene6End && (
        <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
          {(() => {
            const localFrame = frame - scene6End;
            const opacity = interpolate(localFrame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });
            const scaleVal = spring({ frame: localFrame, fps, config: { damping: 100, stiffness: 200 } });
            return (
              <div style={{ opacity, transform: `scale(${scaleVal})`, textAlign: "center" }}>
                <RadialBloom x="50%" y="50%" color={ACCENT} size={600} />
                <div style={{ color: "#fff", fontSize: 56, fontWeight: 900, fontFamily: "sans-serif", letterSpacing: -1 }}>
                  PraxiaLab
                </div>
                <div style={{ color: ACCENT, fontSize: 20, letterSpacing: 4, fontFamily: "monospace", marginTop: 8 }}>
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
