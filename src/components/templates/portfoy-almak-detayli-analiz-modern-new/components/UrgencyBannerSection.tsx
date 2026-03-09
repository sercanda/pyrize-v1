'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface UrgencyBannerSectionProps {
  theme: ThemeConfig;
  urgencyText?: string;
  scarcityNote?: string;
}

export const UrgencyBannerSection: React.FC<UrgencyBannerSectionProps> = ({
  theme,
  urgencyText = 'Bu Fırsat Sınırlı Süre Geçerli',
  scarcityNote = 'Bölgede benzer özelliklere sahip mülk sayısı azalıyor',
}) => {
  return (
    <section className="w-full print:break-inside-avoid">
      <div
        className={`
          relative w-full overflow-hidden rounded-2xl
          bg-gradient-to-r from-red-600 via-orange-500 to-red-600
          px-6 py-5 md:px-10 md:py-6
          print:rounded-none print:bg-red-600 print:py-4
        `}
      >
        {/* Subtle animated glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse print:hidden" />

        <div className="relative z-10 flex flex-col items-center text-center gap-2 md:flex-row md:text-left md:gap-4">
          {/* Pulsing warning dot */}
          <div className="flex items-center justify-center flex-shrink-0">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75 print:hidden" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-yellow-400 print:bg-yellow-500" />
            </span>
          </div>

          <div className="flex-1">
            <h3
              className={`
                text-lg md:text-xl font-bold tracking-tight leading-tight
                ${theme.isDark ? 'text-white' : 'text-white'}
                print:text-white print:text-lg
              `}
            >
              {urgencyText}
            </h3>
            <p
              className={`
                mt-1 text-sm md:text-base font-medium leading-snug
                ${theme.isDark ? 'text-red-100' : 'text-red-50'}
                print:text-red-100 print:text-sm
              `}
            >
              {scarcityNote}
            </p>
          </div>

          {/* Warning icon */}
          <div className="flex-shrink-0 hidden md:block print:hidden">
            <svg
              className="w-8 h-8 text-yellow-300 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
