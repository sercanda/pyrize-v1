"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { DBDeal, DBCustomer, DBProperty } from "@/types/crm";
import { AppListbox } from "@/components/ui/AppListbox";

interface CreateDealModalProps {
  onClose: () => void;
  onCreate: (data: Partial<DBDeal>) => Promise<void>;
}

export function CreateDealModal({ onClose, onCreate }: CreateDealModalProps) {
  const [customers, setCustomers] = useState<DBCustomer[]>([]);
  const [properties, setProperties] = useState<DBProperty[]>([]);
  const [form, setForm] = useState({
    title: "",
    customer_id: "",
    property_id: "",
    value: "",
    expected_close_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/crm/customers").then((r) => r.json()),
      fetch("/api/crm/properties").then((r) => r.json()),
    ]).then(([customersData, propertiesData]) => {
      setCustomers(customersData);
      setProperties(propertiesData);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onCreate({
        title: form.title,
        customer_id: form.customer_id || undefined,
        property_id: form.property_id || undefined,
        value: Number(form.value) || 0,
        expected_close_date: form.expected_close_date || undefined,
        notes: form.notes || undefined,
      } as Partial<DBDeal>);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fırsat kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1128]/95 backdrop-blur-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Yeni Fırsat</h2>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Fırsat Başlığı *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="3+1 Daire Satışı"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Müşteri</label>
              <AppListbox<string>
                value={form.customer_id}
                onChange={(v) => setForm((f) => ({ ...f, customer_id: v }))}
                options={[{ value: '', label: 'Seçiniz' }, ...customers.map((c) => ({ value: c.id, label: c.name }))]}
                placeholder="Seçiniz"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Mülk</label>
              <AppListbox<string>
                value={form.property_id}
                onChange={(v) => setForm((f) => ({ ...f, property_id: v }))}
                options={[{ value: '', label: 'Seçiniz' }, ...properties.map((p) => ({ value: p.id, label: p.title }))]}
                placeholder="Seçiniz"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Değer (₺)</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Beklenen Kapanış</label>
              <input
                type="date"
                value={form.expected_close_date}
                onChange={(e) => setForm((f) => ({ ...f, expected_close_date: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
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
