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

const VIOLET = "#a855f7";
const CYAN = "#00d4ff";
const EMERALD = "#10b981";
const BG_DARK = "#050510";

// Logotipo Praxia Labs Cuántico
const PraxiaLogo: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      position: "absolute",
      width: size * 1.4,
      height: size * 1.4,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(0,212,255,0.2) 60%, transparent 75%)",
      filter: "blur(24px)",
    }} />
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="praxiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke="url(#praxiaGrad)" strokeWidth="4" />
      <polygon points="50,22 75,68 25,68" stroke="#fff" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="50" cy="50" r="7" fill="#00d4ff" />
    </svg>
  </div>
);

export const ViralPraxiaLabsBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // FASES (900 frames / 30s):
  // F1: 0 - 200 (Gancho: El 92% de las empresas españolas no tienen IA real en su operativa)
  // F2: 200 - 450 (El Ecosistema: CoreOps + SIAM + AdminApp)
  // F3: 450 - 720 (Soberanía y Seguridad: Modelos en local, Air-Gap, RGPD estricto)
  // F4: 720 - 900 (CTA Demo corporativa y diagnóstico de madurez de IA)

  const f1Opacity = interpolate(frame, [0, 20, 180, 205], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f2Opacity = interpolate(frame, [200, 225, 425, 450], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f3Opacity = interpolate(frame, [445, 470, 700, 725], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f4Opacity = interpolate(frame, [720, 745, 900], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const hookScale = spring({ frame, fps, config: { damping: 9, mass: 0.7 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#f8fafc", overflow: "hidden" }}>
      <ParticleField count={45} color={VIOLET} />
      <RadialBloom color={VIOLET} size={850} />

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
          <PraxiaLogo size={42} />
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
            PRAXIA LABS <span style={{ color: VIOLET, fontSize: 18 }}>· IA Soberana</span>
          </span>
        </div>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          background: "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.4)",
          color: "#e9d5ff",
          fontSize: 15,
          fontWeight: 700,
        }}>
          ● Inteligencia Operativa B2B
        </div>
      </div>

      {/* ESCENA 1: EL GANCHO (0 - 200) */}
      {f1Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f1Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <div style={{
            transform: `scale(${hookScale})`,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(168,85,247,0.2)",
            border: "1px solid rgba(168,85,247,0.5)",
            color: "#e9d5ff",
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            ⚡ La Brecha de la IA en España
          </div>

          <h1 style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: "-0.03em",
          }}>
            Todo el mundo habla de IA, pero <span style={{ color: VIOLET }}>el 92% de empresas</span> no la aplican en su operativa real
          </h1>

          <div style={{
            width: "100%",
            maxWidth: 880,
            background: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(168,85,247,0.35)",
            borderRadius: 28,
            padding: 36,
            backdropFilter: "blur(16px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
              No necesitas "juguetes de chat". Necesitas agentes que ejecuten trabajo crítico.
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: CYAN, marginTop: 12 }}>
              Facturas, Ciberdefensa y Gestión sin errores.
            </div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 16 }}>
              Ahorra cientos de horas hombre cada mes con infraestructura local y soberana.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 2: LA TRÍADA DE APLICACIONES (200 - 450) */}
      {f2Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f2Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            Ecosistema de Soluciones Praxia Labs
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 800, textAlign: "center", marginBottom: 36 }}>
            Tres Motores de IA para Dominar tu Operativa
          </h2>

          <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.3)",
              borderRadius: 20,
              padding: 22,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              <div style={{ fontSize: 32 }}>🧾</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: CYAN }}>CoreOps · Facturación Inteligente & Verifactu</div>
                <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 4 }}>Extracción neural de albaranes y facturas en 3 segundos con cotejo contable automático.</div>
              </div>
            </div>

            <div style={{
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.3)",
              borderRadius: 20,
              padding: 22,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              <div style={{ fontSize: 32 }}>🛡️</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fda4af" }}>SIAM · SOC Virtual 24/7 & Directiva NIS2</div>
                <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 4 }}>Defensa perimetral autónoma, bloqueo de ransomware y auditoría legal en 24h.</div>
              </div>
            </div>

            <div style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 20,
              padding: 22,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              <div style={{ fontSize: 32 }}>🏢</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#6ee7b7" }}>AdminApp & VERA · PropTech para Fincas</div>
                <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 4 }}>Atención 24/7 a propietarios por WhatsApp y despacho automático de incidencias y derramas.</div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 3: DEMO CINEMÁTICA Y SOBERANÍA (450 - 720) */}
      {f3Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f3Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          {/* Fondo cinemático con zoom Ken Burns */}
          <AbsoluteFill style={{ overflow: "hidden", zIndex: 0 }}>
            <Img
              src={staticFile("assets/praxialabs-cinematic.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${1 + (frame - 450) * 0.0004})`,
                opacity: 0.42,
                filter: "brightness(0.6) contrast(1.2)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(5,5,16,0.45) 0%, rgba(5,5,16,0.92) 85%)" }} />
          </AbsoluteFill>

          <div style={{ zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: VIOLET, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              🔒 IA Soberana y Segura
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>
              Tus Datos Nunca Salen de tu Control
            </h2>

            <div style={{
              width: "100%",
              maxWidth: 900,
              background: "rgba(7,10,24,0.88)",
              border: "1px solid rgba(168,85,247,0.35)",
              borderRadius: 24,
              padding: 32,
              backdropFilter: "blur(14px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: "#94a3b8", fontFamily: "monospace" }}>
                  Praxia Neural Core · Despliegue Híbrido & Air-Gap
                </div>
                <div style={{ fontSize: 14, color: CYAN, fontWeight: 700, fontFamily: "monospace" }}>
                  ● 100% RGPD COMPLIANT
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", fontSize: 15 }}>
                <div style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#e9d5ff" }}>[PRIVACIDAD] Modelos LLM Locales / On-Premise</span>
                  <span style={{ color: VIOLET, fontWeight: 700 }}>SIN FUGAS A TERCEROS</span>
                </div>
                <div style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: CYAN }}>[INTEGRACIÓN] APIs REST, ERPs (SAP, Navision, Holded)</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>SINCRONIZACIÓN INMEDIATA</span>
                </div>
                <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", padding: "12px 18px", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: EMERALD }}>[ROI VERIFICADO] Reducción de costes operativos</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>-70% HORAS MANUALES</span>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 4: CTA FINAL (720 - 900) */}
      {f4Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f4Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <PraxiaLogo size={130} />

          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 24, color: "#fff" }}>
            PRAXIA LABS <span style={{ color: VIOLET }}>· España</span>
          </div>

          <h2 style={{ fontSize: 44, fontWeight: 800, margin: "24px 0 16px", lineHeight: 1.2 }}>
            Lleva tu empresa al estándar operativo de 2026
          </h2>

          <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 720, marginBottom: 36 }}>
            Agenda una sesión de demostración técnica personalizada con nuestro equipo de ingenieros.
          </p>

          <div style={{
            background: "linear-gradient(90deg, #a855f7, #00d4ff)",
            padding: "20px 48px",
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            boxShadow: "0 15px 35px rgba(168,85,247,0.35)",
          }}>
            praxialabs.com/demo
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
        praxialabs.com · Inteligencia Artificial y Ciberseguridad Aplicada
      </div>
    </AbsoluteFill>
  );
};
