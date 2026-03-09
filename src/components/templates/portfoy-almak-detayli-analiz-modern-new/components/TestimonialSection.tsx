'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface TestimonialSectionProps {
  theme: ThemeConfig;
  testimonials?: TestimonialItem[];
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { label: 'Başarılı Satış', value: '150+' },
  { label: 'Yıl Deneyim', value: '12+' },
  { label: 'Müşteri Memnuniyeti', value: '%98' },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    quote: 'Profesyonel yaklaşımı ve piyasa bilgisi sayesinde mülkümüzü beklediğimizin üzerinde bir fiyata sattık.',
    author: 'Ahmet Y.',
    role: 'Mülk Sahibi',
  },
  {
    quote: 'Süreç boyunca her adımda bilgilendirildik. Güvenilir ve şeffaf bir deneyimdi.',
    author: 'Elif K.',
    role: 'Mülk Sahibi',
  },
];

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  theme,
  testimonials,
  stats,
}) => {
  const displayStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;
  const displayTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="w-full print:break-inside-avoid">
      {/* Stats row */}
      <div
        className={`
          grid grid-cols-2 md:grid-cols-${displayStats.length > 4 ? 4 : displayStats.length} gap-4 md:gap-6 mb-10
          print:grid-cols-${displayStats.length} print:gap-4 print:mb-6
        `}
      >
        {displayStats.map((stat, index) => (
          <div
            key={index}
            className={`
              ${theme.bgCard} rounded-xl border ${theme.borderColor}
              px-4 py-6 md:px-6 md:py-8 text-center
              print:bg-white print:border-slate-300 print:border print:rounded-lg print:px-3 print:py-4
            `}
          >
            <p
              className={`
                text-3xl md:text-4xl font-bold tracking-tight
                ${theme.textAccent}
                print:text-indigo-900 print:text-2xl
              `}
            >
              {stat.value}
            </p>
            <p
              className={`
                mt-2 text-sm md:text-base font-medium
                ${theme.textSecondary}
                print:text-slate-700 print:text-xs
              `}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
        {displayTestimonials.slice(0, 2).map((testimonial, index) => (
          <div
            key={index}
            className={`
              ${theme.bgCard} rounded-2xl border ${theme.borderColor}
              px-6 py-6 md:px-8 md:py-8
              print:bg-white print:border-slate-300 print:border print:rounded-lg print:px-5 print:py-4
            `}
          >
            {/* Quotation mark */}
            <div
              className={`
                text-5xl md:text-6xl font-serif leading-none mb-3
                ${theme.textAccent} opacity-30
                print:text-indigo-200 print:text-4xl print:mb-2
              `}
            >
              &ldquo;
            </div>

            {/* Quote text */}
            <p
              className={`
                text-base md:text-lg font-light italic leading-relaxed mb-6
                ${theme.isDark ? 'text-white/80' : 'text-slate-700'}
                print:text-black print:text-sm print:mb-3
              `}
            >
              {testimonial.quote}
            </p>

            {/* Author */}
            <div className={`border-t ${theme.borderColor} pt-4 print:border-slate-200 print:pt-2`}>
              <p
                className={`
                  text-sm md:text-base font-semibold
                  ${theme.isDark ? 'text-white' : 'text-slate-900'}
                  print:text-black print:text-sm
                `}
              >
                {testimonial.author}
              </p>
              {testimonial.role && (
                <p
                  className={`
                    text-xs md:text-sm
                    ${theme.textSecondary}
                    print:text-slate-600 print:text-xs
                  `}
                >
                  {testimonial.role}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
