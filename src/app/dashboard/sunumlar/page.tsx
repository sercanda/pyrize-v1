"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, MoreVertical, Share2, Download, Search as SearchIcon, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useSunumlar } from "../hooks/useSunumlar";
import { formatDashboardPrice } from "../data";
import { MagneticCard } from "@/components/ui/MagneticCard";

type FilterKey = "hepsi" | "aktif" | "taslak";

const STIL_LABELS: Record<string, string> = {
  detayli_analiz: "Detaylı Analiz",
  hizli_satis: "Hızlı Satış",
  premium_sunum: "Premium",
  guven_odakli: "Güven Odaklı",
  minimalist: "Minimalist",
};

const TEMA_LABELS: Record<string, string> = {
  modern: "Modern",
  kurumsal: "Kurumsal",
  luks: "Lüks",
};

interface SkorResult {
  skor: number;
  yorum: string;
  oneriler: string[];
}

type SkorState = SkorResult | "loading";

function skorBadgeClass(skor: number) {
  if (skor >= 75) return "bg-[#DBE64C]/20 text-[#DBE64C]";
  if (skor >= 50) return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}

export default function DashboardSunumlarPage() {
  const { sunumlar, loading } = useSunumlar();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("hepsi");
  const [scores, setScores] = useState<Record<string, SkorState>>({});
  const [expandedScores, setExpandedScores] = useState<Record<string, boolean>>({});

  const filtered = sunumlar.filter((sunum) => {
    const matchesSearch = sunum.baslik.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "hepsi" || sunum.durum === filter;
    return matchesSearch && matchesStatus;
  });

  const handleSkorHesapla = async (sunum: (typeof sunumlar)[0]) => {
    if (scores[sunum.id]) return;
    setScores((prev) => ({ ...prev, [sunum.id]: "loading" }));
    try {
      const res = await fetch("/api/ai/sunum-skoru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sunumId: sunum.id,
          baslik: sunum.baslik,
          mulkTuru: sunum.mulkTuru,
          bolge: (sunum as any).bolge || "",
          fiyat: (sunum as any).fiyat,
          sunumStili: (sunum as any).sunumStili,
        }),
      });
      if (!res.ok) throw new Error("API hatası");
      const data: SkorResult = await res.json();
      setScores((prev) => ({ ...prev, [sunum.id]: data }));
      setExpandedScores((prev) => ({ ...prev, [sunum.id]: true }));
    } catch {
      setScores((prev) => {
        const next = { ...prev };
        delete next[sunum.id];
        return next;
      });
    }
  };

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
          className="inline-flex items-center gap-2 rounded-full bg-[#DBE64C] px-5 py-2 text-sm font-semibold text-[#001F3F] shadow-[0_0_15px_rgba(219,230,76,0.35)] transition hover:opacity-90"
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
              className="w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 py-3 text-white placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-[#DBE64C]/30"
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
                    ? "bg-[#DBE64C] text-[#001F3F]"
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
              className="inline-flex items-center gap-2 rounded-lg bg-[#DBE64C] px-6 py-3 font-semibold text-[#001F3F] transition-colors hover:bg-[#c9d340]"
            >
              <Plus className="h-5 w-5" />
              Yeni Sunum Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sunum) => {
              const scoreState = scores[sunum.id];
              const isLoading = scoreState === "loading";
              const result = scoreState && scoreState !== "loading" ? scoreState : null;
              const isExpanded = expandedScores[sunum.id];

              return (
                <MagneticCard key={sunum.id} enableMagnetism={true}>
                  <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-white/20">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              sunum.durum === "aktif"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {sunum.durum === "aktif" ? "Aktif" : "Taslak"}
                          </span>
                          {(sunum as any).istek?.sunumStili && (
                            <span className="rounded-full bg-indigo-500/15 text-indigo-300 px-2 py-0.5 text-[10px] font-semibold">
                              {STIL_LABELS[(sunum as any).istek.sunumStili] || (sunum as any).istek.sunumStili}
                            </span>
                          )}
                          {(sunum as any).istek?.tema && (
                            <span className="rounded-full bg-purple-500/15 text-purple-300 px-2 py-0.5 text-[10px] font-semibold">
                              {TEMA_LABELS[(sunum as any).istek.tema] || (sunum as any).istek.tema}
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
                          {sunum.baslik}
                        </h3>
                        <p className="mb-2 text-sm text-gray-400">
                          {sunum.mulkTuru.charAt(0).toUpperCase() + sunum.mulkTuru.slice(1)}
                        </p>
                        <p className="text-xl font-bold text-[#DBE64C]">
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

                    {/* AI Skor Bölümü */}
                    {result ? (
                      <div className="mb-3">
                        <button
                          onClick={() => setExpandedScores((p) => ({ ...p, [sunum.id]: !isExpanded }))}
                          className="w-full flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-sm transition hover:bg-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${skorBadgeClass(result.skor)}`}>
                              {result.skor}/100
                            </span>
                            <span className="text-slate-400 text-xs truncate max-w-[140px]">{result.yorum}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 space-y-1.5">
                            <p className="text-xs text-slate-300 mb-2">{result.yorum}</p>
                            {result.oneriler.map((o, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#DBE64C]/20 text-[#DBE64C] flex items-center justify-center text-[9px] font-bold">
                                  {i + 1}
                                </span>
                                <span>{o}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSkorHesapla(sunum)}
                        disabled={isLoading}
                        className="mb-3 w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs text-slate-400 transition hover:bg-white/[0.07] hover:text-slate-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border border-white/30 border-t-transparent" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        {isLoading ? "Analiz ediliyor..." : "AI Skoru Hesapla"}
                      </button>
                    )}

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
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
