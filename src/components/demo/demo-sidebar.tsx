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
import { ResponsivePraxiaLabLogo } from "@/components/public/responsive-logo";

const menuItems = [
  { href: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/demo/crm", label: "CRM", icon: Users },
  { href: "/demo/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/demo/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/demo/seguridad", label: "Seguridad", icon: Shield },
];

export function DemoSidebar() {
  const pathname = usePathname();
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
              Praxia<span className="text-sky-400">Lab</span>
            </span>
            <span className="text-[9px] font-semibold text-sky-400 uppercase tracking-[0.2em]">
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
