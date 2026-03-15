"use client";

import type { BolumProps } from "../BolumRenderer";

export function MetriklerBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";
  const kartlar = data.kartlar || data.rakamlar || [];

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      {data.baslik && (
        <h2 className="text-3xl md:text-4xl font-bold mb-10">{data.baslik}</h2>
      )}
      {data.girisCumlesi && (
        <p className={`text-base mb-8 max-w-2xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>{data.girisCumlesi}</p>
      )}
      {data.trendAnalizi?.map((t: string, i: number) => (
        <p key={i} className={`text-sm mb-3 max-w-3xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t}</p>
      ))}

      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(kartlar.length, 4)} gap-6 mt-6`}>
        {kartlar.map((kart: any, i: number) => (
          <div key={i} className={`p-6 rounded-2xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"} text-center`}>
            <p className={`text-3xl md:text-4xl font-bold mb-2 ${tema === "luks" ? "text-amber-400" : isDark ? "text-[#DBE64C]" : "text-indigo-600"}`}>
              {kart.rakam || kart.deger}
            </p>
            <h3 className="text-sm font-semibold mb-1">{kart.baslik || kart.label}</h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {kart.aciklama || kart.detay || kart.yorum}
            </p>
          </div>
        ))}
      </div>

      {data.firsatAnalizi?.map((f: string, i: number) => (
        <p key={i} className={`text-sm mt-6 max-w-3xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>{f}</p>
      ))}
      {data.guvenMesaji?.map((g: string, i: number) => (
        <p key={i} className={`text-sm mt-4 max-w-3xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>{g}</p>
      ))}

      {/* Fiyat önerisi (detaylı analiz) */}
      {data.fiyatOnerisi && (
        <div className={`mt-8 p-6 rounded-2xl border ${isDark ? "border-[#DBE64C]/20 bg-[#DBE64C]/5" : "border-indigo-200 bg-indigo-50"}`}>
          <h3 className="text-lg font-bold mb-3">Fiyat Önerisi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {data.fiyatOnerisi.minimumFiyat && <div><p className="text-xs text-slate-400">Minimum</p><p className="font-bold">{data.fiyatOnerisi.minimumFiyat}</p></div>}
            {data.fiyatOnerisi.optimumFiyat && <div><p className="text-xs text-slate-400">Optimum</p><p className="font-bold">{data.fiyatOnerisi.optimumFiyat}</p></div>}
            {data.fiyatOnerisi.maximumFiyat && <div><p className="text-xs text-slate-400">Maksimum</p><p className="font-bold">{data.fiyatOnerisi.maximumFiyat}</p></div>}
            {data.fiyatOnerisi.oneriliFiyat && <div><p className="text-xs text-slate-400">Önerilen</p><p className="font-bold text-[#DBE64C]">{data.fiyatOnerisi.oneriliFiyat}</p></div>}
          </div>
          {data.fiyatOnerisi.gerekcesi && <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{data.fiyatOnerisi.gerekcesi}</p>}
        </div>
      )}
    </section>
  );
}
