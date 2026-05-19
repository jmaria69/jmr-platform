import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Globe, Star, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { findProjectById } from "@/lib/repositories/projects.repository";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await findProjectById(id);
  if (!project) return { title: "Proyecto no encontrado" };
  return {
    title: project.name,
    description: project.description,
  };
}

const statusLabel = { production: "Producción", beta: "Beta", development: "Desarrollo" } as const;

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await findProjectById(id);
  if (!project) notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link href="/proyectos">
        <Button variant="ghost" size="sm" className="gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="h-2 w-24 rounded-full" style={{ backgroundColor: project.color }} />
        <h1 className="text-3xl sm:text-4xl font-bold">{project.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge>{statusLabel[project.status]}</Badge>
          <Badge variant="outline">{project.category}</Badge>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Description */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-muted-foreground">{project.longDescription}</p>
      </div>

      {/* Tech stack */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Stack Tecnológico</h3>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Badge key={t} variant="secondary" className="text-sm px-3 py-1">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Metrics */}
      {project.metrics && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {project.metrics.users != null && (
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project.metrics.users}</p>
                  <p className="text-xs text-muted-foreground">Usuarios activos</p>
                </div>
              </CardContent>
            </Card>
          )}
          {project.metrics.rating != null && (
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project.metrics.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </CardContent>
            </Card>
          )}
          {project.metrics.revenue != null && (
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project.metrics.revenue.toLocaleString("es")}€</p>
                  <p className="text-xs text-muted-foreground">Ingresos mensuales</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Video de presentación */}
      {project.videoUrl && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Vídeo de presentación</h3>
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video">
            <video
              src={project.videoUrl}
              controls
              poster=""
              className="w-full h-full object-cover"
              preload="metadata"
            >
              Tu navegador no soporta vídeo HTML5.
            </video>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-wrap gap-4">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Ver proyecto
            </Button>
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              Código fuente
            </Button>
          </a>
        )}
        <Link href="/contacto">
          <Button variant="outline">Solicitar demo</Button>
        </Link>
      </div>
    </section>
  );
}
