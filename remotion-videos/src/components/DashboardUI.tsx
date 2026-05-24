import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

// Animated bar chart
export const BarChart: React.FC<{
  data: number[];
  color: string;
  startFrame: number;
  height?: number;
}> = ({ data, color, startFrame, height = 120 }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / 30));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((val, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: val * progress * height,
            backgroundColor: color,
            borderRadius: "3px 3px 0 0",
            opacity: 0.7 + (i / data.length) * 0.3,
          }}
        />
      ))}
    </div>
  );
};

// Animated number counter
export const CountUp: React.FC<{
  from: number;
  to: number;
  startFrame: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from, to, startFrame, duration = 45, prefix = "", suffix = "", style = {} }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / duration));
  const eased = 1 - Math.pow(1 - progress, 3);
  const value = Math.round(from + (to - from) * eased);

  return (
    <span style={style}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
};

// KPI Card
export const KPICard: React.FC<{
  title: string;
  value: string;
  change?: string;
  color: string;
  startFrame: number;
  index?: number;
}> = ({ title, value, change, color, startFrame, index = 0 }) => {
  const frame = useCurrentFrame();
  const delay = index * 8;
  const localFrame = Math.max(0, frame - startFrame - delay);
  const opacity = Math.min(1, localFrame / 20);
  const translateY = Math.max(0, 30 - localFrame * 1.5);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "#111113",
        border: `1px solid ${color}33`,
        borderRadius: 12,
        padding: "16px 20px",
        minWidth: 180,
        flex: 1,
      }}
    >
      <div style={{ color: "#888", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>
        {title}
      </div>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 700, fontFamily: "sans-serif" }}>
        {value}
      </div>
      {change && (
        <div style={{ color: color, fontSize: 12, marginTop: 4 }}>
          {change}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 3,
          height: "100%",
          background: color,
          borderRadius: "0 12px 12px 0",
        }}
      />
    </div>
  );
};

// Admin Dashboard Screen
export const AdminDashboardScreen: React.FC<{
  accent: string;
  startFrame: number;
}> = ({ accent, startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        opacity,
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Top nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: accent, opacity: 0.9 }} />
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>AdminApp Maestro</span>
        </div>
        <div
          style={{
            background: `${accent}22`,
            border: `1px solid ${accent}55`,
            borderRadius: 20,
            padding: "6px 14px",
            color: accent,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          VERA Copilot activo
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, position: "relative" }}>
        <KPICard title="UNIDADES ACTIVAS" value="247" change="+12% este mes" color={accent} startFrame={startFrame} index={0} />
        <KPICard title="OCUPACIÓN" value="94.2%" change="Historico máximo" color={accent} startFrame={startFrame} index={1} />
        <KPICard title="MOROSIDAD" value="2.1%" change="-0.8% vs Q3" color={accent} startFrame={startFrame} index={2} />
        <KPICard title="INGRESOS MES" value="€184K" change="+7.3% YoY" color={accent} startFrame={startFrame} index={3} />
      </div>

      {/* Chart + list area */}
      <div style={{ display: "flex", gap: 16 }}>
        <div
          style={{
            flex: 2,
            background: "#111113",
            border: `1px solid ${accent}22`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>OCUPACIÓN POR EDIFICIO</div>
          <BarChart
            data={[0.94, 0.88, 0.96, 0.91, 0.87, 0.99, 0.92, 0.85, 0.93]}
            color={accent}
            startFrame={startFrame}
            height={100}
          />
        </div>
        <div
          style={{
            flex: 1,
            background: "#111113",
            border: `1px solid ${accent}22`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>INCIDENCIAS RECIENTES</div>
          {["Ascensor Torre A - Revisar", "Limpieza Zona 3 - OK", "Reunión Propietarios - 15/12", "Pago atrasado - Apt 42B"].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px solid #222",
                color: "#ccc",
                fontSize: 12,
                opacity: Math.min(1, Math.max(0, (frame - startFrame - i * 5) / 15)),
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === 0 ? "#ef4444" : accent,
                  flexShrink: 0,
                }}
              />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// VERA Chat Screen
export const VeraChatScreen: React.FC<{
  accent: string;
  startFrame: number;
}> = ({ accent, startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));

  const messages = [
    { role: "user", text: "¿Cuántas unidades tienen pagos pendientes este mes?", delay: 0 },
    { role: "ai", text: "He detectado 8 unidades con pagos pendientes por un total de €12.400. Los perfiles de mayor riesgo son: Apt 42B (€2.100), Torre C-12 (€1.800)...", delay: 15 },
    { role: "user", text: "Genera un informe PDF para el consejo de propietarios", delay: 35 },
    { role: "ai", text: "Informe generado y enviado a todos los propietarios. Incluye análisis de morosidad, ocupación y proyección Q1 2026.", delay: 50 },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        opacity,
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent}, #818cf8)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          V
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 600 }}>VERA Copilot</div>
          <div style={{ color: "#22c55e", fontSize: 12 }}>● En línea</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
        {messages.map((msg, i) => {
          const vis = Math.min(1, Math.max(0, (frame - startFrame - msg.delay) / 15));
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                opacity: vis,
                transform: `translateY(${(1 - vis) * 15}px)`,
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  background: msg.role === "user" ? accent : "#1a1a2e",
                  border: msg.role === "ai" ? `1px solid ${accent}33` : "none",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "12px 16px",
                  color: "#fff",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// QUENTIN Maintenance Screen
export const QuentinScreen: React.FC<{
  accent: string;
  startFrame: number;
}> = ({ accent, startFrame }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - startFrame) / 20));

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
      <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>QUENTIN</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Mantenimiento Predictivo
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Health Score */}
        <div
          style={{
            flex: 1,
            background: "#111113",
            border: `1px solid ${accent}33`,
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
          }}
        >
          <div style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>SALUD INFRAESTRUCTURA</div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: accent,
              lineHeight: 1,
            }}
          >
            94
            <span style={{ fontSize: 24 }}>%</span>
          </div>
          <div style={{ color: "#22c55e", fontSize: 12, marginTop: 8 }}>Estado Excelente</div>
        </div>

        {/* Alerts */}
        <div style={{ flex: 2 }}>
          {[
            { item: "Ascensor Torre A", status: "ALERTA", color: "#ef4444", detail: "Revisión programada en 3 días" },
            { item: "Sistema HVAC Edificio B", status: "OK", color: "#22c55e", detail: "Último servicio: hace 2 semanas" },
            { item: "Generador Backup", status: "OK", color: "#22c55e", detail: "Prueba mensual completada" },
            { item: "Bombas Agua Torre C", status: "REVISAR", color: "#f59e0b", detail: "Presión ligeramente baja" },
          ].map((alert, i) => (
            <div
              key={i}
              style={{
                background: "#111113",
                border: `1px solid ${alert.color}33`,
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: Math.min(1, Math.max(0, (frame - startFrame - i * 8) / 15)),
              }}
            >
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{alert.item}</div>
                <div style={{ color: "#888", fontSize: 11 }}>{alert.detail}</div>
              </div>
              <div
                style={{
                  background: `${alert.color}22`,
                  border: `1px solid ${alert.color}55`,
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: alert.color,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {alert.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
