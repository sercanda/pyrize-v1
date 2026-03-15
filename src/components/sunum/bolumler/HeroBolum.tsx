"use client";

import type { BolumProps } from "../BolumRenderer";

export function HeroBolum({ data, tema }: BolumProps) {
  const isDark = tema === "modern" || tema === "luks";

  return (
    <section className={`min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      {data.headline && (
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight ${tema === "luks" ? "font-serif" : ""}`}>
          {data.headline}
        </h1>
      )}
      {data.altBaslik && (
        <p className={`text-lg md:text-xl mb-8 ${isDark ? "text-slate-300" : "text-slate-600"} font-light`}>
          {data.altBaslik}
        </p>
      )}
      {data.paragraflar?.map((p: string, i: number) => (
        <p key={i} className={`text-base md:text-lg mb-4 max-w-3xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {p}
        </p>
      ))}
      {data.cumleler?.map((c: string, i: number) => (
        <p key={i} className={`text-base md:text-lg mb-3 max-w-3xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {c}
        </p>
      ))}
      {data.girisMetni?.map((p: string, i: number) => (
        <p key={i} className={`text-base mb-4 max-w-3xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {p}
        </p>
      ))}
      {data.aciliyetNotu && (
        <div className={`mt-6 p-4 rounded-xl border ${isDark ? "border-red-500/30 bg-red-500/10" : "border-red-200 bg-red-50"}`}>
          <p className={`text-sm ${isDark ? "text-red-300" : "text-red-700"}`}>{data.aciliyetNotu}</p>
        </div>
      )}
    </section>
  );
}
