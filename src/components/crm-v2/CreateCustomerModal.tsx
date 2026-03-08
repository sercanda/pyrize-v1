"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { DBCustomer, ContactType } from "@/types/crm";

interface CreateCustomerModalProps {
  onClose: () => void;
  onCreate: (data: Partial<DBCustomer>) => Promise<void>;
}

export function CreateCustomerModal({ onClose, onCreate }: CreateCustomerModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "buyer" as ContactType,
    city: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await onCreate(form);
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
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ContactType }))}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="buyer">Alıcı</option>
                <option value="seller">Satıcı</option>
                <option value="tenant">Kiracı</option>
                <option value="investor">Yatırımcı</option>
              </select>
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
              className="rounded-xl bg-[#24d6a4] px-6 py-2.5 text-sm font-semibold text-[#030822] shadow-[0_0_20px_rgba(36,214,164,0.3)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
