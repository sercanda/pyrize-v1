"use client";

import { useState } from "react";
import { Phone, Mail, Users2, MessageSquare, FileText, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass";
import { useCRMActivities } from "@/hooks/useCRMActivities";
import { DB_ACTIVITY_TYPE_LABELS } from "@/types/crm";
import type { DBActivityType } from "@/types/crm";

const ACTIVITY_ICONS: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Users2,
  note: MessageSquare,
  presentation: FileText,
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: "bg-green-500/20 text-green-400",
  email: "bg-blue-500/20 text-blue-400",
  meeting: "bg-purple-500/20 text-purple-400",
  note: "bg-amber-500/20 text-amber-400",
  presentation: "bg-cyan-500/20 text-cyan-400",
};

export function ActivitiesTab() {
  const { activities, loading, createActivity } = useCRMActivities({ limit: 100 });
  const [filterType, setFilterType] = useState<string>("");
  const [form, setForm] = useState({ type: "note" as DBActivityType, description: "" });
  const [adding, setAdding] = useState(false);

  const filtered = filterType ? activities.filter((a) => a.type === filterType) : activities;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setAdding(true);
    try {
      await createActivity({ type: form.type, description: form.description });
      setForm({ type: "note", description: "" });
    } finally {
      setAdding(false);
    }
  };

  // Group by date
  const grouped: Record<string, typeof activities> = {};
  filtered.forEach((act) => {
    const date = new Date(act.date).toLocaleDateString("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(act);
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Aktiviteler</h1>

      {/* Quick Add Form */}
      <GlassCard className="p-4" hover={false}>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DBActivityType }))}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            {Object.entries(DB_ACTIVITY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Aktivite açıklaması..."
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
          <button
            type="submit"
            disabled={adding || !form.description.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#001F3F] transition-all hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Ekle
          </button>
        </form>
      </GlassCard>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType("")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
            !filterType ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5"
          }`}
        >
          Tümü
        </button>
        {Object.entries(DB_ACTIVITY_TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              filterType === key ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center" hover={false}>
          <MessageSquare className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-slate-400">Henüz aktivite yok</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-3">
                {date}
              </h3>
              <div className="space-y-2">
                {acts.map((act) => {
                  const Icon = ACTIVITY_ICONS[act.type] || MessageSquare;
                  const colorClass = ACTIVITY_COLORS[act.type] || "bg-white/10 text-slate-300";
                  return (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 border border-white/5"
                    >
                      <div className={`rounded-lg p-2 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                            {DB_ACTIVITY_TYPE_LABELS[act.type]}
                          </span>
                          {act.customer && (
                            <span className="text-xs text-cyan-400">{act.customer.name}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{act.description}</p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          {new Date(act.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
