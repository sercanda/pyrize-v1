/**
 * Haftalık Rapor için AI Servisi
 * Performans yorumu, strateji önerisi ve haftalık özet oluşturur
 */

import { HaftalikRaporVerisi } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const useOpenRouter = OPENROUTER_API_KEY && OPENROUTER_API_KEY !== "your_openrouter_api_key_here" && OPENROUTER_API_KEY !== "";

interface WeeklyReportAIOutput {
  aiPerformansYorumu: string;
  aiStratejiOnerisi: string;
  aiHaftalikOzet: string;
}

function buildWeeklyReportPrompt(rapor: HaftalikRaporVerisi): string {
  const {
    toplamGoruntulenme,
    haftalikGoruntulenme,
    toplamFavoriSayisi,
    haftalikFavoriArtisi,
    toplamMesajSayisi,
    tiklanmaSayisi,
    erisimReach,
    tiklanmaOraniCTR,
    harcananButce,
    tiklanmaBasiMaliyetCPC,
    formDolduranKisiSayisi,
    whatsappTiklamaSayisi,
    arayanKisiSayisi,
    realMusteriDonusu,
    yerindeGosterimSayisi,
    demoZiyaretSayisi,
    yapilanTeklifSayisi,
    ciddiAliciSayisi,
    redOlanTeklifSayisi,
    saticiYorumu,
    potansiyelAliciGeriBildirimleri,
    gorulenAnaProblemler
  } = rapor;

  // CTR hesaplama
  const hesaplananCTR = toplamGoruntulenme > 0
    ? ((tiklanmaSayisi / toplamGoruntulenme) * 100).toFixed(2)
    : '0.00';

  // Dönüşüm oranı
  const donusumOrani = erisimReach > 0
    ? ((realMusteriDonusu / erisimReach) * 100).toFixed(2)
    : '0.00';

  return `
Sen profesyonel bir emlak pazarlama analisti ve stratejistisin. Bir haftalık performans raporu için AI destekli analiz yapman gerekiyor.

HAFTALIK PERFORMANS VERİLERİ:

📊 Sahibinden.com / İlan Performansı:
- Toplam Görüntülenme: ${toplamGoruntulenme.toLocaleString('tr-TR')}
- Haftalık Görüntülenme: ${haftalikGoruntulenme.toLocaleString('tr-TR')}
- Toplam Favori: ${toplamFavoriSayisi.toLocaleString('tr-TR')}
- Haftalık Favori Artışı: ${haftalikFavoriArtisi.toLocaleString('tr-TR')}
- Toplam Mesaj: ${toplamMesajSayisi.toLocaleString('tr-TR')}
- Toplam Arama: ${rapor.toplamAramaSayisi?.toLocaleString('tr-TR') || 0}

📈 Reklam Performansı:
- Platform: ${rapor.reklamPlatformu || 'Belirtilmemiş'}
- Harcanan Bütçe: ₺${harcananButce.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Görüntülenme (Impressions): ${rapor.goruntulenmeImpressions?.toLocaleString('tr-TR') || 0}
- Tıklama: ${tiklanmaSayisi.toLocaleString('tr-TR')}
- Erişim (Reach): ${erisimReach.toLocaleString('tr-TR')}
- CTR: %${tiklanmaOraniCTR > 0 ? tiklanmaOraniCTR.toFixed(2) : hesaplananCTR}
- CPC: ₺${tiklanmaBasiMaliyetCPC.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Form Dolduran: ${formDolduranKisiSayisi.toLocaleString('tr-TR')}
- WhatsApp Tıklama: ${whatsappTiklamaSayisi.toLocaleString('tr-TR')}
- Arayan Kişi: ${arayanKisiSayisi.toLocaleString('tr-TR')}
- Real Müşteri Dönüşü: ${realMusteriDonusu.toLocaleString('tr-TR')}

🏢 Fiziksel Geri Dönüşler:
- Yerinde Gösterim: ${yerindeGosterimSayisi.toLocaleString('tr-TR')}
- Demo/Ziyaret: ${demoZiyaretSayisi.toLocaleString('tr-TR')}
- Yapılan Teklif: ${yapilanTeklifSayisi.toLocaleString('tr-TR')}
- Ciddi Alıcı: ${ciddiAliciSayisi.toLocaleString('tr-TR')}
- Red Olan Teklif: ${redOlanTeklifSayisi.toLocaleString('tr-TR')}

💬 Geri Bildirimler:
${saticiYorumu ? `- Satıcı Yorumu: ${saticiYorumu}` : ''}
${potansiyelAliciGeriBildirimleri ? `- Potansiyel Alıcı Geri Bildirimleri: ${potansiyelAliciGeriBildirimleri}` : ''}
${gorulenAnaProblemler ? `- Görülen Ana Problemler: ${gorulenAnaProblemler}` : ''}

GÖREVİN:

1. AI PERFORMANS YORUMU:
   - Görüntülenme sayısı düşük mü yüksek mü? (Sektör ortalaması ile karşılaştır)
   - Tıklama oranı (CTR) iyi mi? (Emlak sektörü için %1-3 arası normal, %3+ iyi)
   - Reklam bütçesine göre geri dönüş verimli mi? (CPC ve dönüşüm oranına bak)
   - Favori artışı pozitif mi?
   - Mesaj sayısı yeterli mi?
   - Fiziksel geri dönüşler (gösterim, ziyaret) yeterli mi?
   - Real müşteri dönüşü oranı nasıl?
   
   Bu analizi profesyonel, objektif ve yapıcı bir dille yaz. Rakamsal karşılaştırmalar yap.

2. AI STRATEJİ ÖNERİSİ:
   Aşağıdaki sorulara cevap verir gibi yaz:
   - Fiyat revizyonu gerekli mi? (Görüntülenme düşükse, favori azsa, mesaj azsa fiyat yüksek olabilir)
   - Görsellerde değişim önerilmeli mi? (Tıklama oranı düşükse görsel kalitesi sorunlu olabilir)
   - Reklam bütçesi artırılmalı mı? (CTR iyi ama erişim düşükse bütçe artırılabilir)
   - Platform değişikliği gerekli mi? (Mevcut platform performansı düşükse alternatifler düşünülebilir)
   - İlan başlığı/açıklaması revize edilmeli mi?
   - Hedef kitle genişletilmeli mi?
   
   Her öneri için kısa gerekçe belirt.

3. AI HAFTALIK ÖZET:
   Bu hafta portföyünüzün toplam kaç kişiye ulaştığını, kaç kişinin tıkladığını, kaç adet ciddi dönüş sağlandığını özetle.
   Mevcut gidişat satışa doğru ilerliyor mu yoksa revizyon önerilmekte mi? Kısa ve net bir özet (2-3 cümle).

ÇIKTI FORMAT:
JSON formatında döndür:
{
  "aiPerformansYorumu": "Bu haftaki ilan performans yorumu... (3-4 paragraf)",
  "aiStratejiOnerisi": "Strateji önerileri... (4-5 madde, her biri kısa paragraf)",
  "aiHaftalikOzet": "Haftalık özet... (2-3 cümle)"
}

DİL: Türkçe, profesyonel, objektif, yapıcı.
TON: Analitik, danışmanlık odaklı, veriye dayalı.
`;
}

export async function generateWeeklyReportAI(
  rapor: HaftalikRaporVerisi
): Promise<WeeklyReportAIOutput> {
  if (!useOpenRouter) {
    // Mock data döndür
    return {
      aiPerformansYorumu: `Bu hafta ilanınız ${rapor.toplamGoruntulenme.toLocaleString('tr-TR')} kez görüntülendi ve ${rapor.tiklanmaSayisi.toLocaleString('tr-TR')} tıklama aldı. CTR oranı %${(rapor.tiklanmaOraniCTR || 0).toFixed(2)} seviyesinde. Reklam bütçesi ₺${rapor.harcananButce.toLocaleString('tr-TR')} ile ${rapor.realMusteriDonusu} gerçek müşteri dönüşü sağlandı.`,
      aiStratejiOnerisi: `1. Fiyat revizyonu: Görüntülenme sayısı sektör ortalamasının altındaysa fiyat gözden geçirilebilir.\n2. Görsel kalitesi: Tıklama oranı düşükse görseller ve başlık optimize edilebilir.\n3. Reklam bütçesi: CTR iyi ama erişim düşükse bütçe artırılabilir.`,
      aiHaftalikOzet: `Bu hafta portföyünüz ${rapor.toplamGoruntulenme.toLocaleString('tr-TR')} kişiye ulaştı, ${rapor.tiklanmaSayisi.toLocaleString('tr-TR')} kişi tıkladı ve ${rapor.realMusteriDonusu} adet ciddi dönüş sağlandı. Mevcut gidişat satışa doğru ilerliyor.`
    };
  }

  try {
    const prompt = buildWeeklyReportPrompt(rapor);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Pyrize Haftalık Rapor AI'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast:free',
        messages: [
          {
            role: 'system',
            content: 'Sen profesyonel bir emlak pazarlama analisti ve stratejistisin. Verilen performans verilerini analiz edip objektif yorumlar ve strateji önerileri sunarsın.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // JSON parse et
    try {
      const parsed = JSON.parse(content);
      return {
        aiPerformansYorumu: parsed.aiPerformansYorumu || '',
        aiStratejiOnerisi: parsed.aiStratejiOnerisi || '',
        aiHaftalikOzet: parsed.aiHaftalikOzet || ''
      };
    } catch (parseError) {
      // JSON parse edilemezse içeriği böl
      const sections = content.split(/(?=AI PERFORMANS YORUMU|AI STRATEJİ ÖNERİSİ|AI HAFTALIK ÖZET)/i);
      return {
        aiPerformansYorumu: sections.find((s: string) => s.includes('PERFORMANS'))?.replace(/AI PERFORMANS YORUMU:?/i, '').trim() || '',
        aiStratejiOnerisi: sections.find((s: string) => s.includes('STRATEJİ'))?.replace(/AI STRATEJİ ÖNERİSİ:?/i, '').trim() || '',
        aiHaftalikOzet: sections.find((s: string) => s.includes('ÖZET'))?.replace(/AI HAFTALIK ÖZET:?/i, '').trim() || ''
      };
    }
  } catch (error) {
    console.error('Haftalık rapor AI oluşturma hatası:', error);
    // Fallback mock data
    return {
      aiPerformansYorumu: `Bu hafta ilan performansınız analiz edildi. Toplam ${rapor.toplamGoruntulenme.toLocaleString('tr-TR')} görüntülenme ve ${rapor.tiklanmaSayisi.toLocaleString('tr-TR')} tıklama kaydedildi.`,
      aiStratejiOnerisi: 'Performans verileriniz analiz ediliyor. Detaylı öneriler için lütfen tekrar deneyin.',
      aiHaftalikOzet: `Bu hafta ${rapor.toplamGoruntulenme.toLocaleString('tr-TR')} kişiye ulaşıldı ve ${rapor.realMusteriDonusu} gerçek müşteri dönüşü sağlandı.`
    };
  }
}

