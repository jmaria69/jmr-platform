"use client";

import { useEffect, useRef, useState } from "react";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL || "http://127.0.0.1:8010";
const ACCENT = "#7c3aed";

type Msg = { role: "user" | "bot"; text: string };

export default function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const telRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tel = localStorage.getItem("agentkit_tel");
    if (!tel) {
      tel = "web-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("agentkit_tel", tel);
    }
    telRef.current = tel;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const texto = input.trim();
    if (!texto || loading) return;
    setMsgs((m) => [...m, { role: "user", text: texto }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch(`${AGENT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Bypass-Tunnel-Reminder": "true" },
        body: JSON.stringify({ telefono: telRef.current, mensaje: texto }),
      });
      const data = await r.json();
      setMsgs((m) => [...m, { role: "bot", text: data.respuesta || "..." }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "bot", text: "No puedo conectar ahora mismo. Intenta de nuevo en un momento." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, fontFamily: "sans-serif" }}>
      {open && (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#14121f",
            borderRadius: 12,
            border: "1px solid rgba(124,58,237,0.35)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <div style={{ background: `linear-gradient(135deg, ${ACCENT}, #22d3ee)`, color: "#fff", padding: "10px 14px", fontWeight: 600 }}>
            Habla con Praxia Labs
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 10, background: "#0f0d18" }}>
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.role === "user" ? ACCENT : "#1e1b2e",
                  color: "#fff",
                  marginLeft: m.role === "user" ? "auto" : 0,
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  marginBottom: 6,
                  whiteSpace: "pre-wrap",
                  fontSize: 14,
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && <div style={{ fontSize: 13, color: "#9aa4bd" }}>escribiendo…</div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ display: "flex", padding: 8, borderTop: "1px solid rgba(124,58,237,0.25)", background: "#14121f" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                border: "1px solid rgba(124,58,237,0.35)",
                borderRadius: 20,
                padding: "8px 12px",
                fontSize: 14,
                color: "#fff",
                background: "#1e1b2e",
              }}
            />
            <button
              onClick={send}
              style={{
                marginLeft: 6,
                background: `linear-gradient(135deg, ${ACCENT}, #22d3ee)`,
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${ACCENT}, #22d3ee)`,
          color: "#fff",
          border: "none",
          fontSize: 24,
          boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
          cursor: "pointer",
        }}
        aria-label="Abrir chat"
      >
        💬
      </button>
    </div>
  );
}
