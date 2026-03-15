import {
  SunumOlusturmaIstegi,
  SunumStili,
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
    // Mülk Özellikleri (boolean toggles)
    buildPropertyFeatures(mulk),
  ];
  return lines.filter(Boolean).join('\n');
}

function buildPropertyFeatures(mulk: MulkBilgileri): string {
  const features: string[] = [];
  if (mulk.siteMi) features.push('Site içi');
  if (mulk.asansor) features.push('Asansör');
  if (mulk.otopark) features.push('Otopark');
  if (mulk.guvenlik) features.push('7/24 Güvenlik');
  if (mulk.havuz) features.push('Havuz');
  if (mulk.sporSalonu) features.push('Spor Salonu');
  if (mulk.bahceTeras) features.push('Bahçe/Teras');
  if (mulk.merkeziIsitma) features.push('Merkezi Isıtma');
  if (features.length === 0) return '';
  return `- Mülk Özellikleri: ${features.join(', ')}`;
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

function getStilBolgeTalimatlari(stil: SunumStili): string {
  const talimatlar: Record<SunumStili, string> = {
    detayli_analiz: `━━━ STİLE ÖZEL BÖLGE TALİMATLARI ━━━
Bu sunum DETAYLI ANALİZ stilindedir. Aşağıdaki bölgeleri MUTLAKA oluştur:

1. "location_analysis" bölgesi: Kapsamlı konum analizi. Bölge trendleri, emsal karşılaştırmaları, yatırım potansiyeli verileri.
2. "location_advantages" bölgesi: En az 4 konum avantajı. Her biri somut veri içermeli.
3. "usage_potential" bölgesi: Kullanım potansiyeli senaryoları — yatırım, yaşam, dönüşüm alternatifleri.
4. "marketing_strategy" bölgesi: Dijital + kurumsal tanıtım stratejisi detaylı.
5. "value_plan" bölgesi: Tahmini değer aralığı ve satım planı — süre, fiyat basamakları, revizyon noktaları.
6. "ad_channels" bölgesi: Reklam kanalları — her kanal için beklenen sonuç metrikleri.
7. "regional_comparison" bölgesi: Emsal karşılaştırma tablosu — satılmış ve satışta olan mülkler.

Her bölgede SOMUT VERİLER kullan. Tahmin yapıyorsan "tahmini" belirt. Grafiksel düşün.`,

    hizli_satis: `━━━ STİLE ÖZEL BÖLGE TALİMATLARI ━━━
Bu sunum HIZLI SATIŞ stilindedir. Aciliyet ve hız odaklı yaz.

ZORUNLU ek bölgeler:
1. "urgency" bölgesi: Aciliyet/kıtlık mesajı. FOMO tetikleyicileri kullan:
   - "Bu bölgede benzer mülkler X gün içinde satılıyor"
   - "Son 30 günde Y adet talep geldi"
   - "Bekleme = fiyat artışı riski"
   İçeriği kısa, vurucu ve sayısal tut.

2. "quick_highlights" bölgesi: 3-4 büyük vurgu kartı formatında.
   Her kart: Tek satır başlık + tek satır açıklama.
   Hızlı taranabilir, bullet-point tarzı.

DİĞER BÖLGELERDE:
- Cümleler KISA (max 15 kelime)
- Her paragraf bir aksiyon çağrısı ile bitsin
- "Hemen", "Bugün", "Şimdi" gibi aciliyet kelimeleri kullan
- Avantajları madde madde listele, paragraf yazma
- FAQ en fazla 3 soru olsun`,

    premium_sunum: `━━━ STİLE ÖZEL BÖLGE TALİMATLARI ━━━
Bu sunum PREMİUM stilindedir. Lüks, aspirasyonel ve seçkin bir ton kullan.

ZORUNLU ek bölgeler:
1. "lifestyle" bölgesi: Yaşam tarzı vizyonu.
   - Aspirasyonel dil: "Hayal ettiğiniz yaşam burada başlıyor"
   - Sosyal kanıt: Bölgedeki seçkin projeler, komşuluk profili
   - Duygusal bağlantı: Yaşam senaryoları (sabah kahvesi, akşam yürüyüşü)
   - "Bu sadece bir mülk değil, bir yaşam standardı" mesajı

2. "exclusive_offer" bölgesi: VIP davet tonu.
   - "Bu sunum sınırlı sayıda kişiye özel hazırlanmıştır"
   - Özel gösterim daveti
   - Kişiye özel finansman seçenekleri
   - Gizlilik ve ayrıcalık vurgusu

DİĞER BÖLGELERDE:
- "Seçkin", "ayrıcalıklı", "benzersiz", "eşsiz" gibi premium kelimeler kullan
- Referans ve sosyal kanıt her bölümde olsun
- Sayısal veriler lüks tonda sunulsun ("₺2.5M değerinde portföy" yerine "2.5 milyon TL değerinde seçkin portföy")`,

    guven_odakli: `━━━ STİLE ÖZEL BÖLGE TALİMATLARI ━━━
Bu sunum GÜVEN ODAKLI stilindedir. Danışman güvenilirliği ve risk eliminasyonu ön planda.

ZORUNLU ek bölgeler:
1. "testimonials" bölgesi: Sosyal kanıt ve başarı hikayeleri.
   - En az 2 müşteri referansı (gerçekçi, spesifik)
   - Başarı istatistikleri: satış oranı, müşteri memnuniyeti, ortalama satış süresi
   - "Birçok mülk sahibi bu sisteme güvendi" mesajı

2. "guarantees" bölgesi: Açık garantiler ve sıfır risk mesajları.
   - "Satış olmazsa 0₺" garantisi
   - Şeffaf süreç detayları (haftalık raporlama, her gösterim sonrası bilgilendirme)
   - Hukuki güvence
   - Kurumsal güvence (varsa ofis adı ile)

DİĞER BÖLGELERDE:
- Her bölümde danışmanın uzmanlığına atıf yap
- "Garantili", "şeffaf", "kanıtlanmış", "güvenli" kelimeleri sık kullan
- Risk azaltma mesajları her yerde olsun
- FAQ bölümünde müşteri endişelerini giderecek detaylı yanıtlar (en az 4 soru)`,

    minimalist: `━━━ STİLE ÖZEL BÖLGE TALİMATLARI ━━━
Bu sunum MİNİMALİST stilindedir. Sade, temiz, sadece esansiyel.

KURALLAR:
- Toplam en fazla 3-4 bölge oluştur
- Her bölgede en fazla 3 madde
- Cümleler en fazla 10 kelime
- Dekoratif ifade KULLANMA
- Sadece: Fiyat, konum, temel özellikler, iletişim
- FAQ bölümü EKLEME
- Tek CTA: Telefon numarası ve email

FORMAT:
Sayfa 1: Hero (fiyat + metrekare + konum)
Sayfa 2: 3 avantaj (tek satır)
Sayfa 3: Danışman bilgisi + iletişim`,
  };

  return talimatlar[stil] || '';
}

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
    `Aşağıdaki bilgilerle profesyonel bir gayrimenkul sunumu oluştur.`,

    `━━━ DANİŞMAN ━━━
- Ad: ${danisman.adSoyad}
- Telefon: ${danisman.telefon}
- Email: ${danisman.email}
${danisman.deneyim ? `- Deneyim: ${danisman.deneyim}` : ''}
${danisman.referans ? `- Referans: ${danisman.referans}` : ''}`,

    `━━━ GAYRİMENKUL ━━━\n${buildPropertySection(mulk)}`,

    getPurposeGuide(amac),

    getStyleGuide(stil, tema),

    getStilBolgeTalimatlari(stil),

    `━━━ MÜLK TÜRÜ VURGULARI ━━━\n${mulkTuruAciklamalari[mulk.tur]}`,

    getLengthGuide(uzunluk),

    `━━━ İÇERİK KURALLARI ━━━\n${buildPropertyRules(mulk)}

3. KALİTE KURALLARI:
   - Profesyonel danışman kaleminden yazılmış gibi olmalı
   - Somut veriler kullan (fiyat, metrekare, mesafe, yüzde)
   - Her bölüm farklı bir değer sunmalı — tekrar yapma
   - Mevsimsel referans: ${getMevsimText()}`,

    OUTPUT_FORMAT,

    `TOPLAM BÖLGE SAYISI: ${uzunlukKonfig[uzunluk].bolgeSayisi}`,

    buildKFESection(mulk),

    buildMarketDataSection(marketData),
  ];

  return sections.filter(Boolean).join('\n\n');
}
