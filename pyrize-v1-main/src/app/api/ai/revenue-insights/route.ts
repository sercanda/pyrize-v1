
import { NextResponse } from 'next/server';
import { calculateRevenuePlan, RevenuePlanInputs } from '@/lib/revenue-calculations';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenRouter } from '@openrouter/sdk';

// Environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Initialize AI clients
const useOpenRouter = !!OPENROUTER_API_KEY;
const useGemini = !useOpenRouter && !!GEMINI_API_KEY;

export async function POST(request: Request) {
    try {
        const body: RevenuePlanInputs = await request.json();

        // Validate inputs
        if (!body || typeof body.targetRevenue !== 'number') {
            return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
        }

        // Perform calculations server-side too for verification/context
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

        if (useOpenRouter) {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://pyrize.app',
                    'X-Title': 'PYRIZE Revenue Intelligence'
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-exp:free', // Using a fast model
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
                try {
                    // Try to clean markdown
                    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
                    aiResponse = JSON.parse(jsonStr);
                } catch (e) {
                    console.error("AI parse error", e);
                    aiResponse = { analysis: "Analiz oluşturulamadı.", recommendations: ["Lütfen verilerinizi kontrol edip tekrar deneyin."] };
                }
            }

        } else if (useGemini) {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            try {
                const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                aiResponse = JSON.parse(jsonStr);
            } catch (e) {
                console.error("AI parse error", e);
                aiResponse = { analysis: "Analiz oluşturulamadı.", recommendations: ["Lütfen verilerinizi kontrol edip tekrar deneyin."] };
            }
        } else {
            // Mock response
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
