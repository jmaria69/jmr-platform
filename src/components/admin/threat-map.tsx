"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Wifi, WifiOff, RefreshCw } from "lucide-react";

interface SecurityEvent {
  id: string;
  type: string;
  ip: string;
  path: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  details: string;
}

interface GeoPoint {
  ip: string;
  lat: number;
  lon: number;
  country: string;
  city: string;
  severity: "low" | "medium" | "high" | "critical";
  type: string;
  timestamp: string;
  count: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  low:      "#eab308",
  medium:   "#f97316",
  high:     "#ef4444",
  critical: "#dc2626",
};

const SEVERITY_RADIUS: Record<string, number> = {
  low:      8,
  medium:   12,
  high:     16,
  critical: 22,
};

// Geolocate IPs using ip-api.com batch endpoint (free, 45 req/min, 100 IPs/batch)
async function geolocateIPs(ips: string[]): Promise<Record<string, { lat: number; lon: number; country: string; city: string }>> {
  const unique = [...new Set(ips)].filter(ip => ip !== "unknown" && !ip.startsWith("127.") && !ip.startsWith("::"));
  if (unique.length === 0) return {};

  try {
    const batch = unique.slice(0, 100).map(query => ({ query, fields: "query,lat,lon,country,city,status" }));
    const res = await fetch("http://ip-api.com/batch?fields=query,lat,lon,country,city,status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    if (!res.ok) return {};
    const data = await res.json() as Array<{ query: string; lat: number; lon: number; country: string; city: string; status: string }>;
    const map: Record<string, { lat: number; lon: number; country: string; city: string }> = {};
    for (const item of data) {
      if (item.status === "success") {
        map[item.query] = { lat: item.lat, lon: item.lon, country: item.country, city: item.city };
      }
    }
    return map;
  } catch {
    return {};
  }
}

export function ThreatMap() {
  const [enabled, setEnabled] = useState(true);
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchAndGeolocate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/alert?limit=100");
      if (!res.ok) return;
      const { events } = await res.json() as { events: SecurityEvent[] };

      if (!events || events.length === 0) {
        setPoints([]);
        setLoading(false);
        return;
      }

      const geoMap = await geolocateIPs(events.map(e => e.ip));

      // Group by IP + severity
      const grouped: Record<string, GeoPoint> = {};
      for (const ev of events) {
        const geo = geoMap[ev.ip];
        if (!geo) continue;
        const key = ev.ip;
        if (grouped[key]) {
          grouped[key].count++;
          // Escalate severity
          const order = ["low", "medium", "high", "critical"];
          if (order.indexOf(ev.severity) > order.indexOf(grouped[key].severity)) {
            grouped[key].severity = ev.severity;
          }
        } else {
          grouped[key] = {
            ip: ev.ip,
            lat: geo.lat,
            lon: geo.lon,
            country: geo.country,
            city: geo.city,
            severity: ev.severity,
            type: ev.type,
            timestamp: ev.timestamp,
            count: 1,
          };
        }
      }

      setPoints(Object.values(grouped));
      setLastUpdate(new Date());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Init Leaflet map (client-only)
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    if (mapRef.current) return; // already initialized

    let destroyed = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      leafletRef.current = L;

      if (destroyed || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Small attribution
      L.control.attribution({ position: "bottomright", prefix: "" }).addTo(map);

      mapRef.current = map;
    })();

    return () => {
      destroyed = true;
    };
  }, [enabled]);

  // Update markers when points change
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !enabled) return;

    // Remove old markers
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const pt of points) {
      const color = SEVERITY_COLORS[pt.severity] || "#f97316";
      const radius = SEVERITY_RADIUS[pt.severity] || 10;
      const pulseRadius = radius + 8;

      // Pulsing circle
      const pulseIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:${pulseRadius * 2}px;height:${pulseRadius * 2}px;">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background:${color};opacity:0.25;
              animation:threat-pulse 2s infinite;
            "></div>
            <div style="
              position:absolute;
              top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:${radius}px;height:${radius}px;
              border-radius:50%;
              background:${color};
              border:2px solid #fff;
              box-shadow:0 0 8px ${color};
            "></div>
          </div>
        `,
        iconSize: [pulseRadius * 2, pulseRadius * 2],
        iconAnchor: [pulseRadius, pulseRadius],
      });

      const marker = L.marker([pt.lat, pt.lon], { icon: pulseIcon }).addTo(map);

      const typeLabel: Record<string, string> = {
        bot_blocked:    "Bot bloqueado",
        rate_limited:   "Rate limit",
        invalid_token:  "Token inválido",
        brute_force:    "Fuerza bruta",
        suspicious:     "Sospechoso",
      };

      marker.bindPopup(`
        <div style="font-family:monospace;min-width:180px;">
          <b style="color:${color}">${pt.severity.toUpperCase()}</b><br/>
          <span style="color:#888">IP:</span> ${pt.ip}<br/>
          <span style="color:#888">Tipo:</span> ${typeLabel[pt.type] || pt.type}<br/>
          <span style="color:#888">Lugar:</span> ${pt.city}, ${pt.country}<br/>
          <span style="color:#888">Ataques:</span> ${pt.count}<br/>
          <span style="color:#888">Último:</span> ${new Date(pt.timestamp).toLocaleString("es-ES")}
        </div>
      `);

      markersRef.current.push(marker);
    }
  }, [points, enabled]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    fetchAndGeolocate();
    intervalRef.current = setInterval(fetchAndGeolocate, 30_000); // every 30s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, fetchAndGeolocate]);

  // Cleanup map on disable
  useEffect(() => {
    if (!enabled && mapRef.current) {
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
      mapRef.current.remove();
      mapRef.current = null;
      leafletRef.current = null;
    }
  }, [enabled]);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Mapa de amenazas en tiempo real</CardTitle>
            {enabled && (
              <Badge variant="outline" className="text-green-500 border-green-500 text-xs animate-pulse">
                ● EN VIVO
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {enabled && lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Act. {lastUpdate.toLocaleTimeString("es-ES")}
              </span>
            )}
            {enabled && (
              <Button
                size="sm"
                variant="ghost"
                onClick={fetchAndGeolocate}
                disabled={loading}
                className="h-7 px-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            )}
            <Button
              size="sm"
              variant={enabled ? "default" : "outline"}
              onClick={() => setEnabled(v => !v)}
              className="h-7 gap-1.5"
            >
              {enabled ? (
                <><Wifi className="h-3.5 w-3.5" /> Desactivar</>
              ) : (
                <><WifiOff className="h-3.5 w-3.5" /> Activar mapa</>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {enabled ? (
          <>
            {/* Pulse animation keyframes */}
            <style>{`
              @keyframes threat-pulse {
                0%   { transform: scale(1); opacity: 0.25; }
                50%  { transform: scale(1.8); opacity: 0.08; }
                100% { transform: scale(1); opacity: 0.25; }
              }
            `}</style>

            <div
              ref={containerRef}
              className="w-full rounded-md overflow-hidden border border-border"
              style={{ height: 420 }}
            />

            {points.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                No hay ataques geolocalizables aún — los de IPs locales o desconocidas no aparecen en el mapa.
              </p>
            )}

            {points.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {(["critical", "high", "medium", "low"] as const).map(s => {
                  const count = points.filter(p => p.severity === s).length;
                  if (count === 0) return null;
                  return (
                    <div key={s} className="flex items-center gap-1.5 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: SEVERITY_COLORS[s], boxShadow: `0 0 6px ${SEVERITY_COLORS[s]}` }}
                      />
                      <span className="capitalize text-muted-foreground">{s}:</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  );
                })}
                <span className="text-xs text-muted-foreground ml-auto">
                  {points.reduce((a, p) => a + p.count, 0)} ataques · {points.length} IPs únicas
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
            <WifiOff className="h-8 w-8 opacity-30" />
            <p className="text-sm">Mapa desactivado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
