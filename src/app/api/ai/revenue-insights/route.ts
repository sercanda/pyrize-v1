
import { NextResponse } from 'next/server';
import { calculateRevenuePlan, RevenuePlanInputs } from '@/lib/revenue-calculations';
import { callLLM, isLLMAvailable } from '@/lib/ai/fal-llm';

export async function POST(request: Request) {
    try {
        const body: RevenuePlanInputs = await request.json();

        if (!body || typeof body.targetRevenue !== 'number') {
            return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
        }

        const results = calculateRevenuePlan(body);

        const prompt = `
      Sen emlak sektörü için zeki bir iş analistisin.
      Kullanıcının ciro hedefleri ve mevcut performansı aşağıdadır.

      HEDEFLER:
      - Aylık Ciro Hedefi: ₺${body.targetRevenue.toLocaleString('tr-TR')}
      - Ortalama Portföy Fiyatı: ₺${body.avgPropertyPrice.toLocaleString('tr-TR')}
      - Komisyon Oranı: %${body.commissionRate}

      MEVCUT PERFORMANS:
      - Aktif Portföy Sayısı: ${body.currentActiveListings}
      - Aylık Ortalama Satış: ${body.avgMonthlySales}
      - Krediye Uygun Portföy Oranı: %${body.creditEligibleRatio}

      HESAPLANAN GEREKSİNİMLER (Bu hedefe ulaşmak için):
      - Gereken Satış Adedi: ${results.requiredSales}
      - Gereken Portföy Girişi: ${results.requiredListings}
      - Gereken Görüşme: ${results.requiredMeetings}
      - Tahmini Süre (Mevcut Hızla): ${results.estimatedMonthsToGoal > 0 ? results.estimatedMonthsToGoal + " Ay" : "Hesaplanamadı (Mevcut satış 0)"}

      GÖREVİN:
      Bu verileri yorumla ve emlak danışmanına 3 adet somut, kısa ve net öneri ver. Makine gibi değil, tecrübeli bir koç gibi konuş.

      KURALLAR:
      1. Sadece Türkçe yanıt ver.
      2. JSON formatında yanıt ver: { "analysis": "Genel değerlendirme cümlesi", "recommendations": ["Öneri 1", "Öneri 2", "Öneri 3"] }
      3. "Orta segment", "lüks konut", "kiralama", "ticari" gibi spesifik segmentasyon önerileri yapabilirsin.
      4. Eğer krediye uygunluk oranı düşükse (%30 altı) bununla ilgili uyarı yap.
      5. Eğer mevcut hız (aylık satış) hedefe ulaşmak için çok yetersizse, ekibi büyütme veya pazarlama bütçesini artırma önerisi yap.
    `;

        let aiResponse: { analysis: string; recommendations: string[] } = { analysis: "", recommendations: [] };

        if (isLLMAvailable()) {
            const text = await callLLM({ prompt, maxTokens: 800 });
            if (text) {
                try {
                    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    aiResponse = JSON.parse(jsonStr);
                } catch (e) {
                    console.error("AI parse error", e);
                    aiResponse = { analysis: "Analiz oluşturulamadı.", recommendations: ["Lütfen verilerinizi kontrol edip tekrar deneyin."] };
                }
            } else {
                aiResponse = { analysis: "Analiz oluşturulamadı.", recommendations: ["Lütfen verilerinizi kontrol edip tekrar deneyin."] };
            }
        } else {
            aiResponse = {
                analysis: "AI servisi yapılandırılmamış. (Mock Data)",
                recommendations: [
                    "Portföy sayınızı %20 artırmalısınız.",
                    "Eski müşterilerinizle iletişime geçin.",
                    "Bölgesel fiyat analizi yapın."
                ]
            };
        }

        return NextResponse.json(aiResponse);

    } catch (error) {
        console.error('Revenue Insights Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
