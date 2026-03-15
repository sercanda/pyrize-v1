"use client";

import type { BolumProps } from "../BolumRenderer";

export function CtaBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";

  return (
    <section className={`min-h-screen flex flex-col items-center justify-center px-8 md:px-16 py-16 text-center ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      {data.baslik && (
        <h2 className={`text-3xl md:text-5xl font-bold mb-8 ${tema === "luks" ? "font-serif" : ""}`}>{data.baslik}</h2>
      )}

      {data.metin?.map((m: string, i: number) => (
        <p key={i} className={`text-base md:text-lg mb-4 max-w-xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{m}</p>
      ))}
      {data.paragraf && (
        <p className={`text-base md:text-lg mb-6 max-w-xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>{data.paragraf}</p>
      )}

      {data.surecAdimlari && (
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {data.surecAdimlari.map((a: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${tema === "luks" ? "bg-amber-400 text-black" : isDark ? "bg-[#DBE64C] text-[#001F3F]" : "bg-indigo-500 text-white"}`}>
                {i + 1}
              </span>
              <span className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{a}</span>
              {i < data.surecAdimlari.length - 1 && <span className="text-slate-500 mx-1">→</span>}
            </div>
          ))}
        </div>
      )}

      {data.ilkGorusmede && (
        <div className={`text-left max-w-md mb-8 p-5 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
          <p className="text-sm font-bold mb-2">İlk görüşmede:</p>
          <ul className="space-y-1">
            {data.ilkGorusmede.map((m: string, i: number) => (
              <li key={i} className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>• {m}</li>
            ))}
          </ul>
        </div>
      )}

      {(data.ctaButon || data.cta) && (
        <button className={`px-8 py-4 rounded-xl text-base font-bold transition hover:opacity-90 ${
          tema === "luks" ? "bg-amber-400 text-black" : isDark ? "bg-[#DBE64C] text-[#001F3F]" : "bg-indigo-600 text-white"
        }`}>
          {data.ctaButon || data.cta}
        </button>
      )}

      {(data.ctaAlt || data.altNot || data.altMetin) && (
        <p className={`mt-4 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{data.ctaAlt || data.altNot || data.altMetin}</p>
      )}

      {data.teklifDetayi && (
        <p className={`mt-6 text-sm max-w-md ${isDark ? "text-slate-400" : "text-slate-500"}`}>{data.teklifDetayi}</p>
      )}
    </section>
  );
}
