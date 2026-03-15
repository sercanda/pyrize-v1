'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { mapSunumToTemplateData } from '../shared/mapSunumData';

import { HeroSection } from '../portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { CompactSummarySection } from '../portfoy-almak-detayli-analiz-modern-new/components/CompactSummarySection';
import { BenefitsSection } from '../portfoy-almak-detayli-analiz-modern-new/components/PropertyFeaturesSection';
import { ConsultantTrustSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';

interface Props {
  data: OlusturulanSunum;
}

/** Minimalist — "Clean Sheet" Konsepti
 *  Hick's Law. Yalnızca esansiyel bilgi. Karar hızlanır.
 *  Ultra narrow container, tek accent rengi, typographic dividers.
 */
export default function TemplateMinimalist({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);
  const theme = mapped.theme;

  const essentialBenefits = mapped.salesBenefits.slice(0, 3);

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';

  // Single accent color — one thin line, no decoration
  const ACCENT = theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
  const ACCENT_STRONG = theme.isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)';

  // Typographic section label — no background, no icon, just text + line
  const SectionDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 mb-10 print:mb-6">
      <div className="flex-1 h-px" style={{ background: ACCENT }} />
      <span
        className={`text-[9px] uppercase tracking-[0.6em] font-medium ${theme.textSecondary} shrink-0`}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: ACCENT }} />
    </div>
  );

  return (
    <div
      data-konsept="minimalist"
      className={`${theme.bgPrimary} min-h-screen font-sans ${theme.textPrimary} antialiased ${theme.selectionBg} ${theme.selectionText} relative overflow-x-hidden print:bg-white print:text-black ${!theme.isDark ? 'pdf-theme-light' : ''}`}
    >
      {/* Gradient Background */}
      {theme.isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} h-full`} />
        </div>
      )}

      {/* Minimal top rule — single line, no bar */}
      <div
        className="relative z-20 w-full print:hidden"
        style={{ height: '2px', background: ACCENT_STRONG }}
      />

      {/* ULTRA NARROW container — max-w-2xl editorial column */}
      <div className={`relative z-10 max-w-2xl mx-auto ${theme.bgPrimary} print:bg-transparent print:shadow-none print:w-full print:max-w-none`}>
        <main className="flex flex-col gap-0 print:gap-0">

          {/* PAGE 1: HERO + COMPACT SUMMARY */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-12 print:py-12 relative">
            <div className="flex-1 flex flex-col justify-center gap-14 px-6 py-20 print:px-0 print:gap-10 print:block">
              {/* Page label */}
              <div className="flex items-center gap-3 print:hidden">
                <div className="h-px flex-1" style={{ background: ACCENT }} />
                <span className={`text-[8px] uppercase tracking-[0.8em] ${theme.textSecondary}`}>Mülk Sunumu</span>
              </div>

              <HeroSection
                property={mapped.property}
                heroDescription={mapped.heroDescription}
                heroHighlight={mapped.heroHighlight}
                theme={theme}
                variant="clean"
              />

              <div
                className="w-full h-px print:hidden"
                style={{ background: ACCENT }}
              />

              <div className="print:mt-8">
                <CompactSummarySection
                  theme={theme}
                  property={mapped.property as unknown as Record<string, unknown>}
                  estimatedValue={mapped.valuation.estimatedValueRange}
                />
              </div>
            </div>
          </div>

          {/* PAGE 2: BENEFITS */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-12 print:break-after-page">
            <SectionDivider label="Neden Bu Mülk" />
            <BenefitsSection benefits={essentialBenefits} theme={theme} variant="numbered" />
          </div>

          {/* PAGE 3: CONSULTANT + FOOTER */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-12 print:break-after-page">
            <SectionDivider label="Danışmanınız" />
            <div className="flex-grow flex flex-col justify-start">
              <ConsultantTrustSection consultant={mapped.consultant} theme={theme} variant="minimal" />
            </div>
            <footer className="pt-12 mt-auto print:pt-8 print:mt-8">
              <div
                className="w-full h-px mb-8 print:mb-6"
                style={{ background: ACCENT }}
              />
              <div className="flex flex-col items-center text-center">
                <p className={`${theme.textSecondary} text-[10px] uppercase tracking-[0.4em] mb-1 print:text-slate-700`}>
                  Gizli ve Özel Ticari Bilgi
                </p>
                <p className={`${theme.textSecondary} text-xs mb-6 print:text-black`}>
                  © {new Date().getFullYear()} {ofisAdi} Gayrimenkul Danışmanlığı
                </p>
                <a
                  href="https://pyrize.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[9px] uppercase tracking-[0.5em] opacity-30 print:opacity-60 print:text-slate-600 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  pyrize.com
                </a>
              </div>
            </footer>
          </div>

        </main>
      </div>
    </div>
  );
}
