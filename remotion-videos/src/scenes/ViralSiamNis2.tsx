import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { ParticleField, RadialBloom } from "../components/ParticleField";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const CYAN = "#00d4ff";
const GREEN = "#10b981";
const BG_DARK = "#05050f";

// Logotipo SIAM / Escudo ciberseguridad
const SiamShield: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      position: "absolute",
      width: size * 1.3,
      height: size * 1.3,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(244,63,94,0.4) 0%, rgba(0,212,255,0.2) 60%, transparent 75%)",
      filter: "blur(22px)",
    }} />
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
      </defs>
      <path
        d="M 50 10 L 85 24 C 85 60 50 88 50 88 C 50 88 15 60 15 24 Z"
        fill="url(#shieldGrad)"
        stroke="#fda4af"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="46" r="16" stroke="#fff" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M 50 36 L 50 48 L 58 52" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

export const ViralSiamNis2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // FASES (900 frames / 30s):
  // F1: 0 - 200 (Gancho: El 70% de ciberataques golpean a PYMEs + Alerta 3 AM)
  // F2: 200 - 450 (El dilema NIS2: reporte obligatorio en 24h vs coste de un SOC)
  // F3: 450 - 720 (SIAM en acción: WAF perimetral & Trampas Honeypot cazando atacantes)
  // F4: 720 - 900 (CTA y Diagnóstico de postura)

  const f1Opacity = interpolate(frame, [0, 20, 180, 205], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f2Opacity = interpolate(frame, [200, 225, 425, 450], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f3Opacity = interpolate(frame, [445, 470, 700, 725], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f4Opacity = interpolate(frame, [720, 745, 900], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const hookScale = spring({ frame, fps, config: { damping: 9, mass: 0.7 } });
  const blockedPackets = Math.floor(interpolate(frame, [460, 580], [120, 4829], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#f8fafc", overflow: "hidden" }}>
      <ParticleField count={45} color={ROSE} />
      <RadialBloom color={ROSE} size={850} />

      {/* Header fijo superior */}
      <div style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 60px",
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <SiamShield size={40} />
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
            SIAM <span style={{ color: ROSE, fontSize: 18 }}>· SOC Virtual</span>
          </span>
        </div>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          background: "rgba(244,63,94,0.15)",
          border: "1px solid rgba(244,63,94,0.4)",
          color: "#fda4af",
          fontSize: 15,
          fontWeight: 700,
        }}>
          ● Directiva NIS2 Activa
        </div>
      </div>

      {/* ESCENA 1: EL GANCHO (0 - 200) */}
      {f1Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f1Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <div style={{
            transform: `scale(${hookScale})`,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(244,63,94,0.2)",
            border: "1px solid rgba(244,63,94,0.5)",
            color: "#fecdd3",
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            🚨 INCIBE Alerta España
          </div>

          <h1 style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: "-0.03em",
          }}>
            El <span style={{ color: ROSE }}>70%</span> de los ciberataques caen sobre <span style={{ color: AMBER }}>PYMEs</span>
          </h1>

          <div style={{
            width: "100%",
            maxWidth: 880,
            background: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(244,63,94,0.35)",
            borderRadius: 28,
            padding: 36,
            backdropFilter: "blur(16px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
              Si te entra un ransomware un domingo a las 3:00 AM...
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: ROSE, marginTop: 12 }}>
              ¿Te enterarías antes del lunes por la mañana?
            </div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 16 }}>
              El 60% de empresas atacadas quiebran en menos de 6 meses tras el secuestro de datos.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 2: LA DIRECTIVA NIS2 (200 - 450) */}
      {f2Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f2Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            Cambio Legal 2026
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 800, textAlign: "center", marginBottom: 36 }}>
            La Directiva Europea NIS2 te obliga a responder en &lt; 24h
          </h2>

          <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 22,
              padding: 28,
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>El Problema del SOC Tradicional</div>
              <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 8 }}>
                Contratar analistas de ciberseguridad 24/7 cuesta más de <strong>3.500 € al mes</strong>. Inasumible para la mayoría de PYMEs.
              </div>
            </div>

            <div style={{
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.4)",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 10px 30px rgba(244,63,94,0.15)",
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fda4af" }}>La Solución: SIAM SOC Virtual con IA</div>
              <div style={{ fontSize: 16, color: "#e2e8f0", marginTop: 8 }}>
                Monitorización autónoma ininterrumpida. Cortafuegos WAF perimetral y señuelos Honeypot que cazan atacantes a una fracción del coste.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 3: TELEMETRÍA EN VIVO (450 - 720) */}
      {f3Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f3Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          {/* Fondo cinemático con zoom Ken Burns */}
          <AbsoluteFill style={{ overflow: "hidden", zIndex: 0 }}>
            <Img
              src={staticFile("assets/siam-cinematic.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${1 + (frame - 450) * 0.0004})`,
                opacity: 0.42,
                filter: "brightness(0.6) contrast(1.2)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(5,5,15,0.45) 0%, rgba(5,5,15,0.92) 85%)" }} />
          </AbsoluteFill>

          <div style={{ zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: ROSE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              🛡️ Escudo Perimetral Activo
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>
              Bloqueo en Tiempo Real &lt; 5 milisegundos
            </h2>

            <div style={{
              width: "100%",
              maxWidth: 900,
              background: "rgba(3,7,18,0.85)",
              border: "1px solid rgba(244,63,94,0.35)",
              borderRadius: 24,
              padding: 32,
              backdropFilter: "blur(14px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: "#94a3b8", fontFamily: "monospace" }}>
                  SIAM SOC Console · {blockedPackets} ataques neutralizados hoy
                </div>
                <div style={{ fontSize: 14, color: GREEN, fontWeight: 700, fontFamily: "monospace" }}>
                  ● WAF ACTIVO
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", fontSize: 15 }}>
                <div style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#fda4af" }}>[HONEYPOT] Intrusión SSH Detectada</span>
                  <span style={{ color: ROSE, fontWeight: 700 }}>IP 185.220.101.4 AISLADA</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>[WAF] Intento Inyección SQL</span>
                  <span style={{ color: GREEN, fontWeight: 700 }}>BLOQUEO EN 3.2 ms</span>
                </div>
                <div style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: CYAN }}>[NIS2] Trazabilidad Inmutable</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>AUDITORÍA GENERADA EN 24H</span>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 4: CTA (720 - 900) */}
      {f4Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f4Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <SiamShield size={130} />

          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 24, color: "#fff" }}>
            SIAM <span style={{ color: ROSE }}>· Praxia Labs</span>
          </div>

          <h2 style={{ fontSize: 44, fontWeight: 800, margin: "24px 0 16px", lineHeight: 1.2 }}>
            Audita la exposición de tu empresa en 15 minutos
          </h2>

          <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 700, marginBottom: 36 }}>
            Calculadora de riesgo NIS2 y demo en directo del panel de ataques sin coste.
          </p>

          <div style={{
            background: "linear-gradient(90deg, #f43f5e, #7c3aed)",
            padding: "20px 48px",
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            boxShadow: "0 15px 35px rgba(244,63,94,0.35)",
          }}>
            praxialabs.com/soc-virtual-pymes
          </div>
        </AbsoluteFill>
      )}

      {/* Footer fijo inferior */}
      <div style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 16,
        color: "#64748b",
        fontWeight: 600,
      }}>
        praxialabs.com · Ciberseguridad Activa y SOC Virtual
      </div>
    </AbsoluteFill>
  );
};
