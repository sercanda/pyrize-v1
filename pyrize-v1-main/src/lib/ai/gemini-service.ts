import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenRouter } from "@openrouter/sdk";
import {
  SunumOlusturmaIstegi,
  SunumIcerik,
  MulkTuru,
  TemaTuru,
  SunumUzunlugu,
  SunumStili,
  SunumAmaci,
  MulkBilgileri,
} from "@/types";
import { generateSunumFromTemplate } from "@/lib/templates/funnel-templates";
import { formatPriceRange } from "@/lib/utils/price";
import { getKFEForProperty, formatKFEForPrompt } from "@/lib/utils/kfe";

// OpenRouter API key (öncelikli) - Grok 4.1 Fast kullanılıyor
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
// Gemini API key (fallback)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// OpenRouter kullan (öncelikli)
const useOpenRouter = OPENROUTER_API_KEY && OPENROUTER_API_KEY !== "your_openrouter_api_key_here" && OPENROUTER_API_KEY !== "";
// Gemini kullan (fallback)
const useGemini = !useOpenRouter && GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here" && GEMINI_API_KEY !== "";

// API key yoksa mock data döndür
const isMockMode = !useOpenRouter && !useGemini;

// Debug log
console.log("🔑 API Key Durumu:", {
  hasOpenRouterKey: !!OPENROUTER_API_KEY,
  openRouterKeyLength: OPENROUTER_API_KEY?.length || 0,
  hasGeminiKey: !!GEMINI_API_KEY,
  useOpenRouter,
  useGemini,
  isMockMode
});

let genAI: GoogleGenerativeAI | null = null;
if (useGemini && !isMockMode) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// OpenRouter SDK instance (lazy initialization)
let openRouterClient: OpenRouter | null = null;
function getOpenRouterClient(apiKey: string): OpenRouter {
  // Bu projede tek bir OpenRouter API key'i kullanıyoruz,
  // bu yüzden sadece bir client instance'ı yeterli.
  if (!openRouterClient) {
    openRouterClient = new OpenRouter({ apiKey });
  }
  return openRouterClient;
}

// Tema tonları ve açıklamaları
const temaTanimlari: Record<TemaTuru, string> = {
  modern: "Çağdaş, yenilikçi, dinamik bir dil. Teknolojik avantajlar, dijital süreçler ve hız vurgulanmalı.",
  kurumsal: "Profesyonel, güvenilir, ciddi bir ton. Rakamsal veriler, analizler, yatırım hesaplamaları vurgulanmalı.",
  luks: "Prestijli, seçkin ve yüksek standartlı bir ton. Özel konum, lüks hizmet deneyimi ve güven algısı ön planda olmalı."
};

const sunumStiliBilgileri: Record<SunumStili, {
  ad: string;
  aciklama: string;
  odaklar: string[];
  gorevler: string[];
}> = {
  detayli_analiz: {
    ad: "Portföy Almak - Detaylı Analiz",
    aciklama: "Satıcıya profesyonel güven vermek için kapsamlı analiz, fiyatlandırma önerileri ve stratejik yol haritası sun.",
    odaklar: [
      "Konum analizi, fiyat trendleri ve benzer satış karşılaştırmaları",
      "Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerini ayrıntılı doldur",
      "Uzun form anlatım; grafiksel/veri odaklı içerik, güven veren CTA"
    ],
    gorevler: [
      "Detaylı analiz stilinde her bölümde veri ve mantıklı açıklamalar kullan.",
      "Fiyat tahmini ve satım planı bölümünde aralıklar, süreler ve öneriler mutlaka olsun.",
      "Reklam kanalları bölümünde hem dijital hem kurumsal ağları listele."
    ]
  },
  hizli_satis: {
    ad: "Portföy Satmak - Hızlı Satış",
    aciklama: "Potansiyel alıcıya hızlı karar aldıracak şekilde net, vurucu ve avantaj odaklı sunum hazırla.",
    odaklar: [
      "Hero, özellikler ve CTA bölümlerinde güçlü aksiyon çağrıları",
      "Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerini madde madde, hızlı okunur formatta sun",
      "Fiyat ve avantajlar bölümünde aciliyet / sınırlı fırsat vurgusu"
    ],
    gorevler: [
      "Hızlı satış stilinde cümleleri kısa ve etkileyici tut, her bölümde aksiyon vurgusu olsun.",
      "Reklam kanallarında yoğun dijital erişim ve hızlı geri dönüş metrikleri belirt.",
      "Kullanım potansiyeli bölümünü yatırım + yaşam senaryoları ile hızlı okunur formatta yaz."
    ]
  },
  prestij_sunum: {
    ad: "Prestij Sunum",
    aciklama: "Yüksek değerli portföyler için lüks algısı, sosyal kanıt ve elit hizmet yaklaşımını öne çıkar.",
    odaklar: [
      "Siyah/altın/beyaz kontrastlı lüks ton, seçkin dil",
      "Simetrik yapı: Hero, danışman profili, portföy görselleri, güven alanı, CTA",
      "Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerinde premium ton kullan"
    ],
    gorevler: [
      "Prestij stilinde her bölümde seçkin müşterilere hitap eden dil kullan, referans ve sosyal kanıt ekle.",
      "Tanıtım stratejisinde davet usulü etkinlikler ve network vurguları olsun.",
      "Reklam kanallarında lüks portföyler için uygun seçkin mecraları belirt (lux dergi, özel ağlar vb.)."
    ]
  }
};

const mulkTurleri: Record<MulkTuru, string> = {
  daire: "Daireniz",
  arsa: "Arsanız",
  villa: "Villanız",
  ticari: "Ticari Mülkünüz",
  kompleks: "Kompleksiniz",
  ofis: "Ofisiniz"
};

const mulkTuruAciklamalari: Record<MulkTuru, string> = {
  daire: "Yaşam alanı, aile yaşamı, şehir merkezine yakınlık vurguları. Komşuluk, güvenlik, sosyal alanlar önemli.",
  arsa: "Yatırım potansiyeli, değer artışı, imar durumu, topografya, ulaşım, gelecek planları vurgulanmalı.",
  villa: "Özel yaşam, geniş bahçe, gizlilik, lüks donanımlar, manzara vurguları.",
  ticari: "İş potansiyeli, yoğunluk, ulaşım, park, vitrin, kira geliri, yatırım getirisi vurguları.",
  kompleks: "Sosyal yaşam, havuz, spor alanları, güvenlik, yönetim, ortak alanlar vurguları.",
  ofis: "Konum, erişilebilirlik, park, güvenlik, yönetim, teknolojik altyapı, prestij vurguları."
};

const uzunlukAciklamalari: Record<SunumUzunlugu, { bolge: string; detay: string }> = {
  kisa: {
    bolge: "3-4",
    detay: "Ana özellikler, temel bilgiler, hızlı karar için gerekli bilgiler. Net ve öz."
  },
  orta: {
    bolge: "5-7",
    detay: "Hikayeleştirilmiş sunum, çevre analizi, avantajlar ve değer önerisi detaylı."
  },
  uzun: {
    bolge: "8-12",
    detay: "Detaylı analiz, yatırım hesaplamaları, bölge analizi, çevre avantajları, güven inşası için kapsamlı bilgi."
  }
};

// Mevsimsel tarih kontrolü
function getMevsimText(): string {
  const ay = new Date().getMonth() + 1;
  if (ay >= 3 && ay <= 5) {
    if (ay === 3) return "bahar sezonuna yakın";
    if (ay === 4 || ay === 5) return "bahar sezonu";
    return "bahar sezonu";
  }
  if (ay >= 6 && ay <= 8) {
    if (ay === 6) return "yaz sezonuna yakın";
    if (ay === 7 || ay === 8) return "yaz sezonu";
    return "yaz sezonu";
  }
  if (ay >= 9 && ay <= 11) {
    if (ay === 9) return "sonbahar sezonuna yakın";
    if (ay === 10 || ay === 11) return "sonbahar sezonu";
    return "sonbahar sezonu";
  }
  if (ay === 12 || ay === 1) return "kış sezonu";
  return "kış sezonuna yakın";
}

const buildPriceLine = (mulk: MulkBilgileri, prefix = "- Fiyat"): string =>
  formatPriceRange(mulk) ? `${prefix}: ${formatPriceRange(mulk)}` : "";

function buildPrompt(
  istek: SunumOlusturmaIstegi,
  marketData?: import('@/lib/services/market-analysis/types').MarketAnalysisData | null
): string {
  const { danisman, mulk, amac, uzunluk, tema } = istek;

  const prompt = `
Sen profesyonel bir emlak sunum yazarlısın. Kullanıcı bir gayrimenkul sunumu oluşturmak istiyor.

DANİŞMAN BİLGİLERİ:
- Ad: ${danisman.adSoyad}
- Telefon: ${danisman.telefon}
- Email: ${danisman.email}
${danisman.deneyim ? `- Deneyim: ${danisman.deneyim}` : ""}
${danisman.referans ? `- Referans: ${danisman.referans}` : ""}

GAYRİMENKUL BİLGİLERİ:
- Tür: ${mulk.tur}
- Konum: ${mulk.konum}
${buildPriceLine(mulk)}
${mulk.metrekare ? `- Metrekare: ${mulk.metrekare} m²` : ""}
${mulk.odaSayisi ? `- Oda: ${mulk.odaSayisi}` : ""}
${mulk.cephe ? `- Cephe: ${mulk.cephe}` : ""}
${mulk.kat ? `- Kat: ${mulk.kat}` : ""}
${mulk.yas ? `- Yaş: ${mulk.yas}` : ""}
${mulk.krediyeUygun ? `- Krediye Uygunluk: ${mulk.krediyeUygun === 'uygun' ? 'Evet, Krediye Uygun' : mulk.krediyeUygun === 'kismen' ? 'Kısmen / Bankaya Göre' : 'Hayır, Krediye Uygun Değil'}` : ""}
${mulk.cevreOzellikleri && mulk.cevreOzellikleri.length > 0 ? `- Çevre Özellikleri: ${mulk.cevreOzellikleri.join(", ")}` : ""}
${mulk.avantajlar && mulk.avantajlar.length > 0 ? `- Avantajlar: ${mulk.avantajlar.join(", ")}` : ""}
${mulk.aciklama ? `- Açıklama: ${mulk.aciklama}` : ""}

SUNUM PARAMETRELERİ:
- Amaç: ${amac === "portfoy_almak" ? "Portföy almak (satıcıya güven vermek)" : "Portföy satmak (müşteriye sunum)"}
- Uzunluk: ${uzunluk === "kisa" ? "Kısa" : uzunluk === "orta" ? "Orta" : "Uzun"}
- Tema: ${tema === "modern" ? "Modern" : tema === "kurumsal" ? "Kurumsal" : "Lüks"}

TEMİZLEMEK: Emlak ve gayrimenkul terimleri, güven, profesyonellik, bilgilendirme odaklı yaklaşım.

${temaTanimlari[tema]}

${mulkTuruAciklamalari[mulk.tur]}

Uzunluk: ${uzunlukAciklamalari[uzunluk].detay}

🚨 ÇOK ÇOK ÖNEMLİ - MUTLAKA UYULMASI GEREKEN KURALLAR:

1. MÜLK TÜRÜ: Bu sunum bir **${mulkTurleri[mulk.tur]}** içindir!
   - "Arsa" kelimesini asla kullanma, bunun yerine "${mulkTurleri[mulk.tur]}" kullan
   - Başlıklar: "${mulkTurleri[mulk.tur]}nızı/nizi" (örn: Dairenizi, Villanızı, Arsanızı)
   - Tüm içeriği ${mulkTurleri[mulk.tur]} özellikleri için yaz
   - ${mulk.tur === "daire" ? "Daire özellikleri: oda sayısı, kat, metrekare, bina yaşı, krediye uygunluk" : ""}
   - ${mulk.tur === "villa" ? "Villa özellikleri: bahçe, otopark, lüks detaylar, villa yaşam tarzı" : ""}
   - ${mulk.tur === "arsa" ? "Arsa özellikleri: imar durumu, metrekare, konum avantajları" : ""}
   - ${mulk.tur === "ticari" ? "İşyeri özellikleri: lokasyon, müşteri trafiği, iş potansiyeli" : ""}

2. İÇERİK DİNAMİZMİ:
   - Her bölümü ${mulkTurleri[mulk.tur]} için özel yaz
   - Problemler bölümünde "${mulkTurleri[mulk.tur]} satarken" yaz
   - Süreç bölümünde "${mulkTurleri[mulk.tur]} satış sistemi" yaz
   - Çözümler ${mulkTurleri[mulk.tur]}'e özgü olsun

3. DİĞER KURALLAR:
   - ${amac === "portfoy_almak" ? "Gayrimenkulün değerini vurgula, güvenli iş ortağı olduğunuzu hissettir." : "Müşteriye çözüm sunan bir yaklaşım, yatırım fırsatları, avantajlar vurgulanmalı."}
   - AI tarafından üretildiği belli OLMAMALI, profesyonel danışman kaleminden çıkmış gibi olmalı.
   - Rakamsal veriler varsa kullan, yoksa gerçekçi tahminler yap.
   - Sunum "satış" değil "bilgilendirme ve güven" odaklı olmalı.

ÇIKTI FORMAT:
JSON formatında döndür. Yapı:
{
  "baslik": "Ana başlık (maksimum 60 karakter)",
  "altBaslik": "Alt başlık (opsiyonel, maksimum 100 karakter)",
  "heroAciklama": "Hero bölümü için kısa ve etkileyici açıklama (2-3 cümle)",
  "bolgeler": [
    {
      "baslik": "Bölge başlığı",
      "icerik": "Bölge içeriği (2-3 paragraf)",
      "tip": "text"
    },
    {
      "baslik": "İstatistikler",
      "icerik": "Yatırım değeri: %25 artış | Metroya uzaklık: 500m | Trend nüfus: +15%",
      "tip": "stats"
    }
  ],
  "cti": {
    "baslik": "Harekete geç başlığı",
    "aciklama": "İletişim için açıklama"
  }
}

TOPLAM BÖLGE: ${uzunlukAciklamalari[uzunluk].bolge}

${(() => {
      try {
        const kfeData = getKFEForProperty(mulk);
        const kfeText = formatKFEForPrompt(kfeData);
        return kfeText;
      } catch (error) {
        console.warn('KFE verisi yüklenemedi:', error);
        return '';
      }
    })()}

${marketData ? `
📊 VERİYE DAYALI PİYASA ANALİZİ (${marketData.location}):

Bu veriler Endeksa, Zingat, Emlakjet ve Sahibinden gibi kaynaklardan toplanmıştır.

- Bölge Ortalama m² Fiyatı: ₺${marketData.sqm_avg.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
- Satışa Dönüş Süresi: ${marketData.sale_duration_days} gün (ortalama)
- Talep Eğilimi: ${marketData.demand_change_percent > 0 ? '+' : ''}${marketData.demand_change_percent.toFixed(1)}%
${marketData.active_listings_count ? `- Aktif İlan Sayısı: ${marketData.active_listings_count}` : ''}
${marketData.six_month_trend && marketData.six_month_trend.length > 0 ? `
- Son 6 Ay Trend (m² fiyat):
  ${marketData.six_month_trend.map((price, idx) => `${6 - marketData.six_month_trend!.length + idx + 1}. ay: ₺${price.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`).join('\n  ')}
` : ''}

Bu verileri "Veriye Dayalı Piyasa Analizi" bölümünde kullan. Grafik ve istatistikler oluştur. 
Bölge ortalaması ile gayrimenkul fiyatını karşılaştır. Trend analizi yap.
Veriler kaynaklarıyla birlikte sunulmalı: "${marketData.data_source.join(', ')}".
` : ''}
`;

  return prompt;
}

export async function sunumOlustur(
  istek: SunumOlusturmaIstegi,
  templateId?: string,
  marketData?: import('@/lib/services/market-analysis/types').MarketAnalysisData | null
): Promise<SunumIcerik> {
  console.log("🚀 Sunum oluşturma başlatıldı");
  console.log("📊 API Durumu:", { useOpenRouter, useGemini, isMockMode });

  // KFE verilerini hesapla
  let kfeData: any = null;
  try {
    kfeData = getKFEForProperty(istek.mulk);
  } catch (error) {
    console.warn("⚠️ KFE verileri hesaplanamadı:", error);
  }

  const buildBaseTemplate = () =>
    generateSunumFromTemplate({
      mulk: istek.mulk,
      danisman: istek.danisman,
      tema: istek.tema,
      uzunluk: istek.uzunluk,
      amac: istek.amac,
      sunumStili: istek.sunumStili,
      templateId: finalTemplateId,
      locationAnalysis: istek.locationAnalysis,
      detayliDegerleme: istek.detayliDegerleme,
      detayliDegerlemeAktif: (istek as any).detayliDegerlemeAktif,
      kfeData,
      // Formdan gelen AI analizleri
      marketAnalysisCards: (istek as any).marketAnalysisCards,
      targetAudience: (istek as any).targetAudience,
      adChannels: (istek as any).adChannels,
    });

  // 🚨 CRITICAL FIX: Mock mode kontrolü EN BAŞTA
  // API key yoksa hemen template döndür, AI çağrısı yapma
  if (isMockMode) {
    console.warn("⚠️⚠️⚠️ API Key bulunamadı - Template-Only Mode aktif ⚠️⚠️⚠️");
    console.warn("⚠️ OPENROUTER_API_KEY veya GEMINI_API_KEY .env.local dosyasına ekleyin");
    console.warn("⚠️ AI destekli içerik üretimi çalışmayacak - sadece template verisi kullanılacak");
    console.warn("⚠️ Kurulum talimatları için AI_API_SETUP.md dosyasına bakın");

    const template = buildBaseTemplate();
    console.log("✅ Template-only sunum oluşturuldu (AI içeriği yok)");

    // enrichTemplateWithAI burada çağrılmaz çünkü henüz tanımlanmadı
    return template;
  }

  // Zip template kontrolü - eğer zip template kullanılacaksa AI çağrısı yapma
  const finalTemplateId = (templateId as any) || "detayli_analiz";
  const isCorporateZipTemplate =
    finalTemplateId === 'detayli_analiz' &&
    istek.sunumStili === 'detayli_analiz' &&
    istek.tema === 'kurumsal' &&
    istek.amac === 'portfoy_almak';

  const isModernZipTemplate =
    finalTemplateId === 'detayli_analiz' &&
    istek.sunumStili === 'detayli_analiz' &&
    istek.tema === 'modern' &&
    istek.amac === 'portfoy_almak';

  const isLuxuryZipTemplate =
    finalTemplateId === 'detayli_analiz' &&
    istek.sunumStili === 'detayli_analiz' &&
    istek.tema === 'luks' &&
    istek.amac === 'portfoy_almak';

  const isModernQuickSaleZipTemplate =
    finalTemplateId === 'detayli_analiz' &&
    istek.sunumStili === 'hizli_satis' &&
    istek.tema === 'modern' &&
    istek.amac === 'portfoy_almak';

  // Hedef Kitle Profili, Reklam Kanalları ve Konum Analizi için AI çağrıları yapan helper fonksiyon
  const enrichTemplateWithAI = async (template: SunumIcerik): Promise<SunumIcerik> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Konum Analizi & Değerleme
      try {
        const marketAnalysisBolge = template.bolgeler?.find(b => b.tip === 'market_analysis');
        // Bölge varsa ve altBolge boş VEYA sadece stats/comparison tipinde ise AI ile zenginleştir
        const hasOnlyStatsOrComparison = marketAnalysisBolge?.altBolge?.every(
          (alt) => alt.tip === 'stats' || alt.tip === 'comparison'
        );

        if (marketAnalysisBolge && (
          !marketAnalysisBolge.altBolge ||
          marketAnalysisBolge.altBolge.length === 0 ||
          hasOnlyStatsOrComparison
        )) {
          console.log("🔄 Konum Analizi & Değerleme için AI çağrısı yapılıyor...");
          const marketAnalysisResponse = await fetch(`${baseUrl}/api/ai/generate-market-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mulk: istek.mulk,
              locationAnalysis: istek.locationAnalysis
            })
          });

          if (marketAnalysisResponse.ok) {
            const marketAnalysisData = await marketAnalysisResponse.json();
            if (marketAnalysisData.success && marketAnalysisData.data && Array.isArray(marketAnalysisData.data)) {
              // Mevcut stats/comparison verilerini koru, AI içeriğini ekle
              const existingData = hasOnlyStatsOrComparison ? marketAnalysisBolge.altBolge : [];
              marketAnalysisBolge.altBolge = [
                ...marketAnalysisData.data.map((item: any) => ({
                  baslik: item.baslik,
                  icerik: item.icerik,
                  tip: 'text' as const
                })),
                ...(existingData || [])
              ];
              console.log("✅ Konum Analizi & Değerleme AI ile güncellendi:", marketAnalysisData.data.length, "bölüm");
            }
          }
        } else {
          console.log("ℹ️ Konum Analizi & Değerleme zaten dolu, AI çağrısı atlandı");
        }
      } catch (error) {
        console.warn("⚠️ Konum Analizi & Değerleme AI çağrısı başarısız:", error);
      }

      // Hedef Kitle Profili
      try {
        const targetAudienceBolge = template.bolgeler?.find(b => b.tip === 'target_audience');
        // Bölge varsa ve altBolge boş VEYA çok kısa içerikli ise AI ile zenginleştir
        const hasShortContent = targetAudienceBolge?.altBolge?.every(
          (alt) => !alt.icerik || alt.icerik.length < 50
        );

        if (targetAudienceBolge && (
          !targetAudienceBolge.altBolge ||
          targetAudienceBolge.altBolge.length === 0 ||
          hasShortContent
        )) {
          console.log("🔄 Hedef Kitle Profili için AI çağrısı yapılıyor...");
          const targetAudienceResponse = await fetch(`${baseUrl}/api/ai/generate-target-audience`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mulk: istek.mulk,
              tema: istek.tema,
              amac: istek.amac,
              sunumStili: istek.sunumStili,
              locationAnalysis: istek.locationAnalysis
            })
          });

          if (targetAudienceResponse.ok) {
            const targetAudienceData = await targetAudienceResponse.json();
            if (targetAudienceData.success && targetAudienceData.data && Array.isArray(targetAudienceData.data)) {
              targetAudienceBolge.altBolge = targetAudienceData.data.map((item: any) => ({
                baslik: item.baslik || item.title || 'Hedef Kitle',
                icerik: item.aciklama || item.description || '',
                tip: 'text' as const
              }));
              console.log("✅ Hedef Kitle Profili AI ile güncellendi:", targetAudienceData.data.length, "grup");
            }
          }
        } else {
          console.log("ℹ️ Hedef Kitle Profili zaten dolu, AI çağrısı atlandı");
        }
      } catch (error) {
        console.warn("⚠️ Hedef Kitle Profili AI çağrısı başarısız:", error);
      }

      // Reklam Kanalları
      try {
        const adChannelsBolge = template.bolgeler?.find(b => b.tip === 'ad_channels');
        if (adChannelsBolge && (!adChannelsBolge.altBolge || adChannelsBolge.altBolge.length === 0)) {
          const adChannelsResponse = await fetch(`${baseUrl}/api/ai/generate-ad-channels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mulk: istek.mulk,
              tema: istek.tema,
              amac: istek.amac,
              sunumStili: istek.sunumStili,
              danismanOfisAdi: istek.danisman.ofisAdi
            })
          });

          if (adChannelsResponse.ok) {
            const adChannelsData = await adChannelsResponse.json();
            if (adChannelsData.success && adChannelsData.data && Array.isArray(adChannelsData.data)) {
              adChannelsBolge.altBolge = [{
                baslik: 'Platformlar',
                icerik: adChannelsData.data.join('\n'),
                tip: 'list' as const
              }];
              console.log("✅ Reklam Kanalları AI ile güncellendi:", adChannelsData.data.length, "kanal");
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Reklam Kanalları AI çağrısı başarısız:", error);
      }
    } catch (error) {
      console.warn("⚠️ AI zenginleştirme genel hatası:", error);
    }

    return template;
  };

  const zipChecks = [
    {
      active: isCorporateZipTemplate,
      path: ['portfoy-detayli-analiz-kurumsal', 'components', 'HeroSection.tsx'],
      label: 'Kurumsal',
    },
    {
      active: isModernZipTemplate,
      path: ['portfoy-detayli-analiz-modern', 'components', 'HeroSection.tsx'],
      label: 'Modern',
    },
    {
      active: isLuxuryZipTemplate,
      path: ['portfoy-detayli-analiz-luks', 'components', 'HeroSection.tsx'],
      label: 'Lüks',
    },
    {
      active: isModernQuickSaleZipTemplate,
      path: ['portfoy-hizli-satis-modern', 'components', 'HeroSection.tsx'],
      label: 'Hızlı Satış (Modern)',
    },
  ];

  for (const check of zipChecks) {
    if (!check.active) continue;
    try {
      const fs = require('fs');
      const path = require('path');
      const templatePath = path.join(process.cwd(), 'src', 'components', 'templates', ...check.path);
      if (fs.existsSync(templatePath)) {
        console.log(`📦 ${check.label} zip template bulundu, AI çağrısı atlanıyor`);
        return buildBaseTemplate();
      }
    } catch (error) {
      console.log(`📦 ${check.label} zip template kontrolünde sorun:`, error);
    }
  }

  // Önce template yapısını al
  const baseTemplate = buildBaseTemplate();

  // OpenRouter öncelikli
  if (useOpenRouter) {
    console.log("🤖 OpenRouter API kullanılıyor...");
    try {
      const prompt = buildEnhancementPrompt(istek, baseTemplate);
      const mulkTurLabel = istek.mulk.tur === "arsa" ? "Arsa" : istek.mulk.tur === "daire" ? "Daire" : istek.mulk.tur === "villa" ? "Villa" : istek.mulk.tur === "ticari" ? "Ticari Gayrimenkul" : istek.mulk.tur === "ofis" ? "Ofis" : "Kompleks";

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://pyrize.app',
          'X-Title': 'PYRIZE - Emlak Funnel Builder'
        },
        body: JSON.stringify({
          model: 'x-ai/grok-4.1-fast:free',
          messages: [
            {
              role: 'system',
              content: (() => {
                const isModernTemplate = isModernZipTemplate;
                const modernTemplateGuidelines = isModernTemplate ? `

🎨 MODERN TEMPLATE ÖZEL KURALLARI (ÇOK ÖNEMLİ):

1. UI TASARIMI:
   - Bu template DARK THEME (slate-950, slate-900) kullanıyor
   - Modern, minimal, temiz tasarım yaklaşımı
   - Hero section'da FOTOĞRAFLAR ön planda (fotograflar array'i kullanılacak)
   - Danışman bilgisi YOK - hero section'da sadece lokasyon ve mülk bilgileri
   - Başlıklar büyük, bold, modern fontlar kullanıyor
   - İçerikler kısa, öz, etkileyici olmalı

2. HERO SECTION:
   - Başlık: Maksimum 60 karakter, modern ve etkileyici
   - Alt başlık: Konum, metrekare, fiyat bilgileri (opsiyonel)
   - Hero açıklama: 2-3 cümle, mülkün özelliklerini vurgulayan
   - DANIŞMAN ADI VE FOTOĞRAFI ASLA EKLEME
   - Sadece mülk bilgileri ve konum göster

3. BÖLGE YAPISI:
   - "cozum" bölümü → "Neden Biz?" section'ına dönüşüyor (StrategicAdvantage formatı)
     * Her alt bölge bir avantaj kartı olacak
     * Format: { title: "Başlık", description: "Kısa açıklama (1 cümle)", comparison: "Sonuç metni" }
     * Örnek: { title: "Profesyonel Değerleme", description: "Doğru fiyat, maksimum gelir", comparison: "Bireysel satışa göre %15 daha yüksek değer" }
   
   - "process" bölümü → "6 Adımlı Satış Sistemi" section'ına dönüşüyor (SalesSystemStep formatı)
     * Her alt bölge bir adım olacak
     * Format: { baslik: "Adım başlığı", neYapiyoruz: ["Madde 1", "Madde 2"], kazanciniz: "Kazanç açıklaması" }
     * "ne yapıyorum" veya "ne yapıyoruz" ifadelerini kullan
     * "kazancınız" veya "sizin kazancınız" ifadelerini kullan
   
   - "location_advantages" → Konum avantajları listesi (string array)
   - "usage_potential" → Kullanım potansiyeli listesi (string array)
   - "market_analysis" → Piyasa analizi bölümü (dark theme'e uygun)
   - "faq" → SSS bölümü (FAQItem formatı: { question: "...", answer: "..." })

4. DİL VE TON:
   - Modern, profesyonel, güven verici
   - Kısa cümleler, etkileyici ifadeler
   - Dark theme'e uygun, kontrastlı metinler
   - Teknik jargon kullanma, anlaşılır dil
   - Emoji kullanma, sadece metin

5. İÇERİK UZUNLUĞU:
   - Hero açıklama: 2-3 cümle (maksimum 150 karakter)
   - Bölge içerikleri: 2-3 paragraf (her paragraf 2-3 cümle)
   - Avantaj açıklamaları: 1 cümle (maksimum 100 karakter)
   - Adım açıklamaları: 2-4 madde (her madde 1 cümle)
   - FAQ cevapları: 2-3 cümle

6. FOTOĞRAFLAR:
   - Hero section'da fotograflar array'i kullanılacak
   - Fotoğraf yoksa sadece metin gösterilecek
   - Fotoğraf varsa modern, büyük görsel ön planda

7. REGIONAL COMPARISON:
   - Market snapshots: Kısa, öz, veri odaklı
   - Comparables: Tablo formatında, temiz
   - Estimated value range: Sadece varsa göster, yoksa gösterme

` : '';

                return `Sen profesyonel bir emlak sunum yazarlısın. Verilen funnel template'ini gayrimenkul bilgilerine göre özelleştiriyorsun. 

ÇOK ÖNEMLİ KURALLAR:

1. MÜLK TÜRÜ: Bu sunum "${mulkTurLabel}" için hazırlanıyor. "Arsa" kelimesini ASLA kullanma. Sadece "${mulkTurLabel}" kelimesini kullan. Tüm içeriği bu mülk türüne göre özelleştir.

2. KONUM ANALİZİ: ${istek.locationAnalysis ? `Verilen bölge analizini ("${istek.locationAnalysis}") MUTLAKA funnel içeriğine entegre et. Konum analizi bölümünde kullan, bölgenin özelliklerini vurgula.` : 'Konum analizi mevcut değil, genel bölge bilgileri kullan.'}

3. EK AÇIKLAMA: ${istek.mulk.aciklama ? `Kullanıcının ek açıklaması ("${istek.mulk.aciklama}") ÇOK ÖNEMLİ. Bu açıklamadaki HER DETAYI funnel içeriğine yansıt. Özel özellikler, durumlar, avantajlar varsa vurgula. Bu açıklama chatbot gibi çalışmalı - kullanıcı ne yazdıysa o içeriğe yansımalı.` : 'Ek açıklama yok, standart içerik kullan.'}

4. AMAÇ ODAKLI: ${istek.amac === "portfoy_almak" ? "PORTFÖY ALMAK: Satıcıya güven verici dil kullan, profesyonelliği vurgula, doğru fiyat analizi yap. Problemler bölümünde bireysel satış sorunlarını, çözüm bölümünde profesyonel danışmanlık avantajlarını vurgula." : "PORTFÖY SATMAK: Müşteriye bilgilendirici ve satış odaklı dil kullan, yatırım fırsatını vurgula, FOMO yarat. Problemler bölümünde yanlış yatırım risklerini, çözüm bölümünde bu gayrimenkulün avantajlarını vurgula."}

5. DETAYLI DEĞERLEME RAPORU (PİYASA ANALİZ RAPORU): ${(istek as any).detayliDegerlemeAktif && istek.detayliDegerleme ? `
Kullanıcı form üzerinden "Piyasa Analiz Raporu" sekmesini doldurmuş. Bu verileri MUTLAKA kullan:

📊 PİYASA GÖSTERGELERİ (marketSnapshots):
- Verilen her bir göstergeyi kart formatında göster
- Trend bilgisi varsa (up/down/stable) görsel olarak belirt
- Trend label varsa ekle

📋 EMSAL MÜLKLER (comparables):
- Verilen emsal mülkleri tablo formatında göster
- Adres, Durum (Satıldı/Satışta), Fiyat, Alan (m²), m² Fiyat bilgilerini içer
- Satıldı olanları yeşil, Satışta olanları mavi renkle vurgula

💰 TAHMİNİ DEĞER ARALIĞI (estimatedValueRange):
- Bu değeri vurgulu ve büyük fontla göster
- Değerleme raporunun ana sonucu olarak sun

⚠️ ÖNEMLİ:
- Bu bölüm "regional_comparison" tipinde bir bölge olarak funnel'a eklenmeli
- Modern tema seçildiyse, bu bölüm hero bölümünden HEMEN SONRA gösterilmeli
- Verileri olduğu gibi kullan, ekstra yorum ekleme
- Profesyonel ve veri odaklı dil kullan
` : 'Detaylı değerleme verisi yok, bu bölümü oluşturma.'}

${modernTemplateGuidelines}

Örnek:
- YANLIŞ: "Arsanızı Satarken"
- DOĞRU: "${mulkTurLabel}nızı/nizi Satarken"

Tüm başlıklar, içerikler ve açıklamalar ${mulkTurLabel} için özel yazılmalıdır.`;
              })()
            },
            {
              role: 'user',
              content: buildPrompt(istek, marketData)
            }
          ],
          temperature: 0.7,
          max_tokens: 8000
        })
      });

      if (!response.ok) {
        console.error('❌ OpenRouter API hatası:', response.status, await response.text());
        console.log("⚠️ Template ile devam ediliyor...");
        return baseTemplate;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      console.log("📥 OpenRouter'dan yanıt alındı, uzunluk:", text.length, "karakter");

      // JSON parse et ve template ile birleştir
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const enhanced = JSON.parse(jsonMatch[0]);
          console.log("✅ OpenRouter'dan başarılı veri geldi");

          // Template'in yapısını KORU, sadece içerikleri güncelle
          if (enhanced.baslik) baseTemplate.baslik = enhanced.baslik;
          if (enhanced.altBaslik) baseTemplate.altBaslik = enhanced.altBaslik;
          if (enhanced.heroAciklama) baseTemplate.heroAciklama = enhanced.heroAciklama;
          if (enhanced.detayliDegerleme) baseTemplate.detayliDegerleme = enhanced.detayliDegerleme;

          // Bolgeler'i GÜVENLİ şekilde güncelle
          if (enhanced.bolgeler && Array.isArray(enhanced.bolgeler) && baseTemplate.bolgeler) {
            baseTemplate.bolgeler = baseTemplate.bolgeler.map((templateBolge, index) => {
              const enhancedBolge = enhanced.bolgeler[index];
              if (enhancedBolge) {
                const updatedBolge = {
                  ...templateBolge,
                  baslik: enhancedBolge.baslik || templateBolge.baslik,
                  icerik: enhancedBolge.icerik || templateBolge.icerik
                };

                if (templateBolge.altBolge && Array.isArray(templateBolge.altBolge)) {
                  updatedBolge.altBolge = templateBolge.altBolge.map((templateAlt, altIndex) => {
                    const enhancedAlt = enhancedBolge.altBolge?.[altIndex];
                    if (enhancedAlt) {
                      return {
                        ...templateAlt,
                        baslik: enhancedAlt.baslik || templateAlt.baslik,
                        icerik: enhancedAlt.icerik || templateAlt.icerik
                      };
                    }
                    return templateAlt;
                  });
                }

                return updatedBolge;
              }
              return templateBolge;
            });
          }

          const enriched = await enrichTemplateWithAI(baseTemplate);
          return enriched;
        } catch (parseError) {
          console.log("❌ JSON parse hatası:", parseError);
          const enriched = await enrichTemplateWithAI(baseTemplate);
          return enriched;
        }
      }

      const enriched = await enrichTemplateWithAI(baseTemplate);
      return enriched;
    } catch (error) {
      console.error("❌ OpenRouter API hatası:", error);
      console.log("⚠️ Template ile devam ediliyor...");
      const enriched = await enrichTemplateWithAI(baseTemplate);
      return enriched;
    }
  }

  // Gemini fallback
  if (useGemini && genAI) {
    console.log("🤖 Gemini AI çağrılıyor...");
    try {
      const mulkTurLabel = istek.mulk.tur === "arsa" ? "Arsa" : istek.mulk.tur === "daire" ? "Daire" : istek.mulk.tur === "villa" ? "Villa" : istek.mulk.tur === "ticari" ? "Ticari Gayrimenkul" : istek.mulk.tur === "ofis" ? "Ofis" : "Kompleks";

      // Modern template için özel prompt
      const isModernTemplate = isModernZipTemplate;
      const modernTemplateGuidelines = isModernTemplate ? `

🎨 MODERN TEMPLATE ÖZEL KURALLARI (ÇOK ÖNEMLİ):

1. UI TASARIMI:
   - Bu template DARK THEME (slate-950, slate-900) kullanıyor
   - Modern, minimal, temiz tasarım yaklaşımı
   - Hero section'da FOTOĞRAFLAR ön planda (fotograflar array'i kullanılacak)
   - Danışman bilgisi YOK - hero section'da sadece lokasyon ve mülk bilgileri
   - Başlıklar büyük, bold, modern fontlar kullanıyor
   - İçerikler kısa, öz, etkileyici olmalı

2. HERO SECTION:
   - Başlık: Maksimum 60 karakter, modern ve etkileyici
   - Alt başlık: Konum, metrekare, fiyat bilgileri (opsiyonel)
   - Hero açıklama: 2-3 cümle, mülkün özelliklerini vurgulayan
   - DANIŞMAN ADI VE FOTOĞRAFI ASLA EKLEME
   - Sadece mülk bilgileri ve konum göster

3. BÖLGE YAPISI:
   - "cozum" bölümü → "Neden Biz?" section'ına dönüşüyor (StrategicAdvantage formatı)
     * Her alt bölge bir avantaj kartı olacak
     * Format: { title: "Başlık", description: "Kısa açıklama (1 cümle)", comparison: "Sonuç metni" }
     * Örnek: { title: "Profesyonel Değerleme", description: "Doğru fiyat, maksimum gelir", comparison: "Bireysel satışa göre %15 daha yüksek değer" }
   
   - "process" bölümü → "6 Adımlı Satış Sistemi" section'ına dönüşüyor (SalesSystemStep formatı)
     * Her alt bölge bir adım olacak
     * Format: { baslik: "Adım başlığı", neYapiyoruz: ["Madde 1", "Madde 2"], kazanciniz: "Kazanç açıklaması" }
     * "ne yapıyorum" veya "ne yapıyoruz" ifadelerini kullan
     * "kazancınız" veya "sizin kazancınız" ifadelerini kullan
   
   - "location_advantages" → Konum avantajları listesi (string array)
   - "usage_potential" → Kullanım potansiyeli listesi (string array)
   - "market_analysis" → Piyasa analizi bölümü (dark theme'e uygun)
   - "faq" → SSS bölümü (FAQItem formatı: { question: "...", answer: "..." })

4. DİL VE TON:
   - Modern, profesyonel, güven verici
   - Kısa cümleler, etkileyici ifadeler
   - Dark theme'e uygun, kontrastlı metinler
   - Teknik jargon kullanma, anlaşılır dil
   - Emoji kullanma, sadece metin

5. İÇERİK UZUNLUĞU:
   - Hero açıklama: 2-3 cümle (maksimum 150 karakter)
   - Bölge içerikleri: 2-3 paragraf (her paragraf 2-3 cümle)
   - Avantaj açıklamaları: 1 cümle (maksimum 100 karakter)
   - Adım açıklamaları: 2-4 madde (her madde 1 cümle)
   - FAQ cevapları: 2-3 cümle

6. FOTOĞRAFLAR:
   - Hero section'da fotograflar array'i kullanılacak
   - Fotoğraf yoksa sadece metin gösterilecek
   - Fotoğraf varsa modern, büyük görsel ön planda

7. REGIONAL COMPARISON:
   - Market snapshots: Kısa, öz, veri odaklı
   - Comparables: Tablo formatında, temiz
   - Estimated value range: Sadece varsa göster, yoksa gösterme

` : '';

      const systemPrompt = `Sen profesyonel bir emlak sunum yazarlısın. Verilen funnel template'ini gayrimenkul bilgilerine göre özelleştiriyorsun. 

ÇOK ÖNEMLİ KURALLAR:

1. MÜLK TÜRÜ: Bu sunum "${mulkTurLabel}" için hazırlanıyor. "Arsa" kelimesini ASLA kullanma. Sadece "${mulkTurLabel}" kelimesini kullan. Tüm içeriği bu mülk türüne göre özelleştir.

2. KONUM ANALİZİ: ${istek.locationAnalysis ? `Verilen bölge analizini ("${istek.locationAnalysis}") MUTLAKA funnel içeriğine entegre et. Konum analizi bölümünde kullan, bölgenin özelliklerini vurgula.` : 'Konum analizi mevcut değil, genel bölge bilgileri kullan.'}

3. EK AÇIKLAMA: ${istek.mulk.aciklama ? `Kullanıcının ek açıklaması ("${istek.mulk.aciklama}") ÇOK ÖNEMLİ. Bu açıklamadaki HER DETAYI funnel içeriğine yansıt. Özel özellikler, durumlar, avantajlar varsa vurgula. Bu açıklama chatbot gibi çalışmalı - kullanıcı ne yazdıysa o içeriğe yansımalı.` : 'Ek açıklama yok, standart içerik kullan.'}

4. AMAÇ ODAKLI: ${istek.amac === "portfoy_almak" ? "PORTFÖY ALMAK: Satıcıya güven verici dil kullan, profesyonelliği vurgula, doğru fiyat analizi yap. Problemler bölümünde bireysel satış sorunlarını, çözüm bölümünde profesyonel danışmanlık avantajlarını vurgula." : "PORTFÖY SATMAK: Müşteriye bilgilendirici ve satış odaklı dil kullan, yatırım fırsatını vurgula, FOMO yarat. Problemler bölümünde yanlış yatırım risklerini, çözüm bölümünde bu gayrimenkulün avantajlarını vurgula."}

5. DETAYLI DEĞERLEME RAPORU (PİYASA ANALİZ RAPORU): ${(istek as any).detayliDegerlemeAktif && istek.detayliDegerleme ? `
Kullanıcı form üzerinden "Piyasa Analiz Raporu" sekmesini doldurmuş. Bu verileri MUTLAKA kullan:

📊 PİYASA GÖSTERGELERİ (marketSnapshots):
- Verilen her bir göstergeyi kart formatında göster
- Trend bilgisi varsa (up/down/stable) görsel olarak belirt
- Trend label varsa ekle

📋 EMSAL MÜLKLER (comparables):
- Verilen emsal mülkleri tablo formatında göster
- Adres, Durum (Satıldı/Satışta), Fiyat, Alan (m²), m² Fiyat bilgilerini içer
- Satıldı olanları yeşil, Satışta olanları mavi renkle vurgula

💰 TAHMİNİ DEĞER ARALIĞI (estimatedValueRange):
- Bu değeri vurgulu ve büyük fontla göster
- Değerleme raporunun ana sonucu olarak sun

⚠️ ÖNEMLİ:
- Bu bölüm "regional_comparison" tipinde bir bölge olarak funnel'a eklenmeli
- Modern tema seçildiyse, bu bölüm hero bölümünden HEMEN SONRA gösterilmeli
- Verileri olduğu gibi kullan, ekstra yorum ekleme
- Profesyonel ve veri odaklı dil kullan
` : 'Detaylı değerleme verisi yok, bu bölümü oluşturma.'}

${modernTemplateGuidelines}

Örnek:
- YANLIŞ: "Arsanızı Satarken"
- DOĞRU: "${mulkTurLabel}nızı/nizi Satarken"

Tüm başlıklar, içerikler ve açıklamalar ${mulkTurLabel} için özel yazılmalıdır.`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const userPrompt = buildEnhancementPrompt(istek, baseTemplate, marketData);
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

      console.log("📤 Prompt gönderiliyor, uzunluk:", fullPrompt.length, "karakter");
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      console.log("📥 Gemini'den yanıt alındı, uzunluk:", text.length, "karakter");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const enhanced = JSON.parse(jsonMatch[0]);
          console.log("✅ Gemini'den başarılı veri geldi");

          if (enhanced.baslik) baseTemplate.baslik = enhanced.baslik;
          if (enhanced.altBaslik) baseTemplate.altBaslik = enhanced.altBaslik;
          if (enhanced.heroAciklama) baseTemplate.heroAciklama = enhanced.heroAciklama;
          if (enhanced.detayliDegerleme) baseTemplate.detayliDegerleme = enhanced.detayliDegerleme;

          if (enhanced.bolgeler && Array.isArray(enhanced.bolgeler) && baseTemplate.bolgeler) {
            baseTemplate.bolgeler = baseTemplate.bolgeler.map((templateBolge, index) => {
              const enhancedBolge = enhanced.bolgeler[index];
              if (enhancedBolge) {
                const updatedBolge = {
                  ...templateBolge,
                  baslik: enhancedBolge.baslik || templateBolge.baslik,
                  icerik: enhancedBolge.icerik || templateBolge.icerik
                };

                if (templateBolge.altBolge && Array.isArray(templateBolge.altBolge)) {
                  updatedBolge.altBolge = templateBolge.altBolge.map((templateAlt, altIndex) => {
                    const enhancedAlt = enhancedBolge.altBolge?.[altIndex];
                    if (enhancedAlt) {
                      return {
                        ...templateAlt,
                        baslik: enhancedAlt.baslik || templateAlt.baslik,
                        icerik: enhancedAlt.icerik || templateAlt.icerik
                      };
                    }
                    return templateAlt;
                  });
                }

                return updatedBolge;
              }
              return templateBolge;
            });
          }

          const enriched = await enrichTemplateWithAI(baseTemplate);
          return enriched;
        } catch (parseError) {
          console.log("❌ JSON parse hatası:", parseError);
          const enriched = await enrichTemplateWithAI(baseTemplate);
          return enriched;
        }
      }

      const enriched = await enrichTemplateWithAI(baseTemplate);
      return enriched;
    } catch (error) {
      console.error("❌ Gemini API hatası:", error);
      const enriched = await enrichTemplateWithAI(baseTemplate);
      return enriched;
    }
  }

  // Mock mode
  console.log("⚠️ Mock mode aktif - sadece template döndürülüyor");
  const enriched = await enrichTemplateWithAI(baseTemplate);
  return enriched;
}

type FieldGenerationType = "konum_avantajlari" | "kullanim_potansiyeli" | "aciklama";

interface FieldGenerationOptions {
  field: FieldGenerationType;
  seed: string;
  mulk: Partial<MulkBilgileri> & { tur: MulkTuru; konum: string };
  tema?: TemaTuru;
  amac?: SunumAmaci;
  sunumStili?: SunumStili;
  locationAnalysis?: string;
}

const sentenceCase = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const splitList = (value?: string): string[] =>
  (value || "")
    .split(/[\n,]+/)
    .map((item) => item.replace(/^[•\-–—→✅\u2022\s]+/, "").trim())
    .filter(Boolean);

const extractLocationName = (konum?: string): string => {
  if (!konum) return "Bölge";
  const [first] = konum.split(",").map((part) => part.trim()).filter(Boolean);
  return first || konum.trim();
};

const fallbackForField = (options: FieldGenerationOptions): string[] => {
  const { field, seed, locationAnalysis, mulk } = options;
  const locationName = extractLocationName(mulk.konum);
  const seedList = splitList(seed);

  if (field === "aciklama") {
    if (seed.trim()) {
      const parts = seed
        .split(/\n{2,}/)
        .map((p) => sentenceCase(p.replace(/\s+/g, " ").trim()))
        .filter(Boolean);
      if (parts.length) return parts;
    }
    const analysisSentences =
      locationAnalysis
        ?.split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.replace(/\s+/g, " ").trim())
        .filter(Boolean) || [];

    if (analysisSentences.length) {
      return analysisSentences.slice(0, 2).map(sentenceCase);
    }

    return [
      `${locationName} lokasyonundaki bu ${mulk.tur} modern yaşam ile yatırım dengesini bir arada sunuyor.`,
      "Profesyonel pazarlama altyapısı ve güvenilir süreç yönetimi ile portföyünüzü doğru alıcılarla buluşturuyorum.",
    ];
  }

  if (seedList.length) {
    if (field === "konum_avantajlari" || field === "kullanim_potansiyeli") {
      return seedList.map((item) => `✅ ${sentenceCase(item)}`);
    }
    return seedList.map(sentenceCase);
  }

  if (locationAnalysis && field === "konum_avantajlari") {
    const mapped = locationAnalysis
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((sentence) =>
        sentenceCase(
          sentence.startsWith(locationName)
            ? sentence
            : `${locationName} ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`
        )
      );
    return mapped.map((item) => (field === "konum_avantajlari" ? `✅ ${item}` : item));
  }

  if (field === "konum_avantajlari") {
    return [
      `✅ ${locationName} ana ulaşım akslarına dakikalar içinde bağlanıyor.`,
      `✅ ${locationName} çevresinde artan yatırım projeleri değer artışı potansiyelini yükseltiyor.`,
      `✅ ${locationName} sosyal yaşam, eğitim ve sağlık imkanlarına yakın konumlanıyor.`,
    ];
  }

  return [
    "✅ Hemen değerlendirilebilir bir yatırım fırsatı sunuyor.",
    "✅ Profesyonel yönetim ile risksiz ve hızlı süreç.",
    "✅ Uzun vadede sürdürülebilir gelir ve değer artışı potansiyeli.",
  ];
};

const buildFieldPrompt = (options: FieldGenerationOptions): string => {
  const { field, seed, mulk, tema, amac, sunumStili, locationAnalysis } = options;
  const locationName = extractLocationName(mulk.konum);

  // Konum bilgilerini parse et
  const locationParts = mulk.konum?.split(",").map(p => p.trim()) || [];
  const neighbourhood = locationParts.length > 1 ? locationParts[0] : "";
  const city = locationParts.length > 1 ? locationParts[locationParts.length - 1] : locationParts[0] || "";

  // Fiyat bilgilerini formatla
  const fiyatBilgisi = mulk.fiyatMax
    ? `₺${mulk.fiyatMax.toLocaleString('tr-TR')} - ₺${(mulk.fiyatMin || mulk.fiyatMax * 0.9).toLocaleString('tr-TR')}`
    : mulk.fiyatMin
      ? `₺${mulk.fiyatMin.toLocaleString('tr-TR')}`
      : mulk.fiyat
        ? `₺${mulk.fiyat.toLocaleString('tr-TR')}`
        : 'Belirtilmemiş';

  const fieldInstructions: Record<FieldGenerationType, string> = {
    konum_avantajlari: `Sen bir emlak içerik uzmanısın. Konum bazlı gayrimenkul avantajları oluşturuyorsun.

GÖREV:
${locationName} bölgesindeki bu ${mulk.tur} için "Konum Avantajları" bölümü oluştur. MUTLAKA konum ve fiyat bilgilerine göre özelleştirilmiş içerik üret.

KURALLAR:
1. 4-6 somut avantaj belirt (ulaşım, talep seviyesi, yakın tesisler, yatırım trendi gibi veri odaklı)
2. "Konumu çok iyi" gibi genel ifadelerden KAÇIN
3. Her madde "✅ " simgesi ile başlasın
4. Madde işaretleri formatında yaz
5. Profesyonel ve öz ton kullan
6. Türkçe yaz
7. MUTLAKA ${neighbourhood || city || locationName} bölgesine özel bilgiler kullan
8. Fiyat aralığına göre (${fiyatBilgisi}) uygun avantajlar belirt

GİRDİLER:
- Mülk türü: ${mulk.tur}
- Konum: ${mulk.konum}
${neighbourhood ? `- Mahalle: ${neighbourhood}` : ""}
- Şehir: ${city}
- Fiyat: ${fiyatBilgisi}
${mulk.metrekare ? `- Metrekare: ${mulk.metrekare} m²` : ""}
${locationAnalysis ? `- Bölge analizi: ${locationAnalysis}` : ""}
${seed ? `- Kullanıcı notları: ${seed}` : ""}

ÖNEMLİ: Her seferinde FARKLI ve konuma özel avantajlar üret. Aynı içeriği tekrarlama.

ÇIKTI FORMATI:
SADECE geçerli bir JSON dizisi döndür. Örnek: ["✅ ${neighbourhood || city} bölgesinde yürüyüş mesafesinde metro ve toplu taşıma bağlantıları", "✅ Bölgedeki son 12 ayda artan konut talebi sayesinde yüksek likidite"]

Başka hiçbir açıklama, metin veya ek bilgi ekleme. Sadece JSON dizisi.`,

    kullanim_potansiyeli: `Sen bir emlak içerik uzmanısın. Gayrimenkul kullanım potansiyeli oluşturuyorsun.

GÖREV:
Bu ${mulk.tur} için "Kullanım Potansiyeli" bölümü oluştur. MUTLAKA konum, fiyat ve özelliklere göre özelleştirilmiş içerik üret.

KURALLAR:
1. 3-5 kullanım senaryosu belirt (mülk türüne uygun)
2. Hem kullanıcı hem yatırımcı seçeneklerini dahil et
3. Uygulanabilir gelir potansiyelini belirt (varsa)
4. Cümleleri kısa ve pratik tut
5. Türkçe yaz
6. "Konum avantajları"nı TEKRARLAMA - sadece kullanıma odaklan
7. MUTLAKA ${neighbourhood || city || locationName} bölgesine ve fiyat aralığına (${fiyatBilgisi}) uygun senaryolar üret

GİRDİLER:
- Mülk türü: ${mulk.tur}
- Konum: ${mulk.konum}
- Fiyat: ${fiyatBilgisi}
${mulk.metrekare ? `- Metrekare: ${mulk.metrekare} m²` : ""}
${mulk.yas ? `- Durum: ${mulk.yas} yaşında` : ""}
${mulk.odaSayisi ? `- Oda sayısı: ${mulk.odaSayisi}` : ""}
${mulk.kat ? `- Kat: ${mulk.kat}` : ""}
${seed ? `- Kullanıcı notları: ${seed}` : ""}

ÖNEMLİ: Her seferinde FARKLI ve mülk özelliklerine özel kullanım senaryoları üret. Aynı içeriği tekrarlama.

ÇIKTI FORMATI:
SADECE geçerli bir JSON dizisi döndür. Örnek: ["✅ ${mulk.metrekare ? mulk.metrekare + ' m²' : 'Geniş'} alanıyla aile oturumu için ideal plan", "✅ ${neighbourhood || city} bölgesindeki yüksek talep sayesinde uzun dönem kira getirisiyle yatırım amaçlı kullanım"]

Başka hiçbir açıklama, metin veya ek bilgi ekleme. Sadece JSON dizisi.`,

    aciklama: `Sen bir emlak içerik uzmanısın ve Alex Hormozi tarzında, net, somut ve değer odaklı metinler yazıyorsun.

GÖREV:
${locationName} bölgesindeki bu ${mulk.tur} için, bölgeye özel ve yaratıcı bir "Açıklama" paragrafı yaz.

STİL (Alex Hormozi esintili):
- Okuyan kişinin "Bu tam bana göre" veya "Bu tam yatırımcı işi" demesini sağla.
- Boş övgüler yerine; metrekare, oda sayısı, konum, ulaşım, günlük hayat ve para/zaman kazancı gibi SOMUT faydalara odaklan.
- Cümleler net, kısa ve tok olsun; gereksiz süslü sıfatlardan kaçın.
- İlk cümlede güçlü bir konum + değer vaadi ver, sonraki cümlelerde bunu somutlaştır.

KURGU:
1. Cümle: ${neighbourhood || locationName} ve ${city || locationName} bilgisini kullanarak konum + yaşam vaadini özetle.
2. Cümle: Evin planı, büyüklüğü ve günlük hayatı nasıl kolaylaştırdığını anlat (oda sayısı, metrekare, kat vb).
3. Cümle: Yatırım veya uzun vadeli avantajı net bir cümleyle ver (kira potansiyeli, değer artışı, bölge talebi vb).
4. Cümle (opsiyonel): Hedef alıcıyı netleştir (ör: "sessiz ama merkezi yaşam arayan aileler", "düzenli kira geliri arayan yatırımcılar" vb).

KURALLAR:
1. Toplam 3-4 cümle yaz.
2. Bölge adını (özellikle mahalle/şehir) mutlaka doğal bir şekilde geçir.
3. "Fırsat", "kaçırmayın", "acele edin" gibi klasik satış klişelerini ASLA kullanma.
4. Türkçe yaz; samimi ama profesyonel, abartısız ve güven veren bir ton kullan.
5. AI olduğun anlaşılmasın; deneyimli bir emlak danışmanı gibi yaz.

GİRDİLER:
- Mülk türü: ${mulk.tur}
- Konum: ${mulk.konum}
${neighbourhood ? `- Mahalle: ${neighbourhood}` : ""}
${city ? `- Şehir: ${city}` : ""}
${mulk.metrekare ? `- Metrekare: ${mulk.metrekare} m²` : ""}
${mulk.odaSayisi ? `- Oda sayısı: ${mulk.odaSayisi}` : ""}
${mulk.kat ? `- Kat: ${mulk.kat}` : ""}
${mulk.yas ? `- Durum: ${mulk.yas} yaşında` : ""}
${mulk.cevreOzellikleri && mulk.cevreOzellikleri.length > 0 ? `- Ek özellikler: ${mulk.cevreOzellikleri.join(", ")}` : ""}
${seed ? `- Kullanıcı notları: ${seed}` : ""}

ÇIKTI FORMATI:
SADECE geçerli bir JSON dizisi döndür. Tek bir paragraf için: ["Paragraf metni buraya"]

Başka hiçbir açıklama, metin veya ek bilgi ekleme. Sadece JSON dizisi.`,
  };

  return fieldInstructions[field];
};

const parseJsonArray = (raw: string): string[] => {
  if (!raw || typeof raw !== "string") {
    console.warn("parseJsonArray: Geçersiz input", raw);
    return [];
  }

  // Eğer input zaten ID benzeri görünüyorsa, direkt boş döndür
  const trimmedInput = raw.trim();
  if (trimmedInput.length < 20 || /^[a-z0-9]{8,}$/i.test(trimmedInput)) {
    console.warn("parseJsonArray: Input ID benzeri görünüyor, atlanıyor:", trimmedInput);
    return [];
  }

  // Önce temizle: Markdown code block'ları ve gereksiz karakterleri kaldır
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/```json\s*/gi, "").replace(/```\s*/g, "");
  cleaned = cleaned.replace(/^[^{[]*/, ""); // Başındaki gereksiz metni kaldır
  cleaned = cleaned.replace(/[^}\]]*$/, ""); // Sonundaki gereksiz metni kaldır

  // JSON array'i bul (nested array'ler için de çalışmalı)
  // Önce tam eşleşme dene
  let jsonArrayPattern = /\[[\s\S]*?\]/;
  let match = cleaned.match(jsonArrayPattern);

  // Eğer bulunamazsa, daha geniş bir pattern dene
  if (!match) {
    jsonArrayPattern = /\[[^\]]*\]/;
    match = cleaned.match(jsonArrayPattern);
  }

  if (!match) {
    console.warn("parseJsonArray: JSON array bulunamadı. Raw:", raw.substring(0, 200));
    return [];
  }

  try {
    const jsonStr = match[0];
    const parsed = JSON.parse(jsonStr);

    if (Array.isArray(parsed)) {
      const result = parsed
        .map((item) => {
          if (typeof item === "string") {
            const trimmed = item.trim();
            // Çok kısa veya sadece ID gibi görünen şeyleri filtrele (min 15 karakter)
            if (trimmed.length < 15) {
              console.warn("parseJsonArray: Çok kısa öğe filtrelendi:", trimmed);
              return null;
            }
            // ID benzeri pattern kontrolü
            if (/^[a-z0-9]{8,}$/i.test(trimmed)) {
              console.warn("parseJsonArray: ID benzeri öğe filtrelendi:", trimmed);
              return null;
            }
            // Türkçe karakter veya anlamlı içerik kontrolü
            if (!/[a-zğüşöçıİĞÜŞÖÇ]/i.test(trimmed)) {
              console.warn("parseJsonArray: Anlamsız öğe filtrelendi:", trimmed);
              return null;
            }
            return trimmed;
          }
          return null;
        })
        .filter((item): item is string => Boolean(item));

      if (result.length > 0) {
        console.log("✅ parseJsonArray başarılı:", result.length, "öğe");
        return result;
      } else {
        console.warn("parseJsonArray: Parse edildi ama tüm öğeler filtrelendi");
      }
    }
  } catch (error) {
    console.error("❌ parseJsonArray JSON parse hatası:", error);
    console.error("Raw input:", raw.substring(0, 500));
    console.error("Cleaned input:", cleaned.substring(0, 500));
  }

  return [];
};

export async function generateFieldContent(options: FieldGenerationOptions): Promise<string[]> {
  console.log("🎯 generateFieldContent çağrıldı:", { field: options.field, konum: options.mulk.konum });

  const fallback = fallbackForField(options);
  console.log("📋 Fallback değerler:", fallback);

  // API key kontrolü - runtime'da tekrar kontrol et
  const runtimeOpenRouterKey = process.env.OPENROUTER_API_KEY || "";
  const runtimeUseOpenRouter = runtimeOpenRouterKey && runtimeOpenRouterKey !== "your_openrouter_api_key_here" && runtimeOpenRouterKey !== "";

  console.log("🔑 Runtime API Key Durumu:", {
    hasKey: !!runtimeOpenRouterKey,
    keyLength: runtimeOpenRouterKey?.length || 0,
    keyPrefix: runtimeOpenRouterKey?.substring(0, 10) || "N/A",
    useOpenRouter: runtimeUseOpenRouter,
    isMockMode
  });

  if (isMockMode && !runtimeUseOpenRouter) {
    console.warn("⚠️ Mock mode aktif - API key bulunamadı, fallback değerler kullanılıyor");
    console.warn("⚠️ .env.local dosyasına OPENROUTER_API_KEY ekleyin ve sunucuyu yeniden başlatın");
    return fallback;
  }

  const prompt = buildFieldPrompt(options);
  console.log("📝 Prompt oluşturuldu, field:", options.field);
  console.log("📝 Prompt uzunluğu:", prompt.length, "karakter");

  // OpenRouter yanıt metni burada tutulacak
  let text = "";

  try {
    if (useOpenRouter || runtimeUseOpenRouter) {
      const apiKeyToUse = runtimeUseOpenRouter ? runtimeOpenRouterKey : OPENROUTER_API_KEY;
      console.log("🚀 OpenRouter SDK ile istek gönderiliyor...");
      console.log("🔑 Kullanılan API key uzunluğu:", apiKeyToUse?.length || 0);
      console.log("🔑 API key prefix:", apiKeyToUse?.substring(0, 15) || "N/A");

      const client = getOpenRouterClient(apiKeyToUse);

      try {
        const response = await client.chat.send({
          model: "x-ai/grok-4.1-fast:free",
          temperature: 0.3,
          maxTokens: 800,
          messages: [
            {
              role: "system",
              content:
                "Sen profesyonel bir emlak içerik uzmanısın. KRİTİK: Cevabın MUTLAKA geçerli bir JSON dizisi olmalı. Sadece JSON dizisi döndür, başka hiçbir şey ekleme. Örnek: [\"✅ İlk madde buraya\", \"✅ İkinci madde buraya\"]",
            },
            {
              role: "user",
              content: prompt + "\n\nÖNEMLİ: Sadece JSON dizisi döndür. Başka hiçbir metin, açıklama veya ek bilgi ekleme.",
            },
          ],
        });

        // SDK response'u parse et
        if (typeof response === "string") {
          text = response;
        } else if (response && typeof response === "object") {
          // SDK response objesi
          const messageContent =
            (response as any).choices?.[0]?.message?.content ||
            (response as any).content ||
            (response as any).text ||
            "";

          if (typeof messageContent === "string") {
            text = messageContent;
          } else if (Array.isArray(messageContent)) {
            text = messageContent
              .map((part: any) => {
                if (typeof part === "string") return part;
                if (typeof part?.text === "string") return part.text;
                if (part?.content) return String(part.content);
                return "";
              })
              .filter(Boolean)
              .join("\n");
          }
        }

        console.log("🤖 AI'dan gelen ham yanıt (tam):", text);
        console.log("🤖 AI'dan gelen ham yanıt (ilk 500 karakter):", text.substring(0, 500));
      } catch (error: any) {
        console.error("❌ OpenRouter SDK hatası:", {
          message: error?.message,
          name: error?.name,
          stack: error?.stack
        });
        return fallback;
      }

      // Eğer text çok kısa veya ID benzeri görünüyorsa, direkt fallback döndür
      const textWithoutEmoji = text.replace(/[✅✔✓✗✘●○■□▲△◆◇★☆]/g, '').trim();
      if (text.length < 20 || /^[a-z0-9]{6,}$/i.test(textWithoutEmoji)) {
        console.warn("⚠️ AI yanıtı geçersiz görünüyor (ID benzeri), fallback kullanılıyor");
        console.warn("⚠️ Text:", text);
        console.warn("⚠️ Text without emoji:", textWithoutEmoji);
        return fallback;
      }

      const list = parseJsonArray(text);
      console.log("📊 Parse sonucu:", { listLength: list.length, list });

      if (list.length > 0) {
        // Filtreleme: ID benzeri veya çok kısa string'leri çıkar
        const filtered = list.filter(item => {
          const trimmed = item.trim();

          // Çok kısa kontrolü (en az 15 karakter - emoji'yi de sayarak)
          if (trimmed.length < 15) {
            console.warn("🔍 Filtrelendi (çok kısa):", trimmed);
            return false;
          }

          // Emoji ve özel karakterleri kaldır, sadece metin kısmını kontrol et
          const textOnly = trimmed.replace(/^[✅✔✓✗✘●○■□▲△◆◇★☆]/g, '').trim();

          // Eğer emoji'den sonra çok az karakter kaldıysa, geçersiz
          if (textOnly.length < 10) {
            console.warn("🔍 Filtrelendi (emoji sonrası çok kısa):", trimmed);
            return false;
          }

          // ID benzeri pattern kontrolü - emoji'den sonraki kısımda
          // Sadece harf/rakam ve çok kısa ise ID benzeri olabilir
          if (/^[a-z0-9]{6,}$/i.test(textOnly)) {
            console.warn("🔍 Filtrelendi (ID benzeri - sadece harf/rakam):", trimmed);
            return false;
          }

          // Anlamlı içerik kontrolü - en az 2 kelime veya uzun bir cümle olmalı
          // Boşluk içermeli (kelimeler arası) veya çok uzun olmalı
          const hasSpaces = /\s/.test(textOnly);
          const isLongEnough = textOnly.length >= 20;

          if (!hasSpaces && !isLongEnough) {
            console.warn("🔍 Filtrelendi (kelime yok, çok kısa):", trimmed);
            return false;
          }

          // Türkçe karakter veya anlamlı içerik kontrolü
          // En az bir harf içermeli (Türkçe veya İngilizce)
          if (!/[a-zğüşöçıİĞÜŞÖÇA-Z]/i.test(textOnly)) {
            console.warn("🔍 Filtrelendi (harf yok):", trimmed);
            return false;
          }

          console.log("✅ Geçerli öğe:", trimmed);
          return true;
        });

        console.log("📊 Filtreleme sonucu:", { filteredLength: filtered.length, filtered });

        if (filtered.length > 0) {
          console.log("✅ Başarıyla parse edildi ve filtrelendi:", filtered);
          return filtered;
        }
        console.warn("⚠️ Parse edildi ama filtreleme sonrası boş kaldı. Orijinal liste:", list);
        // Filtreleme sonrası boş kaldıysa, orijinal listeyi döndür (güvenlik için)
        return list;
      }

      console.warn("⚠️ Parse başarısız, fallback kullanılıyor:", fallback);
      return fallback;
    }

    if (useGemini && genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const result = await model.generateContent([
        "Sen profesyonel bir emlak içerik uzmanısın.",
        prompt,
      ]);
      const text = (await result.response.text()) || "";
      const list = parseJsonArray(text);
      if (list.length) {
        return list;
      }
    }
  } catch (error) {
    console.error("Alan içeriği üretim hatası:", error);
  }

  return fallback;
}

function formatPromptSection(title: string, content: string): string {
  return `━━━━━━━━━━━━━━━━━━━━━━━━━
${title}:
━━━━━━━━━━━━━━━━━━━━━━━━━
${content}`.trim();
}

function buildEnhancementPrompt(
  istek: SunumOlusturmaIstegi,
  templateSunum: SunumIcerik,
  marketData?: import('@/lib/services/market-analysis/types').MarketAnalysisData | null
): string {
  const { mulk, tema, amac, danisman, locationAnalysis } = istek;

  const mulkTurLabel =
    mulk.tur === "arsa"
      ? "Arsa"
      : mulk.tur === "daire"
        ? "Daire"
        : mulk.tur === "villa"
          ? "Villa"
          : mulk.tur === "ticari"
            ? "Ticari Gayrimenkul"
            : mulk.tur === "ofis"
              ? "Ofis"
              : "Kompleks";
  const sunumStili = istek.sunumStili;
  const stilBilgi = sunumStili ? sunumStiliBilgileri[sunumStili] : undefined;

  const sections: string[] = [];

  sections.push(
    "Sen profesyonel bir emlak sunum yazarlısın. Verilen funnel template'ini gayrimenkul bilgilerine göre özelleştiriyorsun."
  );

  const gayrimenkulDetaylari = [
    `📍 MÜLK TÜRÜ: ${mulkTurLabel}`,
    `📍 KONUM: ${mulk.konum}`,
    buildPriceLine(mulk, "💰 FİYAT"),
    mulk.metrekare ? `📏 METREKARE: ${mulk.metrekare} m²` : "",
    mulk.odaSayisi ? `🚪 ODA SAYISI: ${mulk.odaSayisi}` : "",
    mulk.kat ? `🏢 KAT: ${mulk.kat}` : "",
    mulk.yas ? `📅 BİNA YAŞI: ${mulk.yas}` : "",
    mulk.krediyeUygun ? "✅ KREDİYE UYGUN" : "",
    mulk.cevreOzellikleri && mulk.cevreOzellikleri.length > 0
      ? `🌐 ÇEVRE: ${mulk.cevreOzellikleri.join(", ")}`
      : "",
    mulk.avantajlar && mulk.avantajlar.length > 0
      ? `⭐ AVANTAJLAR: ${mulk.avantajlar.join(", ")}`
      : ""
  ]
    .filter(Boolean)
    .join("\n");
  sections.push(formatPromptSection("GAYRİMENKUL DETAYLARI", gayrimenkulDetaylari));

  if (locationAnalysis) {
    sections.push(
      formatPromptSection(
        "📍 BÖLGE ANALİZİ (AI TARAFINDAN OLUŞTURULDU)",
        `${locationAnalysis}\n\n⚠️ ÖNEMLİ: Bu bölge analizini funnel içeriğine MUTLAKA entegre et. Konum analizi bölümünde kullan, bölgenin özelliklerini vurgula, yatırım potansiyelini belirt.`
      )
    );
  }

  if (mulk.aciklama) {
    sections.push(
      formatPromptSection(
        "📝 EK AÇIKLAMA (KULLANICI TARAFINDAN GİRİLDİ - ÇOK ÖNEMLİ)",
        `${mulk.aciklama}\n\n⚠️ ÇOK ÖNEMLİ: Bu ek açıklama kullanıcının özel isteklerini, özellikleri, avantajları veya özel durumları içeriyor.\nBu bilgileri MUTLAKA funnel içeriğine entegre et:\n- Özel özellikler varsa vurgula\n- Özel durumlar varsa (örn: acil satış, özel fiyat, özel koşullar) belirt\n- Avantajlar varsa öne çıkar\n- Kullanıcının belirttiği her detayı funnel içeriğine yansıt\n- Bu açıklama chatbot gibi çalışmalı - kullanıcının yazdığı her şey funnel içeriğini değiştirmeli`
      )
    );
  }

  if (mulk.konumAvantajlari) {
    sections.push(
      formatPromptSection(
        "🏖️ KONUM AVANTAJLARI (KULLANICI TARAFINDAN GİRİLDİ)",
        `${mulk.konumAvantajlari}\n\n⚠️ ÖNEMLİ: Bu konum avantajlarını KONUM AVANTAJLARI bölümünde kullan. Formatta örnek:\n✅ Atakum sahiline sadece 130 metre\n✅ Ataköy'e 80 metre mesafe\n✅ Merkezi konum, ulaşım kolay\n✅ Gelişen bölge, değer artış potansiyeli yüksek`
      )
    );
  }

  if (mulk.kullanimPotansiyeli) {
    sections.push(
      formatPromptSection(
        "🏡 KULLANIM POTANSİYELİ (KULLANICI TARAFINDAN GİRİLDİ)",
        `${mulk.kullanimPotansiyeli}\n\n⚠️ ÖNEMLİ: Bu kullanım potansiyelini KULLANIM POTANSİYELİ bölümünde kullan. Formatta örnek:\n✅ Hazır yapı + bahçe (nadir fırsat)\n✅ Tatil evi dönüşümü\n✅ Kiralama geliri potansiyeli\n✅ Yatırım amaçlı değer artışı`
      )
    );
  }

  if (danisman.ofisAdi) {
    sections.push(
      formatPromptSection(
        "🏢 GAYRİMENKUL OFİSİ",
        `Ofis Adı: ${danisman.ofisAdi}\n\n⚠️ ÖNEMLİ:\n- RE/MAX, Coldwell Banker, Century 21, Keller Williams, Berkshire Hathaway gibi büyük firmalar için "${danisman.ofisAdi} AĞI AKTİVASYONU" yaz\n- Küçük firmalar için "${danisman.ofisAdi} GÜVENCESİ" yaz\n- REKLAM KANALLARI bölümünde büyük firmalar için "${danisman.ofisAdi} Ağı" ekle\n- Garantiler bölümünde "${danisman.ofisAdi} Garantisi" yaz\n- FAQ bölümünde "${danisman.ofisAdi} hizmet bedeli alıyor mu?" sorusunu ekle`
      )
    );
  }

  const danismanDetay = [
    `👤 DANIŞMAN: ${danisman.adSoyad}`,
    `📞 TELEFON: ${danisman.telefon}`,
    `📧 EMAIL: ${danisman.email}`,
    danisman.deneyim ? `💼 DENEYİM: ${danisman.deneyim}` : "",
    danisman.oduller ? `🏆 ÖDÜLLER VE BAŞARILAR: ${danisman.oduller}` : "",
    danisman.referans ? `✅ REFERANS: ${danisman.referans}` : "",
    danisman.profilFotografi
      ? "📸 Profil fotoğrafı mevcut"
      : "⚠️ Profil fotoğrafı YOK - Şablonda gösterme",
    danisman.ofisLogosu
      ? "🏢 Ofis logosu mevcut"
      : "⚠️ Ofis logosu YOK - Şablonda gösterme"
  ]
    .filter(Boolean)
    .join("\n");
  sections.push(formatPromptSection("DANİŞMAN BİLGİLERİ", danismanDetay));

  const sunumParametreleri = [
    `🎯 AMAÇ: ${amac === "portfoy_almak"
      ? "Portföy Almak (Satıcıyı ikna etmek için güven verici dil)"
      : "Portföy Satmak (Müşteriye bilgilendirici sunum yapmak)"
    }`,
    `🎨 TEMA: ${tema}`,
    temaTanimlari[tema]
  ].join("\n");
  sections.push(formatPromptSection("SUNUM PARAMETRELERİ", sunumParametreleri));

  if (stilBilgi) {
    const odakMetni = stilBilgi.odaklar.map((item) => `• ${item}`).join("\n");
    sections.push(
      formatPromptSection(
        "SUNUM STİLİ",
        `Seçilen Stil: ${stilBilgi.ad}\n${stilBilgi.aciklama}\n\nOdak Noktaları:\n${odakMetni}`
      )
    );
  }

  sections.push(
    formatPromptSection(
      `${mulkTurLabel} İÇİN ÖZEL NOTLAR`,
      mulkTuruAciklamalari[mulk.tur]
    )
  );

  const valuationSnapshotsText =
    istek.detayliDegerleme?.marketSnapshots
      ?.filter(
        (snapshot) =>
          snapshot &&
          (snapshot.title || snapshot.value || snapshot.trend || snapshot.trendLabel)
      )
      .map((snapshot) => {
        const title = snapshot.title || "Göstergesi";
        const value = snapshot.value ? `: ${snapshot.value}` : "";
        const trend =
          snapshot.trend === "up"
            ? " (Trend: Yükselişte)"
            : snapshot.trend === "down"
              ? " (Trend: Düşüşte)"
              : snapshot.trend === "stable"
                ? " (Trend: Dengede)"
                : "";
        const trendLabel = snapshot.trendLabel ? ` • ${snapshot.trendLabel}` : "";
        return `- ${title}${value}${trend}${trendLabel}`;
      })
      .join("\n") || "";
  const valuationComparablesText =
    istek.detayliDegerleme?.comparables
      ?.filter(
        (comp) =>
          comp &&
          (comp.address || comp.price || comp.size || comp.pricePerSqm || comp.status)
      )
      .map((comp) => {
        const price = comp.price || "-";
        const status = comp.status || "Satışta";
        const size = comp.size || "-";
        const sqm = comp.pricePerSqm || "-";
        return `- ${comp.address || "Emsal"} | ${status} | Fiyat: ${price} | Alan: ${size} | m²: ${sqm}`;
      })
      .join("\n") || "";
  const valuationEstimatedText = istek.detayliDegerleme?.estimatedValueRange
    ? `Tahmini Değer Aralığı: ${istek.detayliDegerleme.estimatedValueRange}`
    : "";

  const hasDetayliDegerleme =
    Boolean(valuationSnapshotsText || valuationComparablesText || valuationEstimatedText);

  // Market Analysis Data
  if (marketData) {
    const marketAnalysisText = [
      `📊 VERİYE DAYALI PİYASA ANALİZİ (${marketData.location})`,
      `Bu veriler Endeksa, Zingat, Emlakjet ve Sahibinden gibi kaynaklardan toplanmıştır.`,
      ``,
      `• Bölge Ortalama m² Fiyatı: ₺${marketData.sqm_avg.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      `• Satışa Dönüş Süresi: ${marketData.sale_duration_days} gün (ortalama)`,
      `• Talep Eğilimi: ${marketData.demand_change_percent > 0 ? '+' : ''}${marketData.demand_change_percent.toFixed(1)}%`,
      marketData.active_listings_count ? `• Aktif İlan Sayısı: ${marketData.active_listings_count}` : '',
      marketData.six_month_trend && marketData.six_month_trend.length > 0 ? `
• Son 6 Ay Trend (m² fiyat):
  ${marketData.six_month_trend.map((price, idx) => `${6 - marketData.six_month_trend!.length + idx + 1}. ay: ₺${price.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`).join('\n  ')}` : '',
      ``,
      `⚠️ ÖNEMLİ:`,
      `- Bu verileri "Veriye Dayalı Piyasa Analizi" (tip: "market_analysis") bölümünde kullan`,
      `- Grafik ve istatistikler oluştur (m² fiyat karşılaştırması, 6 ay trend grafiği)`,
      `- Bölge ortalaması ile gayrimenkul fiyatını karşılaştır`,
      `- Trend analizi yap ve yatırım potansiyelini vurgula`,
      `- Veriler kaynaklarıyla birlikte sunulmalı: "${marketData.data_source.join(', ')}"`,
      `- Bu bölüm kurumsal tema için hero bölümünden sonra gösterilmeli`
    ].filter(Boolean).join('\n');

    sections.push(formatPromptSection('📊 VERİYE DAYALI PİYASA ANALİZİ', marketAnalysisText));
  }

  if (hasDetayliDegerleme) {
    const valuationSections: string[] = [];
    if (valuationSnapshotsText) {
      valuationSections.push(`Piyasa Göstergeleri:\n${valuationSnapshotsText}`);
    }
    if (valuationComparablesText) {
      valuationSections.push(`Emsal Mülkler:\n${valuationComparablesText}`);
    }
    if (valuationEstimatedText) {
      valuationSections.push(valuationEstimatedText);
    }

    sections.push(
      formatPromptSection(
        "DETAYLI DEĞERLEME VERİLERİ (PİYASA ANALİZ RAPORU - FORM ÜZERİNDEN GİRİLDİ)",
        `${valuationSections.join("\n\n")}

⚠️ ÇOK ÖNEMLİ TALİMATLAR:

1. BÖLÜM KONUMU: Bu veriler "regional_comparison" tipinde bir bölge olarak funnel'a eklenmeli.
   - Kurumsal tema seçildiyse: Hero bölümünden HEMEN SONRA göster
   - Diğer temalarda: Konum analizi bölümünden sonra göster

2. FORMAT:
   - Piyasa Göstergeleri → Kart formatında (3 sütun grid)
   - Emsal Mülkler → Tablo formatında (Adres | Durum | Fiyat | m² | m² Fiyat)
   - Tahmini Değer → Vurgulu, büyük font, merkezi konumda

3. İÇERİK:
   - Verileri olduğu gibi kullan, ekstra yorum veya tahmin ekleme
   - Profesyonel ve veri odaklı dil kullan
   - Trend bilgilerini görsel olarak belirt (↑ yükseliş, ↓ düşüş, → dengede)

4. BAŞLIK: "Detaylı Değerleme Raporu" veya "Piyasa Analiz Raporu" kullan

5. JSON ÇIKTI: Bu bölüm için JSON'da şu yapıyı kullan:
   {
     "tip": "regional_comparison",
     "baslik": "Detaylı Değerleme Raporu",
     "icerik": "[estimatedValueRange değeri]",
     "altBolge": [
       {
         "baslik": "[snapshot.title]",
         "icerik": "[snapshot.value] | [trendLabel]",
         "tip": "stats"
       },
       // ... diğer snapshots
       {
         "baslik": "[comp.address]",
         "icerik": "[comp.status] | [comp.price] | [comp.size] | [comp.pricePerSqm]",
         "tip": "comparison"
       }
       // ... diğer comparables
     ]
   }`
      )
    );
  }

  sections.push(
    formatPromptSection(
      "MEVCUT FUNNEL ŞABLONU",
      JSON.stringify(templateSunum, null, 2)
    )
  );

  const gorevler: string[] = [];

  gorevler.push(
    `1. **MÜLK TÜRÜ DEĞİŞTİR**:
   - Template'deki TÜM "arsa", "arsanızı", "arsanız" kelimelerini "${mulkTurLabel.toLowerCase()}" ile değiştir
   - Örnekler: "Arsanızı Satarken" → "${mulkTurLabel}'nızı Satarken"
   - "Bu Arsa" → "Bu ${mulkTurLabel}"
   - Mülk türüne uygun ifadelere çevir (Daire için: "daire", "daireniz", Villa için: "villa", "villanız")`
  );

  gorevler.push(
    `2. **KONUM BİLGİLERİNİ EKLE**:
   - ${mulk.konum} şehri/bölgesi hakkında gerçekçi, spesifik bilgiler ekle
   - Bölgenin gelişim potansiyelini vurgula
   - Çevre özellikleri: ${mulk.cevreOzellikleri && mulk.cevreOzellikleri.length > 0
      ? mulk.cevreOzellikleri.join(", ")
      : "N/A"
    }`
  );

  const priceRangeText = formatPriceRange(mulk);
  const referencePrice =
    typeof mulk.fiyat === "number"
      ? mulk.fiyat
      : typeof mulk.fiyatMax === "number"
        ? mulk.fiyatMax
        : typeof mulk.fiyatMin === "number"
          ? mulk.fiyatMin
          : undefined;

  if (priceRangeText) {
    gorevler.push(
      `3. **FİYAT VE DEĞERLEME**:
  - ${priceRangeText} üzerinden yatırım/değer analizi yap${referencePrice && mulk.metrekare && mulk.metrekare > 0
        ? `\n  - m² başına ${Math.round(referencePrice / mulk.metrekare).toLocaleString("tr-TR")} TL`
        : ""
      }
   - Bölgedeki benzer ${mulkTurLabel.toLowerCase()} fiyatlarıyla karşılaştır${hasDetayliDegerleme
        ? `
   - Sağlanan detaylı değerleme verilerini (göstergeler, emsaller, değer aralığı) "Detaylı Değerleme Raporu" bölümünde kullan; veri olmayan kalemleri uydurma`
        : ""
      }`
    );
  } else {
    gorevler.push(
      `3. **FİYAT VE DEĞERLEME**:
   - Kullanıcı fiyat bilgisi paylaşmadıysa piyasa karşılaştırması için varsayımsal aralık öner
   - Benzer ${mulkTurLabel.toLowerCase()} satış verilerinden referans değerler türet${hasDetayliDegerleme
        ? `
   - Sağlanan detaylı değerleme verilerini (göstergeler, emsaller, değer aralığı) "Detaylı Değerleme Raporu" bölümünde kullan; veri olmayan kalemleri uydurma`
        : ""
      }`
    );
  }

  gorevler.push(
    `4. **DANIŞMAN BİLGİLERİNİ ENTEGRE ET**:
   ${danisman.oduller
      ? `- Danışmanın ödüllerini stratejik yerlere yerleştir: "${danisman.oduller}"
   - Kimim Ben bölümüne, başarı hikayelerine veya güven oluşturma bölümlerine ekle
   - Doğal ve organik bir şekilde yerleştir, zorlamadan`
      : "- Danışmanın ödül bilgisi yok, genel profesyonellik vurguları yap"
    }`
  );

  gorevler.push(
    `5. **İÇERİĞİ ZENGİNLEŞTİR**:
   - Her bölge ve altBölge'nin içeriğini MÜLK TÜRÜNE göre detaylandır
   - Problem ve çözüm önerileri ${mulkTurLabel.toLowerCase()}'ya özgü olmalı
   - "Peki Ya Bu Sorunların Hiçbiri Olmasaydı?" bölümünde mülk türüne uygun çözümler sun`
  );

  gorevler.push(
    `6. **GERÇEKÇİ RAKAMLAR**:
   - ${mulk.konum} için gerçekçi % artış, mesafe, süre vb. kullan
   - ${mulk.tur === "arsa"
      ? "Arsa için imar durumu, m² başına değer, gelecekteki değer artışı"
      : ""
    }
   - ${mulk.tur === "daire"
      ? "Daire için aidat, komşuluk, ulaşım kolaylığı"
      : ""
    }
   - ${mulk.tur === "villa"
      ? "Villa için bahçe, manzara, özel yaşam alanları"
      : ""
    }`
  );

  gorevler.push(
    `7. **TEMA UYUMU**:
   - ${tema} temasına uygun ton ve dil kullan
   - ${temaTanimlari[tema]}`
  );

  gorevler.push(
    `8. **AMAÇ ODAKLI İÇERİK STRATEJİSİ (ÇOK ÖNEMLİ)**:
   ${amac === "portfoy_almak"
      ? `🎯 PORTFÖY ALMAK İÇİN:
   - Satıcıya GÜVEN verici dil kullan
   - Profesyonelliğini ve deneyimini vurgula
   - Doğru fiyat analizi yap, değerleme sun
   - "Sizinle çalışmayı isterim", "Gayrimenkulünüzü değerinde satalım" gibi ifadeler kullan
   - Satıcının endişelerini gider (güvenlik, zaman, fiyat)
   - "Ücretsiz değerleme", "Sıfır risk", "Garantili satış" gibi güven verici mesajlar
   - Call-to-Action: "Gayrimenkulünüzü listelemek için hemen iletişime geçin"
   - Problemler bölümünde: "Bireysel satış yaparken karşılaştığınız sorunlar"
   - Çözüm bölümünde: "Profesyonel danışmanlık ile bu sorunların çözümü"`
      : `🎯 PORTFÖY SATMAK İÇİN:
   - Müşteriye BİLGİLENDİRİCİ ve SATIŞ odaklı dil kullan
   - Yatırım fırsatını vurgula
   - Avantajları net göster
   - FOMO (Fear of Missing Out) yarat
   - "Hemen görüşelim", "Bu fırsatı kaçırmayın" gibi ifadeler kullan
   - "Sınırlı stok", "Özel fiyat", "Erken rezervasyon avantajı" gibi kıtlık mesajları
   - Call-to-Action: "Hemen görüşmek için iletişime geçin"
   - Problemler bölümünde: "Yanlış yatırım yapmanın riskleri"
   - Çözüm bölümünde: "Bu gayrimenkulün size sağlayacağı avantajlar"`
    }
   - Sosyal kanıt, otorite, kıtlık, tutarlılık prensiplerini kullan
   - Her bölgede net bir değer önerisi sun
   ${stilBilgi
      ? `🌟 SUNUM STİLİ (${stilBilgi.ad.toUpperCase()}):
   ${stilBilgi.gorevler.map((gorev) => `- ${gorev}`).join('\n   ')}`
      : ""
    }`
  );

  gorevler.push(
    `9. **KONUM ANALİZİ ENTEGRASYONU**:
   ${locationAnalysis
      ? `- Verilen bölge analizini ("${locationAnalysis}") funnel içeriğine MUTLAKA entegre et
   - Konum analizi bölümünde bu analizi kullan
   - Bölgenin özelliklerini, gelişim potansiyelini, yatırım değerini vurgula
   - Analizdeki bilgileri doğal bir şekilde içeriğe yedir`
      : "- Konum analizi mevcut değil, genel bölge bilgileri kullan"
    }`
  );

  gorevler.push(
    `10. **EK AÇIKLAMA ENTEGRASYONU (CHATBOT GİBİ)**:
   ${mulk.aciklama
      ? `- Kullanıcının ek açıklaması: "${mulk.aciklama}"
   - Bu açıklamadaki HER DETAYI funnel içeriğine yansıt
   - Özel özellikler varsa vurgula
   - Özel durumlar varsa (acil satış, özel fiyat, özel koşullar) belirt
   - Avantajlar varsa öne çıkar
   - Kullanıcının belirttiği her şey funnel içeriğini değiştirmeli
   - Bu açıklama chatbot gibi çalışmalı - kullanıcı ne yazdıysa o içeriğe yansımalı`
      : "- Ek açıklama yok, standart içerik kullan"
    }`
  );

  gorevler.push(
    `11. **KONUM AVANTAJLARI ENTEGRASYONU**:
   ${mulk.konumAvantajlari
      ? `- Kullanıcının konum avantajları: "${mulk.konumAvantajlari}"
   - Bu bilgileri KONUM AVANTAJLARI bölümünde kullan
   - Format: ✅ ile başlayan maddeler halinde
   - Bölge analizi ile birleştirerek zenginleştir`
      : "- Konum avantajları yok, bölge analizinden yararlan"
    }`
  );

  gorevler.push(
    `12. **KULLANIM POTANSİYELİ ENTEGRASYONU**:
   ${mulk.kullanimPotansiyeli
      ? `- Kullanıcının kullanım potansiyeli: "${mulk.kullanimPotansiyeli}"
   - Bu bilgileri KULLANIM POTANSİYELİ bölümünde kullan
   - Format: ✅ ile başlayan maddeler halinde
   - Mülk türüne göre özelleştir`
      : "- Kullanım potansiyeli yok, mülk türüne göre genel içerik oluştur"
    }`
  );

  gorevler.push(
    `13. **TANITIM STRATEJİSİ OLUŞTURMA**:
   - TANITIM STRATEJİSİ bölümü için özel içerik oluştur
   - Ana Mesaj: Mülkün en önemli özelliklerini vurgulayan kısa bir mesaj
   - Vurgular: ⭐ ile başlayan önemli noktalar
   - Görsel İçerik Planı: Drone, zemin, video, 360° için öneriler
   - Konum avantajları ve kullanım potansiyelini kullan`
  );

  gorevler.push(
    `14. **OFİS ADI ENTEGRASYONU**:
   ${danisman.ofisAdi
      ? `- Ofis adı: "${danisman.ofisAdi}"
   - RE/MAX, Coldwell Banker gibi büyük firmalar için "${danisman.ofisAdi} AĞI AKTİVASYONU" yaz
   - Küçük firmalar için "${danisman.ofisAdi} GÜVENCESİ" yaz
   - REKLAM KANALLARI bölümünde büyük firmalar için "${danisman.ofisAdi} Ağı" ekle
   - Garantiler bölümünde "${danisman.ofisAdi} Garantisi" yaz
   - FAQ bölümünde "${danisman.ofisAdi} hizmet bedeli alıyor mu?" sorusunu ekle`
      : "- Ofis adı yok, genel kurumsal ifadeler kullan"
    }`
  );

  gorevler.push(
    `15. **MEVSİMSEL TARİH KONTROLÜ**:
   - Zaman Kaybı = Para Kaybı bölümünde mevsimsel bilgi kullan
   - Şu anki mevsim: ${getMevsimText()}
   - "💡 ${getMevsimText()} = alıcı talebi en yüksek = en yüksek fiyat" formatında yaz`
  );

  gorevler.push(
    `16. **PROFESYONEL**:
   - AI belli olmasın, deneyimli emlak danışmanı yazmış gibi olsun
   - İstatistikler gerçekçi, bölge bilgileri doğru olsun
   - Abartısız, güvenilir bir ton kullan`
  );

  gorevler.push(
    `17. **ZORUNLU BÖLÜMLERİ DOLDUR**:
   - Kullanım Potansiyeli, Tanıtım Stratejisi, Tahmini Değer & Satım Planı ve Reklam Kanalları bölümleri stil ne olursa olsun BOŞ KALMAYACAK.
   - Formdan gelen konum/kullanım verilerini kullan; yoksa gerçekçi AI önerileri üret.
   - Listeleri ✅ veya ⭐ formatıyla, CTA ve fiyat bilgilerini net şekilde yaz.`
  );

  sections.push(formatPromptSection("SENİN GÖREVİN", gorevler.join("\n\n")));

  sections.push(
    formatPromptSection(
      "ÇIKTI FORMAT",
      "Aynı JSON yapısını koru, sadece içerikleri zenginleştir. Alt bolgeler ve tip yapıları değişmeyecek.\n\n**ÖNEMLİ**: Sadece JSON çıktısı ver, başka açıklama ekleme."
    )
  );

  return sections.join("\n\n");
}

// Artık template sistemi kullanılıyor, mockSunumOlustur'a gerek yok

