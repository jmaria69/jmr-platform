import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Imagen OG genérica para landings de producto (SIAM, Core OPS, AdminApp...).
 * Reutiliza la paleta oscura de la marca pero acentuada con `color`, para que
 * cada producto se distinga al compartirse en redes o citarse por un agente.
 */
export function renderProductOgImage({
  nombre,
  badge,
  bajada,
  color,
  path,
}: {
  nombre: string;
  badge: string;
  bajada: string;
  color: string;
  path: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#060612",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
          padding: "80px 90px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: `linear-gradient(90deg, ${color} 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-160px",
            width: "620px",
            height: "620px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
            padding: "8px 20px",
            borderRadius: "22px",
            border: `1.2px solid ${color}55`,
            background: `${color}18`,
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 10px 3px ${color}aa`,
            }}
          />
          <span style={{ color, fontSize: "16px", fontWeight: 700, letterSpacing: "2px" }}>
            {badge.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            fontSize: "88px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.02,
            letterSpacing: "-3px",
            marginBottom: "24px",
          }}
        >
          {nombre}
        </div>

        <div
          style={{
            fontSize: "26px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "980px",
            marginBottom: "40px",
          }}
        >
          {bajada}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 22px",
            borderRadius: "10px",
            border: `1.2px solid ${color}55`,
            background: `${color}14`,
            width: "fit-content",
          }}
        >
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1.5px solid ${color}` }} />
          <span style={{ color, fontSize: "18px", fontWeight: 600 }}>praxialabs.com{path}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
