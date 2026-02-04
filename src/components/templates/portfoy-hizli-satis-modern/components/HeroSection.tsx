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
  heroHighlight
}) => {
  // Use property image if available, otherwise fallback
  const backgroundImage = property.gorselUrl || 'https://images.unsplash.com/photo-1600596542815-e328d4de4bf7?q=80&w=2000&auto=format&fit=crop';

  return (
    <section
      className="relative h-[90vh] flex flex-col items-center justify-center text-white overflow-hidden"
    >
      {/* Background Image with Parallax-like feel */}
      <div
        className="absolute inset-0 z-0 transform scale-105"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950 z-0"></div>

      {/* Radial Gradient for spotlight effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-transparent opacity-60 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
          <span className="text-indigo-300 text-sm font-semibold tracking-wider uppercase">Premium Satış Stratejisi</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
          {property.planBaslik || 'Mülkünüz İçin'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            {heroHighlight || 'Maksimum Değer'}
          </span>
        </h1>

        <p className="text-lg md:text-2xl font-light text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          {heroDescription || 'Veriye dayalı analiz, modern pazarlama ve sonuç odaklı strateji ile gayrimenkulünüzün gerçek potansiyelini ortaya çıkarıyoruz.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#cta"
            className="group relative px-8 py-4 bg-indigo-600 rounded-full font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">Aksiyon Planını Başlat</span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
          </a>
          <button
            onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full font-medium text-white border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            Detayları İncele
          </button>
        </div>
      </div>

      {/* Floating Stats / Trust Indicators */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-white/5 backdrop-blur-md py-6 hidden md:block z-10">
        <div className="container mx-auto flex justify-center gap-12 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xl">%100</span>
            <span className="text-sm">Şeffaf Süreç</span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-bold text-xl">72 Saat</span>
            <span className="text-sm">İlk Teklif Hedefi</span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold text-xl">Global</span>
            <span className="text-sm">Pazarlama Ağı</span>
          </div>
        </div>
      </div>
    </section>
  );
};