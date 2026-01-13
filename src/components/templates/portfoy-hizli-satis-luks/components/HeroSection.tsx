import React from 'react';
import { Property } from '../types';

interface HeroSectionProps {
  property: Property;
  heroDescription?: string;
  heroHighlight?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  property,
  heroDescription,
  heroHighlight,
}) => {
  const backgroundImage =
    property.gorselUrl ||
    'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1600&q=80';

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4 text-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="relative z-10 flex max-w-5xl flex-col items-center">
        <span className="text-xs uppercase tracking-[0.5em] text-amber-300">
          {property.konumAnalizi.ilIlce}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight drop-shadow-lg md:text-6xl lg:text-7xl">
          {property.planBaslik || (
            <>
              Mülkünüz İçin <span className="text-amber-400">Elit Strateji</span>. Maksimum Değer.
            </>
          )}
        </h1>
        <p className="mt-6 text-lg font-light text-gray-200 md:text-2xl">
          {heroDescription || 'Veriye dayalı, modern ve aksiyon odaklı pazarlama planıyla mülkünüzün gerçek potansiyelini ortaya çıkaralım.'}
        </p>
        {heroHighlight && (
          <p className="mt-6 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 shadow-inner shadow-amber-500/20">
            {heroHighlight}
          </p>
        )}
        <a
          href="#cta"
          className="mt-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-yellow-700"
        >
          Aksiyon Planını Keşfedin
        </a>
      </div>
      <button
        type="button"
        className="absolute bottom-10 animate-bounce cursor-pointer text-white/80"
        onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Analizi görmek için aşağı kaydır"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
        </svg>
      </button>
    </section>
  );
};