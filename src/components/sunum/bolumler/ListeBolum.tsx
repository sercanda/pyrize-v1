"use client";

import type { BolumProps } from "../BolumRenderer";

export function ListeBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";
  const items = data.maddeler || data.kanallar || data.detaylar || data.sosyalOlanaklar || data.gelecekProjeler || data.ozelUnsurlar || [];

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      {data.baslik && (
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{data.baslik}</h2>
      )}

      <div className="space-y-4 max-w-3xl">
        {items.map((item: any, i: number) => {
          if (typeof item === "string") {
            return (
              <div key={i} className="flex items-start gap-4">
                <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${tema === "luks" ? "bg-amber-400" : isDark ? "bg-[#DBE64C]" : "bg-indigo-500"}`} />
                <p className={`text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item}</p>
              </div>
            );
          }
          // Channel/detail object format
          return (
            <div key={i} className={`p-4 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
              <h3 className="text-sm font-bold mb-1">{item.kanal || item.baslik || item.madde}</h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.strateji || item.detay || item.aciklama}</p>
            </div>
          );
        })}
      </div>

      {data.ilkHaftaPlani && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">İlk Hafta Planı</h3>
          <div className="space-y-2">
            {data.ilkHaftaPlani.map((plan: string, i: number) => (
              <p key={i} className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{plan}</p>
            ))}
          </div>
        </div>
      )}

      {data.haftalikRapor && (
        <p className={`mt-6 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{data.haftalikRapor}</p>
      )}

      {data.gizlilikNotu && (
        <p className={`mt-6 text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>{data.gizlilikNotu}</p>
      )}
    </section>
  );
}
