import React from 'react';
import { SalesBenefit } from '../types';

interface BenefitsSectionProps {
  benefits: SalesBenefit[];
}

const BenefitCard: React.FC<{ benefit: SalesBenefit }> = ({ benefit }) => (
    <div className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 hover:bg-slate-800/50">
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
        
        <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {benefit.icon}
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{benefit.title}</h3>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">{benefit.description}</p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {benefit.comparison}
            </div>
        </div>
    </div>
);


export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section id="benefits" className="py-24 bg-slate-950 relative">
       {/* Decorative Background elements */}
       <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-indigo-900/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Neden <span className="text-gradient">Profesyonel Strateji?</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
                Geleneksel yöntemler artık yeterli değil. Mülkünüzü modern dünyanın hızına ve beklentilerine göre pazarlıyoruz.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};