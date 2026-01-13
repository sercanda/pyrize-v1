import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceData, mulkInfo } = body;

    if (!priceData || !priceData.price_history) {
      return NextResponse.json(
        { error: "Fiyat geçmişi verisi gerekli" },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "Groq API anahtarı yapılandırılmamış" },
        { status: 500 }
      );
    }

    // Groq API ile analiz oluştur
    const prompt = `
Sen profesyonel bir emlak değerleme uzmanısın. Aşağıdaki fiyat geçmişi verilerini analiz edip kısa ve öz bir değerleme raporu oluştur.

MÜLK BİLGİLERİ:
${mulkInfo ? JSON.stringify(mulkInfo, null, 2) : 'Belirtilmemiş'}

FİYAT GEÇMİŞİ:
- Minimum Fiyat: ${priceData.min_price ? `₺${priceData.min_price.toLocaleString('tr-TR')}` : 'Bilinmiyor'}
- Maksimum Fiyat: ${priceData.max_price ? `₺${priceData.max_price.toLocaleString('tr-TR')}` : 'Bilinmiyor'}
- Mevcut Fiyat: ${priceData.current_price ? `₺${priceData.current_price.toLocaleString('tr-TR')}` : 'Bilinmiyor'}
- Piyasa Pozisyonu: ${priceData.market_position === 'above' ? 'Piyasanın Üstünde' : priceData.market_position === 'below' ? 'Piyasanın Altında' : 'Piyasa Ortalaması'}
- Fiyat Değişimleri: ${priceData.price_history.length} kayıt

Fiyat Geçmişi Detayları:
${priceData.price_history.map((entry: any, idx: number) => `${idx + 1}. ${entry.date}: ${entry.formatted || `₺${entry.price.toLocaleString('tr-TR')}`}`).join('\n')}

GÖREVİN:
Aşağıdaki başlıklar altında kısa ve profesyonel bir analiz yaz:

1. **Fiyat Trendi**: Fiyat değişimlerini analiz et (artış/azalış trendi)
2. **Piyasa Pozisyonu**: İlanın piyasa ortalamasına göre durumu
3. **Yatırım Riski**: Fiyat değişkenliğine göre risk değerlendirmesi
4. **Önerilen Fiyat Aralığı**: Mevcut verilere göre optimal fiyat önerisi
5. **Bölge Trendi**: (Eğer çıkarılabiliyorsa) Bölgesel trend yorumu

Her bölümü 2-3 cümle ile özetle. Toplam 150-200 kelime arası olsun.
Türkçe yaz, profesyonel ve güven verici bir dil kullan.
`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // veya 'mixtral-8x7b-32768'
        messages: [
          {
            role: 'system',
            content: 'Sen profesyonel bir emlak değerleme uzmanısın. Verilen fiyat geçmişi verilerini analiz edip kısa ve öz değerleme raporları oluşturuyorsun.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Groq API hatası:", errorText);
      return NextResponse.json(
        { error: "AI analizi oluşturulamadı" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'Analiz oluşturulamadı';

    console.log("✅ Groq analizi oluşturuldu");

    return NextResponse.json({
      success: true,
      analysis: analysis,
      summary: {
        minPrice: priceData.min_price,
        maxPrice: priceData.max_price,
        currentPrice: priceData.current_price,
        marketPosition: priceData.market_position,
        priceChanges: priceData.price_history.length
      }
    });

  } catch (error: any) {
    console.error("❌ Value report API hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Değerleme raporu oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

