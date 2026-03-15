"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass";
import { useCRMDeals } from "@/hooks/useCRMDeals";
import { DEAL_STAGES } from "@/types/crm";
import type { DBDeal, DealStage } from "@/types/crm";
import { DealStageColumn } from "./DealStageColumn";
import { DealCard } from "./DealCard";
import { DealSlideOver } from "./DealSlideOver";
import { CreateDealModal } from "./CreateDealModal";

export function DealsTab() {
  const { deals, loading, createDeal, updateDeal, moveDealStage, deleteDeal, fetchDeals } = useCRMDeals();
  const [activeDeal, setActiveDeal] = useState<DBDeal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<DBDeal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const dealsByStage = useMemo(() => {
    const map: Record<DealStage, DBDeal[]> = {
      lead: [], meeting: [], offer: [], contract: [], closed: [], lost: [],
    };
    deals.forEach((d) => {
      if (map[d.stage]) map[d.stage].push(d);
    });
    return map;
  }, [deals]);

  const totalValue = useMemo(
    () => deals.filter((d) => d.stage !== "lost").reduce((s, d) => s + (Number(d.value) || 0), 0),
    [deals]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;
    const newStage = over.id as DealStage;

    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === newStage) return;

    await moveDealStage(dealId, newStage);
  };

  // Filter out 'lost' from main pipeline view (show in separate section if needed)
  const visibleStages = DEAL_STAGES.filter((s) => s.key !== "lost");

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Fırsatlar</h1>
          <p className="text-sm text-slate-400 mt-1">
            Toplam pipeline değeri:{" "}
            <span className="text-cyan-400 font-semibold">
              {new Intl.NumberFormat("tr-TR").format(totalValue)} ₺
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#001F3F] shadow-[0_0_20px_rgba(219,230,76,0.3)] transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Yeni Fırsat
        </button>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[280px] h-96 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
            {visibleStages.map((stage) => (
              <DealStageColumn
                key={stage.key}
                stage={stage}
                deals={dealsByStage[stage.key]}
                onDealClick={setSelectedDeal}
              />
            ))}
          </div>
          <DragOverlay>
            {activeDeal && <DealCard deal={activeDeal} isDragging />}
          </DragOverlay>
        </DndContext>
      )}

      {selectedDeal && (
        <DealSlideOver
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdate={async (updates) => {
            const updated = await updateDeal(selectedDeal.id, updates);
            setSelectedDeal(updated);
          }}
          onDelete={async () => {
            await deleteDeal(selectedDeal.id);
            setSelectedDeal(null);
          }}
        />
      )}

      {showCreateModal && (
        <CreateDealModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await createDeal(data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
