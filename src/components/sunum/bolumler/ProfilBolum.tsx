"use client";

import type { BolumProps } from "../BolumRenderer";

export function ProfilBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      {data.baslik && (
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{data.baslik}</h2>
      )}

      {data.deneyimMetni?.map((p: string, i: number) => (
        <p key={i} className={`text-base mb-4 max-w-3xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{p}</p>
      ))}
      {data.referansMetni?.map((p: string, i: number) => (
        <p key={i} className={`text-base mb-4 max-w-3xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{p}</p>
      ))}

      {data.referanslar && data.referanslar.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {data.referanslar.map((ref: any, i: number) => (
            <div key={i} className={`p-5 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
              <p className={`text-xs font-bold mb-2 ${tema === "luks" ? "text-amber-400" : isDark ? "text-[#DBE64C]" : "text-indigo-600"}`}>
                {ref.tip || "Referans"}
              </p>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {ref.aciklama || ref.sonuc || ref}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.taahhutler && data.taahhutler.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-bold mb-4">Taahhütlerimiz</h3>
          {data.taahhutler.map((t: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tema === "luks" ? "text-amber-400" : isDark ? "text-[#DBE64C]" : "text-indigo-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {typeof t === "string" ? t : `${t.madde}: ${t.detay}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.sertifikalar && (
        <div className="mt-6 flex flex-wrap gap-2">
          {data.sertifikalar.map((s: string, i: number) => (
            <span key={i} className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{s}</span>
          ))}
        </div>
      )}
    </section>
  );
}
