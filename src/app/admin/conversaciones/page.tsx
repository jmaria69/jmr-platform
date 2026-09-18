"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { MessageCircle, Phone, Globe, RefreshCw, User, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatearFechaAgente } from "@/lib/fecha-agente";

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
  color: string;
}

interface FalloAgente {
  producto: string;
  nombre: string;
  motivo: string;
}

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
  const [errorHilo, setErrorHilo] = useState<string | null>(null);

  // Identifica la última petición de hilo lanzada: si el usuario abre otra
  // conversación antes de que llegue la anterior, la respuesta tardía se
  // descarta en vez de pintarse bajo la cabecera equivocada.
  const peticionHilo = useRef(0);

  const fetchConversaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conversaciones");
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        // El servidor distingue "no hay agentes configurados" de "el agente no
        // responde"; perder ese detalle deja al admin sin saber qué mirar.
        setError(data?.error ?? "No se pudo cargar la lista de conversaciones.");
        setConversaciones([]);
        setProductos([]);
        setFallos([]);
      } else {
        setConversaciones(data.conversaciones ?? []);
        setProductos(data.productos ?? []);
        setFallos(data.fallos ?? []);
        setError(null);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
      setConversaciones([]);
      setProductos([]);
      setFallos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversaciones();
  }, [fetchConversaciones]);

  // Si el producto filtrado desaparece (se quita su variable de entorno, por
  // ejemplo), el filtro dejaría la lista vacía sin botón con el que volver.
  useEffect(() => {
    if (filtro !== "todos" && !productos.some((p) => p.id === filtro)) {
      setFiltro("todos");
    }
  }, [productos, filtro]);

  const colorProducto = useCallback(
    (id: string) => productos.find((p) => p.id === id)?.color ?? "",
    [productos]
  );

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
    const peticion = ++peticionHilo.current;
    setSeleccionada(conversacion);
    setHilo([]);
    setErrorHilo(null);
    setCargandoHilo(true);
    try {
      const res = await fetch(
        `/api/admin/conversaciones/${encodeURIComponent(conversacion.telefono)}?producto=${encodeURIComponent(conversacion.producto)}`
      );
      const data = await res.json().catch(() => null);
      if (peticion !== peticionHilo.current) return;
      if (!res.ok) {
        // Sin esto, un 502 se vería como una conversación vacía.
        setErrorHilo(data?.error ?? "No se pudo cargar la conversación.");
      } else {
        setHilo(data.mensajes ?? []);
      }
    } catch {
      if (peticion === peticionHilo.current) {
        setErrorHilo("No se pudo cargar la conversación.");
      }
    } finally {
      if (peticion === peticionHilo.current) setCargandoHilo(false);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={seleccionada !== null} onOpenChange={(abierto) => !abierto && setSeleccionada(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl p-0 gap-0 max-h-[85dvh] flex flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2 flex-wrap min-w-0 pr-6 text-sm font-semibold">
              {seleccionada?.canal === "web" ? (
                <Globe className="h-4 w-4 shrink-0 text-cyan-400" />
              ) : (
                <Phone className="h-4 w-4 shrink-0 text-green-400" />
              )}
              <span className="font-mono truncate">{seleccionada?.telefono}</span>
              {seleccionada && (
                <Badge variant="outline" className={`text-xs ${colorProducto(seleccionada.producto)}`}>
                  {seleccionada.producto_nombre}
                </Badge>
              )}
            </DialogTitle>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
            {cargandoHilo ? (
              <div className="text-center py-10 text-muted-foreground text-sm">Cargando...</div>
            ) : errorHilo ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm">
                {errorHilo}
              </div>
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
                        {formatearFechaAgente(m.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

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
            type="button"
            onClick={() => setFiltro("todos")}
            aria-pressed={filtro === "todos"}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filtro === "todos" ? "bg-muted/40 border-border text-foreground" : "border-border/50 text-muted-foreground hover:bg-muted/20"}`}
          >
            Todos ({conversaciones.length})
          </button>
          {productos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setFiltro(p.id)}
              aria-pressed={filtro === p.id}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filtro === p.id ? p.color : "border-border/50 text-muted-foreground hover:bg-muted/20"}`}
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
            <p className="text-muted-foreground text-center px-4">
              {filtro === "todos"
                ? "Todavía no hay conversaciones registradas."
                : "Este producto todavía no tiene conversaciones."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {visibles.map((c) => (
            <button
              key={`${c.producto}:${c.telefono}`}
              type="button"
              onClick={() => abrirConversacion(c)}
              className="w-full text-left flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-border bg-muted/10 cursor-pointer transition-all hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="p-2 rounded-lg bg-muted/30 shrink-0">
                {c.canal === "web" ? <Globe className="h-4 w-4 text-cyan-400" /> : <Phone className="h-4 w-4 text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className={`text-xs ${colorProducto(c.producto)}`}>
                    {c.producto_nombre}
                  </Badge>
                  <span className="font-semibold text-sm font-mono truncate max-w-full">{c.telefono}</span>
                  <Badge variant="outline" className="text-xs">
                    {c.canal === "web" ? "Web" : "WhatsApp"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{c.total_mensajes} mensajes</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {c.ultimo_rol === "user" ? "Cliente: " : "Bot: "}{c.ultimo_mensaje}
                </p>
                {/* En móvil la fecha va aquí dentro: como columna propia dejaba
                    la fila sin ancho para las etiquetas. */}
                {c.ultimo_timestamp && (
                  <span className="sm:hidden block text-xs text-muted-foreground mt-1">
                    {formatearFechaAgente(c.ultimo_timestamp)}
                  </span>
                )}
              </div>
              {c.ultimo_timestamp && (
                <span className="hidden sm:block text-xs text-muted-foreground shrink-0">
                  {formatearFechaAgente(c.ultimo_timestamp)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
