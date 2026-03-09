import { NextRequest, NextResponse } from 'next/server';
import { callLLM, isLLMAvailable } from '@/lib/ai/fal-llm';
import { withSecurity } from '@/lib/security/withSecurity';
import { securityConfig } from '@/lib/security/config';

interface AnalysisRequest {
  province: string;
  district?: string;
  neighborhood?: string;
  fullAddress: string;
  propertyType: string;
  konumAvantajlari?: string;
  kullanimPotansiyeli?: string;
  aciklama?: string;
}

export async function POST(request: NextRequest) {
  return withSecurity<AnalysisRequest>(
    request,
    async ({ body, registerActualCost }) => {
      try {
        if (!body?.province || !body?.propertyType) {
          return NextResponse.json(
            { error: 'İl ve mülk türü bilgisi gerekli' },
            { status: 400 }
          );
        }

        const { province, district, neighborhood, fullAddress, propertyType, konumAvantajlari, kullanimPotansiyeli, aciklama } = body;
        const location = [neighborhood, district, province].filter(Boolean).join(', ');

        if (!isLLMAvailable()) {
          console.warn('⚠️ FAL_KEY bulunamadı, fallback kullanılıyor');
          return getFallbackResponse(location, propertyType);
        }

        try {
          // PHASE 1: Bölge verileri toplama (Google Maps grounding olmadan, LLM bilgisiyle)
          const mapsPrompt = `Sen bir Google Maps veri analistisin. ${location} bölgesi için detaylı bir yerleşim analizi yap.

📍 HEDEF BÖLGE: ${location}
🏠 Mülk Türü: ${propertyType}

Bu konumun 3km çevresinde şunları analiz et ve listele:

1️⃣ EĞİTİM ALTYAPISI: Özel/devlet okulları, üniversiteler (isim + tahmini mesafe)
2️⃣ ALIŞVERİŞ VE TİCARİ ALANLAR: AVM'ler, büyük marketler, ticari caddeler
3️⃣ ULAŞIM: Metro/tramvay istasyonları, otobüs durakları, ana arterler
4️⃣ SOSYAL TESİSLER: Parklar, kafeler, spor tesisleri, sahil (varsa)
5️⃣ SAĞLIK: Hastaneler, sağlık merkezleri

Madde madde liste formatında yaz. Türkçe yaz.`;

          console.log('🔍 Bölge verisi toplanıyor...');
          const googleMapsData = await callLLM({
            prompt: mapsPrompt,
            temperature: 0.3,
            maxTokens: 1000,
          });

          console.log('✅ Bölge verisi alındı:', googleMapsData.substring(0, 200) + '...');

          // PHASE 2: Kapsamlı analiz oluştur
          const analysisPrompt = `Aşağıda sana 3 veri seti veriyorum.

Bu verilerden hareketle aşağıdaki iki ana başlık için profesyonel, sunuma
hazır ve satış odaklı içerik üret:

-----------------------------------------------------
1) Hedef Kitle Profili (3–5 alt segment içerecek)
-----------------------------------------------------

İçerik kuralları:
- Bölgenin demografik yapısını tahmini olarak modelle.
- Hangi kitlelerin bu bölgede yaşamak isteyebileceğini çıkar.
- Gelir seviyesi, yaş aralığı, hayat tarzı, satın alma motivasyonlarını belirt.
- Bilgileri maddeli şekilde yaz; her madde 2–3 cümlelik açıklama içersin.

-----------------------------------------------------
2) Konum Analizi & Değerleme
-----------------------------------------------------

⚠️ ÖNEMLİ: Her bölüm MAKSIMUM 3-5 CÜMLE olacak. Kısa, öz ve etkili yaz.

2.1) NADİR FIRSAT (3-5 cümle) - Arz-talep dengesi, "Neden şimdi alınmalı?"
2.2) KONUM PRİMİ (3-5 cümle) - Değer artışı sebepleri, ulaşım/sosyal tesis yakınlığı
2.3) GELİŞİM POTANSİYELİ (3-5 cümle) - 3-5 yıllık gelişim, yeni projeler

-----------------------------------------------------
VERİLER
-----------------------------------------------------

[BÖLGE_BİLGİLERİ]
${googleMapsData || 'Veri alınamadı'}

[KONUM_AVANTAJLARI]
${konumAvantajlari || 'Henüz belirtilmedi'}

[KULLANIM_POTANSİYELİ]
${kullanimPotansiyeli || 'Henüz belirtilmedi'}

[AÇIKLAMA]
${aciklama || 'Henüz belirtilmedi'}

-----------------------------------------------------
ÇIKTI FORMATI:
Sadece JSON döndür:

{
  "hedefKitleProfili": [
    {"baslik": "Segment 1", "aciklama": "2-3 cümle"},
    {"baslik": "Segment 2", "aciklama": "2-3 cümle"}
  ],
  "nadirFirsat": "3-5 cümle KISA metin",
  "konumPrimi": "3-5 cümle KISA metin",
  "gelisimPotansiyeli": "3-5 cümle KISA metin"
}

SADECE JSON döndür, başka hiçbir metin ekleme.`;

          console.log('🧠 Kapsamlı analiz oluşturuluyor...');
          const analysisText = await callLLM({
            prompt: analysisPrompt,
            temperature: 0.7,
            maxTokens: 3000,
          });

          console.log('✅ Analiz tamamlandı');

          let parsedAnalysis: any = null;
          try {
            const cleaned = analysisText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match) {
              parsedAnalysis = JSON.parse(match[0]);
              console.log('✅ JSON parse başarılı');
            }
          } catch (e) {
            console.error('❌ JSON parse hatası:', e);
          }

          if (!parsedAnalysis || !parsedAnalysis.hedefKitleProfili) {
            console.warn('⚠️ JSON parse başarısız, fallback kullanılıyor');
            return getFallbackResponse(location, propertyType);
          }

          registerActualCost(securityConfig.defaultRequestCost * 0.5);

          return NextResponse.json({
            success: true,
            data: {
              hedefKitleProfili: parsedAnalysis.hedefKitleProfili || [],
              marketAnalysisCards: {
                nadirFirsat: parsedAnalysis.nadirFirsat || '',
                konumPrimi: parsedAnalysis.konumPrimi || '',
                gelisimPotansiyeli: parsedAnalysis.gelisimPotansiyeli || ''
              },
              googleMapsData: googleMapsData
            }
          });

        } catch (apiError: any) {
          console.error('❌ AI API hatası:', apiError);
          return getFallbackResponse(location, propertyType);
        }

      } catch (error: any) {
        console.error('❌ Comprehensive analysis hatası:', error);
        return NextResponse.json(
          { error: error.message || 'Analiz yapılamadı' },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) =>
        [body?.province, body?.district, body?.neighborhood].filter(Boolean).join(', ') || ip,
      estimateCost: () => securityConfig.defaultRequestCost * 0.5,
    }
  );
}

function getFallbackResponse(location: string, propertyType: string) {
  console.log('🔄 Fallback response kullanılıyor:', location, propertyType);
  return NextResponse.json({
    success: true,
    data: {
      hedefKitleProfili: [
        {
          baslik: 'Yatırımcılar',
          aciklama: `${location} bölgesindeki değer artış potansiyelini değerlendiren yatırımcılar için ideal.`
        },
        {
          baslik: 'Aileler',
          aciklama: `Güvenli, konforlu ve sosyal olanaklara yakın yaşam arayan aileler için uygun.`
        },
        {
          baslik: 'Profesyoneller',
          aciklama: `İş merkezlerine kolay ulaşım arayan genç profesyoneller için cazip.`
        }
      ],
      marketAnalysisCards: {
        nadirFirsat: `${location} bölgesi, arz-talep dengesi açısından dikkat çekici bir fırsat sunuyor. Kaliteli projelere olan yüksek talep ve erken yatırım avantajı, bu konumu öne çıkarıyor.`,
        konumPrimi: `${location}, ana arterlere ve toplu taşımaya yakınlığıyla konum primi yaratıyor. Yürüme mesafesindeki sosyal tesisler ve alışveriş olanakları, fiyatlamaya önemli katkı sağlıyor.`,
        gelisimPotansiyeli: `${location} bölgesi, altyapı yatırımları ve yeni projelerle güçlü gelişim potansiyeli gösteriyor. 3-5 yıllık projeksiyon olumlu sinyaller veriyor.`
      },
      googleMapsData: `Bölge verisi alınamadı, fallback kullanıldı.`
    }
  });
}
