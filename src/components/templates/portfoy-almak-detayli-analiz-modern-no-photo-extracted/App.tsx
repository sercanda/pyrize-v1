
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
  // Removed print:static to allow default flow, added print:mb-8 to ensure gap.
  <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-end border-b border-white/5 bg-slate-950 relative z-50 print:bg-white print:border-b-2 print:border-slate-900 print:px-0 print:py-4 print:static print:mb-12">
    <div className="flex items-center gap-4">
        <img 
          src="https://i.ibb.co/1yynDd7/e92f870139b241e9820965c4ac5167b3-removebg-preview.png" 
          alt="RE/MAX Parla" 
          className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] print:filter-none print:h-10" 
        />
        <div>
            <h1 className="text-lg font-bold text-white leading-none tracking-tight print:text-black">RE/MAX</h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-0.5 print:text-slate-700">Premium Collection</p>
        </div>
    </div>
    <div className="text-right hidden md:block print:block">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 print:text-slate-600">Rapor Referansı</p>
        <p className="text-sm font-mono text-slate-300 print:text-black print:font-bold">TR-SAMSUN-AYCIL-1014</p>
    </div>
  </nav>
);

// A wrapper component for print pages.
const PrintPageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`
    w-full 
    min-h-screen 
    px-6 md:px-12 lg:px-16 
    py-24 
    flex flex-col 
    print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page
    ${className}
  `}>
    <div className="print:h-full print:w-full">
        {children}
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-200 antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden print:bg-white print:text-black">
      
      {/* Global Gradient Background (Screen Only) */}
      <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 h-full"></div>
          <div className="absolute inset-0 opacity-[0.03] h-full" style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
          }}></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto bg-slate-950 shadow-2xl shadow-black print:bg-transparent print:shadow-none print:w-full print:max-w-none">
        
        <main className="flex flex-col gap-24 print:gap-0">
            
            {/* PAGE 1: KAPAK + DEĞERLEME */}
            <div className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-8 print:py-8 relative">
                
                {/* Navbar Wrapper */}
                <Navbar />
                
                {/* Content Wrapper */}
                <div className="flex-1 flex flex-col justify-center gap-12 px-6 md:px-12 lg:px-16 print:px-0 print:gap-8 print:block">
                    {/* Hero Section */}
                    <HeroSection property={PROPERTY_DATA} />
                    
                    {/* Valuation Section */}
                    <div className="print:mt-8">
                        <RegionalComparisonSection valuationData={VALUATION_DATA} property={PROPERTY_DATA} />
                    </div>
                </div>
            </div>

            {/* PAGE 2: POTENTIAL & STRATEGY */}
            <PrintPageWrapper className="print:justify-start">
                <PropertyPlanSection property={PROPERTY_DATA} />
            </PrintPageWrapper>

            {/* PAGE 3: 6-STEP SALES SYSTEM */}
            <PrintPageWrapper className="print:justify-start">
                <SalesProcessSection steps={SALES_SYSTEM_STEPS} />
            </PrintPageWrapper>

            {/* PAGE 4: BENEFITS (Neden Kurumsal?) */}
            <PrintPageWrapper className="print:justify-start">
                <BenefitsSection benefits={SALES_BENEFITS} />
            </PrintPageWrapper>

            {/* PAGE 5: TRUST, FAQ & CLOSING */}
            <PrintPageWrapper className="print:justify-start">
                <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
                  <FAQSection faqs={FAQ_DATA} />
                  <ConsultantTrustSection consultant={CONSULTANT_DATA} />
                </div>

                <footer className="border-t border-white/5 py-8 flex flex-col items-center text-center bg-slate-950 mt-auto print:py-6 print:bg-transparent print:border-slate-300 print:mt-8">
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 print:text-slate-800">Gizli ve Özel Ticari Bilgi İçerir</p>
                    <p className="text-slate-400 font-medium text-sm mb-6 print:text-black">© 2024 RE/MAX Parla Gayrimenkul Danışmanlığı</p>
                    
                    <div className="flex flex-col items-center gap-2 opacity-70 print:opacity-100">
                        <img 
                          src="https://i.ibb.co/HLQpWmS0/Ekran-Al-nt-s.jpg" 
                          alt="Pyrize" 
                          className="h-5 w-auto object-contain mix-blend-multiply print:mix-blend-normal" 
                        />
                        <a href="https://pyrize.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider print:text-slate-800">
                          powered by pyrize.com
                        </a>
                    </div>
                </footer>
            </PrintPageWrapper>

        </main>

      </div>
    </div>
  );
};

export default App;
