import type { Metadata } from "next";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const metadata: Metadata = {
  title: "Gestión de Proyectos",
};

export default function AdminProjectsPage() {
  return <ProjectsManager />;
}
