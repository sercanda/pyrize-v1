'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface GuaranteeItem {
  title: string;
  description: string;
}

interface GuaranteeSectionProps {
  theme: ThemeConfig;
  guarantees?: GuaranteeItem[];
}

const DEFAULT_GUARANTEES: GuaranteeItem[] = [
  {
    title: 'Satış Olmazsa 0₺',
    description: 'Satış gerçekleşmezse hiçbir ücret talep edilmez.',
  },
  {
    title: 'Şeffaf Süreç',
    description: 'Tüm adımları gerçek zamanlı olarak paylaşıyoruz.',
  },
  {
    title: 'Hukuki Güvence',
    description: 'Tüm sözleşmeler kurumsal hukuk denetiminde yönetilir.',
  },
  {
    title: 'Gizlilik Garantisi',
    description: 'Bilgileriniz üçüncü taraflarla paylaşılmaz.',
  },
];

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({
  theme,
  guarantees,
}) => {
  const items = guarantees && guarantees.length > 0 ? guarantees : DEFAULT_GUARANTEES;

  return (
    <section className="w-full print:break-inside-avoid">
      {/* Section heading */}
      <div className="text-center mb-8 print:mb-5">
        <h2
          className={`
            text-2xl md:text-4xl font-bold tracking-tight
            ${theme.isDark ? 'text-white' : 'text-slate-900'}
            print:text-black print:text-2xl
          `}
        >
          Garantilerimiz
        </h2>
        <p
          className={`
            mt-2 text-sm md:text-base
            ${theme.textSecondary}
            print:text-slate-600 print:text-sm
          `}
        >
          Size en yüksek güvenceyi sunuyoruz
        </p>
      </div>

      {/* Guarantee cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 print:grid-cols-2 print:gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              ${theme.bgCard} rounded-2xl border ${theme.borderColor}
              p-6 md:p-7
              transition-all duration-300 hover:shadow-md
              print:bg-white print:border-slate-300 print:border print:rounded-lg print:p-4 print:shadow-none
            `}
          >
            <div className="flex items-start gap-4 print:gap-3">
              {/* Shield / checkmark icon */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl
                  ${theme.accentBg} bg-opacity-15
                  flex items-center justify-center
                  print:bg-indigo-100 print:w-10 print:h-10 print:rounded-lg
                `}
              >
                <svg
                  className={`
                    w-5 h-5 md:w-6 md:h-6
                    ${theme.textAccent}
                    print:text-indigo-900
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3
                  className={`
                    text-base md:text-lg font-semibold mb-1
                    ${theme.isDark ? 'text-white' : 'text-slate-900'}
                    print:text-black print:text-base
                  `}
                >
                  {item.title}
                </h3>
                <p
                  className={`
                    text-sm md:text-base font-light leading-relaxed
                    ${theme.textSecondary}
                    print:text-slate-700 print:text-sm
                  `}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
