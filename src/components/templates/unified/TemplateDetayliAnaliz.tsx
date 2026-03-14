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

/** Detaylı Analiz — "Data Room" Konsepti
 *  Kurumsal değerleme raporu estetiği.
 *  Bölüm numaraları, bordered sayfa header'ları, sıkı data grid düzeni.
 */
export default function TemplateDetayliAnaliz({ data }: Props) {
  const mapped = useMemo(() => mapSunumToTemplateData(data), [data]);
  const theme = mapped.theme;

  const danisman = data.istek?.danisman;
  const ofisAdi = danisman?.ofisAdi || '';
  const reportDate = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Sayfa header chrome — raporlama formatı
  const PageHeader = ({ num, title }: { num: string; title: string }) => (
    <div className={`flex items-center justify-between py-4 mb-8 border-b ${theme.borderColor} print:py-3 print:mb-6`}>
      <div className="flex items-center gap-4">
        <span
          className="text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1 rounded-sm print:border print:border-slate-400"
          style={{
            background: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
          }}
        >
          {num}
        </span>
        <span className={`text-xs uppercase tracking-[0.25em] ${theme.textSecondary} print:text-slate-600`}>{title}</span>
      </div>
      <span className={`text-[10px] ${theme.textSecondary} print:text-slate-500`}>{ofisAdi}</span>
    </div>
  );

  return (
    <div
      data-konsept="detayli-analiz"
      className={`${theme.bgPrimary} min-h-screen font-sans ${theme.textPrimary} antialiased ${theme.selectionBg} ${theme.selectionText} relative overflow-x-hidden print:bg-white print:text-black ${!theme.isDark ? 'pdf-theme-light' : ''}`}
    >
      {/* Gradient Background */}
      {theme.isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} h-full`} />
        </div>
      )}

      {/* Rapor başlık şeridi — sadece web görünümü */}
      <div
        className={`relative z-20 px-6 md:px-12 lg:px-16 py-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] border-b ${theme.borderColor} print:hidden`}
        style={{ background: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)' }}
      >
        <span className={theme.textSecondary}>Gizli Değerleme Raporu</span>
        <span className={theme.textSecondary}>{reportDate}</span>
      </div>

      <div className={`relative z-10 max-w-[1440px] mx-auto ${theme.bgPrimary} ${theme.isDark ? 'shadow-2xl shadow-black' : 'shadow-lg shadow-slate-200'} print:bg-transparent print:shadow-none print:w-full print:max-w-none`}>
        <main className="flex flex-col gap-0 print:gap-0">

          {/* PAGE 1: HERO + VALUATION */}
          <div data-pdf-page="1" className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-10 print:py-10 relative border-b border-dashed border-white/5 print:border-none">
            <div className="flex-1 flex flex-col justify-center gap-8 px-6 md:px-12 lg:px-16 py-16 print:px-0 print:gap-8 print:block">
              <PageHeader num="01" title="Mülk Değerleme Özeti" />
              <HeroSection property={mapped.property} heroDescription={mapped.heroDescription} heroHighlight={mapped.heroHighlight} theme={theme} />
              <div className="mt-8 print:mt-8">
                <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} theme={theme} />
              </div>
            </div>
          </div>

          {/* PAGE 2: PROPERTY PLAN */}
          <div data-pdf-page="2" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-16 flex flex-col border-b border-dashed border-white/5 print:border-none print:block print:h-auto print:min-h-0 print:py-10 print:px-10 print:break-after-page">
            <PageHeader num="02" title="Mülk Profili & Konum Analizi" />
            <PropertyPlanSection property={mapped.property} theme={theme} />
          </div>

          {/* PAGE 3: SALES PROCESS */}
          <div data-pdf-page="3" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-16 flex flex-col border-b border-dashed border-white/5 print:border-none print:block print:h-auto print:min-h-0 print:py-10 print:px-10 print:break-after-page">
            <PageHeader num="03" title="Satış Sistemi & Süreç Haritası" />
            <SalesProcessSection steps={mapped.salesSteps} theme={theme} />
          </div>

          {/* PAGE 4: BENEFITS */}
          <div data-pdf-page="4" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-16 flex flex-col border-b border-dashed border-white/5 print:border-none print:block print:h-auto print:min-h-0 print:py-10 print:px-10 print:break-after-page">
            <PageHeader num="04" title="Rekabetçi Avantajlar" />
            <BenefitsSection benefits={mapped.salesBenefits} theme={theme} />
          </div>

          {/* PAGE 5: FAQ + CONSULTANT + FOOTER */}
          <div data-pdf-page="5" className="w-full min-h-screen px-6 md:px-12 lg:px-16 py-16 flex flex-col print:block print:h-auto print:min-h-0 print:py-10 print:px-10 print:break-after-page">
            <PageHeader num="05" title="Sık Sorulanlar & Danışman" />
            <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
              <FAQSection faqs={mapped.faqs} theme={theme} />
              <ConsultantTrustSection consultant={mapped.consultant} theme={theme} />
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
