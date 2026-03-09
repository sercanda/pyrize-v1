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
import { callLLM, isLLMAvailable } from "@/lib/ai/fal-llm";

export async function POST(request: NextRequest) {
  try {
    const { mulk, locationAnalysis } = await request.json();

    if (!mulk?.tur || !mulk?.konum) {
      return NextResponse.json(
        { error: "Mülk türü ve konum bilgisi gerekli." },
        { status: 400 }
      );
    }

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

    if (!isLLMAvailable()) {
      console.warn("⚠️ FAL_KEY bulunamadı, fallback şablonları kullanılıyor");
      return NextResponse.json({ success: true, data: getFallbackTemplates() });
    }

    const locationName = mulk.konum.split(',')[0].trim();
    const mulkTurLabel = getMulkLabel(mulk.tur);
    const priceRange = formatPriceRange(mulk);
    const metrekare = mulk.metrekare ? `${mulk.metrekare} m²` : '';

    let kfeAnalysis = '';
    try {
      const kfeData = getKFEForProperty(mulk);
      kfeAnalysis = formatKFEForPrompt(kfeData);
    } catch (error) {
      console.warn('KFE verileri alınamadı:', error);
    }

    const prompt = `Sen profesyonel bir emlak analisti ve değerleme uzmanısın.

GÖREV:
${locationName} bölgesindeki bu ${mulkTurLabel} için detaylı konum analizi ve değerleme raporu oluştur.

BAŞLIK KURALLARI:
1. Başlıklar MUTLAKA: "Nadir Fırsat", "Konum Primi", "Gelişim Potansiyeli"
2. Her alt bölüm 2-3 cümle (kısa ve öz)
3. Profesyonel ve güven verici dil
4. Türkçe yaz

GİRDİLER:
- Mülk türü: ${mulk.tur}
- Konum: ${mulk.konum}
${priceRange ? `- Fiyat Aralığı: ${priceRange}` : ''}
${metrekare ? `- Metrekare: ${metrekare}` : ''}
${mulk.odaSayisi ? `- Oda Sayısı: ${mulk.odaSayisi}` : ''}
${locationAnalysis ? `- Bölge Analizi: ${locationAnalysis}` : ''}

${kfeAnalysis ? `\n📊 TÜİK KONUT FİYAT ENDEKSİ (KFE) VERİLERİ:\n${kfeAnalysis}\n` : ''}

ÇIKTI FORMATI:
SADECE geçerli bir JSON dizisi döndür. Her öğe { "baslik": "...", "icerik": "..." } formatında olmalı.

Başka hiçbir açıklama ekleme. Sadece JSON dizisi.`;

    let parsedContent;
    try {
      const content = await callLLM({
        prompt,
        temperature: 0.7,
        maxTokens: 800,
      });

      if (!content) {
        parsedContent = getFallbackTemplates();
      } else {
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          parsedContent = JSON.parse(cleanedContent);

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
      }
    } catch (apiError) {
      console.error("AI API hatası, fallback kullanılıyor:", apiError);
      parsedContent = getFallbackTemplates();
    }

    return NextResponse.json({ success: true, data: parsedContent });
  } catch (error: any) {
    console.error("Market Analysis API hatası:", error);
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
