import { TemaTuru, SunumStili } from '@/types';

/** Tema tonu tanımları */
export const temaTanimlari: Record<TemaTuru, string> = {
  modern: 'Çağdaş, yenilikçi, dinamik bir dil. Teknolojik avantajlar, dijital süreçler ve hız vurgulanmalı.',
  kurumsal: 'Profesyonel, güvenilir, ciddi bir ton. Rakamsal veriler, analizler, yatırım hesaplamaları vurgulanmalı.',
  luks: 'Prestijli, seçkin ve yüksek standartlı bir ton. Özel konum, lüks hizmet deneyimi ve güven algısı ön planda olmalı.',
};

/** Sunum stili detayları */
export const sunumStiliBilgileri: Record<SunumStili, {
  ad: string;
  aciklama: string;
  odaklar: string[];
  gorevler: string[];
}> = {
  detayli_analiz: {
    ad: 'Portföy Almak - Detaylı Analiz',
    aciklama: 'Satıcıya profesyonel güven vermek için kapsamlı analiz, fiyatlandırma önerileri ve stratejik yol haritası sun.',
    odaklar: [
      'Konum analizi, fiyat trendleri ve benzer satış karşılaştırmaları',
      'Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerini ayrıntılı doldur',
      'Uzun form anlatım; grafiksel/veri odaklı içerik, güven veren CTA',
    ],
    gorevler: [
      'Detaylı analiz stilinde her bölümde veri ve mantıklı açıklamalar kullan.',
      'Fiyat tahmini ve satım planı bölümünde aralıklar, süreler ve öneriler mutlaka olsun.',
      'Reklam kanalları bölümünde hem dijital hem kurumsal ağları listele.',
    ],
  },
  hizli_satis: {
    ad: 'Portföy Satmak - Hızlı Satış',
    aciklama: 'Potansiyel alıcıya hızlı karar aldıracak şekilde net, vurucu ve avantaj odaklı sunum hazırla.',
    odaklar: [
      'Hero, özellikler ve CTA bölümlerinde güçlü aksiyon çağrıları',
      'Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerini madde madde, hızlı okunur formatta sun',
      'Fiyat ve avantajlar bölümünde aciliyet / sınırlı fırsat vurgusu',
    ],
    gorevler: [
      'Hızlı satış stilinde cümleleri kısa ve etkileyici tut, her bölümde aksiyon vurgusu olsun.',
      'Reklam kanallarında yoğun dijital erişim ve hızlı geri dönüş metrikleri belirt.',
      'Kullanım potansiyeli bölümünü yatırım + yaşam senaryoları ile hızlı okunur formatta yaz.',
    ],
  },
  prestij_sunum: {
    ad: 'Prestij Sunum',
    aciklama: 'Yüksek değerli portföyler için lüks algısı, sosyal kanıt ve elit hizmet yaklaşımını öne çıkar.',
    odaklar: [
      'Siyah/altın/beyaz kontrastlı lüks ton, seçkin dil',
      'Simetrik yapı: Hero, danışman profili, portföy görselleri, güven alanı, CTA',
      'Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerinde premium ton kullan',
    ],
    gorevler: [
      'Prestij stilinde her bölümde seçkin müşterilere hitap eden dil kullan, referans ve sosyal kanıt ekle.',
      'Tanıtım stratejisinde davet usulü etkinlikler ve network vurguları olsun.',
      'Reklam kanallarında lüks portföyler için uygun seçkin mecraları belirt (lux dergi, özel ağlar vb.).',
    ],
  },
};

/**
 * Stil+tema kombinasyonuna göre detaylı yazım rehberi döndürür.
 * Yeni şablonlar eklendikçe buraya eklenir.
 */
export function getStyleGuide(stil: SunumStili, tema: TemaTuru): string {
  const stilInfo = sunumStiliBilgileri[stil];
  const temaInfo = temaTanimlari[tema];

  const kombinasyonRehberleri: Record<string, string> = {
    'detayli_analiz_modern': 'Yenilikçi ve veri odaklı. "Dijital pazarlama stratejimiz...", "Akıllı fiyatlandırma analizi..." gibi ifadeler kullan.',
    'detayli_analiz_kurumsal': 'Formal ve analitik. "Karşılaştırmalı piyasa verilerine göre...", "Yatırım analizi..." ifadeleri kullan.',
    'detayli_analiz_luks': 'Elit ve detaylı. "Seçkin konumuyla...", "Eşsiz yaşam standardı..." ifadeleri kullan.',
    'hizli_satis_modern': 'Dinamik ve aksiyon odaklı. "Hemen karar verin!", "Bu fırsat kaçmadan..." kısa cümleler.',
    'hizli_satis_kurumsal': 'Profesyonel ama ikna edici. "Veriler gösteriyor ki...", "Doğru zamanda doğru yatırım" vurgusu.',
    'hizli_satis_luks': 'Aciliyet + prestij. "Sınırlı sayıda...", "Ayrıcalıklı erişim..." lüks urgency.',
    'prestij_sunum_modern': 'Modern lüks. "Premium yaşam deneyimi...", "Tasarım ve teknolojinin buluşması..."',
    'prestij_sunum_kurumsal': 'Kurumsal prestij. "A sınıfı yatırım fırsatı...", "Portföyünüzün taç mücevheri..."',
    'prestij_sunum_luks': 'Ultra lüks. "Benzersiz...", "Dünya standartlarında...", "Sadece seçkinlere özel..."',
  };

  const key = `${stil}_${tema}`;
  const kombinasyonNotu = kombinasyonRehberleri[key] || '';

  return `SUNUM STİLİ: ${stilInfo.ad}
${stilInfo.aciklama}

TEMA TONU: ${temaInfo}

ODAK NOKTALARI:
${stilInfo.odaklar.map((o) => `- ${o}`).join('\n')}

YAZIM GÖREVLERİ:
${stilInfo.gorevler.map((g) => `- ${g}`).join('\n')}

${kombinasyonNotu ? `KOMBİNASYON REHBERİ: ${kombinasyonNotu}` : ''}`;
}
