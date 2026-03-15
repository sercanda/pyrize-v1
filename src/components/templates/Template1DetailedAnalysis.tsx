'use client';

import React from 'react';
import { OlusturulanSunum } from '@/types';
import { MarketAnalysisSection } from './shared/MarketAnalysisSection';
import { FaqSection } from './shared/FaqSection';
import { formatPriceRange } from '@/lib/utils/price';
import SectionWrapper from './SectionWrapper';
import { useInView } from '@/lib/hooks/useInView';
import Image from 'next/image';

interface Props {
  data: OlusturulanSunum;
}

// Problem Card Component
const ProblemCard: React.FC<{ 
  icon: string; 
  title: string; 
  text: string; 
  loss: string; 
  delay: string;
  index: number;
}> = ({ icon, title, text, loss, delay, index }) => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div ref={ref} className={`bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 transition-all duration-700 ${delay} ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h3 className="text-lg sm:text-xl font-bold flex items-center flex-wrap">
        <span className="text-red-500 text-xl sm:text-2xl mr-2 sm:mr-3">{icon}</span> 
        <span className="flex-1">{title}</span>
      </h3>
      <p className="mt-2 text-gray-400 text-sm sm:text-base leading-relaxed">{text}</p>
      <p className="mt-3 text-red-400 font-semibold text-xs sm:text-sm"><em>{loss}</em></p>
    </div>
  );
};

// Solution Card Component
const SolutionCard: React.FC<{ title: string; text: string; comparison: string }> = ({ title, text, comparison }) => (
  <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 text-center transform hover:scale-105 transition-transform duration-300">
    <div className="text-green-500 text-4xl sm:text-5xl mb-3 sm:mb-4">✅</div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600 text-sm sm:text-base">{text}</p>
    <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 italic">{comparison}</p>
  </div>
);

// Timeline Step Component
const TimelineStep: React.FC<{
  step: number;
  icon: string;
  title: string;
  duration: string;
  actions: { title: string; items: string[] };
  benefit: { title: string; text: string };
  children?: React.ReactNode;
  isLast?: boolean;
  extraInfo?: string;
  hasTable?: boolean;
}> = ({ step, icon, title, duration, actions, benefit, children, isLast, extraInfo, hasTable }) => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className={`relative pl-12 sm:pl-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
      <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-blue-800 text-xl sm:text-2xl font-black shadow-lg z-10">
        {icon}
      </div>
      {!isLast && <div className="absolute left-5 sm:left-6 top-10 sm:top-12 bottom-0 w-px bg-white/30"></div>}
      
      <div className="bg-black/20 p-4 sm:p-6 rounded-xl border border-white/20 backdrop-blur-sm">
        <p className="text-xs sm:text-sm font-bold text-yellow-300">{duration}</p>
        <h3 className="text-xl sm:text-2xl font-bold mt-1">{step}. {title}</h3>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-4">
          <div>
            <h4 className="font-semibold text-white/90 text-sm sm:text-base">{actions.title}</h4>
            <ul className="list-disc list-inside mt-2 text-white/70 space-y-1 text-xs sm:text-sm">
              {actions.items.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-300 text-sm sm:text-base">{benefit.title}</h4>
            <p className="mt-1 text-white/90 text-xs sm:text-sm">{benefit.text}</p>
          </div>
        </div>
        
        {extraInfo && (
          <div className="mt-4 bg-yellow-400/10 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-xs sm:text-sm">
            {extraInfo.split('\n').map((line, idx) => (
              <p key={idx} className={idx > 0 ? 'mt-1 font-bold' : ''}>{line}</p>
            ))}
          </div>
        )}
        
        {hasTable && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left text-white/90 bg-white/5 rounded-lg">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-2 sm:p-3"></th>
                  <th className="p-2 sm:p-3">Bireysel</th>
                  <th className="p-2 sm:p-3">Benimle</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="p-2 sm:p-3 font-semibold">Erişim</td>
                  <td className="p-2 sm:p-3">50-100</td>
                  <td className="p-2 sm:p-3 text-green-400 font-bold">15,000+ ✅</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-2 sm:p-3 font-semibold">Maliyet</td>
                  <td className="p-2 sm:p-3">₺0 (ama satmıyor)</td>
                  <td className="p-2 sm:p-3 text-green-400 font-bold">₺0 (ben karşılıyorum)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
};

// Detail Card Component
const DetailCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
  <div className="bg-white/5 p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-sm h-full">
    <h4 className="text-lg sm:text-xl font-bold flex items-center text-yellow-300 mb-3 sm:mb-4 flex-wrap">
      <span className="text-xl sm:text-2xl mr-2">{icon}</span> 
      <span>{title}</span>
    </h4>
    <div className="text-sm sm:text-base">{children}</div>
  </div>
);

// Guarantee Card Component
const GuaranteeCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, icon, children }) => (
  <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-blue-200 text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 inline-block">{icon}</div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">{title}</h3>
    <div className="mt-2 text-sm sm:text-base text-gray-600">{children}</div>
  </div>
);

// Urgency Card Component
const UrgencyCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, icon, children }) => (
  <div className="bg-white/10 p-8 rounded-xl border border-white/20 backdrop-blur-sm text-center">
    <div className="text-5xl mb-4 inline-block">{icon}</div>
    <h3 className="text-2xl font-bold">{title}</h3>
    <div className="mt-2 text-white/80">{children}</div>
  </div>
);

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <div className="text-gray-600 pr-4">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function Template1DetailedAnalysis({ data }: Props) {
  const { icerik, istek } = data;
  const { mulk, danisman } = istek;
  const markaRenkleri = (istek as any).markaRenkleri;
  
  // Marka renkleri varsayılan değerlerle birlikte
  const colors = {
    primary: markaRenkleri?.primary || '#DBE64C',
    secondary: markaRenkleri?.secondary || '#3A7DFF',
    accent: markaRenkleri?.accent || '#FF6B9D'
  };
  
  // Bölgeleri bul
  const heroBolge = icerik.bolgeler?.find((b: any) => b.tip === 'hero');
  const problemBolge = icerik.bolgeler?.find((b: any) => b.tip === 'problemler');
  const cozumBolge = icerik.bolgeler?.find((b: any) => b.tip === 'cozum');
  const processBolge = icerik.bolgeler?.find((b: any) => b.tip === 'process');
  const locationBolge = icerik.bolgeler?.find((b: any) => b.tip === 'location_analysis');
  const targetBolge = icerik.bolgeler?.find((b: any) => b.tip === 'target_audience');
  const marketingBolge = icerik.bolgeler?.find((b: any) => b.tip === 'marketing');
  const marketAnalysisBolge = icerik.bolgeler?.find((b: any) => b.tip === 'market_analysis');
  const faqBolge = icerik.bolgeler?.find((b: any) => b.tip === 'faq');
  const guaranteeBolge = icerik.bolgeler?.find((b: any) => b.tip === 'guarantee');
  const urgencyBolge = icerik.bolgeler?.find((b: any) => b.tip === 'timing');
  const ctaBolge = icerik.bolgeler?.find((b: any) => b.tip === 'cta');
  const credibilityBolge = icerik.bolgeler?.find((b: any) => b.tip === 'credibility');
  const valuationData = icerik.detayliDegerleme;
  const valuationSnapshots = valuationData?.marketSnapshots?.filter((item: any) => item && (item.title || item.value)) || [];
  const valuationComparables = valuationData?.comparables?.filter((item: any) => item && (item.address || item.price)) || [];
  const hasValuationSection = Boolean(
    valuationSnapshots.length ||
    valuationComparables.length ||
    valuationData?.estimatedValueRange
  );
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "stable":
        return "–";
      default:
        return "";
    }
  };
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-500";
    }
  };

  // Fotoğraf URL'leri
  const mainPhoto = (mulk as any).fotograflar?.[0] || 'https://picsum.photos/1920/1080?blur=5&random=1';
  const danismanFoto = danisman.profilFotografi; // Yoksa gösterilmeyecek
  const ofisLogosu = (danisman as any).ofisLogosu; // Yoksa gösterilmeyecek
  const odullerStr = (danisman as any).oduller; // Ödüller string olarak
  const mulkTurLabel = mulk.tur === "arsa" ? "Arsa" : mulk.tur === "daire" ? "Daire" : mulk.tur === "villa" ? "Villa" : mulk.tur === "ticari" ? "Ticari Gayrimenkul" : mulk.tur === "ofis" ? "Ofis" : "Kompleks";

  // Problem kartları için veri hazırlama
  const problemCards = problemBolge?.altBolge?.map((p: any, idx: number) => ({
    icon: '❌',
    title: `${idx + 1}. ${p.baslik || 'Sorun'}`,
    text: p.icerik || '',
    loss: p.kayip || 'Kayıp: Potansiyel gelirden önemli kayıp',
    delay: `delay-${idx * 100}`
  })) || [];

  // Solution kartları için veri hazırlama
  const solutionCards = cozumBolge?.altBolge?.map((s: any) => ({
    title: s.baslik || 'Çözüm',
    text: s.icerik || '',
    comparison: s.karsilastirma || 'Vs. bireysel: Daha iyi sonuç'
  })) || [];

  // Process adımları için veri hazırlama - ZIP'teki detaylı yapıya göre
  const defaultProcessSteps = [
    {
      step: 1,
      icon: '📊',
      title: 'PROFESYONEL DEĞERLEME',
      duration: 'Gün 1-2',
      actions: {
        title: 'Ne yapıyorum:',
        items: ['Detaylı piyasa analizi', 'Benzer satışlar incelemesi', 'Bölge değer artış trendi', 'Optimal fiyat stratejisi']
      },
      benefit: {
        title: '💰 Sizin kazancınız:',
        text: 'Doğru fiyat = Maksimum gelir potansiyeli'
      }
    },
    {
      step: 2,
      icon: '📹',
      title: 'GÖRSEL ŞÖLEN',
      duration: 'Gün 3-5',
      actions: {
        title: 'Ne yapıyorum:',
        items: ['4K profesyonel drone çekimi', 'Zemin fotoğraf seansı (gün batımı/gün doğumu)', 'HD tanıtım videosu (45-60 saniye)', '360° sanal tur', 'Profesyonel edit ve renklendirme']
      },
      benefit: {
        title: '💡 Sizin kazancınız:',
        text: 'Sinematik tanıtım = %300 daha fazla ilgi'
      },
      extraInfo: 'Profesyonel drone çekimi maliyeti: ₺3,500-5,000\nSizin için: TAMAMEN ÜCRETSİZ'
    },
    {
      step: 3,
      icon: '📱',
      title: 'DİJİTAL PAZARLAMA',
      duration: 'Gün 5-10',
      actions: {
        title: 'Ne yapıyorum:',
        items: ['Facebook & Instagram reklamları (hedefli kitle)', 'Google Ads (arama + harita)', 'Emlakjet, Sahibinden, Hepsiemlak PREMIUM ilanlar', 'YouTube video reklamı', '500+ alıcı database\'ine e-posta']
      },
      benefit: {
        title: '📈 Erişim metriği:',
        text: 'Ortalama 15,000-20,000 kişiye ulaşım (ilk 2 hafta)'
      },
      extraInfo: 'Reklam bütçesi: ₺8,000-12,000 aylık reklam harcaması\nSizin için: TAMAMEN ÜCRETSİZ',
      hasTable: true
    },
    {
      step: 4,
      icon: '🌍',
      title: 'EMLAK AĞINDA DUYURU',
      duration: 'Gün 1-30',
      actions: {
        title: 'Ne yapıyorum:',
        items: ['Geniş emlak ağına duyuru', 'Kurumsal yatırımcı erişimi', 'Diğer danışmanlarla iş birliği', 'Emlak fuarlarında sunum']
      },
      benefit: {
        title: '🤝 Sizin kazancınız:',
        text: 'Yerel + ulusal + kurumsal alıcılar aynı anda'
      }
    },
    {
      step: 5,
      icon: '🔍',
      title: 'NİTELİKLİ ALICI FİLTRESİ',
      duration: 'Gün 10-45',
      actions: {
        title: 'Ne yapıyorum:',
        items: ['İlk telefon filtrelemesi (ben yapıyorum)', 'Finansal yeterlilik kontrolü', 'Ciddiyet testi', 'Profesyonel görüşme planlama']
      },
      benefit: {
        title: '✅ Sizin kazancınız:',
        text: 'Siz sadece CİDDİ, HAZIR alıcılarla görüşürsünüz. Zaman kaybı = 0'
      }
    },
    {
      step: 6,
      icon: '🤝',
      title: 'PROFESYONEL KAPANIŞ',
      duration: 'Gün 30-60',
      actions: {
        title: 'Ne yapıyorum:',
        items: ['Pazarlık stratejisi koçluğu', 'Sözleşme danışmanlığı', 'Noter süreç yönetimi', 'Ödeme garantisi koordinasyonu', 'Tapu devir tamamlama']
      },
      benefit: {
        title: '🎯 Sizin kazancınız:',
        text: 'En yüksek teklif + güvenli ödeme + stressiz devir'
      }
    }
  ];

  const processSteps = processBolge?.altBolge && processBolge.altBolge.length > 0 ? 
    processBolge.altBolge.map((step: any, idx: number) => {
      const lines = step.icerik?.split('\n') || [];
      const duration = lines.find((l: string) => l.includes('Gün')) || defaultProcessSteps[idx]?.duration || '';
      const actionsItems = lines.filter((l: string) => l.includes('•') || l.includes('-')).map((l: string) => l.replace(/[•-]/, '').trim()) || defaultProcessSteps[idx]?.actions.items || [];
      const benefitText = lines.find((l: string) => l.includes('kazancınız') || l.includes('Sizin') || l.includes('Erişim')) || defaultProcessSteps[idx]?.benefit.text || '';

      return {
        step: idx + 1,
        icon: ['📊', '📹', '📱', '🌍', '🔍', '🤝'][idx] || '📋',
        title: step.baslik || defaultProcessSteps[idx]?.title || 'Adım',
        duration: duration,
        actions: {
          title: 'Ne yapıyorum:',
          items: actionsItems.length > 0 ? actionsItems : defaultProcessSteps[idx]?.actions.items || []
        },
        benefit: {
          title: defaultProcessSteps[idx]?.benefit.title || 'Sizin kazancınız:',
          text: benefitText
        },
        extraInfo: defaultProcessSteps[idx]?.extraInfo,
        hasTable: defaultProcessSteps[idx]?.hasTable
      };
    }) : defaultProcessSteps;

  // FAQ items
  const faqItems = faqBolge?.altBolge?.map((faq: any) => ({
    q: faq.baslik || faq.question || 'Soru',
    a: faq.icerik || faq.answer || 'Cevap'
  })) || [];

  return (
    <div className="bg-gray-900 text-gray-800 antialiased" style={{ 
      maxWidth: '100vw', 
      overflowX: 'hidden',
      ['--brand-primary' as any]: colors.primary,
      ['--brand-secondary' as any]: colors.secondary,
      ['--brand-accent' as any]: colors.accent
    }}>
      <style jsx>{`
        :global(:root) {
          --brand-primary: ${colors.primary};
          --brand-secondary: ${colors.secondary};
          --brand-accent: ${colors.accent};
        }
      `}</style>
      <main style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        {/* HERO SECTION */}
      {heroBolge && (
          <div className="relative h-screen min-h-[500px] sm:min-h-[600px] flex flex-col items-center justify-center text-white text-center p-4">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${mainPhoto})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent"></div>
            
            <div className="absolute top-0 left-0 right-0 bg-black/50 p-2 sm:p-4 text-xs sm:text-sm md:text-lg lg:text-xl font-bold tracking-wide sm:tracking-widest animate-pulse">
              <p className="text-center">🔒 Gizli • Sadece Sizin İçin Hazırlandı • {mulk.konum}</p>
          </div>

            <div className="relative z-10 flex flex-col items-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-tight text-center" style={{textShadow: '0 4px 15px rgba(0,0,0,0.5)'}}>
                {mulkTurLabel === "Arsa" ? "Arsanızın" : mulkTurLabel === "Daire" ? "Dairenizin" : mulkTurLabel === "Villa" ? "Villanızın" : `${mulkTurLabel}ünüzün`} Gerçek Değerini Biliyor musunuz?
            </h1>
              <p className="mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl font-light text-center px-2" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
                Bu sunum, {mulk.konum} bölgesindeki gayrimenkulünüzün nasıl 30-60 gün içinde <strong className="font-bold text-yellow-300">hak ettiği en yüksek fiyata</strong> satılabileceğini gösteriyor.
              </p>
              
              <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold">
                Ücretsiz Analiz • Sıfır Risk
          </div>

              <div className="absolute bottom-[-80px] sm:bottom-[-100px] md:bottom-[-150px] flex flex-col items-center space-y-2 text-white/80">
                <p className="text-xs sm:text-sm">↓ Aşağı kaydırın ve 3 dakikada öğrenin</p>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                  <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              </div>
          </div>
          </div>
        )}

        {/* SPECIAL PLAN - Sayfa 1'e dahil */}
        {(locationBolge || targetBolge || marketingBolge) && (
          <SectionWrapper className="bg-gray-900 text-white" style={{backgroundImage: `radial-gradient(circle at top left, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 1))`}}>
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm uppercase tracking-wide sm:tracking-widest mb-3 sm:mb-4">
                🎯 SİZİN {mulkTurLabel.toUpperCase()}INIZ İÇİN HAZIRLADIĞIM ÖZEL PLAN
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">{mulk.konum}</h2>
              <h3 className="text-base sm:text-lg md:text-xl text-white/80 mt-2">{mulk.metrekare ? `${mulk.metrekare} m²` : ''} {mulk.cevreOzellikleri?.[0] || ''}</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
              {locationBolge && (
                <DetailCard title="KONUM ANALİZİ" icon="📍">
                  <ul className="space-y-1 text-white/80 text-sm">
                    <li><strong>Konum:</strong> {mulk.konum}</li>
                    <li><strong>Mülk Türü:</strong> {mulkTurLabel}</li>
                    {formatPriceRange(mulk) && <li><strong>Fiyat:</strong> {formatPriceRange(mulk)}</li>}
                    {mulk.metrekare && <li><strong>Metrekare:</strong> {mulk.metrekare} m²</li>}
                  </ul>
                </DetailCard>
              )}
              {locationBolge?.altBolge && locationBolge.altBolge.length > 0 && (
                <DetailCard title="KONUM AVANTAJLARI" icon="🏖️">
                  <ul className="list-inside space-y-1 text-sm">
                    {locationBolge.altBolge.slice(0, 4).map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-400 mr-2">✅</span>
                        <span>{item.baslik || item.icerik}</span>
                      </li>
                    ))}
                  </ul>
                </DetailCard>
              )}
            </div>
          </SectionWrapper>
        )}

        {/* VALUATION - Sayfa 1'e dahil */}
        {hasValuationSection && (
          <SectionWrapper className="bg-slate-800 text-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Tahmini Piyasa Değeri</h2>
            </div>
            {valuationData?.estimatedValueRange && (
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6 text-center mb-6">
                <p className="text-sm font-semibold text-cyan-300 uppercase tracking-widest">Tahmini Değer Aralığı</p>
                <p className="text-3xl sm:text-4xl font-black text-white my-2">{valuationData.estimatedValueRange}</p>
              </div>
            )}
            {valuationSnapshots.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {valuationSnapshots.slice(0, 3).map((snapshot: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-gray-400">{snapshot.title}</p>
                    <p className="text-xl font-bold text-white mt-1">{snapshot.value}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionWrapper>
        )}

        {/* PROBLEM SECTION */}
        {problemBolge && (
          <SectionWrapper className="bg-black text-white">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 sm:mb-12">
              {problemBolge?.baslik?.split(' ').slice(0, -3).join(' ') || (mulkTurLabel === "Arsa" ? "Arsanızı Satarken Karşılaşacağınız" : `${mulkTurLabel}ünüzü Satarken Karşılaşacağınız`)} <span className="text-red-500">{problemBolge?.baslik?.split(' ').slice(-3).join(' ') || '5 Büyük Sorun'}</span>
          </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {problemCards.length > 0 ? (
                problemCards.map((p, i) => (
                  <ProblemCard key={i} {...p} index={i} />
                ))
              ) : (
                <>
                  <ProblemCard 
                    icon="❌" 
                    title="1. Yanlış Fiyatlandırma" 
                    text="Çoğu arsa sahibi, piyasa analizini yanlış yapıyor. Ya çok ucuza satıyor, ya da aylarca satamıyor." 
                    loss="Kayıp: Potansiyel gelirden önemli kayıp" 
                    delay="delay-0"
                    index={0}
                  />
                  <ProblemCard 
                    icon="❌" 
                    title="2. Yetersiz Tanıtım" 
                    text="Telefon fotoğrafları ve sahibinden.com ilanı yeterli değil. Arsanız potansiyel alıcıların %95'ine ulaşamıyor." 
                    loss="Kayıp: 10-15 potansiyel alıcı" 
                    delay="delay-100"
                    index={1}
                  />
                  <ProblemCard 
                    icon="❌" 
                    title="3. Güvenlik Riski" 
                    text="Birebir görüşmeler, dolandırıcılık riski, ödeme sorunları... Stresli ve riskli bir süreç." 
                    loss="Risk: Zaman + Para + Emniyet" 
                    delay="delay-200"
                    index={2}
                  />
                  <ProblemCard 
                    icon="❌" 
                    title="4. Zaman Kaybı" 
                    text="Ortalama bireysel satış süresi: 8-12 ay. Her ay beklemek = değer kaybı." 
                    loss="Kayıp: Her ay emlak değer artışından geri kalma" 
                    delay="delay-300"
                    index={3}
                  />
                  <ProblemCard 
                    icon="❌" 
                    title="5. Pazarlık Gücü Kaybı" 
                    text="Profesyonel olmayan sunum = pazarlık masasında zayıflık = daha düşük fiyat." 
                    loss="Kayıp: %10-20 daha az satış fiyatı" 
                    delay="delay-400"
                    index={4}
                  />
                </>
              )}
                </div>
            <div className="mt-8 sm:mt-12 bg-red-900/50 border border-red-700 text-red-300 p-4 sm:p-6 rounded-lg text-center">
              <p className="text-base sm:text-lg md:text-xl font-bold">⚠️ Bu sorunların her biri sizi <span className="underline">yüz binlerce lira zarara</span> uğratabilir.</p>
                  </div>
          </SectionWrapper>
        )}

        {/* SOLUTION SECTION */}
        {cozumBolge && (
          <SectionWrapper className="bg-gray-50 text-gray-800" breakAfter>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Peki Ya Bu Sorunların Hiçbiri Olmasaydı?</h2>
            <p className="text-center text-lg md:text-xl text-gray-600 mb-12">Size özel hazırladığım profesyonel satış sistemi ile...</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8" style={{ maxWidth: '100%', width: '100%' }}>
              {solutionCards.length > 0 ? (
                solutionCards.map((s, i) => (
                  <SolutionCard key={i} {...s} />
                ))
              ) : (
                <>
                  <SolutionCard 
                    title="30-60 Günde Satış" 
                    text="Ortalama satış sürem: 45 gün" 
                    comparison="Vs. bireysel: 8-12 ay" 
                  />
                  <SolutionCard 
                    title="Doğru Fiyatla Satış" 
                    text="Profesyonel pazarlama = daha yüksek teklif" 
                    comparison="Vs. bireysel satış: Değerinde satış fırsatı" 
                  />
                  <SolutionCard 
                    title="Sıfır Stres & Risk" 
                    text="Ben her şeyi hallederken, siz arkanıza yaslanın" 
                    comparison="Satış olmazsa tek kuruş ödemezsiniz" 
                  />
                </>
              )}
            </div>

            <div className="text-center mt-16 border-t border-gray-200 pt-6">
              <p className="text-gray-500">Birçok arsa sahibi bu sisteme güvendi → Hepsi başarıyla sattı</p>
          </div>
          </SectionWrapper>
        )}

        {/* CREDIBILITY SECTION */}
        {credibilityBolge && (
          <SectionWrapper className="bg-gray-100">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-8 sm:mb-12">Kimim Ben?</h2>
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="text-center md:text-left">
                {danismanFoto && (
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full mx-auto md:mx-0 mb-4 sm:mb-6 shadow-2xl overflow-hidden">
                    <Image
                      src={danismanFoto}
                      alt={danisman.adSoyad}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-2xl sm:text-3xl font-bold">{danisman.adSoyad}</h3>
                <p className="text-lg sm:text-xl text-blue-600 font-semibold">Gayrimenkul Danışmanı</p>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Lisanslı • {danisman.deneyim || '+3 yıl'} deneyim • {mulk.konum.split(',')[1]?.trim() || 'Bölge'} uzmanı</p>
                {odullerStr && (
                  <div className="mt-4 sm:mt-6 flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                    {odullerStr.split(',').map((odul: string, idx: number) => (
                      <div key={idx} className="bg-white p-2 sm:p-3 rounded-lg shadow text-xs sm:text-sm">🏆 {odul.trim()}</div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-center">
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-600">📈</div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-700 font-semibold">Birçok Başarılı Satış</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-600">⭐</div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-700 font-semibold">Yüksek Müşteri Memnuniyeti</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-600">🎯</div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-700 font-semibold">Doğru Fiyat Stratejisi</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-600">🤝</div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-700 font-semibold">Bölge Uzmanlığı</p>
                  </div>
                </div>
              </div>
            </div>
            {ofisLogosu && (
              <div className="mt-12 sm:mt-20 text-center bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md border">
                <img src={ofisLogosu} alt="Ofis Logosu" className="h-16 sm:h-20 mx-auto mb-3 sm:mb-4 object-contain" />
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">"Güvenilir emlak hizmetinin adresi"</p>
              </div>
            )}
          </SectionWrapper>
        )}

        {/* UNIQUE MECHANISM (6 ADIM PROCESS) */}
        {processBolge && processSteps.length > 0 && (
          <SectionWrapper className="bg-gradient-to-br from-blue-900 via-indigo-900 to-red-900 text-white" breakAfter>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-4">6 Adımlı Profesyonel Satış Sistemi</h2>
            <p className="text-center text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-16">
              {mulkTurLabel === "Arsa" ? "Arsanızı" : `${mulkTurLabel}ünüzü`} En Yüksek Fiyata, En Hızlı Şekilde Satmanın Formülü
            </p>

            <div className="space-y-8 sm:space-y-12">
              {processSteps.map((step, idx) => (
                <TimelineStep
                  key={idx}
                  step={step.step}
                  icon={step.icon}
                  title={step.title}
                  duration={step.duration}
                  actions={step.actions}
                  benefit={step.benefit}
                  isLast={idx === processSteps.length - 1}
                  extraInfo={(step as any).extraInfo}
                  hasTable={(step as any).hasTable}
                />
              ))}
            </div>

            <div className="mt-12 sm:mt-16 text-center bg-white/10 p-4 sm:p-6 rounded-lg border border-white/20">
              <p className="text-base sm:text-xl">⏱️ Toplam süreç: Ortalama 45 gün</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-300 mt-2">💰 Hedef: Piyasa değerinde hızlı satış</p>
            </div>
          </SectionWrapper>
        )}

        {/* SPECIAL PLAN (Location Analysis, Target Audience, Marketing) */}
        {(locationBolge || targetBolge || marketingBolge) && (
          <SectionWrapper className="bg-gray-900 text-white" style={{backgroundImage: `radial-gradient(circle at top left, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 1)), url(https://picsum.photos/1920/1080?random=4&blur=2)`}}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm uppercase tracking-wide sm:tracking-widest mb-3 sm:mb-4">
                🎯 SİZİN {mulkTurLabel.toUpperCase()}INIZ İÇİN HAZIRLADIĞIM ÖZEL PLAN
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black">{mulk.konum}</h2>
              <h3 className="text-base sm:text-xl md:text-2xl text-white/80 mt-2">{mulk.metrekare ? `${mulk.metrekare} m²` : ''} {mulk.cevreOzellikleri?.[0] || ''}</h3>
                    </div>
            
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              {locationBolge && (
                <DetailCard title="KONUM ANALİZİ" icon="📍">
                  <ul className="space-y-2 text-white/80">
                    <li><strong>Konum:</strong> {mulk.konum}</li>
                    <li><strong>Mülk Türü:</strong> {mulkTurLabel}</li>
                  {formatPriceRange(mulk) && (
                    <li><strong>Fiyat:</strong> {formatPriceRange(mulk)}</li>
                  )}
                    {mulk.metrekare && <li><strong>Metrekare:</strong> {mulk.metrekare} m²</li>}
                  </ul>
                  {locationBolge.icerik && (
                    <p className="mt-4 text-white/70">{locationBolge.icerik}</p>
                  )}
                </DetailCard>
              )}

              {locationBolge?.altBolge && locationBolge.altBolge.length > 0 && (
                <DetailCard title="KONUM AVANTAJLARI" icon="🏖️">
                  <ul className="list-inside space-y-2">
                    {locationBolge.altBolge.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">✅</span>
                        <span>{item.baslik || item.icerik}</span>
                      </li>
                    ))}
                  </ul>
                </DetailCard>
              )}

              {targetBolge && (
                <DetailCard title="HEDEF KİTLE PROFİLİ" icon="🎯">
                  <div>
                    {targetBolge.altBolge?.map((persona: any, idx: number) => (
                      <div key={idx} className="mb-4">
                        <h5 className="font-bold">{idx + 1}. {persona.baslik || persona.persona}</h5>
                        <p className="text-sm text-white/70">{persona.icerik || persona.description}</p>
                      </div>
                    )) || <p className="text-white/70">{targetBolge.icerik}</p>}
                  </div>
                </DetailCard>
              )}

              {marketingBolge && (
                <DetailCard title="TANITIM STRATEJİSİ" icon="📢">
                  <p className="font-semibold">Ana Mesaj:</p>
                  <p className="text-lg text-white/90 mb-4">{marketingBolge.icerik || 'Profesyonel pazarlama stratejisi'}</p>
                  {marketingBolge.altBolge && marketingBolge.altBolge.length > 0 && (
                    <div>
                      <p className="font-semibold">Reklam Kanalları:</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {marketingBolge.altBolge.map((channel: any, idx: number) => (
                          <span key={idx} className="bg-green-500/20 text-green-300 p-2 rounded text-sm">
                            ✅ {channel.baslik || channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </DetailCard>
              )}
            </div>

            <div className="mt-8 sm:mt-12 text-center bg-green-900/50 border border-green-700 text-green-300 p-4 sm:p-6 rounded-lg">
              <p className="text-sm sm:text-base md:text-lg font-semibold">✅ Satış olmazsa <span className="font-bold">0₺</span> ücret • ✅ Tüm hizmetler <span className="font-bold">ücretsiz</span> • ✅ Hizmet bedeli sadece satış olunca</p>
            </div>
          </SectionWrapper>
        )}

        {hasValuationSection && (
          <SectionWrapper className="bg-white text-gray-900">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold">Detaylı Değerleme Raporu</h2>
              <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
                {mulk.konum} bölgesi ve benzer mülkler üzerinden oluşturulan güncel pazar analizi sonuçları.
              </p>
            </div>

            {valuationSnapshots.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                {valuationSnapshots.map((snapshot: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      {snapshot.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{snapshot.value}</p>
                    {(snapshot.trend || snapshot.trendLabel) && (
                      <div className={`mt-3 flex items-center text-sm ${getTrendColor(snapshot.trend)}`}>
                        {snapshot.trend && <span className="mr-2 font-bold text-lg">{getTrendIcon(snapshot.trend)}</span>}
                        <span className="text-gray-600">
                          {snapshot.trendLabel || (snapshot.trend === "up"
                            ? "Yükselişte"
                            : snapshot.trend === "down"
                            ? "Düşüşte"
                            : "Dengede")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {valuationComparables.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm mb-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Karşılaştırmalı Piyasa Analizi (Emsal Mülkler)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="uppercase text-xs bg-gray-200 text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Adres</th>
                        <th className="px-4 py-3">Durum</th>
                        <th className="px-4 py-3 text-right">Fiyat</th>
                        <th className="px-4 py-3 text-right">Alan</th>
                        <th className="px-4 py-3 text-right">m² Fiyatı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valuationComparables.map((comp: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-200 bg-white hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-900">{comp.address}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                comp.status === "Satıldı"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {comp.status || "Satışta"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">{comp.price}</td>
                          <td className="px-4 py-3 text-right">{comp.size || "—"}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">{comp.pricePerSqm || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {valuationData?.estimatedValueRange && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 text-center">
                <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest">
                  Tahmini Piyasa Değer Aralığı
                </p>
                <p className="text-3xl sm:text-4xl font-black text-blue-900 my-3">
                  {valuationData.estimatedValueRange}
                </p>
                <p className="text-sm text-blue-700 max-w-2xl mx-auto">
                  Bu aralık, emsal karşılaştırmaları, bölgesel talep ve mülkünüzün potansiyeli dikkate alınarak profesyonel danışmanlık kapsamında hazırlanmıştır.
                </p>
              </div>
            )}
          </SectionWrapper>
        )}

        {/* RISK REVERSAL (GUARANTEES) */}
        {guaranteeBolge && (
          <SectionWrapper className="bg-blue-50 text-gray-800">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-8 sm:mb-12">
              Hiçbir Risk Almıyorsunuz - <span className="text-blue-600">Garantilerim:</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {guaranteeBolge.altBolge?.map((guarantee: any, idx: number) => (
                <GuaranteeCard key={idx} title={guarantee.baslik || 'Garanti'} icon={['💸', '🔒', '📞'][idx] || '✅'}>
                  <p>{guarantee.icerik || 'Garanti açıklaması'}</p>
                </GuaranteeCard>
              )) || (
                <>
                  <GuaranteeCard title="Sıfır Ön Ödeme" icon="💸">
                    <p>Arsanızı listelemek için <strong>tek kuruş ödemezsiniz.</strong></p>
                  </GuaranteeCard>
                  <GuaranteeCard title="Güvenilir Hizmet Garantisi" icon="🔒">
                    <p>Profesyonel ve güvenilir emlak danışmanlığı hizmeti.</p>
                  </GuaranteeCard>
                  <GuaranteeCard title="7/24 İletişim" icon="📞">
                    <p>Satış sürecinde her an bana ulaşabilirsiniz.</p>
                  </GuaranteeCard>
                </>
              )}
            </div>
          </SectionWrapper>
        )}

        {/* URGENCY SECTION */}
        {urgencyBolge && (
          <SectionWrapper className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UrgencyCard title="Zaman Kaybı = Para Kaybı" icon="⏰">
                  <p>Emlak piyasası sürekli değişiyor. Her ay beklemek = değer kaybı riski.</p>
                  <div className="mt-4 bg-black/20 p-3 rounded-lg text-sm">
                    <p>💡 Bahar sezonu = alıcı talebi en yüksek = en yüksek fiyat</p>
                </div>
                </UrgencyCard>
                <UrgencyCard title="Piyasa Fırsatı" icon="📈">
                  <p>{mulk.konum.split(',')[1]?.trim() || 'Bölge'} bölgesi son 6 ayda <strong>%18 değer kazandı.</strong></p>
                  <div className="mt-4 bg-black/20 p-3 rounded-lg text-sm">
                    <p>💡 Şimdi satış = piyasanın zirvesinden satış!</p>
          </div>
                </UrgencyCard>
              </div>
          </div>
          </SectionWrapper>
        )}

        {marketAnalysisBolge && (
          <div className="bg-gray-900 py-20">
            <div className="max-w-6xl mx-auto px-6">
              <MarketAnalysisSection bolge={marketAnalysisBolge} theme="dark" />
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {faqBolge && faqItems.length > 0 && (
          <SectionWrapper className="bg-gray-50">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Aklınızdaki Sorular</h2>
            <div className="max-w-3xl mx-auto">
              {faqItems.map((faq, idx) => (
                <FAQItem key={idx} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </SectionWrapper>
      )}

      {/* FINAL CTA */}
      {ctaBolge && (
          <SectionWrapper className="bg-gray-900 text-white" style={{backgroundImage: `radial-gradient(circle at center, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 1))`}}>
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter" style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.1)'}}>
                {ctaBolge.baslik || `${mulkTurLabel}ünüzün Potansiyelini Birlikte Ortaya Çıkaralım`}
          </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
                {ctaBolge.icerik || 'Detaylı bilgi ve ücretsiz analiz raporu için hemen benimle iletişime geçin.'}
              </p>
            </div>

            <div className="mt-12 max-w-6xl mx-auto flex justify-center items-center">
              <div className="text-center">
                {danismanFoto && (
                  <div className="relative w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                    <Image
                      src={danismanFoto}
                      alt={danisman.adSoyad}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold">{danisman.adSoyad}</h3>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-green-400">
                  <span className="bg-green-500/10 p-2 rounded">✅ 24 saat içinde geri dönüş</span>
                  <span className="bg-green-500/10 p-2 rounded">✅ Hiçbir bağlayıcılık yok</span>
                  <span className="bg-green-500/10 p-2 rounded">✅ 100% gizlilik garantisi</span>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href={`tel:${danisman.telefon}`} 
                    className="px-6 py-3 text-white rounded-lg transition-opacity"
                    style={{ backgroundColor: colors.secondary }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    📞 {danisman.telefon}
                  </a>
                  <a 
                    href={`mailto:${danisman.email}`} 
                    className="px-6 py-3 text-white rounded-lg transition-opacity"
                    style={{ backgroundColor: colors.primary }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    📧 {danisman.email}
            </a>
          </div>
              </div>
          </div>
          </SectionWrapper>
        )}

        {/* SOCIAL PROOF / FOOTER */}
        <SectionWrapper className="bg-white py-8">
          <footer className="text-center text-gray-400 text-sm pt-8 border-t">
            <p>&copy; {new Date().getFullYear()} {danisman.adSoyad}. Tüm hakları saklıdır.</p>
            <p>Bu sunum {mulk.konum} bölgesindeki {mulkTurLabel.toLowerCase()}ınız için özel olarak hazırlanmıştır.</p>
          </footer>
        </SectionWrapper>
      </main>
    </div>
  );
}
