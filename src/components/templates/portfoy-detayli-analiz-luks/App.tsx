import React from 'react';
import { HeroSection } from './components/HeroSection';
import { ExclusiveAdvantagesSection } from './components/PropertyFeaturesSection';
import { BespokeJourneySection } from './components/SalesStrategySection';
import { PortfolioAnalysisSection } from './components/LocationAdvantagesSection';
import { NextChapterSection } from './components/CTASection';
import { ExpertAdvisorSection } from './components/ConsultantTrustSection';
import { MarketIntelligenceReport } from './components/RegionalComparisonSection';
import { PROPERTY_DATA, SALES_BENEFITS, SALES_SYSTEM_STEPS, CONSULTANT_DATA, VALUATION_DATA, FAQ_DATA } from './constants';

const App: React.FC = () => {
  return (
    <div className="bg-[#111111] text-gray-300 antialiased">
      <main>
        <HeroSection property={PROPERTY_DATA} />
        <MarketIntelligenceReport valuationData={VALUATION_DATA} property={PROPERTY_DATA} />
        <ExclusiveAdvantagesSection benefits={SALES_BENEFITS} />
        <PortfolioAnalysisSection property={PROPERTY_DATA} faq={FAQ_DATA} />
        <BespokeJourneySection steps={SALES_SYSTEM_STEPS} />
        <ExpertAdvisorSection consultant={CONSULTANT_DATA} />
        <NextChapterSection consultant={CONSULTANT_DATA} />
      </main>
    </div>
  );
};

export default App;