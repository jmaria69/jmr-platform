"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWindowWidth } from "@/lib/use-window-width";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FolderKanban,
  KeyRound,
  Megaphone,
  ArrowLeft,
  LogOut,
  Activity,
  Gauge,
  Shield,
  Palette,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/app/actions/auth";
import { PraxiaLabLogo } from "@/components/praxia-lab-logo";
import { ResponsivePraxiaLabLogo } from "@/components/public/responsive-logo";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/crm", label: "CRM", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/campanas", label: "Campañas", icon: Megaphone },
  { href: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/apariencia", label: "Apariencia", icon: Palette },
  { href: "/admin/escalabilidad", label: "Escalabilidad", icon: Gauge },
  { href: "/admin/seguridad", label: "Seguridad", icon: Shield },
];

const settingsItems = [
  { href: "/admin/credenciales", label: "Credenciales", icon: KeyRound },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isDemoMode = pathname.includes('/demo');
  const { isMobile, setOpenMobile } = useSidebar();
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r border-purple-500/20 glass">
      <SidebarHeader className="border-b border-purple-500/20 px-4 py-3 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
            <ResponsivePraxiaLabLogo lg={32} md={28} sm={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
              Praxia<span className="text-sky-400">Labs</span>
            </span>
            <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em]">
              {isDemoMode ? 'Demo' : 'Admin Panel'}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    render={<Link href={item.href} onClick={closeOnMobile} />}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cuenta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    render={<Link href={item.href} onClick={closeOnMobile} />}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-500/20 p-4 bg-slate-950/50 backdrop-blur-md">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" onClick={closeOnMobile} />}>
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al sitio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {!isDemoMode && (
            <SidebarMenuItem>
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-800 transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </form>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}