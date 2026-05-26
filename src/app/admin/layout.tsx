import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-2 border-b px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-sm font-semibold">Panel de Administración</h1>
          </div>
          {session && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs gap-1">
                <ShieldCheck className="h-3 w-3" />
                {session.name}
              </Badge>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}