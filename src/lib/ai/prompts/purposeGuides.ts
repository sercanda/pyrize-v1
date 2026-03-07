import { SunumAmaci } from '@/types';

/** Amaç bazlı içerik direktifleri */
export const amacDirektifler: Record<SunumAmaci, {
  aciklama: string;
  vurgu: string;
  yasaklar: string;
}> = {
  portfoy_almak: {
    aciklama: 'Mülk sahibini ikna ederek portföye almak. Güven, profesyonellik ve değer kanıtlama ön planda.',
    vurgu: `- Gayrimenkulün gerçek değerini ortaya çıkaracağını göster
- Profesyonel pazarlama stratejini açıkla
- "Satış olmazsa ücret yok" garantisi ver
- Danışman olarak deneyim ve referanslarını sun
- Mülk sahibinin karşılaşacağı sorunları ve senin çözümlerini anlat`,
    yasaklar: `- Müşteriye satış yapmaya çalışmıyorsun, mülk sahibine güven veriyorsun
- "Satın alın" gibi ifadeler KULLANMA
- Alıcı odaklı avantajları değil, satıcı odaklı avantajları vurgula`,
  },
  portfoy_satmak: {
    aciklama: 'Potansiyel alıcıları ikna ederek mülkü satmak. Avantajlar, yatırım değeri ve yaşam kalitesi ön planda.',
    vurgu: `- Mülkün avantajlarını ve yaşam kalitesini öne çıkar
- Yatırım değeri ve gelecek potansiyelini vurgula
- Konum avantajlarını detaylandır
- Fiyat-değer oranının cazibesini göster
- Karar verme sürecini kolaylaştır, aciliyet hissi yarat`,
    yasaklar: `- Satıcıya güven vermeye çalışmıyorsun, alıcıya satış yapıyorsun
- "Portföyümüze alacağız" gibi ifadeler KULLANMA
- Danışman deneyimini değil, mülk avantajlarını vurgula`,
  },
};

export function getPurposeGuide(amac: SunumAmaci): string {
  const direktif = amacDirektifler[amac];
  return `SUNUM AMACI: ${direktif.aciklama}

VURGULAMA:
${direktif.vurgu}

YASAKLAR:
${direktif.yasaklar}`;
}
