"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  MessageSquare,
  Video,
  FileText,
  PhoneCall,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CRMContact, Interaction } from "@/types";

const interactionIcon: Record<Interaction["type"], typeof Mail> = {
  email: Mail,
  call: PhoneCall,
  meeting: Video,
  note: StickyNote,
  demo: FileText,
};

const interactionLabel: Record<Interaction["type"], string> = {
  email: "Email",
  call: "Llamada",
  meeting: "Reunión",
  note: "Nota",
  demo: "Demo",
};

const stageColors: Record<string, string> = {
  lead: "bg-slate-500",
  contacted: "bg-blue-500",
  qualified: "bg-cyan-500",
  proposal: "bg-purple-500",
  negotiation: "bg-amber-500",
  "closed-won": "bg-green-500",
  "closed-lost": "bg-red-500",
};

export function ContactDetail({ contact }: { contact: CRMContact }) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Link href="/admin/crm">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al CRM
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="lg:col-span-1 group relative rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover p-5">
          <div className="text-center space-y-3">
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-white">{contact.name}</h2>
              <Badge className={`${stageColors[contact.stage]} text-white`}>
                {contact.stage.replace("-", " ").toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="h-4 w-4 text-slate-500" />
              <span>{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Building className="h-4 w-4 text-slate-500" />
                <span>{contact.company}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Creado: {new Date(contact.createdAt).toLocaleDateString("es")}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-xs text-slate-400 mb-2 font-medium">VALOR DEL DEAL</p>
            <p className="text-3xl font-bold text-green-400">
              {contact.value.toLocaleString("es")}€
            </p>
          </div>

          {contact.tags.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-slate-500" />
                <p className="text-xs text-slate-400 font-medium">ETIQUETAS</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {contact.notes && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                <p className="text-xs text-slate-400 font-medium">NOTAS</p>
              </div>
              <p className="text-sm text-slate-300">{contact.notes}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 group relative rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover p-5">
          <h3 className="text-lg font-semibold text-white mb-6">Historial de Interacciones</h3>
          <div className="space-y-6">
            {contact.interactions && contact.interactions.length > 0 ? (
              [...contact.interactions].reverse().map((interaction, idx) => {
                const Icon = interactionIcon[interaction.type];
                return (
                  <div key={interaction.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/10 bg-white/5">
                        <Icon className="h-4 w-4 text-cyan-400" />
                      </div>
                      {idx < contact.interactions.length - 1 && (
                        <div className="flex-1 w-px bg-white/10 mt-2" style={{ height: "2rem" }} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-cyan-300">
                          {interactionLabel[interaction.type]}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(interaction.date).toLocaleDateString("es", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{interaction.summary}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">Sin interacciones registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
