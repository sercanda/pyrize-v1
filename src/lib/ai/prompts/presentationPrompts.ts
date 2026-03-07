import {
  SunumOlusturmaIstegi,
  MulkTuru,
  MulkBilgileri,
} from '@/types';
import { getStyleGuide } from './styleGuides';
import { getPurposeGuide } from './purposeGuides';
import { getLengthGuide, uzunlukKonfig } from './lengthConfig';
import { formatPriceRange } from '@/lib/utils/price';
import { getKFEForProperty, formatKFEForPrompt } from '@/lib/utils/kfe';

const mulkTurleri: Record<MulkTuru, string> = {
  daire: 'Daireniz',
  arsa: 'Arsanız',
  villa: 'Villanız',
  ticari: 'Ticari Mülkünüz',
  kompleks: 'Kompleksiniz',
  ofis: 'Ofisiniz',
};

const mulkTuruAciklamalari: Record<MulkTuru, string> = {
  daire: 'Yaşam alanı, aile yaşamı, şehir merkezine yakınlık vurguları. Komşuluk, güvenlik, sosyal alanlar önemli.',
  arsa: 'Yatırım potansiyeli, değer artışı, imar durumu, topografya, ulaşım, gelecek planları vurgulanmalı.',
  villa: 'Özel yaşam, geniş bahçe, gizlilik, lüks donanımlar, manzara vurguları.',
  ticari: 'İş potansiyeli, yoğunluk, ulaşım, park, vitrin, kira geliri, yatırım getirisi vurguları.',
  kompleks: 'Sosyal yaşam, havuz, spor alanları, güvenlik, yönetim, ortak alanlar vurguları.',
  ofis: 'Konum, erişilebilirlik, park, güvenlik, yönetim, teknolojik altyapı, prestij vurguları.',
};

function getMevsimText(): string {
  const ay = new Date().getMonth() + 1;
  if (ay >= 3 && ay <= 5) return 'bahar sezonu';
  if (ay >= 6 && ay <= 8) return 'yaz sezonu';
  if (ay >= 9 && ay <= 11) return 'sonbahar sezonu';
  return 'kış sezonu';
}

function buildPriceLine(mulk: MulkBilgileri, prefix = '- Fiyat'): string {
  return formatPriceRange(mulk) ? `${prefix}: ${formatPriceRange(mulk)}` : '';
}

function buildPropertySection(mulk: MulkBilgileri): string {
  const lines = [
    `- Tür: ${mulk.tur}`,
    `- Konum: ${mulk.konum}`,
    buildPriceLine(mulk),
    mulk.metrekare ? `- Metrekare: ${mulk.metrekare} m²` : '',
    mulk.odaSayisi ? `- Oda: ${mulk.odaSayisi}` : '',
    mulk.cephe ? `- Cephe: ${mulk.cephe}` : '',
    mulk.kat ? `- Kat: ${mulk.kat}` : '',
    mulk.yas ? `- Yaş: ${mulk.yas}` : '',
    mulk.krediyeUygun
      ? `- Krediye Uygunluk: ${mulk.krediyeUygun === 'uygun' ? 'Evet, Krediye Uygun' : mulk.krediyeUygun === 'kismen' ? 'Kısmen / Bankaya Göre' : 'Hayır, Krediye Uygun Değil'}`
      : '',
    mulk.cevreOzellikleri?.length ? `- Çevre Özellikleri: ${mulk.cevreOzellikleri.join(', ')}` : '',
    mulk.avantajlar?.length ? `- Avantajlar: ${mulk.avantajlar.join(', ')}` : '',
    mulk.aciklama ? `- Açıklama: ${mulk.aciklama}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function buildPropertyRules(mulk: MulkBilgileri): string {
  const turLabel = mulkTurleri[mulk.tur];
  const turSpecific: Record<string, string> = {
    daire: 'Daire özellikleri: oda sayısı, kat, metrekare, bina yaşı, krediye uygunluk',
    villa: 'Villa özellikleri: bahçe, otopark, lüks detaylar, villa yaşam tarzı',
    arsa: 'Arsa özellikleri: imar durumu, metrekare, konum avantajları',
    ticari: 'İşyeri özellikleri: lokasyon, müşteri trafiği, iş potansiyeli',
    kompleks: 'Kompleks özellikleri: sosyal alanlar, havuz, güvenlik, yönetim',
    ofis: 'Ofis özellikleri: konum, erişilebilirlik, teknolojik altyapı, prestij',
  };

  return `1. MÜLK TÜRÜ: Bu sunum bir **${turLabel}** içindir!
   - Başlıklar: "${turLabel}nızı/nizi" kullan
   - Tüm içeriği ${turLabel} özellikleri için yaz
   - ${turSpecific[mulk.tur] || ''}

2. İÇERİK DİNAMİZMİ:
   - Her bölümü ${turLabel} için özel yaz
   - Problemler bölümünde "${turLabel} satarken" yaz
   - Süreç bölümünde "${turLabel} satış sistemi" yaz
   - Çözümler ${turLabel}'e özgü olsun`;
}

function buildKFESection(mulk: MulkBilgileri): string {
  try {
    const kfeData = getKFEForProperty(mulk);
    return formatKFEForPrompt(kfeData);
  } catch {
    return '';
  }
}

function buildMarketDataSection(
  marketData?: { location: string; sqm_avg: number; sale_duration_days: number; demand_change_percent: number; active_listings_count?: number; six_month_trend?: number[]; data_source: string[] } | null
): string {
  if (!marketData) return '';
  return `
📊 VERİYE DAYALI PİYASA ANALİZİ (${marketData.location}):

Bu veriler Endeksa, Zingat, Emlakjet ve Sahibinden gibi kaynaklardan toplanmıştır.

- Bölge Ortalama m² Fiyatı: ₺${marketData.sqm_avg.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
- Satışa Dönüş Süresi: ${marketData.sale_duration_days} gün (ortalama)
- Talep Eğilimi: ${marketData.demand_change_percent > 0 ? '+' : ''}${marketData.demand_change_percent.toFixed(1)}%
${marketData.active_listings_count ? `- Aktif İlan Sayısı: ${marketData.active_listings_count}` : ''}
${marketData.six_month_trend?.length ? `- Son 6 Ay Trend (m² fiyat):\n  ${marketData.six_month_trend.map((price, idx) => `${6 - marketData.six_month_trend!.length + idx + 1}. ay: ₺${price.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`).join('\n  ')}` : ''}

Bu verileri "Veriye Dayalı Piyasa Analizi" bölümünde kullan. Grafik ve istatistikler oluştur.
Bölge ortalaması ile gayrimenkul fiyatını karşılaştır. Trend analizi yap.
Veriler kaynaklarıyla birlikte sunulmalı: "${marketData.data_source.join(', ')}".`;
}

const OUTPUT_FORMAT = `ÇIKTI FORMAT:
JSON formatında döndür. Yapı:
{
  "baslik": "Ana başlık (maksimum 60 karakter)",
  "altBaslik": "Alt başlık (opsiyonel, maksimum 100 karakter)",
  "heroAciklama": "Hero bölümü için kısa ve etkileyici açıklama (2-3 cümle)",
  "bolgeler": [
    {
      "baslik": "Bölge başlığı",
      "icerik": "Bölge içeriği (2-3 paragraf)",
      "tip": "text"
    },
    {
      "baslik": "İstatistikler",
      "icerik": "Yatırım değeri: %25 artış | Metroya uzaklık: 500m | Trend nüfus: +15%",
      "tip": "stats"
    }
  ],
  "cti": {
    "baslik": "Harekete geç başlığı",
    "aciklama": "İletişim için açıklama"
  }
}`;

/**
 * Sunum oluşturma isteğine göre AI prompt'u inşa eder.
 * Stil, tema, amaç ve uzunluk kombinasyonuna göre özelleştirilmiş prompt döndürür.
 */
export function buildPresentationPrompt(
  istek: SunumOlusturmaIstegi,
  marketData?: any
): string {
  const { danisman, mulk, amac, uzunluk, tema } = istek;
  const stil = istek.sunumStili || 'detayli_analiz';

  const sections = [
    `Sen profesyonel bir emlak sunum yazarlısın. Kullanıcı bir gayrimenkul sunumu oluşturmak istiyor.`,

    `DANİŞMAN BİLGİLERİ:
- Ad: ${danisman.adSoyad}
- Telefon: ${danisman.telefon}
- Email: ${danisman.email}
${danisman.deneyim ? `- Deneyim: ${danisman.deneyim}` : ''}
${danisman.referans ? `- Referans: ${danisman.referans}` : ''}`,

    `GAYRİMENKUL BİLGİLERİ:\n${buildPropertySection(mulk)}`,

    getPurposeGuide(amac),

    getStyleGuide(stil, tema),

    `${mulkTuruAciklamalari[mulk.tur]}`,

    getLengthGuide(uzunluk),

    `🚨 ÇOK ÖNEMLİ KURALLAR:\n\n${buildPropertyRules(mulk)}

3. DİĞER KURALLAR:
   - ${amac === 'portfoy_almak' ? 'Gayrimenkulün değerini vurgula, güvenli iş ortağı olduğunuzu hissettir.' : 'Müşteriye çözüm sunan bir yaklaşım, yatırım fırsatları, avantajlar vurgulanmalı.'}
   - AI tarafından üretildiği belli OLMAMALI, profesyonel danışman kaleminden çıkmış gibi olmalı.
   - Rakamsal veriler varsa kullan, yoksa gerçekçi tahminler yap.
   - Sunum "satış" değil "bilgilendirme ve güven" odaklı olmalı.
   - Mevsimsel referans: Şu anda ${getMevsimText()}.`,

    OUTPUT_FORMAT,

    `TOPLAM BÖLGE: ${uzunlukKonfig[uzunluk].bolgeSayisi}`,

    buildKFESection(mulk),

    buildMarketDataSection(marketData),
  ];

  return sections.filter(Boolean).join('\n\n');
}
