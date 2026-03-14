"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import type { DBProperty, PropertyType } from "@/types/crm";
import { AppListbox } from "@/components/ui/AppListbox";
import { useCRMCustomers } from "@/hooks/useCRMCustomers";

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "sale", label: "Satılık" },
  { value: "rent", label: "Kiralık" },
];

interface CreatePropertyModalProps {
  onClose: () => void;
  onCreate: (data: Partial<DBProperty>, photos?: File[]) => Promise<void>;
  defaultCustomerId?: string;
}

export function CreatePropertyModal({ onClose, onCreate, defaultCustomerId }: CreatePropertyModalProps) {
  const { customers } = useCRMCustomers();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    price: "",
    type: "sale" as PropertyType,
    room_count: "",
    area_sqm: "",
    notes: "",
    customer_id: defaultCustomerId ?? "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newPhotos = [...photos, ...files].slice(0, 6);
    setPhotos(newPhotos);
    const previews = newPhotos.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(previews);
  };

  const removePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    setPhotoPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onCreate(
        {
          title: form.title,
          address: form.address || undefined,
          city: form.city || undefined,
          price: Number(form.price) || 0,
          type: form.type,
          room_count: form.room_count || undefined,
          area_sqm: Number(form.area_sqm) || undefined,
          notes: form.notes || undefined,
          customer_id: form.customer_id || null,
        } as Partial<DBProperty>,
        photos.length ? photos : undefined
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mülk kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const customerOptions = [
    { value: "", label: "Müşteri seçin (opsiyonel)" },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1128]/95 backdrop-blur-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Yeni Mülk</h2>
          <button onClick={onClose} className="rounded-lg bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Başlık *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="3+1 Daire Kadıköy"
            />
          </div>

          {/* Müşteri Seçimi */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Müşteri</label>
            <AppListbox<string>
              value={form.customer_id}
              onChange={(v) => setForm((f) => ({ ...f, customer_id: v }))}
              options={customerOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Şehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="İstanbul"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tip</label>
              <AppListbox<PropertyType>
                value={form.type}
                onChange={(v) => setForm((f) => ({ ...f, type: v }))}
                options={PROPERTY_TYPE_OPTIONS}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Adres</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Moda Cad. No:15"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Fiyat (₺)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Oda</label>
              <input
                type="text"
                value={form.room_count}
                onChange={(e) => setForm((f) => ({ ...f, room_count: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="3+1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">m²</label>
              <input
                type="number"
                value={form.area_sqm}
                onChange={(e) => setForm((f) => ({ ...f, area_sqm: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Notlar</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
              placeholder="Ek notlar..."
            />
          </div>

          {/* Fotoğraf Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Fotoğraflar (maks. 6)</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {photoPreviews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photoPreviews.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 hover:border-white/40 hover:text-slate-300 transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-white/20 py-4 flex flex-col items-center gap-2 text-slate-500 hover:border-white/40 hover:text-slate-300 transition-colors"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs">Fotoğraf ekle</span>
              </button>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim()}
              className="rounded-xl bg-[#DBE64C] px-6 py-2.5 text-sm font-semibold text-[#001F3F] shadow-[0_0_20px_rgba(219,230,76,0.3)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
