import React from 'react';
import { SalesBenefit } from '../types';

interface BenefitsSectionProps {
  benefits: SalesBenefit[];
}

const BenefitCard: React.FC<{ benefit: SalesBenefit }> = ({ benefit }) => (
    <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300 border border-gray-700 hover:border-amber-500/50 backdrop-blur-md transform hover:-translate-y-2 relative overflow-hidden">
        <div className="absolute -top-1 -left-1 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-6 mx-auto border-2 border-amber-500/30">
                {benefit.icon}
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-3">{benefit.title}</h3>
            <p className="text-center text-gray-300 mb-4">{benefit.description}</p>
            <p className="text-center text-sm font-semibold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full">{benefit.comparison}</p>
        </div>
    </div>
);


export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-black to-[#0a0a1a]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};