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

const VIOLET = "#7c3aed";
const CYAN = "#00d4ff";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const GREEN = "#10b981";
const BG_DARK = "#070714";

// Monograma oficial de Praxia Labs 3D
const PraxiaLogo: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      position: "absolute",
      width: size * 1.3,
      height: size * 1.3,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(0,212,255,0.2) 50%, transparent 70%)",
      filter: "blur(20px)",
    }} />
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="vfOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="vfInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <line x1="60" y1="12" x2="60" y2="108" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
      <path d="M 34 26 L 76 26 C 92 26 98 38 98 52 C 98 66 90 76 74 76 L 50 76 L 50 102 L 34 102 Z" fill="none" stroke="url(#vfOuter)" strokeWidth="7" strokeLinejoin="round" />
      <path d="M 48 42 L 72 42 C 80 42 84 48 84 54 C 84 60 80 66 72 66 L 48 66 Z" fill="none" stroke="url(#vfInner)" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  </div>
);

export const ViralFacturas2026: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // FASES (900 frames / 30s):
  // F1: 0 - 200 (Gancho y Dolor de Horas Perdidas + Verifactu)
  // F2: 200 - 450 (El fallo del OCR viejo vs Visión IA)
  // F3: 450 - 720 (Demostración en vivo en 3 segundos)
  // F4: 720 - 900 (CTA y Resultados auditados)

  // Opacidades de escenas con transiciones suaves
  const f1Opacity = interpolate(frame, [0, 20, 180, 205], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f2Opacity = interpolate(frame, [200, 225, 425, 450], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f3Opacity = interpolate(frame, [445, 470, 700, 725], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f4Opacity = interpolate(frame, [720, 745, 900], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Animaciones spring
  const hookPop = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const timerCount = Math.floor(interpolate(frame, [470, 560], [0, 318], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#f8fafc", overflow: "hidden" }}>
      <ParticleField count={45} color={VIOLET} />
      <RadialBloom color={frame > 450 ? CYAN : VIOLET} size={900} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

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
            Praxia<span style={{ color: CYAN }}>Labs</span>
          </span>
        </div>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          background: "rgba(16,185,129,0.12)",
          border: "1px solid rgba(16,185,129,0.3)",
          color: GREEN,
          fontSize: 15,
          fontWeight: 700,
        }}>
          ● Ley Crea y Crece 2026
        </div>
      </div>

      {/* ESCENA 1: EL GANCHO (0 - 200) */}
      {f1Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f1Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <div style={{
            transform: `scale(${hookPop})`,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.4)",
            color: "#fca5a5",
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            ⚠️ El Agujero de Tiempo en tu Empresa
          </div>

          <h1 style={{
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: "-0.03em",
          }}>
            ¿Sigues picando facturas a mano en <span style={{ color: AMBER }}>2026</span>?
          </h1>

          {/* Tarjeta de impacto con horas perdidas */}
          <div style={{
            width: "100%",
            maxWidth: 880,
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 28,
            padding: 36,
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: RED, lineHeight: 1 }}>
              -40 HORAS
            </div>
            <div style={{ fontSize: 22, color: "#cbd5e1", marginTop: 12, fontWeight: 600 }}>
              perdidas cada mes por persona en tu equipo contable
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 15, color: "#94a3b8" }}>Tecleo de NIFs y líneas</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginTop: 4 }}>20h / mes</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 15, color: "#94a3b8" }}>Cuadre de IVA y cierres</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginTop: 4 }}>20h / mes</div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 2: OCR TRADICIONAL VS VISIÓN IA (200 - 450) */}
      {f2Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f2Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            Por qué falló el OCR tradicional
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 800, textAlign: "center", marginBottom: 36 }}>
            El OCR viejo se rompe si cambia el diseño
          </h2>

          <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Tarjeta mala */}
            <div style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 22,
              padding: 28,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}>
              <div style={{ fontSize: 40, width: 70, height: 70, borderRadius: 18, background: "rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ❌
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fca5a5" }}>OCR Clásico por Coordenadas</div>
                <div style={{ fontSize: 16, color: "#cbd5e1", marginTop: 6 }}>
                  Exige configurar plantillas fijas. Si el proveedor cambia el logo o la tabla, da error y exige revisión manual.
                </div>
              </div>
            </div>

            {/* Tarjeta buena */}
            <div style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.35)",
              borderRadius: 22,
              padding: 28,
              display: "flex",
              alignItems: "center",
              gap: 24,
              boxShadow: "0 10px 30px rgba(0,212,255,0.15)",
            }}>
              <div style={{ fontSize: 40, width: 70, height: 70, borderRadius: 18, background: "rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ⚡
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: CYAN }}>Agente Multimodal Praxia Labs</div>
                <div style={{ fontSize: 16, color: "#cbd5e1", marginTop: 6 }}>
                  Comprende el documento como un humano: lee PDFs, fotos o albaranes arrugados sin importar el formato.
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 3: DEMO EN VIVO EN 3 SEGUNDOS (450 - 720) */}
      {f3Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f3Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
          {/* Fondo cinemático con zoom sutil */}
          <AbsoluteFill style={{ overflow: "hidden", zIndex: 0 }}>
            <Img
              src={staticFile("assets/coreops-cinematic.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${1 + (frame - 450) * 0.0004})`,
                opacity: 0.45,
                filter: "brightness(0.65) contrast(1.15)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(7,7,20,0.5) 0%, rgba(7,7,20,0.92) 80%)" }} />
          </AbsoluteFill>

          <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              ✓ En Producción
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>
              De PDF a tu ERP en <span style={{ color: CYAN }}>&lt; 3 Segundos</span>
            </h2>

            {/* Consola de extracción simulada */}
            <div style={{
              width: "100%",
              maxWidth: 900,
              background: "rgba(3,7,18,0.85)",
              border: "1px solid rgba(0,212,255,0.3)",
              backdropFilter: "blur(14px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.9)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8", fontFamily: "monospace" }}>
                  core_ops_pipeline.py · {timerCount} facturas procesadas
                </div>
              </div>

              {/* Datos extraídos */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", fontSize: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "12px 18px", borderRadius: 10 }}>
                <span style={{ color: "#94a3b8" }}>EMISOR:</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>Logística & Distribución Ibérica S.L.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "12px 18px", borderRadius: 10 }}>
                <span style={{ color: "#94a3b8" }}>NIF / CIF:</span>
                <span style={{ color: GREEN, fontWeight: 700 }}>B-87654321 ✓ Validado VIES</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "12px 18px", borderRadius: 10 }}>
                <span style={{ color: "#94a3b8" }}>BASE IMPONIBLE:</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>4.820,50 € (IVA 21%: 1.012,30 €)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", padding: "12px 18px", borderRadius: 10 }}>
                <span style={{ color: GREEN }}>ESTADO ASIENTO:</span>
                <span style={{ color: GREEN, fontWeight: 800 }}>VOLCADO A ERP · CUADRE 100% OK</span>
              </div>
            </div>
          </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA 4: OUTRO Y CTA (720 - 900) */}
      {f4Opacity > 0 && (
        <AbsoluteFill style={{ opacity: f4Opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 50px", textAlign: "center" }}>
          <PraxiaLogo size={130} />

          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 24, color: "#fff" }}>
            Praxia<span style={{ color: CYAN }}>Labs</span>
          </div>

          <h2 style={{ fontSize: 44, fontWeight: 800, margin: "24px 0 16px", lineHeight: 1.2 }}>
            Pruébalo gratis con las facturas reales de tus proveedores
          </h2>

          <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 700, marginBottom: 36 }}>
            Diagnóstico de viabilidad en 15 minutos. Sin cambiar tu programa contable ni migraciones complejas.
          </p>

          <div style={{
            background: "linear-gradient(90deg, #7c3aed, #00d4ff)",
            padding: "20px 48px",
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            boxShadow: "0 15px 35px rgba(0,212,255,0.35)",
            letterSpacing: "-0.01em",
          }}>
            praxialabs.com/automatizar-facturas-ia
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
        praxialabs.com · Agentes Autónomos e IA Soberana
      </div>
    </AbsoluteFill>
  );
};
