'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { mapSunumToTemplateData } from '../shared/mapSunumData';

import { HeroSection } from '../portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { UrgencyBannerSection } from '../portfoy-almak-detayli-analiz-modern-new/components/UrgencyBannerSection';
import { QuickHighlightsSection } from '../portfoy-almak-detayli-analiz-modern-new/components/QuickHighlightsSection';
import { RegionalComparisonSection } from '../portfoy-almak-detayli-analiz-modern-new/components/RegionalComparisonSection';
import { SalesProcessSection } from '../portfoy-almak-detayli-analiz-modern-new/components/SalesStrategySection';
import { ConsultantTrustSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';
import { FAQSection } from '../portfoy-almak-detayli-analiz-modern-new/components/FAQSection';

interface Props {
  data: OlusturulanSunum;
}

/** Hızlı Satış — "Bold Action" Konsepti
 *  Aciliyet ve harekete geçirme odaklı.
 *  Üstte urgency şeridi, büyük tipografi, high-contrast düzen.
 */
export default function TemplateHizliSatis({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);
  const theme = mapped.theme;

  const quickSteps = mapped.salesSteps.slice(0, 3);
  const quickFaqs = mapped.faqs.slice(0, 3);

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';

  // Üst urgency ribbon — sayfanın en üstünde dominant
  const UrgencyRibbon = () => (
    <div
      className="w-full py-3 px-6 flex items-center justify-center gap-3 print:py-2"
      style={{
        background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
      }}
    >
      <span className="text-white text-xs font-black uppercase tracking-[0.35em]">⚡ Acil Satış Fırsatı</span>
      <span className="hidden sm:block w-px h-3 bg-white/30" />
      <span className="hidden sm:block text-red-100 text-[10px] uppercase tracking-wider">Sınırlı Süre</span>
    </div>
  );

  return (
    <div
      data-konsept="hizli-satis"
      className={`${theme.bgPrimary} min-h-screen font-sans ${theme.textPrimary} antialiased ${theme.selectionBg} ${theme.selectionText} relative overflow-x-hidden print:bg-white print:text-black ${!theme.isDark ? 'pdf-theme-light' : ''}`}
    >
      {/* Gradient Background */}
      {theme.isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} h-full`} />
        </div>
      )}

      {/* Urgency Ribbon at top — web only */}
      <div className="relative z-20 print:hidden">
        <UrgencyRibbon />
      </div>

      <div className={`relative z-10 max-w-[1440px] mx-auto ${theme.bgPrimary} ${theme.isDark ? 'shadow-2xl shadow-black' : 'shadow-lg shadow-slate-200'} print:bg-transparent print:shadow-none print:w-full print:max-w-none`}>
        <main className="flex flex-col gap-0 print:gap-0">

          {/* PAGE 1: URGENCY BANNER → HERO → QUICK HIGHLIGHTS */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-8 print:py-8 relative">
            {/* Print-only urgency banner */}
            <div className="hidden print:block mb-6">
              <div
                className="w-full py-2 px-6 text-center text-white text-xs font-black uppercase tracking-[0.3em]"
                style={{ background: '#dc2626' }}
              >
                ⚡ Acil Satış Fırsatı — Sınırlı Süre
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-start pt-12 gap-10 px-6 md:px-12 lg:px-16 print:px-0 print:gap-8 print:block">
              {/* UrgencyBanner ÖNCE - hızlı satışta urgency hero'nun üstünde */}
              <div className="print:hidden">
                <UrgencyBannerSection
                  theme={theme}
                  urgencyText={mapped.urgency?.text}
                  scarcityNote={mapped.urgency?.scarcityNote}
                />
              </div>

              <HeroSection
                property={mapped.property}
                heroDescription={mapped.heroDescription}
                heroHighlight={mapped.heroHighlight}
                theme={theme}
                variant="bold"
              />

              {mapped.quickHighlights && mapped.quickHighlights.length > 0 && (
                <div className="print:mt-6">
                  <QuickHighlightsSection theme={theme} highlights={mapped.quickHighlights} />
                </div>
              )}

              {/* Print urgency tekrar */}
              <div className="hidden print:block print:mt-6">
                <UrgencyBannerSection
                  theme={theme}
                  urgencyText={mapped.urgency?.text}
                  scarcityNote={mapped.urgency?.scarcityNote}
                />
              </div>
            </div>
          </div>

          {/* PAGE 2: VALUATION + PROCESS (3 steps) */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-10 print:px-8 print:break-after-page">
            {/* Bold section header */}
            <div
              className={`mb-10 pb-4 border-b-2 flex items-center gap-3 print:mb-6 print:pb-3`}
              style={{ borderColor: theme.isDark ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.5)' }}
            >
              <span
                className="text-[10px] font-black uppercase tracking-[0.4em] px-2 py-0.5"
                style={{ background: '#dc2626', color: '#fff' }}
              >
                02
              </span>
              <span className={`text-xs font-bold uppercase tracking-[0.25em] ${theme.textSecondary}`}>
                Değerleme & Satış Planı
              </span>
            </div>
            <div className="space-y-16 print:space-y-8">
              <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} theme={theme} variant="compact" />
              <SalesProcessSection steps={quickSteps} theme={theme} variant="compact" />
            </div>
          </div>

          {/* PAGE 3: CONSULTANT + FAQ + FOOTER */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-10 print:px-8 print:break-after-page">
            <div
              className={`mb-10 pb-4 border-b-2 flex items-center gap-3 print:mb-6 print:pb-3`}
              style={{ borderColor: theme.isDark ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.5)' }}
            >
              <span
                className="text-[10px] font-black uppercase tracking-[0.4em] px-2 py-0.5"
                style={{ background: '#dc2626', color: '#fff' }}
              >
                03
              </span>
              <span className={`text-xs font-bold uppercase tracking-[0.25em] ${theme.textSecondary}`}>
                Danışman & SSS
              </span>
            </div>
            <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
              <ConsultantTrustSection consultant={mapped.consultant} theme={theme} variant="card" />
              <FAQSection faqs={quickFaqs} theme={theme} variant="inline" />
            </div>
            <footer className={`border-t ${theme.borderColor} py-8 flex flex-col items-center text-center mt-auto print:py-6 print:bg-transparent print:border-slate-300 print:mt-8`}>
              <p className={`${theme.textSecondary} text-xs uppercase tracking-widest mb-2 print:text-slate-800`}>Gizli ve Özel Ticari Bilgi İçerir</p>
              <p className={`${theme.textSecondary} font-medium text-sm mb-6 print:text-black`}>© {new Date().getFullYear()} {ofisAdi} Gayrimenkul Danışmanlığı</p>
              <div className="flex flex-col items-center gap-2 opacity-70 print:opacity-100">
                <a href="https://pyrize.com" target="_blank" rel="noopener noreferrer" className={`text-[10px] font-semibold ${theme.isDark ? 'text-slate-600' : 'text-slate-400'} uppercase tracking-wider print:text-slate-800`}>
                  powered by pyrize.com
                </a>
              </div>
            </footer>
          </div>

        </main>
      </div>
    </div>
  );
}
