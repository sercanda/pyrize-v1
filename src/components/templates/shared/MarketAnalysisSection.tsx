'use client';

import React from 'react';
import { Bolge } from '@/types';

interface MarketAnalysisSectionProps {
  bolge?: Bolge;
  theme?: 'dark' | 'light';
}

const splitLines = (value?: string): string[] =>
  (value || '')
    .split(/\r?\n|\u2028|\u2029/)
    .map((line) => line.trim())
    .filter(Boolean);

export const MarketAnalysisSection: React.FC<MarketAnalysisSectionProps> = ({ bolge, theme = 'dark' }) => {
  if (!bolge) {
    return null;
  }

  const stats = bolge.altBolge?.filter((item) => item.tip === 'stats') ?? [];
  const comparisons = bolge.altBolge?.filter((item) => item.tip === 'comparison') ?? [];
  const notes = bolge.altBolge?.filter((item) => item.tip !== 'stats' && item.tip !== 'comparison') ?? [];

  const isDark = theme === 'dark';

  const sectionClasses = isDark
    ? 'bg-gradient-to-br from-[#050b1d] via-[#071531] to-[#071c3b] text-slate-100 border-white/10'
    : 'bg-slate-50 text-slate-800 border-slate-200';
  const cardClasses = isDark
    ? 'bg-white/5 border-white/10 text-white'
    : 'bg-white border-slate-200 text-slate-800';
  const badgeClasses = isDark
    ? 'bg-cyan-500/15 text-cyan-200'
    : 'bg-cyan-100 text-cyan-700';
  const subtitleClasses = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <section
      className={`mx-auto w-full rounded-3xl border px-6 py-10 shadow-[0_20px_65px_rgba(6,15,30,0.25)] sm:px-10 ${sectionClasses}`}
      aria-labelledby="market-analysis-title"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
            {bolge.baslik || 'Veriye Dayalı Piyasa Analizi'}
          </p>
          <h2 id="market-analysis-title" className={`text-2xl font-semibold sm:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Veriye Dayalı Piyasa Analizi
          </h2>
          {bolge.icerik && (
            <p className={`text-sm sm:text-base leading-relaxed ${subtitleClasses}`}>
              {bolge.icerik}
            </p>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((item, index) => {
            const parts = item.icerik.split('|').map((part) => part.trim());
            return (
              <article
                key={`${item.baslik}-${index}`}
                className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${cardClasses}`}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-400/90">Gösterge</p>
                <h3 className="mt-2 text-lg font-semibold">{item.baslik}</h3>
                <p className="mt-3 text-2xl font-bold text-emerald-300">
                  {parts[0] || item.icerik}
                </p>
                {parts.slice(1).map((line, lineIdx) => (
                  <p key={lineIdx} className="mt-2 text-xs text-slate-300">
                    {line}
                  </p>
                ))}
              </article>
            );
          })}
        </div>
      )}

      {comparisons.length > 0 && (
        <div className={`mt-10 overflow-hidden rounded-2xl border ${cardClasses}`}>
          <div className={`grid grid-cols-2 gap-4 border-b px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'border-white/10 text-slate-200' : 'border-slate-200 text-slate-600'}`}>
            <span>Emsal</span>
            <span>Özet</span>
          </div>
          <div className="divide-y divide-white/10">
            {comparisons.flatMap((item) =>
              splitLines(item.icerik).map((line, index) => {
                const [address, ...rest] = line.split('|').map((part) => part.trim());
                return (
                  <div key={`${address}-${index}`} className="grid grid-cols-2 gap-4 px-6 py-4 text-sm">
                    <span className="font-medium">{address}</span>
                    <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {rest.join(' • ') || 'Detay sağlanmadı'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="mt-8 space-y-3">
          {notes.map((item, index) => (
            <div
              key={`${item.baslik}-${index}`}
              className={`rounded-2xl border px-5 py-4 text-sm leading-relaxed ${cardClasses}`}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">{item.baslik}</p>
              <p className="mt-2 text-sm">{item.icerik}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

