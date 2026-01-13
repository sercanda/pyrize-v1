"use client";

import { Customer, Stage } from "@/types/crm";
import { CustomerCard } from "./CustomerCard";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface StageColumnProps {
  stage: Stage;
  customers: Customer[];
  onCustomerClick: (customer: Customer) => void;
  onAddCustomer: () => void;
}

export function StageColumn({ stage, customers, onCustomerClick, onAddCustomer }: StageColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.key,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-lg backdrop-blur-sm"
    >
      <div className={`flex items-center justify-between rounded-t-2xl ${stage.color} border-b border-white/10 px-4 py-3 shadow-sm`}>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-white">{stage.title}</h2>
          <p className="mt-0.5 text-xs font-medium text-white/70">{customers.length} müşteri</p>
        </div>
        <button
          onClick={onAddCustomer}
          className="rounded-lg bg-white/10 p-1.5 text-white transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
          aria-label={`Add customer to ${stage.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent hover:scrollbar-thumb-cyan-500/30">
        {customers.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center">
            <div>
              <p className="text-xs font-medium text-slate-400">Müşteri yok</p>
              <button
                onClick={onAddCustomer}
                className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
              >
                + Yeni müşteri ekle
              </button>
            </div>
          </div>
        ) : (
          customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onClick={() => onCustomerClick(customer)} />
          ))
        )}
      </div>
    </div>
  );
}

