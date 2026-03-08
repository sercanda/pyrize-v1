"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users2,
  Building2,
  TrendingUp,
  Activity,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-56 flex-col border-r border-white/10 bg-white/[0.02] p-4 gap-1">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 px-3">
          CRM
        </h2>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border border-cyan-400/40 bg-white/10 text-white shadow-[0_8px_20px_rgba(14,165,233,0.1)]"
                  : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </aside>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-white/10 bg-[#050b1d]/95 backdrop-blur-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { onTabChange(tab.key); setMobileMenuOpen(false); }}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                isActive ? "text-cyan-400" : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
