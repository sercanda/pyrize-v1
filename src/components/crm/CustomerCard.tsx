"use client";

import { Customer, REQUEST_TYPE_LABELS } from "@/types/crm";
import { TagBadge } from "./TagBadge";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Phone, Mail, DollarSign } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: customer.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const formatBudget = () => {
    if (customer.budgetMin === 0 && customer.budgetMax === 0) return "Belirtilmemiş";
    if (customer.budgetMin === customer.budgetMax) {
      return `${(customer.budgetMin / 1000000).toFixed(1)}M ₺`;
    }
    return `${(customer.budgetMin / 1000000).toFixed(1)}M - ${(customer.budgetMax / 1000000).toFixed(1)}M ₺`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="group cursor-grab active:cursor-grabbing rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_70px_rgba(6,12,28,0.35)] backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white group-hover:text-cyan-200">{customer.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{REQUEST_TYPE_LABELS[customer.requestType]}</p>
          </div>
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
            <Image
              src={customer.assignedAgent.avatar}
              alt={customer.assignedAgent.name || "Agent"}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3" />
            <span>{formatBudget()}</span>
          </div>
        </div>

        {customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {customer.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {customer.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{customer.tags.length - 3}</span>
            )}
          </div>
        )}

        {customer.properties.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-400">
            {customer.properties.length} eşleşen mülk
          </div>
        )}

        <div className="text-[10px] text-slate-400">
          {new Date(customer.lastActivity).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
          })}
        </div>
      </div>
    </div>
  );
}

