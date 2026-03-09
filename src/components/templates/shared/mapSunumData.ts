/**
 * Shared data mapping layer for all unified templates.
 * Extracted from TemplateModernFromZip.tsx to avoid duplication.
 *
 * Transforms OlusturulanSunum → MappedTemplateData
 */
import React from 'react';
import { OlusturulanSunum, Bolge } from '@/types';
import { formatPriceRange } from '@/lib/utils/price';
import type {
  Property,
  ValuationData,
  StrategicAdvantage,
  SalesSystemStep,
  FAQItem,
  Consultant,
} from './types';

// ─── Exported mapped data interface ───────────────────────────────
export interface MappedTemplateData {
  property: Property & { fotograflar?: string[] };
  valuation: ValuationData;
  salesBenefits: StrategicAdvantage[];
  salesSteps: SalesSystemStep[];
  heroDescription: string;
  heroHighlight?: string;
  reportDate: string;
  marketBolge?: Bolge;
  faqBolge?: Bolge;
  faqs: FAQItem[];
  consultant: Consultant;
}

// ─── Fallback image ───────────────────────────────────────────────
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&auto=compress&fit=crop';

// ─── SVG Icon arrays ──────────────────────────────────────────────
export const BENEFIT_ICONS = [
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
];

const STEP_ICONS = [
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" })),
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
];

export const stepIcon = (index: number) => STEP_ICONS[index % STEP_ICONS.length];
export const benefitIcon = (index: number) => BENEFIT_ICONS[index % BENEFIT_ICONS.length];

// ─── Utility functions ────────────────────────────────────────────
export const splitLines = (value?: string | null): string[] =>
  (value || '')
    .split(/\r?\n|\u2028|\u2029/)
    .map((line) => line.replace(/^[•\-✅\s]+/, '').trim())
    .filter(Boolean);

const formatCurrency = (value?: number): string | undefined =>
  typeof value === 'number' ? `${value.toLocaleString('tr-TR')} TL` : undefined;

const formatMetrekare = (value?: number): string | undefined =>
  typeof value === 'number' ? `${value.toLocaleString('tr-TR')} m²` : undefined;

export const findBolge = (bolgeler: Bolge[] | undefined, tip: Bolge['tip']) =>
  bolgeler?.find((bolge) => bolge.tip === tip);

const extractMainLocation = (konum?: string): string => {
  if (!konum) return 'Bölge';
  const firstPart = konum.split(',')[0]?.trim();
  return firstPart?.length ? firstPart : konum.trim();
};

// ─── Property creator ─────────────────────────────────────────────
const createProperty = (
  data: OlusturulanSunum,
  locationAdvantagesFromTemplate: string[],
  usagePotentialFromTemplate: string[],
  targetAudienceFromTemplate: { baslik: string; aciklama: string }[],
  marketing: { anaMesaj: string; vurgular: string[]; gorselIcerikPlani: string },
  valuePlan: { fiyatStratejisi: string; hedefSatisSuresi: string; tahminiIlgi: string },
  adChannels: string[],
  marketBolge?: Bolge,
): Property & { fotograflar?: string[] } => {
  const { istek, icerik } = data;
  const mulk = istek?.mulk;
  const konumString = typeof mulk?.konum === 'string' ? mulk.konum.trim() : '';
  const konumParts = konumString ? konumString.split(',').map((item) => item.trim()) : [];
  const il = konumParts[0] ?? '';
  const ilce = konumParts[1] ?? '';
  const mahalle = konumParts.slice(2).join(', ');

  const planAltBaslikParts = [
    konumString || undefined,
    formatMetrekare(mulk?.metrekare),
    formatCurrency((mulk as any)?.fiyat),
  ].filter(Boolean) as string[];

  const computedPlanAltBaslik =
    icerik.altBaslik ||
    (planAltBaslikParts.length ? planAltBaslikParts.join(' • ') : 'Konum bilgisi paylaşılmadı');

  const propertyType =
    mulk?.tur === 'arsa' ? 'Arsa'
      : mulk?.tur === 'daire' ? 'Daire'
        : mulk?.tur === 'villa' ? 'Villa'
          : mulk?.tur === 'ticari' ? 'Ticari Gayrimenkul'
            : mulk?.tur === 'ofis' ? 'Ofis'
              : 'Gayrimenkul';

  const mevcutYapi =
    formatMetrekare(mulk?.metrekare) || (mulk?.odaSayisi ? `${mulk.odaSayisi} oda` : 'Belirtilmemiş');

  const fotograflar = (mulk as any)?.fotograflar || (icerik as any)?.fotograflar || [];

  const propertyData: Property & { fotograflar?: string[] } = {
    gorselUrl: fotograflar[0] || FALLBACK_IMAGE,
    fotograflar,
    planBaslik:
      icerik.baslik || (konumString ? `${konumString} - Özel Analiz Raporu` : 'Özel Analiz Raporu'),
    planAltBaslik: computedPlanAltBaslik,
    konumAnalizi: {
      ilIlce: ilce ? `${il} / ${ilce}` : il || 'Belirtilmemiş Konum',
      mahalle: mahalle || ilce || il || 'Belirtilmemiş Konum',
      ozellik: propertyType,
      mevcutYapi,
    },
    konumAvantajlari:
      splitLines((mulk as any)?.konumAvantajlari).length > 0
        ? splitLines((mulk as any)?.konumAvantajlari)
        : locationAdvantagesFromTemplate,
    kullanimPotensiyeli:
      splitLines((mulk as any)?.kullanimPotansiyeli).length > 0
        ? splitLines((mulk as any)?.kullanimPotansiyeli)
        : usagePotentialFromTemplate,
    hedefKitle:
      targetAudienceFromTemplate.length > 0
        ? targetAudienceFromTemplate
        : [
          { baslik: 'Yatırımcılar', aciklama: 'Bölgedeki değer artışı ve kiralama potansiyelini değerlendirmek isteyen yatırımcılar.' },
          { baslik: 'Aileler', aciklama: 'Güvenli, konforlu ve sosyal olanaklara yakın yaşam arayan aileler.' },
          { baslik: 'Profesyoneller', aciklama: 'İş merkezlerine kolay ulaşım ve kaliteli yaşam alanı arayan profesyoneller.' },
        ],
    tanitimStratejisi: marketing,
    satisPlani: valuePlan,
    reklamKanallari: [
      'Sahibinden Vitrin İlan',
      'Emlakjet Premium Paket',
      'Facebook & Instagram Reklamları',
      'Google Ads (Arama + Display)',
      'YouTube Video Reklamları',
    ],
    marketAnalysis: (() => {
      const marketData = marketBolge?.icerik || '';
      const findByTitle = (keywords: string[]) =>
        marketBolge?.altBolge?.find((alt) => {
          const baslik = alt.baslik.toLowerCase();
          return keywords.some((keyword) => baslik.includes(keyword.toLowerCase()));
        });

      const risk = findByTitle(['nadir fırsat', 'nadir', 'fırsat', 'risk', 'dikkat']);
      const premium = findByTitle(['konum primi', 'primi', 'avantaj', 'deniz', 'konum']);
      const regional = findByTitle(['gelişim potansiyeli', 'gelişim', 'potansiyel', 'bölge', 'trend']);
      const microLocation = findByTitle(['mikro', 'lokasyon', 'değer']);
      const buyer = findByTitle(['alıcı', 'hedef', 'kitle']);
      const seasonal = findByTitle(['mevsim', 'sezon']);
      const locationName = extractMainLocation(mulk?.konum);

      return {
        microLocationValue: microLocation?.icerik || marketData || `${locationName} konumu stratejik avantajlar sunmaktadır.`,
        regionalTrend: regional?.icerik || `${locationName} bölgesi hızlı bir gelişim göstermektedir.`,
        seaProximityPremium: premium?.icerik || `${locationName} konumu, ulaşım ağlarına yakınlığı ile konum primi sağlamaktadır.`,
        gardenValueRatio: '',
        marketRisk: risk?.icerik || `Bu mülk, ${locationName} bölgesinde nadiren bulunan özelliklere sahiptir.`,
        buyerBehavior: buyer?.icerik || `${locationName} bölgesindeki alıcı profili çeşitlilik göstermektedir.`,
        seasonalEffect: seasonal?.icerik || 'Mevsimsel faktörler bölge dinamiklerini etkilemektedir.',
      };
    })(),
  };

  return propertyData;
};

// ─── Default data ─────────────────────────────────────────────────
const DEFAULT_SALES_BENEFITS: StrategicAdvantage[] = [
  { icon: BENEFIT_ICONS[0], title: "Doğru Fiyatlama", description: "Şerefiye analizi ile gerçek değerini buluyoruz.", comparison: "Maksimum Kazanç" },
  { icon: BENEFIT_ICONS[1], title: "Nitelikli Alıcı", description: "Alım gücü olan aileleri mülkünüze getiriyoruz.", comparison: "Stressiz Satış" },
  { icon: BENEFIT_ICONS[2], title: "Profesyonel Sunum", description: "Profesyonel çekim ve video ile mülkünüz parlar.", comparison: "Hızlı Sonuç" },
  { icon: BENEFIT_ICONS[3], title: "Hukuki Güvence", description: "Sözleşmeler kurumsal hukuk denetiminde yönetilir.", comparison: "Tam Güvenlik" },
  { icon: BENEFIT_ICONS[4], title: "Global Ağ Gücü", description: "Uluslararası ağ sayesinde yabancı alıcılara da erişim.", comparison: "Döviz Fırsatı" },
];

const DEFAULT_SALES_STEPS: SalesSystemStep[] = [
  { gun: "Gün 1-2", icon: stepIcon(0), baslik: "1. Profesyonel Değerleme", neYapiyoruz: ["Bölge m² analizi", "Şerefiye hesabı", "Rakip site analizi"], kazanciniz: "Doğru fiyat = Maksimum gelir potansiyeli" },
  { gun: "Gün 3-5", icon: stepIcon(1), baslik: "2. Görsel Şölen", neYapiyoruz: ["İç mekan geniş açı çekim", "Drone çekimi", "Tanıtım videosu"], kazanciniz: "Sinematik tanıtım = %300 daha fazla ilgi", maliyetNotu: "₺5,000", ucretNotu: "ÜCRETSİZ" },
  { gun: "Gün 5-10", icon: stepIcon(2), baslik: "3. Dijital Pazarlama", neYapiyoruz: ["Sosyal medya reklamları", "Portal Premium İlanlar", "Veritabanı mailing"], kazanciniz: "15,000+ kişiye doğrudan erişim.", maliyetNotu: "₺12,000", ucretNotu: "ÜCRETSİZ" },
  { gun: "Gün 1-30", icon: stepIcon(3), baslik: "4. Ağ Aktivasyonu", neYapiyoruz: ["850+ Ofise duyuru", "Yatırımcı erişimi", "Meslektaş iş birliği"], kazanciniz: "Yerel + ulusal alıcılar aynı anda hedeflenir." },
  { gun: "Gün 10-45", icon: stepIcon(4), baslik: "5. Nitelikli Alıcı Filtresi", neYapiyoruz: ["Finansal yeterlilik kontrolü", "Ciddiyet testi", "Görüşme planlama"], kazanciniz: "Sadece CİDDİ alıcılarla görüşürsünüz." },
  { gun: "Gün 30-60", icon: stepIcon(5), baslik: "6. Profesyonel Kapanış", neYapiyoruz: ["Pazarlık stratejisi", "Sözleşme yönetimi", "Tapu devir güvenliği"], kazanciniz: "En yüksek teklif + güvenli ödeme." },
];

const DEFAULT_FAQS: FAQItem[] = [
  { question: "Neden 'Tek Yetki' vermeliyim?", answer: "Tek yetki ile mülkünüz 'özel koleksiyon' gibi pazarlanır, tüm kontrol bende olur ve maksimum ciddiyet sağlanır." },
  { question: "Hizmet bedeli neden %2?", answer: "%2 ile size zaman kazandırıyor, pazarlıkta elinizi güçlendiriyor ve en yüksek fiyata satılmasını sağlıyoruz." },
  { question: "Mülküm neden henüz satılmadı?", answer: "Genellikle sebep ya 'yanlış fiyat' ya da 'yetersiz tanıtım'dır. Doğru analiz ile bu sorunu çözüyoruz." },
  { question: "Eşyalı mı satmak mantıklı?", answer: "Durumunuza özel bir analiz yaparak eşyalı/eşyasız fiyat opsiyonlarını belirleyebiliriz." },
  { question: "Yabancıya satışa uygun mu?", answer: "Vatandaşlığa uygunluk durumunu ve ekspertiz değerini analiz ederek döviz bazlı satış fırsatlarını da değerlendiriyoruz." },
];

// ─── Main mapper ──────────────────────────────────────────────────
export function mapSunumToTemplateData(data: OlusturulanSunum): MappedTemplateData {
  const { icerik } = data;
  const bolgeler = icerik.bolgeler || [];

  const locationAdvantagesBolge = findBolge(bolgeler, 'location_advantages');
  const usagePotentialBolge = findBolge(bolgeler, 'usage_potential');
  const targetAudienceBolge = findBolge(bolgeler, 'target_audience');
  const marketingBolge = findBolge(bolgeler, 'marketing_strategy');
  const valuePlanBolge = findBolge(bolgeler, 'value_plan');
  const adChannelsBolge = findBolge(bolgeler, 'ad_channels');
  const cozumBolge = findBolge(bolgeler, 'cozum');
  const processBolge = findBolge(bolgeler, 'process');
  const heroBolge = findBolge(bolgeler, 'hero');
  const marketBolge = findBolge(bolgeler, 'market_analysis');
  const faqBolge = findBolge(bolgeler, 'faq');

  // Extract location advantages
  const locationAdvantagesFromTemplate = locationAdvantagesBolge
    ? locationAdvantagesBolge.altBolge?.flatMap((alt) => splitLines(alt.icerik)) || splitLines(locationAdvantagesBolge.icerik)
    : [];

  const usagePotentialFromTemplate = usagePotentialBolge
    ? usagePotentialBolge.altBolge?.flatMap((alt) => splitLines(alt.icerik)) || splitLines(usagePotentialBolge.icerik)
    : [];

  const targetAudienceFromTemplate = targetAudienceBolge?.altBolge
    ? targetAudienceBolge.altBolge.map((alt) => ({ baslik: alt.baslik, aciklama: alt.icerik }))
    : [];

  // Marketing strategy
  const marketing = (() => {
    const anaMesaj = marketingBolge?.altBolge?.find((alt) => /ana mesaj/i.test(alt.baslik));
    const vurgular = marketingBolge?.altBolge?.find((alt) => /vurgular/i.test(alt.baslik));
    const gorsel = marketingBolge?.altBolge?.find((alt) => /görsel/i.test(alt.baslik));
    return {
      anaMesaj: anaMesaj?.icerik || marketingBolge?.icerik || 'Mülkünüz için özel kampanya planı',
      vurgular: vurgular ? splitLines(vurgular.icerik) : ['Kurumsal temsil', 'Veri odaklı pazarlama'],
      gorselIcerikPlani: gorsel?.icerik || 'Drone çekimleri, profesyonel fotoğraf ve video prodüksiyonu, 360° sanal tur',
    };
  })();

  // Value plan
  const valuePlan = (() => {
    const fiyatStratejisi = valuePlanBolge?.altBolge?.find((alt) => /fiyat/i.test(alt.baslik));
    const hedefSure = valuePlanBolge?.altBolge?.find((alt) => /süre|sure/i.test(alt.baslik));
    const tahminiIlgi = valuePlanBolge?.altBolge?.find((alt) => /ilgi/i.test(alt.baslik));
    return {
      fiyatStratejisi: fiyatStratejisi?.icerik || valuePlanBolge?.icerik || 'Karşılaştırmalı piyasa analizi (CMA) ile fiyatlama',
      hedefSatisSuresi: hedefSure?.icerik || '30-60 gün',
      tahminiIlgi: tahminiIlgi?.icerik || 'İlk ay 15-25 nitelikli talep, 3-5 ciddi teklif hedefi',
    };
  })();

  const adChannels = adChannelsBolge?.altBolge?.[0]?.icerik
    ? splitLines(adChannelsBolge.altBolge[0].icerik)
    : splitLines(adChannelsBolge?.icerik);

  const property = createProperty(
    data, locationAdvantagesFromTemplate, usagePotentialFromTemplate,
    targetAudienceFromTemplate, marketing, valuePlan, adChannels, marketBolge,
  );

  // Valuation
  const valuation: ValuationData = {
    marketSnapshots:
      icerik.detayliDegerleme?.marketSnapshots?.map((snapshot) => ({
        title: snapshot.title, value: snapshot.value, trend: snapshot.trend, trendLabel: snapshot.trendLabel,
      })) || [],
    comparables:
      icerik.detayliDegerleme?.comparables?.map((comp) => ({
        address: comp.address, status: comp.status, price: comp.price, size: comp.size || '', pricePerSqm: comp.pricePerSqm || '',
      })) || [],
    estimatedValueRange:
      icerik.detayliDegerleme?.estimatedValueRange &&
        icerik.detayliDegerleme.estimatedValueRange !== 'Detaylı değerleme verisi paylaşılmadı' &&
        icerik.detayliDegerleme.estimatedValueRange.trim() !== ''
        ? icerik.detayliDegerleme.estimatedValueRange
        : formatCurrency((data.istek.mulk as any)?.fiyatMax ?? (data.istek.mulk as any)?.fiyatMin ?? (data.istek.mulk as any)?.fiyat) || 'Değerleme yapılıyor...',
    priceStrategyNote: 'Mülkünüzün özellikleri ve konumu, standart m² fiyatlarının üzerinde, özel fiyatlama gerektirir.',
  };

  // KFE dynamic snapshots
  if (valuation.marketSnapshots.length === 0) {
    const kfeDataFromIcerik = (icerik as any)?.kfeData;
    if (kfeDataFromIcerik?.bolge?.yillikDegisim !== null && kfeDataFromIcerik?.bolge?.yillikDegisim !== undefined) {
      const priceValue = (data.istek.mulk as any)?.fiyatMax ?? (data.istek.mulk as any)?.fiyatMin ?? (data.istek.mulk as any)?.fiyat;
      const metrekareValue = typeof data.istek.mulk.metrekare === 'number' ? data.istek.mulk.metrekare : null;
      const sqmPrice = priceValue && metrekareValue ? Math.round(priceValue / metrekareValue) : null;
      const kfeYillikDegisim = kfeDataFromIcerik.bolge.yillikDegisim;
      const regionalAverage = sqmPrice ? Math.round(sqmPrice / (1 + kfeYillikDegisim / 100) * 0.9) : 65000;
      valuation.marketSnapshots.push({
        title: 'Bölge m² Ortalaması',
        value: `₺${regionalAverage.toLocaleString('tr-TR')}`,
        trend: kfeYillikDegisim > 0 ? 'up' : kfeYillikDegisim < 0 ? 'down' : 'stable',
        trendLabel: `Son 12 ayda %${Math.abs(kfeYillikDegisim).toFixed(1)} ${kfeYillikDegisim > 0 ? 'artış' : 'azalış'}`,
      });
    } else {
      valuation.marketSnapshots = [
        { title: 'Bölge m² Ortalaması', value: '₺28.500', trend: 'up', trendLabel: 'Son 6 ay' },
      ];
    }
    valuation.marketSnapshots.push({ title: 'İlan - Satış Süresi', value: '45-60 Gün', trend: 'down', trendLabel: 'İl ortalaması' });
  }

  // Sales benefits
  const salesBenefits: StrategicAdvantage[] = cozumBolge?.altBolge && cozumBolge.altBolge.length > 0
    ? cozumBolge.altBolge.map((alt, index) => {
      const [firstLine, ...rest] = splitLines(alt.icerik);
      const defaultBenefit = DEFAULT_SALES_BENEFITS[index] || DEFAULT_SALES_BENEFITS[0];
      return {
        icon: defaultBenefit.icon,
        title: alt.baslik || defaultBenefit.title,
        description: firstLine || alt.icerik || defaultBenefit.description,
        comparison: rest.join(' • ') || defaultBenefit.comparison,
      };
    })
    : DEFAULT_SALES_BENEFITS;

  // Sales steps
  const salesSteps: SalesSystemStep[] = processBolge?.altBolge && processBolge.altBolge.length > 0
    ? processBolge.altBolge.map((alt, index) => {
      const segments = alt.icerik.split(/\n\s*\n/);
      const actions: string[] = [];
      let benefit = '';
      let maliyetNotu = '';
      let ucretNotu = '';
      segments.forEach((segment) => {
        if (/ne yapıyorum|ne yapıyoruz/i.test(segment)) {
          actions.push(...splitLines(segment.split(/ne yapıyorum|ne yapıyoruz[:]?/i)[1]));
        } else if (/kazancınız|kazanç|sizin kazancınız/i.test(segment)) {
          benefit = splitLines(segment.split(/kazancınız|kazanç|sizin kazancınız[:]?/i)[1]).join(' ');
        } else if (/piyasa değeri|maliyet/i.test(segment)) {
          maliyetNotu = segment.match(/₺[\d,]+|[\d,]+ TL/i)?.[0] || '';
        } else if (/sizin için|ücretsiz/i.test(segment)) {
          ucretNotu = segment.match(/ücretsiz|ÜCRETSİZ|₺[\d,]+|[\d,]+ TL/i)?.[0] || '';
        }
      });
      const defaultStep = DEFAULT_SALES_STEPS[index] || DEFAULT_SALES_STEPS[0];
      return {
        icon: stepIcon(index),
        gun: defaultStep.gun,
        baslik: alt.baslik || defaultStep.baslik,
        neYapiyoruz: actions.length > 0 ? actions : (splitLines(alt.icerik).length > 0 ? splitLines(alt.icerik) : defaultStep.neYapiyoruz),
        kazanciniz: benefit || defaultStep.kazanciniz,
        maliyetNotu: maliyetNotu || defaultStep.maliyetNotu,
        ucretNotu: ucretNotu || defaultStep.ucretNotu,
      };
    })
    : DEFAULT_SALES_STEPS;

  // Hero
  const heroDescription =
    icerik.heroAciklama || heroBolge?.icerik ||
    'Mülkünüzün piyasa değerini, konum avantajlarını ve satış stratejisini veri odaklı analizlerle sunuyoruz.';
  const heroHighlight = salesBenefits[0]?.comparison || salesBenefits[0]?.description;

  const reportDate = (() => {
    const raw = data.olusturmaTarihi ? new Date(data.olusturmaTarihi) : new Date();
    return Number.isNaN(raw.getTime()) ? new Date().toLocaleDateString('tr-TR') : raw.toLocaleDateString('tr-TR');
  })();

  // FAQs
  const faqs: FAQItem[] = faqBolge?.altBolge && faqBolge.altBolge.length > 0
    ? faqBolge.altBolge.map((alt, index) => ({
      question: alt.baslik || DEFAULT_FAQS[index]?.question || 'Sık Sorulan Soru',
      answer: alt.icerik || DEFAULT_FAQS[index]?.answer || '',
    }))
    : DEFAULT_FAQS;

  // Consultant
  const danisman = data.istek?.danisman;
  const splitConsultantLines = (value?: string) =>
    (value || '').split(/\r?\n/).map((item) => item.replace(/^[•\-–—→✅\u2022\s]+/, '').trim()).filter(Boolean);

  const odulList = splitConsultantLines(danisman?.oduller);

  const consultant: Consultant = {
    adSoyad: danisman?.adSoyad || 'Gayrimenkul Danışmanı',
    unvan: danisman?.unvan || 'Lisanslı Emlak Danışmanı',
    telefon: danisman?.telefon || '',
    email: danisman?.email || '',
    profilFotografiUrl: (danisman as any)?.profilFotografi || (danisman as any)?.profilFotografiUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    ofisLogosuUrl: (danisman as any)?.ofisLogosu || (danisman as any)?.ofisLogosuUrl || '',
    ofisAdi: danisman?.ofisAdi || '',
    oduller: odulList,
    gucler: [
      ...(danisman?.deneyim
        ? [{ icon: React.createElement('div', { className: 'w-6 h-6' }), text: danisman.deneyim }]
        : []),
    ],
    deneyim: danisman?.deneyim,
    referans: danisman?.referans,
  };

  return {
    property,
    valuation,
    salesBenefits,
    salesSteps: salesSteps || [],
    heroDescription,
    heroHighlight,
    reportDate,
    marketBolge,
    faqBolge,
    faqs,
    consultant,
  };
}
