'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { mapSunumToTemplateData } from '../shared/mapSunumData';

import { HeroSection } from '../portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { RegionalComparisonSection } from '../portfoy-almak-detayli-analiz-modern-new/components/RegionalComparisonSection';
import { LifestyleSection } from '../portfoy-almak-detayli-analiz-modern-new/components/LifestyleSection';
import { PropertyPlanSection } from '../portfoy-almak-detayli-analiz-modern-new/components/LocationAdvantagesSection';
import { BenefitsSection } from '../portfoy-almak-detayli-analiz-modern-new/components/PropertyFeaturesSection';
import { ExclusiveOfferSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ExclusiveOfferSection';
import { SalesProcessSection } from '../portfoy-almak-detayli-analiz-modern-new/components/SalesStrategySection';
import { ConsultantTrustSection } from '../portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';
import { FAQSection } from '../portfoy-almak-detayli-analiz-modern-new/components/FAQSection';

interface Props {
  data: OlusturulanSunum;
}

/** Premium Sunum — "Editorial Luxury" Konsepti
 *  Sessiz lüks estetiği.
 *  Dar editoryal container, gold accent header şeridi, geniş whitespace.
 */
export default function TemplatePremium({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);
  const theme = mapped.theme;

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';

  const GOLD = '#d4a84b';
  const GOLD_LIGHT = 'rgba(212,168,75,0.15)';

  // Editorial sayfa üst dekorasyonu
  const EditorialHeader = ({ label }: { label: string }) => (
    <div className="mb-12 print:mb-8">
      {/* İnce gold çizgi */}
      <div className="w-16 h-px mb-4" style={{ background: GOLD }} />
      <span
        className="text-[9px] uppercase tracking-[0.5em] font-semibold"
        style={{ color: GOLD }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      data-konsept="premium"
      className={`${theme.bgPrimary} min-h-screen font-sans ${theme.textPrimary} antialiased ${theme.selectionBg} ${theme.selectionText} relative overflow-x-hidden print:bg-white print:text-black ${!theme.isDark ? 'pdf-theme-light' : ''}`}
    >
      {/* Gradient Background */}
      {theme.isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} h-full`} />
        </div>
      )}

      {/* Gold premium header bar — web only */}
      <div
        className="relative z-20 w-full py-3 px-6 flex items-center justify-between print:hidden"
        style={{
          background: GOLD_LIGHT,
          borderBottom: `1px solid ${GOLD}30`,
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.5em] font-semibold" style={{ color: GOLD }}>
          Premium Portföy
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          <span className="text-[9px] uppercase tracking-[0.4em] font-semibold" style={{ color: GOLD }}>
            {ofisAdi || 'Özel Sunum'}
          </span>
        </div>
      </div>

      {/* NARROW editorial container */}
      <div className={`relative z-10 max-w-4xl mx-auto ${theme.bgPrimary} ${theme.isDark ? 'shadow-2xl shadow-black' : 'shadow-lg shadow-slate-200'} print:bg-transparent print:shadow-none print:w-full print:max-w-none`}>
        <main className="flex flex-col gap-0 print:gap-0">

          {/* PAGE 1: HERO — full impact, minimal chrome */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-10 print:py-12 relative">
            <div className="flex-1 flex flex-col justify-center gap-16 px-6 md:px-10 lg:px-12 py-20 print:px-0 print:gap-10 print:block">
              <EditorialHeader label="Özel Portföy — Sunum" />
              <HeroSection property={mapped.property} heroDescription={mapped.heroDescription} heroHighlight={mapped.heroHighlight} theme={theme} variant="magazine" />
            </div>
          </div>

          {/* PAGE 2: VALUATION + LIFESTYLE */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 md:px-10 lg:px-12 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-10 print:break-after-page">
            <EditorialHeader label="Değerleme & Yaşam Vizyonu" />
            <div className="space-y-24 print:space-y-12">
              <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} theme={theme} />
              <LifestyleSection
                theme={theme}
                lifestyleText={mapped.lifestyle?.text}
                aspirationPoints={mapped.lifestyle?.aspirationPoints}
                socialProof={mapped.lifestyle?.socialProof}
              />
            </div>
          </div>

          {/* PAGE 3: PROPERTY PLAN + BENEFITS */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 md:px-10 lg:px-12 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-10 print:break-after-page">
            <EditorialHeader label="Mülk Profili & Avantajlar" />
            <div className="space-y-24 print:space-y-12">
              <PropertyPlanSection property={mapped.property} theme={theme} variant="editorial" />
              <BenefitsSection benefits={mapped.salesBenefits.slice(0, 3)} theme={theme} variant="icon-row" />
            </div>
          </div>

          {/* PAGE 4: EXCLUSIVE OFFER + SALES PROCESS */}
          <div data-pdf-page="4" className="w-full min-h-screen px-6 md:px-10 lg:px-12 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-10 print:break-after-page">
            <EditorialHeader label="Özel Gösterim & Satış Süreci" />
            <div className="space-y-24 print:space-y-12">
              <ExclusiveOfferSection
                theme={theme}
                offerTitle={mapped.exclusiveOffer?.title}
                offerDetails={mapped.exclusiveOffer?.details}
                consultantName={mapped.consultant.adSoyad}
              />
              <SalesProcessSection steps={mapped.salesSteps} theme={theme} variant="timeline" />
            </div>
          </div>

          {/* PAGE 5: CONSULTANT + FAQ + FOOTER */}
          <div data-pdf-page="5" className="w-full min-h-screen px-6 md:px-10 lg:px-12 py-20 flex flex-col print:block print:h-auto print:min-h-0 print:py-12 print:px-10 print:break-after-page">
            <EditorialHeader label="Danışman & Sıkça Sorulanlar" />
            <div className="space-y-20 print:space-y-12 flex-grow flex flex-col justify-start">
              <ConsultantTrustSection consultant={mapped.consultant} theme={theme} variant="hero" />
              <FAQSection faqs={mapped.faqs} theme={theme} variant="accordion" />
            </div>
            <footer className={`border-t mt-auto py-10 flex flex-col items-center text-center print:py-6 print:bg-transparent print:mt-8`} style={{ borderColor: `${GOLD}30` }}>
              <div className="w-8 h-px mb-6" style={{ background: GOLD }} />
              <p className={`${theme.textSecondary} text-xs uppercase tracking-widest mb-2 print:text-slate-800`}>Özel ve Gizli Ticari Bilgi</p>
              <p className={`${theme.textSecondary} font-medium text-sm mb-6 print:text-black`}>© {new Date().getFullYear()} {ofisAdi} Gayrimenkul Danışmanlığı</p>
              <a href="https://pyrize.com" target="_blank" rel="noopener noreferrer" className={`text-[10px] font-semibold opacity-40 uppercase tracking-wider print:text-slate-800`}>
                powered by pyrize.com
              </a>
            </footer>
          </div>

        </main>
      </div>
    </div>
  );
}
