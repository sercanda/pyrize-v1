import React from 'react';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/PropertyFeaturesSection';
import { SalesProcessSection } from './components/SalesStrategySection';
import { PropertyPlanSection } from './components/LocationAdvantagesSection';
import { CTASection } from './components/CTASection';
import { ConsultantTrustSection } from './components/ConsultantTrustSection';
import { DigitalMarketingPowerSection } from './components/UsagePotentialSection';
import { FAQSection } from './components/FAQSection';
import { PROPERTY_DATA, SALES_BENEFITS, SALES_SYSTEM_STEPS, CONSULTANT_DATA, DIGITAL_MARKETING_TOOLS, FAQ_DATA, GUARANTEES_DATA } from './constants';

const App: React.FC = () => {
  return (
    <div className="bg-black text-gray-300 antialiased">
      <main>
        <HeroSection property={PROPERTY_DATA} />
        <BenefitsSection benefits={SALES_BENEFITS} />
        <DigitalMarketingPowerSection tools={DIGITAL_MARKETING_TOOLS} />
        <PropertyPlanSection property={PROPERTY_DATA} />
        <SalesProcessSection steps={SALES_SYSTEM_STEPS} />
        <ConsultantTrustSection consultant={CONSULTANT_DATA} />
        <FAQSection faqs={FAQ_DATA} />
        <CTASection consultant={CONSULTANT_DATA} guarantees={GUARANTEES_DATA} />
      </main>
    </div>
  );
};

export default App;