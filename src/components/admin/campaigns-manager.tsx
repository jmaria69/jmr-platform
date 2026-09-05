"use client";

import { useState } from "react";
import { Plus, Copy, Check, Trash2, ExternalLink, MousePointerClick, Users, TrendingUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CampaignWithStats } from "@/lib/repositories/campaigns.repository";

const CHANNELS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "twitter", label: "X / Twitter" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "evento", label: "Evento / Presencial" },
  { value: "otro", label: "Otro" },
];

const STATUS_STYLES: Record<string, string> = {
  activa: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pausada: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  finalizada: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  borrador: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

export function CampaignsManager({ initialCampaigns }: { initialCampaigns: CampaignWithStats[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    name: "",
    slug: "",
    channel: "linkedin",
    targetUrl: "https://demcore.praxialabs.com",
    description: "",
    utmSource: "linkedin",
    utmMedium: "social",
  });

  const shortUrl = (slug: string) => `https://praxialabs.com/c/${slug}`;

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(shortUrl(slug));
    setCopied(slug);
    setTimeout(() => setCopied(null), 1800);
  };

  const createCampaign = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, utmCampaign: form.slug }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message || json?.error || "Error al crear la campaña");
        return;
      }
      setCampaigns((prev) => [json.data, ...prev]);
      setOpen(false);
      setForm({ name: "", slug: "", channel: "linkedin", targetUrl: "https://demcore.praxialabs.com", description: "", utmSource: "linkedin", utmMedium: "social" });
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (c: CampaignWithStats) => {
    const next = c.status === "activa" ? "pausada" : "activa";
    const res = await fetch(`/api/campaigns/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) setCampaigns((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
  };

  const removeCampaign = async (c: CampaignWithStats) => {
    if (!confirm(`¿Eliminar la campaña «${c.name}» y todos sus clicks registrados?`)) return;
    const res = await fetch(`/api/campaigns/${c.id}`, { method: "DELETE" });
    if (res.ok) setCampaigns((prev) => prev.filter((x) => x.id !== c.id));
  };

  const approveDraft = async (c: CampaignWithStats) => {
    const res = await fetch(`/api/campaigns/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "activa" }),
    });
    if (res.ok) setCampaigns((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: "activa" } : x)));
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const totals = campaigns.reduce(
    (acc, c) => ({ total: acc.total + c.stats.total, last7d: acc.last7d + c.stats.last7d, uniques: acc.uniques + c.stats.uniques }),
    { total: 0, last7d: 0, uniques: 0 }
  );

  return (
    <div className="space-y-6">
      {/* KPIs globales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clicks totales</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totals.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Últimos 7 días</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totals.last7d}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visitantes únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totals.uniques}</div></CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Nueva campaña
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Nueva campaña</DialogTitle>
              <DialogDescription>
                Se genera un enlace corto rastreable en praxialabs.com/c/&lt;slug&gt;.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="c-name">Nombre</Label>
                <Input id="c-name" value={form.name} placeholder="Lanzamiento Demo CORE OPS"
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="c-slug">Slug (enlace corto)</Label>
                  <Input id="c-slug" value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Canal</Label>
                  <Select value={form.channel} onValueChange={(v) => setForm((f) => ({ ...f, channel: v || "linkedin", utmSource: v || "linkedin" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((ch) => <SelectItem key={ch.value} value={ch.value}>{ch.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-url">URL de destino</Label>
                <Input id="c-url" value={form.targetUrl}
                  onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-desc">Descripción (opcional)</Label>
                <Textarea id="c-desc" rows={2} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              {form.slug && (
                <p className="text-xs text-muted-foreground">
                  Enlace: <span className="font-mono text-foreground">{shortUrl(form.slug)}</span>
                  {" → "}destino con <span className="font-mono">utm_source={form.utmSource}&utm_campaign={form.slug}</span>
                </p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={createCampaign} disabled={saving || !form.name || !form.slug || !form.targetUrl}>
                  {saving ? "Creando…" : "Crear campaña"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de campañas */}
      <div className="grid gap-4">
        {campaigns.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Sin campañas todavía. Crea la primera y comparte su enlace corto.
            </CardContent>
          </Card>
        )}
        {campaigns.map((c) => {
          const isDraft = c.status === "borrador";
          const isOpen = expanded.has(c.id);
          return (
            <Card key={c.id}>
              <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{c.name}</span>
                    <Badge variant="outline" className={STATUS_STYLES[c.status] || ""}>
                      {isDraft && <Sparkles className="mr-1 h-3 w-3" />}
                      {isDraft ? "Borrador IA" : c.status}
                    </Badge>
                    <Badge variant="outline">{c.channel}</Badge>
                  </div>
                  {c.description && <p className="mt-1 truncate text-sm text-muted-foreground">{c.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <code className="rounded bg-muted px-2 py-0.5 font-mono">{shortUrl(c.slug)}</code>
                    <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => copyLink(c.slug)}>
                      {copied === c.slug ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <a href={c.targetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                      destino <ExternalLink className="h-3 w-3" />
                    </a>
                    {isDraft && (
                      <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => toggleExpanded(c.id)}>
                        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {isOpen ? "Ocultar propuesta" : "Ver propuesta"}
                      </Button>
                    )}
                  </div>
                  {isDraft && isOpen && (
                    <div className="mt-4 space-y-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                      {c.videoUrl && (
                        <video controls src={c.videoUrl} className="max-h-80 w-full rounded-md bg-black" />
                      )}
                      {c.script && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guion</p>
                          <p className="whitespace-pre-line text-sm">{c.script}</p>
                        </div>
                      )}
                      {c.researchNotes && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Investigación</p>
                          <p className="whitespace-pre-line text-sm text-muted-foreground">{c.researchNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  <div className="text-center">
                    <div className="text-xl font-bold">{c.stats.total}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{c.stats.last7d}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">7 días</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{c.stats.uniques}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Únicos</div>
                  </div>
                  <div className="flex gap-1">
                    {isDraft ? (
                      <Button size="sm" variant="outline" onClick={() => approveDraft(c)}>
                        Aprobar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(c)}>
                        {c.status === "activa" ? "Pausar" : "Activar"}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => removeCampaign(c)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
