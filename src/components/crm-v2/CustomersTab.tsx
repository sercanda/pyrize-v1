"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Phone, Mail, User2, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass";
import { useCRMCustomers } from "@/hooks/useCRMCustomers";
import { CONTACT_TYPE_LABELS } from "@/types/crm";
import type { DBCustomer } from "@/types/crm";
import { CustomerSlideOver } from "./CustomerSlideOver";
import { CreateCustomerModal } from "./CreateCustomerModal";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Bugün";
  if (days === 1) return "Dün";
  if (days < 7) return `${days}g önce`;
  if (days < 30) return `${Math.floor(days / 7)}h önce`;
  return `${Math.floor(days / 30)}ay önce`;
}

export function CustomersTab() {
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCRMCustomers();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<DBCustomer | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let result = customers;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      );
    }
    if (filterType) {
      result = result.filter((c) => c.type === filterType);
    }
    return result;
  }, [customers, search, filterType]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Müşteriler</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#24d6a4] px-4 py-2.5 text-sm font-semibold text-[#030822] shadow-[0_0_20px_rgba(36,214,164,0.3)] transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Yeni Müşteri
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="İsim, email veya telefon ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="">Tüm Tipler</option>
          <option value="buyer">Alıcı</option>
          <option value="seller">Satıcı</option>
          <option value="tenant">Kiracı</option>
          <option value="investor">Yatırımcı</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center" hover={false}>
          <User2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-slate-400">
            {search || filterType ? "Filtrelere uygun müşteri bulunamadı" : "Henüz müşteri eklenmemiş"}
          </p>
        </GlassCard>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_150px_100px_120px_100px_40px] gap-4 px-4 py-3 bg-white/[0.03] text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            <span>Müşteri</span>
            <span>Telefon</span>
            <span>Tip</span>
            <span>Durum</span>
            <span>Son Aktivite</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className="w-full grid grid-cols-1 md:grid-cols-[1fr_150px_100px_120px_100px_40px] gap-2 md:gap-4 items-center px-4 py-3 border-t border-white/5 text-left transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-sm font-semibold text-white">
                  {customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{customer.name}</p>
                  {customer.email && (
                    <p className="text-xs text-slate-500 truncate">{customer.email}</p>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-300 hidden md:block">{customer.phone || "—"}</span>
              <span className="hidden md:block">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">
                  {CONTACT_TYPE_LABELS[customer.type] || customer.type}
                </span>
              </span>
              <span className="hidden md:block">
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${
                  customer.status === "Aktif" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"
                }`}>
                  {customer.status || "—"}
                </span>
              </span>
              <span className="text-xs text-slate-500 hidden md:block">
                {customer.updated_at ? timeAgo(customer.updated_at) : "—"}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600 hidden md:block" />
            </button>
          ))}
        </div>
      )}

      {/* Customer Slide Over */}
      {selectedCustomer && (
        <CustomerSlideOver
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={async (updates) => {
            const updated = await updateCustomer(selectedCustomer.id, updates);
            setSelectedCustomer(updated);
          }}
          onDelete={async () => {
            await deleteCustomer(selectedCustomer.id);
            setSelectedCustomer(null);
          }}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCustomerModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await createCustomer(data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
