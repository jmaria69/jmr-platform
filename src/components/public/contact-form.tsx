"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    empresa: "",
    proyecto: "Automatizacion de procesos",
    mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar. Inténtalo de nuevo.");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <Zap className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-2">Mensaje recibido</h3>
        <p className="text-gray-400">Te contactamos en menos de 2 horas. Sin bots.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            Nombre *
          </label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            Email *
          </label>
          <input
            type="email"
            placeholder="tu@empresa.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          Empresa
        </label>
        <input
          type="text"
          placeholder="Nombre de tu empresa (opcional)"
          value={form.empresa}
          onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          ¿Qué quieres automatizar? *
        </label>
        <select
          value={form.proyecto}
          onChange={(e) => setForm((f) => ({ ...f, proyecto: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-purple-500/30 focus:border-purple-500 focus:outline-none transition"
        >
          <option className="bg-background text-foreground" value="Automatizacion de procesos">Automatización de procesos</option>
          <option className="bg-background text-foreground" value="CRM y seguimiento de clientes">CRM y seguimiento de clientes</option>
          <option className="bg-background text-foreground" value="Panel de administracion con IA">Panel de administración con IA</option>
          <option className="bg-background text-foreground" value="Agente IA para operaciones">Agente IA para operaciones</option>
          <option className="bg-background text-foreground" value="Otro">Otro</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          Cuéntanos más *
        </label>
        <textarea
          placeholder="¿Qué proceso haces a mano ahora? ¿Cuánto tiempo te lleva? Cualquier contexto que nos ayude a preparar la demo."
          value={form.mensaje}
          onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition resize-none"
        />
      </div>
      {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === "sending" ? "Enviando..." : "Reservar demo gratuita"}
      </button>
      <p className="text-center text-xs text-gray-500">
        Sin compromiso. Sin tarjeta. Respuesta en menos de 2 horas.
      </p>
    </form>
  );
}
