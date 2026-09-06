import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DemoSidebar } from "@/components/demo/demo-sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DemoSidebar />
      <SidebarInset className="bg-transparent">
        <header className="flex h-14 items-center justify-between gap-2 border-b border-purple-500/20 bg-slate-950/50 backdrop-blur-md px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hover:bg-purple-500/20 hover:text-purple-300" />
            <Separator orientation="vertical" className="h-6 bg-purple-500/20" />
            <h1 className="text-sm font-semibold text-purple-100">Panel de Demostración</h1>
          </div>
          <Badge variant="outline" className="bg-slate-900/50 text-sky-400 text-xs gap-1.5">
            <Eye className="h-3 w-3" />
            Modo Demo — Datos simulados
          </Badge>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
