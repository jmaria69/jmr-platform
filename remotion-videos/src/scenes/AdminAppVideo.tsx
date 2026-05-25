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
import {
  AdminDashboardScreen,
  VeraChatScreen,
  QuentinScreen,
} from "../components/DashboardUI";

const ACCENT = "#6366f1";
const FPS = 30;

// Scene 1: Logo intro (0-3s = frames 0-90)
const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80, stiffness: 200, mass: 0.8 } });
  const scaleVal = interpolate(scale, [0, 1], [0.2, 1]);
  const fadeOut = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bloomOpacity = interpolate(frame, [0, 30, 70, 90], [0, 0.8, 0.8, 0]);

  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: bloomOpacity, position: "absolute", inset: 0 }}>
        <RadialBloom x="50%" y="50%" color={ACCENT} size={900} pulse />
      </div>
      <ParticleField count={40} color={ACCENT} opacity={0.3} />
      <div
        style={{
          opacity: fadeOut,
          transform: `scale(${scaleVal})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Orbital logo */}
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${ACCENT}`,
              boxShadow: `0 0 40px ${ACCENT}88`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 12,
              borderRadius: "50%",
              border: `1px solid ${ACCENT}44`,
              transform: `rotate(${frame * 2}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -6,
                left: "50%",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: ACCENT,
                transform: "translateX(-50%)",
                boxShadow: `0 0 12px ${ACCENT}`,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 30,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${ACCENT}88, #818cf888)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "sans-serif",
            }}
          >
            AL
          </div>
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 300,
            letterSpacing: 8,
            fontFamily: "sans-serif",
            opacity: interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          PRAXIALAB
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Title (3-7s = frames 90-210)
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Indigo particle burst
  const burstOpacity = interpolate(frame, [0, 20, 80, 120], [0, 0.6, 0.4, 0]);

  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: burstOpacity }}>
        <RadialBloom x="50%" y="50%" color={ACCENT} size={1200} />
        <RadialBloom x="20%" y="30%" color={ACCENT} size={600} />
        <RadialBloom x="80%" y="70%" color="#818cf8" size={600} />
      </div>
      <ParticleField count={80} color={ACCENT} opacity={0.5} />

      <div
        style={{
          textAlign: "center",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <FadeSlideIn
          text="AdminApp Maestro"
          startFrame={10}
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: -2,
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 60%, #818cf8 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
          }}
        />
        <FadeSlideIn
          text="Gestión inteligente de comunidades"
          startFrame={25}
          style={{
            fontSize: 28,
            color: "#aaa",
            letterSpacing: 2,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 300,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Dashboard in laptop (7-12s = frames 210-360)
const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20, 110, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 150], [1, 1.05]);

  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center", opacity }}>
      <RadialBloom x="50%" y="50%" color={ACCENT} size={800} />
      <ParticleField count={30} color={ACCENT} opacity={0.2} />
      <div style={{ transform: `scale(${scale})` }}>
        <LaptopMockup startFrame={0} scale={0.82}>
          <AdminDashboardScreen accent={ACCENT} startFrame={10} />
        </LaptopMockup>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Split screen VERA + QUENTIN (12-17s = frames 360-510)
const SplitScene: React.FC = () => {
  const frame = useCurrentFrame();

  const leftX = interpolate(frame, [0, 30], [-300, 0], { extrapolateRight: "clamp" });
  const rightX = interpolate(frame, [10, 40], [300, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15, 110, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#09090b", opacity, display: "flex", gap: 0 }}>
      <RadialBloom x="25%" y="50%" color={ACCENT} size={600} />
      <RadialBloom x="75%" y="50%" color="#818cf8" size={600} />

      {/* Left — VERA */}
      <div
        style={{
          flex: 1,
          transform: `translateX(${leftX}px)`,
          borderRight: `1px solid ${ACCENT}22`,
          overflow: "hidden",
        }}
      >
        <VeraChatScreen accent={ACCENT} startFrame={0} />
      </div>

      {/* Divider */}
      <div
        style={{
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Right — QUENTIN */}
      <div
        style={{
          flex: 1,
          transform: `translateX(${rightX}px)`,
          overflow: "hidden",
        }}
      >
        <QuentinScreen accent={ACCENT} startFrame={15} />
      </div>
    </AbsoluteFill>
  );
};

// Financial Report Screen (inline)
const FinancialScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const ACCENT_LOCAL = "#6366f1";

  const bars = [180, 195, 210, 188, 225, 240, 218, 235, 252, 248, 268, 280];
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / 40));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        opacity,
        padding: 28,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>INFORME FINANCIERO AUTOMATIZADO</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Q4 2025 · Comunidades</div>
        </div>
        <div
          style={{
            background: `${ACCENT_LOCAL}22`,
            border: `1px solid ${ACCENT_LOCAL}55`,
            borderRadius: 8,
            padding: "8px 16px",
            color: ACCENT_LOCAL,
            fontSize: 12,
          }}
        >
          PDF Generado automáticamente
        </div>
      </div>

      {/* Waterfall chart */}
      <div
        style={{
          background: "#111113",
          border: `1px solid ${ACCENT_LOCAL}22`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ color: "#888", fontSize: 11, marginBottom: 16 }}>INGRESOS MENSUALES (K€)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120 }}>
          {bars.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: (v / 300) * 120 * progress,
                background: `linear-gradient(to top, ${ACCENT_LOCAL}, #818cf8)`,
                borderRadius: "3px 3px 0 0",
                opacity: 0.6 + (i / bars.length) * 0.4,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 8, marginTop: 2 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Ingresos Total", value: "€2.74M", delta: "+8.2%" },
          { label: "Morosidad", value: "2.1%", delta: "-0.8%" },
          { label: "Rentabilidad", value: "18.4%", delta: "+1.2%" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: "#111113",
              border: `1px solid ${ACCENT_LOCAL}22`,
              borderRadius: 8,
              padding: 16,
              opacity: Math.min(1, Math.max(0, (frame - startFrame - 20 - i * 8) / 15)),
            }}
          >
            <div style={{ color: "#888", fontSize: 11 }}>{item.label}</div>
            <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, marginTop: 4 }}>{item.value}</div>
            <div style={{ color: ACCENT_LOCAL, fontSize: 12 }}>{item.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// NFC Screen (inline)
const NFCScreen: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));
  const ACCENT_LOCAL = "#6366f1";
  const pulse = Math.sin((frame - startFrame) * 0.2) * 0.5 + 0.5;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        opacity,
        padding: 28,
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        gap: 24,
      }}
    >
      {/* Phone mockup */}
      <div
        style={{
          width: 220,
          background: "#111113",
          border: `1px solid ${ACCENT_LOCAL}44`,
          borderRadius: 32,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          boxShadow: `0 0 ${40 + pulse * 20}px ${ACCENT_LOCAL}${Math.round(pulse * 80).toString(16).padStart(2, "0")}`,
        }}
      >
        <div
          style={{
            width: 60,
            height: 6,
            background: "#333",
            borderRadius: 3,
            marginTop: 4,
          }}
        />
        <div
          style={{
            width: "100%",
            flex: 1,
            background: "#09090b",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: `3px solid ${ACCENT_LOCAL}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              boxShadow: `0 0 20px ${ACCENT_LOCAL}44`,
            }}
          >
            NFC
          </div>
          <div style={{ color: ACCENT_LOCAL, fontSize: 13, fontWeight: 600, textAlign: "center" }}>
            Acceso verificado
          </div>
          <div style={{ color: "#22c55e", fontSize: 11, textAlign: "center" }}>
            Residente confirmado
          </div>
        </div>
      </div>

      {/* Access log */}
      <div style={{ flex: 1 }}>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          Registro de Accesos
        </div>
        {[
          { name: "María García", unit: "Apt 4B", time: "08:23", type: "NFC" },
          { name: "Carlos López", unit: "Apt 7A", time: "08:31", type: "QR" },
          { name: "Ana Martín", unit: "Apt 2C", time: "08:45", type: "NFC" },
          { name: "Luis Sánchez", unit: "Apt 12D", time: "09:02", type: "NFC" },
          { name: "Elena Torres", unit: "Apt 5B", time: "09:14", type: "QR" },
        ].map((entry, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px",
              background: "#111113",
              border: `1px solid ${ACCENT_LOCAL}22`,
              borderRadius: 8,
              marginBottom: 8,
              opacity: Math.min(1, Math.max(0, (frame - startFrame - i * 5) / 15)),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `${ACCENT_LOCAL}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: ACCENT_LOCAL,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {entry.name[0]}
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{entry.name}</div>
                <div style={{ color: "#888", fontSize: 11 }}>{entry.unit}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: ACCENT_LOCAL, fontSize: 13, fontWeight: 700 }}>{entry.time}</div>
              <div
                style={{
                  color: "#888",
                  fontSize: 10,
                  background: `${ACCENT_LOCAL}22`,
                  borderRadius: 4,
                  padding: "1px 6px",
                }}
              >
                {entry.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Scene 5: Financial Report full width (17-22s = frames 510-660)
const FinancialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 110, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#09090b", opacity }}>
      <RadialBloom x="70%" y="30%" color={ACCENT} size={700} />
      <LaptopMockup startFrame={0} scale={0.85}>
        <FinancialScreen startFrame={10} />
      </LaptopMockup>
    </AbsoluteFill>
  );
};

// Scene 6: NFC (22-27s = frames 660-810)
const NFCScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dropY = interpolate(
    spring({ frame, fps: FPS, config: { damping: 60, stiffness: 180, mass: 1.2 } }),
    [0, 1],
    [-200, 0]
  );
  const opacity = interpolate(frame, [0, 15, 110, 150], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#09090b", opacity }}>
      <RadialBloom x="30%" y="60%" color={ACCENT} size={700} pulse />
      <div style={{ transform: `translateY(${dropY}px)`, height: "100%" }}>
        <LaptopMockup startFrame={0} scale={0.85}>
          <NFCScreen startFrame={10} />
        </LaptopMockup>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Outro (27-30s = frames 810-900)
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <RadialBloom x="50%" y="50%" color={ACCENT} size={600} />
        <div
          style={{
            color: "#fff",
            fontSize: 56,
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -1,
          }}
        >
          PraxiaLab
        </div>
        <div
          style={{
            color: ACCENT,
            fontSize: 20,
            letterSpacing: 4,
            fontFamily: "monospace",
            marginTop: 8,
          }}
        >
          praxialab.dev
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AdminAppVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene boundaries
  const scene1End = 90;    // 0-3s
  const scene2End = 210;   // 3-7s
  const scene3End = 360;   // 7-12s
  const scene4End = 510;   // 12-17s
  const scene5End = 660;   // 17-22s
  const scene6End = 810;   // 22-27s
  // scene7: 810-900 27-30s

  return (
    <AbsoluteFill style={{ background: "#09090b" }}>
      {/* Background video — very subtle */}
      <AbsoluteFill style={{ opacity: 0.06 }}>
        <Video
          src={staticFile("videos/bg-admin.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={0}
          loop
        />
      </AbsoluteFill>

      {/* Scene 1: Logo intro */}
      {frame < scene1End && (
        <AbsoluteFill>
          <LogoIntro />
        </AbsoluteFill>
      )}

      {/* Scene 2: Title */}
      {frame >= scene1End && frame < scene2End && (
        <AbsoluteFill>
          <TitleScene />
        </AbsoluteFill>
      )}

      {/* Scene 3: Dashboard */}
      {frame >= scene2End && frame < scene3End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <DashboardScene />
        </AbsoluteFill>
      )}

      {/* Scene 4: Split VERA + QUENTIN */}
      {frame >= scene3End && frame < scene4End && (
        <AbsoluteFill>
          <SplitScene />
        </AbsoluteFill>
      )}

      {/* Scene 5: Financial */}
      {frame >= scene4End && frame < scene5End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <FinancialScene />
        </AbsoluteFill>
      )}

      {/* Scene 6: NFC */}
      {frame >= scene5End && frame < scene6End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <NFCScene />
        </AbsoluteFill>
      )}

      {/* Scene 7: Outro */}
      {frame >= scene6End && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <OutroScene />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
