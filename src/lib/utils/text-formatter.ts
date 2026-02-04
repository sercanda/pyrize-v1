/**
 * Metin düzenleme ve imla düzeltme fonksiyonları
 */

/**
 * Türkçe imla kurallarına göre metni düzeltir
 */
export function fixTurkishSpelling(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  let fixed = text;
  
  // Büyük/küçük harf düzeltmeleri
  // Cümle başlarını büyük harfle başlat
  fixed = fixed.replace(/(^|[.!?]\s+)([a-zçğıöşü])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  // Yaygın yazım hataları
  const corrections: Record<string, string> = {
    // Büyük I/i hataları
    'ılan': 'ilan',
    'ılk': 'ilk',
    'ıyi': 'iyi',
    'ıçin': 'için',
    'ıse': 'ise',
    'ıster': 'ister',
    
    // Küçük İ/i hataları
    'İlan': 'ilan',
    'İlk': 'ilk',
    'İyi': 'iyi',
    'İçin': 'için',
    
    // Yaygın yazım hataları
    'degil': 'değil',
    'deger': 'değer',
    'ogrenci': 'öğrenci',
    'ogretmen': 'öğretmen',
    'gosterim': 'gösterim',
    'gorsel': 'görsel',
    'gorunum': 'görünüm',
    'surec': 'süreç',
    'sure': 'süre',
    'musteri': 'müşteri',
    'mulk': 'mülk',
    'guzel': 'güzel',
    'guvenli': 'güvenli',
    'guven': 'güven',
    'cozum': 'çözüm',
    'calısma': 'çalışma',
    'calisma': 'çalışma',
    'satis': 'satış',
    'satiş': 'satış',
    'danışman': 'danışman',
    'danisman': 'danışman',
    'profesyonel': 'profesyonel',
    'profesyonal': 'profesyonel',
    'yil': 'yıl',
    'yillik': 'yıllık',
    'tecrube': 'tecrübe',
    'tecrübe': 'tecrübe',
    'deneyim': 'deneyim',
    'basari': 'başarı',
    'başarı': 'başarı',
    'odul': 'ödül',
    'ödül': 'ödül',
    'referans': 'referans',
    
    // Noktalama hataları
    'yil.': 'yıl.',
    'yil,': 'yıl,',
    'yillik.': 'yıllık.',
    'yillik,': 'yıllık,',
  };
  
  // Kelime bazlı düzeltmeler (kelime sınırlarında)
  Object.entries(corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    fixed = fixed.replace(regex, (match) => {
      // Orijinal kelimenin büyük/küçük harf durumunu koru
      if (match[0] === match[0].toUpperCase()) {
        return correct.charAt(0).toUpperCase() + correct.slice(1);
      }
      return correct;
    });
  });
  
  // Çift boşlukları tek boşluğa çevir
  fixed = fixed.replace(/\s{2,}/g, ' ');
  
  // Noktalama işaretlerinden önce boşluk olmamalı
  fixed = fixed.replace(/\s+([.,!?;:])/g, '$1');
  
  // Noktalama işaretlerinden sonra boşluk olmalı (eğer yoksa)
  fixed = fixed.replace(/([.,!?;:])([a-zA-ZçğıöşüÇĞİÖŞÜ])/g, '$1 $2');
  
  // Başta ve sonda boşluk temizle
  fixed = fixed.trim();
  
  return fixed;
}

/**
 * Deneyim metnini düzeltir ve formatlar
 */
export function formatDeneyim(deneyim: string): string {
  if (!deneyim) return deneyim;
  
  let formatted = fixTurkishSpelling(deneyim);
  
  // Yıl ifadelerini düzelt
  formatted = formatted.replace(/(\d+)\s*(yil|yıl)/gi, '$1 yıl');
  formatted = formatted.replace(/(\d+)\s*(yillik|yıllık)/gi, '$1 yıllık');
  
  // "+" işaretini düzelt
  formatted = formatted.replace(/(\d+)\s*\+\s*(yil|yıl)/gi, '$1+ yıl');
  
  // Yaygın kısaltmaları düzelt
  formatted = formatted.replace(/\byil\b/gi, 'yıl');
  formatted = formatted.replace(/\byillik\b/gi, 'yıllık');
  formatted = formatted.replace(/\btecrube\b/gi, 'tecrübe');
  
  return formatted;
}

/**
 * Ödüller metnini düzeltir ve formatlar
 */
export function formatOduller(oduller: string | string[]): string | string[] {
  if (!oduller) return oduller;
  
  if (Array.isArray(oduller)) {
    return oduller.map(odul => fixTurkishSpelling(odul));
  }
  
  let formatted = fixTurkishSpelling(oduller);
  
  // Yaygın ödül ifadelerini düzelt
  formatted = formatted.replace(/\byilin\b/gi, 'yılın');
  formatted = formatted.replace(/\bayin\b/gi, 'ayın');
  formatted = formatted.replace(/\ben iyi\b/gi, 'en iyi');
  formatted = formatted.replace(/\btop\s*(\d+)/gi, 'Top $1');
  
  return formatted;
}

/**
 * Referans metnini düzeltir ve formatlar
 */
export function formatReferans(referans: string): string {
  if (!referans) return referans;
  
  let formatted = fixTurkishSpelling(referans);
  
  // Yaygın referans ifadelerini düzelt
  formatted = formatted.replace(/\bmemnun\b/gi, 'memnun');
  formatted = formatted.replace(/\bmüşteri\b/gi, 'müşteri');
  formatted = formatted.replace(/\bmusteri\b/gi, 'müşteri');
  
  return formatted;
}


