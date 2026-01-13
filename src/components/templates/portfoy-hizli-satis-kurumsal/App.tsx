import React from 'react';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/PropertyFeaturesSection';
import { SalesProcessSection } from './components/SalesStrategySection';
import { PropertyPlanSection } from './components/LocationAdvantagesSection';
import { CTASection } from './components/CTASection';
import { ConsultantTrustSection } from './components/ConsultantTrustSection';
import { DigitalMarketingPowerSection } from './components/UsagePotentialSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { PROPERTY_DATA, SALES_BENEFITS, SALES_SYSTEM_STEPS, CONSULTANT_DATA, DIGITAL_MARKETING_TOOLS, FAQ_DATA, REGIONAL_DATA } from './constants';
import { RegionalComparisonSection } from './components/RegionalComparisonSection';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      <main>
        <HeroSection />
        <BenefitsSection benefits={SALES_BENEFITS} />
        <DigitalMarketingPowerSection tools={DIGITAL_MARKETING_TOOLS} />
        <PropertyPlanSection property={PROPERTY_DATA} />
        <RegionalComparisonSection property={PROPERTY_DATA} regionalData={REGIONAL_DATA} />
        <SalesProcessSection steps={SALES_SYSTEM_STEPS} />
        <ConsultantTrustSection consultant={CONSULTANT_DATA} />
        <FAQSection faqs={FAQ_DATA} />
        <CTASection />
      </main>
      <Footer consultant={CONSULTANT_DATA} />
    </div>
  );
};

export default App;