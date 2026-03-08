"use client";

import { useState } from "react";
import { User2, Building2, Calendar, Trash2, Plus } from "lucide-react";
import { SlideOver } from "./SlideOver";
import { DEAL_STAGES, DB_ACTIVITY_TYPE_LABELS } from "@/types/crm";
import type { DBDeal, DealStage, DBActivityType } from "@/types/crm";
import { useCRMActivities } from "@/hooks/useCRMActivities";

interface DealSlideOverProps {
  deal: DBDeal;
  onClose: () => void;
  onUpdate: (updates: Partial<DBDeal>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function DealSlideOver({ deal, onClose, onUpdate, onDelete }: DealSlideOverProps) {
  const { activities, createActivity } = useCRMActivities({ dealId: deal.id });
  const [activityForm, setActivityForm] = useState({ type: "note" as DBActivityType, description: "" });
  const [addingActivity, setAddingActivity] = useState(false);

  const stageInfo = DEAL_STAGES.find((s) => s.key === deal.stage);

  const handleStageChange = async (newStage: DealStage) => {
    await onUpdate({ stage: newStage } as Partial<DBDeal>);
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.description.trim()) return;
    setAddingActivity(true);
    try {
      await createActivity({
        type: activityForm.type,
        description: activityForm.description,
        deal_id: deal.id,
        customer_id: deal.customer_id,
      });
      setActivityForm({ type: "note", description: "" });
    } finally {
      setAddingActivity(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bu fırsatı silmek istediğinize emin misiniz?")) {
      await onDelete();
    }
  };

  return (
    <SlideOver open onClose={onClose} title={deal.title} subtitle={stageInfo?.title} width="max-w-xl">
      <div className="space-y-5">
        {/* Value */}
        <div className="text-2xl font-bold text-cyan-400">
          {new Intl.NumberFormat("tr-TR").format(Number(deal.value) || 0)} ₺
        </div>

        {/* Stage Selector */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Aşama</p>
          <div className="flex flex-wrap gap-2">
            {DEAL_STAGES.filter((s) => s.key !== "lost").map((stage) => (
              <button
                key={stage.key}
                onClick={() => handleStageChange(stage.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  deal.stage === stage.key
                    ? `${stage.bgColor} ${stage.color} ring-1 ring-current`
                    : "bg-white/5 text-slate-500 hover:bg-white/10"
                }`}
              >
                {stage.title}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 gap-3">
          {deal.customer && (
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <User2 className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-500">Müşteri</p>
                <p className="text-sm text-white">{deal.customer.name}</p>
              </div>
            </div>
          )}
          {deal.property && (
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-500">Mülk</p>
                <p className="text-sm text-white">{deal.property.title}</p>
              </div>
            </div>
          )}
          {deal.expected_close_date && (
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-500">Beklenen Kapanış</p>
                <p className="text-sm text-white">
                  {new Date(deal.expected_close_date).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          )}
          {deal.notes && (
            <div className="rounded-xl bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500 mb-1">Notlar</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{deal.notes}</p>
            </div>
          )}
        </div>

        {/* Add Activity Form */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-white mb-3">Aktivite Ekle</h3>
          <form onSubmit={handleAddActivity} className="space-y-3">
            <div className="flex gap-2">
              <select
                value={activityForm.type}
                onChange={(e) => setActivityForm((f) => ({ ...f, type: e.target.value as DBActivityType }))}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                {Object.entries(DB_ACTIVITY_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <input
                type="text"
                value={activityForm.description}
                onChange={(e) => setActivityForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Açıklama..."
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="submit"
                disabled={addingActivity || !activityForm.description.trim()}
                className="rounded-xl bg-cyan-500/20 px-3 py-2 text-cyan-300 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Activity Timeline */}
        {activities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Aktiviteler</h3>
            <div className="space-y-2">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 rounded-xl bg-white/[0.04] p-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                        {DB_ACTIVITY_TYPE_LABELS[act.type]}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(act.date).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Fırsatı Sil
          </button>
        </div>
      </div>
    </SlideOver>
  );
}
