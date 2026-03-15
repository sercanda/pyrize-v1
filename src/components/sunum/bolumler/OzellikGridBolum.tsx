"use client";

import type { BolumProps } from "../BolumRenderer";

const IKON_MAP: Record<string, string> = {
  konum: "📍",
  buyukluk: "📐",
  bina: "🏢",
  yatirim: "📈",
  yasam: "🌳",
  odeme: "💳",
};

export function OzellikGridBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";
  const kartlar = data.kartlar || [];

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      {data.baslik && (
        <h2 className="text-3xl md:text-4xl font-bold mb-10">{data.baslik}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kartlar.map((kart: any, i: number) => (
          <div key={i} className={`p-6 rounded-2xl border ${isDark ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]" : "border-slate-200 bg-slate-50 hover:bg-slate-100"} transition`}>
            <div className="text-2xl mb-3">{IKON_MAP[kart.ikonTip] || "✦"}</div>
            <h3 className="text-base font-bold mb-2">{kart.baslik}</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {kart.aciklama}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
