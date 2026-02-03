import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security/withSecurity';
import { securityConfig } from '@/lib/security/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface AnalysisRequest {
  province: string;
  district?: string;
  neighborhood?: string;
  mulkTuru: string;
}

const estimateCost = (body: AnalysisRequest | null | undefined) => {
  if (!body) return securityConfig.defaultRequestCost * 0.2;
  return Math.min(securityConfig.defaultRequestCost * 0.2, securityConfig.budget.dailyLimit);
};

const mulkLabels: Record<string, string> = {
  daire: "daire",
  arsa: "arsa",
  villa: "villa",
  isyeri: "işyeri",
  ticari: "ticari gayrimenkul",
  kompleks: "karma proje",
};

// Türkiye şehir merkezleri koordinatları (yaklaşık)
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

export async function POST(request: NextRequest) {
  return withSecurity<AnalysisRequest>(
    request,
    async ({ body, registerActualCost }) => {
      try {
        if (!body?.province || !body?.mulkTuru) {
          return NextResponse.json(
            { error: 'İl ve mülk türü bilgisi gerekli' },
            { status: 400 }
          );
        }

        const { province, district, neighborhood, mulkTuru } = body;

        const location = [neighborhood, district, province].filter(Boolean).join(', ');
        
        const mulkLabel = mulkLabels[mulkTuru] || "gayrimenkul";

        // Gemini API ile Google Maps grounding kullanarak gerçek veri çek
        if (GEMINI_API_KEY) {
          try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

            // Koordinat bilgisini bul
            const coords = cityCoordinates[province] || cityCoordinates['İzmir']; // Default İzmir

            const prompt = `Sen Türkiye emlak piyasasında uzman bir analisti sin. Google Maps verilerini kullanarak ${location} bölgesi için KISA ve ÖZ bir emlak analizi yap.

🎯 HEDEF BÖLGE:
📍 Konum: ${location}
🗺️ Koordinatlar: ${coords.lat}, ${coords.lng}
🏠 Mülk Türü: ${mulkLabel}

📊 YAPILACAK ANALİZ:
Google Maps'i kullanarak bu konumun 3km çevresinde şunları kontrol et:
1️⃣ Eğitim: Özel/devlet okulları, üniversiteler
2️⃣ Alışveriş: AVM'ler, büyük market zincirleri
3️⃣ Ulaşım: Metro/tramvay istasyonları, otobüs hatları
4️⃣ Sosyal: Parklar, kafeler, restoranlar, sahil

⚠️ KRİTİK KURALLAR:
✅ Google Maps'ten GERÇEK yer isimlerini kullan
   Örnek: "Optimum AVM", "Bostanlı Metro", "İEÜ Kampüsü"
✅ Mesafeleri belirt (m veya km)
✅ SADECE 3-4 CÜMLE yaz
✅ Türkçe ve profesyonel dil
❌ Hayali yer isimleri ASLA kullanma
❌ Genel/soyut ifadelerden kaçın

📝 ÖRNEK ÇIKTI:
"Mavişehir, Karşıyaka'nın yükselen değerli semtlerinden. Bostanlı Metro İstasyonu 800m, Optimum AVM 1.2km mesafede. İzmir Ekonomi Üniversitesi kampüsü yakınlığı ve çok sayıda özel okul, orta-üst gelir grubundan yoğun ilgi görmesini sağlıyor."

Şimdi ${location} için benzer bir analiz yap:`;

            // Google Maps tool için tip assertion kullan
            const mapsTools = [{ googleMaps: {} }] as any;
            
            const result = await model.generateContent({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              },
              tools: mapsTools,
            });

            const response = result.response;
            const analysis = response.text().trim();

            // Google Maps grounding sonuçlarını logla
            const candidates = response.candidates || [];
            if (candidates.length > 0 && candidates[0].groundingMetadata) {
              const grounding = candidates[0].groundingMetadata;
              console.log('✅ Google Maps Grounding Kullanıldı:', {
                location,
                chunksCount: grounding.groundingChunks?.length || 0,
                supportsCount: grounding.groundingSupports?.length || 0
              });
              
              // Grounding chunk'larını logla
              if (grounding.groundingChunks && grounding.groundingChunks.length > 0) {
                console.log('📍 Bulunan Yerler:', 
                  grounding.groundingChunks.map((chunk: any) => chunk.maps?.title).filter(Boolean)
                );
              }
            }

            if (analysis && analysis.length > 20) {
              registerActualCost(estimateCost(body));
              return NextResponse.json({ 
                success: true, 
                analysis
              });
            }
          } catch (geminiError: any) {
            console.error('❌ Gemini API hatası:', geminiError.message);
            // Gemini hatası durumunda fallback'e düş
          }
        }

        // Fallback: Basit template
        const fallbackAnalysis = `${location}, ${mulkLabel} yatırımları için stratejik bir konumda. Bölgenin gelişim potansiyeli ve ulaşım avantajları göz önünde bulundurulduğunda, orta-uzun vadede değer artışı beklenen bir bölge.`;

        registerActualCost(estimateCost(body));

        return NextResponse.json({
          success: true,
          analysis: fallbackAnalysis
        });

      } catch (error: any) {
        console.error('Bölge analizi hatası:', error);
        return NextResponse.json(
          { error: error.message || 'Analiz yapılamadı' },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) =>
        [body?.province, body?.district, body?.neighborhood].filter(Boolean).join(', ') || ip,
      estimateCost: ({ body }) => estimateCost(body),
    }
  );
}

