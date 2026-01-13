
import React from 'react';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/PropertyFeaturesSection';
import { SalesProcessSection } from './components/SalesStrategySection';
import { PropertyPlanSection } from './components/LocationAdvantagesSection';
import { ConsultantTrustSection } from './components/ConsultantTrustSection';
import { RegionalComparisonSection } from './components/RegionalComparisonSection';
import { FAQSection } from './components/FAQSection';
import { PROPERTY_DATA, SALES_BENEFITS, SALES_SYSTEM_STEPS, CONSULTANT_DATA, VALUATION_DATA, FAQ_DATA } from './constants';

const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm print:static print:border-none">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold text-xl rounded-lg shadow-md print:bg-black print:text-white">R</div>
        <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 leading-none tracking-tight">RE/MAX</span>
            <span className="text-sm font-medium text-slate-500 leading-none">Parla</span>
        </div>
      </div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider print:hidden">
         Özel Değerleme Raporu
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  return (
    <div className="bg-white text-slate-800 antialiased font-sans selection:bg-blue-100 selection:text-blue-900 print:bg-white">
      <Navbar />
      <main className="flex flex-col gap-0">
        <HeroSection />
        <div id="valuation">
             <RegionalComparisonSection valuationData={VALUATION_DATA} property={PROPERTY_DATA} />
        </div>
        <BenefitsSection benefits={SALES_BENEFITS} />
        <SalesProcessSection steps={SALES_SYSTEM_STEPS} />
        <PropertyPlanSection property={PROPERTY_DATA} />
        <ConsultantTrustSection consultant={CONSULTANT_DATA} />
        <FAQSection faqs={FAQ_DATA} />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 print:bg-white print:text-slate-600 print:border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4 text-white font-medium print:text-slate-900">RE/MAX Parla Gayrimenkul Danışmanlığı</p>
          <p className="text-sm opacity-60">&copy; {new Date().getFullYear()} Tüm hakları saklıdır. Bu rapor, belirtilen mülk sahibi için özel olarak hazırlanmıştır.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;