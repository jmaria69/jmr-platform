"use client";

import { useState } from "react";
import { Globe, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "bot_blocked" | "rate_limited" | "invalid_token" | "brute_force" | "suspicious";
type Severity = "low" | "medium" | "high" | "critical";

interface AttackPoint {
    id: string;
    ip: string;
    lat: number;
    lon: number;
    country: string;
    city: string;
    type: EventType;
    severity: Severity;
    details: string;
    resolved: boolean;
    timestamp: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<Severity, string> = {
    low: "#eab308",
    medium: "#f97316",
    high: "#ef4444",
    critical: "#dc2626",
};

const SEVERITY_LABELS: Record<Severity, string> = {
    low: "BAJA",
    medium: "MEDIA",
    high: "ALTA",
    critical: "CRÍTICA",
};

const TYPE_LABELS: Record<EventType, string> = {
    bot_blocked: "Bot bloqueado",
    rate_limited: "Rate limit",
    invalid_token: "Token JWT inválido",
    brute_force: "Ataque fuerza bruta",
    suspicious: "Actividad sospechosa",
};

// ─── Attack data con coordenadas geográficas reales ───────────────────────────

const ATTACKS: AttackPoint[] = [
    {
        id: "demo-1", ip: "185.220.101.47",
        lat: 55.75, lon: 37.61,
        country: "Rusia", city: "Moscú",
        type: "brute_force", severity: "critical",
        details: "23 intentos de login fallidos en 90 seg. desde la misma IP",
        resolved: false, timestamp: "2026-06-09T00:06:00.000Z",
    },
    {
        id: "demo-2", ip: "66.249.66.194",
        lat: 37.36, lon: -122.06,
        country: "EE.UU.", city: "Mountain View (Google)",
        type: "bot_blocked", severity: "low",
        details: "Googlebot accedió a ruta de API privada — bloqueado HTTP 403",
        resolved: true, timestamp: "2026-06-09T00:01:00.000Z",
    },
    {
        id: "demo-3", ip: "91.108.56.11",
        lat: 52.37, lon: 4.90,
        country: "Países Bajos", city: "Ámsterdam",
        type: "invalid_token", severity: "high",
        details: "Token JWT manipulado — firma inválida, posible session hijacking",
        resolved: false, timestamp: "2026-06-08T23:54:00.000Z",
    },
    {
        id: "demo-4", ip: "103.21.244.0",
        lat: 1.29, lon: 103.85,
        country: "Singapur", city: "Singapur",
        type: "rate_limited", severity: "high",
        details: "IP bloqueada 15 min. — 10+ req/min en endpoint de login",
        resolved: false, timestamp: "2026-06-08T23:47:00.000Z",
    },
    {
        id: "demo-5", ip: "45.155.205.233",
        lat: 52.52, lon: 13.40,
        country: "Alemania", city: "Berlín",
        type: "suspicious", severity: "medium",
        details: "Acceso a /admin/credenciales desde IP con historial de abuso",
        resolved: false, timestamp: "2026-06-08T23:35:00.000Z",
    },
    {
        id: "demo-6", ip: "52.167.144.195",
        lat: 47.60, lon: -122.33,
        country: "EE.UU.", city: "Seattle (Azure)",
        type: "bot_blocked", severity: "low",
        details: "BingBot en recursos estáticos — monitorizado sin acción",
        resolved: true, timestamp: "2026-06-08T23:22:00.000Z",
    },
    {
        id: "demo-7", ip: "178.62.252.190",
        lat: 51.51, lon: -0.13,
        country: "Reino Unido", city: "Londres",
        type: "invalid_token", severity: "medium",
        details: "Token expirado reutilizado — posible replay attack",
        resolved: true, timestamp: "2026-06-08T23:09:00.000Z",
    },
    {
        id: "demo-8", ip: "194.165.16.11",
        lat: 52.09, lon: 5.12,
        country: "Países Bajos", city: "Utrecht",
        type: "brute_force", severity: "critical",
        details: "Hydra v9.4 detectada — 47 intentos en 2 minutos",
        resolved: true, timestamp: "2026-06-08T22:54:00.000Z",
    },
    {
        id: "demo-9", ip: "185.156.73.14",
        lat: 59.33, lon: 18.07,
        country: "Suecia", city: "Estocolmo",
        type: "suspicious", severity: "medium",
        details: "Fingerprinting de rutas admin — posible OSINT automatizado",
        resolved: false, timestamp: "2026-06-08T22:39:00.000Z",
    },
    {
        id: "demo-10", ip: "159.89.49.254",
        lat: 53.55, lon: 9.99,
        country: "Alemania", city: "Hamburgo",
        type: "rate_limited", severity: "low",
        details: "Script Go intentando exfiltrar contactos del CRM",
        resolved: true, timestamp: "2026-06-08T22:19:00.000Z",
    },
];

// Nuestro servidor: Madrid
const TARGET = { lat: 40.42, lon: -3.70, label: "Servidor — Madrid, ES" };

// ─── Proyección Mercator (800×400 viewBox, lat -60°..80°) ─────────────────────

const SVG_W = 800;
const SVG_H = 400;

function toMerc(deg: number): number {
    return Math.log(Math.tan(Math.PI / 4 + (deg * Math.PI) / 360));
}
const MERC_MAX = toMerc(80);
const MERC_MIN = toMerc(-60);

function project(lat: number, lon: number) {
    const x = ((lon + 180) / 360) * SVG_W;
    const y = ((MERC_MAX - toMerc(lat)) / (MERC_MAX - MERC_MIN)) * SVG_H;
    return { x, y };
}

// ─── Calcula la longitud aproximada de una línea entre dos puntos ────────────

function lineLen(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DemoThreatMap() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const targetPos = project(TARGET.lat, TARGET.lon);
    const points = ATTACKS.map((a) => ({ ...a, pos: project(a.lat, a.lon) }));
    const hovered = hoveredId ? points.find((p) => p.id === hoveredId) ?? null : null;

    const activeCount = ATTACKS.filter((a) => !a.resolved).length;
    const resolvedCount = ATTACKS.filter((a) => a.resolved).length;

    return (
        <Card className="rounded-2xl glass border-gradient overflow-hidden mt-4">
            <style>{`
                @keyframes dash-flow {
                    from { stroke-dashoffset: 1200; }
                    to   { stroke-dashoffset: 0; }
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    60%  { transform: scale(2.4); opacity: 0; }
                    100% { transform: scale(2.4); opacity: 0; }
                }
                @keyframes dot-moving {
                    0%   { offset-distance: 0%;   opacity: 1; }
                    95%  { offset-distance: 100%; opacity: 1; }
                    100% { offset-distance: 100%; opacity: 0; }
                }
                .attack-line {
                    stroke-dasharray: 8 6;
                    stroke-dashoffset: 1200;
                    animation: dash-flow 2.8s ease-in-out infinite;
                }
                .pulse-ring {
                    transform-box: fill-box;
                    transform-origin: center;
                    animation: pulse-ring 2s ease-out infinite;
                }
            `}</style>

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base">Mapa de amenazas en tiempo real</CardTitle>
                        <Badge variant="outline" className="text-red-400 border-red-500/40 text-xs animate-pulse">
                            🔴 SIMULACIÓN
                        </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {activeCount} activos · {resolvedCount} resueltos
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-0 px-4 pb-4">
                {/* SVG Container */}
                <div
                    className="relative w-full rounded-xl overflow-hidden border border-slate-800"
                    style={{ aspectRatio: "800/400" }}
                >
                    <svg
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        className="w-full h-full block"
                        style={{ background: "linear-gradient(to bottom, #040d1a, #060e24)" }}
                    >
                        {/* ── Grid lines ── */}
                        <g stroke="#0f1e3a" strokeWidth="0.5">
                            {[0, 100, 200, 300, 400, 500, 600, 700, 800].map(x => (
                                <line key={x} x1={x} y1={0} x2={x} y2={400} />
                            ))}
                            {[0, 80, 160, 240, 320, 400].map(y => (
                                <line key={y} x1={0} y1={y} x2={800} y2={y} />
                            ))}
                        </g>

                        {/* ── World map (continentes simplificados en proyección Mercator) ── */}
                        <g fill="#111e35" stroke="#1e3a5f" strokeWidth="0.8" opacity="0.9">
                            {/* Norteamérica */}
                            <path d="M80,65 C118,52 175,48 225,60 L260,80 L282,112 L285,148 L273,185 L253,212 L222,222 L193,215 L160,200 L130,176 L100,150 L78,120 L73,92 Z" />
                            {/* Groenlandia */}
                            <path d="M295,28 L348,20 L368,35 L358,57 L328,64 L298,50 Z" />
                            {/* Sudamérica */}
                            <path d="M190,222 L258,215 L288,237 L298,272 L292,312 L272,358 L246,380 L218,374 L202,346 L192,302 L182,256 L185,234 Z" />
                            {/* Europa */}
                            <path d="M376,108 L413,93 L448,96 L472,108 L478,124 L470,140 L448,152 L420,157 L393,152 L374,138 L370,122 Z" />
                            {/* Escandinavia */}
                            <path d="M408,70 L446,60 L464,78 L456,102 L430,108 L412,95 Z" />
                            {/* Islandia */}
                            <path d="M350,72 L372,66 L378,78 L365,86 L350,82 Z" />
                            {/* UK */}
                            <path d="M372,115 L384,106 L392,118 L383,132 L371,126 Z" />
                            {/* Irlanda */}
                            <path d="M362,120 L372,115 L373,128 L364,132 Z" />
                            {/* África */}
                            <path d="M372,162 L495,156 L522,182 L532,222 L526,272 L510,328 L478,370 L445,377 L412,370 L392,340 L380,294 L372,240 L370,196 Z" />
                            {/* Oriente Medio */}
                            <path d="M492,142 L550,138 L562,158 L554,178 L522,182 L494,166 Z" />
                            {/* Asia (masa principal) */}
                            <path d="M490,66 L628,46 L728,54 L784,74 L792,110 L778,148 L748,180 L708,202 L668,216 L620,224 L570,214 L534,196 L508,174 L490,148 L482,114 L484,82 Z" />
                            {/* India */}
                            <path d="M556,178 L608,174 L628,190 L630,220 L618,250 L592,268 L566,260 L548,234 L543,202 Z" />
                            {/* Sudeste asiático */}
                            <path d="M630,200 L708,196 L728,216 L720,244 L692,256 L658,250 L636,228 Z" />
                            {/* Japón */}
                            <path d="M742,100 L770,92 L780,108 L762,134 L744,128 Z" />
                            {/* Corea */}
                            <path d="M722,112 L738,108 L742,120 L730,130 L720,124 Z" />
                            {/* Australia */}
                            <path d="M636,274 L764,268 L788,294 L784,342 L752,374 L704,384 L658,372 L636,342 L628,308 Z" />
                            {/* Nueva Zelanda (simplificada) */}
                            <path d="M790,342 L800,335 L800,365 L792,368 Z" />
                            {/* Madagascar */}
                            <path d="M518,266 L528,260 L532,280 L524,300 L516,295 Z" />
                        </g>

                        {/* ── Líneas de ataque animadas ── */}
                        {points.map((a, i) => {
                            const len = lineLen(a.pos.x, a.pos.y, targetPos.x, targetPos.y);
                            const color = SEVERITY_COLORS[a.severity];
                            const delay = (i * 0.28) % 2.8;
                            return (
                                <line
                                    key={`line-${a.id}`}
                                    x1={a.pos.x}
                                    y1={a.pos.y}
                                    x2={targetPos.x}
                                    y2={targetPos.y}
                                    stroke={color}
                                    strokeWidth={a.severity === "critical" ? 1.8 : 1.2}
                                    strokeOpacity={a.resolved ? 0.25 : 0.65}
                                    strokeLinecap="round"
                                    className="attack-line"
                                    style={{
                                        animationDuration: `${2.2 + (len / 400)}s`,
                                        animationDelay: `${delay}s`,
                                    }}
                                />
                            );
                        })}

                        {/* ── Puntos de ataque ── */}
                        {points.map((a) => {
                            const color = SEVERITY_COLORS[a.severity];
                            const isHovered = hoveredId === a.id;
                            const r = a.severity === "critical" ? 6 : a.severity === "high" ? 5 : 4;

                            return (
                                <g
                                    key={`dot-${a.id}`}
                                    transform={`translate(${a.pos.x}, ${a.pos.y})`}
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredId(a.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{ transition: "opacity 0.15s" }}
                                    opacity={a.resolved ? 0.5 : 1}
                                >
                                    {/* Anillo pulsante (solo ataques no resueltos críticos/altos) */}
                                    {!a.resolved && (a.severity === "critical" || a.severity === "high") && (
                                        <circle
                                            r={r + 4}
                                            fill={color}
                                            opacity={0}
                                            className="pulse-ring"
                                        />
                                    )}
                                    {/* Círculo exterior de hover */}
                                    {isHovered && (
                                        <circle r={r + 6} fill="none" stroke={color} strokeWidth="1.5" opacity={0.5} />
                                    )}
                                    {/* Punto principal */}
                                    <circle
                                        r={r}
                                        fill={color}
                                        stroke="#fff"
                                        strokeWidth="1.2"
                                        style={{ filter: `drop-shadow(0 0 ${isHovered ? 6 : 3}px ${color})` }}
                                    />
                                    {/* Marca de resuelto */}
                                    {a.resolved && (
                                        <circle r={r - 2} fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="2 2" />
                                    )}
                                </g>
                            );
                        })}

                        {/* ── Target: nuestro servidor en Madrid ── */}
                        <g transform={`translate(${targetPos.x}, ${targetPos.y})`}>
                            {/* Anillos del servidor */}
                            <circle r={20} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.3} />
                            <circle r={14} fill="none" stroke="#7c3aed" strokeWidth="0.8" opacity={0.5} />
                            {/* Centro */}
                            <circle r={7} fill="#7c3aed" stroke="#fff" strokeWidth="1.5"
                                style={{ filter: "drop-shadow(0 0 8px #7c3aed)" }} />
                            {/* Cruz */}
                            <line x1="-4" y1="0" x2="4" y2="0" stroke="#fff" strokeWidth="1.2" />
                            <line x1="0" y1="-4" x2="0" y2="4" stroke="#fff" strokeWidth="1.2" />
                            {/* Label */}
                            <text
                                x={10} y={-10}
                                fill="#a78bfa"
                                fontSize={8}
                                fontFamily="monospace"
                                fontWeight="600"
                            >
                                {TARGET.label}
                            </text>
                        </g>

                        {/* ── Etiqueta DEMO ── */}
                        <text x={8} y={394} fill="#334155" fontSize={7} fontFamily="monospace">
                            Demo · Datos simulados · Inicia sesión para ver amenazas reales
                        </text>
                    </svg>

                    {/* ── Tooltip HTML (overlay relativo al contenedor) ── */}
                    {hovered && (() => {
                        const pctX = (hovered.pos.x / SVG_W) * 100;
                        const pctY = (hovered.pos.y / SVG_H) * 100;
                        // Ajustar para que no se salga del borde
                        const alignRight = pctX > 65;
                        const alignBottom = pctY > 60;
                        const color = SEVERITY_COLORS[hovered.severity];

                        return (
                            <div
                                className="pointer-events-none absolute z-20"
                                style={{
                                    left: `${pctX}%`,
                                    top: `${pctY}%`,
                                    transform: `translate(${alignRight ? "calc(-100% - 12px)" : "12px"}, ${alignBottom ? "-100%" : "0%"})`,
                                }}
                            >
                                <div
                                    className="rounded-xl border bg-slate-900/95 backdrop-blur-md p-3 shadow-2xl min-w-[220px] max-w-[280px]"
                                    style={{ borderColor: `${color}50` }}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                            style={{ background: `${color}25`, color }}
                                        >
                                            {SEVERITY_LABELS[hovered.severity]}
                                        </span>
                                        {hovered.resolved && (
                                            <span className="text-[10px] text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded">
                                                ✓ Resuelto
                                            </span>
                                        )}
                                    </div>

                                    {/* Tipo */}
                                    <p className="text-xs font-semibold text-white mb-1">
                                        {TYPE_LABELS[hovered.type]}
                                    </p>

                                    {/* Ubicación */}
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-lg leading-none">
                                            {hovered.country === "Rusia" ? "🇷🇺" :
                                             hovered.country === "EE.UU." ? "🇺🇸" :
                                             hovered.country === "Países Bajos" ? "🇳🇱" :
                                             hovered.country === "Singapur" ? "🇸🇬" :
                                             hovered.country === "Alemania" ? "🇩🇪" :
                                             hovered.country === "Reino Unido" ? "🇬🇧" :
                                             hovered.country === "Suecia" ? "🇸🇪" : "🌍"}
                                        </span>
                                        <span className="text-[11px] text-slate-300">
                                            {hovered.city}, <span className="text-slate-400">{hovered.country}</span>
                                        </span>
                                    </div>

                                    {/* IP */}
                                    <p className="font-mono text-[11px] text-slate-400 mb-2">
                                        {hovered.ip}
                                    </p>

                                    {/* Separador */}
                                    <div className="border-t border-slate-700/60 pt-2 mb-1">
                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                            {hovered.details}
                                        </p>
                                    </div>

                                    {/* Timestamp */}
                                    <p className="text-[9px] text-slate-600 mt-1">
                                        {new Date(hovered.timestamp).toLocaleString("es-ES")}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* ── Leyenda ── */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                    {(["critical", "high", "medium", "low"] as const).map((s) => {
                        const count = ATTACKS.filter((a) => a.severity === s).length;
                        return (
                            <div key={s} className="flex items-center gap-1.5 text-xs">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{
                                        background: SEVERITY_COLORS[s],
                                        boxShadow: `0 0 5px ${SEVERITY_COLORS[s]}`,
                                    }}
                                />
                                <span className="capitalize text-muted-foreground">{SEVERITY_LABELS[s]}:</span>
                                <span className="font-semibold">{count}</span>
                            </div>
                        );
                    })}

                    <div className="flex items-center gap-1.5 text-xs ml-auto">
                        <Shield className="h-3 w-3 text-violet-400" />
                        <span className="text-muted-foreground">Madrid —</span>
                        <span className="text-violet-400 font-mono text-[10px]">praxialabs.com</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
