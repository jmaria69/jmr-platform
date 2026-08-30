import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { findAllProjects, findProjectById } from "@/lib/repositories/projects.repository";
import { ProjectViewTracker } from "@/components/public/project-view-tracker";

// Prerenderiza los ids conocidos en build/deploy: un render completo (sin
// streaming de loading.tsx) es lo único que permite que notFound() fije un
// 404 real en la respuesta. Con dynamicParams = true (por defecto), un id
// nuevo creado después del deploy (los proyectos se gestionan en vivo desde
// /admin) se genera on-demand con el mismo render completo la primera vez
// que se visita, así que también recibe su status correcto (200 o 404).
export async function generateStaticParams() {
  const projects = await findAllProjects();
  return projects.map((p) => ({ id: p.id }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = await params;
    const project = await findProjectById(id);
    return {
        title: project?.name || "Proyecto",
        description: project?.description || "Detalle del proyecto",
    };
}

export default async function ProjectDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    const project = await findProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <ProjectViewTracker projectId={project.id} />
            <Link href="/laboratorio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4" />
                Volver a proyectos
            </Link>
            <div className="rounded-2xl glass border-gradient p-8">
                <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
                <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

                {project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t) => (
                            <Badge key={t} variant="secondary" className="text-sm px-3 py-1">
                                {t}
                            </Badge>
                        ))}
                    </div>
                )}

                {project.metrics && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {project.metrics.users != null && (
                            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                <Users className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold">{project.metrics.users}</p>
                                    <p className="text-xs text-muted-foreground">Usuarios activos</p>
                                </div>
                            </div>
                        )}
                        {project.metrics.rating != null && (
                            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                <Star className="h-5 w-5 text-amber-400" />
                                <div>
                                    <p className="text-2xl font-bold">{project.metrics.rating}</p>
                                    <p className="text-xs text-muted-foreground">Rating</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {project.videoUrl && (
                    <div className="mb-10">
                        <h3 className="text-lg font-semibold mb-4">Vídeo de presentación</h3>
                        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl">
                            <video
                                src={project.videoUrl}
                                controls
                                controlsList="nodownload"
                                className="w-full h-full"
                                preload="metadata"
                                playsInline
                            >
                                Tu navegador no soporta vídeo HTML5.
                            </video>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl text-white font-semibold transition hover:shadow-lg"
                            style={{ background: project.color }}
                        >
                            <ExternalLink className="inline h-4 w-4 mr-2" />
                            Ver demo
                        </a>
                    )}
                    {!project.url && project.status === 'beta' && (
                        <span className="px-6 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold">
                            🔨 En preproducción
                        </span>
                    )}
                    <Link href="/laboratorio" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition">
                        Otros proyectos
                    </Link>
                </div>
            </div>
        </section>
    );
}