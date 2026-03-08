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
import { ReactNode } from "react";

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
        {/* Logo Section - Her zaman görünür, simetrik */}
        <div className={`flex items-center ${collapsed && !hovered ? "justify-center px-2" : "justify-between px-4"} py-6 transition-all duration-300`}>
          <Link
            href="/"
            className={`flex items-center gap-2 text-white transition-all duration-300 ${collapsed && !hovered ? "justify-center" : ""}`}
          >
            <span className={`logo-text font-bold uppercase tracking-tight transition-all duration-300 ${collapsed && !hovered ? "text-sm" : "text-xl"}`}>
              {collapsed && !hovered ? "P" : "PYRIZE"}
            </span>
            {(!collapsed || hovered) && (
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </Link>
          {(!collapsed || hovered) && (
            <button
              onClick={handleToggle}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white transition-all duration-200 hover:border-cyan-300/60 hover:bg-white/10 hover:scale-110"
              aria-label="Menüyü daralt"
            >
              <ChevronsLeft className="h-4 w-4 text-cyan-200" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`relative flex-1 space-y-1 overflow-y-scroll ${isExpanded ? "px-4" : "px-2"} pb-6 transition-all duration-300 scrollbar-hide`}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`group flex w-full items-center gap-3 rounded-xl border transition-all duration-200 ${isExpanded ? "px-4 py-3" : "px-2 py-2 justify-center"
                  } text-left text-sm font-medium ${isActive
                    ? "border-cyan-400/40 bg-white/10 text-white shadow-[0_12px_30px_rgba(14,165,233,0.12)]"
                    : "border-transparent text-slate-300 hover:border-cyan-300/30 hover:bg-white/5 hover:text-white hover:scale-[1.02]"
                  }`}
              >
                <span
                  className={`flex items-center justify-center rounded-lg transition-all duration-200 ${isExpanded ? "h-10 w-10" : "h-9 w-9"
                    } ${isActive
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "bg-white/5 text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-200"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {isExpanded && (
                  <span className="transition-opacity duration-200">{item.label}</span>
                )}
              </Link>
            );
          })}
          {/* Fade efekti - Alt kısımda kaydırılabilir olduğunu gösterir */}
          <div className="pointer-events-none sticky bottom-0 h-12 bg-gradient-to-t from-[#050b1d]/95 via-[#050b1d]/50 to-transparent" />
        </nav>

        {/* Bottom Section */}
        <div className={`px-4 pb-8 pt-4 transition-all duration-300 ${collapsed && !hovered ? "px-2" : ""}`}>
          {isExpanded && (
            <Link
              href="/dashboard/olustur"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#24d6a4] px-4 py-3 text-sm font-semibold text-page-bg shadow-[0_0_24px_rgba(36,214,164,0.35)] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            >
              Yeni Sunum Oluştur
            </Link>
          )}
          {collapsed && !hovered && (
            <button
              onClick={handleToggle}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-white transition-all duration-200 hover:border-cyan-300/40 hover:bg-white/10 hover:scale-110"
              aria-label="Menüyü genişlet"
            >
              <ChevronsRight className="h-4 w-4 text-cyan-200" />
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

