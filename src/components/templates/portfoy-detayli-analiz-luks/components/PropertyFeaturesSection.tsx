import React from 'react';
import { StrategicAdvantage } from '../types';

interface ExclusiveAdvantagesSectionProps {
  benefits: StrategicAdvantage[];
}

const AdvantageCard: React.FC<{ benefit: StrategicAdvantage }> = ({ benefit }) => (
    <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="mb-5">
            {benefit.icon}
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3">{benefit.title}</h3>
        <p className="text-gray-400 mb-5 text-base leading-relaxed">{benefit.description}</p>
        <p className="text-sm font-medium gold-text tracking-wider uppercase">{benefit.comparison}</p>
    </div>
);

export const ExclusiveAdvantagesSection: React.FC<ExclusiveAdvantagesSectionProps> = ({ benefits }) => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ayrıcalıklı <span className="gold-text">Hizmet Anlayışımız</span>
            </h2>
            <p className="text-lg text-gray-400 mt-4">
                Mülkünüzün değerini en üst düzeye çıkarmak için sunduğumuz benzersiz hizmetler.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <AdvantageCard key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};