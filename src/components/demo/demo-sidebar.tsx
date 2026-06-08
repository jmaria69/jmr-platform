"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FolderKanban,
  Shield,
  ArrowLeft,
  LogIn,
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
} from "@/components/ui/sidebar";
import { PraxiaLabLogo } from "@/components/praxia-lab-logo";

const menuItems = [
  { href: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/demo/crm", label: "CRM", icon: Users },
  { href: "/demo/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/demo/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/demo/seguridad", label: "Seguridad", icon: Shield },
];

export function DemoSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-purple-500/20 glass">
      <SidebarHeader className="border-b border-purple-500/20 px-4 py-3 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
            <PraxiaLabLogo size={32} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
              Praxia<span className="text-sky-400">Lab</span>
            </span>
            <span className="text-[9px] font-semibold text-amber-400/70 uppercase tracking-[0.2em]">
              Demo
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Demo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    render={<Link href={item.href} />}
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
            <SidebarMenuButton render={<Link href="/" />}>
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al sitio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/login" />}
              className="text-amber-400 hover:text-amber-300"
            >
              <LogIn className="h-4 w-4" />
              <span>Iniciar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
