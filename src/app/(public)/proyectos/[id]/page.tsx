import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { findProjectById } from "@/lib/repositories/projects.repository";

export const dynamic = "force-dynamic";

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
        return <div className="text-center py-20">Proyecto no encontrado</div>;
    }

    return (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <Link href="/proyectos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4" />
                Volver a proyectos
            </Link>
            <div className="rounded-2xl glass border-gradient p-8">
                <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
                <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
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
                    <Link href="/proyectos" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition">
                        Otros proyectos
                    </Link>
                </div>
            </div>
        </section>
    );
}