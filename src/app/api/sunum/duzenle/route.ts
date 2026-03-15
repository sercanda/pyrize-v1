import { NextRequest, NextResponse } from "next/server";
import { SunumIcerik, OlusturulanSunum } from "@/types";
import { formatPriceRange } from "@/lib/utils/price";
import { withSecurity } from "@/lib/security/withSecurity";
import { securityConfig } from "@/lib/security/config";
import { callLLM, isLLMAvailable } from "@/lib/ai/fal-llm";

type SunumDuzenleBody = {
  sunumData: OlusturulanSunum;
  komut: string;
};

const estimateCost = (body: SunumDuzenleBody | null | undefined) => {
  if (!body) return securityConfig.defaultRequestCost;
  const hasLargeChange =
    body.komut?.toLowerCase().includes("detaylı") ||
    body.komut?.toLowerCase().includes("tamamını");
  return Math.min(
    securityConfig.defaultRequestCost + (hasLargeChange ? 0.15 : 0.05),
    securityConfig.budget.dailyLimit
  );
};

export async function POST(request: NextRequest) {
  return withSecurity<SunumDuzenleBody>(
    request,
    async ({ body, registerActualCost }) => {
      try {
        const { sunumData, komut } = body || {};

        if (!sunumData || !komut) {
          return NextResponse.json(
            { error: "Sunum verisi ve komut gerekli" },
            { status: 400 }
          );
        }

        // Renk değişikliği talebi kontrolü
        const renkKomutu = komut.toLowerCase();
        const renkTerimleri = ['renk', 'color', 'marka renk', 'tema renk', 'primary', 'secondary', 'accent'];
        const isRenkDegisikligi = renkTerimleri.some(terim => renkKomutu.includes(terim));

        // Hex kod kontrolü (örn: #FF0000 veya #f00)
        const hexPattern = /#([0-9A-Fa-f]{3}){1,2}\b/g;
        const hexKodlari = komut.match(hexPattern);

        if (isRenkDegisikligi && hexKodlari) {
          // Renk değişikliği talebi - direkt uygula
          const updatedSunumData = { ...sunumData };
          
          if (!updatedSunumData.istek.markaRenkleri) {
            updatedSunumData.istek.markaRenkleri = {
              primary: '#DBE64C',
              secondary: '#3A7DFF',
              accent: '#FF6B9D'
            };
          }

          // Komutta hangi rengin değiştiğini anla
          if (renkKomutu.includes('primary') || renkKomutu.includes('ana renk')) {
            updatedSunumData.istek.markaRenkleri.primary = hexKodlari[0];
          } else if (renkKomutu.includes('secondary') || renkKomutu.includes('ikincil')) {
            updatedSunumData.istek.markaRenkleri.secondary = hexKodlari[0];
          } else if (renkKomutu.includes('accent') || renkKomutu.includes('vurgu')) {
            updatedSunumData.istek.markaRenkleri.accent = hexKodlari[0];
          } else if (hexKodlari.length >= 3) {
            // Üç renk de verilmiş
            updatedSunumData.istek.markaRenkleri.primary = hexKodlari[0];
            updatedSunumData.istek.markaRenkleri.secondary = hexKodlari[1];
            updatedSunumData.istek.markaRenkleri.accent = hexKodlari[2];
          } else {
            // Sadece bir renk verilmiş, primary'yi değiştir
            updatedSunumData.istek.markaRenkleri.primary = hexKodlari[0];
          }

          registerActualCost(estimateCost(body));

          return NextResponse.json({
            success: true,
            message: `✅ Marka renkleri güncellendi: ${hexKodlari.join(', ')}`,
            data: updatedSunumData,
            isColorChange: true
          });
        }

        if (!isLLMAvailable()) {
          return NextResponse.json(
            { error: "AI API anahtarı yapılandırılmamış (FAL_KEY gerekli)" },
            { status: 500 }
          );
        }

        // Mevcut sunum içeriğini JSON olarak hazırla
        const currentContent = sunumData.icerik;
        const { mulk, danisman } = sunumData.istek;

        // AI prompt'u oluştur
        const prompt = `
Sen bir emlak sunum düzenleme uzmanısın. Kullanıcının verdiği komuta göre mevcut sunum içeriğini düzenliyorsun.

━━━━━━━━━━━━━━━━━━━━━━━━━
KULLANICI KOMUTU:
━━━━━━━━━━━━━━━━━━━━━━━━━
"${komut}"

━━━━━━━━━━━━━━━━━━━━━━━━━
MEVCUT SUNUM İÇERİĞİ:
━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(currentContent, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━
GAYRİMENKUL BİLGİLERİ:
━━━━━━━━━━━━━━━━━━━━━━━━━
📍 MÜLK TÜRÜ: ${mulk.tur}
📍 KONUM: ${mulk.konum}
${formatPriceRange(mulk) ? `💰 FİYAT: ${formatPriceRange(mulk)}` : ''}
${mulk.metrekare ? `📏 METREKARE: ${mulk.metrekare} m²` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
DANIŞMAN BİLGİLERİ:
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 DANIŞMAN: ${danisman.adSoyad}
📞 TELEFON: ${danisman.telefon}
📧 EMAIL: ${danisman.email}

━━━━━━━━━━━━━━━━━━━━━━━━━
GÖREV:
━━━━━━━━━━━━━━━━━━━━━━━━━
Kullanıcının komutuna göre mevcut sunum içeriğini düzenle:
- JSON yapısını KORU (bolge tipleri, altBolge yapıları aynı kalacak)
- Sadece belirtilen bölümleri/kısımları değiştir
- Diğer bölümler aynı kalacak
- İçeriği Türkçe, profesyonel ve akıcı tut
- Girilen bilgileri (mülk, danışman) koru

━━━━━━━━━━━━━━━━━━━━━━━━━
ÇIKTI FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━
Sadece güncellenmiş JSON içeriğini döndür. Başka açıklama ekleme.

\`\`\`json
{
  "baslik": "...",
  "altBaslik": "...",
  "heroAciklama": "...",
  "bolgeler": [...],
  "cti": {...}
}
\`\`\`
`;

        const text = await callLLM({ prompt, maxTokens: 4000 });

        // JSON'u parse et
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          throw new Error("AI'dan geçerli JSON yanıtı alınamadı");
        }

        let updatedContent: SunumIcerik;
        try {
          const jsonText = jsonMatch[0].replace(/```json\n?/g, '').replace(/\n?```/g, '');
          updatedContent = JSON.parse(jsonText);
        } catch (parseError) {
          // Eğer parse edilemezse, mevcut içeriği döndür
          console.error("JSON parse hatası:", parseError);
          updatedContent = currentContent;
        }

        // Validasyon: Temel yapıyı koru
        if (!updatedContent.baslik) updatedContent.baslik = currentContent.baslik;
        if (!updatedContent.heroAciklama) updatedContent.heroAciklama = currentContent.heroAciklama;
        if (!updatedContent.bolgeler) updatedContent.bolgeler = currentContent.bolgeler;

        // Güncellenmiş sunum datasını oluştur
        const updatedSunumData = {
          ...sunumData,
          icerik: updatedContent
        };

        registerActualCost(estimateCost(body));

        return NextResponse.json({
          success: true,
          message: "✅ Sunum başarıyla güncellendi",
          data: updatedSunumData
        });

      } catch (error: any) {
        console.error("Sunum düzenleme hatası:", error);
        return NextResponse.json(
          { 
            error: error.message || "Sunum düzenlenemedi",
            message: "❌ Düzenleme sırasında bir hata oluştu. Lütfen komutunuzu daha açık ifade edin."
          },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) => body?.sunumData?.istek?.danisman?.email || ip,
      estimateCost: ({ body }) => estimateCost(body),
    }
  );
}
