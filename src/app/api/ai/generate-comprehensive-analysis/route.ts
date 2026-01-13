import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withSecurity } from '@/lib/security/withSecurity';
import { securityConfig } from '@/lib/security/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Türkiye şehir koordinatları
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'İstanbul': { lat: 41.0082, lng: 28.9784 },
  'Ankara': { lat: 39.9334, lng: 32.8597 },
  'İzmir': { lat: 38.4237, lng: 27.1428 },
  'Antalya': { lat: 36.8969, lng: 30.7133 },
  'Bursa': { lat: 40.1826, lng: 29.0665 },
  'Adana': { lat: 37.0000, lng: 35.3213 },
  'Gaziantep': { lat: 37.0662, lng: 37.3833 },
  'Konya': { lat: 37.8746, lng: 32.4932 },
  'Muğla': { lat: 37.2153, lng: 28.3636 },
  'Eskişehir': { lat: 39.7767, lng: 30.5206 },
};

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

        if (!GEMINI_API_KEY) {
          console.warn('⚠️ GEMINI_API_KEY bulunamadı, fallback kullanılıyor');
          return getFallbackResponse(location, propertyType);
        }

        try {
          const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

          // Koordinat bilgisi
          const coords = cityCoordinates[province] || { lat: 39.9334, lng: 32.8597 }; // Default Ankara

          // PHASE 1: Google Maps verilerini topla
          const mapsPrompt = `Sen bir Google Maps veri analisti sin. ${location} bölgesi için detaylı bir yerleşim analizi yap.

📍 HEDEF BÖLGE: ${location}
🗺️ Koordinatlar: ${coords.lat}, ${coords.lng}
🏠 Mülk Türü: ${propertyType}

Google Maps'i kullanarak bu konumun 3km çevresinde şunları tara ve listele:

1️⃣ EĞİTİM ALTYAPISI:
- Özel okullar (tam isim + mesafe)
- Devlet okulları (tam isim + mesafe)
- Üniversiteler (tam isim + mesafe)

2️⃣ ALIŞVERİŞ VE TİCARİ ALANLAR:
- AVM'ler (tam isim + mesafe)
- Büyük marketler (Migros, Carrefour vb.)
- Ticari caddeler

3️⃣ ULAŞIM:
- Metro/Tramvay istasyonları (hat + mesafe)
- Otobüs durakları (ana hatlar)
- Ana arterler ve çevreyolları

4️⃣ SOSYAL TESİSLER:
- Parklar (isim + alan)
- Kafeler ve restoranlar (popüler olanlar)
- Spor tesisleri
- Sahil (varsa)

5️⃣ SAĞLIK:
- Hastaneler (isim + mesafe)
- Sağlık merkezleri

⚠️ KRİTİK: 
✅ Sadece GERÇEK yer isimlerini kullan
✅ Mesafeleri belirt (m veya km)
✅ Google Maps'ten doğruladığın yerler
❌ Hayali yer ekleme

Çıktı formatı: Madde madde liste`;

          console.log('🔍 Google Maps verisi toplanıyor...');
          const mapsResult = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: mapsPrompt }] }],
            generationConfig: {
              temperature: 0.3, // Daha faktüel olması için düşük
              maxOutputTokens: 1000,
            },
            tools: [{ googleMaps: {} }] as any,
          });

          const googleMapsData = mapsResult.response.text().trim();
          console.log('✅ Google Maps verisi alındı:', googleMapsData.substring(0, 200) + '...');

          // Grounding metadata'yı logla
          const candidates = mapsResult.response.candidates || [];
          if (candidates.length > 0 && candidates[0].groundingMetadata) {
            const grounding = candidates[0].groundingMetadata;
            console.log('📍 Google Maps Grounding:', {
              location,
              chunksCount: grounding.groundingChunks?.length || 0,
              places: grounding.groundingChunks?.map((chunk: any) => chunk.maps?.title).filter(Boolean).slice(0, 5) || []
            });
          }

          // PHASE 2: Kapsamlı analiz oluştur
          const analysisPrompt = `Aşağıda sana 3 veri seti veriyorum. Bu veriler Google Maps scraping sonuçları, 
AI tarafından yorumlanmış konum avantajları, bölge kullanım potansiyelleri ve 
yerel analiz çıktılarından oluşmaktadır.

Bu verilerden hareketle aşağıdaki iki ana başlık için profesyonel, sunuma 
hazır ve satış odaklı içerik üret:

-----------------------------------------------------
1) Hedef Kitle Profili (3–5 alt segment içerecek)
-----------------------------------------------------

İçerik kuralları:

- Bölgenin demografik yapısını tahmini olarak modelle.
- Yakın çevredeki işlevlere bakarak (okul, üniversite, sahil, ana yol, iş merkezi,
sanayi, hastane, AVM vb.) hangi kitlelerin bu bölgede yaşamak isteyebileceğini çıkar.
- Gelir seviyesi, yaş aralığı, hayat tarzı, ulaşım alışkanlıkları ve satın alma motivasyonlarını belirt.
- "Bu bölgeye hangi tip alıcı neden ilgi duyar?" sorusuna net cevap ver.
- Bilgileri maddeli şekilde yaz; her madde 2–3 cümlelik olgun bir açıklama içersin.
- Kesin veri yoksa "mevcut verilere göre yüksek olasılıkla" gibi olasılık belirterek üret.

-----------------------------------------------------
2) Konum Analizi & Değerleme
(Nadir Fırsat + Konum Primi + Gelişim Potansiyeli)
-----------------------------------------------------

⚠️ ÖNEMLİ: Her bölüm MAKSIMUM 3-5 CÜMLE olacak. Kısa, öz ve etkili yaz.

2.1) NADİR FIRSAT (3-5 cümle)
- Bölgedeki arz-talep dengesini ve konumun ayrıştığı noktaları özetle.
- "Neden şimdi alınmalı?" sorusuna kısa ve net cevap ver.

2.2) KONUM PRİMİ (3-5 cümle)
- Konumun yarattığı değer artışı sebeplerini özetle.
- Ulaşım ve sosyal tesislere yakınlığın fiyata katkısını belirt.

2.3) GELİŞİM POTANSİYELİ (3-5 cümle)
- Bölgenin 3-5 yıllık gelişim potansiyelini özetle.
- Yeni projeler ve altyapı yatırımlarının etkisini belirt.

-----------------------------------------------------
VERİLER (bunları analiz et)
-----------------------------------------------------

[GOOGLE_MAPS_BILGILERI]
${googleMapsData}

[AI_KONUM_AVANTAJLARI]
${konumAvantajlari || 'Henüz belirtilmedi'}

[KULLANIM_POTANSIYELI]
${kullanimPotansiyeli || 'Henüz belirtilmedi'}

[AÇIKLAMA]
${aciklama || 'Henüz belirtilmedi'}

-----------------------------------------------------
ÇIKTI FORMATI:
Sadece aşağıdaki bölümleri üret. JSON formatında döndür:

{
  "hedefKitleProfili": [
    {"baslik": "Segment 1", "aciklama": "2-3 cümle"},
    {"baslik": "Segment 2", "aciklama": "2-3 cümle"}
  ],
  "nadirFirsat": "3-5 cümle KISA metin",
  "konumPrimi": "3-5 cümle KISA metin",
  "gelisimPotansiyeli": "3-5 cümle KISA metin"
}

⚠️ KRİTİK: Her kart içeriği MAKSIMUM 5 CÜMLE olacak. Uzun paragraflar YAZMA.
Ekstra yorum ekleme. Sunuma direkt yapışacak şekilde sade ve öz içerik ver. 
SADECE JSON döndür, başka hiçbir metin ekleme.`;

          console.log('🧠 Kapsamlı analiz oluşturuluyor...');
          const analysisResult = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 3000,
            },
          });

          const analysisText = analysisResult.response.text().trim();
          console.log('✅ Analiz tamamlandı');

          // JSON parse
          let parsedAnalysis: any = null;
          try {
            const cleaned = analysisText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match) {
              parsedAnalysis = JSON.parse(match[0]);
              console.log('✅ JSON parse başarılı');
              console.log('   - Hedef Kitle Segmentleri:', parsedAnalysis.hedefKitleProfili?.length || 0);
              console.log('   - Nadir Fırsat:', parsedAnalysis.nadirFirsat ? '✓' : '✗');
              console.log('   - Konum Primi:', parsedAnalysis.konumPrimi ? '✓' : '✗');
              console.log('   - Gelişim Potansiyeli:', parsedAnalysis.gelisimPotansiyeli ? '✓' : '✗');
            } else {
              console.error('❌ JSON yapısı bulunamadı');
              console.log('İlk 500 karakter:', analysisText.substring(0, 500));
            }
          } catch (e) {
            console.error('❌ JSON parse hatası:', e);
            console.log('Raw response:', analysisText.substring(0, 500));
          }

          if (!parsedAnalysis || !parsedAnalysis.hedefKitleProfili) {
            console.warn('⚠️ JSON parse başarısız veya eksik data, fallback kullanılıyor');
            if (!parsedAnalysis) {
              console.log('   → parsedAnalysis null');
            } else {
              console.log('   → hedefKitleProfili eksik');
            }
            return getFallbackResponse(location, propertyType);
          }

          registerActualCost(securityConfig.defaultRequestCost * 0.5); // Daha yüksek cost

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

        } catch (geminiError: any) {
          console.error('❌ Gemini API hatası:', geminiError);
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
        nadirFirsat: `${location} bölgesi, arz-talep dengesi açısından dikkat çekici bir fırsat sunuyor. Kaliteli projelere olan yüksek talep ve erken yatırım avantajı, bu konumu öne çıkarıyor. Bölgedeki gelişmeler henüz tamamlanmadan pozisyon almak, gelecekteki değer artışından fayda sağlayabilir.`,
        konumPrimi: `${location}, ana arterlere ve toplu taşımaya yakınlığıyla konum primi yaratıyor. Yürüme mesafesindeki sosyal tesisler ve alışveriş olanakları, fiyatlamaya önemli katkı sağlıyor. Yakın çevredeki referans satışlar, konumun değer artış hızını destekliyor.`,
        gelisimPotansiyeli: `${location} bölgesi, altyapı yatırımları ve yeni projelerle güçlü gelişim potansiyeli gösteriyor. Ticari alanların açılması ve eğitim kurumlarının gelişimi, bölgeye olan ilgiyi artırıyor. 3-5 yıllık projeksiyon, imar planları ve kentsel yayılma yönü açısından olumlu sinyaller veriyor.`
      },
      googleMapsData: `Google Maps verisi alınamadı, fallback kullanıldı.`
    }
  });
}

