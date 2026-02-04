import React from 'react';
import { StrategicAdvantage } from '../types';

interface BenefitsSectionProps {
  benefits: StrategicAdvantage[];
}

const AdvantageCard: React.FC<{ benefit: StrategicAdvantage }> = ({ benefit }) => (
    <div className="group bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-300"></div>
        
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-slate-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            {React.cloneElement(benefit.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7" })}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">{benefit.description}</p>
        
        <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Kazanım</p>
            <p className="text-sm font-semibold text-blue-700">{benefit.comparison}</p>
        </div>
    </div>
);

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Neden Kurumsal Yaklaşım?
            </h2>
            <p className="text-lg text-slate-600">
                Bireysel satış çabaları ile kurumsal süreç yönetimi arasındaki farkı yaratan stratejik avantajlarımız.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <AdvantageCard key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};