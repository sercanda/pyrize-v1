"use client";

import { useState } from "react";
import { MapPin, Ruler, Home, Calendar, Trash2, Pencil, X, Check } from "lucide-react";
import { SlideOver } from "./SlideOver";
import { AppListbox } from "@/components/ui/AppListbox";
import { useCRMCustomers } from "@/hooks/useCRMCustomers";
import { PROPERTY_STATUS_LABELS, PROPERTY_STATUS_OPTIONS } from "@/types/crm";
import type { DBProperty, PropertyStatus } from "@/types/crm";

interface PropertySlideOverProps {
  property: DBProperty;
  onClose: () => void;
  onUpdate: (updates: Partial<DBProperty>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function PropertySlideOver({ property, onClose, onUpdate, onDelete }: PropertySlideOverProps) {
  const { customers } = useCRMCustomers();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: property.title,
    price: String(property.price || ""),
    status: property.status as PropertyStatus,
    customer_id: property.customer_id ?? "",
    notes: property.notes ?? "",
    city: property.city ?? "",
    address: property.address ?? "",
    area_sqm: property.area_sqm ? String(property.area_sqm) : "",
    room_count: property.room_count ?? "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        title: form.title,
        price: Number(form.price) || 0,
        status: form.status,
        customer_id: form.customer_id || null,
        notes: form.notes || undefined,
        city: form.city || undefined,
        address: form.address || undefined,
        area_sqm: Number(form.area_sqm) || undefined,
        room_count: form.room_count || undefined,
      } as Partial<DBProperty>);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bu mülkü silmek istediğinize emin misiniz?")) {
      await onDelete();
    }
  };

  const customerOptions = [
    { value: "", label: "Müşteri bağlı değil" },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <SlideOver
      open
      onClose={onClose}
      title={editing ? "Mülkü Düzenle" : property.title}
      subtitle={editing ? undefined : `${property.type === "sale" ? "Satılık" : "Kiralık"} — ${PROPERTY_STATUS_LABELS[property.status]}`}
    >
      {/* Edit / View toggle header */}
      <div className="mb-4 flex items-center justify-end gap-2">
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:bg-white/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> İptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-[#DBE64C] px-3 py-1.5 text-xs font-semibold text-[#001F3F] transition hover:opacity-90 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:bg-white/5 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" /> Düzenle
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Başlık</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Müşteri</label>
            <AppListbox<string>
              value={form.customer_id}
              onChange={(v) => setForm((f) => ({ ...f, customer_id: v }))}
              options={customerOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Durum</label>
              <AppListbox<PropertyStatus>
                value={form.status}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
                options={PROPERTY_STATUS_OPTIONS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Fiyat (₺)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Şehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20"
                placeholder="İstanbul"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">m²</label>
              <input
                type="number"
                value={form.area_sqm}
                onChange={(e) => setForm((f) => ({ ...f, area_sqm: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20"
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Adres</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20"
              placeholder="Moda Cad. No:15"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Oda Sayısı</label>
            <input
              type="text"
              value={form.room_count}
              onChange={(e) => setForm((f) => ({ ...f, room_count: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20"
              placeholder="3+1"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Notlar</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20 resize-none"
              placeholder="Ek notlar..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-[#DBE64C]">
            {new Intl.NumberFormat("tr-TR").format(property.price)} ₺
          </div>

          <div className="grid grid-cols-2 gap-3">
            {property.address && (
              <InfoCard icon={MapPin} label="Adres" value={property.address} />
            )}
            {property.city && (
              <InfoCard icon={MapPin} label="Şehir" value={property.city} />
            )}
            {property.area_sqm && (
              <InfoCard icon={Ruler} label="Alan" value={`${property.area_sqm} m²`} />
            )}
            {property.room_count && (
              <InfoCard icon={Home} label="Oda" value={property.room_count} />
            )}
            {property.floor_info && (
              <InfoCard icon={Home} label="Kat" value={property.floor_info} />
            )}
            {property.building_age != null && (
              <InfoCard icon={Calendar} label="Bina Yaşı" value={`${property.building_age} yıl`} />
            )}
          </div>

          {property.features && property.features.length > 0 && (
            <div className="rounded-xl bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500 mb-2">Özellikler</p>
              <div className="flex flex-wrap gap-1.5">
                {property.features.map((f, i) => (
                  <span key={i} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.notes && (
            <div className="rounded-xl bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500 mb-1">Notlar</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{property.notes}</p>
            </div>
          )}

          {property.customer && (
            <div className="rounded-xl bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500 mb-1">Bağlı Müşteri</p>
              <p className="text-sm text-white">{property.customer.name}</p>
              {(property.customer as any).phone && (
                <p className="text-xs text-slate-400 mt-0.5">{(property.customer as any).phone}</p>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Mülkü Sil
            </button>
          </div>
        </div>
      )}
    </SlideOver>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
      <Icon className="h-4 w-4 text-[#DBE64C] shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}
