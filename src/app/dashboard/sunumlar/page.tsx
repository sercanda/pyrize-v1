"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, MoreVertical, Share2, Download, Search as SearchIcon } from "lucide-react";
import { useSunumlar } from "../hooks/useSunumlar";
import { formatDashboardPrice } from "../data";
import { MagneticCard } from "@/components/ui/MagneticCard";

type FilterKey = "hepsi" | "aktif" | "taslak";

export default function DashboardSunumlarPage() {
  const { sunumlar, loading } = useSunumlar();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("hepsi");

  const filtered = sunumlar.filter((sunum) => {
    const matchesSearch = sunum.baslik.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "hepsi" || sunum.durum === filter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Sunumlar</h1>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Oluşturduğunuz tüm sunumları amaç, durum ve temaya göre filtreleyin.
          </p>
        </div>
        <Link
          href="/dashboard/olustur"
          className="inline-flex items-center gap-2 rounded-full bg-[#24d6a4] px-5 py-2 text-sm font-semibold text-page-bg shadow-[0_0_15px_rgba(36,214,164,0.35)] transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Yeni Sunum Oluştur
        </Link>
      </section>

      <section className="mt-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 py-3 text-white placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
              placeholder="Sunum ara..."
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-1 backdrop-blur-lg">
            {[
              { value: "hepsi", label: "Hepsi" },
              { value: "aktif", label: "Aktif" },
              { value: "taslak", label: "Taslak" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value as FilterKey)}
                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                  filter === opt.value
                    ? "bg-[#57B6B2] text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-white/20 bg-white/10 py-16 text-sm text-slate-300">
            <span className="mr-3 inline-flex h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
            Sunumlar yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-white/20 bg-white/10 py-20 text-center backdrop-blur-lg">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-500" />
            <h3 className="mb-2 text-xl font-semibold">Kayıt bulunamadı</h3>
            <p className="mb-6 text-gray-400">Filtreleri değiştirerek farklı sunumları arayın.</p>
            <Link
              href="/dashboard/olustur"
              className="inline-flex items-center gap-2 rounded-lg bg-[#57B6B2] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a9d99]"
            >
              <Plus className="h-5 w-5" />
              Yeni Sunum Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sunum) => (
              <MagneticCard key={sunum.id} enableMagnetism={true}>
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div
                        className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          sunum.durum === "aktif"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {sunum.durum === "aktif" ? "Aktif" : "Taslak"}
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
                        {sunum.baslik}
                      </h3>
                      <p className="mb-2 text-sm text-gray-400">
                        {sunum.mulkTuru.charAt(0).toUpperCase() + sunum.mulkTuru.slice(1)}
                      </p>
                      <p className="text-xl font-bold text-[#57B6B2]">
                        {formatDashboardPrice(sunum)}
                      </p>
                    </div>
                    <button className="text-gray-400 transition hover:text-white">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-4 text-xs text-gray-400">
                    {sunum.tarih.toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/sunum/${sunum.id}`}
                      className="flex-1 rounded-lg border border-white/20 bg-white/5 py-2 text-center text-sm font-medium transition hover:bg-white/10"
                    >
                      Görüntüle
                    </Link>
                    <button className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 transition hover:bg-white/10">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 transition hover:bg-white/10">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </MagneticCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

