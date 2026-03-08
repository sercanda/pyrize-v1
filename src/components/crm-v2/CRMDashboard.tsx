"use client";

import {
  Users2,
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  FileText,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass";
import { useCRMDashboard } from "@/hooks/useCRMDashboard";
import { DB_ACTIVITY_TYPE_LABELS } from "@/types/crm";
import type { CRMTab } from "./CRMLayout";

const ACTIVITY_ICONS: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Users2,
  note: MessageSquare,
  presentation: FileText,
};

function formatCurrency(val: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(val);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa önce`;
  const days = Math.floor(hours / 24);
  return `${days}g önce`;
}

interface CRMDashboardProps {
  onNavigate: (tab: CRMTab) => void;
}

export function CRMDashboard({ onNavigate }: CRMDashboardProps) {
  const { stats, loading } = useCRMDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">CRM Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Aktif Müşteriler",
      value: stats?.activeCustomers || 0,
      icon: Users2,
      color: "from-cyan-500/20 to-cyan-500/5",
      iconColor: "text-cyan-400",
      onClick: () => onNavigate("musteriler"),
    },
    {
      label: "Açık Fırsatlar",
      value: stats?.openDeals || 0,
      subValue: stats?.openDealsValue ? formatCurrency(stats.openDealsValue) : undefined,
      icon: TrendingUp,
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
      onClick: () => onNavigate("firsatlar"),
    },
    {
      label: "Bu Ay Kapanan",
      value: stats?.closedThisMonth || 0,
      subValue: stats?.closedThisMonthValue ? formatCurrency(stats.closedThisMonthValue) : undefined,
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
      onClick: () => onNavigate("firsatlar"),
    },
    {
      label: "Yaklaşan Görevler",
      value: stats?.upcomingTodos || 0,
      icon: Clock,
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">CRM Dashboard</h1>
        <span className="text-xs text-slate-500">
          {stats?.totalProperties || 0} mülk kayıtlı
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <GlassCard
              key={card.label}
              className={`p-5 cursor-pointer bg-gradient-to-br ${card.color}`}
              onClick={card.onClick}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                  {card.subValue && (
                    <p className="mt-1 text-sm text-slate-300">{card.subValue}</p>
                  )}
                </div>
                <div className={`rounded-xl bg-white/10 p-2.5 ${card.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Activities */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Son Aktiviteler</h2>
          <button
            onClick={() => onNavigate("aktiviteler")}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Tümünü Gör
          </button>
        </div>
        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type] || MessageSquare;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3"
                >
                  <div className="rounded-lg bg-white/10 p-2">
                    <Icon className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {activity.description || DB_ACTIVITY_TYPE_LABELS[activity.type]}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.customer && (
                        <span className="text-xs text-cyan-400">{activity.customer.name}</span>
                      )}
                      <span className="text-xs text-slate-500">{timeAgo(activity.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">
            Henüz aktivite yok
          </p>
        )}
      </GlassCard>
    </div>
  );
}
