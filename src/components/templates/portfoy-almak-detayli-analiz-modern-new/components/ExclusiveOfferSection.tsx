'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface ExclusiveOfferSectionProps {
  theme: ThemeConfig;
  offerTitle?: string;
  offerDetails?: string[];
  consultantName?: string;
}

const DEFAULT_OFFER_DETAILS = [
  'Kişiye özel mülk turu',
  'Detaylı değerleme raporu',
  'Finansman danışmanlığı',
];

export const ExclusiveOfferSection: React.FC<ExclusiveOfferSectionProps> = ({
  theme,
  offerTitle = 'Özel Davet',
  offerDetails,
  consultantName,
}) => {
  const details = offerDetails && offerDetails.length > 0
    ? offerDetails
    : DEFAULT_OFFER_DETAILS;

  // Gold border for luks theme, blue for others
  const borderStyle =
    theme.id === 'luks'
      ? 'border-amber-500/40'
      : theme.isDark
        ? 'border-indigo-500/30'
        : 'border-blue-400/40';

  const accentColor =
    theme.id === 'luks'
      ? 'text-amber-400'
      : theme.isDark
        ? 'text-indigo-400'
        : 'text-blue-600';

  const checkColor =
    theme.id === 'luks'
      ? 'text-amber-400'
      : theme.isDark
        ? 'text-indigo-400'
        : 'text-blue-600';

  return (
    <section className="w-full print:break-inside-avoid">
      <div className="max-w-2xl mx-auto">
        <div
          className={`
            border-2 ${borderStyle} rounded-2xl
            px-8 py-8 md:px-10 md:py-10
            ${theme.bgCard}
            print:bg-white print:border-slate-400 print:border print:rounded-lg print:px-6 print:py-6
          `}
        >
          {/* Decorative top line */}
          <div className="flex justify-center mb-6 print:mb-4">
            <div
              className={`
                h-px w-20
                ${theme.id === 'luks' ? 'bg-amber-500/50' : theme.isDark ? 'bg-indigo-500/50' : 'bg-blue-400/50'}
                print:bg-slate-300
              `}
            />
          </div>

          {/* Title */}
          <h3
            className={`
              text-2xl md:text-3xl font-semibold text-center tracking-tight mb-6
              ${theme.isDark ? 'text-white' : 'text-slate-900'}
              print:text-black print:text-2xl print:mb-4
            `}
          >
            {offerTitle}
          </h3>

          {/* Checklist items */}
          <ul className="space-y-4 mb-8 print:space-y-2 print:mb-4">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-3">
                {/* Checkmark icon */}
                <svg
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${checkColor} print:text-indigo-900`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  className={`
                    text-base md:text-lg font-light
                    ${theme.isDark ? 'text-white/85' : 'text-slate-700'}
                    print:text-black print:text-sm
                  `}
                >
                  {detail}
                </span>
              </li>
            ))}
          </ul>

          {/* Bottom invitation */}
          <div
            className={`
              border-t ${theme.borderColor} pt-6
              text-center
              print:border-slate-300 print:pt-4
            `}
          >
            <p
              className={`
                text-sm md:text-base font-medium
                ${accentColor}
                print:text-indigo-900 print:text-sm
              `}
            >
              Özel gösterim için iletişime geçin
            </p>
            {consultantName && (
              <p
                className={`
                  mt-2 text-lg md:text-xl font-semibold
                  ${theme.isDark ? 'text-white' : 'text-slate-900'}
                  print:text-black print:text-base
                `}
              >
                {consultantName}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
