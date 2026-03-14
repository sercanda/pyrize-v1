"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { DBCustomer, ContactType } from "@/types/crm";
import { AppListbox } from "@/components/ui/AppListbox";

const CONTACT_TYPE_OPTIONS: { value: ContactType; label: string }[] = [
  { value: "buyer", label: "Alıcı" },
  { value: "seller", label: "Satıcı" },
  { value: "tenant", label: "Kiracı" },
  { value: "investor", label: "Yatırımcı" },
];

interface CreateCustomerModalProps {
  onClose: () => void;
  onCreate: (data: Partial<DBCustomer>) => Promise<DBCustomer | void>;
  onAddProperty?: (customerId: string) => void;
}

export function CreateCustomerModal({ onClose, onCreate, onAddProperty }: CreateCustomerModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "buyer" as ContactType,
    city: "",
    notes: "",
  });
  const [addProperty, setAddProperty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const created = await onCreate(form);
      onClose();
      if (addProperty && onAddProperty && created && typeof created === "object" && "id" in created) {
        onAddProperty((created as DBCustomer).id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Müşteri kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1128]/95 backdrop-blur-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Yeni Müşteri</h2>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Ad Soyad *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Müşteri adı"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Telefon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="05XX XXX XXXX"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tip</label>
              <AppListbox<ContactType>
                value={form.type}
                onChange={(v) => setForm((f) => ({ ...f, type: v }))}
                options={CONTACT_TYPE_OPTIONS}
              />
            </div>
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
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Notlar</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
              placeholder="Ek notlar..."
            />
          </div>

          {/* Mülk ekle seçeneği */}
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                addProperty ? "bg-[#DBE64C] border-[#DBE64C]" : "border-white/20 bg-white/[0.04] group-hover:border-white/40"
              }`}
              onClick={() => setAddProperty((v) => !v)}
            >
              {addProperty && (
                <svg viewBox="0 0 10 8" className="w-3 h-3 fill-[#001F3F]">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input type="checkbox" checked={addProperty} onChange={(e) => setAddProperty(e.target.checked)} className="hidden" />
            <span className="text-sm text-slate-300">Bu müşteriye mülk ekle</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="rounded-xl bg-[#DBE64C] px-6 py-2.5 text-sm font-semibold text-[#001F3F] shadow-[0_0_20px_rgba(219,230,76,0.3)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : addProperty ? "Kaydet & Mülk Ekle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
