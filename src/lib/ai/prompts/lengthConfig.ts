import { SunumUzunlugu } from '@/types';

export const uzunlukKonfig: Record<SunumUzunlugu, {
  bolgeSayisi: string;
  detay: string;
}> = {
  kisa: {
    bolgeSayisi: '3-4',
    detay: 'Ana özellikler, temel bilgiler, hızlı karar için gerekli bilgiler. Net ve öz.',
  },
  orta: {
    bolgeSayisi: '5-7',
    detay: 'Hikayeleştirilmiş sunum, çevre analizi, avantajlar ve değer önerisi detaylı.',
  },
  uzun: {
    bolgeSayisi: '8-12',
    detay: 'Detaylı analiz, yatırım hesaplamaları, bölge analizi, çevre avantajları, güven inşası için kapsamlı bilgi.',
  },
};

export function getLengthGuide(uzunluk: SunumUzunlugu): string {
  const config = uzunlukKonfig[uzunluk];
  return `UZUNLUK: ${uzunluk === 'kisa' ? 'Kısa' : uzunluk === 'orta' ? 'Orta' : 'Uzun'}
- Toplam bölge sayısı: ${config.bolgeSayisi}
- ${config.detay}`;
}
