import { NextRequest, NextResponse } from "next/server";
import { callLLM, isLLMAvailable } from "@/lib/ai/fal-llm";

type LocationAnalysisBody = {
  city?: string;
  district?: string;
  neighborhood?: string;
  fullAddress?: string;
  propertyType?: string;
  field: 'konumAvantajlari' | 'kullanimPotansiyeli' | 'aciklama';
  mapUrl?: string;
};

// Prompt fonksiyonu
const buildPrompt = (field: string, address: string, propertyType: string) => {
  const prompts: Record<string, string> = {
    location_advantages: `Sen bir emlak konum analistisin. ${address} bölgesindeki ${propertyType} için konum avantajlarını analiz et.

GÖREV: Bu konumun gerçek avantajlarını belirle.

Araştır:
- Toplu taşıma: metro, tramvay, otobüs durakları
- Eğitim: okullar, üniversiteler
- Alışveriş: AVM'ler, süpermarketler
- Sağlık: hastaneler
- Önemli yerler

ÇIKTI FORMATI (Türkçe):
• [Yer adı] [mesafe]
• [Ulaşım durağı] [mesafe]
• [Tesis] [mesafe]

ÖNEMLİ:
- Gerçekçi yer isimleri kullan
- Mesafeleri belirt (m veya km)
- 3-5 madde yaz
- Türkçe yaz

${address} için analiz yap:`,

    usage_potential: `Sen bir emlak analistisin. ${address} bölgesindeki ${propertyType} için kullanım potansiyelini analiz et.

GÖREV: Bu mülkü kim, neden kullanır?

Değerlendir:
- Yakın üniversiteler → öğrenci kiralama potansiyeli
- İş merkezleri → profesyonel konut talebi
- Aile tesisleri → okullar, parklar
- Turizm alanları → kısa süreli kiralama potansiyeli

ÇIKTI FORMATI (Türkçe):
• [Kullanım türü]: [Sebep ve yakın yerler]

ÖNEMLİ:
- Gerçekçi yerler referans göster
- 3-5 madde
- Türkçe yaz

${address} için analiz yap:`,

    description: `Sen bir emlak metin yazarısın. ${address} bölgesindeki ${propertyType} için profesyonel bir açıklama yaz.

GÖREV: 2-4 cümle ile konumu tanımlayan profesyonel bir metin yaz.

İçerik:
1. Mahalle karakteri
2. Yakın önemli yerler
3. Kime uygun
4. Yatırım değeri (opsiyonel)

ÖNEMLİ:
- Profesyonel ama doğal Türkçe
- 2-4 cümle

${address} için yaz:`
  };

  return prompts[field] || prompts.description;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LocationAnalysisBody;
    const { city, district, neighborhood, fullAddress, propertyType, field } = body;

    if (!field) {
      return NextResponse.json({ error: "Field parameter is required" }, { status: 400 });
    }

    const locationParts = [fullAddress, neighborhood, district, city].filter(Boolean);
    const addressString = locationParts.length > 0
      ? locationParts.join(", ")
      : "Türkiye geneli";

    const fieldMap: Record<string, string> = {
      'konumAvantajlari': 'location_advantages',
      'kullanimPotansiyeli': 'usage_potential',
      'aciklama': 'description'
    };

    const requestedField = fieldMap[field] || 'description';
    const prompt = buildPrompt(requestedField, addressString, propertyType || "Gayrimenkul");

    let resultText = "";

    if (isLLMAvailable()) {
      try {
        console.log(`🔍 FAL AI ile konum analizi başlatılıyor...`);
        console.log(`📍 Konum: ${addressString}`);
        console.log(`📝 Alan: ${field}`);

        resultText = await callLLM({
          prompt,
          temperature: 0.7,
          maxTokens: 1500,
        });

        console.log(`✅ AI yanıt alındı: ${resultText.length} karakter`);

        if (resultText.length < 50) {
          console.warn("⚠️ AI yanıtı çok kısa, fallback kullanılıyor");
          throw new Error("Yanıt çok kısa");
        }

      } catch (apiError: any) {
        console.error("❌ AI API hatası:", apiError?.message);
        resultText = getFallbackText(field, district, city, addressString);
      }
    } else {
      console.warn("⚠️ FAL_KEY eksik, fallback kullanılıyor");
      resultText = getFallbackText(field, district, city, addressString);
    }

    resultText = resultText.trim();

    return NextResponse.json({
      success: true,
      data: resultText
    });

  } catch (error: any) {
    console.error("Location Analysis AI Error:", error);
    return NextResponse.json(
      { error: `Analiz oluşturulurken bir hata oluştu: ${error.message || error}` },
      { status: 500 }
    );
  }
}

function getFallbackText(field: string, district?: string, city?: string, addressString?: string): string {
  if (field === 'konumAvantajlari') {
    return `• ${district || city || 'Bölge'} merkezine yakın stratejik konum\n• Toplu taşıma ve ana arterlere kolay erişim\n• Gelişen bölge altyapısı ile değer artış potansiyeli`;
  } else if (field === 'kullanimPotansiyeli') {
    return `• Aile yaşamı için uygun sosyal olanaklar\n• Yatırım amaçlı kira geliri potansiyeli\n• Merkezi konumdan dolayı yüksek talep`;
  } else {
    return `${addressString || 'Bu konum'} konumunda bulunan bu mülk, bölgenin yükselen değerleri arasında yer almaktadır. Hem oturum hem de yatırım amaçlı değerlendirilebilecek, sosyal olanaklara ve ulaşım ağlarına entegre bir yaşam alanıdır.`;
  }
}
