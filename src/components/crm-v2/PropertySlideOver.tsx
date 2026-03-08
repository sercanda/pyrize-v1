"use client";

import { MapPin, Ruler, Home, Calendar, Trash2 } from "lucide-react";
import { SlideOver } from "./SlideOver";
import { PROPERTY_STATUS_LABELS } from "@/types/crm";
import type { DBProperty } from "@/types/crm";

interface PropertySlideOverProps {
  property: DBProperty;
  onClose: () => void;
  onUpdate: (updates: Partial<DBProperty>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function PropertySlideOver({ property, onClose, onUpdate, onDelete }: PropertySlideOverProps) {
  const handleDelete = async () => {
    if (confirm("Bu mülkü silmek istediğinize emin misiniz?")) {
      await onDelete();
    }
  };

  return (
    <SlideOver
      open
      onClose={onClose}
      title={property.title}
      subtitle={`${property.type === "sale" ? "Satılık" : "Kiralık"} — ${PROPERTY_STATUS_LABELS[property.status]}`}
    >
      <div className="space-y-4">
        <div className="text-2xl font-bold text-cyan-400">
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
    </SlideOver>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
      <Icon className="h-4 w-4 text-cyan-400 shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}
