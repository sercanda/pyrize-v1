'use client';

import React from 'react';
import { Bolge } from '@/types';

interface FaqSectionProps {
  bolge?: Bolge;
  theme?: 'dark' | 'light';
}

export const FaqSection: React.FC<FaqSectionProps> = ({ bolge, theme = 'dark' }) => {
  if (!bolge || !bolge.altBolge || bolge.altBolge.length === 0) {
    return null;
  }

  const isDark = theme === 'dark';
  const containerClasses = isDark
    ? 'bg-[#070f23] text-slate-100 border-white/10'
    : 'bg-white text-slate-800 border-slate-200';
  const cardClasses = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-slate-50 border-slate-200';
  const titleClasses = isDark ? 'text-white' : 'text-slate-900';
  const descriptionClasses = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <section
      className={`mx-auto w-full rounded-3xl border px-6 py-10 shadow-[0_25px_70px_rgba(7,15,35,0.25)] sm:px-10 ${containerClasses}`}
      aria-labelledby="faq-section-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? 'text-cyan-200/80' : 'text-cyan-600/80'}`}>
            {bolge.baslik || 'Aklınızdaki Sorular'}
          </p>
          <h2 id="faq-section-title" className={`text-2xl font-semibold sm:text-3xl ${titleClasses}`}>
            Aklınızdaki Sorular
          </h2>
          {bolge.icerik && (
            <p className={`text-sm sm:text-base ${descriptionClasses}`}>
              {bolge.icerik}
            </p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'bg-cyan-500/10 text-cyan-200' : 'bg-cyan-100 text-cyan-700'}`}
        >
          Canlı Destek Hazır
        </span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {bolge.altBolge.map((item, index) => (
          <article
            key={`${item.baslik}-${index}`}
            className={`group rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${cardClasses}`}
          >
            <h3 className={`text-lg font-semibold ${titleClasses}`}>{item.baslik}</h3>
            <p className={`mt-3 text-sm leading-relaxed ${descriptionClasses}`}>
              {item.icerik}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

