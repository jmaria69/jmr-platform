"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { MessageCircle, Phone, Globe, RefreshCw, X, User, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConversacionResumen {
  telefono: string;
  canal: "web" | "whatsapp";
  total_mensajes: number;
  ultimo_mensaje: string;
  ultimo_rol: string;
  ultimo_timestamp: string | null;
  producto: string;
  producto_nombre: string;
}

interface MensajeHilo {
  role: string;
  content: string;
  timestamp: string | null;
}

interface Producto {
  id: string;
  nombre: string;
}

interface FalloAgente {
  producto: string;
  nombre: string;
  motivo: string;
}

// Cada producto con su color para distinguirlos de un vistazo en la lista.
const COLOR_PRODUCTO: Record<string, string> = {
  praxialabs: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  adminapp: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  saludapp: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  marketing40: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

export default function ConversacionesPage() {
  const [conversaciones, setConversaciones] = useState<ConversacionResumen[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [fallos, setFallos] = useState<FalloAgente[]>([]);
  const [filtro, setFiltro] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionada, setSeleccionada] = useState<ConversacionResumen | null>(null);
  const [hilo, setHilo] = useState<MensajeHilo[]>([]);
  const [cargandoHilo, setCargandoHilo] = useState(false);

  const fetchConversaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conversaciones");
      if (!res.ok) {
        setError("No se pudo cargar — comprueba que el agente esté encendido y AGENT_ADMIN_KEY configurado.");
        setConversaciones([]);
      } else {
        const data = await res.json();
        setConversaciones(data.conversaciones ?? []);
        setProductos(data.productos ?? []);
        setFallos(data.fallos ?? []);
        setError(null);
      }
    } catch {
      setError("No se pudo conectar con el agente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversaciones();
  }, [fetchConversaciones]);

  const conteoPorProducto = useMemo(() => {
    const conteo: Record<string, number> = {};
    for (const c of conversaciones) {
      conteo[c.producto] = (conteo[c.producto] ?? 0) + 1;
    }
    return conteo;
  }, [conversaciones]);

  const visibles = useMemo(
    () => (filtro === "todos" ? conversaciones : conversaciones.filter((c) => c.producto === filtro)),
    [conversaciones, filtro]
  );

  const abrirConversacion = async (conversacion: ConversacionResumen) => {
    setSeleccionada(conversacion);
    setHilo([]);
    setCargandoHilo(true);
    try {
      const res = await fetch(
        `/api/admin/conversaciones/${encodeURIComponent(conversacion.telefono)}?producto=${encodeURIComponent(conversacion.producto)}`
      );
      const data = await res.json();
      setHilo(data.mensajes ?? []);
    } finally {
      setCargandoHilo(false);
    }
  };

  return (
    <div className="space-y-6">
      {seleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSeleccionada(null)}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-2xl glass border-gradient max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2 font-semibold text-sm">
                {seleccionada.canal === "web" ? <Globe className="h-4 w-4 text-cyan-400" /> : <Phone className="h-4 w-4 text-green-400" />}
                {seleccionada.telefono}
                <Badge variant="outline" className={`text-xs ${COLOR_PRODUCTO[seleccionada.producto] ?? ""}`}>
                  {seleccionada.producto_nombre}
                </Badge>
              </div>
              <button
                onClick={() => setSeleccionada(null)}
                aria-label="Cerrar"
                className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cargandoHilo ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Cargando...</div>
              ) : hilo.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Sin mensajes.</div>
              ) : (
                hilo.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-indigo-500/20 text-indigo-300" : "bg-muted/40 text-muted-foreground"}`}>
                      {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${m.role === "user" ? "bg-indigo-600/20 text-indigo-100" : "bg-muted/30"}`}>
                      {m.content}
                      {m.timestamp && (
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {new Date(m.timestamp).toLocaleString("es-ES")}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-400" />
            Conversaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lo que están escribiendo por el chat web y por WhatsApp, agrupado por producto
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchConversaciones} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Actualizar
        </Button>
      </div>

      {productos.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filtro === "todos" ? "bg-muted/40 border-border text-foreground" : "border-border/50 text-muted-foreground hover:bg-muted/20"}`}
          >
            Todos ({conversaciones.length})
          </button>
          {productos.map((p) => (
            <button
              key={p.id}
              onClick={() => setFiltro(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filtro === p.id ? COLOR_PRODUCTO[p.id] ?? "bg-muted/40 border-border" : "border-border/50 text-muted-foreground hover:bg-muted/20"}`}
            >
              {p.nombre} ({conteoPorProducto[p.id] ?? 0})
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm">
          {error}
        </div>
      )}

      {fallos.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm">
          Sin datos de: {fallos.map((f) => `${f.nombre} (${f.motivo})`).join(", ")}. El resto se muestra igual.
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Cargando conversaciones...</div>
      ) : visibles.length === 0 ? (
        <Card className="rounded-2xl glass border-gradient overflow-hidden">
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">
              {filtro === "todos"
                ? "Todavía no hay conversaciones registradas."
                : "Este producto todavía no tiene conversaciones."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {visibles.map((c) => (
            <div
              key={`${c.producto}:${c.telefono}`}
              onClick={() => abrirConversacion(c)}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/10 cursor-pointer transition-all hover:bg-muted/20"
            >
              <div className="p-2 rounded-lg bg-muted/30 shrink-0">
                {c.canal === "web" ? <Globe className="h-4 w-4 text-cyan-400" /> : <Phone className="h-4 w-4 text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className={`text-xs ${COLOR_PRODUCTO[c.producto] ?? ""}`}>
                    {c.producto_nombre}
                  </Badge>
                  <span className="font-semibold text-sm font-mono">{c.telefono}</span>
                  <Badge variant="outline" className="text-xs">
                    {c.canal === "web" ? "Web" : "WhatsApp"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{c.total_mensajes} mensajes</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {c.ultimo_rol === "user" ? "Cliente: " : "Bot: "}{c.ultimo_mensaje}
                </p>
              </div>
              {c.ultimo_timestamp && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(c.ultimo_timestamp).toLocaleString("es-ES")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
