import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Praxia Labs — Automatizacion con IA para empresas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#060612",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Top accent bar ── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "700px", height: "3px",
          background: "linear-gradient(90deg, #7c3aed 0%, #00d4ff 45%, #06ffa5 70%, transparent 100%)",
        }} />

        {/* ── Background color blobs ── */}
        <div style={{
          position: "absolute", top: "-100px", left: "-60px",
          width: "680px", height: "680px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,17,114,0.7) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-120px", right: "-60px",
          width: "560px", height: "560px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,61,92,0.6) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "-80px", right: "100px",
          width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,51,37,0.4) 0%, transparent 70%)",
        }} />

        {/* ── Vertical separator ── */}
        <div style={{
          position: "absolute", top: "40px", left: "510px",
          width: "1px", height: "550px",
          background: "rgba(255,255,255,0.05)",
        }} />

        {/* ══ LEFT: Atom ══ */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, width: "510px", height: "630px", position: "relative",
        }}>
          {/* Atom ambient halo */}
          <div style={{
            position: "absolute",
            width: "420px", height: "420px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(88,28,135,0.55) 0%, transparent 70%)",
            boxShadow: "0 0 120px 60px rgba(88,28,135,0.3)",
          }} />

          <div style={{ position: "relative", width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Ring 1: violet, horizontal */}
            <div style={{
              position: "absolute",
              width: "280px", height: "88px", borderRadius: "50%",
              border: "4.5px solid rgba(167,139,250,0.9)",
              boxShadow: "0 0 22px 6px rgba(124,58,237,0.75), inset 0 0 12px rgba(124,58,237,0.35)",
            }} />
            <div style={{
              position: "absolute",
              width: "280px", height: "88px", borderRadius: "50%",
              border: "1px solid rgba(233,213,255,0.3)",
            }} />

            {/* Ring 2: cyan, 60° */}
            <div style={{
              position: "absolute",
              width: "280px", height: "88px", borderRadius: "50%",
              border: "4.5px solid rgba(56,189,248,0.9)",
              boxShadow: "0 0 22px 6px rgba(0,212,255,0.75), inset 0 0 12px rgba(0,212,255,0.35)",
              transform: "rotate(60deg)",
            }} />
            <div style={{
              position: "absolute",
              width: "280px", height: "88px", borderRadius: "50%",
              border: "1px solid rgba(186,230,253,0.3)",
              transform: "rotate(60deg)",
            }} />

            {/* Ring 3: teal, 120° */}
            <div style={{
              position: "absolute",
              width: "280px", height: "88px", borderRadius: "50%",
              border: "4.5px solid rgba(45,212,191,0.9)",
              boxShadow: "0 0 22px 6px rgba(6,255,165,0.65), inset 0 0 12px rgba(6,255,165,0.25)",
              transform: "rotate(120deg)",
            }} />
            <div style={{
              position: "absolute",
              width: "280px", height: "88px", borderRadius: "50%",
              border: "1px solid rgba(153,246,228,0.3)",
              transform: "rotate(120deg)",
            }} />

            {/* Electrons */}
            {/* Violet: top (large) */}
            <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", width: "18px", height: "18px", borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 16px 5px rgba(124,58,237,0.95)" }} />
            <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
            {/* Violet: bottom (small) */}
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", width: "13px", height: "13px", borderRadius: "50%", background: "#c4b5fd", boxShadow: "0 0 10px 3px rgba(124,58,237,0.7)", opacity: 0.85 }} />

            {/* Cyan: right (large) */}
            <div style={{ position: "absolute", top: "44px", right: "6px", width: "18px", height: "18px", borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 16px 5px rgba(0,212,255,0.95)" }} />
            <div style={{ position: "absolute", top: "49px", right: "11px", width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
            {/* Cyan: left (small) */}
            <div style={{ position: "absolute", bottom: "48px", left: "6px", width: "13px", height: "13px", borderRadius: "50%", background: "#7dd3fc", boxShadow: "0 0 10px 3px rgba(0,212,255,0.7)", opacity: 0.85 }} />

            {/* Teal: left (large) */}
            <div style={{ position: "absolute", top: "44px", left: "6px", width: "18px", height: "18px", borderRadius: "50%", background: "#2dd4bf", boxShadow: "0 0 16px 5px rgba(6,255,165,0.95)" }} />
            <div style={{ position: "absolute", top: "49px", left: "11px", width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
            {/* Teal: right (small) */}
            <div style={{ position: "absolute", bottom: "48px", right: "6px", width: "13px", height: "13px", borderRadius: "50%", background: "#5eead4", boxShadow: "0 0 10px 3px rgba(6,255,165,0.7)", opacity: 0.85 }} />

            {/* Nucleus outer glow */}
            <div style={{
              position: "absolute",
              width: "100px", height: "100px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,212,255,0.35) 0%, transparent 70%)",
              boxShadow: "0 0 50px 25px rgba(0,212,255,0.25)",
            }} />
            {/* Nucleus main sphere */}
            <div style={{
              position: "absolute",
              width: "60px", height: "60px", borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #7dd3fc 25%, #2563eb 60%, #1e3a8a 100%)",
              boxShadow: "0 0 32px 14px rgba(0,212,255,0.65), 0 0 64px 24px rgba(0,212,255,0.3)",
              border: "1.5px solid rgba(125,211,252,0.5)",
            }} />
            {/* Specular highlight */}
            <div style={{
              position: "absolute",
              width: "16px", height: "16px", borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              marginLeft: "-10px", marginTop: "-10px",
            }} />
          </div>
        </div>

        {/* ══ RIGHT: Text column ══ */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          flex: 1, paddingLeft: "48px", paddingRight: "60px",
        }}>
          {/* Tag pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "22px",
            padding: "8px 20px", borderRadius: "22px",
            border: "1.2px solid rgba(167,139,250,0.35)",
            background: "rgba(124,58,237,0.1)",
            width: "fit-content",
          }}>
            <div style={{
              width: "9px", height: "9px", borderRadius: "50%",
              background: "#06ffa5",
              boxShadow: "0 0 10px 3px rgba(6,255,165,0.8)",
            }} />
            <span style={{ color: "#c4b5fd", fontSize: "15px", fontWeight: 700, letterSpacing: "2.5px" }}>
              AGENTES IA · ESPAÑA
            </span>
          </div>

          {/* Main title */}
          <div style={{
            fontSize: "96px", fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.02, letterSpacing: "-3.5px",
            marginBottom: "18px",
          }}>
            Praxia Labs
          </div>

          {/* Tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "32px" }}>
            <div style={{ fontSize: "24px", color: "#94a3b8", letterSpacing: "-0.2px" }}>
              Automatiza los procesos manuales de tu empresa
            </div>
            <div style={{ fontSize: "24px", color: "#64748b", letterSpacing: "-0.2px", display: "flex", gap: "6px" }}>
              <span>con agentes IA — sin código, operativo en</span>
              <span style={{ color: "#2dd4bf", fontWeight: 700 }}>&lt;48h.</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: "480px", height: "2px",
            background: "linear-gradient(90deg, #7c3aed 0%, #00d4ff 50%, transparent 100%)",
            marginBottom: "28px",
          }} />

          {/* Stat cards */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "32px" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: "138px", height: "80px", borderRadius: "12px",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(167,139,250,0.22)",
            }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#a78bfa", lineHeight: 1 }}>8+</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", letterSpacing: "1.5px", marginTop: "4px" }}>AGENTES</div>
            </div>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: "152px", height: "80px", borderRadius: "12px",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(56,189,248,0.22)",
            }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#38bdf8", lineHeight: 1 }}>40h+</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0ea5e9", letterSpacing: "1.5px", marginTop: "4px" }}>AHORRO/MES</div>
            </div>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: "148px", height: "80px", borderRadius: "12px",
              background: "rgba(6,255,165,0.07)",
              border: "1px solid rgba(45,212,191,0.22)",
            }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#2dd4bf", lineHeight: 1 }}>&lt;48h</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488", letterSpacing: "1.5px", marginTop: "4px" }}>ARRANQUE</div>
            </div>
          </div>

          {/* URL badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 22px", borderRadius: "10px",
            border: "1.2px solid rgba(124,58,237,0.3)",
            background: "rgba(124,58,237,0.08)",
            width: "fit-content",
          }}>
            <div style={{
              width: "16px", height: "16px", borderRadius: "50%",
              border: "1.5px solid rgba(124,58,237,0.7)",
            }} />
            <span style={{ color: "#a78bfa", fontSize: "17px", fontWeight: 600 }}>praxialabs.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
