'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { mapSunumToTemplateData } from '../shared/mapSunumData';
import { getThemeConfig } from '../shared/themeConfig';

import { HeroSection } from '../portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { ConsultantTrustSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';
import { TestimonialSection } from '../portfoy-almak-detayli-analiz-modern-new/components/TestimonialSection';
import { BenefitsSection } from '../portfoy-almak-detayli-analiz-modern-new/components/PropertyFeaturesSection';
import { SalesProcessSection } from '../portfoy-almak-detayli-analiz-modern-new/components/SalesStrategySection';
import { RegionalComparisonSection } from '../portfoy-almak-detayli-analiz-modern-new/components/RegionalComparisonSection';
import { GuaranteeSection } from '../portfoy-almak-detayli-analiz-modern-new/components/GuaranteeSection';
import { FAQSection } from '../portfoy-almak-detayli-analiz-modern-new/components/FAQSection';

interface Props {
  data: OlusturulanSunum;
}

export default function TemplateGuvenOdakli({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);
  const theme = mapped.theme;

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';

  return (
    <div className={`${theme.bgPrimary} min-h-screen font-sans ${theme.textPrimary} antialiased ${theme.selectionBg} ${theme.selectionText} relative overflow-x-hidden print:bg-white print:text-black ${!theme.isDark ? 'pdf-theme-light' : ''}`}>
      {/* Gradient Background - only for dark themes */}
      {theme.isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} h-full`}></div>
        </div>
      )}

      <div className={`relative z-10 max-w-[1440px] mx-auto ${theme.bgPrimary} ${theme.isDark ? 'shadow-2xl shadow-black' : 'shadow-lg shadow-slate-200'} print:bg-transparent print:shadow-none print:w-full print:max-w-none`}>
        <main className="flex flex-col gap-24 print:gap-0">

          {/* PAGE 1: HERO + CONSULTANT (Trust first!) */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-8 print:py-8 relative">
            <div className="flex-1 flex flex-col justify-center gap-12 px-6 md:px-12 lg:px-16 print:px-0 print:gap-8 print:block">
              <HeroSection property={mapped.property} heroDescription={mapped.heroDescription} heroHighlight={mapped.heroHighlight} theme={theme} />
              <div className="print:mt-8">
                <ConsultantTrustSection consultant={mapped.consultant} theme={theme} />
              </div>
            </div>
          </div>

          {/* PAGE 2: TESTIMONIALS + BENEFITS */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-16 print:space-y-10">
              <TestimonialSection theme={theme} testimonials={mapped.testimonials} />
              <BenefitsSection benefits={mapped.salesBenefits} theme={theme} />
            </div>
          </div>

          {/* PAGE 3: PROCESS + VALUATION */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-16 print:space-y-10">
              <SalesProcessSection steps={mapped.salesSteps} theme={theme} />
              <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} theme={theme} />
            </div>
          </div>

          {/* PAGE 4: GUARANTEES + FAQ + FOOTER */}
          <div data-pdf-page="4" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
              <GuaranteeSection theme={theme} guarantees={mapped.guarantees} />
              <FAQSection faqs={mapped.faqs} theme={theme} />
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
