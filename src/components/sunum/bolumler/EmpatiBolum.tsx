"use client";

import type { BolumProps } from "../BolumRenderer";

export function EmpatiBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";
  const endiseler = data.endiseler || data.sorular || [];
  const taahhutler = data.taahhutler || [];

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      {data.baslik && <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.baslik}</h2>}
      {data.headline && <p className={`text-xl mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{data.headline}</p>}

      {data.girisMetni?.map((p: string, i: number) => (
        <p key={i} className={`text-base mb-4 max-w-3xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>{p}</p>
      ))}

      {/* Endişe-Cevap çiftleri */}
      {endiseler.length > 0 && (
        <div className="space-y-4 mt-6 max-w-3xl">
          {endiseler.map((item: any, i: number) => (
            <div key={i} className={`p-5 rounded-xl border ${isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white"}`}>
              <h3 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDark ? "text-red-300" : "text-red-600"}`}>
                <span>?</span> {item.endise || item.soru}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {item.cevap}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Taahhütler */}
      {taahhutler.length > 0 && (
        <div className="space-y-3 mt-8 max-w-3xl">
          {taahhutler.map((t: any, i: number) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDark ? "bg-[#DBE64C]/20" : "bg-indigo-100"}`}>
                <svg className={`w-3.5 h-3.5 ${isDark ? "text-[#DBE64C]" : "text-indigo-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">{typeof t === "string" ? t : t.madde}</p>
                {typeof t !== "string" && t.detay && (
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.detay}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doğrulama kanalları */}
      {data.dogrulamaKanallari && (
        <div className="mt-8 space-y-2 max-w-3xl">
          {data.dogrulamaKanallari.map((k: string, i: number) => (
            <p key={i} className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>→ {k}</p>
          ))}
        </div>
      )}

      {data.aciklikMesaji && <p className={`mt-6 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{data.aciklikMesaji}</p>}
      {data.sozlesmeNotu && <p className={`mt-4 text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>{data.sozlesmeNotu}</p>}

      {/* Artılar/eksiler (şeffaf rapor) */}
      {data.artilar && (
        <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-3xl">
          <div>
            <h3 className="text-sm font-bold mb-3 text-emerald-400">Artılar</h3>
            {data.artilar.map((a: string, i: number) => <p key={i} className="text-sm mb-1">+ {a}</p>)}
          </div>
          <div>
            <h3 className="text-sm font-bold mb-3 text-amber-400">Geliştirilecekler</h3>
            {data.eksiler?.map((e: string, i: number) => <p key={i} className="text-sm mb-1">- {e}</p>)}
          </div>
        </div>
      )}
    </section>
  );
}
