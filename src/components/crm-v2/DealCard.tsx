"use client";

import { useDraggable } from "@dnd-kit/core";
import { User2, Calendar, Edit, Copy, Archive, Trash2 } from "lucide-react";
import type { DBDeal } from "@/types/crm";
import { AppMenu } from "@/components/ui/AppMenu";

interface DealCardProps {
  deal: DBDeal;
  onClick?: () => void;
  isDragging?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function DealCard({ deal, onClick, isDragging, onEdit, onDuplicate, onArchive, onDelete }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`rounded-xl border border-white/10 bg-white/[0.06] p-3 cursor-grab active:cursor-grabbing transition-all hover:border-cyan-300/30 hover:bg-white/[0.08] ${
        isDragging ? "opacity-80 rotate-2 shadow-xl" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-sm font-medium text-white line-clamp-1 flex-1">{deal.title}</p>
        {(onEdit || onDuplicate || onArchive || onDelete) && (
          <AppMenu
            items={[
              ...(onEdit ? [{ label: "Düzenle", icon: Edit, onClick: onEdit }] : []),
              ...(onDuplicate ? [{ label: "Kopyala", icon: Copy, onClick: onDuplicate }] : []),
              ...(onArchive ? [{ label: "Arşivle", icon: Archive, onClick: onArchive }] : []),
              ...(onDelete ? [{ label: "Sil", icon: Trash2, onClick: onDelete, destructive: true }] : []),
            ]}
          />
        )}
      </div>

      {deal.customer && (
        <div className="flex items-center gap-1.5 mt-2">
          <User2 className="h-3 w-3 text-slate-500" />
          <span className="text-xs text-slate-400">{deal.customer.name}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-semibold text-cyan-400">
          {new Intl.NumberFormat("tr-TR", { notation: "compact" }).format(Number(deal.value) || 0)} ₺
        </span>
        {deal.expected_close_date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-500">
              {new Date(deal.expected_close_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
