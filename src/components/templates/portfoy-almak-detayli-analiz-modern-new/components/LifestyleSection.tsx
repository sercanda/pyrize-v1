'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface LifestyleSectionProps {
  theme: ThemeConfig;
  lifestyleText?: string;
  aspirationPoints?: string[];
  socialProof?: string;
}

const DEFAULT_ASPIRATION_POINTS = [
  'Seçkin komşuluk',
  'Premium yaşam standartları',
  'Ayrıcalıklı konum',
];

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  theme,
  lifestyleText = 'Yaşam Tarzınızı Yükseltin',
  aspirationPoints,
  socialProof,
}) => {
  const points = aspirationPoints && aspirationPoints.length > 0
    ? aspirationPoints
    : DEFAULT_ASPIRATION_POINTS;

  return (
    <section className="w-full print:break-inside-avoid">
      <div className="max-w-3xl mx-auto text-center">
        {/* Elegant heading */}
        <h2
          className={`
            text-3xl md:text-5xl font-light italic tracking-tight leading-tight mb-10
            ${theme.isDark ? 'text-white' : 'text-slate-900'}
            print:text-black print:text-3xl print:mb-6
          `}
        >
          {lifestyleText}
        </h2>

        {/* Aspiration points with elegant dividers */}
        <div className="space-y-0 mb-10 print:mb-6">
          {points.map((point, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div className="flex items-center justify-center py-3 print:py-2">
                  <div
                    className={`
                      h-px w-16
                      ${theme.isDark ? 'bg-white/15' : 'bg-slate-200'}
                      print:bg-slate-300
                    `}
                  />
                </div>
              )}
              <div className="py-3 md:py-4 print:py-2">
                <p
                  className={`
                    text-lg md:text-xl font-light tracking-wide
                    ${theme.textAccent}
                    print:text-indigo-900 print:text-base
                  `}
                >
                  {point}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Social proof quote */}
        {socialProof && (
          <div
            className={`
              border ${theme.borderAccent} rounded-xl
              px-8 py-6 md:px-10 md:py-8
              ${theme.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'}
              print:bg-white print:border-slate-400 print:px-6 print:py-4
            `}
          >
            {/* Decorative quotation mark */}
            <div
              className={`
                text-4xl md:text-5xl font-serif leading-none mb-2
                ${theme.textAccent} opacity-40
                print:text-indigo-300 print:text-3xl
              `}
            >
              &ldquo;
            </div>
            <p
              className={`
                text-base md:text-lg italic font-light leading-relaxed
                ${theme.isDark ? 'text-white/80' : 'text-slate-700'}
                print:text-black print:text-sm
              `}
            >
              {socialProof}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
