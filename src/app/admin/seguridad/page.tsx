"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, CheckCircle, Bot, Zap, KeyRound, Skull, AlertTriangle, Mail, Wifi, Flame, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from "next/dynamic";
const ThreatMap = dynamic(
  () => import("@/components/admin/threat-map").then(m => m.ThreatMap),
  { ssr: false, loading: () => <div className="h-[490px] rounded-xl border border-border animate-pulse bg-muted/20 mt-4" /> }
);

interface SecurityEvent {
  id: string;
  type: "bot_blocked" | "rate_limited" | "invalid_token" | "brute_force" | "suspicious" | "waf_blocked";
  ip: string;
  path: string;
  userAgent: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  details: string;
  resolved: boolean;
}

interface SecurityStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: Record<string, number>;
  topIPs: { ip: string; count: number }[];
}

const TYPE_CONFIG = {
  bot_blocked: { label: "Bot bloqueado", icon: Bot, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  rate_limited: { label: "Fuerza bruta", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  invalid_token: { label: "Token inválido", icon: KeyRound, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  brute_force: { label: "Ataque de fuerza bruta", icon: Skull, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  suspicious: { label: "Actividad sospechosa", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  waf_blocked: { label: "WAF Cloudflare (edge)", icon: Flame, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
};

const SEVERITY_CONFIG = {
  low: { label: "BAJA", class: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  medium: { label: "MEDIA", class: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  high: { label: "ALTA", class: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  critical: { label: "CRÍTICA", class: "bg-red-500/20 text-red-300 border-red-500/30" },
};

const SOLUTIONS: Record<string, { title: string; steps: string[] }> = {
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
      "Verifica que tu contraseña de admin sea suficientemente fuerte (mín. 16 caracteres, mayúsculas, números y símbolos).",
      "Considera activar 2FA en el futuro para una capa extra de seguridad.",
    ],
  },
  invalid_token: {
    title: "Intento de falsificación de sesión (JWT)",
    steps: [
      "Alguien intentó acceder al admin con un token manipulado o expirado.",
      "Si el volumen es alto, rota el AUTH_SECRET inmediatamente desde Vercel → Environment Variables.",
      "Revisa si hay sesiones activas no autorizadas en los logs del servidor.",
      "Este tipo de ataque suele indicar intentos de session hijacking.",
    ],
  },
  brute_force: {
    title: "⚠️ URGENTE — Ataque de fuerza bruta",
    steps: [
      "URGENTE: Cambia la contraseña de admin inmediatamente.",
      "Accede a Vercel → Firewall y bloquea la IP atacante.",
      "Revisa los logs completos para ver si algún intento fue exitoso.",
      "Considera añadir una IP allowlist si siempre accedes desde las mismas IPs.",
      "Rota el AUTH_SECRET para invalidar todas las sesiones activas.",
    ],
  },
  suspicious: {
    title: "Actividad anómala detectada",
    steps: [
      "Revisa los detalles del evento para entender el contexto.",
      "Comprueba si la IP tiene historial de ataques (use ipinfo.io o abuseipdb.com).",
      "Si el patrón es recurrente, bloquea la IP en Vercel Firewall.",
    ],
  },
  waf_blocked: {
    title: "Bloqueado en el edge por el WAF de Cloudflare",
    steps: [
      "Cloudflare ya paró la petición antes de que llegara al servidor -- no se requiere acción para este intento concreto.",
      "Severidad CRÍTICA = firma de ataque conocida (RCE, SQLi...); revisa si la tecnología afectada tiene un CVE público y si tu versión ya está parcheada.",
      "Severidad ALTA = bloqueado por la regla de hardening propia (path traversal / archivos sensibles).",
      "Si la misma IP insiste, ya queda bloqueada de forma permanente vía el panel SOC de SIAM (Active Defense) -- más detalle del incidente ahí.",
    ],
  },
};

export default function SeguridadPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterSeverity, setFilterSeverity] = useState<string>("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterType) params.set("type", filterType);
      params.set("limit", String(pageSize));
      // cuando quieras filtrar en servidor:
      // if (filterSeverity) params.set("severity", filterSeverity);
      const url = `/api/security/events?${params}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data.events ?? []);
      setStats(data.stats ?? null);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [filterType, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 10_000); // poll every 10s
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const resolveEvent = async (id: string) => {
    await fetch("/api/security/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEvents(ev => ev.map(e => e.id === id ? { ...e, resolved: true } : e));
    if (selectedEvent?.id === id) setSelectedEvent(prev => prev ? { ...prev, resolved: true } : null);
  };

  const filtered = events.filter(e => {
    if (filterSeverity && e.severity !== filterSeverity) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allVisibleSelected = filtered.length > 0 && filtered.every(e => selectedIds.has(e.id));
  const toggleSelectAll = () => {
    setSelectedIds(prev => {
      if (allVisibleSelected) return new Set();
      return new Set(filtered.map(e => e.id));
    });
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`¿Eliminar definitivamente ${selectedIds.size} evento(s)? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      await fetch("/api/security/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selectedIds] }),
      });
      setEvents(ev => ev.filter(e => !selectedIds.has(e.id)));
      if (selectedEvent && selectedIds.has(selectedEvent.id)) setSelectedEvent(null);
      setSelectedIds(new Set());
    } finally {
      setDeleting(false);
    }
  };

  const criticalCount = stats?.critical ?? 0;
  const highCount = stats?.high ?? 0;
  const alertLevel = criticalCount > 0 ? "critical" : highCount > 0 ? "high" : (stats?.total ?? 0) > 0 ? "medium" : "safe";

  return (
    <div className="space-y-6">
      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">
                Detalle del evento
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Información básica</h3>
                  <p className="text-gray-600"><span className="font-medium">ID:</span> {selectedEvent.id}</p>
                  <p className="text-gray-600"><span className="font-medium">Tipo:</span> {TYPE_CONFIG[selectedEvent.type]?.label}</p>
                  <p className="text-gray-600"><span className="font-medium">Severidad:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${SEVERITY_CONFIG[selectedEvent.severity]?.class}`}>
                      {SEVERITY_CONFIG[selectedEvent.severity]?.label}
                    </span>
                  </p>
                  <p className="text-gray-600"><span className="font-medium">Estado:</span> {selectedEvent.resolved ? 'Resuelto' : 'Activo'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Ubicación y tiempo</h3>
                  <p className="text-gray-600"><span className="font-medium">IP:</span> <code className="bg-gray-50 px-2 py-0.5 rounded">{selectedEvent.ip}</code></p>
                  <p className="text-gray-600"><span className="font-medium">Ruta:</span> <code className="bg-gray-50 px-2 py-0.5 rounded">{selectedEvent.path}</code></p>
                  <p className="text-gray-600"><span className="font-medium">Hora:</span> {new Date(selectedEvent.timestamp).toLocaleString("es-ES")}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Detalles técnicos</h3>
                <p className="text-gray-600"><span className="font-medium">User Agent:</span></p>
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded font-mono break-all">
                  {selectedEvent.userAgent}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Descripción del evento</h3>
                <p className="text-gray-600 leading-relaxed">{selectedEvent.details}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Instrucciones de mitigación</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">{SOLUTIONS[selectedEvent.type]?.title}</p>
                  <ol className="list-decimal list-inside space-y-1 pl-5 text-gray-600">
                    {SOLUTIONS[selectedEvent.type]?.steps.map((step, i) => (
                      <li key={i} className="text-gray-600 leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
                {!selectedEvent.resolved && (
                  <div className="mt-4">
                    <button
                      onClick={() => resolveEvent(selectedEvent.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marcar como resuelto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-400" />
            Centro de Seguridad
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitorización en tiempo real · Alertas por email automáticas
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {autoRefresh ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(false)}
              className="border-green-500/40 text-green-400"
              title="Click para cambiar a actualización manual"
            >
              <Wifi className="h-3.5 w-3.5 mr-1.5" /> Auto
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                title="Click para actualizar ahora"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Actualizar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRefresh(true)}
                className="text-xs text-muted-foreground hover:text-green-400"
                title="Volver a auto-refresco"
              >
                (Auto)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Alert banner */}
      {alertLevel === "critical" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-red-300">
          <ShieldAlert className="h-5 w-5 flex-shrink-0 animate-pulse" />
          <span className="font-semibold">🚨 ALERTA CRÍTICA — {criticalCount} evento(s) crítico(s) detectado(s). Revisa inmediatamente y sigue las instrucciones de mitigación.</span>
        </div>
      )}
      {alertLevel === "high" && (
        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-orange-300">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <span className="font-semibold">⚠️ Atención — {highCount} evento(s) de severidad alta. Revisa los detalles.</span>
        </div>
      )}
      {alertLevel === "safe" && !loading && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-300">
          <ShieldCheck className="h-5 w-5 flex-shrink-0" />
          <span className="font-semibold">Sistema seguro — No se han detectado ataques. Monitorización activa.</span>
        </div>
      )}

      {/* Threat Map */}
      <ThreatMap />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total eventos", value: stats?.total ?? 0, color: "text-foreground" },
          { label: "Críticos", value: stats?.critical ?? 0, color: "text-red-400" },
          { label: "Altos", value: stats?.high ?? 0, color: "text-orange-400" },
          { label: "Medios/Bajos", value: (stats?.medium ?? 0) + (stats?.low ?? 0), color: "text-amber-400" },
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
          {<div className="flex gap-2 flex-wrap">
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
          </div>}

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAll}
                  className="h-3.5 w-3.5"
                />
                Seleccionar todo ({filtered.length})
              </label>
              <div className="flex items-center gap-2">
                {selectedIds.size > 0 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="h-7 text-xs gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleting ? "Eliminando..." : `Eliminar (${selectedIds.size})`}
                  </Button>
                )}
                <div className="flex gap-1">
                  {[10, 50, 100].map(n => (
                    <button
                      key={n}
                      onClick={() => setPageSize(n)}
                      className={`px-2 py-1 rounded border ${pageSize === n ? "bg-indigo-600 border-indigo-500 text-white" : "border-border text-muted-foreground hover:bg-muted/40"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Cargando eventos...</div>
          ) : filtered.length === 0 ? (
            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
              <CardContent className="flex flex-col items-center gap-3 py-16">
                <ShieldCheck className="h-12 w-12 text-green-400 opacity-60" />
                <p className="text-muted-foreground">Sin eventos de seguridad registrados</p>
                <p className="text-xs text-muted-foreground">Los ataques aparecerán aquí en tiempo real</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((event, index) => {
              const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.suspicious;
              const sev = SEVERITY_CONFIG[event.severity] ?? SEVERITY_CONFIG.low;
              const Icon = cfg.icon;
              return (
                <div
                  key={`${event.id}-${index}`}
                  onClick={() => setSelectedEvent(event)}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:opacity-90 ${event.resolved ? "opacity-40" : ""
                    } ${selectedEvent?.id === event.id ? "ring-2 ring-indigo-500" : ""} ${cfg.border} ${cfg.bg}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(event.id)}
                    onClick={e => e.stopPropagation()}
                    onChange={() => toggleSelect(event.id)}
                    className="mt-1 h-3.5 w-3.5 shrink-0"
                  />
                  <div className={`p-2 rounded-lg ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{cfg.label}</span>
                      <Badge className={`text-xs ${sev.class}`}>{sev.label}</Badge>
                      {event.resolved && <Badge className="text-xs bg-green-500/15 text-green-400 border-green-500/30">Resuelto</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{event.details}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground font-mono">{event.ip}</span>
                      <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString("es-ES")}</span>
                    </div>
                  </div>
                  {!event.resolved && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => { e.stopPropagation(); resolveEvent(event.id); }}
                      className="shrink-0 h-7 text-xs text-green-400 hover:text-green-300"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Resolver
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Top IPs */}
          {stats?.topIPs && stats.topIPs.length > 0 && (
            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
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
                    <Badge variant="outline" className={item.count >= 5 ? "border-red-500/40 text-red-400" : ""}>{item.count} intentos</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Email alert config */}
          <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                Alertas por email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destinatario</span>
                <span className="font-medium">jmaria.romero79@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severidad mínima</span>
                <span className="font-medium">Media o superior</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cooldown emails</span>
                <span className="font-medium">1 por cada 5 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado</span>
                <span className={`font-medium ${process.env.NEXT_PUBLIC_EMAIL_CONFIGURED === "true" ? "text-green-400" : "text-amber-400"}`}>
                  {process.env.NEXT_PUBLIC_EMAIL_CONFIGURED === "true" ? "Activo" : "Configurar template ↓"}
                </span>
              </div>
              <div className="pt-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                Crea el template <strong>template_security</strong> en EmailJS con las variables: <code>severidad</code>, <code>tipo_ataque</code>, <code>ip_atacante</code>, <code>fecha_hora</code>, <code>detalles</code>, <code>solucion</code>, <code>panel_url</code>
              </div>
            </CardContent>
          </Card>

          {/* By type breakdown */}
          {stats && (
            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
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
          )}
        </div>
      </div>
    </div>
  );
}
