import { NextRequest, NextResponse } from "next/server";
import { generateFieldContent } from "@/lib/ai/gemini-service";
import { MulkBilgileri, SunumAmaci, SunumStili, TemaTuru } from "@/types";
import { withSecurity } from "@/lib/security/withSecurity";
import { securityConfig } from "@/lib/security/config";
import { getHedefKitleTemplates } from "@/lib/templates/default-sections";

type TargetAudienceRequestBody = {
  mulk: Partial<MulkBilgileri> & { tur: MulkBilgileri["tur"]; konum: string };
  tema?: TemaTuru;
  amac?: SunumAmaci;
  sunumStili?: SunumStili;
  locationAnalysis?: string;
};

export async function POST(request: NextRequest) {
  return withSecurity<TargetAudienceRequestBody>(
    request,
    async ({ body, registerActualCost }) => {
      try {
        if (!body?.mulk?.tur || !body?.mulk?.konum) {
          return NextResponse.json(
            { error: "Mülk türü ve konum bilgisi gerekli." },
            { status: 400 }
          );
        }

        // AI ile hedef kitle profili oluştur
        const metreSqNote = body.mulk.metrekare && body.mulk.metrekare > 150 
          ? `Bu büyüklükteki daireler (${body.mulk.metrekare}m²), standart dairelere göre farklı bir hedef kitleye hitap eder.` 
          : '';
        
        const priceNote = body.mulk.fiyatMax && body.mulk.fiyatMax > 5000000
          ? 'Yüksek fiyat aralığı, üst gelir grubu alıcıları hedefler.'
          : '';

        const prompt = `
Sen bir emlak pazarlama uzmanısın. Hedef kitle profili oluşturuyorsun.

GÖREV:
${body.mulk.konum} bölgesindeki bu ${body.mulk.tur} için "Hedef Kitle Profili" oluştur.

KURALLAR:
1. 3-4 farklı hedef kitle grubu belirt
2. Her grup için başlık ve açıklama yaz
3. Mülk türüne, konuma, metrekareye ve fiyat aralığına göre özelleştir
4. Profesyonel ve gerçekçi ton kullan
5. Türkçe yaz

GİRDİLER:
- Mülk türü: ${body.mulk.tur}
- Konum: ${body.mulk.konum}
${body.mulk.metrekare ? `- Metrekare: ${body.mulk.metrekare} m²` : ""}
${body.mulk.odaSayisi ? `- Oda sayısı: ${body.mulk.odaSayisi}` : ""}
${body.mulk.fiyatMax ? `- Fiyat: ₺${body.mulk.fiyatMax.toLocaleString('tr-TR')}` : ""}
${body.locationAnalysis ? `- Bölge analizi: ${body.locationAnalysis}` : ""}

ÖNEMLİ NOTLAR:
${metreSqNote}
${priceNote}
${body.mulk.odaSayisi === '4+1' || body.mulk.odaSayisi === '5+1' ? 'Geniş oda sayısı, çok kişili veya geniş aileler için idealdir.' : ''}

ÇIKTI FORMATI:
SADECE geçerli bir JSON dizisi döndür. Her öğe bir obje olmalı: {"baslik": "Başlık", "aciklama": "Açıklama"}

ÖRNEK HEDEF KİTLELER:
- Geniş Aileler: Çocukları için güvenli ve geniş yaşam alanı arayan aileler
- Konfor Arayanlar: Lüks detaylara önem veren profesyoneller
- Yatırımcılar: Bölgenin değer artışını değerlendirmek isteyen yatırımcılar
- Güvenlik Odaklı: Kapalı site ve 7/24 güvenlik arayanlar

Başka hiçbir açıklama, metin veya ek bilgi ekleme. Sadece JSON dizisi.
`;

        const runtimeOpenRouterKey = process.env.OPENROUTER_API_KEY || "";
        const runtimeUseOpenRouter = runtimeOpenRouterKey && runtimeOpenRouterKey !== "your_openrouter_api_key_here" && runtimeOpenRouterKey !== "";

        if (!runtimeUseOpenRouter) {
          // Fallback
          return NextResponse.json({
            success: true,
            data: [
              {
                baslik: "Yatırımcılar",
                aciklama: `${body.mulk.konum} bölgesindeki değer artışı ve kiralama potansiyelini değerlendirmek isteyen yatırımcılar.`
              },
              {
                baslik: "Aileler",
                aciklama: `${body.mulk.konum} çevresinde güvenli ve konforlu yaşam arayan aileler.`
              }
            ]
          });
        }

        const { OpenRouter } = await import("@openrouter/sdk");
        const client = new OpenRouter({ apiKey: runtimeOpenRouterKey });

        const response = await client.chat.send({
          model: "x-ai/grok-4.1-fast:free",
          temperature: 0.7,
          maxTokens: 800,
          messages: [
            {
              role: "system",
              content: "Sen profesyonel bir emlak pazarlama uzmanısın. Hedef kitle profili oluşturuyorsun. Sadece geçerli JSON dizisi döndür.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        let text = "";
        if (typeof response === "string") {
          text = response;
        } else if (response && typeof response === "object") {
          text = (response as any).choices?.[0]?.message?.content || (response as any).content || "";
        }

        // JSON parse
        let parsed: any[] = [];
        try {
          const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
          const match = cleaned.match(/\[[\s\S]*?\]/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        } catch (e) {
          console.error("JSON parse hatası:", e);
        }

        if (parsed.length === 0) {
          // Fallback şablonlar - formdan gelen bilgilere göre dinamik
          parsed = getHedefKitleTemplates({
            mulkTur: body.mulk.tur,
            konum: body.mulk.konum,
            metrekare: body.mulk.metrekare,
            odaSayisi: body.mulk.odaSayisi,
            fiyat: body.mulk.fiyat || body.mulk.fiyatMax
          });
        }

        registerActualCost(securityConfig.defaultRequestCost * 0.2);

        return NextResponse.json({
          success: true,
          data: parsed
        });
      } catch (error: any) {
        console.error("❌ Hedef kitle profili API hatası:", error);
        return NextResponse.json(
          {
            success: false,
            error: error?.message || "Hedef kitle profili oluşturulamadı",
          },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) => body?.mulk?.konum || ip,
      estimateCost: () => securityConfig.defaultRequestCost * 0.2,
    }
  );
}

