"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

const STRINGS = {
  es: {
    sentTitle: "Mensaje recibido",
    sentBody: "Te contactamos en menos de 2 horas. Sin bots.",
    name: "Nombre *",
    namePh: "Tu nombre",
    email: "Email *",
    emailPh: "tu@empresa.com",
    company: "Empresa",
    companyPh: "Nombre de tu empresa (opcional)",
    projectLabel: "¿Qué quieres automatizar? *",
    projectOptions: [
      { value: "Automatizacion de procesos", label: "Automatización de procesos" },
      { value: "CRM y seguimiento de clientes", label: "CRM y seguimiento de clientes" },
      { value: "Panel de administracion con IA", label: "Panel de administración con IA" },
      { value: "Agente IA para operaciones", label: "Agente IA para operaciones" },
      { value: "Otro", label: "Otro" },
    ],
    messageLabel: "Cuéntanos más *",
    messagePh: "¿Qué proceso haces a mano ahora? ¿Cuánto tiempo te lleva? Cualquier contexto que nos ayude a preparar la demo.",
    genericSendError: "Error al enviar",
    genericSendErrorRetry: "Error al enviar. Inténtalo de nuevo.",
    sending: "Enviando...",
    submit: "Reservar demo gratuita",
    footer: "Sin compromiso. Sin tarjeta. Respuesta en menos de 2 horas.",
  },
  en: {
    sentTitle: "Message received",
    sentBody: "We'll reach out within 2 hours. No bots.",
    name: "Name *",
    namePh: "Your name",
    email: "Email *",
    emailPh: "you@company.com",
    company: "Company",
    companyPh: "Your company name (optional)",
    projectLabel: "What do you want to automate? *",
    projectOptions: [
      { value: "Automatizacion de procesos", label: "Process automation" },
      { value: "CRM y seguimiento de clientes", label: "CRM and customer follow-up" },
      { value: "Panel de administracion con IA", label: "AI-powered admin panel" },
      { value: "Agente IA para operaciones", label: "AI agent for operations" },
      { value: "Otro", label: "Other" },
    ],
    messageLabel: "Tell us more *",
    messagePh: "What process do you do by hand today? How long does it take? Any context that helps us prep the demo.",
    genericSendError: "Failed to send",
    genericSendErrorRetry: "Failed to send. Please try again.",
    sending: "Sending...",
    submit: "Book a free demo",
    footer: "No commitment. No card. Response within 2 hours.",
  },
} as const;

export function ContactForm({ lang = "es" }: { lang?: "es" | "en" }) {
  const t = STRINGS[lang];
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
      if (!res.ok) throw new Error(data.message || t.genericSendError);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.genericSendErrorRetry);
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <Zap className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-2">{t.sentTitle}</h3>
        <p className="text-gray-400">{t.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            {t.name}
          </label>
          <input
            type="text"
            placeholder={t.namePh}
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            required
            suppressHydrationWarning
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            {t.email}
          </label>
          <input
            type="email"
            placeholder={t.emailPh}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            suppressHydrationWarning
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          {t.company}
        </label>
        <input
          type="text"
          placeholder={t.companyPh}
          value={form.empresa}
          onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
          suppressHydrationWarning
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          {t.projectLabel}
        </label>
        <select
          value={form.proyecto}
          onChange={(e) => setForm((f) => ({ ...f, proyecto: e.target.value }))}
          required
          suppressHydrationWarning
          className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-purple-500/30 focus:border-purple-500 focus:outline-none transition"
        >
          {t.projectOptions.map((opt) => (
            <option key={opt.value} className="bg-background text-foreground" value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          {t.messageLabel}
        </label>
        <textarea
          placeholder={t.messagePh}
          value={form.mensaje}
          onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
          required
          rows={4}
          suppressHydrationWarning
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition resize-none"
        />
      </div>
      {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === "sending" ? t.sending : t.submit}
      </button>
      <p className="text-center text-xs text-gray-500">
        {t.footer}
      </p>
    </form>
  );
}
