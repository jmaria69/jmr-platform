import type { Metadata } from "next";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const metadata: Metadata = {
    title: "Demo — Proyectos",
};

export default function DemoProyectosPage() {
    return <ProjectsManager isReadOnly={true} />;
}
