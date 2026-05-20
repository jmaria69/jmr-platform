import type { Metadata } from "next";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export const metadata: Metadata = {
  title: "Contacto",
  description: "Hablemos de tu próximo proyecto. Contacta con nosotros sin compromisos.",
};

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contacto</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Cuéntanos sobre tu proyecto. Te responderemos en menos de 24 horas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
            <CardDescription>
              Rellena el formulario y nos pondremos en contacto contigo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" placeholder="Tu empresa (opcional)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Proyecto de interés</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin-app">AdminApp</SelectItem>
                      <SelectItem value="crm-it">CRM IT</SelectItem>
                      <SelectItem value="landing-inmobiliaria">Portal Inmobiliario</SelectItem>
                      <SelectItem value="app-voz">AppVoz</SelectItem>
                      <SelectItem value="mejores-productos">MejoresProductos</SelectItem>
                      <SelectItem value="olga-ai">OLGA.ai</SelectItem>
                      <SelectItem value="custom">Proyecto personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Cuéntanos sobre tu proyecto, necesidades o preguntas..."
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto gap-2">
                <Send className="h-4 w-4" />
                Enviar mensaje
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <a href="mailto:jmaria.romero79@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">jmaria.romero79@gmail.com</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Teléfono</p>
                <a href="tel:+34655792350" className="text-sm text-muted-foreground hover:text-foreground transition-colors">+34 655 792 350</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Ubicación</p>
                <p className="text-sm text-muted-foreground">Madrid, España</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-sm font-semibold mb-2">Horario de atención</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Lunes - Viernes: 9:00 - 19:00</p>
                <p>Sábados: 10:00 - 14:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
