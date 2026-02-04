
import React from 'react';
import { Property } from '../types';

interface HeroSectionProps {
  property: Property;
  heroDescription?: string;
  heroHighlight?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&auto=compress&fit=crop';

export const HeroSection: React.FC<HeroSectionProps> = ({ property, heroDescription, heroHighlight }) => {
  // Fotoğrafları al
  const fotograflar = (property as any)?.fotograflar || [];
  
  // Gerçek fotoğraf var mı kontrol et (fallback image değil)
  const hasRealPhotos = fotograflar.length > 0 && fotograflar.some((foto: string) => 
    foto && foto !== FALLBACK_IMAGE && !foto.includes('unsplash.com')
  );
  
  const images = {
    main: fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
    view: fotograflar[1] || fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
    pool: fotograflar[2] || fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
    sign: fotograflar[3] || fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE
  };

  const konumString = property.konumAnalizi.mahalle || property.konumAnalizi.ilIlce || '';
  const konumLabel = konumString ? `${konumString} • Satış Stratejisi` : 'Satış Stratejisi';
  
  const titleParts = property.planBaslik?.split('.') || ['Özel Analiz Raporu'];
  const mainTitle = titleParts[0] || 'Özel Analiz Raporu';
  const subtitle = titleParts[1] || property.planAltBaslik || '';

  return (
    <header className="relative py-8 print:py-0 overflow-hidden group">
      
      {/* Items start ensures left alignment */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 print:mb-12 relative z-10">
          <div className="max-w-4xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 backdrop-blur-sm print:border-slate-800 print:bg-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.5)] print:bg-indigo-900 print:shadow-none"></span>
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider print:text-indigo-900 print:font-bold">{konumLabel}</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.1] mb-4 drop-shadow-2xl print:text-black print:text-5xl">
                  {mainTitle}<br/>
                  {subtitle && <span className="text-slate-300 font-light italic print:text-slate-800">{subtitle}</span>}
              </h1>
              
              <p className="text-lg text-slate-300 max-w-2xl font-light leading-relaxed print:text-black print:text-base print:font-medium">
                  {heroDescription || property.planAltBaslik || 'Mülkünüzün piyasa değerini, konum avantajlarını ve satış stratejisini veri odaklı analizlerle sunuyoruz.'}
              </p>
          </div>

          <div className="w-full lg:w-auto border-l border-white/10 pl-6 hidden lg:block print:hidden">
              <div className="space-y-4">
                  <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lokasyon</p>
                      <p className="text-base font-medium text-slate-200">{property.konumAnalizi.ilIlce || property.konumAnalizi.mahalle || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Özellik</p>
                      <p className="text-base font-medium text-slate-200">{property.konumAnalizi.ozellik || property.konumAnalizi.mevcutYapi || 'Belirtilmemiş'}</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Hero Image Collage - Sadece gerçek fotoğraf varsa göster */}
      {hasRealPhotos && (
        <div className="relative w-full h-auto md:h-[450px] print:h-[400px] rounded-3xl overflow-hidden border border-white/5 bg-slate-900/50 print:border-none print:bg-transparent">
          <div className="grid grid-cols-2 md:grid-cols-12 md:grid-rows-2 h-full gap-2 p-2 print:gap-4 print:p-0">
              
              {/* Main Image - Left */}
              <div className="col-span-2 md:col-span-6 md:row-span-2 h-56 md:h-full relative rounded-2xl overflow-hidden group/img print:rounded-lg">
                  <img 
                    src={images.main} 
                    alt={property.planBaslik || "Mülk Görünümü"} 
                    className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 hover:scale-105 transition-all duration-700 print:opacity-100"
                  />
                  {property.konumAnalizi.ozellik && (
                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded text-xs text-white border border-white/10 print:hidden">
                        {property.konumAnalizi.ozellik}
                    </div>
                  )}
              </div>

              {/* Top Right - Wide Image */}
              <div className="col-span-2 md:col-span-6 md:row-span-1 h-40 md:h-full relative rounded-2xl overflow-hidden group/img print:rounded-lg">
                   <img 
                    src={images.view} 
                    alt="Görünüm" 
                    className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 hover:scale-105 transition-all duration-700 print:opacity-100"
                  />
              </div>

              {/* Bottom Right - Pool */}
              <div className="col-span-1 md:col-span-3 md:row-span-1 h-32 md:h-full relative rounded-2xl overflow-hidden group/img print:rounded-lg">
                   <img 
                    src={images.pool} 
                    alt="Detay" 
                    className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 hover:scale-105 transition-all duration-700 print:opacity-100"
                  />
              </div>

              {/* Bottom Right - Sign */}
              <div className="col-span-1 md:col-span-3 md:row-span-1 h-32 md:h-full relative rounded-2xl overflow-hidden group/img print:rounded-lg">
                   <img 
                    src={images.sign} 
                    alt="Özellik" 
                    className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 hover:scale-105 transition-all duration-700 print:opacity-100"
                  />
                  <div className="absolute inset-0 bg-indigo-900/80 flex flex-col items-center justify-center text-center p-2 print:bg-indigo-100/90">
                      <p className="text-xl md:text-2xl font-bold text-white print:text-indigo-900">{property.konumAnalizi.mevcutYapi || property.planAltBaslik?.split('|')[0] || ''}</p>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-indigo-200 print:text-indigo-900">{property.planAltBaslik || ''}</p>
                  </div>
              </div>

          </div>
        </div>
      )}

    </header>
  );
};
