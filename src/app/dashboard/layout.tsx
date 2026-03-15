"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  LayoutDashboard,
  Users2,
  CalendarDays,
  ClipboardList,
  Search,
  CheckSquare,
  Sparkles,
  CreditCard,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  TrendingUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ConfettiButton } from "@/components/ui/ConfettiButton";
import { ReactNode } from "react";
import { PyrizeLogo, PyrizeLogoIcon } from "@/components/ui/PyrizeLogo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ana Sayfa", icon: Home },
  { href: "/dashboard/sunumlar", label: "Sunumlar", icon: LayoutDashboard },
  { href: "/dashboard/haftalik-rapor/olustur", label: "Haftalık Rapor Hazırla", icon: FileText },
  { href: "/dashboard/crm", label: "CRM", icon: ClipboardList },
  { href: "/dashboard/todo", label: "Görevler", icon: CheckSquare },
  { href: "/dashboard/takvim", label: "Takvim", icon: CalendarDays },
  { href: "/dashboard/ciro-planlayici", label: "Ciro Planlayıcı", icon: TrendingUp },
  { href: "/dashboard/arama", label: "Arama", icon: Search },
  { href: "/dashboard/fotograf", label: "Pyrize AI", icon: Sparkles },
  { href: "/dashboard/krediler", label: "Kredi Paketleri", icon: CreditCard },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isExpanded = !collapsed || hovered;

  // Responsive kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sidebar genişliği - collapsed durumuna göre dinamik
  // Mobilde sidebar gizli olduğu için 0, desktop'ta genişliğe göre
  const sidebarWidth = isMobile ? 0 : isExpanded ? 256 : 64; // w-64 = 256px, w-16 = 64px

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
    setHovered(false);
  };

  const handleNavClick = () => {
    if (collapsed) {
      setCollapsed(false);
      setHovered(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-bg text-slate-300">
      <aside
        className={`fixed left-0 top-0 z-[998] hidden h-full flex-col border-r border-white/10 bg-[#050b1d]/80 backdrop-blur transition-all duration-300 ease-in-out md:flex ${isExpanded ? "w-64" : "w-16"} group`}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => collapsed && setHovered(false)}
      >
        {/* Logo Section */}
        <div className={`flex items-center ${collapsed && !hovered ? "justify-center px-2" : "justify-between px-5"} py-5 border-b border-white/[0.06] transition-all duration-300`}>
          <Link
            href="/"
            className={`flex items-center gap-2.5 transition-all duration-300 ${collapsed && !hovered ? "justify-center" : ""}`}
          >
            {collapsed && !hovered ? (
              <PyrizeLogoIcon className="h-8 w-8" />
            ) : (
              <PyrizeLogo variant="dark" className="h-6" />
            )}
          </Link>
          {(!collapsed || hovered) && (
            <button
              onClick={handleToggle}
              className="rounded-lg p-1.5 text-slate-500 transition-all duration-200 hover:text-white hover:bg-white/8"
              aria-label="Menüyü daralt"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`relative flex-1 space-y-0.5 overflow-y-scroll ${isExpanded ? "px-3" : "px-2"} py-4 transition-all duration-300 scrollbar-hide`}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`group relative flex w-full items-center gap-3 rounded-xl transition-all duration-200 ${
                  isExpanded ? "px-3 py-2.5" : "px-2 py-2.5 justify-center"
                } text-left ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {/* Active left indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-[#DBE64C] to-[#74C365]" />
                )}
                <span
                  className={`relative flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-200 ${
                    isExpanded ? "h-8 w-8" : "h-8 w-8"
                  } ${
                    isActive
                      ? "bg-gradient-to-br from-[#DBE64C]/20 to-[#74C365]/10 text-[#DBE64C]"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 1.75} />
                </span>
                {isExpanded && (
                  <span
                    className={`text-[13px] transition-opacity duration-200 ${isActive ? "font-600" : "font-[450]"}`}
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
          {/* Fade efekti */}
          <div className="pointer-events-none sticky bottom-0 h-10 bg-gradient-to-t from-[#050b1d]/95 via-[#050b1d]/50 to-transparent" />
        </nav>

        {/* Bottom Section */}
        <div className={`px-4 pb-8 pt-4 transition-all duration-300 ${collapsed && !hovered ? "px-2" : ""}`}>
          {isExpanded && (
            <ConfettiButton />
          )}
          {collapsed && !hovered && (
            <button
              onClick={handleToggle}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl p-2 text-slate-500 transition-all duration-200 hover:text-white hover:bg-white/5"
              aria-label="Menüyü genişlet"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      <div
        className="flex flex-1 flex-col transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <DashboardHeader sidebarWidth={sidebarWidth} />
        <main className="flex-1 pt-16">{children}</main>
      </div>
    </div>
  );
}

