"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Building2, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/glass";
import { useCRMProperties } from "@/hooks/useCRMProperties";
import { PROPERTY_STATUS_LABELS } from "@/types/crm";
import type { DBProperty, PropertyType, PropertyStatus } from "@/types/crm";
import { CreatePropertyModal } from "./CreatePropertyModal";
import { PropertySlideOver } from "./PropertySlideOver";

function formatPrice(val: number) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(val);
}

const STATUS_COLORS: Record<PropertyStatus, string> = {
  available: "bg-emerald-500/20 text-emerald-300",
  sold: "bg-red-500/20 text-red-300",
  rented: "bg-blue-500/20 text-blue-300",
  pending: "bg-amber-500/20 text-amber-300",
};

export function PropertiesTab() {
  const { properties, loading, createProperty, updateProperty, deleteProperty } = useCRMProperties();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<DBProperty | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let result = properties;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q)
      );
    }
    if (filterType) result = result.filter((p) => p.type === filterType);
    if (filterStatus) result = result.filter((p) => p.status === filterStatus);
    return result;
  }, [properties, search, filterType, filterStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Mülkler</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#24d6a4] px-4 py-2.5 text-sm font-semibold text-[#030822] shadow-[0_0_20px_rgba(36,214,164,0.3)] transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Yeni Mülk
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Başlık, adres veya şehir ara..."
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
          <option value="sale">Satılık</option>
          <option value="rent">Kiralık</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="">Tüm Durumlar</option>
          <option value="available">Müsait</option>
          <option value="sold">Satıldı</option>
          <option value="rented">Kiralandı</option>
          <option value="pending">Beklemede</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center" hover={false}>
          <Building2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-slate-400">
            {search || filterType || filterStatus ? "Filtrelere uygun mülk bulunamadı" : "Henüz mülk eklenmemiş"}
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <GlassCard
              key={property.id}
              className="p-0 cursor-pointer overflow-hidden"
              onClick={() => setSelectedProperty(property)}
            >
              {/* Photo placeholder */}
              <div className="h-32 bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center">
                <Building2 className="h-10 w-10 text-slate-600" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{property.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[property.status]}`}>
                    {PROPERTY_STATUS_LABELS[property.status]}
                  </span>
                </div>
                {property.city && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-400">{property.city}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-cyan-400">
                    {formatPrice(property.price)} ₺
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                    {property.type === "sale" ? "Satılık" : "Kiralık"}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {selectedProperty && (
        <PropertySlideOver
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onUpdate={async (updates) => {
            const updated = await updateProperty(selectedProperty.id, updates);
            setSelectedProperty(updated);
          }}
          onDelete={async () => {
            await deleteProperty(selectedProperty.id);
            setSelectedProperty(null);
          }}
        />
      )}

      {showCreateModal && (
        <CreatePropertyModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await createProperty(data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
