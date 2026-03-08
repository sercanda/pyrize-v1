"use client";

import { useDroppable } from "@dnd-kit/core";
import type { DBDeal, DealStageInfo } from "@/types/crm";
import { DealCard } from "./DealCard";

interface DealStageColumnProps {
  stage: DealStageInfo;
  deals: DBDeal[];
  onDealClick: (deal: DBDeal) => void;
}

export function DealStageColumn({ stage, deals, onDealClick }: DealStageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  const totalValue = deals.reduce((s, d) => s + (Number(d.value) || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[280px] w-[280px] flex flex-col rounded-2xl border transition-colors ${
        isOver
          ? "border-cyan-400/40 bg-cyan-500/5"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl ${stage.bgColor}`}>
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-semibold ${stage.color}`}>{stage.title}</h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
            {deals.length}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {new Intl.NumberFormat("tr-TR", { notation: "compact" }).format(totalValue)} ₺
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 p-3 overflow-y-auto max-h-[60vh]">
        {deals.length === 0 ? (
          <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-white/10 text-xs text-slate-600">
            Fırsat yok
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onClick={() => onDealClick(deal)} />
          ))
        )}
      </div>
    </div>
  );
}
