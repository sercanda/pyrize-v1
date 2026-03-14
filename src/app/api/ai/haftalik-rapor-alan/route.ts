import { NextRequest, NextResponse } from 'next/server';
import { callLLM, isLLMAvailable } from '@/lib/ai/fal-llm';
import { withSecurity } from '@/lib/security/withSecurity';
import { securityConfig } from '@/lib/security/config';

type Alan = 'saticiYorumu' | 'aliciGeribildirimleri' | 'problemler';
type Mod = 'olustur' | 'detaylandir';

interface HaftalikRaporAlanRequest {
  alan: Alan;
  mod: Mod;
  mevcutMetin?: string;
  performansVerisi: {
    mulkAdi?: string;
    portfoyAdi?: string;
    toplamGoruntulenme?: number;
    haftalikGoruntulenme?: number;
    toplamFavoriSayisi?: number;
    toplamMesajSayisi?: number;
    toplamAramaSayisi?: number;
    yapilanTeklifSayisi?: number;
    yerindeGosterimSayisi?: number;
    ciddiAliciSayisi?: number;
  };
}

const ALAN_LABELS: Record<Alan, string> = {
  saticiYorumu: 'Satıcı Yorumu',
  aliciGeribildirimleri: 'Potansiyel Alıcı Geri Bildirimleri',
  problemler: 'Görülen Ana Problemler',
};

function buildPrompt(alan: Alan, mod: Mod, mevcutMetin: string | undefined, perf: HaftalikRaporAlanRequest['performansVerisi']): string {
  const mulkAdi = perf.mulkAdi || perf.portfoyAdi || 'Portföy';

  const perfOzet = [
    perf.toplamGoruntulenme ? `Toplam görüntülenme: ${perf.toplamGoruntulenme}` : '',
    perf.haftalikGoruntulenme ? `Bu hafta görüntülenme: +${perf.haftalikGoruntulenme}` : '',
    perf.toplamFavoriSayisi ? `Favori: ${perf.toplamFavoriSayisi}` : '',
    perf.toplamMesajSayisi ? `Mesaj: ${perf.toplamMesajSayisi}` : '',
    perf.toplamAramaSayisi ? `Arama: ${perf.toplamAramaSayisi}` : '',
    perf.yapilanTeklifSayisi ? `Teklif: ${perf.yapilanTeklifSayisi}` : '',
    perf.yerindeGosterimSayisi ? `Yerinde gösterim: ${perf.yerindeGosterimSayisi}` : '',
    perf.ciddiAliciSayisi ? `Ciddi alıcı: ${perf.ciddiAliciSayisi}` : '',
  ].filter(Boolean).join('\n');

  if (mod === 'olustur') {
    return `Sen deneyimli bir Türk gayrimenkul danışmanısın. "${mulkAdi}" mülkü için haftalık performans raporunun "${ALAN_LABELS[alan]}" bölümünü yaz.

PERFORMANS VERİLERİ:
${perfOzet || 'Performans verisi girilmemiş.'}

ALAN: ${ALAN_LABELS[alan]}

KURALLAR:
- Türkçe, profesyonel ve samimi bir ton kullan
- Somut rakamlara ve verilere atıfta bulun
- 2-4 paragraf, toplam 100-200 kelime
- ${alan === 'problemler' ? 'Problemleri açık ve çözüm odaklı belirt' : alan === 'saticiYorumu' ? 'Satıcı perspektifinden yaz, haftalık süreci değerlendir' : 'Alıcıların olumlu/olumsuz geri bildirimlerini özetle'}
- Sadece metni yaz, başlık veya açıklama ekleme`;
  }

  return `Sen deneyimli bir Türk gayrimenkul danışmanısın. Aşağıdaki "${ALAN_LABELS[alan]}" metnini daha profesyonel ve detaylı hale getir.

MEVCUT METİN:
${mevcutMetin}

PERFORMANS VERİLERİ:
${perfOzet || 'Performans verisi girilmemiş.'}

KURALLAR:
- Türkçe, profesyonel ton koru
- Mevcut anlamı koru ama zenginleştir
- Somut verilerle destekle
- 2-4 paragraf, toplam 100-200 kelime
- Sadece güncellenmiş metni yaz, başlık veya açıklama ekleme`;
}

export async function POST(request: NextRequest) {
  return withSecurity<HaftalikRaporAlanRequest>(
    request,
    async ({ body, registerActualCost }) => {
      if (!body?.alan || !body?.mod) {
        return NextResponse.json({ error: 'alan ve mod gerekli' }, { status: 400 });
      }

      if (body.mod === 'detaylandir' && !body.mevcutMetin?.trim()) {
        return NextResponse.json({ error: 'Detaylandırmak için mevcut metin gerekli' }, { status: 400 });
      }

      if (!isLLMAvailable()) {
        const fallbacks: Record<Alan, string> = {
          saticiYorumu: 'Bu hafta mülk için olumlu bir süreç yaşandı. Alıcı ilgisi artmaya devam ediyor.',
          aliciGeribildirimleri: 'Potansiyel alıcılar mülkün konumunu ve fiyat-değer dengesini olumlu değerlendirdi.',
          problemler: 'Bu hafta önemli bir problem gözlemlenmedi. Süreç normal seyrinde ilerlemektedir.',
        };
        return NextResponse.json({ icerik: fallbacks[body.alan] });
      }

      const prompt = buildPrompt(body.alan, body.mod, body.mevcutMetin, body.performansVerisi || {});

      try {
        const raw = await callLLM({
          prompt,
          temperature: 0.6,
          maxTokens: 500,
          model: 'x-ai/grok-4-1-fast',
        });

        registerActualCost(securityConfig.defaultRequestCost * 0.3);

        return NextResponse.json({ icerik: raw.trim() });
      } catch (err) {
        console.error('[haftalik-rapor-alan] AI hatası:', err);
        return NextResponse.json(
          { error: 'AI servisi geçici olarak kullanılamıyor' },
          { status: 503 }
        );
      }
    },
    {
      estimateCost: () => securityConfig.defaultRequestCost * 0.3,
      configOverride: {
        userRateLimit: { windowMs: 60 * 60 * 1000, max: 30 },
      },
    }
  );
}
