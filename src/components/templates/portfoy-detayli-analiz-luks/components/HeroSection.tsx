import React from 'react';
import { Property } from '../types';

interface HeroSectionProps {
  property: Property;
  heroDescription?: string;
  heroHighlight?: string;
  heroImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ property, heroDescription, heroHighlight, heroImage }) => {
  const backgroundImage =
    heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop';

  return (
    <section
      className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <p className="uppercase tracking-[0.4em] text-sm text-gray-200 mb-6">
          {property.type}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
          {property.address || 'Portföyünüzün Gerçek Değerini'}{' '}
          {!property.address && <span className="gold-text">Bizimle Keşfedin</span>}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          {heroDescription ||
            'Size özel hazırlanan bu raporla mülkünüzün piyasa analizini, stratejik avantajlarını ve satış potansiyelini keşfedin.'}
        </p>
        {heroHighlight && (
          <p className="text-lg md:text-xl gold-text font-semibold mb-6">{heroHighlight}</p>
        )}
      </div>
      <a
        href="#market-intelligence"
        aria-label="Analizi görüntülemek için aşağı kaydırın"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 group"
      >
        <div className="w-8 h-14 border-2 gold-border rounded-full flex justify-center items-start p-1 transition-colors duration-300 group-hover:border-white">
          <div className="w-1.5 h-3 gold-bg rounded-full animate-bounce mt-1 transition-colors duration-300 group-hover:bg-white"></div>
        </div>
      </a>
    </section>
  );
};