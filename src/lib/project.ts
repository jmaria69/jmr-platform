import { Project } from "@/types";

export const projects: Project[] = [
    {
        id: "admin-app",
        name: "Admin Dashboard",
        description: "Sistema de administración con autenticación JWT",
        longDescription: "Dashboard administrativo completo con login seguro",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        status: "production",
        category: "web",
        url: "https://praxialabs.com/admin",
        github: "https://github.com/jmaria69/praxialabs",
        image: "/projects/admin.jpg",
        color: "#0891b2",
        metrics: {
            users: 150,
            revenue: 2500,
            rating: 4.8,
        },
    },
    {
        id: "vozapp",
        name: "VozApp",
        description: "Transcripción local con privacidad",
        longDescription: "App desktop para transcribir audio sin enviar datos a servidores",
        tech: ["Python", "PySide6", "Whisper", "SQLite"],
        status: "development",
        category: "desktop",
        url: undefined,
        github: "https://github.com/jmaria69/vozapp",
        image: "/projects/vozapp.jpg",
        color: "#8b5cf6",
        metrics: {
            users: undefined,
            revenue: undefined,
            rating: undefined,
        },
    },
];