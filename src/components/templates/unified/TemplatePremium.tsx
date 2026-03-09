'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { mapSunumToTemplateData } from '../shared/mapSunumData';

import { HeroSection } from '../portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { RegionalComparisonSection } from '../portfoy-almak-detayli-analiz-modern-new/components/RegionalComparisonSection';
import { BenefitsSection } from '../portfoy-almak-detayli-analiz-modern-new/components/PropertyFeaturesSection';
import { SalesProcessSection } from '../portfoy-almak-detayli-analiz-modern-new/components/SalesStrategySection';
import { PropertyPlanSection } from '../portfoy-almak-detayli-analiz-modern-new/components/LocationAdvantagesSection';
import { FAQSection } from '../portfoy-almak-detayli-analiz-modern-new/components/FAQSection';
import { ConsultantTrustSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';

interface Props {
  data: OlusturulanSunum;
}

export default function TemplatePremium({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';

  return (
    <div className="bg-stone-950 min-h-screen font-sans text-stone-200 antialiased selection:bg-amber-500 selection:text-white relative overflow-x-hidden print:bg-white print:text-black">
      {/* Luxury Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 h-full"></div>
        <div className="absolute inset-0 opacity-[0.02] h-full" style={{
          backgroundImage: 'linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto bg-stone-950 shadow-2xl shadow-black print:bg-transparent print:shadow-none print:w-full print:max-w-none">
        <main className="flex flex-col gap-32 print:gap-0">

          {/* PAGE 1: HERO (Full impact) */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-8 print:py-8 relative">
            <div className="flex-1 flex flex-col justify-center gap-12 px-6 md:px-12 lg:px-16 print:px-0 print:gap-8 print:block">
              <HeroSection property={mapped.property} heroDescription={mapped.heroDescription} heroHighlight={mapped.heroHighlight} />
            </div>
          </div>

          {/* PAGE 2: VALUATION (Premium styling) */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} />
          </div>

          {/* PAGE 3: PROPERTY PLAN + BENEFITS */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-20 print:space-y-10">
              <PropertyPlanSection property={mapped.property} />
              <BenefitsSection benefits={mapped.salesBenefits.slice(0, 3)} />
            </div>
          </div>

          {/* PAGE 4: SALES PROCESS */}
          <div data-pdf-page="4" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <SalesProcessSection steps={mapped.salesSteps} />
          </div>

          {/* PAGE 5: CONSULTANT + FAQ + FOOTER */}
          <div data-pdf-page="5" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
              <ConsultantTrustSection consultant={mapped.consultant} />
              <FAQSection faqs={mapped.faqs} />
            </div>
            <footer className="border-t border-amber-500/10 py-8 flex flex-col items-center text-center mt-auto print:py-6 print:bg-transparent print:border-slate-300 print:mt-8">
              <p className="text-stone-500 text-xs uppercase tracking-[0.2em] mb-2 print:text-slate-800">Gizli ve Özel Ticari Bilgi İçerir</p>
              <p className="text-stone-400 font-medium text-sm mb-6 print:text-black">© {new Date().getFullYear()} {ofisAdi}</p>
              <div className="flex flex-col items-center gap-2 opacity-70 print:opacity-100">
                <a href="https://pyrize.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider print:text-slate-800">
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
