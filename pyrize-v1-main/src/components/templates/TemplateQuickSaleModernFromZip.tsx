'use client';

import React, { useMemo } from 'react';
import { ReactElement } from 'react';
import { OlusturulanSunum, Bolge } from '@/types';
import { formatPriceRange } from '@/lib/utils/price';
import { getNUTS2RegionCode } from '@/lib/utils/kfe';
import {
  Rocket,
  Target,
  Megaphone,
  Globe,
  Sparkles,
  LineChart,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { HeroSection } from './portfoy-hizli-satis-modern/components/HeroSection';
import { BenefitsSection } from './portfoy-hizli-satis-modern/components/PropertyFeaturesSection';
import { DigitalMarketingPowerSection } from './portfoy-hizli-satis-modern/components/UsagePotentialSection';
import { PropertyPlanSection } from './portfoy-hizli-satis-modern/components/LocationAdvantagesSection';
import { RegionalComparisonSection } from './portfoy-hizli-satis-modern/components/RegionalComparisonSection';
import { SalesProcessSection } from './portfoy-hizli-satis-modern/components/SalesStrategySection';
import { ConsultantTrustSection } from './portfoy-hizli-satis-modern/components/ConsultantTrustSection';
import { FAQSection } from './portfoy-hizli-satis-modern/components/FAQSection';
import { CTASection } from './portfoy-hizli-satis-modern/components/CTASection';
import {
  Property,
  Consultant,
  SalesBenefit,
  SalesSystemStep,
  ConsultantStrength,
  DigitalMarketingTool,
  FAQItem,
  RegionalData,
} from './portfoy-hizli-satis-modern/types';

const splitLines = (value?: string | null): string[] =>
  (value || '')
    .split(/\r?\n||\u2028|\u2029/)
    .map((line) => line.replace(/^[•\-✅\s]+/, '').trim())
    .filter(Boolean);

const parseList = (value?: string): string[] =>
  splitLines(value)
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean);

const parseNumber = (value?: string): number | null => {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const iconFrom = (element: ReactElement) => element;

const buildConsultantStrengths = (items: string[]): ConsultantStrength[] => {
  const icons = [Sparkles, ShieldCheck, LineChart, Users];
  return items.length
    ? items.map((text, index) => ({
        icon: iconFrom(
          React.createElement(icons[index % icons.length], {
            className: 'h-8 w-8 text-indigo-300',
          })
        ),
        text,
      }))
    : [
        {
          icon: iconFrom(<Sparkles className="h-8 w-8 text-indigo-300" />),
          text: 'Stratejik Pazarlama',
        },
        {
          icon: iconFrom(<LineChart className="h-8 w-8 text-indigo-300" />),
          text: 'Veriye Dayalı Fiyatlama',
        },
        {
          icon: iconFrom(<ShieldCheck className="h-8 w-8 text-indigo-300" />),
          text: 'Şeffaf Süreç Yönetimi',
        },
      ];
};

const parseCurrencyValue = (value?: string | number | null): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') return parseNumber(value);
  return null;
};

const getMonthLabel = (offset: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - offset);
  return date
    .toLocaleString('tr-TR', {
      month: 'short',
    })
    .replace('.', '');
};

export const mapQuickSaleData = (data: OlusturulanSunum) => {
  const bolgeler = data.icerik.bolgeler || [];

  const findBolge = (tip: Bolge['tip']) => bolgeler.find((bolge) => bolge.tip === tip);

  const locationAdvantagesBolge = findBolge('location_advantages');
  const usagePotentialBolge = findBolge('usage_potential');
  const targetAudienceBolge = findBolge('target_audience');
  const marketingBolge = findBolge('marketing_strategy');
  const adChannelsBolge = findBolge('ad_channels');
  const valuePlanBolge = findBolge('value_plan');
  const guaranteeBolge = findBolge('guarantee');
  const cozumBolge = findBolge('cozum');
  const processBolge = findBolge('process');
  const faqBolge = findBolge('faq');
  const heroBolge = findBolge('hero');

  const locationAdvantages =
    locationAdvantagesBolge?.altBolge?.flatMap((alt) => splitLines(alt.icerik)) ||
    splitLines(locationAdvantagesBolge?.icerik) ||
    [];

  const usagePotential =
    usagePotentialBolge?.altBolge?.flatMap((alt) => splitLines(alt.icerik)) ||
    splitLines(usagePotentialBolge?.icerik) ||
    [];

  const targetAudience =
    targetAudienceBolge?.altBolge?.map((alt) => ({
      baslik: alt.baslik,
      aciklama: alt.icerik,
    })) || [];

  const marketing = (() => {
    const anaMesaj = marketingBolge?.altBolge?.find((alt) => /ana mesaj/i.test(alt.baslik));
    const vurgular = marketingBolge?.altBolge?.find((alt) => /vurgular/i.test(alt.baslik));
    const gorsel = marketingBolge?.altBolge?.find((alt) => /görsel|görsel/i.test(alt.baslik));
    return {
      anaMesaj: anaMesaj?.icerik || marketingBolge?.icerik || 'Stratejik dijital pazarlama kampanyası',
      vurgular: vurgular ? splitLines(vurgular.icerik) : ['Premium tanıtım', 'Yüksek erişim', 'Hızlı dönüş'],
      gorselIcerikPlani:
        gorsel?.icerik ||
        'Drone çekimleri, 4K video, hedefli reklam görselleri ve yatırımcı bültenleri ile desteklenen prodüksiyon.',
    };
  })();

  const valuePlan = (() => {
    const fiyat = valuePlanBolge?.altBolge?.find((alt) => /fiyat/i.test(alt.baslik));
    const sure = valuePlanBolge?.altBolge?.find((alt) => /süre|sure/i.test(alt.baslik));
    const ilgi = valuePlanBolge?.altBolge?.find((alt) => /ilgi|talep/i.test(alt.baslik));
    return {
      fiyatStratejisi:
        fiyat?.icerik || 'Veriye dayalı fiyatlandırma ve yatırımcı teklif stratejisi ile maksimum gelir hedefi.',
      hedefSatisSuresi: sure?.icerik || '30-45 gün',
      tahminiIlgi: ilgi?.icerik || 'İlk 72 saatte 10+ nitelikli talep',
    };
  })();

  const adChannels =
    adChannelsBolge?.altBolge?.[0]?.icerik
      ? parseList(adChannelsBolge.altBolge[0].icerik)
      : parseList(adChannelsBolge?.icerik);

  // Standart reklam kanalları - her zaman sabit
  const standardAdChannels = [
    'Sahibinden Vitrin İlan',
    'Emlakjet Premium Paket',
    'Facebook & Instagram Reklamları',
    'Google Ads (Arama + Display)',
    'YouTube Video Reklamları',
  ];

  const { istek, icerik } = data;
  const mulk = istek.mulk;
  const konumString = typeof mulk.konum === 'string' ? mulk.konum.trim() : '';
  const konumParts = konumString ? konumString.split(',').map((part) => part.trim()) : [];
  const il = konumParts[0] || '';
  const ilce = konumParts[1] || '';
  const mahalle = konumParts.slice(2).join(', ');

  const property: Property = {
    gorselUrl: (mulk as any)?.fotograflar?.[0] || 'https://picsum.photos/1920/1080?random=1',
    planBaslik: icerik.baslik || `${konumString} - Aksiyon Planı`,
    planAltBaslik:
      icerik.altBaslik ||
      [konumString || undefined, mulk.metrekare ? `${mulk.metrekare} m²` : undefined, formatPriceRange(mulk)]
        .filter(Boolean)
        .join(' • '),
    konumAnalizi: {
      ilIlce: ilce ? `${il} / ${ilce}` : il || 'Belirtilmemiş Konum',
      mahalle: mahalle || ilce || il || 'Belirtilmemiş Konum',
      ozellik: mulk.tur ? mulk.tur.toUpperCase() : 'Gayrimenkul',
      mevcutYapi: mulk.metrekare
        ? `${mulk.metrekare.toLocaleString('tr-TR')} m² • ${mulk.odaSayisi || 'Planlanabilir alan'}`
        : mulk.odaSayisi || 'Planlanabilir Alan',
    },
    konumAvantajlari: locationAdvantages,
    kullanimPotensiyeli: usagePotential,
    hedefKitle:
      targetAudience.length > 0
        ? targetAudience
        : [
            {
              baslik: 'Yatırımcılar',
              aciklama: 'Yüksek getirili portföy arayan stratejik yatırımcılar.',
            },
            {
              baslik: 'Hızlı Karar Alan Alıcılar',
              aciklama: 'Hazır projeyi hızlıca devralmak isteyen karar vericiler.',
            },
          ],
    tanitimStratejisi: marketing,
    satisPlani: valuePlan,
    // Standart reklam kanalları - her zaman sabit
    reklamKanallari: standardAdChannels,
  };

  const benefitIcons = [Rocket, Target, Megaphone];
  const salesBenefits: SalesBenefit[] = cozumBolge?.altBolge
    ? cozumBolge.altBolge.map((alt, index) => {
        const [firstLine, ...rest] = splitLines(alt.icerik);
        const Icon = benefitIcons[index % benefitIcons.length];
        return {
          icon: iconFrom(<Icon className="h-10 w-10 text-indigo-400" />),
          title: alt.baslik,
          description: firstLine || alt.icerik,
          comparison: rest.join(' • ') || 'Profesyonel satış avantajı',
        };
      })
    : [
        {
          icon: iconFrom(<Rocket className="h-10 w-10 text-indigo-400" />),
          title: 'Stratejik & Hızlı Pazarlama',
          description: 'Doğru alıcıya en hızlı şekilde ulaşma',
          comparison: 'Vs. bireysel: Aylar süren belirsizlik',
        },
      ];

  const salesSteps: SalesSystemStep[] = processBolge?.altBolge
    ? processBolge.altBolge.map((alt, index) => {
        const segments = alt.icerik.split(/\n\s*\n/);
        const actions: string[] = [];
        let kazan = '';
        let maliyetNotu: string | undefined;
        let ucretNotu: string | undefined;

        segments.forEach((segment) => {
          if (/ne yapıyorum/i.test(segment)) {
            actions.push(...splitLines(segment.split(/ne yapıyorum[:]?/i)[1]));
          } else if (/kazancınız|kazanç/i.test(segment)) {
            kazan = splitLines(segment.split(/kazancınız[:]?/i)[1]).join(' ');
          } else if (/maliyet/i.test(segment)) {
            maliyetNotu = splitLines(segment).join(' ');
          } else if (/ücret|ucret/i.test(segment)) {
            ucretNotu = splitLines(segment).join(' ');
          }
        });

        return {
          icon: iconFrom(
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              {index + 1}
            </span>
          ),
          gun: `Aşama ${index + 1}`,
          baslik: alt.baslik,
          neYapiyorum: actions.length ? actions : splitLines(alt.icerik),
          sizinKazanciniz:
            kazan || 'Sürecin her adımında şeffaf raporlama ve maksimum gelir için profesyonel yönetim.',
          maliyetNotu,
          ucretNotu,
        };
      })
    : [
        {
          icon: iconFrom(<span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">1</span>),
          gun: 'Aşama 1',
          baslik: 'Strateji & Planlama',
          neYapiyorum: ['Detaylı piyasa analizi', 'Hedef kitle belirleme', 'Doğru fiyatlama'],
          sizinKazanciniz: 'Rastgele değil, veriye dayalı güçlü bir başlangıç.',
        },
      ];

  const consultantStrengthsRaw =
    guaranteeBolge?.altBolge?.map((alt) => alt.baslik).filter(Boolean) ||
    splitLines(guaranteeBolge?.icerik);

  const deneyimRaw: string = istek.danisman.deneyim || '';
  const deneyimNumber = (() => {
    const match = deneyimRaw.match(/\d+/);
    return match ? match[0] : null;
  })();
  const uzmanBolge = ilce || il || 'Bölge';

  const consultant: Consultant = {
    adSoyad: istek.danisman.adSoyad,
    unvan: 'Gayrimenkul Danışmanı',
    tagline: `Lisanslı • ${deneyimNumber ? `${deneyimNumber} deneyim` : '+3 yıl deneyim'} • ${uzmanBolge} uzmanı`,
    telefon: istek.danisman.telefon,
    email: istek.danisman.email,
    profilFotografiUrl:
      istek.danisman.profilFotografi ||
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    ofisLogosuUrl:
      istek.danisman.ofisLogosu ||
      'https://dummyimage.com/200x80/4f46e5/ffffff&text=PYRIZE',
    ofisAdi: istek.danisman.ofisAdi || 'PYRIZE Danışmanlık',
    oduller: splitLines(istek.danisman.oduller) || ['Platinum Club', 'Yılın Danışmanı'],
    gucler: buildConsultantStrengths(consultantStrengthsRaw),
  };

  const digitalMarketingTools: DigitalMarketingTool[] = (property.reklamKanallari.slice(0, 4) || []).map(
    (kanal, index) => {
      const icons = [Megaphone, Rocket, Globe, Target];
      const Icon = icons[index % icons.length];
      return {
        icon: iconFrom(<Icon className="h-10 w-10 text-indigo-400" />),
        title: kanal,
        description: 'Yüksek görünürlük ve nitelikli talep için özel kampanya.',
      };
    }
  );

  const faqItems: FAQItem[] =
    faqBolge?.altBolge?.map((alt) => ({
      question: alt.baslik,
      answer: alt.icerik,
    })) ||
    DEFAULT_FAQ;

  const guarantees =
    guaranteeBolge?.altBolge?.map((alt) => alt.icerik).filter(Boolean) || [
      'Sonuç yoksa masraf yok',
      'Tüm pazarlama ücretsiz',
      'Hizmet bedeli sadece satışta',
    ];

  const heroDescription =
    data.icerik.heroAciklama || heroBolge?.icerik || 'Hızlı satış stiliyle en yüksek değere odaklanan aksiyon planı.';

  const priceHighlight = formatPriceRange(mulk);
  const heroHighlight =
    priceHighlight || (property.reklamKanallari.length ? property.reklamKanallari[0] : guarantees[0]);

  const priceValue =
    parseCurrencyValue((mulk as any)?.fiyat) ??
    parseCurrencyValue((mulk as any)?.fiyatMax) ??
    parseCurrencyValue((mulk as any)?.fiyatMin);

  const metrekareValue =
    typeof mulk.metrekare === 'number'
      ? mulk.metrekare
      : typeof mulk.metrekare === 'string'
      ? parseNumber(mulk.metrekare) || null
      : null;

  const sqmPrice =
    priceValue && metrekareValue
      ? Math.max(1, Math.round(priceValue / metrekareValue))
      : priceValue
      ? Math.max(1, Math.round(priceValue / 100))
      : null;

  // KFE verilerini çek - önce icerik'te varsa onu kullan, yoksa hesapla
  const kfeDataFromIcerik = (data.icerik as any)?.kfeData;
  const regionCode = kfeDataFromIcerik?.bolge?.regionCode || getNUTS2RegionCode(mulk.konum);
  
  // Client-side'da KFE verilerini okuyamayız (server-only), bu yüzden icerik'ten gelen veriyi kullan
  const kfeData = kfeDataFromIcerik || {
    turkiye: { duzey: null, yillikDegisim: null, ytdDegisim: null },
    bolge: { duzey: null, yillikDegisim: null, ytdDegisim: null, regionCode },
  };
  
  const kfeYillikDegisim = kfeData.bolge.yillikDegisim;
  const kfeYtdDegisim = kfeData.bolge.ytdDegisim;
  const turkiyeYillikDegisim = kfeData.turkiye.yillikDegisim;

  // Son 6 ay trend verisi (KFE'den) - icerik'ten gelen trend verisini kullan
  const kfeTrendDataFromIcerik = kfeDataFromIcerik?.trendData || [];
  const trendDataFromKFE = kfeTrendDataFromIcerik.length >= 6
    ? kfeTrendDataFromIcerik.slice(-6).map((item: any, index: number) => ({
        name: getMonthLabel(5 - index),
        'Fiyat Endeksi': item.deger,
      }))
    : Array.from({ length: 6 }).map((_, index) => {
        const offset = 5 - index;
        // KFE verisi yoksa, mülk fiyatından tahmin et
        const baseIndex = sqmPrice ? Math.round(sqmPrice / 1000) + 90 : 100;
        return {
          name: getMonthLabel(offset),
          'Fiyat Endeksi': baseIndex + index * 3,
        };
      });

  // Bölge ortalaması hesaplama - KFE verisi varsa kullan
  const regionalAverage = (() => {
    if (sqmPrice) {
      // KFE yıllık değişim varsa, bunu kullanarak daha doğru hesapla
      if (kfeYillikDegisim !== null && kfeYillikDegisim > 0) {
        // Mülk fiyatını KFE artış oranına göre ayarla
        const adjustedPrice = sqmPrice / (1 + kfeYillikDegisim / 100);
        return Math.round(adjustedPrice * 0.9);
      }
      return Math.round(sqmPrice * 0.9);
    }
    // KFE verisi yoksa varsayılan
    return 65000;
  })();

  // Karşılaştırma verileri - KFE'ye göre dinamik
  const comparisonData = [
    {
      name: ilce ? `${ilce} m² Fiyatı` : 'Bölge m² Fiyatı',
      'Bölge Ortalaması': regionalAverage,
      'Sizin Mülkünüz': sqmPrice ?? Math.round(regionalAverage * 1.08),
    },
  ];

  // KFE verisi varsa daha detaylı karşılaştırma ekle
  if (kfeYillikDegisim !== null) {
    const premiumMultiplier = kfeYillikDegisim > turkiyeYillikDegisim! ? 1.12 : 1.08;
    comparisonData.push(
      {
        name: 'Premium Sahil Çizgisi',
        'Bölge Ortalaması': Math.round(regionalAverage * 1.03),
        'Sizin Mülkünüz': Math.round((sqmPrice ?? regionalAverage) * premiumMultiplier),
      },
      {
        name: 'Yeni Proje Benchmark',
        'Bölge Ortalaması': Math.round(regionalAverage * 1.05),
        'Sizin Mülkünüz': Math.round((sqmPrice ?? regionalAverage) * (premiumMultiplier + 0.03)),
      }
    );
  } else {
    // KFE verisi yoksa varsayılan değerler
    comparisonData.push(
      {
        name: 'Premium Sahil Çizgisi',
        'Bölge Ortalaması': Math.round(regionalAverage * 1.03),
        'Sizin Mülkünüz': Math.round((sqmPrice ?? regionalAverage) * 1.12),
      },
      {
        name: 'Yeni Proje Benchmark',
        'Bölge Ortalaması': Math.round(regionalAverage * 1.05),
        'Sizin Mülkünüz': Math.round((sqmPrice ?? regionalAverage) * 1.15),
      }
    );
  }

  const regionalData: RegionalData = {
    comparisonData,
    trendData: trendDataFromKFE,
    // KFE metrikleri ekle
    kfeMetrics: kfeYillikDegisim !== null ? {
      bolgeYillikDegisim: kfeYillikDegisim,
      bolgeYtdDegisim: kfeYtdDegisim ?? null,
      turkiyeYillikDegisim: turkiyeYillikDegisim ?? null,
      regionCode,
    } : undefined,
  };

  return {
    property,
    salesBenefits,
    salesSteps,
    digitalMarketingTools: digitalMarketingTools.length
      ? digitalMarketingTools
      : [
          {
            icon: iconFrom(<Megaphone className="h-10 w-10 text-indigo-400" />),
            title: 'Hedefli Sosyal Medya',
            description: 'Facebook & Instagram’da hedef kitle odaklı reklamlar.',
          },
        ],
    consultant,
    faqItems,
    guarantees,
    heroDescription,
    heroHighlight,
    regionalData,
  };
};

const DEFAULT_FAQ: FAQItem[] = [
  {
    question: 'Hizmet bedeli ne zaman ödeniyor?',
    answer: 'Satış gerçekleştiğinde tapu devrinde tahsil edilir, satış olmazsa hiçbir ücret ödemezsiniz.',
  },
  {
    question: 'Pazarlama masraflarını kim karşılıyor?',
    answer: 'Tüm profesyonel çekim, ilan ve reklam harcamaları danışman tarafından karşılanır.',
  },
  {
    question: 'Satış süreci ne kadar sürer?',
    answer: 'Piyasa koşullarına bağlı olmakla birlikte hedefimiz 30-45 gün içinde sonuç almak.',
  },
  {
    question: 'Süreci nasıl takip edebilirim?',
    answer: 'Haftalık raporlar ve gerçek zamanlı CRM güncellemeleri ile süreç şeffaf şekilde iletilir.',
  },
];

const TemplateQuickSaleModernFromZip: React.FC<{ data: OlusturulanSunum }> = ({ data }) => {
  const mapped = useMemo(() => mapQuickSaleData(data), [data]);

  return (
    <div className="bg-gray-900 text-gray-300 antialiased">
      <main>
        <HeroSection property={mapped.property} heroDescription={mapped.heroDescription} heroHighlight={mapped.heroHighlight} />
        <BenefitsSection benefits={mapped.salesBenefits} />
        <DigitalMarketingPowerSection tools={mapped.digitalMarketingTools} />
        <PropertyPlanSection property={mapped.property} />
        {mapped.regionalData && (
          <RegionalComparisonSection property={mapped.property} regionalData={mapped.regionalData} />
        )}
        <SalesProcessSection steps={mapped.salesSteps} />
        <ConsultantTrustSection consultant={mapped.consultant} />
        <FAQSection faqs={mapped.faqItems} />
        <CTASection consultant={mapped.consultant} guarantees={mapped.guarantees} />
      </main>
    </div>
  );
};

export default TemplateQuickSaleModernFromZip;

