"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Phone,
  CheckCircle2,
  FileText,
  Handshake,
  Trophy,
  XCircle,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CRMContact } from "@/types";

const stages = [
  { id: "lead", label: "Leads", icon: UserPlus, color: "bg-slate-500" },
  { id: "contacted", label: "Contactados", icon: Phone, color: "bg-blue-500" },
  { id: "qualified", label: "Cualificados", icon: CheckCircle2, color: "bg-cyan-500" },
  { id: "proposal", label: "Propuesta", icon: FileText, color: "bg-purple-500" },
  { id: "negotiation", label: "Negociación", icon: Handshake, color: "bg-amber-500" },
  { id: "closed-won", label: "Ganados", icon: Trophy, color: "bg-green-500" },
  { id: "closed-lost", label: "Perdidos", icon: XCircle, color: "bg-red-500" },
] as const;

interface PipelineProps {
  contacts: CRMContact[];
}

function ContactCard({ contact }: { contact: CRMContact }) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Link href={`/admin/crm/${contact.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{contact.name}</p>
              <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-600">
              {contact.value.toLocaleString("es")}€
            </span>
            <div className="flex gap-1">
              {contact.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(contact.lastContact).toLocaleDateString("es")}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {contact.interactions.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CRMPipeline({ contacts }: PipelineProps) {
  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((stage) => {
          const stageContacts = contacts.filter((c) => c.stage === stage.id);
          const totalValue = stageContacts.reduce((sum, c) => sum + c.value, 0);
          return (
            <div key={stage.id} className="flex items-center gap-2 p-2 rounded-lg border bg-card">
              <div className={`h-2 w-2 rounded-full ${stage.color}`} />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{stage.label}</p>
                <p className="text-xs text-muted-foreground">{stageContacts.length} · {totalValue.toLocaleString("es")}€</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-[900px]">
          {stages.map((stage) => {
            const stageContacts = contacts.filter((c) => c.stage === stage.id);
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`flex h-6 w-6 items-center justify-center rounded ${stage.color} text-white`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {stageContacts.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stageContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                  {stageContacts.length === 0 && (
                    <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      Sin contactos
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
