
import React from 'react';
import { Property } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type HeroVariant = 'default' | 'bold' | 'magazine' | 'trust' | 'clean';

interface HeroSectionProps {
  property: Property;
  heroDescription?: string;
  heroHighlight?: string;
  theme: ThemeConfig;
  variant?: HeroVariant;
  consultantName?: string;
  consultantPhoto?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&auto=compress&fit=crop';

function useHeroData(property: Property, heroDescription?: string) {
  const fotograflar = (property as any)?.fotograflar || [];
  const hasRealPhotos = fotograflar.length > 0 && fotograflar.some((foto: string) =>
    foto && foto !== FALLBACK_IMAGE && !foto.includes('unsplash.com')
  );

  const images = {
    main: fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
    view: fotograflar[1] || fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
    pool: fotograflar[2] || fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
    sign: fotograflar[3] || fotograflar[0] || property.gorselUrl || FALLBACK_IMAGE,
  };

  const konumString = property.konumAnalizi.mahalle || property.konumAnalizi.ilIlce || '';
  const konumLabel = konumString ? `${konumString} • Satış Stratejisi` : 'Satış Stratejisi';

  const titleParts = property.planBaslik?.split('.') || ['Özel Analiz Raporu'];
  const mainTitle = titleParts[0] || 'Özel Analiz Raporu';
  const subtitle = titleParts[1] || property.planAltBaslik || '';

  const description = heroDescription || property.planAltBaslik || 'Mülkünüzün piyasa değerini, konum avantajlarını ve satış stratejisini veri odaklı analizlerle sunuyoruz.';

  return { fotograflar, hasRealPhotos, images, konumString, konumLabel, mainTitle, subtitle, description };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ property, heroDescription, heroHighlight, theme, variant = 'default', consultantName, consultantPhoto }) => {
  switch (variant) {
    case 'bold': return <BoldHero property={property} heroDescription={heroDescription} theme={theme} />;
    case 'magazine': return <MagazineHero property={property} heroDescription={heroDescription} theme={theme} />;
    case 'trust': return <TrustHero property={property} heroDescription={heroDescription} theme={theme} consultantName={consultantName} consultantPhoto={consultantPhoto} />;
    case 'clean': return <CleanHero property={property} heroDescription={heroDescription} theme={theme} />;
    default: return <DefaultHero property={property} heroDescription={heroDescription} heroHighlight={heroHighlight} theme={theme} />;
  }
};

/* ═══════════ DEFAULT — Data Room Corporate ═══════════ */
function DefaultHero({ property, heroDescription, heroHighlight, theme }: HeroSectionProps) {
  const { hasRealPhotos, images, konumLabel, mainTitle, subtitle, description } = useHeroData(property, heroDescription);

  return (
    <header className="relative py-8 print:py-0 overflow-hidden group">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 print:mb-12 relative z-10">
        <div className="max-w-4xl text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${theme.borderColor} ${theme.isDark ? 'bg-white/5' : 'bg-black/5'} mb-4 backdrop-blur-sm print:border-slate-800 print:bg-slate-100`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} animate-pulse print:bg-indigo-900`}></span>
            <span className={`text-xs font-semibold ${theme.textAccent} uppercase tracking-wider print:text-indigo-900`}>{konumLabel}</span>
          </div>
          <h1 className={`text-4xl lg:text-6xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} tracking-tighter leading-[1.1] mb-4 print:text-black print:text-5xl`}>
            {mainTitle}<br/>
            {subtitle && <span className={`${theme.textSecondary} font-light italic print:text-slate-800`}>{subtitle}</span>}
          </h1>
          <p className={`text-lg ${theme.textSecondary} max-w-2xl font-light leading-relaxed print:text-black`}>{description}</p>
        </div>
        <div className={`w-full lg:w-auto border-l ${theme.borderColor} pl-6 hidden lg:block print:hidden`}>
          <div className="space-y-4">
            <div>
              <p className={`text-[10px] font-bold ${theme.textSecondary} uppercase tracking-widest mb-1`}>Lokasyon</p>
              <p className={`text-base font-medium ${theme.textPrimary}`}>{property.konumAnalizi.ilIlce || property.konumAnalizi.mahalle || 'Belirtilmemiş'}</p>
            </div>
            <div>
              <p className={`text-[10px] font-bold ${theme.textSecondary} uppercase tracking-widest mb-1`}>Özellik</p>
              <p className={`text-base font-medium ${theme.textPrimary}`}>{property.konumAnalizi.ozellik || property.konumAnalizi.mevcutYapi || 'Belirtilmemiş'}</p>
            </div>
          </div>
        </div>
      </div>

      {hasRealPhotos && <ImageCollage images={images} property={property} theme={theme} />}
    </header>
  );
}

/* ═══════════ BOLD — Hızlı Satış / Urgency ═══════════ */
function BoldHero({ property, heroDescription, theme }: Omit<HeroSectionProps, 'variant'>) {
  const { hasRealPhotos, images, mainTitle, subtitle, description } = useHeroData(property, heroDescription);

  return (
    <header className="relative py-6 overflow-hidden">
      {/* Urgency top bar */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-red-400">Acil Satış Fırsatı</span>
      </div>

      <h1 className={`text-5xl lg:text-7xl font-black ${theme.isDark ? 'text-white' : 'text-slate-900'} uppercase tracking-tighter leading-[0.95] mb-4`}>
        {mainTitle}
      </h1>
      {subtitle && (
        <p className={`text-xl font-bold ${theme.textAccent} mb-4`}>{subtitle}</p>
      )}
      <p className={`text-base ${theme.textSecondary} max-w-xl mb-6`}>{description}</p>

      {/* Quick stat bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        {property.konumAnalizi.mevcutYapi && (
          <div className={`px-4 py-2 rounded-lg ${theme.bgCard} border ${theme.borderColor}`}>
            <p className={`text-xs ${theme.textSecondary}`}>Yapı</p>
            <p className={`text-lg font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{property.konumAnalizi.mevcutYapi}</p>
          </div>
        )}
        {property.konumAnalizi.ilIlce && (
          <div className={`px-4 py-2 rounded-lg ${theme.bgCard} border ${theme.borderColor}`}>
            <p className={`text-xs ${theme.textSecondary}`}>Konum</p>
            <p className={`text-lg font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{property.konumAnalizi.ilIlce}</p>
          </div>
        )}
      </div>

      {hasRealPhotos && (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.main} alt={mainTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}
    </header>
  );
}

/* ═══════════ MAGAZINE — Premium Editorial ═══════════ */
function MagazineHero({ property, heroDescription, theme }: Omit<HeroSectionProps, 'variant'>) {
  const { hasRealPhotos, images, konumString, mainTitle, subtitle, description } = useHeroData(property, heroDescription);

  return (
    <header className="relative py-8 max-w-4xl mx-auto overflow-hidden">
      <div className="text-center mb-8">
        <div className={`h-px w-16 mx-auto mb-4 ${theme.accentBg}`}></div>
        <p className={`text-[10px] ${theme.textAccent} font-semibold tracking-[0.4em] uppercase mb-3`}>
          {konumString || 'Özel Sunum'}
        </p>
        <h1 className={`text-4xl md:text-5xl font-light ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic leading-tight mb-4`}>
          {mainTitle}
        </h1>
        {subtitle && (
          <p className={`text-lg ${theme.textAccent} font-medium`}>{subtitle}</p>
        )}
        <div className={`h-px w-16 mx-auto my-4 ${theme.accentBg}`}></div>
        <p className={`text-sm ${theme.textSecondary} max-w-lg mx-auto font-light`}>{description}</p>
      </div>

      {hasRealPhotos && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-amber-400/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.main} alt={mainTitle} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-6 text-right">
            <p className="text-xs text-white/60 font-light">{property.konumAnalizi.ozellik || ''} • {property.konumAnalizi.mevcutYapi || ''}</p>
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════ TRUST — Güven Odaklı ═══════════ */
function TrustHero({ property, heroDescription, theme, consultantName, consultantPhoto }: Omit<HeroSectionProps, 'variant'>) {
  const { hasRealPhotos, images, konumLabel, mainTitle, subtitle, description } = useHeroData(property, heroDescription);

  return (
    <header className="relative py-6 overflow-hidden">
      {/* Trust verification bar */}
      <div className={`flex flex-wrap items-center gap-3 mb-6 px-4 py-2.5 rounded-xl ${theme.isDark ? 'bg-blue-900/20 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
        {['Lisanslı Danışman', 'Satış Garantisi', 'Sıfır Risk'].map((badge, i) => (
          <span key={i} className={`text-xs font-semibold ${theme.isDark ? 'text-blue-300' : 'text-blue-700'} flex items-center gap-1`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            {badge}
          </span>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Consultant photo (early in hero) */}
        {consultantPhoto && (
          <div className="lg:w-32 lg:h-40 w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 border-blue-400/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={consultantPhoto} alt={consultantName || ''} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${theme.borderColor} ${theme.isDark ? 'bg-white/5' : 'bg-black/5'} mb-3`}>
            <span className={`text-xs font-semibold ${theme.textAccent} uppercase tracking-wider`}>{konumLabel}</span>
          </div>
          <h1 className={`text-3xl lg:text-5xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} tracking-tight leading-[1.1] mb-3`}>
            {mainTitle}
          </h1>
          {subtitle && <p className={`text-lg ${theme.textSecondary} font-light italic mb-2`}>{subtitle}</p>}
          <p className={`text-sm ${theme.textSecondary} max-w-xl leading-relaxed`}>{description}</p>
          {consultantName && (
            <p className={`mt-3 text-xs ${theme.textAccent} font-semibold`}>Hazırlayan: {consultantName}</p>
          )}
        </div>
      </div>

      {hasRealPhotos && (
        <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
          {[images.main, images.view, images.pool].map((src, i) => (
            <div key={i} className="h-36 md:h-48 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Fotoğraf ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

/* ═══════════ CLEAN — Minimalist ═══════════ */
function CleanHero({ property, heroDescription, theme }: Omit<HeroSectionProps, 'variant'>) {
  const { mainTitle, subtitle, description } = useHeroData(property, heroDescription);

  return (
    <header className="relative py-8 max-w-2xl mx-auto text-center">
      <h1 className={`text-3xl font-light ${theme.isDark ? 'text-white' : 'text-slate-900'} tracking-tight leading-tight mb-3`}>
        {mainTitle}
      </h1>
      {subtitle && (
        <p className={`text-sm ${theme.textSecondary} mb-4`}>{subtitle}</p>
      )}
      <div className={`h-px w-12 mx-auto mb-4 ${theme.borderAccent}`}></div>
      <p className={`text-sm ${theme.textSecondary} font-light leading-relaxed`}>{description}</p>
      {(property.konumAnalizi.mevcutYapi || property.konumAnalizi.ilIlce) && (
        <div className="flex items-center justify-center gap-4 mt-4">
          {property.konumAnalizi.mevcutYapi && (
            <span className={`text-xs ${theme.textSecondary}`}>{property.konumAnalizi.mevcutYapi}</span>
          )}
          {property.konumAnalizi.ilIlce && (
            <span className={`text-xs ${theme.textSecondary}`}>{property.konumAnalizi.ilIlce}</span>
          )}
        </div>
      )}
    </header>
  );
}

/* ═══════════ SHARED: Image Collage ═══════════ */
function ImageCollage({ images, property, theme }: { images: Record<string, string>; property: Property; theme: ThemeConfig }) {
  return (
    <div className={`relative w-full h-auto md:h-[450px] print:h-[400px] rounded-3xl overflow-hidden border ${theme.borderColor} ${theme.bgCard} print:border-none print:bg-transparent`}>
      <div className="grid grid-cols-2 md:grid-cols-12 md:grid-rows-2 h-full gap-2 p-2 print:gap-4 print:p-0">
        <div className="col-span-2 md:col-span-6 md:row-span-2 h-56 md:h-full relative rounded-2xl overflow-hidden print:rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.main} alt={property.planBaslik || "Mülk"} className="w-full h-full object-cover print:opacity-100" />
          {property.konumAnalizi.ozellik && (
            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded text-xs text-white border border-white/10 print:hidden">
              {property.konumAnalizi.ozellik}
            </div>
          )}
        </div>
        <div className="col-span-2 md:col-span-6 md:row-span-1 h-40 md:h-full relative rounded-2xl overflow-hidden print:rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.view} alt="Görünüm" className="w-full h-full object-cover print:opacity-100" />
        </div>
        <div className="col-span-1 md:col-span-3 md:row-span-1 h-32 md:h-full relative rounded-2xl overflow-hidden print:rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.pool} alt="Detay" className="w-full h-full object-cover print:opacity-100" />
        </div>
        <div className="col-span-1 md:col-span-3 md:row-span-1 h-32 md:h-full relative rounded-2xl overflow-hidden print:rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.sign} alt="Özellik" className="w-full h-full object-cover print:opacity-100" />
          <div className={`absolute inset-0 ${theme.isDark ? 'bg-indigo-900/80' : 'bg-indigo-600/80'} flex flex-col items-center justify-center text-center p-2`}>
            <p className="text-xl md:text-2xl font-bold text-white">{property.konumAnalizi.mevcutYapi || property.planAltBaslik?.split('|')[0] || ''}</p>
            <p className={`text-[10px] md:text-xs uppercase tracking-widest ${theme.isDark ? 'text-indigo-200' : 'text-indigo-100'}`}>{property.planAltBaslik || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
