'use client';

import React, { useMemo } from 'react';
import { OlusturulanSunum, Bolge } from '@/types';

import { HeroSection } from './portfoy-detayli-analiz-kurumsal/components/HeroSection';
import { RegionalComparisonSection } from './portfoy-detayli-analiz-kurumsal/components/RegionalComparisonSection';
import { BenefitsSection } from './portfoy-detayli-analiz-kurumsal/components/PropertyFeaturesSection';
import { SalesProcessSection } from './portfoy-detayli-analiz-kurumsal/components/SalesStrategySection';
import { PropertyPlanSection } from './portfoy-detayli-analiz-kurumsal/components/LocationAdvantagesSection';
import { UsagePotentialSection } from './portfoy-detayli-analiz-kurumsal/components/UsagePotentialSection';
import { ConsultantTrustSection } from './portfoy-detayli-analiz-kurumsal/components/ConsultantTrustSection';
import { CTASection } from './portfoy-detayli-analiz-kurumsal/components/CTASection';
import { MarketAnalysisSection } from './shared/MarketAnalysisSection';
import { FaqSection } from './shared/FaqSection';

import type {
  Property,
  Consultant,
  ValuationData,
  StrategicAdvantage,
  SalesSystemStep,
  ConsultantStrength,
} from './portfoy-detayli-analiz-kurumsal/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&auto=compress&fit=crop';

const BENEFIT_EMOJIS = ['🚀', '📊', '🛡️', '🤝'];
const STRENGTH_EMOJIS = ['🏆', '🤝', '📈', '🛡️'];

const stepIcon = (index: number) => (
  <span className="font-semibold text-sm text-white">{index + 1}</span>
);

const benefitIcon = (index: number) => (
  <span className="text-3xl" aria-hidden>
    {BENEFIT_EMOJIS[index % BENEFIT_EMOJIS.length]}
  </span>
);

const strengthIcon = (index: number) => (
  <span className="text-2xl" aria-hidden>
    {STRENGTH_EMOJIS[index % STRENGTH_EMOJIS.length]}
  </span>
);

const splitLines = (value?: string | null): string[] =>
  (value || '')
    .split(/\r?\n||\u2028|\u2029/)
    .map((line) => line.replace(/^[•\-✅\s]+/, '').trim())
    .filter(Boolean);

const formatCurrency = (value?: number): string | undefined =>
  typeof value === 'number' ? `${value.toLocaleString('tr-TR')} TL` : undefined;

const formatMetrekare = (value?: number): string | undefined =>
  typeof value === 'number' ? `${value.toLocaleString('tr-TR')} m²` : undefined;

const findBolge = (bolgeler: Bolge[] | undefined, tip: Bolge['tip']) =>
  bolgeler?.find((bolge) => bolge.tip === tip);

interface CorporateTemplateData {
  property: Property;
  consultant: Consultant;
  valuation: ValuationData;
  salesBenefits: StrategicAdvantage[];
  salesSteps: SalesSystemStep[];
  heroDescription?: string;
  heroHighlight?: string;
  reportDate: string;
  marketBolge?: Bolge;
  faqBolge?: Bolge;
}

const createProperty = (
  data: OlusturulanSunum,
  locationAdvantagesFromTemplate: string[],
  usagePotentialFromTemplate: string[],
  targetAudienceFromTemplate: { baslik: string; aciklama: string }[],
  marketing: { anaMesaj: string; vurgular: string[]; gorselIcerikPlani: string },
  valuePlan: { fiyatStratejisi: string; hedefSatisSuresi: string; tahminiIlgi: string },
  adChannels: string[],
): Property => {
  const { istek, icerik } = data;
  const mulk = istek?.mulk;
  const konumString = typeof mulk?.konum === 'string' ? mulk.konum.trim() : '';
  const konumParts = konumString
    ? konumString.split(',').map((item) => item.trim())
    : [];
  const il = konumParts[0] ?? '';
  const ilce = konumParts[1] ?? '';
  const mahalle = konumParts.slice(2).join(', ');
  const planAltBaslikParts = [
    konumString || undefined,
    formatMetrekare(mulk?.metrekare),
    formatCurrency(mulk?.fiyat),
  ].filter(Boolean) as string[];
  const computedPlanAltBaslik =
    icerik.altBaslik ||
    (planAltBaslikParts.length ? planAltBaslikParts.join(' • ') : 'Konum bilgisi paylaşılmadı');
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
  const mevcutYapi =
    formatMetrekare(mulk?.metrekare) || (mulk?.odaSayisi ? `${mulk.odaSayisi} oda` : 'Belirtilmemiş');

  return {
    gorselUrl: (mulk as any)?.fotograflar?.[0] || FALLBACK_IMAGE,
    planBaslik:
      icerik.baslik || (konumString ? `${konumString} - Özel Analiz Raporu` : 'Özel Analiz Raporu'),
    planAltBaslik: computedPlanAltBaslik,
    konumAnalizi: {
      ilIlce: ilce ? `${il} / ${ilce}` : il || 'Belirtilmemiş Konum',
      mahalle: mahalle || ilce || il || 'Belirtilmemiş Konum',
      ozellik:
        propertyType,
      mevcutYapi: mevcutYapi,
    },
    konumAvantajlari:
      splitLines(mulk?.konumAvantajlari).length > 0
        ? splitLines(mulk?.konumAvantajlari)
        : locationAdvantagesFromTemplate,
    kullanimPotensiyeli:
      splitLines(mulk?.kullanimPotansiyeli).length > 0
        ? splitLines(mulk?.kullanimPotansiyeli)
        : usagePotentialFromTemplate,
    hedefKitle:
      targetAudienceFromTemplate.length > 0
        ? targetAudienceFromTemplate
        : [
            {
              baslik: 'Yatırımcılar',
              aciklama:
                'Bölgedeki değer artışı ve kiralama potansiyelini değerlendirmek isteyen yatırımcılar.',
            },
          ],
    tanitimStratejisi: marketing,
    satisPlani: valuePlan,
    reklamKanallari:
      adChannels.length > 0
        ? adChannels
        : ['Sahibinden', 'Emlakjet', 'Kurumsal CRM', 'Dijital Reklam'],
  };
};

const createConsultant = (
  data: OlusturulanSunum,
  strengthTexts: string[],
  awards: string[],
): Consultant => {
  const danisman =
    data.istek?.danisman ?? {
      adSoyad: 'Danışman Bilgisi Eksik',
      telefon: '',
      email: '',
    };

  const strengths: ConsultantStrength[] = strengthTexts.length
    ? strengthTexts.map((text, index) => ({
        icon: <span className="text-xl" aria-hidden>{STRENGTH_EMOJIS[index % STRENGTH_EMOJIS.length]}</span>,
        text,
      }))
    : [
        { icon: strengthIcon(0), text: 'Profesyonel pazarlama ve satış yönetimi' },
        { icon: strengthIcon(1), text: 'Şeffaf raporlama ve iletişim' },
      ];

  const consultantAwards = awards.length
    ? awards
    : splitLines(danisman.oduller);

  return {
    adSoyad: danisman.adSoyad,
    unvan: danisman.deneyim || 'Profesyonel Emlak Danışmanı',
    telefon: danisman.telefon,
    email: danisman.email,
    profilFotografiUrl:
      danisman.profilFotografi ||
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    ofisLogosuUrl:
      danisman.ofisLogosu ||
      'https://dummyimage.com/200x80/1d4ed8/ffffff&text=PYRIZE',
    ofisAdi: danisman.ofisAdi || 'PYRIZE Danışmanlık',
    gucler: strengths,
    oduller: consultantAwards,
  };
};

const mapCorporateData = (data: OlusturulanSunum): CorporateTemplateData => {
  const { icerik } = data;
  const bolgeler = icerik.bolgeler || [];

  const locationAdvantagesBolge = findBolge(bolgeler, 'location_advantages');
  const usagePotentialBolge = findBolge(bolgeler, 'usage_potential');
  const targetAudienceBolge = findBolge(bolgeler, 'target_audience');
  const marketingBolge = findBolge(bolgeler, 'marketing_strategy');
  const valuePlanBolge = findBolge(bolgeler, 'value_plan');
  const adChannelsBolge = findBolge(bolgeler, 'ad_channels');
  const guaranteeBolge = findBolge(bolgeler, 'guarantee');
  const cozumBolge = findBolge(bolgeler, 'cozum');
  const processBolge = findBolge(bolgeler, 'process');
  const heroBolge = findBolge(bolgeler, 'hero');
  const marketBolge = findBolge(bolgeler, 'market_analysis');
  const faqBolge = findBolge(bolgeler, 'faq');

  const locationAdvantagesFromTemplate = locationAdvantagesBolge
    ? locationAdvantagesBolge.altBolge?.flatMap((alt) => splitLines(alt.icerik)) ||
      splitLines(locationAdvantagesBolge.icerik)
    : [];

  const usagePotentialFromTemplate = usagePotentialBolge
    ? usagePotentialBolge.altBolge?.flatMap((alt) => splitLines(alt.icerik)) ||
      splitLines(usagePotentialBolge.icerik)
    : [];

  const targetAudienceFromTemplate = targetAudienceBolge?.altBolge
    ? targetAudienceBolge.altBolge.map((alt) => ({ baslik: alt.baslik, aciklama: alt.icerik }))
    : [];

  const marketing = (() => {
    const anaMesaj = marketingBolge?.altBolge?.find((alt) => /ana mesaj/i.test(alt.baslik));
    const vurgular = marketingBolge?.altBolge?.find((alt) => /vurgular/i.test(alt.baslik));
    const gorsel = marketingBolge?.altBolge?.find((alt) => /görsel/i.test(alt.baslik));

    return {
      anaMesaj: anaMesaj?.icerik || marketingBolge?.icerik || 'Mülkünüz için özel kampanya planı',
      vurgular: vurgular ? splitLines(vurgular.icerik) : ['Kurumsal temsil', 'Veri odaklı pazarlama'],
      gorselIcerikPlani:
        gorsel?.icerik ||
        'Drone çekimleri, profesyonel fotoğraf ve video prodüksiyonu, 360° sanal tur',
    };
  })();

  const valuePlan = (() => {
    const fiyatStratejisi = valuePlanBolge?.altBolge?.find((alt) => /fiyat/i.test(alt.baslik));
    const hedefSure = valuePlanBolge?.altBolge?.find((alt) => /süre|sure/i.test(alt.baslik));
    const tahminiIlgi = valuePlanBolge?.altBolge?.find((alt) => /ilgi/i.test(alt.baslik));

    return {
      fiyatStratejisi:
        fiyatStratejisi?.icerik || valuePlanBolge?.icerik || 'Karşılaştırmalı piyasa analizi (CMA) ile fiyatlama',
      hedefSatisSuresi: hedefSure?.icerik || '30-60 gün',
      tahminiIlgi:
        tahminiIlgi?.icerik || 'İlk ay 15-25 nitelikli talep, 3-5 ciddi teklif hedefi',
    };
  })();

  const adChannels = adChannelsBolge?.altBolge?.[0]?.icerik
    ? splitLines(adChannelsBolge.altBolge[0].icerik)
    : splitLines(adChannelsBolge?.icerik);

  const consultantStrengths = guaranteeBolge?.altBolge
    ?.map((alt) => alt.baslik)
    .filter(Boolean) || [];

  const consultantAwards = splitLines(guaranteeBolge?.icerik);

  const property = createProperty(
    data,
    locationAdvantagesFromTemplate,
    usagePotentialFromTemplate,
    targetAudienceFromTemplate,
    marketing,
    valuePlan,
    adChannels,
  );

  const consultant = createConsultant(data, consultantStrengths, consultantAwards);

  const valuation: ValuationData = {
    marketSnapshots:
      data.icerik.detayliDegerleme?.marketSnapshots?.map((snapshot) => ({
        title: snapshot.title,
        value: snapshot.value,
        trend: snapshot.trend,
        trendLabel: snapshot.trendLabel,
      })) || [],
    comparables:
      data.icerik.detayliDegerleme?.comparables?.map((comp) => ({
        address: comp.address,
        status: comp.status,
        price: comp.price,
        size: comp.size || '',
        pricePerSqm: comp.pricePerSqm || '',
      })) || [],
    estimatedValueRange:
      data.icerik.detayliDegerleme?.estimatedValueRange &&
      data.icerik.detayliDegerleme.estimatedValueRange !== 'Detaylı değerleme verisi paylaşılmadı' &&
      data.icerik.detayliDegerleme.estimatedValueRange.trim() !== ''
        ? data.icerik.detayliDegerleme.estimatedValueRange
        : undefined,
  };

  // KFE verilerine göre dinamik snapshot'lar oluştur
  if (valuation.marketSnapshots.length === 0) {
    const kfeDataFromIcerik = (data.icerik as any)?.kfeData;
    
    if (kfeDataFromIcerik?.bolge?.yillikDegisim !== null && kfeDataFromIcerik?.bolge?.yillikDegisim !== undefined) {
      // Mülk fiyatından m² fiyatını hesapla
      const priceValue = (data.istek.mulk as any)?.fiyatMax ?? (data.istek.mulk as any)?.fiyatMin ?? (data.istek.mulk as any)?.fiyat;
      const metrekareValue = typeof data.istek.mulk.metrekare === 'number' ? data.istek.mulk.metrekare : null;
      const sqmPrice = priceValue && metrekareValue ? Math.round(priceValue / metrekareValue) : null;
      
      const kfeYillikDegisim = kfeDataFromIcerik.bolge.yillikDegisim;
      const regionalAverage = sqmPrice 
        ? Math.round(sqmPrice / (1 + kfeYillikDegisim / 100) * 0.9)
        : 65000;

      valuation.marketSnapshots.push({
        title: 'Bölge m² Ortalaması',
        value: `₺${regionalAverage.toLocaleString('tr-TR')}`,
        trend: kfeYillikDegisim > 0 ? 'up' : kfeYillikDegisim < 0 ? 'down' : 'stable',
        trendLabel: `Son 12 ayda %${Math.abs(kfeYillikDegisim).toFixed(1)} ${kfeYillikDegisim > 0 ? 'artış' : 'azalış'}`,
      });

      // Talep Eğilimi
      if (kfeDataFromIcerik.turkiye?.yillikDegisim !== null) {
        const bolgeYillik = kfeDataFromIcerik.bolge.yillikDegisim;
        const turkiyeYillik = kfeDataFromIcerik.turkiye.yillikDegisim;
        const fark = bolgeYillik - turkiyeYillik;
        
        valuation.marketSnapshots.push({
          title: 'Talep Eğilimi',
          value: fark > 2 ? 'Güçlü Yükseliş' : fark > 0 ? 'Yükselişte' : fark > -2 ? 'İstikrarlı' : 'Düşüşte',
          trend: fark > 0 ? 'up' : fark < -2 ? 'down' : 'stable',
          trendLabel: `Bölge Türkiye ortalamasından %${Math.abs(fark).toFixed(1)} ${fark > 0 ? 'yüksek' : 'düşük'}`,
        });
      } else {
        valuation.marketSnapshots.push({
          title: 'Talep Eğilimi',
          value: 'Yükselişte',
          trend: 'stable',
          trendLabel: 'Talep artışı',
        });
      }
    } else {
      // KFE verisi yoksa varsayılan
      valuation.marketSnapshots = [
        { title: 'Bölge m² Ortalaması', value: '₺28.500', trend: 'up', trendLabel: 'Son 6 ay' },
        { title: 'Talep Eğilimi', value: 'Yükselişte', trend: 'stable', trendLabel: 'Talep artışı' },
      ];
    }

    // Satışa Dönüş Süresi - her zaman ekle
    valuation.marketSnapshots.push({
      title: 'İlan - Satış Süresi',
      value: '45-60 Gün',
      trend: 'down',
      trendLabel: 'İl ortalaması',
    });
  }

  const salesBenefits: StrategicAdvantage[] = cozumBolge?.altBolge
    ? cozumBolge.altBolge.map((alt, index) => {
        const [firstLine, ...rest] = splitLines(alt.icerik);
        return {
          icon: benefitIcon(index),
          title: alt.baslik,
          description: firstLine || alt.icerik,
          comparison: rest.join(' • '),
        };
      })
    : [
        {
          icon: benefitIcon(0),
          title: 'Profesyonel değerleme',
          description: 'Doğru fiyat, maksimum gelir',
          comparison: 'Bireysel satışa göre %15 daha yüksek değer',
        },
      ];

  const salesSteps: SalesSystemStep[] = processBolge?.altBolge
    ? processBolge.altBolge.map((alt, index) => {
        const segments = alt.icerik.split(/\n\s*\n/);
        const actions: string[] = [];
        let benefit = '';

        segments.forEach((segment) => {
          if (/ne yapıyorum/i.test(segment)) {
            actions.push(...splitLines(segment.split(/ne yapıyorum[:]?/i)[1]));
          } else if (/kazancınız|kazanç/i.test(segment)) {
            benefit = splitLines(segment.split(/kazancınız[:]?/i)[1]).join(' ');
          }
        });

        return {
          icon: stepIcon(index),
          gun: `Aşama ${index + 1}`,
          baslik: alt.baslik,
          neYapiyoruz: actions.length ? actions : splitLines(alt.icerik),
          kazanciniz:
            benefit ||
            'Sürecin her adımında şeffaf raporlama ve maksimum değer için profesyonel yönetim',
        };
      })
    : [
        {
          icon: stepIcon(0),
          gun: 'Aşama 1',
          baslik: 'Profesyonel değerleme ve hazırlık',
          neYapiyoruz: ['Karşılaştırmalı piyasa analizi', 'Hedef fiyat belirleme'],
          kazanciniz: 'Piyasaya doğru fiyatla giriş yaparak maksimum ilgi toplarsınız.',
        },
      ];

  const heroDescription =
    data.icerik.heroAciklama || heroBolge?.icerik ||
    'Mülkünüzün piyasa değerini, konum avantajlarını ve satış stratejisini veri odaklı analizlerle sunuyoruz.';

  const heroHighlight = salesBenefits[0]?.comparison || salesBenefits[0]?.description;

  const reportDate = (() => {
    const raw = data.olusturmaTarihi ? new Date(data.olusturmaTarihi) : new Date();
    return Number.isNaN(raw.getTime()) ? new Date().toLocaleDateString('tr-TR') : raw.toLocaleDateString('tr-TR');
  })();

  return {
    property,
    consultant,
    valuation,
    salesBenefits,
    salesSteps,
    heroDescription,
    heroHighlight,
    reportDate,
    marketBolge,
    faqBolge,
  };
};

const TemplateCorporateFromZip: React.FC<{ data: OlusturulanSunum }> = ({ data }) => {
  const mapped = useMemo(() => mapCorporateData(data), [data]);

  return (
    <div className="bg-gray-100 text-gray-800 antialiased">
      <main>
        <HeroSection
          property={mapped.property}
          consultant={mapped.consultant}
          heroDescription={mapped.heroDescription}
          heroHighlight={mapped.heroHighlight}
          reportDate={mapped.reportDate}
        />
        <RegionalComparisonSection property={mapped.property} valuationData={mapped.valuation} />
        <MarketAnalysisSection bolge={mapped.marketBolge} theme="light" />
        <BenefitsSection benefits={mapped.salesBenefits} />
        <SalesProcessSection steps={mapped.salesSteps} />
        <PropertyPlanSection property={mapped.property} />
        <UsagePotentialSection property={mapped.property} />
        <ConsultantTrustSection consultant={mapped.consultant} />
        <FaqSection bolge={mapped.faqBolge} theme="light" />
        <CTASection consultant={mapped.consultant} />
      </main>
    </div>
  );
};

export default TemplateCorporateFromZip;
