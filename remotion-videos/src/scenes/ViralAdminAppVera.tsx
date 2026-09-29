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

const EMERALD = "#10b981";
const CYAN = "#06b6d4";
const AMBER = "#f59e0b";
const ROSE = "#f43f5e";
const BG_DARK = "#040d12";

// Logotipo / Icono AdminApp & VERA
const VeraIcon: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      position: "absolute",
      width: size * 1.3,
      height: size * 1.3,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(6,182,212,0.2) 60%, transparent 75%)",
      filter: "blur(22px)",
    }} />
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="veraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Icono edificio / nodo inteligente */}
      <rect x="22" y="32" width="26" height="48" rx="4" fill="url(#veraGrad)" stroke="#6ee7b7" strokeWidth="2.5" />
      <rect x="52" y="20" width="26" height="60" rx="4" fill="url(#veraGrad)" stroke="#6ee7b7" strokeWidth="2.5" />
      {/* Ventanas / leds de actividad */}
      <circle cx="35" cy="44" r="3" fill="#fff" />
      <circle cx="35" cy="56" r="3" fill="#fff" />
      <circle cx="35" cy="68" r="3" fill="#fff" />
      <circle cx="65" cy="32" r="3" fill="#fff" />
      <circle cx="65" cy="44" r="3" fill="#fff" />
      <circle cx="65" cy="56" r="3" fill="#fff" />
      <circle cx="65" cy="68" r="3" fill="#fff" />
      {/* Halo de IA */}
      <path d="M 50 8 L 53 14 L 60 14 L 54 18 L 56 25 L 50 20 L 44 25 L 46 18 L 40 14 L 47 14 Z" fill="#38bdf8" />
    </svg>
  </div>
);

export const ViralAdminAppVera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // FASES (900 frames / 30s a 30fps):
  // F1: 0 - 200 (Gancho: El infierno del Administrador de Fincas: 200 WhatsApps de vecinos un domingo)
  // F2: 200 - 450 (El coste: 30h semanales apagando fuegos y cuadrando derramas)
  // F3: 450 - 720 (La Solución: VERA IA autónoma + telemetría de comunidades)
  // F4: 720 - 900 (CTA Demo y Gestión sin fricción)

  const f1Opacity = interpolate(frame, [0, 20, 180, 205], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f2Opacity = interpolate(frame, [200, 225, 425, 450], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f3Opacity = interpolate(frame, [445, 470, 700, 725], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f4Opacity = interpolate(frame, [720, 745, 900], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const hookScale = spring({ frame, fps, config: { damping: 9, mass: 0.7 } });
  const ticketCount = Math.floor(interpolate(frame, [460, 580], [12, 184], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#f8fafc", overflow: "hidden" }}>
      <ParticleField count={45} color={EMERALD} />
      <RadialBloom color={EMERALD} size={850} />

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
          <VeraIcon size={40} />
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
            AdminApp <span style={{ color: EMERALD, fontSize: 18 }}>· IA VERA</span>
          </span>
        </div>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.4)",
          color: "#a7f3d0",
          fontSize: 15,
          fontWeight: 700,
        }}>
          ● Gestión Residencial 24/7
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
            🏢 El Dolor del Administrador
          </div>

          <h1 style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: "-0.03em",
          }}>
            ¿Tu domingo arruinado por <span style={{ color: ROSE }}>200 audios de WhatsApp</span> de vecinos?
          </h1>

          <div style={{
            width: "100%",
            maxWidth: 880,
            background: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(16,185,129,0.35)",
            borderRadius: 28,
            padding: 36,
            backdropFilter: "blur(16px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
              "La caldera gotea", "¿Quién autorizó la derrama?", "¿Cuándo abren la piscina?"
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: AMBER, marginTop: 12 }}>
              El 75% del tiempo de un administrador se va en apagar fuegos.
            </div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 16 }}>
              Llamadas a deshoras, actas perdidas en archivadores y facturas duplicadas de proveedores.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 2: LA COMPARATIVA DE MODELOS (200 - 450) */}
      {f2Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f2Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            Revolución Inmobiliaria PropTech
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 800, textAlign: "center", marginBottom: 36 }}>
            De Software de los 90 a IA Especializada
          </h2>

          <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 22,
              padding: 28,
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fca5a5" }}>❌ Los Programas Tradicionales (Gesfincas / Excel)</div>
              <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 8 }}>
                Solo almacenan datos. No atienden al vecino, no redactan partes de seguro y te obligan a picar incidencias a mano.
              </div>
            </div>

            <div style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 10px 30px rgba(16,185,129,0.15)",
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#6ee7b7" }}>⚡ AdminApp con Agente VERA</div>
              <div style={{ fontSize: 16, color: "#e2e8f0", marginTop: 8 }}>
                Entrenada con los estatutos de cada finca. Atiende por WhatsApp a los propietarios, coteja presupuestos y activa al fontanero en 30 segundos.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 3: DEMO CINEMÁTICA EN ACCIÓN (450 - 720) */}
      {f3Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f3Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          {/* Fondo cinemático con zoom Ken Burns */}
          <AbsoluteFill style={{ overflow: "hidden", zIndex: 0 }}>
            <Img
              src={staticFile("assets/adminapp-cinematic.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${1 + (frame - 450) * 0.0004})`,
                opacity: 0.42,
                filter: "brightness(0.6) contrast(1.2)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(4,13,18,0.45) 0%, rgba(4,13,18,0.92) 85%)" }} />
          </AbsoluteFill>

          <div style={{ zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: EMERALD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              ✨ Agente VERA en Directo
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>
              Resolución de Incidencias en &lt; 30 Segundos
            </h2>

            <div style={{
              width: "100%",
              maxWidth: 900,
              background: "rgba(3,10,14,0.88)",
              border: "1px solid rgba(16,185,129,0.35)",
              borderRadius: 24,
              padding: 32,
              backdropFilter: "blur(14px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: "#94a3b8", fontFamily: "monospace" }}>
                  VERA Smart Community · {ticketCount} consultas atendidas de forma autónoma
                </div>
                <div style={{ fontSize: 14, color: EMERALD, fontWeight: 700, fontFamily: "monospace" }}>
                  ● AGENTE ACTIVO
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", fontSize: 15 }}>
                <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#a7f3d0" }}>[WHATSAPP VECINO] Fuga de agua en Garaje -2</span>
                  <span style={{ color: EMERALD, fontWeight: 700 }}>PARTE AL SEGURO ENVIADO</span>
                </div>
                <div style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: CYAN }}>[CONSULTA ACTA] ¿Se permiten mascotas en terraza?</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>RESPUESTA ESTATUTARIA CORTÉS</span>
                </div>
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: AMBER }}>[DERRAMA ASCENSOR] 42/42 Recibos Cuadrados</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>0 ERRORES CONTABLES</span>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 4: CTA FINAL (720 - 900) */}
      {f4Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f4Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <VeraIcon size={130} />

          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 24, color: "#fff" }}>
            AdminApp <span style={{ color: EMERALD }}>· Praxia Labs</span>
          </div>

          <h2 style={{ fontSize: 44, fontWeight: 800, margin: "24px 0 16px", lineHeight: 1.2 }}>
            Gestiona 3 veces más comunidades sin duplicar equipo
          </h2>

          <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 720, marginBottom: 36 }}>
            Recupera tus fines de semana. Automatiza la atención vecinal con IA certificada.
          </p>

          <div style={{
            background: "linear-gradient(90deg, #10b981, #06b6d4)",
            padding: "20px 48px",
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            boxShadow: "0 15px 35px rgba(16,185,129,0.35)",
          }}>
            praxialabs.com/adminapp
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
        praxialabs.com · Inteligencia Artificial para Fincas y Comunidades
      </div>
    </AbsoluteFill>
  );
};
