'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';

import { mapQuickSaleData } from './TemplateQuickSaleModernFromZip';

import { HeroSection } from './portfoy-hizli-satis-luks/components/HeroSection';
import { BenefitsSection } from './portfoy-hizli-satis-luks/components/PropertyFeaturesSection';
import { DigitalMarketingPowerSection } from './portfoy-hizli-satis-luks/components/UsagePotentialSection';
import { PropertyPlanSection } from './portfoy-hizli-satis-luks/components/LocationAdvantagesSection';
import { RegionalComparisonSection } from './portfoy-hizli-satis-luks/components/RegionalComparisonSection';
import { SalesProcessSection } from './portfoy-hizli-satis-luks/components/SalesStrategySection';
import { ConsultantTrustSection } from './portfoy-hizli-satis-luks/components/ConsultantTrustSection';
import { FAQSection } from './portfoy-hizli-satis-luks/components/FAQSection';
import { CTASection } from './portfoy-hizli-satis-luks/components/CTASection';

const TemplateQuickSaleLuxuryFromZip: React.FC<{ data: OlusturulanSunum }> = ({ data }) => {
  const mapped = useMemo(() => mapQuickSaleData(data), [data]);

  return (
    <div className="bg-black text-gray-300 antialiased">
      <main>
        <HeroSection
          property={mapped.property}
          heroDescription={mapped.heroDescription}
          heroHighlight={mapped.heroHighlight}
        />
        <BenefitsSection benefits={mapped.salesBenefits} />
        <DigitalMarketingPowerSection tools={mapped.digitalMarketingTools} />
        <PropertyPlanSection property={mapped.property} />
        {mapped.regionalData && (
          <RegionalComparisonSection property={mapped.property} regionalData={mapped.regionalData} />
        )}
        <SalesProcessSection steps={mapped.salesSteps} />
        <ConsultantTrustSection consultant={mapped.consultant} />
        <FAQSection faqs={mapped.faqItems} />
        <CTASection consultant={mapped.consultant} guarantees={mapped.guarantees} />
      </main>
    </div>
  );
};

export default TemplateQuickSaleLuxuryFromZip;


