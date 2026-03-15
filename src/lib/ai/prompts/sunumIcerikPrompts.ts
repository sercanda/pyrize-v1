import { MulkBilgileri, DanismanBilgileri } from '@/types';

interface IcerikPromptParams {
  amac: 'portfoy_almak' | 'portfoy_satmak';
  sunumStili: string;
  tema: string;
  mulk: MulkBilgileri;
  danisman: DanismanBilgileri;
  bolge?: string;
  locationAnalysis?: string;
}

function formatMulk(mulk: MulkBilgileri): string {
  const parts = [
    mulk.tur,
    mulk.konum,
    mulk.metrekare ? `${mulk.metrekare}m²` : '',
    mulk.odaSayisi ? `${mulk.odaSayisi} oda` : '',
    mulk.fiyat ? `${mulk.fiyat.toLocaleString('tr-TR')}₺` : '',
  ].filter(Boolean);

  const features: string[] = [];
  if (mulk.siteMi) features.push('Site içi');
  if (mulk.asansor) features.push('Asansör');
  if (mulk.otopark) features.push('Otopark');
  if (mulk.guvenlik) features.push('7/24 Güvenlik');
  if (mulk.havuz) features.push('Havuz');
  if (mulk.sporSalonu) features.push('Spor Salonu');
  if (mulk.bahceTeras) features.push('Bahçe/Teras');
  if (mulk.merkeziIsitma) features.push('Merkezi Isıtma');

  let result = parts.join(' | ');
  if (features.length > 0) result += '\nÖzellikler: ' + features.join(', ');
  if (mulk.aciklama) result += '\nAçıklama: ' + mulk.aciklama;
  return result;
}

function getTemaTalimat(tema: string): string {
  const temalar: Record<string, string> = {
    modern: 'YAZIM TARZI: Dinamik, enerjik, genç profesyonel dili. Kısa cümleler. Aktif fiiller. "Yapılır" değil "Yapıyoruz". Teknoloji ve yenilik referansları uygun.',
    kurumsal: 'YAZIM TARZI: Profesyonel, ölçülü, güven veren. Veri ve kanıt odaklı. Resmi ama soğuk değil. Kurumsal kimlik ön planda.',
    luks: 'YAZIM TARZI: Zarif, prestijli, ayrıcalık hissi veren. Uzun ve akıcı cümleler. Görsel imgeler. "Seçkin", "özel", "nadir" gibi kelimeler uygun. Fiyat yerine "değer" kullan.',
  };
  return temalar[tema] ?? temalar.modern;
}

const JSON_FORMAT_INSTRUCTION = `\n\nYanıtı SADECE JSON formatında ver, başka hiçbir şey yazma. JSON'un valid olduğundan emin ol.`;

const PROMPTS: Record<string, string> = {

// ═══════════════════════════════════════════════════════════
// PORTFÖY ALMAK (Mülk sahibini ikna et)
// ═══════════════════════════════════════════════════════════

portfoy_almak_minimalist: `Sen Türkiye'nin en iyi gayrimenkul danışmanlarından birisin.
Aşağıdaki mülk için mülk sahibini portföyünü sana vermesi amacıyla ikna edecek bir sunum hazırlıyorsun. Tasarım sade olacak ama içerik güçlü olmalı.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi} - {danismanSirketi}

Türk emlak alıcısının psikolojisini bilerek 5 bölüm yaz. Her bölüm kendi başına ikna edici olmalı.

BÖLÜM 1 — ANA MESAJ (headline + 3 paragraf)
headline: Mülk sahibinin aklındaki tek soruya cevap ver: "Bu danışman benim mülkümü gerçekten satabilir mi?"
paragraf1: Bölgedeki uzmanlığını ve piyasa bilgini göster. Rakamlarla destekle.
paragraf2: Mülkün şu anki piyasa koşullarındaki gerçek değerini ve doğru zamanlama yapılmazsa ne kaybedilebileceğini anlat.
paragraf3: Seni rakiplerinden ayıran tek ve somut fark nedir?

BÖLÜM 2 — RAKAMLAR (3 metrik kart)
kart1: Ortalama Satış Süresi (gerçekçi tahmin + açıklama)
kart2: Bölge m² Fiyatı (tahmini ₺/m² + açıklama)
kart3: Hedef Satış Fiyatı (önerilen liste fiyatı + açıklama)

BÖLÜM 3 — SATIŞ STRATEJİSİ (başlık + 4 madde)
madde1: İlan platformları ve hedef kitle
madde2: Profesyonel görsel ve video stratejisi
madde3: Fiyatlama ve müzakere stratejisi
madde4: İlk 30 gündeki aksiyon planı

BÖLÜM 4 — GÜVEN UNSURU (referans metin + taahhüt listesi)
referansMetni: Danışmanın bölgedeki deneyimini anlatan 2 paragraf.
taahhutler: ["Haftalık ilerleme raporu", "Her gösterimden sonra geri bildirim", "Şeffaf fiyatlama süreci", "Hukuki süreç desteği"]

BÖLÜM 5 — HAREKETE GEÇ (başlık + metin + CTA)
metin: 2 paragraf, acele ettirmeden ama net bir çağrı.
cta_buton: "Ücretsiz Değerleme Görüşmesi"

JSON formatı:
{"bolumler":[{"id":"ana-mesaj","tip":"hero","headline":"...","paragraflar":["...","...","..."]},{"id":"rakamlar","tip":"metrikler","baslik":"Rakamlar Konuşuyor","kartlar":[{"baslik":"...","rakam":"...","aciklama":"..."}]},{"id":"strateji","tip":"liste","baslik":"...","maddeler":["..."]},{"id":"guven","tip":"profil","baslik":"...","referansMetni":["..."],"taahhutler":["..."]},{"id":"cta","tip":"cta","baslik":"...","metin":["..."],"ctaButon":"...","ctaAlt":"..."}]}`,

portfoy_almak_detayli_analiz: `Deneyimli Türk emlak danışmanı olarak mülk sahibini portföyünü sana vermesi için ikna edecek, piyasa verisi ve analize dayalı kapsamlı bir sunum hazırla.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi} - {danismanSirketi}
BÖLGE: {bolge}

6 bölüm yaz. Her bölüm derinlikli ve ölçülü olsun.

BÖLÜM 1 — KAPAK MESAJI
headline: Güçlü, bölge odaklı başlık
altBaslik: Sunumun amacını tek cümleyle özetle
girisMetni: 3 paragraf empati kuran açılış

BÖLÜM 2 — PİYASA ANALİZİ
baslik: Bölge Piyasa Raporu
girisCumlesi + trendAnalizi (2 paragraf) + 4 rakam (m² fiyatı, satış süresi, liste/satış oranı, ilan sayısı) + firsatAnalizi (2 paragraf)

BÖLÜM 3 — MÜLK DEĞERLEMESİ
gucluYonler (4 madde) + gelistirilebilirler (3 madde) + fiyatOnerisi (min/optimum/max/tavsiye + gerekçe) + beklenenSatisSuresi

BÖLÜM 4 — PAZARLAMA STRATEJİSİ
5 kanal stratejisi + ilk hafta planı (gün gün) + haftalık rapor açıklaması

BÖLÜM 5 — NEDEN BEN?
deneyimMetni (2 paragraf) + 3 referans + 5 taahhüt

BÖLÜM 6 — SONRAKİ ADIM
3 paragraf + süreç adımları + CTA

JSON formatı:
{"bolumler":[{"id":"kapak","tip":"kapak-detayli","headline":"...","altBaslik":"...","girisMetni":["..."]},{"id":"piyasa","tip":"piyasa-analizi","baslik":"...","girisCumlesi":"...","trendAnalizi":["..."],"rakamlar":[{"label":"...","deger":"...","yorum":"..."}],"firsatAnalizi":["..."]},{"id":"degerleme","tip":"degerleme","baslik":"...","gucluYonler":["..."],"gelistirilebilirler":["..."],"fiyatOnerisi":{"minimumFiyat":"...","optimumFiyat":"...","maximumFiyat":"...","oneriliFiyat":"...","gerekcesi":"..."},"beklenenSatisSuresi":"..."},{"id":"strateji","tip":"pazarlama-plani","baslik":"...","kanallar":[{"kanal":"...","strateji":"..."}],"ilkHaftaPlani":["..."],"haftalikRapor":"..."},{"id":"neden-ben","tip":"profil-detayli","baslik":"...","deneyimMetni":["..."],"referanslar":[{"tip":"...","aciklama":"..."}],"taahhutler":["..."]},{"id":"cta","tip":"cta-detayli","baslik":"...","metin":["..."],"surecAdimlari":["..."],"cta":"...","altNot":"..."}]}`,

portfoy_almak_hizli_satis: `Mülk sahibini hızlı karar verdirecek, vurucu ve aksiyon odaklı bir sunum hazırla. Okuma süresi: 3 dakika.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi}

4 bölüm yaz:

BÖLÜM 1 — HOOK: dikkat çekici headline + altBaslik (2 cümle) + aciliyetNotu (1 paragraf)
BÖLÜM 2 — RAKAMLAR: 4 rakam kartı (satış süresi, fiyat ulaşma oranı, ek kazanç, aktif alıcı) + güvenMesaji (2 paragraf)
BÖLÜM 3 — PLAN: 30 günlük 4 adımlı plan + garantiNotu
BÖLÜM 4 — AKSİYON: tek paragraf + CTA

JSON:
{"bolumler":[{"id":"hook","tip":"hook","headline":"...","altBaslik":"...","aciliyetNotu":"..."},{"id":"rakamlar","tip":"rakam-grid","baslik":"...","rakamlar":[{"deger":"...","label":"...","detay":"..."}],"guvenMesaji":["..."]},{"id":"plan","tip":"zaman-cizelgesi","baslik":"...","adimlar":[{"gun":"...","baslik":"...","aciklama":"..."}],"garantiNotu":"..."},{"id":"aksiyon","tip":"cta-acil","baslik":"...","paragraf":"...","cta":"...","altMetin":"..."}]}`,

portfoy_almak_premium_sunum: `Yüksek değerli mülk sahibine hitap eden, prestij ve uzmanlık odaklı sunum hazırla.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi} - {danismanSirketi}

6 bölüm yaz. Her bölüm zarif ve derinlikli:

BÖLÜM 1 — AÇILIŞ: prestijli headline + altBaslik + 3 paragraf giriş
BÖLÜM 2 — PİYASA KONUMU: segment tanımı + piyasa durumu + değer karşılaştırması (4 satır) + fırsat yorumu
BÖLÜM 3 — DEĞER ANALİZİ: 5 özgün nitelik + değerleme yaklaşımı + fiyat stratejisi (konservatif/optimal/premium/tavsiye)
BÖLÜM 4 — ÖZEL PAZARLAMA: 6 kanal detayı + gizlilik notu
BÖLÜM 5 — REFERANSLAR: 3 referans + sertifikalar
BÖLÜM 6 — ÖZEL GÖRÜŞME: 2 paragraf + teklif detayı + CTA

JSON:
{"bolumler":[{"id":"acilis","tip":"premium-kapak","headline":"...","altBaslik":"...","girisMetni":["..."]},{"id":"piyasa","tip":"premium-piyasa","baslik":"...","segmentTanimi":"...","piyasaDurumu":["..."],"degerKarsilastirmasi":[{"kategori":"...","m2Fiyat":"..."}],"firsatYorumu":"..."},{"id":"deger","tip":"deger-analizi","baslik":"...","ozguNitelikler":["..."],"degerlemeYaklasimi":"...","fiyatStratejisi":{"konservativFiyat":"...","optimalFiyat":"...","premiumFiyat":"...","tavsiye":"..."}},{"id":"pazarlama","tip":"ozel-pazarlama","baslik":"...","kanallar":[{"kanal":"...","detay":"..."}],"gizlilikNotu":"..."},{"id":"referanslar","tip":"referanslar","baslik":"...","referanslar":[{"tip":"...","sonuc":"...","sure":"..."}],"sertifikalar":["..."]},{"id":"gorusme","tip":"cta-premium","baslik":"...","metin":["..."],"teklifDetayi":"...","cta":"...","altNot":"..."}]}`,

portfoy_almak_guven_odakli: `Mülk sahibinin şüphelerini gideren, şeffaf ve dürüst bir sunum hazırla.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi}

5 bölüm yaz:

BÖLÜM 1 — ANLIYORUZ: headline + giriş (2 paragraf) + 5 endişe-cevap çifti
BÖLÜM 2 — ŞEFFAF SÜREÇ: 5 adımlı süreç (her adım: başlık, süre, yapılan, onay) + iletişim taahhüdü + fesih hakkı
BÖLÜM 3 — BAĞIMSIZ DOĞRULAMA: 4 doğrulama kanalı + açıklık mesajı
BÖLÜM 4 — YAZILI TAAHHÜTLER: 5 taahhüt (madde + detay) + sözleşme notu
BÖLÜM 5 — İLK ADIM: 2 paragraf + ilk görüşmede neler olur + CTA

JSON:
{"bolumler":[{"id":"anliyoruz","tip":"empati","baslik":"...","headline":"...","girisMetni":["..."],"endiseler":[{"endise":"...","cevap":"..."}]},{"id":"surec","tip":"seffaf-surec","baslik":"...","surecAdimlari":[{"adim":1,"baslik":"...","sure":"...","yapilan":"...","onay":"..."}],"iletisimTaahhüdü":"...","fesihHakki":"..."},{"id":"dogrulama","tip":"dogrulama","baslik":"...","dogrulamaKanallari":["..."],"aciklikMesaji":"..."},{"id":"taahhutler","tip":"taahhut-listesi","baslik":"...","taahhutler":[{"madde":"...","detay":"..."}],"sozlesmeNotu":"..."},{"id":"ilk-adim","tip":"cta-guven","baslik":"...","metin":["..."],"ilkGorusmede":["..."],"cta":"...","altNot":"..."}]}`,

// ═══════════════════════════════════════════════════════════
// PORTFÖY SATMAK (Alıcıyı ikna et)
// ═══════════════════════════════════════════════════════════

portfoy_satmak_minimalist: `Potansiyel alıcıyı bu mülkü satın almaya ikna eden, sade ama güçlü bir sunum hazırla.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi}

5 bölüm yaz. Minimalist = az kelime, her kelime değerli.

BÖLÜM 1 — MÜLK ÖZÜ: headline (8 kelime) + 3 güçlü cümle (konum, ayırt edici özellik, fiyat-değer)
BÖLÜM 2 — ÖZELLİKLER: 4-6 grid kart (ikonTip + başlık + 1 cümle)
BÖLÜM 3 — RAKAMLAR: 4 rakam (değer artışı %, satış süresi, kira getirisi, getiri oranı)
BÖLÜM 4 — SATIN ALMA SÜRECİ: 3 adım (Rezervasyon, Sözleşme, Teslim)
BÖLÜM 5 — İLETİŞİM: CTA + kısa metin

JSON:
{"bolumler":[{"id":"mulk-ozu","tip":"hero","headline":"...","cumleler":["..."]},{"id":"ozellikler","tip":"ozellik-grid","baslik":"Özellikler","kartlar":[{"ikonTip":"konum","baslik":"...","aciklama":"..."}]},{"id":"rakamlar","tip":"neden-simdi","baslik":"Neden Şimdi?","rakamlar":[{"rakam":"...","birim":"%","aciklama":"..."}]},{"id":"surec","tip":"adimlar","baslik":"Satın Alma Süreci","adimlar":[{"numara":1,"baslik":"...","aciklama":"..."}]},{"id":"iletisim","tip":"cta","baslik":"...","metin":"...","cta":"..."}]}`,

portfoy_satmak_detayli_analiz: `Potansiyel alıcıyı bu mülkü satın almaya ikna eden, rakam ve analiz odaklı, 5 bölümlü profesyonel sunum.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi} - {danismanSirketi}

BÖLÜM 1 — MÜLK TANITIMI: Konum avantajları, teknik özellikler, öne çıkan 5 özellik
BÖLÜM 2 — YATIRIM ANALİZİ: m² karşılaştırma, kira getiri, değer artış, alternatif karşılaştırma
BÖLÜM 3 — FİNANSAL TABLO: Fiyat, ödeme seçenekleri, kredi senaryosu, net maliyet
BÖLÜM 4 — YAŞAM KALİTESİ: Çevre analizi, sosyal olanaklar, gelecek projeler
BÖLÜM 5 — SATIN ALMA SÜRECİ: Adım adım süreç + iletişim

JSON:
{"bolumler":[{"id":"tanitim","tip":"kapak-detayli","headline":"...","altBaslik":"...","konumAvantajlari":["..."],"teknikOzellikler":["..."],"oneCikanlar":["..."]},{"id":"yatirim","tip":"yatirim-analizi","baslik":"...","m2Karsilastirma":[{"bolge":"...","fiyat":"..."}],"kiraGetiri":"...","degerArtis":"...","alternatifKarsilastirma":"..."},{"id":"finansal","tip":"finansal-tablo","baslik":"...","fiyat":"...","odemeSecenekleri":["..."],"krediSenaryosu":"...","netMaliyet":"..."},{"id":"yasam","tip":"yasam-kalitesi","baslik":"...","cevreAnalizi":"...","sosyalOlanaklar":["..."],"gelecekProjeler":["..."]},{"id":"satin-alma","tip":"cta-detayli","baslik":"...","surecAdimlari":[{"adim":1,"baslik":"...","aciklama":"..."}],"cta":"..."}]}`,

portfoy_satmak_hizli_satis: `Alıcıyı hızlı karar verdiren, fırsatın aciliyetini vurgulayan 3 bölümlü satış sunumu.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi}

BÖLÜM 1 — FIRSATI KAÇIRMA: 3 somut neden + satış süresi + fiyat gerekçesi
BÖLÜM 2 — EN İYİ 5 ÖZELLİK: Görsel odaklı kısa açıklamalar
BÖLÜM 3 — HEMEN AKSİYON: Bugün ne yapılabilir + CTA

JSON:
{"bolumler":[{"id":"firsat","tip":"hook","headline":"...","nedenler":["..."],"satisSuresi":"...","fiyatGerekcesi":"..."},{"id":"ozellikler","tip":"ozellik-grid","baslik":"En İyi 5 Özellik","kartlar":[{"baslik":"...","aciklama":"..."}]},{"id":"aksiyon","tip":"cta-acil","baslik":"...","paragraf":"...","cta":"..."}]}`,

portfoy_satmak_premium_sunum: `Lüks segment alıcısına yönelik, yaşam tarzı satan, prestijli 5 bölümlü sunum.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi}

BÖLÜM 1 — YAŞAM TARZI: Mülkü deneyim olarak anlat
BÖLÜM 2 — MİMARİ & TASARIM: Malzeme, iç mimari, özel unsurlar
BÖLÜM 3 — KONUM & AYRICALIK: Elite statü, komşuluk, premium olanaklar
BÖLÜM 4 — YATIRIM DEĞERİ: Değer artış, kira getiri, uluslararası ilgi
BÖLÜM 5 — ÖZEL GÖRÜŞME DAVETİ: Kişiye özel sunum + CTA

JSON:
{"bolumler":[{"id":"yasam","tip":"premium-kapak","headline":"...","altBaslik":"...","girisMetni":["..."]},{"id":"mimari","tip":"mimari-detay","baslik":"...","detaylar":["..."],"ozelUnsurlar":["..."]},{"id":"konum","tip":"konum-ayricalik","baslik":"...","elitStatu":"...","komsuluk":"...","premiumOlanaklar":["..."]},{"id":"yatirim","tip":"yatirim-premium","baslik":"...","degerArtis":"...","kiraGetiri":"...","uluslararasiIlgi":"..."},{"id":"gorusme","tip":"cta-premium","baslik":"...","metin":["..."],"cta":"...","altNot":"..."}]}`,

portfoy_satmak_guven_odakli: `Alıcının şüphelerini gideren, şeffaf süreç anlatan, güven inşa eden 4 bölümlü sunum.

MÜLK: {mulkBilgileri}
DANIŞMAN: {danismanAdi}

BÖLÜM 1 — SORULARINIZI BİLİYORUZ: 5 soru-cevap
BÖLÜM 2 — ŞEFFAF MÜLK RAPORU: Artılar/eksiler dürüstçe
BÖLÜM 3 — GÜVENLİ SATIN ALMA: Tapu, hukuk, destek
BÖLÜM 4 — REFERANSLAR & GARANTİ: Referanslar + hizmet garantisi

JSON:
{"bolumler":[{"id":"sorular","tip":"empati","baslik":"...","headline":"...","sorular":[{"soru":"...","cevap":"..."}]},{"id":"rapor","tip":"seffaf-rapor","baslik":"...","artilar":["..."],"eksiler":["..."],"cozumler":["..."]},{"id":"surec","tip":"guvenli-satin-alma","baslik":"...","adimlar":[{"baslik":"...","aciklama":"..."}]},{"id":"referans","tip":"referans-garanti","baslik":"...","referanslar":["..."],"garanti":"...","cta":"..."}]}`,

};

export function buildIcerikPrompt(params: IcerikPromptParams): string {
  const key = `${params.amac}_${params.sunumStili}`;
  const basePrompt = PROMPTS[key] || PROMPTS.portfoy_almak_detayli_analiz;
  const temaEki = getTemaTalimat(params.tema);
  const mulkText = formatMulk(params.mulk);
  const danismanAdi = params.danisman.adSoyad || '';
  const danismanSirketi = params.danisman.ofisAdi || '';
  const bolge = params.bolge || params.mulk.konum || '';

  let prompt = basePrompt
    .replace('{mulkBilgileri}', mulkText)
    .replaceAll('{danismanAdi}', danismanAdi)
    .replaceAll('{danismanSirketi}', danismanSirketi)
    .replaceAll('{bolge}', bolge);

  if (params.locationAnalysis) {
    prompt += `\n\nLOKASYON ANALİZİ:\n${params.locationAnalysis}`;
  }

  prompt += `\n\n${temaEki}`;
  prompt += JSON_FORMAT_INSTRUCTION;

  return prompt;
}

export { getTemaTalimat, formatMulk };
