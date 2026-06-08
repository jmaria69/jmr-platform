"use client";

import { useState, useMemo } from "react";
import {
    Shield, ShieldAlert, ShieldCheck,
    Bot, Zap, KeyRound, Skull, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from "next/dynamic";

const ThreatMap = dynamic(
    () => import("@/components/admin/threat-map").then(m => m.ThreatMap),
    { ssr: false, loading: () => <div className="h-[490px] rounded-xl border border-border animate-pulse bg-muted/20 mt-4" /> }
);

// ─── Types ───────────────────────────────────────────────────────────────────

type EventType = "bot_blocked" | "rate_limited" | "invalid_token" | "brute_force" | "suspicious";
type Severity = "low" | "medium" | "high" | "critical";

interface SecurityEvent {
    id: string;
    type: EventType;
    ip: string;
    path: string;
    userAgent: string;
    timestamp: string;
    severity: Severity;
    details: string;
    resolved: boolean;
}

// ─── Mock seed data ───────────────────────────────────────────────────────────

const now = Date.now();
const mins = (m: number) => new Date(now - m * 60_000).toISOString();

const MOCK_EVENTS: SecurityEvent[] = [
    {
        id: "demo-1",
        type: "brute_force",
        ip: "185.220.101.47",
        path: "/admin/login",
        userAgent: "curl/7.88.1",
        timestamp: mins(3),
        severity: "critical",
        details: "23 intentos de login fallidos en 90 segundos desde la misma IP",
        resolved: false,
    },
    {
        id: "demo-2",
        type: "bot_blocked",
        ip: "66.249.66.194",
        path: "/api/admin/users",
        userAgent: "Googlebot/2.1 (+http://www.google.com/bot.html)",
        timestamp: mins(8),
        severity: "low",
        details: "Bot conocido intentó acceder a ruta de API protegida — bloqueado con HTTP 403",
        resolved: true,
    },
    {
        id: "demo-3",
        type: "invalid_token",
        ip: "91.108.56.11",
        path: "/admin/dashboard",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        timestamp: mins(15),
        severity: "high",
        details: "Token JWT manipulado detectado — firma inválida, posible session hijacking",
        resolved: false,
    },
    {
        id: "demo-4",
        type: "rate_limited",
        ip: "103.21.244.0",
        path: "/api/auth/login",
        userAgent: "python-requests/2.31.0",
        timestamp: mins(22),
        severity: "high",
        details: "IP bloqueada temporalmente (15 min) por superar el límite de 10 req/min",
        resolved: false,
    },
    {
        id: "demo-5",
        type: "suspicious",
        ip: "45.155.205.233",
        path: "/admin/credenciales",
        userAgent: "Mozilla/5.0 (compatible; MJ12bot/v1.4.8)",
        timestamp: mins(34),
        severity: "medium",
        details: "Acceso a ruta sensible de credenciales desde IP con historial de abuso",
        resolved: false,
    },
    {
        id: "demo-6",
        type: "bot_blocked",
        ip: "52.167.144.195",
        path: "/sitemap.xml",
        userAgent: "BingBot/2.0",
        timestamp: mins(47),
        severity: "low",
        details: "Crawler de Bing accediendo a recursos estáticos — monitorizado",
        resolved: true,
    },
    {
        id: "demo-7",
        type: "invalid_token",
        ip: "178.62.252.190",
        path: "/api/admin/projects",
        userAgent: "axios/1.4.0",
        timestamp: mins(60),
        severity: "medium",
        details: "Token expirado reutilizado — posible intento de replay attack",
        resolved: true,
    },
    {
        id: "demo-8",
        type: "brute_force",
        ip: "194.165.16.11",
        path: "/admin/login",
        userAgent: "Hydra v9.4",
        timestamp: mins(75),
        severity: "critical",
        details: "Herramienta de fuerza bruta detectada (Hydra) — 47 intentos en 2 minutos",
        resolved: true,
    },
    {
        id: "demo-9",
        type: "suspicious",
        ip: "185.156.73.14",
        path: "/admin/seguridad",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        timestamp: mins(90),
        severity: "medium",
        details: "Múltiples exploraciones de rutas admin en secuencia rápida — fingerprinting",
        resolved: false,
    },
    {
        id: "demo-10",
        type: "rate_limited",
        ip: "159.89.49.254",
        path: "/api/crm/contacts",
        userAgent: "Go-http-client/1.1",
        timestamp: mins(110),
        severity: "low",
        details: "Script automatizado intentando exfiltrar listado de contactos del CRM",
        resolved: true,
    },
];

function buildStats(events: SecurityEvent[]) {
    const byType: Record<string, number> = {};
    const ipCount: Record<string, number> = {};
    let critical = 0, high = 0, medium = 0, low = 0;

    for (const e of events) {
        byType[e.type] = (byType[e.type] ?? 0) + 1;
        ipCount[e.ip] = (ipCount[e.ip] ?? 0) + 1;
        if (e.severity === "critical") critical++;
        else if (e.severity === "high") high++;
        else if (e.severity === "medium") medium++;
        else low++;
    }

    const topIPs = Object.entries(ipCount)
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return { total: events.length, critical, high, medium, low, byType, topIPs };
}

// ─── Config maps ─────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
    bot_blocked: { label: "Bot bloqueado", icon: Bot, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    rate_limited: { label: "Fuerza bruta", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    invalid_token: { label: "Token inválido", icon: KeyRound, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    brute_force: { label: "Ataque de fuerza bruta", icon: Skull, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
    suspicious: { label: "Actividad sospechosa", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
} as const;

const SEVERITY_CONFIG = {
    low: { label: "BAJA", class: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
    medium: { label: "MEDIA", class: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    high: { label: "ALTA", class: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
    critical: { label: "CRÍTICA", class: "bg-red-500/20 text-red-300 border-red-500/30" },
} as const;

const SOLUTIONS: Record<EventType, { title: string; steps: string[] }> = {
    bot_blocked: {
        title: "Bot / Agente IA bloqueado automáticamente",
        steps: [
            "El sistema bloqueó el acceso con HTTP 403 automáticamente.",
            "Si el patrón persiste desde la misma IP, considera añadirla a una lista negra en Vercel Firewall.",
            "No se requiere acción inmediata — el sistema está funcionando correctamente.",
        ],
    },
    rate_limited: {
        title: "IP bloqueada por exceso de intentos de login",
        steps: [
            "La IP está bloqueada automáticamente durante 15 minutos.",
            "Si el ataque continúa, accede a Vercel → Settings → Firewall y bloquea la IP permanentemente.",
            "Verifica que tu contraseña de admin sea suficientemente fuerte (mín. 16 caracteres).",
        ],
    },
    invalid_token: {
        title: "Intento de falsificación de sesión (JWT)",
        steps: [
            "Alguien intentó acceder al admin con un token manipulado o expirado.",
            "Si el volumen es alto, rota el AUTH_SECRET inmediatamente desde Vercel → Environment Variables.",
            "Revisa si hay sesiones activas no autorizadas en los logs del servidor.",
        ],
    },
    brute_force: {
        title: "⚠️ URGENTE — Ataque de fuerza bruta",
        steps: [
            "URGENTE: Cambia la contraseña de admin inmediatamente.",
            "Accede a Vercel → Firewall y bloquea la IP atacante.",
            "Revisa los logs completos para ver si algún intento fue exitoso.",
            "Rota el AUTH_SECRET para invalidar todas las sesiones activas.",
        ],
    },
    suspicious: {
        title: "Actividad anómala detectada",
        steps: [
            "Revisa los detalles del evento para entender el contexto.",
            "Comprueba si la IP tiene historial de ataques (ipinfo.io o abuseipdb.com).",
            "Si el patrón es recurrente, bloquea la IP en Vercel Firewall.",
        ],
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoSeguridadPage() {
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
    const [filterType, setFilterType] = useState<string>("");
    const [filterSeverity, setFilterSeverity] = useState<string>("");

    const stats = useMemo(() => buildStats(MOCK_EVENTS), []);

    const filtered = MOCK_EVENTS.filter(e => {
        if (filterType && e.type !== filterType) return false;
        if (filterSeverity && e.severity !== filterSeverity) return false;
        return true;
    });

    const alertLevel =
        stats.critical > 0 ? "critical" :
        stats.high > 0 ? "high" : "medium";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-indigo-400" />
                        Centro de Seguridad
                        <span className="text-sm font-normal text-amber-400/80 ml-2">(Demo — datos simulados)</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Muestra de eventos reales de seguridad · Inicia sesión para ver tu panel en vivo
                    </p>
                </div>
            </div>

            {/* Alert banner */}
            {alertLevel === "critical" && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-red-300">
                    <ShieldAlert className="h-5 w-5 flex-shrink-0 animate-pulse" />
                    <span className="font-semibold">
                        🚨 ALERTA CRÍTICA — {stats.critical} evento(s) crítico(s) en este ejemplo de demo.
                    </span>
                </div>
            )}
            {alertLevel === "high" && (
                <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-orange-300">
                    <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                    <span className="font-semibold">⚠️ Atención — {stats.high} evento(s) de severidad alta.</span>
                </div>
            )}

            <ThreatMap />

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total eventos", value: stats.total, color: "text-foreground" },
                    { label: "Críticos", value: stats.critical, color: "text-red-400" },
                    { label: "Altos", value: stats.high, color: "text-orange-400" },
                    { label: "Medios/Bajos", value: stats.medium + stats.low, color: "text-amber-400" },
                ].map(s => (
                    <Card key={s.label} className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">{s.label}</p>
                            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Events list */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            aria-label="Filtrar por tipo de ataque"
                            className="text-sm px-3 py-2 rounded-lg bg-slate-900/60 border border-indigo-500/30 text-slate-200 hover:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer"
                        >
                            <option value="">Todos los tipos</option>
                            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                            ))}
                        </select>

                        <select
                            value={filterSeverity}
                            onChange={e => setFilterSeverity(e.target.value)}
                            aria-label="Filtrar por severidad"
                            className="text-sm px-3 py-2 rounded-lg bg-slate-900/60 border border-indigo-500/30 text-slate-200 hover:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer"
                        >
                            <option value="">Toda severidad</option>
                            <option value="critical">Crítica</option>
                            <option value="high">Alta</option>
                            <option value="medium">Media</option>
                            <option value="low">Baja</option>
                        </select>

                        <span className="ml-auto text-xs text-muted-foreground self-center">
                            {filtered.length} evento{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {filtered.length === 0 ? (
                        <Card className="rounded-2xl glass border-gradient">
                            <CardContent className="flex flex-col items-center gap-3 py-16">
                                <ShieldCheck className="h-12 w-12 text-green-400 opacity-60" />
                                <p className="text-muted-foreground">Sin resultados para este filtro</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filtered.map(event => {
                            const cfg = TYPE_CONFIG[event.type];
                            const sev = SEVERITY_CONFIG[event.severity];
                            const Icon = cfg.icon;
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEvent(prev => prev?.id === event.id ? null : event)}
                                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:opacity-90
                                        ${event.resolved ? "opacity-50" : ""}
                                        ${selectedEvent?.id === event.id ? "ring-2 ring-indigo-500" : ""}
                                        ${cfg.border} ${cfg.bg}`}
                                >
                                    <div className={`p-2 rounded-lg ${cfg.bg} shrink-0`}>
                                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="font-semibold text-sm">{cfg.label}</span>
                                            <Badge className={`text-xs ${sev.class}`}>{sev.label}</Badge>
                                            {event.resolved && (
                                                <Badge className="text-xs bg-green-500/15 text-green-400 border-green-500/30">
                                                    Resuelto
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{event.details}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs text-muted-foreground font-mono">{event.ip}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(event.timestamp).toLocaleString("es-ES")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right panel */}
                <div className="space-y-4">
                    {selectedEvent ? (
                        <Card className="rounded-2xl glass border-gradient">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                                    Detalle del evento
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium">{TYPE_CONFIG[selectedEvent.type]?.label}</span></div>
                                <div><span className="text-muted-foreground">IP:</span> <span className="font-mono font-medium">{selectedEvent.ip}</span></div>
                                <div><span className="text-muted-foreground">Ruta:</span> <span className="font-mono text-xs">{selectedEvent.path}</span></div>
                                <div><span className="text-muted-foreground">UA:</span> <span className="text-xs text-muted-foreground break-all">{selectedEvent.userAgent.slice(0, 80)}</span></div>
                                <div><span className="text-muted-foreground">Hora:</span> <span>{new Date(selectedEvent.timestamp).toLocaleString("es-ES")}</span></div>
                                <div className="pt-2 border-t border-border">
                                    <p className="text-muted-foreground mb-1 font-semibold text-xs">
                                        {SOLUTIONS[selectedEvent.type]?.title}
                                    </p>
                                    <ol className="space-y-1.5 list-decimal list-inside">
                                        {SOLUTIONS[selectedEvent.type]?.steps.map((step, i) => (
                                            <li key={i} className="text-xs text-muted-foreground leading-relaxed">{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="rounded-2xl glass border-gradient">
                            <CardContent className="py-8 text-center text-muted-foreground text-sm">
                                <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                Haz clic en un evento para ver su detalle y guía de mitigación
                            </CardContent>
                        </Card>
                    )}

                    {/* Top IPs */}
                    <Card className="rounded-2xl glass border-gradient">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">🎯 IPs más activas</CardTitle>
                            <CardDescription>Posibles atacantes persistentes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stats.topIPs.map((item, i) => (
                                <div key={item.ip} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground text-xs w-4">{i + 1}.</span>
                                        <span className="font-mono">{item.ip}</span>
                                    </div>
                                    <Badge variant="outline" className={item.count >= 2 ? "border-red-500/40 text-red-400" : ""}>
                                        {item.count} evento{item.count !== 1 ? "s" : ""}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* By type */}
                    <Card className="rounded-2xl glass border-gradient">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">📊 Por tipo de ataque</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                                const count = stats.byType[type] ?? 0;
                                const Icon = cfg.icon;
                                return (
                                    <div key={type} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                                            <span className="text-muted-foreground">{cfg.label}</span>
                                        </div>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
