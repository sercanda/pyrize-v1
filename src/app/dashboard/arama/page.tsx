"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardAramaPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 md:px-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Global Arama</h1>
        <p className="text-sm text-slate-400 md:text-base">
          Sunumları, müşterileri veya görevleri arayın. Gelişmiş filtreler CRM güncellemesinde eklenecek.
        </p>
      </section>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(6,12,28,0.35)]">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-white/10 pl-12 pr-4 py-4 text-white placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
            placeholder="Sunum başlığı, müşteri adı veya görev ara..."
          />
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Örnek aramalar: “modern sunum”, “Ayşe Demir”, “görüşme planla”.
        </p>
      </div>

      <div className="mt-10 space-y-4 rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-400">
        <p>
          Şu anda arama sonuçları placeholder durumunda. Supabase sorgularıyla gerçek zamanlı arama ve
          filtreleme entegrasyonu bir sonraki iterasyonda tamamlanacak.
        </p>
        <div className="flex gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <Link href="/dashboard/sunumlar" className="hover:text-cyan-200">
            Sunum Listesi
          </Link>
          <Link href="/dashboard/musteriler" className="hover:text-cyan-200">
            Müşteri Yönetimi
          </Link>
          <Link href="/dashboard/crm" className="hover:text-cyan-200">
            CRM Panosu
          </Link>
        </div>
      </div>
    </div>
  );
}

