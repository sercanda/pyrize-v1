import { NextRequest, NextResponse } from "next/server";
import { MulkBilgileri } from "@/types";
import {
  getNadirFirsatTemplate,
  getKonumPrimiTemplate,
  getGelisimPotansiyeliTemplate
} from "@/lib/templates/default-sections";
import {
  getKFEForProperty,
  formatKFEForPrompt
} from "@/lib/utils/kfe";
import { getGroqClient, isGroqAvailable } from "@/lib/ai/groq";

export async function POST(request: NextRequest) {
  try {
    // Parse request body first to get mulk data for fallback
    const { mulk, locationAnalysis } = await request.json();

    if (!mulk?.tur || !mulk?.konum) {
      return NextResponse.json(
        { error: "Mülk türü ve konum bilgisi gerekli." },
        { status: 400 }
      );
    }

    // Fallback şablonlar - formdan gelen bilgilere göre dinamik
    const getFallbackTemplates = () => {
      return [
        {
          baslik: "Nadir Fırsat",
          icerik: getNadirFirsatTemplate({
            mulkTur: mulk.tur,
            metrekare: mulk.metrekare,
            odaSayisi: mulk.odaSayisi,
            konum: mulk.konum,
            fiyat: mulk.fiyat || mulk.fiyatMax
          })
        },
        {
          baslik: "Konum Primi",
          icerik: getKonumPrimiTemplate({
            mulkTur: mulk.tur,
            konum: mulk.konum,
            locationAnalysis
          })
        },
        {
          baslik: "Gelişim Potansiyeli",
          icerik: getGelisimPotansiyeliTemplate({
            mulkTur: mulk.tur,
            konum: mulk.konum,
            locationAnalysis
          })
        }
      ];
    };

    // Check if Groq is available (lazy check - no build-time crash)
    if (!isGroqAvailable()) {
      console.warn("⚠️ GROQ_API_KEY bulunamadı, fallback şablonları kullanılıyor");
      return NextResponse.json({ success: true, data: getFallbackTemplates() });
    }

    const groq = getGroqClient();
    if (!groq) {
      console.warn("⚠️ Groq client oluşturulamadı, fallback şablonları kullanılıyor");
      return NextResponse.json({ success: true, data: getFallbackTemplates() });
    }


    const locationName = mulk.konum.split(',')[0].trim();
    const mulkTurLabel = getMulkLabel(mulk.tur);
    const priceRange = formatPriceRange(mulk);
    const metrekare = mulk.metrekare ? `${mulk.metrekare} m²` : '';

    // TÜİK/KFE verilerini al
    let kfeAnalysis = '';
    try {
      const kfeData = getKFEForProperty(mulk);
      kfeAnalysis = formatKFEForPrompt(kfeData);
    } catch (error) {
      console.warn('KFE verileri alınamadı:', error);
    }

    const prompt = `Sen profesyonel bir emlak analisti ve değerleme uzmanısın. Bir gayrimenkul için "Konum Analizi & Değerleme" bölümü oluşturuyorsun.

GÖREV:
${locationName} bölgesindeki bu ${mulkTurLabel} için detaylı konum analizi ve değerleme raporu oluştur.

ÇOK ÖNEMLİ - BAŞLIK KURALLARI:
1. Başlıklar MUTLAKA şu şekilde olmalı (kelime kelime aynı):
   - "Nadir Fırsat" (risk veya dikkat kelimelerini içermeli)
   - "Konum Primi" (primi veya avantaj kelimelerini içermeli)
   - "Gelişim Potansiyeli" (gelişim veya trend kelimelerini içermeli)

2. Her alt bölüm için:
   - İçerik 2-3 cümle olsun (kısa ve öz)
   - Profesyonel ve güven verici dil kullan
   - Gerçekçi veriler ve analizler sun
   - Konum ve mülk türüne özel içerik yaz

3. Türkçe yaz ve profesyonel ton kullan.

GİRDİLER:
- Mülk türü: ${mulk.tur}
- Konum: ${mulk.konum}
${priceRange ? `- Fiyat Aralığı: ${priceRange}` : ''}
${metrekare ? `- Metrekare: ${metrekare}` : ''}
${mulk.odaSayisi ? `- Oda Sayısı: ${mulk.odaSayisi}` : ''}
${locationAnalysis ? `- Bölge Analizi: ${locationAnalysis}` : ''}

${kfeAnalysis ? `\n📊 TÜİK KONUT FİYAT ENDEKSİ (KFE) VERİLERİ:\n${kfeAnalysis}\n
Bu verileri analizinde kullan. Özellikle:
- Gelişim Potansiyeli bölümünde yıllık değişim oranlarını vurgula
- Konum Primi bölümünde bölgesel performansı Türkiye ortalamasıyla karşılaştır
- Nadir Fırsat bölümünde piyasa trendlerini referans göster\n` : ''}

ÇIKTI FORMATI:
SADECE geçerli bir JSON dizisi döndür. Her öğe { "baslik": "...", "icerik": "..." } formatında olmalı.
Örnek:
[
  {
    "baslik": "Nadir Fırsat",
    "icerik": "Bu ${mulkTurLabel}, ${locationName} bölgesinde nadiren bulunan özelliklere sahiptir. Piyasada benzer alternatiflerin sayısı oldukça sınırlıdır ve bu fiyat aralığında bu özellikleri bir arada sunan mülkler zordur."
  },
  {
    "baslik": "Konum Primi",
    "icerik": "${locationName} konumu, ulaşım ağlarına yakınlığı ve sosyal tesislere erişimi ile önemli bir konum primi sağlamaktadır. Bölgenin merkezi konumu ve gelişim potansiyeli, mülkün değerini artıran temel faktörlerdir."
  },
  {
    "baslik": "Gelişim Potansiyeli",
    "icerik": "${locationName} bölgesi hızlı bir gelişim göstermektedir. Yeni altyapı projeleri ve ticari yatırımlar, önümüzdeki 3-5 yıl içinde mülkün değer artış potansiyelini yükseltmektedir."
  }
]

Başka hiçbir açıklama, metin veya ek bilgi ekleme. Sadece JSON dizisi.`;

    let parsedContent;
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 800,
      });

      const content = chatCompletion.choices[0]?.message?.content || "[]";

      // JSON parse et
      try {
        // Markdown kod bloklarını temizle
        const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedContent = JSON.parse(cleanedContent);

        // Başlıkları kontrol et ve düzelt
        if (Array.isArray(parsedContent) && parsedContent.length === 3) {
          parsedContent = parsedContent.map((item, index) => {
            const expectedTitles = ["Nadir Fırsat", "Konum Primi", "Gelişim Potansiyeli"];
            return {
              baslik: expectedTitles[index],
              icerik: item.icerik || item.content || ""
            };
          });
        } else {
          console.warn("AI yanıtı beklenen formatta değil, fallback kullanılıyor");
          parsedContent = getFallbackTemplates();
        }
      } catch (parseError) {
        console.error("JSON parse hatası, fallback kullanılıyor:", parseError);
        parsedContent = getFallbackTemplates();
      }
    } catch (apiError) {
      console.error("Groq API hatası, fallback kullanılıyor:", apiError);
      parsedContent = getFallbackTemplates();
    }

    return NextResponse.json({ success: true, data: parsedContent });
  } catch (error: any) {
    console.error("Groq API hatası:", error);
    return NextResponse.json(
      { error: error.message || "Konum analizi oluşturulurken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}

function getMulkLabel(tur: string): string {
  const labels: Record<string, string> = {
    arsa: "Arsa",
    daire: "Daire",
    villa: "Villa",
    ticari: "Ticari Gayrimenkul",
    kompleks: "Kompleks",
    ofis: "Ofis"
  };
  return labels[tur] ?? "Gayrimenkul";
}

function formatPriceRange(mulk: MulkBilgileri): string {
  if (mulk.fiyatMin && mulk.fiyatMax) {
    return `${mulk.fiyatMin.toLocaleString('tr-TR')} - ${mulk.fiyatMax.toLocaleString('tr-TR')} TL`;
  } else if (mulk.fiyat) {
    return `${mulk.fiyat.toLocaleString('tr-TR')} TL`;
  }
  return '';
}

