import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ParticleField, RadialBloom } from "../components/ParticleField";

const VIOLET = "#7c3aed";
const CYAN = "#00d4ff";
const AMBER = "#f59e0b";
const BG_DARK = "#070714";

// Monograma oficial de Praxia Labs (doble P geométrica entrelazada con relieve 3D)
const PraxiaOfficialLogo: React.FC<{ size?: number; glow?: boolean }> = ({
  size = 140,
  glow = true,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {glow && (
        <div
          style={{
            position: "absolute",
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(0,212,255,0.2) 50%, transparent 70%)`,
            filter: "blur(24px)",
          }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.7))",
        }}
      >
        <defs>
          <linearGradient id="pGradOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="pGradInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="bevel3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Aguja vertical central que cruza el núcleo */}
        <line
          x1="60"
          y1="12"
          x2="60"
          y2="108"
          stroke="#c084fc"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Lazo Exterior P con bisel 3D */}
        <path
          d="M 34 26 L 76 26 C 92 26 98 38 98 52 C 98 66 90 76 74 76 L 50 76 L 50 102 L 34 102 Z"
          fill="none"
          stroke="url(#pGradOuter)"
          strokeWidth="7"
          strokeLinejoin="round"
          filter="url(#bevel3d)"
        />

        {/* Lazo Interior P anidado */}
        <path
          d="M 48 42 L 72 42 C 80 42 84 48 84 54 C 84 60 80 66 72 66 L 48 66 Z"
          fill="none"
          stroke="url(#pGradInner)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Subtítulo cinemático dinámico con resaltado palabra por palabra
const DynamicCaptions: React.FC<{
  words: { text: string; highlight?: boolean; color?: string }[];
  startFrame: number;
  duration: number;
}> = ({ words, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > startFrame + duration) return null;

  const localFrame = frame - startFrame;
  const progress = localFrame / duration;
  const activeWordIdx = Math.min(
    words.length - 1,
    Math.floor(progress * words.length * 1.15)
  );

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px 18px",
        padding: "0 40px",
        maxWidth: 960,
        transform: `scale(${interpolate(entrance, [0, 1], [0.85, 1])})`,
        opacity: Math.min(1, localFrame / 6),
      }}
    >
      {words.map((w, i) => {
        const isCurrent = i === activeWordIdx;
        const isPast = i < activeWordIdx;
        let color = "#ffffff";
        if (w.highlight) color = w.color || "#facc15";
        if (isCurrent) color = "#38bdf8";

        return (
          <span
            key={i}
            style={{
              fontSize: 48,
              fontWeight: 900,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color,
              transform: isCurrent ? "scale(1.16)" : "scale(1)",
              transition: "transform 0.1s ease",
              textShadow: isCurrent
                ? "0 0 25px rgba(56, 189, 248, 0.8), 0 4px 12px rgba(0,0,0,0.9)"
                : "0 4px 10px rgba(0,0,0,0.8)",
              background: isCurrent ? "rgba(15, 23, 42, 0.85)" : "transparent",
              padding: isCurrent ? "4px 14px" : "0",
              borderRadius: 12,
              border: isCurrent ? "2px solid rgba(56, 189, 248, 0.5)" : "none",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const ViralFacebookVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Duración total: 1500 frames (50s a 30fps)
  // Escena 1: 0 - 240 (0s - 8s) -> Gancho / Dolor
  // Escena 2: 240 - 540 (8s - 18s) -> Agitación
  // Escena 3: 540 - 1020 (18s - 34s) -> Revelación Agente IA + SOC SIAM
  // Escena 4: 1020 - 1260 (34s - 42s) -> Contraste & Ahorro
  // Escena 5: 1260 - 1500 (42s - 50s) -> Cierre con Logo y CTA

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_DARK,
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Fondo cinemático interactivo con partículas y resplandores */}
      <RadialBloom color={VIOLET} x="50%" y="30%" size={700} pulse={true} />
      <RadialBloom color={CYAN} x="70%" y="75%" size={600} pulse={true} />
      <ParticleField count={45} color="rgba(167, 139, 250, 0.45)" />

      {/* Marca de agua superior fija */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <PraxiaOfficialLogo size={44} glow={false} />
          <div>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Praxia Labs
            </span>
            <span
              style={{
                fontSize: 12,
                color: CYAN,
                marginLeft: 10,
                letterSpacing: "0.15em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Enterprise AI
            </span>
          </div>
        </div>

        <div
          style={{
            background: "rgba(124, 58, 237, 0.2)",
            border: "1px solid rgba(124, 58, 237, 0.45)",
            borderRadius: 999,
            padding: "8px 18px",
            fontSize: 16,
            fontWeight: 700,
            color: "#c084fc",
          }}
        >
          ⚡ Operativo en &lt; 48h
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ESCENA 1: EL GANCHO (Frames 0 - 240 / 0s - 8s)
         ───────────────────────────────────────────────────────────── */}
      {frame >= 0 && frame < 240 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "160px 40px",
          }}
        >
          {/* Badge de alerta de dolor */}
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              borderRadius: 30,
              padding: "12px 28px",
              color: "#f87171",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: 50,
              textTransform: "uppercase",
              boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
            }}
          >
            ⚠️ El cuello de botella de tu empresa
          </div>

          {/* Subtítulos dinámicos de la escena 1 */}
          <DynamicCaptions
            startFrame={15}
            duration={210}
            words={[
              { text: "¿Sigues" },
              { text: "copiando" },
              { text: "y" },
              { text: "validando" },
              { text: "facturas", highlight: true, color: "#facc15" },
              { text: "a" },
              { text: "mano" },
              { text: "en" },
              { text: "2026?", highlight: true, color: "#ef4444" },
            ]}
          />

          <p
            style={{
              marginTop: 48,
              fontSize: 26,
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: 720,
              lineHeight: 1.45,
            }}
          >
            Tu equipo pierde más de 40 horas al mes en tareas repetitivas que un agente de IA hace en 3 segundos.
          </p>
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ESCENA 2: LA AGITACIÓN (Frames 240 - 540 / 8s - 18s)
         ───────────────────────────────────────────────────────────── */}
      {frame >= 240 && frame < 540 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "160px 40px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              width: "100%",
              maxWidth: 820,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: 20,
                padding: 30,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 44 }}>💸</span>
              <h3 style={{ fontSize: 22, color: "#f87171", margin: "14px 0 6px" }}>
                Consultoras Tradicionales
              </h3>
              <p style={{ fontSize: 16, color: "#94a3b8" }}>
                15.000€ y meses de reuniones sin resultados reales.
              </p>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(234, 179, 8, 0.4)",
                borderRadius: 20,
                padding: 30,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 44 }}>🧩</span>
              <h3 style={{ fontSize: 22, color: "#fde047", margin: "14px 0 6px" }}>
                Herramientas Sueltas
              </h3>
              <p style={{ fontSize: 16, color: "#94a3b8" }}>
                Zapiers que se rompen y datos expuestos en nubes ajenas.
              </p>
            </div>
          </div>

          <DynamicCaptions
            startFrame={255}
            duration={270}
            words={[
              { text: "No" },
              { text: "necesitas" },
              { text: "consultores" },
              { text: "de" },
              { text: "15.000€.", highlight: true, color: "#f87171" },
              { text: "Necesitas" },
              { text: "automatización", highlight: true, color: CYAN },
              { text: "que" },
              { text: "funcione." },
            ]}
          />
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ESCENA 3: REVELACIÓN DEL AGENTE & SOC (Frames 540 - 1020 / 18s - 34s)
         ───────────────────────────────────────────────────────────── */}
      {frame >= 540 && frame < 1020 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 40px",
          }}
        >
          {/* Tarjeta simulada de proceso en vivo de Praxia Labs */}
          <div
            style={{
              width: "100%",
              maxWidth: 880,
              background: "rgba(13, 17, 34, 0.9)",
              border: `2px solid ${VIOLET}`,
              borderRadius: 24,
              padding: 32,
              boxShadow: `0 20px 60px rgba(124, 58, 237, 0.35)`,
              marginBottom: 44,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: 18,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 12px #22c55e",
                  }}
                />
                <span style={{ fontSize: 18, fontWeight: 700 }}>
                  Agente Autónomo VERA — Factura cotejada con ERP
                </span>
              </div>
              <span
                style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#4ade80",
                  padding: "4px 12px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                PROCESADO EN 2.1s
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 14 }}>
                <span style={{ fontSize: 13, color: "#888" }}>Proveedor detectado</span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 0", color: "#e2e8f0" }}>
                  Iberdrola Clientes
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 14 }}>
                <span style={{ fontSize: 13, color: "#888" }}>Base Imponible + IVA</span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 0", color: "#38bdf8" }}>
                  1.428,50 €
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 14 }}>
                <span style={{ fontSize: 13, color: "#888" }}>Estado Contabilidad</span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 0", color: "#4ade80" }}>
                  ✓ Asiento registrado
                </p>
              </div>
            </div>
          </div>

          <DynamicCaptions
            startFrame={555}
            duration={440}
            words={[
              { text: "Conectado" },
              { text: "a" },
              { text: "tu" },
              { text: "ERP,", highlight: true, color: CYAN },
              { text: "email" },
              { text: "y" },
              { text: "bancos." },
              { text: "Cero" },
              { text: "código.", highlight: true, color: "#facc15" },
              { text: "Listo" },
              { text: "en" },
              { text: "48h.", highlight: true, color: "#4ade80" },
            ]}
          />
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ESCENA 4: EL CONTRASTE & RETORNO (Frames 1020 - 1260 / 34s - 42s)
         ───────────────────────────────────────────────────────────── */}
      {frame >= 1020 && frame < 1260 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "160px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              marginBottom: 48,
              width: "100%",
              maxWidth: 820,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(0,212,255,0.15) 100%)",
                border: "1px solid rgba(167, 139, 250, 0.4)",
                borderRadius: 24,
                padding: "36px 40px",
                textAlign: "center",
                flex: 1,
              }}
            >
              <span style={{ fontSize: 64, fontWeight: 900, color: "#38bdf8", display: "block" }}>
                +42h
              </span>
              <p style={{ fontSize: 20, color: "#cbd5e1", marginTop: 8 }}>
                Ahorradas al mes por departamento
              </p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(13,148,136,0.15) 100%)",
                border: "1px solid rgba(74, 222, 128, 0.4)",
                borderRadius: 24,
                padding: "36px 40px",
                textAlign: "center",
                flex: 1,
              }}
            >
              <span style={{ fontSize: 64, fontWeight: 900, color: "#4ade80", display: "block" }}>
                1º mes
              </span>
              <p style={{ fontSize: 20, color: "#cbd5e1", marginTop: 8 }}>
                Retorno de inversión garantizado
              </p>
            </div>
          </div>

          <DynamicCaptions
            startFrame={1035}
            duration={210}
            words={[
              { text: "Ahorra" },
              { text: "tiempo." },
              { text: "Protege" },
              { text: "tus" },
              { text: "datos", highlight: true, color: CYAN },
              { text: "con" },
              { text: "IA" },
              { text: "soberana.", highlight: true, color: VIOLET },
            ]}
          />
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ESCENA 5: CIERRE CON LOGO OFICIAL & CTA (Frames 1260 - 1500 / 42s - 50s)
         ───────────────────────────────────────────────────────────── */}
      {frame >= 1260 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 40px",
          }}
        >
          {/* Logo oficial animado con escala spring */}
          <div
            style={{
              transform: `scale(${interpolate(
                spring({ frame: frame - 1260, fps, config: { damping: 15, stiffness: 180 } }),
                [0, 1],
                [0.7, 1.25]
              )})`,
              marginBottom: 44,
            }}
          >
            <PraxiaOfficialLogo size={160} glow={true} />
          </div>

          <h1
            style={{
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              margin: "0 0 14px",
              background: `linear-gradient(135deg, #ffffff 0%, ${CYAN} 60%, ${VIOLET} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            Praxia Labs
          </h1>

          <p
            style={{
              fontSize: 26,
              color: "#94a3b8",
              marginBottom: 50,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            Agentes de IA y Ciberseguridad para Empresas
          </p>

          {/* Botón CTA interactivo */}
          <div
            style={{
              background: `linear-gradient(90deg, ${VIOLET} 0%, #2563eb 100%)`,
              borderRadius: 20,
              padding: "22px 54px",
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
              boxShadow: "0 14px 40px rgba(124, 58, 237, 0.55)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              transform: `scale(${1 + Math.sin((frame - 1260) / 10) * 0.04})`,
            }}
          >
            <span>👉 Reserva tu demo de 15 min</span>
          </div>

          <p
            style={{
              marginTop: 26,
              fontFamily: "ui-monospace, monospace",
              fontSize: 24,
              color: CYAN,
              fontWeight: 700,
            }}
          >
            praxialabs.com
          </p>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
