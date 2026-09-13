"use client";

import { useEffect, useState, useCallback } from "react";
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
}

interface MensajeHilo {
  role: string;
  content: string;
  timestamp: string | null;
}

export default function ConversacionesPage() {
  const [conversaciones, setConversaciones] = useState<ConversacionResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [hilo, setHilo] = useState<MensajeHilo[]>([]);
  const [cargandoHilo, setCargandoHilo] = useState(false);

  const fetchConversaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conversaciones");
      if (!res.ok) {
        setError("No se pudo cargar — comprueba que el agente esté encendido y AGENT_ADMIN_KEY configurado.");
        setConversaciones([]);
        return;
      }
      const data = await res.json();
      setConversaciones(data.conversaciones ?? []);
      setError(null);
    } catch {
      setError("No se pudo conectar con el agente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversaciones();
  }, [fetchConversaciones]);

  const abrirConversacion = async (telefono: string) => {
    setSeleccionada(telefono);
    setCargandoHilo(true);
    try {
      const res = await fetch(`/api/admin/conversaciones/${encodeURIComponent(telefono)}`);
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
                {seleccionada.startsWith("web-") ? <Globe className="h-4 w-4 text-cyan-400" /> : <Phone className="h-4 w-4 text-green-400" />}
                {seleccionada}
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
            Lo que están escribiendo por el chat web y por WhatsApp (Praxia Assist)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchConversaciones} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Actualizar
        </Button>
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Cargando conversaciones...</div>
      ) : conversaciones.length === 0 ? (
        <Card className="rounded-2xl glass border-gradient overflow-hidden">
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">Todavía no hay conversaciones registradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversaciones.map((c) => (
            <div
              key={c.telefono}
              onClick={() => abrirConversacion(c.telefono)}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/10 cursor-pointer transition-all hover:bg-muted/20"
            >
              <div className="p-2 rounded-lg bg-muted/30 shrink-0">
                {c.canal === "web" ? <Globe className="h-4 w-4 text-cyan-400" /> : <Phone className="h-4 w-4 text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
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
