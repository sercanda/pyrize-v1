"use client";

import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const PROFILE = {
  name: "Ece Yılmaz",
  email: "ece@pyrize.app",
  role: "Broker Owner",
  avatarUrl: "",
};

interface DashboardHeaderProps {
  sidebarWidth: number;
}

export function DashboardHeader({ sidebarWidth }: DashboardHeaderProps) {
  return (
    <header
      className="fixed top-0 right-0 z-[999] h-16 border-b border-white/10 bg-[#050b1d]/95 backdrop-blur-md transition-all duration-300 ease-in-out"
      style={{ 
        left: `${sidebarWidth}px`,
        width: sidebarWidth > 0 ? `calc(100% - ${sidebarWidth}px)` : "100%"
      }}
    >
      <div className="flex h-full w-full min-w-0 items-center justify-between px-4 md:px-6 lg:px-10">
        {/* Sol taraf - Mobil için logo */}
        <div className="flex flex-shrink-0 items-center md:hidden">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="logo-text font-bold text-lg uppercase tracking-tight">PYRIZE</span>
            <span className="h-2 w-2 rounded-full bg-pink-500" />
          </Link>
        </div>

        {/* Boş alan - Desktop'ta */}
        <div className="hidden flex-1 md:block" />

        {/* Sağ taraf - Profil ve Yeni Sunum butonu - Her zaman görünür ve sabit */}
        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            <ProfileDropdown
              name={PROFILE.name}
              email={PROFILE.email}
              role={PROFILE.role}
              avatarUrl={PROFILE.avatarUrl || undefined}
              onLogout={() => console.log("logout")}
            />
          </div>
          <Link
            href="/dashboard/olustur"
            className="inline-flex flex-shrink-0 items-center whitespace-nowrap rounded-full bg-[#24d6a4] px-3 py-2 text-xs font-semibold text-page-bg shadow-[0_0_18px_rgba(36,214,164,0.35)] transition hover:opacity-90 md:px-4 md:text-sm"
          >
            <span className="hidden sm:inline">Yeni Sunum</span>
            <span className="sm:hidden">Yeni</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

