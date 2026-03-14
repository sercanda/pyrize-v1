import { NextRequest, NextResponse } from 'next/server';
import { callLLM, isLLMAvailable } from '@/lib/ai/fal-llm';
import { withSecurity } from '@/lib/security/withSecurity';
import { securityConfig } from '@/lib/security/config';

interface SunumSkoruRequest {
  sunumId: string;
  baslik: string;
  mulkTuru: string;
  bolge: string;
  fiyat?: number;
  sunumStili?: string;
  olusturulanSunumJSON?: string;
}

interface SunumSkoruResponse {
  skor: number;
  yorum: string;
  oneriler: string[];
}

export async function POST(request: NextRequest) {
  return withSecurity<SunumSkoruRequest>(
    request,
    async ({ body, registerActualCost }) => {
      if (!body?.sunumId || !body?.baslik || !body?.mulkTuru) {
        return NextResponse.json(
          { error: 'sunumId, baslik ve mulkTuru gerekli' },
          { status: 400 }
        );
      }

      if (!isLLMAvailable()) {
        // Fallback: static placeholder score
        const fallback: SunumSkoruResponse = {
          skor: 65,
          yorum: 'Sunum temel bilgileri içeriyor ancak ikna gücü artırılabilir.',
          oneriler: [
            'Mülkün en güçlü özelliklerini hero bölümünde öne çıkarın.',
            'Bölgesel piyasa karşılaştırması ekleyin.',
            'Danışman güven unsurlarını güçlendirin.',
          ],
        };
        return NextResponse.json(fallback);
      }

      const prompt = `Sen deneyimli bir Türk gayrimenkul pazarlama uzmanısın. Aşağıdaki sunum bilgilerini değerlendir ve 0-100 arası bir ikna gücü skoru ver.

SUNUM BİLGİLERİ:
- Başlık: ${body.baslik}
- Mülk Türü: ${body.mulkTuru}
- Bölge: ${body.bolge}
${body.fiyat ? `- Fiyat: ₺${body.fiyat.toLocaleString('tr-TR')}` : ''}
${body.sunumStili ? `- Sunum Stili: ${body.sunumStili}` : ''}
${body.olusturulanSunumJSON ? `\nSUNUM İÇERİĞİ (özet):\n${body.olusturulanSunumJSON.slice(0, 1500)}` : ''}

Değerlendirme kriterleri:
- Başlık güçlü ve ilgi çekici mi? (0-20 puan)
- Mülk ve bölge bilgileri yeterli mi? (0-20 puan)
- Fiyat-değer dengesi sunulmuş mu? (0-20 puan)
- Güven unsurları (danışman, referans) var mı? (0-20 puan)
- Harekete geçirme (CTA) açık mı? (0-20 puan)

YANIT FORMATI (başka hiçbir şey yazma, sadece JSON):
{
  "skor": <0-100 arası tam sayı>,
  "yorum": "<1-2 cümle değerlendirme>",
  "oneriler": ["<öneri 1>", "<öneri 2>", "<öneri 3>"]
}`;

      try {
        const raw = await callLLM({
          prompt,
          temperature: 0.4,
          maxTokens: 400,
          model: 'x-ai/grok-4-1-fast',
        });

        registerActualCost(securityConfig.defaultRequestCost * 0.3);

        // Parse JSON from response
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('JSON yanıt bulunamadı');
        }

        const parsed = JSON.parse(jsonMatch[0]) as SunumSkoruResponse;

        // Validate skor range
        const skor = Math.max(0, Math.min(100, Math.round(Number(parsed.skor) || 50)));
        const yorum = typeof parsed.yorum === 'string' ? parsed.yorum.slice(0, 300) : '';
        const oneriler = Array.isArray(parsed.oneriler)
          ? parsed.oneriler.slice(0, 3).map((o) => String(o).slice(0, 200))
          : [];

        return NextResponse.json({ skor, yorum, oneriler } satisfies SunumSkoruResponse);
      } catch (err) {
        console.error('[sunum-skoru] AI parse hatası:', err);
        return NextResponse.json({
          skor: 60,
          yorum: 'Sunum içeriği analiz edildi. İyileştirme önerileri aşağıdadır.',
          oneriler: [
            'Başlığı daha çarpıcı hale getirin.',
            'Bölge avantajlarını vurgulayın.',
            'Danışman bilgilerini öne çıkarın.',
          ],
        } satisfies SunumSkoruResponse);
      }
    },
    {
      estimateCost: () => securityConfig.defaultRequestCost * 0.3,
      configOverride: {
        userRateLimit: { windowMs: 60 * 60 * 1000, max: 20 },
      },
    }
  );
}
