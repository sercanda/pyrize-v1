'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { mapSunumToTemplateData } from '../shared/mapSunumData';

import { HeroSection } from '../portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { RegionalComparisonSection } from '../portfoy-almak-detayli-analiz-modern-new/components/RegionalComparisonSection';
import { BenefitsSection } from '../portfoy-almak-detayli-analiz-modern-new/components/PropertyFeaturesSection';
import { SalesProcessSection } from '../portfoy-almak-detayli-analiz-modern-new/components/SalesStrategySection';
import { FAQSection } from '../portfoy-almak-detayli-analiz-modern-new/components/FAQSection';
import { ConsultantTrustSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';

interface Props {
  data: OlusturulanSunum;
}

export default function TemplateHizliSatis({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);

  // Truncate data for quick sale format
  const quickBenefits = mapped.salesBenefits.slice(0, 3);
  const quickSteps = mapped.salesSteps.slice(0, 3);
  const quickFaqs = mapped.faqs.slice(0, 3);

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-200 antialiased selection:bg-emerald-500 selection:text-white relative overflow-x-hidden print:bg-white print:text-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-slate-950 h-full"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto bg-slate-950 shadow-2xl shadow-black print:bg-transparent print:shadow-none print:w-full print:max-w-none">
        <main className="flex flex-col gap-24 print:gap-0">

          {/* PAGE 1: HERO + BENEFITS */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-8 print:py-8 relative">
            <div className="flex-1 flex flex-col justify-center gap-12 px-6 md:px-12 lg:px-16 print:px-0 print:gap-8 print:block">
              <HeroSection property={mapped.property} heroDescription={mapped.heroDescription} heroHighlight={mapped.heroHighlight} />
              <div className="print:mt-8">
                <BenefitsSection benefits={quickBenefits} />
              </div>
            </div>
          </div>

          {/* PAGE 2: VALUATION + PROCESS */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-16 print:space-y-8">
              <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} />
              <SalesProcessSection steps={quickSteps} />
            </div>
          </div>

          {/* PAGE 3: FAQ + CONSULTANT + CTA */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-24 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page">
            <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
              <FAQSection faqs={quickFaqs} />
              <ConsultantTrustSection consultant={mapped.consultant} />
            </div>
            <footer className="border-t border-white/5 py-8 flex flex-col items-center text-center bg-slate-950 mt-auto print:py-6 print:bg-transparent print:border-slate-300 print:mt-8">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 print:text-slate-800">Gizli ve Özel Ticari Bilgi İçerir</p>
              <p className="text-slate-400 font-medium text-sm mb-6 print:text-black">© {new Date().getFullYear()} {ofisAdi}</p>
              <div className="flex flex-col items-center gap-2 opacity-70 print:opacity-100">
                <a href="https://pyrize.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider print:text-slate-800">
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
