
import React from 'react';
import { StrategicAdvantage } from '../types';

interface BenefitsSectionProps {
  benefits: StrategicAdvantage[];
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section className="bg-slate-900/50 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden border border-white/5 print:bg-transparent print:border-none print:p-0 print:rounded-none">
      {/* Background Decor - Hide in Print */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none print:hidden"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 print:block">
          {/* Header Section */}
          <div className="lg:col-span-4 print:mb-8 print:w-full">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white print:text-black">
                  Neden <br/> Kurumsal?
              </h2>
              <p className="text-slate-300 text-lg font-light leading-relaxed print:text-black print:font-medium">
                  Bireysel çabalar ile kurumsal sistemin yarattığı farkın somut sonuçları.
              </p>
          </div>

          {/* Cards Section */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6 print:grid print:grid-cols-1 print:gap-6 print:w-full">
              {benefits.map((benefit, index) => (
                  <div key={index} className="bg-slate-950/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:bg-indigo-900/20 hover:border-indigo-500/20 transition-all duration-300 group print:bg-white print:border-slate-800 print:shadow-none print:break-inside-avoid print:p-5 print:flex print:items-center print:gap-6 print:border-2">
                      <div className="mb-6 text-indigo-400 group-hover:text-indigo-300 transition-colors print:text-indigo-900 print:mb-0 print:flex-shrink-0">
                          {React.cloneElement(benefit.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" })}
                      </div>
                      <div className="print:flex-grow">
                          <div className="print:flex print:justify-between print:items-center print:mb-1">
                             <h3 className="text-xl font-bold mb-3 text-slate-100 print:text-black print:mb-0">{benefit.title}</h3>
                             <div className="hidden print:inline-block print:border-l-2 print:border-indigo-900 print:pl-3">
                                  <span className="text-sm font-bold text-black">{benefit.comparison}</span>
                             </div>
                          </div>
                          <p className="text-slate-300 text-sm mb-6 leading-relaxed print:text-black print:mb-0">
                              {benefit.description}
                          </p>
                          <div className="inline-block border-l-2 border-indigo-500 pl-3 print:border-indigo-900 print:hidden">
                              <span className="block text-xs text-indigo-400 font-bold uppercase tracking-wider print:text-indigo-900">Sonuç</span>
                              <span className="text-sm font-medium text-white print:text-black">{benefit.comparison}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
};
