import React from 'react';
import { SalesBenefit } from '../types';

interface BenefitsSectionProps {
  benefits: SalesBenefit[];
}

const BenefitCard: React.FC<{ benefit: SalesBenefit }> = ({ benefit }) => (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6 mx-auto">
             {React.cloneElement(benefit.icon, { className: "w-8 h-8 text-blue-800" })}
        </div>
        <h3 className="text-xl font-bold text-slate-900 text-center mb-3">{benefit.title}</h3>
        <p className="text-center text-slate-600 mb-4">{benefit.description}</p>
        <p className="text-center text-sm font-semibold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">{benefit.comparison}</p>
    </div>
);


export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section id="benefits" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Neden <span className="text-blue-800">Bizimle Çalışmalısınız?</span>
            </h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                Kurumsal yaklaşımımızla mülkünüzü en hızlı ve en karlı şekilde satmanın 3 temel avantajı.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};