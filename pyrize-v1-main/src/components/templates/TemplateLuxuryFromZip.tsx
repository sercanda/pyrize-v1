'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum, Bolge, MulkBilgileri } from '@/types';
import { formatPriceRange } from '@/lib/utils/price';

import { HeroSection } from './portfoy-detayli-analiz-luks/components/HeroSection';
import { MarketIntelligenceReport } from './portfoy-detayli-analiz-luks/components/RegionalComparisonSection';
import { ExclusiveAdvantagesSection } from './portfoy-detayli-analiz-luks/components/PropertyFeaturesSection';
import { PortfolioAnalysisSection } from './portfoy-detayli-analiz-luks/components/LocationAdvantagesSection';
import { BespokeJourneySection } from './portfoy-detayli-analiz-luks/components/SalesStrategySection';
import { ExpertAdvisorSection } from './portfoy-detayli-analiz-luks/components/ConsultantTrustSection';
import { NextChapterSection } from './portfoy-detayli-analiz-luks/components/CTASection';
import { MarketAnalysisSection } from './shared/MarketAnalysisSection';
import { FaqSection } from './shared/FaqSection';

import type {
  Property,
  ValuationData,
  StrategicAdvantage,
  SalesSystemStep,
  Consultant,
  FaqItem,
} from './portfoy-detayli-analiz-luks/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80';

const BENEFIT_EMOJIS = ['🌟', '💼', '🌐', '🚀'];
const STEP_EMOJIS = ['①', '②', '③', '④'];
const STRENGTH_EMOJIS = ['🏆', '🤝', '📈', '🛡️'];

const splitLines = (value?: string | null): string[] =>
  (value || '')
    .split(/\r?\n||\u2028|\u2029/)
    .map((line) => line.replace(/^[•\-✅\s]+/, '').trim())
    .filter(Boolean);

const findBolge = (bolgeler: Bolge[] | undefined, tip: Bolge['tip']) =>
  bolgeler?.find((bolge) => bolge.tip === tip);

const parseNumber = (value?: string): number | null => {
  if (!value) return null;
  const numeric = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : null;
};

interface LuxuryTemplateData {
  property: Property;
  valuation: ValuationData;
  benefits: StrategicAdvantage[];
  steps: SalesSystemStep[];
  consultant: Consultant;
  faq: FaqItem[];
  heroDescription?: string;
  heroHighlight?: string;
  heroImage?: string;
  marketBolge?: Bolge;
  faqBolge?: Bolge;
}

const buildProperty = (
  data: OlusturulanSunum,
  locationHighlights: string[],
  usagePotential: string[],
  marketingPlan: { promotionStrategy: string; targetAudience: string; channels: string[] },
): Property => {
  const mulk = data.istek?.mulk;
  const konumString = typeof mulk?.konum === 'string' ? mulk.konum.trim() : '';
  const address = konumString || 'Belirtilmemiş Konum';
  const price =
    typeof mulk?.fiyat === 'number'
      ? mulk.fiyat
      : typeof mulk?.fiyatMax === 'number'
      ? mulk.fiyatMax
      : typeof mulk?.fiyatMin === 'number'
      ? mulk.fiyatMin
      : 0;
  const sqm = typeof mulk?.metrekare === 'number' ? mulk.metrekare : 0;
  const type = mulk?.tur ? mulk.tur.toUpperCase() : 'Lüks Portföy';

  const highlightChunks = locationHighlights.length ? locationHighlights : ['Prestijli konum', 'Ulaşım kolaylığı', 'Üst düzey sosyal olanaklar'];
  const usageChunks = usagePotential.length ? usagePotential : ['Lüks yaşam', 'Yüksek kira getirisi'];

  return {
    address,
    price,
    sqm,
    type,
    locationHighlights: [
      {
        icon: <span className="text-3xl" aria-hidden>📍</span>,
        category: 'Konum Avantajları',
        points: highlightChunks.slice(0, 4),
      },
      {
        icon: <span className="text-3xl" aria-hidden>🌆</span>,
        category: 'Yaşam Tarzı',
        points: usageChunks.slice(0, 4),
      },
    ],
    potential: usageChunks.slice(0, 2).map((item, idx) => ({
      title: item,
      description:
        idx === 0
          ? 'Mükemmel yaşam standardı sunan, ayrıcalıklı bir deneyim.'
          : 'Yatırım açısından istikrarlı ve döviz bazlı getirisi yüksek bir portföy.',
      icon: <span className="text-3xl" aria-hidden>{idx === 0 ? '🏡' : '📈'}</span>,
    })),
    marketingPlan,
  };
};

const buildConsultant = (data: OlusturulanSunum, strengthTexts: string[], awards: string[]): Consultant => {
  const danisman =
    data.istek?.danisman ?? {
      adSoyad: 'Danışman Bilgisi Eksik',
      telefon: '',
      email: '',
    };

  const gucler = (strengthTexts.length ? strengthTexts : ['Kurumsal ağ', 'Profesyonel müzakere', 'Yatırım uzmanlığı']).map(
    (text, idx) => ({
      icon: <span className="text-2xl" aria-hidden>{STRENGTH_EMOJIS[idx % STRENGTH_EMOJIS.length]}</span>,
      text,
    }),
  );

  return {
    adSoyad: danisman.adSoyad,
    unvan: danisman.deneyim || 'Lüks Konut Uzmanı',
    profilFotografiUrl:
      danisman.profilFotografi ||
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    ofisAdi: danisman.ofisAdi || 'PYRIZE Premium',
    ofisLogosuUrl: danisman.ofisLogosu || 'https://dummyimage.com/180x60/ffce47/111111&text=PYRIZE+PREMIUM',
    gucler,
    oduller: awards.length ? awards : splitLines(danisman.oduller),
    telefon: danisman.telefon,
    email: danisman.email,
  };
};

const mapLuxuryData = (data: OlusturulanSunum): LuxuryTemplateData => {
  const bolgeler = data.icerik.bolgeler || [];

  const locationAdvantageBolge = findBolge(bolgeler, 'location_advantages');
  const usagePotentialBolge = findBolge(bolgeler, 'usage_potential');
  const marketingBolge = findBolge(bolgeler, 'marketing_strategy');
  const targetAudienceBolge = findBolge(bolgeler, 'target_audience');
  const adChannelsBolge = findBolge(bolgeler, 'ad_channels');
  const cozumBolge = findBolge(bolgeler, 'cozum');
  const processBolge = findBolge(bolgeler, 'process');
  const guaranteeBolge = findBolge(bolgeler, 'guarantee');
  const heroBolge = findBolge(bolgeler, 'hero');
  const marketBolge = findBolge(bolgeler, 'market_analysis');
  const faqBolge = findBolge(bolgeler, 'faq');

  const locationHighlights = locationAdvantageBolge
    ? locationAdvantageBolge.altBolge?.flatMap((alt) => splitLines(alt.icerik)) ||
      splitLines(locationAdvantageBolge.icerik)
    : [];

  const usagePotential = usagePotentialBolge
    ? usagePotentialBolge.altBolge?.flatMap((alt) => splitLines(alt.icerik)) ||
      splitLines(usagePotentialBolge.icerik)
    : [];

  const marketing = (() => {
    const anaMesaj = marketingBolge?.altBolge?.find((alt) => /ana mesaj/i.test(alt.baslik));
    const vurgular = marketingBolge?.altBolge?.find((alt) => /vurgular/i.test(alt.baslik));
    const target = targetAudienceBolge?.altBolge?.map((alt) => `${alt.baslik}: ${alt.icerik}`).join(' ');
    const channels = adChannelsBolge?.altBolge?.[0]?.icerik
      ? splitLines(adChannelsBolge.altBolge[0].icerik)
      : splitLines(adChannelsBolge?.icerik);

    return {
      promotionStrategy:
        anaMesaj?.icerik || marketingBolge?.icerik || 'Prestij odaklı, niş kitleye yönelik pazarlama planı',
      targetAudience: target || 'Yüksek gelir grubu, yabancı profesyoneller, global yatırımcılar',
      channels: channels.length ? channels : ['Özel yatırımcı veritabanı', 'Uluslararası portallar', 'Özel davet etkinlikleri'],
    };
  })();

  const property = buildProperty(data, locationHighlights, usagePotential, marketing);

  const consultantStrengths = guaranteeBolge?.altBolge?.map((alt) => alt.baslik) || [];
  const consultantAwards = splitLines(guaranteeBolge?.icerik);
  const consultant = buildConsultant(data, consultantStrengths, consultantAwards);

  const benefits: StrategicAdvantage[] = cozumBolge?.altBolge
    ? cozumBolge.altBolge.map((alt, index) => {
        const [firstLine, ...rest] = splitLines(alt.icerik);
        return {
          icon: (
            <span className="text-4xl" aria-hidden>
              {BENEFIT_EMOJIS[index % BENEFIT_EMOJIS.length]}
            </span>
          ),
          title: alt.baslik,
          description: firstLine || alt.icerik,
          comparison: rest.join(' • '),
        };
      })
    : [
        {
          icon: <span className="text-4xl" aria-hidden>🌟</span>,
          title: 'Prestijli Tanıtım',
          description: 'Mülkünüz için özel, seçkin tanıtım stratejisi.',
          comparison: 'Özel davet ve portföy etkinlikleri',
        },
      ];

  const steps: SalesSystemStep[] = processBolge?.altBolge
    ? processBolge.altBolge.map((alt, index) => {
        const fullContent = alt.icerik || '';
        const lines = splitLines(fullContent);
        
        // "Sizin kazancınız:" veya "kazancınız" içeren satırı bul
        let kazan = '';
        const actions: string[] = [];
        
        lines.forEach((line) => {
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes('kazancınız') || lowerLine.includes('kazanç') || lowerLine.includes('sizin için')) {
            // "Sizin kazancınız:" veya benzeri etiketleri temizle
            kazan = line
              .replace(/^(sizin\s+)?(kazancınız|kazanç|için\s+anlamı)[:：]?\s*/i, '')
              .replace(/^[💰💡🤝✅🎯]\s*/, '')
              .trim();
          } else if (line.trim()) {
            actions.push(line);
          }
        });
        
        // Eğer kazanç bulunamadıysa, aşamaya göre default değer ver
        if (!kazan) {
          const defaultKazanc: Record<number, string> = {
            0: 'Mülkünüzün pazara en güçlü şekilde çıkmasını sağlayarak ilk izlenimde fark yaratıyoruz.',
            1: 'Mülkünüzün potansiyel alıcılar tarafından en yüksek görünürlüğe ulaşmasını sağlıyoruz.',
            2: 'Müzakere sürecindeki uzmanlığımızla mülkünüzden maksimum kazancı elde etmenizi sağlıyoruz.',
            3: 'Sürecin son aşamasında hukuki ve idari işlemleri sizin için yöneterek stresi ortadan kaldırıyoruz.',
          };
          kazan = defaultKazanc[index] || 'Profesyonel yönetim ile maksimum değer hedefi.';
        }
        
        // Eğer actions boşsa, default değerler ver
        const finalActions = actions.length > 0 ? actions : [
          index === 0 ? 'Detaylı mülk analizi ve değerleme' : '',
          index === 1 ? 'Tüm büyük emlak portallarında listeleme' : '',
          index === 2 ? 'Gelen tekliflerin filtrelenmesi ve analizi' : '',
          index === 3 ? 'Satış sözleşmesinin hazırlanması ve kontrolü' : '',
        ].filter(Boolean);
        
        return {
          icon: <span className="text-lg font-semibold" aria-hidden>{STEP_EMOJIS[index % STEP_EMOJIS.length]}</span>,
          gun: `Aşama ${index + 1}`,
          baslik: alt.baslik,
          neYapiyoruz: finalActions,
          kazanciniz: kazan,
        };
      })
    : [
        {
          icon: <span className="text-lg font-semibold" aria-hidden>①</span>,
          gun: 'Aşama 1',
          baslik: 'Prestij hazırlığı',
          neYapiyoruz: ['Portföy analizi', 'Prestijli tanıtım içerikleri'],
          kazanciniz: 'Mülkünüzün pazara en güçlü şekilde çıkmasını sağlayarak ilk izlenimde fark yaratıyoruz.',
        },
        {
          icon: <span className="text-lg font-semibold" aria-hidden>②</span>,
          gun: 'Aşama 2',
          baslik: 'Maksimum erişim',
          neYapiyoruz: ['Tüm büyük emlak portallarında listeleme', 'Hedefli alıcı veritabanına özel sunum'],
          kazanciniz: 'Mülkünüzün potansiyel alıcılar tarafından en yüksek görünürlüğe ulaşmasını sağlıyoruz.',
        },
        {
          icon: <span className="text-lg font-semibold" aria-hidden>③</span>,
          gun: 'Aşama 3',
          baslik: 'Müzakere ve teklif yönetimi',
          neYapiyoruz: ['Gelen tekliflerin filtrelenmesi ve analizi', 'Sizin adınıza profesyonel müzakerelerin yürütülmesi'],
          kazanciniz: 'Müzakere sürecindeki uzmanlığımızla mülkünüzden maksimum kazancı elde etmenizi sağlıyoruz.',
        },
        {
          icon: <span className="text-lg font-semibold" aria-hidden>④</span>,
          gun: 'Aşama 4',
          baslik: 'Kapanış ve sonuçlandırma',
          neYapiyoruz: ['Satış sözleşmesinin hazırlanması ve kontrolü', 'Tapu işlemleri sürecinde tam destek'],
          kazanciniz: 'Sürecin son aşamasında hukuki ve idari işlemleri sizin için yöneterek stresi ortadan kaldırıyoruz.',
        },
      ];

  const comparables = data.icerik.detayliDegerleme?.comparables || [];
  const fallbackAvg = property.sqm > 0 ? Math.round(property.price / property.sqm) : 120000;
  const averagePricePerSqm = (() => {
    const values = comparables
      .map((comp) => parseNumber(comp.pricePerSqm))
      .filter((v): v is number => v !== null);
    if (values.length === 0) return fallbackAvg;
    return Math.round(values.reduce((sum, item) => sum + item, 0) / values.length);
  })();

  const valuation: ValuationData = {
    averagePricePerSqm,
    priceTrend:
      data.icerik.detayliDegerleme?.marketSnapshots?.[0]?.trendLabel
        ? parseInt(data.icerik.detayliDegerleme.marketSnapshots[0].trendLabel.replace(/[^0-9-]/g, ''), 10) || 12
        : 12,
    rentalYield: 4.8,
    regionalCompetitors: comparables.length
      ? comparables.map((comp) => ({
          address: comp.address,
          price: parseNumber(comp.price) || property.price,
          sqm: parseNumber(comp.size) || property.sqm,
          url: '#',
        }))
      : [
          { address: `${property.address} Rakip 1`, price: property.price * 0.95, sqm: property.sqm, url: '#' },
          { address: `${property.address} Rakip 2`, price: property.price * 1.05, sqm: property.sqm, url: '#' },
        ],
  };

  const faq: FaqItem[] = guaranteeBolge?.altBolge
    ? guaranteeBolge.altBolge.map((alt) => ({
        question: alt.baslik,
        answer: alt.icerik,
      }))
    : [
        {
          question: 'Hizmet bedeli ne zaman tahsil edilir?',
          answer:
            'Sadece satış başarıyla sonuçlandığında, yasal oranda hizmet bedeli tahsil edilir. Süreç boyunca hiçbir peşin ödeme alınmaz.',
        },
        {
          question: 'Satış sürecini nasıl raporluyorsunuz?',
          answer:
            'Haftalık performans raporu, alıcı geri bildirimleri ve strateji güncellemeleri ile süreci şeffaf biçimde yönetiyoruz.',
        },
      ];

  const heroDescription =
    data.icerik.heroAciklama || heroBolge?.icerik ||
    'Lüks portföyünüz için hazırladığımız stratejik raporla, doğru kitleye ulaşarak maksimum değeri hedefliyoruz.';

  const priceRangeHighlight = data.istek?.mulk
    ? formatPriceRange(data.istek.mulk as MulkBilgileri)
    : undefined;
  const heroHighlight =
    priceRangeHighlight
      ? `Fiyat Aralığı: ${priceRangeHighlight}`
      : benefits[0]?.comparison || benefits[0]?.description;
  const heroImage = (data.istek?.mulk as any)?.fotograflar?.[0] || FALLBACK_IMAGE;

  return {
    property,
    valuation,
    benefits,
    steps,
    consultant,
    faq,
    heroDescription,
    heroHighlight,
    heroImage,
    marketBolge,
    faqBolge,
  };
};

const TemplateLuxuryFromZip: React.FC<{ data: OlusturulanSunum }> = ({ data }) => {
  const mapped = useMemo(() => mapLuxuryData(data), [data]);

  return (
    <div className="bg-[#111111] text-gray-300 antialiased">
      <main>
        <HeroSection
          property={mapped.property}
          heroDescription={mapped.heroDescription}
          heroHighlight={mapped.heroHighlight}
          heroImage={mapped.heroImage}
        />
        <MarketIntelligenceReport valuationData={mapped.valuation} property={mapped.property} />
        <MarketAnalysisSection bolge={mapped.marketBolge} theme="dark" />
        <ExclusiveAdvantagesSection benefits={mapped.benefits} />
        <PortfolioAnalysisSection property={mapped.property} faq={mapped.faq} />
        <BespokeJourneySection steps={mapped.steps} />
        <ExpertAdvisorSection consultant={mapped.consultant} />
        <FaqSection bolge={mapped.faqBolge} theme="dark" />
        <NextChapterSection consultant={mapped.consultant} />
      </main>
    </div>
  );
};

export default TemplateLuxuryFromZip;
