import React from 'react';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/PropertyFeaturesSection';
import { SalesProcessSection } from './components/SalesStrategySection';
import { PropertyPlanSection } from './components/LocationAdvantagesSection';
import { CTASection } from './components/CTASection';
import { ConsultantTrustSection } from './components/ConsultantTrustSection';
import { DigitalMarketingPowerSection } from './components/UsagePotentialSection';
import { PROPERTY_DATA, SALES_BENEFITS, SALES_SYSTEM_STEPS, CONSULTANT_DATA, DIGITAL_MARKETING_TOOLS } from './constants';

const App: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 antialiased overflow-x-hidden">
      <main>
        <HeroSection property={PROPERTY_DATA} />
        <BenefitsSection benefits={SALES_BENEFITS} />
        <DigitalMarketingPowerSection tools={DIGITAL_MARKETING_TOOLS} />
        <PropertyPlanSection property={PROPERTY_DATA} />
        <SalesProcessSection steps={SALES_SYSTEM_STEPS} />
        <ConsultantTrustSection consultant={CONSULTANT_DATA} />
        <CTASection />
      </main>
    </div>
  );
};

export default App;