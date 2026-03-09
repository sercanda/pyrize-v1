'use client';

import React from 'react';
import { ThemeConfig } from '../../shared/themeConfig';

interface CompactSummarySectionProps {
  theme: ThemeConfig;
  property: Record<string, unknown>;
  estimatedValue?: string;
}

export const CompactSummarySection: React.FC<CompactSummarySectionProps> = ({
  theme,
  property,
  estimatedValue,
}) => {
  // Extract property data with safe fallbacks
  const konum = (property as Record<string, unknown>)?.konumAnalizi as Record<string, unknown> | undefined;
  const tip = (property.mulkTipi as string) || (property.tip as string) || 'Belirtilmemiş';
  const location =
    (konum?.ilIlce as string) ||
    (konum?.mahalle as string) ||
    (property.konum as string) ||
    'Belirtilmemiş';
  const metrekare =
    (property.metrekare as string | number) ||
    (property.alan as string | number) ||
    '-';
  const odaSayisi =
    (property.odaSayisi as string) ||
    (property.oda as string) ||
    '-';
  const kat =
    (property.kat as string | number) ||
    (property.katSayisi as string | number) ||
    '-';
  const binaYasi =
    (property.binaYasi as string | number) ||
    (property.ypiYili as string | number) ||
    '-';
  const fiyat =
    (property.fiyat as string | number) ||
    (property.tahminiDeger as string | number) ||
    estimatedValue ||
    '-';

  // Key features
  const ozellikler = (property.ozellikler as string[]) || [];
  const displayFeatures = ozellikler.length > 0
    ? ozellikler.slice(0, 4)
    : ['Merkezi konum', 'Bakımlı bina', 'Yatırıma uygun'];

  // Consultant info
  const consultant = (property.danisman as Record<string, unknown>) || {};
  const consultantName = (consultant.adSoyad as string) || '';
  const consultantPhone = (consultant.telefon as string) || '';
  const consultantOffice = (consultant.ofisAdi as string) || '';

  return (
    <section className="w-full print:break-inside-avoid">
      <div
        className={`
          ${theme.bgCard} rounded-2xl border ${theme.borderColor}
          overflow-hidden
          print:bg-white print:border-slate-300 print:border print:rounded-lg
        `}
      >
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${theme.isDark ? 'divide-white/10' : 'divide-slate-200'} print:divide-slate-300">
          {/* Left side: Property details */}
          <div className="p-6 md:p-8 print:p-5">
            <h3
              className={`
                text-xs font-bold uppercase tracking-widest mb-5
                ${theme.textAccent}
                print:text-indigo-900 print:mb-3
              `}
            >
              Mülk Bilgileri
            </h3>

            <div className="space-y-4 print:space-y-2">
              <DetailRow
                theme={theme}
                label="Tip"
                value={String(tip)}
              />
              <DetailRow
                theme={theme}
                label="Konum"
                value={String(location)}
              />
              <DetailRow
                theme={theme}
                label="Alan"
                value={`${metrekare} m²`}
              />
              <DetailRow
                theme={theme}
                label="Oda Sayısı"
                value={String(odaSayisi)}
              />
              <DetailRow
                theme={theme}
                label="Kat"
                value={String(kat)}
              />
              <DetailRow
                theme={theme}
                label="Bina Yaşı"
                value={String(binaYasi)}
              />
            </div>
          </div>

          {/* Right side: Value + features */}
          <div className="p-6 md:p-8 print:p-5">
            {/* Estimated value */}
            <h3
              className={`
                text-xs font-bold uppercase tracking-widest mb-3
                ${theme.textAccent}
                print:text-indigo-900 print:mb-2
              `}
            >
              Tahmini Değer
            </h3>
            <p
              className={`
                text-3xl md:text-4xl font-bold tracking-tight mb-6
                ${theme.isDark ? 'text-white' : 'text-slate-900'}
                print:text-black print:text-2xl print:mb-4
              `}
            >
              {typeof fiyat === 'number'
                ? `₺${fiyat.toLocaleString('tr-TR')}`
                : String(fiyat).startsWith('₺') ? fiyat : `₺${fiyat}`}
            </p>

            {/* Key features */}
            <h3
              className={`
                text-xs font-bold uppercase tracking-widest mb-3
                ${theme.textAccent}
                print:text-indigo-900 print:mb-2
              `}
            >
              Öne Çıkan Özellikler
            </h3>
            <ul className="space-y-2 print:space-y-1">
              {displayFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span
                    className={`
                      w-1.5 h-1.5 rounded-full flex-shrink-0
                      ${theme.accentBg}
                      print:bg-indigo-900
                    `}
                  />
                  <span
                    className={`
                      text-sm
                      ${theme.textSecondary}
                      print:text-slate-700 print:text-sm
                    `}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom consultant strip */}
        {(consultantName || consultantPhone || consultantOffice) && (
          <div
            className={`
              border-t ${theme.borderColor}
              px-6 py-4 md:px-8 md:py-4
              flex flex-wrap items-center justify-between gap-3
              ${theme.isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}
              print:bg-slate-50 print:border-slate-300 print:px-5 print:py-3
            `}
          >
            {consultantName && (
              <span
                className={`
                  text-sm font-semibold
                  ${theme.isDark ? 'text-white' : 'text-slate-900'}
                  print:text-black
                `}
              >
                {consultantName}
              </span>
            )}
            {consultantOffice && (
              <span
                className={`
                  text-sm
                  ${theme.textSecondary}
                  print:text-slate-600
                `}
              >
                {consultantOffice}
              </span>
            )}
            {consultantPhone && (
              <span
                className={`
                  text-sm font-medium
                  ${theme.textAccent}
                  print:text-indigo-900
                `}
              >
                {consultantPhone}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

/** Small helper component for property detail rows */
interface DetailRowProps {
  theme: ThemeConfig;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ theme, label, value }) => (
  <div className="flex items-center justify-between">
    <span
      className={`
        text-sm
        ${theme.textSecondary}
        print:text-slate-600 print:text-sm
      `}
    >
      {label}
    </span>
    <span
      className={`
        text-sm font-semibold
        ${theme.isDark ? 'text-white' : 'text-slate-900'}
        print:text-black print:text-sm
      `}
    >
      {value}
    </span>
  </div>
);
