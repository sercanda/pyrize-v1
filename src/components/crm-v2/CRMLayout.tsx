"use client";

import {
  LayoutDashboard,
  Users2,
  Building2,
  TrendingUp,
  Activity,
} from "lucide-react";
import { CRMNavTabs } from "@/components/ui/AppTabGroup";

export type CRMTab = "dashboard" | "musteriler" | "mulkler" | "firsatlar" | "aktiviteler";

const TABS: { key: CRMTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "musteriler", label: "Müşteriler", icon: Users2 },
  { key: "mulkler", label: "Mülkler", icon: Building2 },
  { key: "firsatlar", label: "Fırsatlar", icon: TrendingUp },
  { key: "aktiviteler", label: "Aktiviteler", icon: Activity },
];

interface CRMLayoutProps {
  activeTab: CRMTab;
  onTabChange: (tab: CRMTab) => void;
  children: React.ReactNode;
}

export function CRMLayout({ activeTab, onTabChange, children }: CRMLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-56 flex-col border-r border-white/10 bg-white/[0.02] p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 px-3">
          CRM
        </h2>
        <CRMNavTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={onTabChange}
          layout="sidebar"
        />
      </aside>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#050b1d]/95 backdrop-blur-xl">
        <CRMNavTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={onTabChange}
          layout="mobile"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
