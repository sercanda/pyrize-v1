'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum } from '@/types';
import { HeroSection } from './portfoy-almak-detayli-analiz-modern-new/components/HeroSection';
import { BenefitsSection } from './portfoy-almak-detayli-analiz-modern-new/components/PropertyFeaturesSection';
import { SalesProcessSection } from './portfoy-almak-detayli-analiz-modern-new/components/SalesStrategySection';
import { PropertyPlanSection } from './portfoy-almak-detayli-analiz-modern-new/components/LocationAdvantagesSection';
import { ConsultantTrustSection } from './portfoy-almak-detayli-analiz-modern-new/components/ConsultantTrustSection';
import { RegionalComparisonSection } from './portfoy-almak-detayli-analiz-modern-new/components/RegionalComparisonSection';
import { FAQSection } from './portfoy-almak-detayli-analiz-modern-new/components/FAQSection';
import type { Property, Consultant, StrategicAdvantage, SalesSystemStep, ValuationData, FAQItem } from './portfoy-almak-detayli-analiz-modern-new/types';
import { THEME_MODERN } from './shared/themeConfig';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=1973&auto=format&fit=crop';

const splitLines = (value?: string | null): string[] =>
  (value || '')
    .split(/\r?\n|\u2028|\u2029/)
    .map((line) => line.replace(/^[•\-✅\s]+/, '').trim())
    .filter(Boolean);

const formatCurrency = (value?: number): string | undefined =>
  typeof value === 'number' ? `${value.toLocaleString('tr-TR')} TL` : undefined;

const formatMetrekare = (value?: number): string | undefined =>
  typeof value === 'number' ? `${value.toLocaleString('tr-TR')} m²` : undefined;

const mapDataToTemplate = (data: OlusturulanSunum) => {
  const { istek, icerik } = data;
  const mulk = istek?.mulk;
  const danisman = istek?.danisman;

  // Fotoğrafları al
  const fotograflar = (mulk as any)?.fotograflar || [];
  const hasPhotos = fotograflar.length > 0;

  // Konum bilgileri
  const konumString = typeof mulk?.konum === 'string' ? mulk.konum.trim() : '';
  const konumParts = konumString
    ? konumString.split(',').map((item) => item.trim())
    : [];
  const il = konumParts[0] ?? '';
  const ilce = konumParts[1] ?? '';
  const mahalle = konumParts.slice(2).join(', ');

  // Property type
  const propertyType =
    mulk?.tur === 'arsa'
      ? 'Arsa'
      : mulk?.tur === 'daire'
        ? 'Daire'
        : mulk?.tur === 'villa'
          ? 'Villa'
          : mulk?.tur === 'ticari'
            ? 'Ticari Gayrimenkul'
            : mulk?.tur === 'ofis'
              ? 'Ofis'
              : 'Gayrimenkul';

  // Başlık ve alt başlık
  const baslik = icerik.baslik || (konumString ? `${konumString} - Özel Analiz Raporu` : 'Özel Analiz Raporu');
  const altBaslikParts = [
    konumString || undefined,
    formatMetrekare(mulk?.metrekare),
    formatCurrency(mulk?.fiyat),
  ].filter(Boolean) as string[];
  const altBaslik = altBaslikParts.length ? altBaslikParts.join(' • ') : 'Konum bilgisi paylaşılmadı';

  // Hero section için görseller
  const heroImages = hasPhotos
    ? {
      main: fotograflar[0] || FALLBACK_IMAGE,
      view: fotograflar[1] || fotograflar[0] || FALLBACK_IMAGE,
      pool: fotograflar[2] || fotograflar[0] || FALLBACK_IMAGE,
      sign: fotograflar[3] || fotograflar[0] || FALLBACK_IMAGE,
    }
    : {
      main: FALLBACK_IMAGE,
      view: FALLBACK_IMAGE,
      pool: FALLBACK_IMAGE,
      sign: FALLBACK_IMAGE,
    };

  // Hero başlık ve açıklama
  const heroTitle = icerik.baslik?.split(' - ')[0] || `${konumString || 'Özel'} Analiz Raporu`;
  const heroSubtitle = icerik.altBaslik || altBaslik;
  const heroDescription = icerik.heroAciklama || `${formatMetrekare(mulk?.metrekare) || 'Belirtilmemiş'} net kullanım alanı, ${mulk?.odaSayisi || 'Belirtilmemiş'} oda ve özel konum avantajları.`;

  // Template'deki gibi detaylı avantajlar
  const defaultSalesBenefits: StrategicAdvantage[] = [
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
      title: "Doğru Fiyatlama",
      description: "Bu m²'de bir mülkün değeri standart m² fiyatlarıyla hesaplanamaz. Şerefiye analizi ile gerçek değerini buluyoruz.",
      comparison: "Maksimum Kazanç"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
      title: "Nitelikli Alıcı",
      description: "Sadece fiyat soranları değil, bu yaşam standartını arayan ve alım gücü olan aileleri mülkünüze getiriyoruz.",
      comparison: "Stressiz Satış"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" })),
      title: "Profesyonel Sunum",
      description: "Geniş mülklerin ferahlığını amatör fotoğraflar gösteremez. Profesyonel çekim ve video ile mülkünüz parlar.",
      comparison: "Hızlı Sonuç"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
      title: "Hukuki Güvence",
      description: "Satış sözleşmeleri, kaparo süreçleri ve tapu devri, kurumsal hukuk departmanımızın denetiminde, sıfır risk ile yönetilir.",
      comparison: "Tam Güvenlik"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
      title: "Global Ağ Gücü",
      description: "Sadece yereldeki değil, RE/MAX'in uluslararası ağı sayesinde döviz bazlı yatırım yapan yabancı alıcılara da erişim.",
      comparison: "Döviz Fırsatı"
    }
  ];

  const cozumBolge = (icerik.bolgeler || []).find((b: any) => b.tip === 'cozum');
  const salesBenefits: StrategicAdvantage[] = cozumBolge?.altBolge && cozumBolge.altBolge.length > 0
    ? cozumBolge.altBolge.map((alt: any, index: number) => {
      const defaultBenefit = defaultSalesBenefits[index] || defaultSalesBenefits[0];
      return {
        icon: defaultBenefit.icon,
        title: alt.baslik || defaultBenefit.title,
        description: alt.icerik || defaultBenefit.description,
        comparison: defaultBenefit.comparison,
      };
    })
    : defaultSalesBenefits;

  // Template'deki gibi detaylı 6 adımlı sistem
  const defaultSalesSteps: SalesSystemStep[] = [
    {
      gun: "Gün 1-2",
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })),
      baslik: "1. Profesyonel Değerleme",
      neYapiyoruz: ["Bölge m² analizi", "Şerefiye hesabı (Kat, Cephe)", "Rakip site analizi"],
      kazanciniz: "Doğru fiyat = Maksimum gelir potansiyeli",
    },
    {
      gun: "Gün 3-5",
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" })),
      baslik: "2. Görsel Şölen",
      neYapiyoruz: ["İç mekan geniş açı çekim", "Drone ile havuz/site çekimi", "Tanıtım videosu"],
      kazanciniz: "Sinematik tanıtım = %300 daha fazla ilgi",
      maliyetNotu: "₺5,000",
      ucretNotu: "ÜCRETSİZ"
    },
    {
      gun: "Gün 5-10",
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
      baslik: "3. Dijital Pazarlama",
      neYapiyoruz: ["Sosyal medya reklamları", "Portal Premium İlanlar", "Veritabanı mailing"],
      kazanciniz: "15,000+ kişiye doğrudan erişim.",
      maliyetNotu: "₺12,000",
      ucretNotu: "ÜCRETSİZ"
    },
    {
      gun: "Gün 1-30",
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
      baslik: "4. RE/MAX Ağı Aktivasyonu",
      neYapiyoruz: ["850+ Ofise duyuru", "Yatırımcı erişimi", "Meslektaş iş birliği"],
      kazanciniz: "Yerel + ulusal alıcılar aynı anda hedeflenir.",
    },
    {
      gun: "Gün 10-45",
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" })),
      baslik: "5. Nitelikli Alıcı Filtresi",
      neYapiyoruz: ["Finansal yeterlilik kontrolü", "Ciddiyet testi", "Görüşme planlama"],
      kazanciniz: "Sadece CİDDİ alıcılarla görüşürsünüz. Zaman kaybı = 0",
    },
    {
      gun: "Gün 30-60",
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
      baslik: "6. Profesyonel Kapanış",
      neYapiyoruz: ["Pazarlık stratejisi", "Sözleşme yönetimi", "Tapu devir güvenliği"],
      kazanciniz: "En yüksek teklif + güvenli ödeme.",
    }
  ];

  const processBolge = (icerik.bolgeler || []).find((b: any) => b.tip === 'process');
  const salesSteps: SalesSystemStep[] = processBolge?.altBolge && processBolge.altBolge.length > 0
    ? processBolge.altBolge.map((alt: any, index: number) => {
      const defaultStep = defaultSalesSteps[index] || defaultSalesSteps[0];
      return {
        gun: defaultStep.gun,
        icon: defaultStep.icon,
        baslik: alt.baslik || defaultStep.baslik,
        neYapiyoruz: splitLines(alt.icerik).length > 0 ? splitLines(alt.icerik) : defaultStep.neYapiyoruz,
        kazanciniz: defaultStep.kazanciniz,
        maliyetNotu: defaultStep.maliyetNotu,
        ucretNotu: defaultStep.ucretNotu,
      };
    })
    : defaultSalesSteps;

  // Valuation data
  const valuationData: ValuationData = {
    marketSnapshots: [
      { title: `${ilce || il} Ort.`, value: 'Fiyat Sorunuz', trend: 'up' as const, trendLabel: 'Yüksek Talep' },
      { title: 'Ort. Satış Süresi', value: '30-45 Gün', trend: 'stable' as const, trendLabel: 'Bölge Ort.' },
      { title: 'Konfor Primi', value: '+%25', trend: 'up' as const, trendLabel: 'Site + M² Farkı' },
    ],
    comparables: [],
    estimatedValueRange: 'Ücretsiz Ekspertiz İle Belirlenir',
    priceStrategyNote: mulk?.fiyat ? `Dairenizin ${formatMetrekare(mulk.metrekare)} olması ve özel konumu, standart m² fiyatlarının üzerinde, 'Özel Fiyatlama' gerektirir.` : 'Özel fiyatlama stratejisi uygulanacaktır.',
  };

  // Template'deki gibi detaylı FAQ'ler
  const defaultFAQs: FAQItem[] = [
    {
      question: "Neden 'Tek Yetki' vermeliyim?",
      answer: "Bu kadar özellikli bir mülkün 'her emlakçıda' olması değerini düşürür. Tek yetki ile mülkünüz 'özel koleksiyon' gibi pazarlanır, tüm kontrol bende olur ve maksimum ciddiyet sağlanır."
    },
    {
      question: "Hizmet bedeli neden %2?",
      answer: "Lüks bir mülkü satmak, profesyonel medya üretimi ve doğru hedefleme gerektirir. Biz %2 ile size zaman kazandırıyor, pazarlıkta elinizi güçlendiriyor ve en yüksek fiyata satılmasını sağlıyoruz."
    },
    {
      question: "Mülküm neden henüz satılmadı?",
      answer: "Genellikle sebep ya 'yanlış fiyat' ya da 'yetersiz tanıtım'dır. Özel projelerde mülkün iç özelliklerini doğru anlatmak satışın anahtarıdır."
    },
    {
      question: "Eşyalı mı satmak mantıklı?",
      answer: "Lüks segmentte bazen eşyalı satış avantaj yaratabilir. Sizin durumunuza özel bir analiz yaparak eşyalı/eşyasız fiyat opsiyonlarını belirleyebiliriz."
    },
    {
      question: "Yabancıya satışa uygun mu?",
      answer: "Bölgeniz, yabancı yatırımcıların da radarında olabilir. Vatandaşlığa uygunluk durumunu ve ekspertiz değerini analiz ederek döviz bazlı satış fırsatlarını da değerlendiriyoruz."
    }
  ];

  const faqBolge = (icerik.bolgeler || []).find((b: any) => b.tip === 'faq');
  const faqItems: FAQItem[] = faqBolge?.altBolge && faqBolge.altBolge.length > 0
    ? faqBolge.altBolge.map((alt: any, index: number) => ({
      question: alt.baslik || defaultFAQs[index]?.question || 'Sık Sorulan Soru',
      answer: alt.icerik || defaultFAQs[index]?.answer || '',
    }))
    : defaultFAQs;

  // Consultant
  const consultant: Consultant = {
    adSoyad: danisman?.adSoyad || 'Danışman Adı',
    unvan: danisman?.unvan || 'Gayrimenkul Danışmanı',
    telefon: danisman?.telefon || '',
    email: danisman?.email || '',
    // Form'dan gelen profilFotografi veya profilFotografiUrl'yi kontrol et
    profilFotografiUrl: (danisman as any)?.profilFotografi || (danisman as any)?.profilFotografiUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    ofisLogosuUrl: (danisman as any)?.ofisLogosu || (danisman as any)?.ofisLogosuUrl || 'https://i.ibb.co/1yynDd7/e92f870139b241e9820965c4ac5167b3-removebg-preview.png',
    ofisAdi: danisman?.ofisAdi || '',
    oduller: (danisman as any)?.oduller || [],
    gucler: [],
  };

  // Property
  const property: Property & { fotograflar?: string[] } = {
    gorselUrl: heroImages.main,
    fotograflar: fotograflar,
    planBaslik: heroTitle,
    planAltBaslik: heroSubtitle,
    konumAnalizi: {
      ilIlce: ilce ? `${il} / ${ilce}` : il || 'Belirtilmemiş Konum',
      mahalle: mahalle || ilce || il || 'Belirtilmemiş Konum',
      ozellik: propertyType,
      mevcutYapi: `${mulk?.odaSayisi || 'Belirtilmemiş'} ${propertyType}`,
    },
    konumAvantajlari: splitLines(mulk?.konumAvantajlari),
    kullanimPotensiyeli: splitLines(mulk?.kullanimPotansiyeli),
    hedefKitle: (() => {
      // Bolgelerden target_audience tipli bölgeyi bul
      const targetAudienceBolge = (icerik.bolgeler || []).find((b: any) => b.tip === 'target_audience');
      if (targetAudienceBolge?.altBolge && targetAudienceBolge.altBolge.length > 0) {
        return targetAudienceBolge.altBolge.map((alt: any) => ({
          baslik: alt.baslik || 'Hedef Kitle',
          aciklama: alt.icerik || ''
        }));
      }
      // Fallback
      return [
        { baslik: 'Yatırımcılar', aciklama: 'Bölgedeki değer artışı ve kiralama potansiyelini değerlendirmek isteyen yatırımcılar.' },
        { baslik: 'Aileler', aciklama: 'Güvenli, konforlu ve sosyal olanaklara yakın yaşam arayan aileler.' },
        { baslik: 'Profesyoneller', aciklama: 'İş merkezlerine kolay ulaşım ve kaliteli yaşam alanı arayan profesyoneller.' }
      ];
    })(),
    tanitimStratejisi: {
      anaMesaj: icerik.heroAciklama || 'Özel analiz raporu',
      vurgular: [],
      gorselIcerikPlani: '',
    },
    satisPlani: {
      fiyatStratejisi: 'Premium Fiyatlama',
      hedefSatisSuresi: '30-45 Gün',
      tahminiIlgi: 'Nitelikli ailelerden yoğun talep',
    },
    // Standart reklam kanalları - her zaman sabit
    reklamKanallari: [
      'Sahibinden Vitrin İlan',
      'Emlakjet Premium Paket',
      'Facebook & Instagram Reklamları',
      'Google Ads (Arama + Display)',
      'YouTube Video Reklamları'
    ],
    marketAnalysis: (() => {
      // Bolgelerden market_analysis tipli bölgeyi bul
      const marketBolge = (icerik.bolgeler || []).find((b: any) => b.tip === 'market_analysis');
      const altBolgeler = marketBolge?.altBolge || [];

      // Nadir Fırsat, Konum Primi, Gelişim Potansiyeli kartlarını bul
      const nadirFirsat = altBolgeler.find((alt: any) => alt.baslik?.toLowerCase().includes('nadir') || alt.baslik?.toLowerCase().includes('fırsat'));
      const konumPrimi = altBolgeler.find((alt: any) => alt.baslik?.toLowerCase().includes('konum') && alt.baslik?.toLowerCase().includes('prim'));
      const gelisimPotansiyeli = altBolgeler.find((alt: any) => alt.baslik?.toLowerCase().includes('gelişim') || alt.baslik?.toLowerCase().includes('potansiyel'));

      return {
        microLocationValue: '',
        regionalTrend: gelisimPotansiyeli?.icerik || 'Bölgedeki yeni yapılaşmalar ve altyapı yatırımları, değer artış potansiyelini destekliyor. Geniş m²\'li projelere talep artıyor.',
        seaProximityPremium: konumPrimi?.icerik || 'Proje, şehir gürültüsünden uzak ancak ana arterlere yakın konumuyla öne çıkıyor. Ulaşım ve sosyal donatılara yakınlık, konum primi sağlıyor.',
        gardenValueRatio: '',
        marketRisk: nadirFirsat?.icerik || 'Bu m²\'deki mülkler piyasada nadir bulunuyor. Doğru pazarlama ile "Net Kullanım Alanı" ve "İnşaat Kalitesi" vurgulanmalı.',
        buyerBehavior: '',
        seasonalEffect: '',
      };
    })(),
  };

  return {
    heroImages,
    heroTitle,
    heroSubtitle,
    heroDescription,
    property,
    consultant,
    salesBenefits,
    salesSteps,
    valuationData,
    faqItems,
    konumString: ilce ? `${ilce}, ${il}` : il,
  };
};

// A wrapper component for print pages.
const PrintPageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`
    w-full 
    min-h-screen 
    px-6 md:px-12 lg:px-16 
    py-24 
    flex flex-col 
    print:block print:h-auto print:min-h-0 print:py-12 print:px-8 print:break-after-page
    ${className}
  `}>
    <div className="print:h-full print:w-full">
      {children}
    </div>
  </div>
);

const TemplateModernDetailedAnalysisWithPhotos: React.FC<{ data: OlusturulanSunum }> = ({ data }) => {
  const mapped = useMemo(() => mapDataToTemplate(data), [data]);

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-200 antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden print:bg-white print:text-black">
      {/* Global Gradient Background (Screen Only) */}
      <div className="absolute inset-0 z-0 pointer-events-none h-full w-full fixed print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 h-full"></div>
        <div className="absolute inset-0 opacity-[0.03] h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto bg-slate-950 shadow-2xl shadow-black print:bg-transparent print:shadow-none print:w-full print:max-w-none">
        <main className="flex flex-col gap-24 print:gap-0">
          {/* PAGE 1: KAPAK + DEĞERLEME */}
          <div className="min-h-screen flex flex-col print:block print:h-auto print:break-after-page print:px-8 print:py-8 relative">
            {/* Navbar Wrapper */}
            <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-end border-b border-white/5 bg-slate-950 relative z-50 print:bg-white print:border-b-2 print:border-slate-900 print:px-0 print:py-4 print:static print:mb-12">
              <div className="flex items-center gap-4">
                <img
                  src={mapped.consultant.ofisLogosuUrl || "https://i.ibb.co/1yynDd7/e92f870139b241e9820965c4ac5167b3-removebg-preview.png"}
                  alt={mapped.consultant.ofisAdi || "RE/MAX"}
                  className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] print:filter-none print:h-10"
                />
                <div>
                  <h1 className="text-lg font-bold text-white leading-none tracking-tight print:text-black">RE/MAX</h1>
                  <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-0.5 print:text-slate-700">Premium Collection</p>
                </div>
              </div>
              <div className="text-right hidden md:block print:block">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 print:text-slate-600">Rapor Referansı</p>
                <p className="text-sm font-mono text-slate-300 print:text-black print:font-bold">
                  {data.istek?.mulk?.ilanNo || `TR-${(mapped.property.konumAnalizi.ilIlce || 'LOC').replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-4)}`}
                </p>
              </div>
            </nav>

            {/* Content Wrapper */}
            <div className="flex-1 flex flex-col justify-center gap-12 px-6 md:px-12 lg:px-16 print:px-0 print:gap-8 print:block">
              {/* Hero Section */}
              <HeroSection
                property={mapped.property}
                heroDescription={mapped.heroDescription}
                theme={THEME_MODERN}
              />

              {/* Valuation Section */}
              <div className="print:mt-8">
                <RegionalComparisonSection valuationData={mapped.valuationData} property={mapped.property} theme={THEME_MODERN} />
              </div>
            </div>
          </div>

          {/* PAGE 2: POTENTIAL & STRATEGY */}
          <PrintPageWrapper className="print:justify-start">
            <PropertyPlanSection property={mapped.property} theme={THEME_MODERN} />
          </PrintPageWrapper>

          {/* PAGE 3: 6-STEP SALES SYSTEM */}
          <PrintPageWrapper className="print:justify-start">
            <SalesProcessSection steps={mapped.salesSteps} theme={THEME_MODERN} />
          </PrintPageWrapper>

          {/* PAGE 4: BENEFITS (Neden Kurumsal?) */}
          <PrintPageWrapper className="print:justify-start">
            <BenefitsSection benefits={mapped.salesBenefits} theme={THEME_MODERN} />
          </PrintPageWrapper>

          {/* PAGE 5: TRUST, FAQ & CLOSING */}
          <PrintPageWrapper className="print:justify-start">
            <div className="space-y-16 print:space-y-12 flex-grow flex flex-col justify-start">
              <FAQSection faqs={mapped.faqItems} theme={THEME_MODERN} />
              <ConsultantTrustSection consultant={mapped.consultant} theme={THEME_MODERN} />
            </div>

            <footer className="border-t border-white/5 py-8 flex flex-col items-center text-center bg-slate-950 mt-auto print:py-6 print:bg-transparent print:border-slate-300 print:mt-8">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 print:text-slate-800">Gizli ve Özel Ticari Bilgi İçerir</p>
              <p className="text-slate-400 font-medium text-sm mb-6 print:text-black">© 2024 RE/MAX Parla Gayrimenkul Danışmanlığı</p>

              <div className="flex flex-col items-center gap-2 opacity-70 print:opacity-100">
                <img
                  src="https://i.ibb.co/HLQpWmS0/Ekran-Al-nt-s.jpg"
                  alt="Pyrize"
                  className="h-5 w-auto object-contain mix-blend-multiply print:mix-blend-normal"
                />
                <a href="https://pyrize.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider print:text-slate-800">
                  powered by pyrize.com
                </a>
              </div>
            </footer>
          </PrintPageWrapper>
        </main>
      </div>
    </div>
  );
};

export default TemplateModernDetailedAnalysisWithPhotos;


