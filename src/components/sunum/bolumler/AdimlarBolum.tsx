"use client";

import type { BolumProps } from "../BolumRenderer";

export function AdimlarBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";
  const adimlar = data.adimlar || data.surecAdimlari || [];

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      {data.baslik && (
        <h2 className="text-3xl md:text-4xl font-bold mb-10">{data.baslik}</h2>
      )}

      <div className="space-y-6 max-w-3xl">
        {adimlar.map((adim: any, i: number) => (
          <div key={i} className={`flex gap-5 p-5 rounded-xl border ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
              tema === "luks" ? "bg-amber-400/20 text-amber-400" : isDark ? "bg-[#DBE64C]/20 text-[#DBE64C]" : "bg-indigo-100 text-indigo-600"
            }`}>
              {adim.numara || adim.adim || i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-bold">{adim.baslik}</h3>
                {(adim.gun || adim.sure) && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                    {adim.gun || adim.sure}
                  </span>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {adim.aciklama || adim.yapilan}
              </p>
              {adim.onay && (
                <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Onay: {adim.onay}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.garantiNotu && (
        <div className={`mt-8 p-4 rounded-xl border ${isDark ? "border-amber-500/20 bg-amber-500/5" : "border-amber-200 bg-amber-50"}`}>
          <p className={`text-sm ${isDark ? "text-amber-300" : "text-amber-700"}`}>{data.garantiNotu}</p>
        </div>
      )}

      {data.iletisimTaahhüdü && (
        <p className={`mt-6 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{data.iletisimTaahhüdü}</p>
      )}
      {data.fesihHakki && (
        <p className={`mt-3 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{data.fesihHakki}</p>
      )}
    </section>
  );
}
