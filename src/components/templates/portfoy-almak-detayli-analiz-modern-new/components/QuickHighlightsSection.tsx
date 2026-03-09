'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface HighlightItem {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}

interface QuickHighlightsSectionProps {
  theme: ThemeConfig;
  highlights: HighlightItem[];
}

export const QuickHighlightsSection: React.FC<QuickHighlightsSectionProps> = ({
  theme,
  highlights,
}) => {
  if (!highlights || highlights.length === 0) return null;

  const gridCols =
    highlights.length <= 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : highlights.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-2 lg:grid-cols-4';

  return (
    <section className="w-full print:break-inside-avoid">
      <div className={`grid ${gridCols} gap-4 md:gap-6 print:gap-4 print:grid-cols-4`}>
        {highlights.map((item, index) => (
          <div
            key={index}
            className={`
              ${theme.bgCard} rounded-2xl border ${theme.borderColor}
              p-6 md:p-8 flex flex-col items-center text-center
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-lg
              print:rounded-lg print:bg-white print:border-slate-300 print:border print:p-4 print:shadow-none
            `}
          >
            {/* Icon / Emoji */}
            <div className="text-4xl md:text-5xl mb-4 print:text-3xl print:mb-2">
              {item.icon}
            </div>

            {/* Value */}
            <p
              className={`
                text-2xl md:text-3xl font-bold tracking-tight leading-tight
                ${theme.isDark ? 'text-white' : 'text-slate-900'}
                print:text-black print:text-2xl
              `}
            >
              {item.value}
            </p>

            {/* Title */}
            <p
              className={`
                mt-2 text-sm md:text-base font-semibold
                ${theme.textAccent}
                print:text-indigo-900 print:text-sm
              `}
            >
              {item.title}
            </p>

            {/* Subtitle */}
            <p
              className={`
                mt-1 text-xs md:text-sm
                ${theme.textSecondary}
                print:text-slate-600 print:text-xs
              `}
            >
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
