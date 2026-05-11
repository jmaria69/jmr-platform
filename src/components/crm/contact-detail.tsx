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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-3">{contact.name}</CardTitle>
            <Badge className={`${stageColors[contact.stage]} text-white mx-auto`}>
              {contact.stage.replace("-", " ").toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.company}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Creado: {new Date(contact.createdAt).toLocaleDateString("es")}</span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Valor del deal</p>
              <p className="text-3xl font-bold text-green-600">
                {contact.value.toLocaleString("es")}€
              </p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Etiquetas</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Notas</p>
              </div>
              <p className="text-sm text-muted-foreground">{contact.notes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historial de Interacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...contact.interactions].reverse().map((interaction, idx) => {
                const Icon = interactionIcon[interaction.type];
                return (
                  <div key={interaction.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-background">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      {idx < contact.interactions.length - 1 && (
                        <div className="flex-1 w-px bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {interactionLabel[interaction.type]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(interaction.date).toLocaleDateString("es", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{interaction.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
