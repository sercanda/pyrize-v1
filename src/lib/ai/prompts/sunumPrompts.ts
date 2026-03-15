import { MulkBilgileri, DanismanBilgileri } from '@/types';

interface SunumPromptParams {
  amac: 'portfoy_almak' | 'portfoy_satmak';
  sunumStili: string;
  tema: string;
  mulk: MulkBilgileri;
  danisman: DanismanBilgileri;
  bolge?: string;
  locationAnalysis?: string;
}

function formatMulkBilgileri(mulk: MulkBilgileri): string {
  const lines = [
    `Tür: ${mulk.tur}`,
    `Konum: ${mulk.konum}`,
    mulk.fiyat ? `Fiyat: ${mulk.fiyat.toLocaleString('tr-TR')} TL` : '',
    mulk.metrekare ? `Metrekare: ${mulk.metrekare} m²` : '',
    mulk.odaSayisi ? `Oda: ${mulk.odaSayisi}` : '',
    mulk.kat ? `Kat: ${mulk.kat}` : '',
    mulk.yas ? `Bina Yaşı: ${mulk.yas}` : '',
    mulk.krediyeUygun ? `Krediye Uygunluk: ${mulk.krediyeUygun === 'uygun' ? 'Uygun' : mulk.krediyeUygun === 'kismen' ? 'Kısmen' : 'Uygun Değil'}` : '',
    mulk.siteMi ? 'Site İçi: Evet' : '',
    mulk.asansor ? 'Asansör: Var' : '',
    mulk.otopark ? 'Otopark: Var' : '',
    mulk.guvenlik ? '7/24 Güvenlik: Var' : '',
    mulk.havuz ? 'Havuz: Var' : '',
    mulk.sporSalonu ? 'Spor Salonu: Var' : '',
    mulk.bahceTeras ? 'Bahçe/Teras: Var' : '',
    mulk.merkeziIsitma ? 'Merkezi Isıtma: Var' : '',
    mulk.aciklama ? `Açıklama: ${mulk.aciklama}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function getTemaTalimat(tema: string): string {
  const temalar: Record<string, string> = {
    modern: `YAZIM TARZI: Dinamik, enerjik, genç profesyonel dili. Kısa cümleler. Aktif fiiller. "Yapılır" değil "Yapıyoruz". Teknoloji ve yenilik referansları uygun.`,
    kurumsal: `YAZIM TARZI: Profesyonel, ölçülü, güven veren. Veri ve kanıt odaklı. Resmi ama soğuk değil. Kurumsal kimlik ön planda.`,
    luks: `YAZIM TARZI: Zarif, prestijli, ayrıcalık hissi veren. Uzun ve akıcı cümleler. Görsel imgeler. "Seçkin", "özel", "nadir" gibi kelimeler uygun. Fiyat yerine "değer" kullan.`,
  };
  return temalar[tema] ?? temalar.modern;
}

const PROMPTS: Record<string, string> = {
  portfoy_almak_detayli_analiz: `Sen deneyimli bir Türk gayrimenkul danışmanısın. Mülk sahibini portföyünü sana vermesi için ikna eden, rakam ve piyasa verisine dayalı, 5 bölümlü profesyonel bir sunum hazırla.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi} / {danismanSirketi}
BÖLGE: {bolge}

BÖLÜM YAPISI:

BÖLÜM 1 — KAPAK & İLK İZLENİM
- Güçlü bir açılış cümlesi: mülkün değerini ve potansiyelini vurgula
- Danışman kimliği ve güven unsuru
- "Bu sunumu neden okumalısınız" sorusunun cevabı

BÖLÜM 2 — PİYASA ANALİZİ
- Bölgedeki son 6 aydaki m² fiyat trendi
- Benzer mülklerin ortalama satış süresi
- Şu anki piyasa koşulları (alıcı mı satıcı mı piyasası?)
- Fırsatın neden şimdi değerlendirilmesi gerektiği

BÖLÜM 3 — DEĞERLEME RAPORU
- Mülkün güçlü yönleri (konum, özellikler, potansiyel)
- Zayıf yönler ve nasıl avantaja çevrileceği
- Önerilen liste fiyatı ve gerekçesi
- Beklenen satış süresi tahmini

BÖLÜM 4 — SATIŞ STRATEJİSİ
- Portföyü almak için önerilen pazarlama planı
- Hangi kanallarda ilan verileceği (Sahibinden, Emlakjet, Meta Ads vb.)
- Hedef alıcı profili
- Fotoğraf/video çekimi önerileri

BÖLÜM 5 — NEDEN BEN?
- Danışmanın bölgedeki referansları
- Başarı hikayeleri
- Garanti ve taahhütler
- İletişim ve sonraki adım

Türkçe, samimi ama profesyonel bir dille yaz.`,

  portfoy_almak_hizli_satis: `Sen sonuç odaklı bir Türk emlak danışmanısın. Mülk sahibini hızlıca ikna etmek için net, vurucu ve kısa bir 3 bölümlü sunum hazırla.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi} / {danismanSirketi}

BÖLÜM 1 — FIRSATIN ÖZETİ (30 saniyede okusun)
- Tek cümlelik güçlü açılış
- Mülkün en kritik 3 avantajı (madde madde)
- Şu anki piyasa fırsatı (neden beklemek riskli?)

BÖLÜM 2 — RAKAMLAR KONUŞUYOR
- Tahmini satış fiyatı
- Benzer mülklerin kaç günde satıldığı
- Danışmanın son 3 aydaki satış ortalaması
- Net kazanç hesabı

BÖLÜM 3 — HEMEN BAŞLAYALIM
- 3 adımlık basit süreç (imza → ilan → satış)
- İlk hafta yapılacaklar
- İletişim bilgileri ve randevu çağrısı

Kısa cümleler kullan. Her bölüm maksimum 150 kelime. Aciliyet hissi ver ama baskı yapma.`,

  portfoy_almak_premium_sunum: `Sen lüks gayrimenkul segmentinde uzman bir Türk danışmanısın. Yüksek değerli mülk sahiplerine hitap eden, zarif ve prestijli bir 5 bölümlü sunum hazırla.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi} / {danismanSirketi}

BÖLÜM 1 — MÜLKİYETİN DEĞERİ
- Mülkün özgün değerini ve nadirliğini anlatan açılış
- "Bu mülkün sahip olduğu fırsatı çok az insan görüyor" çerçevesi
- Premium segment piyasa verileri

BÖLÜM 2 — EKSPERTİZ RAPORU
- Detaylı değerleme
- Benzer lüks mülklerin satış geçmişi
- Potansiyel değer artışı projeksiyonu (5 yıl)

BÖLÜM 3 — ÖZEL PAZARLAMA PLANI
- Sadece bu mülke özel strateji
- Premium platformlar (uluslararası ilan siteleri dahil)
- Özel alıcı veritabanı
- Profesyonel fotoğraf, drone, sanal tur planı

BÖLÜM 4 — REFERANSLAR & BAŞARILAR
- Benzer segmentteki başarılı satışlar
- Müşteri referansları

BÖLÜM 5 — ÖZEL TEKLİF
- Bu mülke özel hizmet paketi
- Garanti koşulları
- Danışmanla özel görüşme daveti

Dil: Zarif, kibar, hiç acele ettirmeyen. Lüks tüketici psikolojisine uygun.`,

  portfoy_almak_guven_odakli: `Sen mülk sahiplerinin en çok güvendiği danışmanlardan birisin. Şüpheleri gideren, ilişki kuran ve güveni ön plana çıkaran 4 bölümlü bir sunum hazırla.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi} / {danismanSirketi}

BÖLÜM 1 — SİZİ ANLIYORUZ
- Mülk sahibinin olası endişelerini say ve her birini cevapla
- "Doğru fiyatı bulamam", "Süreç çok uzun sürer", "Danışman komisyonu hak etmez" gibi
- Empati kur, çözüm sun

BÖLÜM 2 — ŞEFFAF SÜREÇ
- Portföy alımından satışa kadar her adım
- Mülk sahibinin ne zaman ne yapması gerektiği
- İletişim sıklığı taahhüdü

BÖLÜM 3 — KANIT VE REFERANSLAR
- Bölgede tamamlanan satışlar
- Müşteri memnuniyeti örnekleri
- Sektör deneyimi ve sertifikalar

BÖLÜM 4 — TAAHHÜTLERİMİZ
- Hizmet garantisi
- Fesih hakkı koşulları (şeffaf ol)
- İletişim bilgileri ve sonraki adım

Dil: Sıcak, dürüst, anlaşılır. Jargon yok.`,

  portfoy_almak_minimalist: `Net, sade, gereksiz kelime yok. Mülk sahibine 3 şeyi anlat: neden şimdi, neden ben, sonraki adım.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi}

BÖLÜM 1 — NEDEN ŞİMDİ?
- 3 madde. Her madde 1 cümle.
- Piyasa durumu, fırsatın zamanlaması, risk.

BÖLÜM 2 — NEDEN BEN?
- 3 madde. Her madde 1 cümle.
- Deneyim, sonuç, güven.

BÖLÜM 3 — SONRAKİ ADIM
- Tek bir eylem çağrısı.
- Telefon numarası.
- Randevu teklifi.

Toplam 200 kelimeyi geçme. Her cümle değer taşımalı.`,

  portfoy_satmak_detayli_analiz: `Sen deneyimli bir Türk gayrimenkul danışmanısın. Potansiyel alıcıyı bu mülkü satın almaya ikna eden, rakam ve analiz odaklı, 5 bölümlü profesyonel bir sunum hazırla.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi} / {danismanSirketi}

BÖLÜM 1 — MÜLK TANITIMI
- Kapsamlı mülk tanıtımı
- Konum avantajları (okul, hastane, ulaşım, AVM mesafeleri)
- Teknik özellikler
- Öne çıkan 5 özellik

BÖLÜM 2 — YATIRIM ANALİZİ
- m² bazında bölge karşılaştırması
- Kira getiri potansiyeli (yıllık tahmini)
- Değer artış projeksiyonu
- Alternatif mülklerle karşılaştırma

BÖLÜM 3 — FİNANSAL TABLO
- Satış fiyatı ve ödeme seçenekleri
- Kredi kullanım senaryosu (örnek hesap)
- Tapu, vergi, diğer maliyetler
- Net maliyet hesabı

BÖLÜM 4 — YAŞAM KALİTESİ
- Çevre ve mahalle analizi
- Sosyal olanaklar
- Gelecek projeler
- Hedef alıcı profiline göre özelleştirilmiş faydalar

BÖLÜM 5 — SATIN ALMA SÜRECİ
- Adım adım satın alma süreci
- Danışmanın sağladığı destek
- İletişim bilgileri ve randevu

Dil: Bilgilendirici, dürüst, profesyonel.`,

  portfoy_satmak_hizli_satis: `Alıcıyı hızlı karar verdiren, fırsatın aciliyetini vurgulayan 3 bölümlü satış sunumu.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi}

BÖLÜM 1 — FIRSATI KAÇIRMA
- Bu mülkün şu an neden avantajlı olduğu (3 somut neden)
- Benzer mülklerin kaç günde satıldığı
- Rekabetçi fiyat gerekçesi

BÖLÜM 2 — MÜLKÜN EN İYİ 5 ÖZELLİĞİ
- Görsel odaklı, kısa açıklamalarla
- Konum, özellik, fiyat-değer dengesi vurgusu

BÖLÜM 3 — HEMEN AKSİYON
- Bugün ne yapabilirsin?
- Rezervasyon / ön görüşme süreci
- İletişim

Kısa, vurucu, aksiyon odaklı.`,

  portfoy_satmak_premium_sunum: `Lüks segment alıcısına yönelik, yaşam tarzı satan, prestijli 5 bölümlü sunum.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi}

BÖLÜM 1 — BİR YAŞAM TARZI SUNUYORUZ
- Mülkü bir ürün olarak değil, bir deneyim olarak anlat
- "Bu mülke sahip olan kişi nasıl bir hayat yaşar?"
- Prestij, özel, seçkin çerçevesi

BÖLÜM 2 — MİMARİ & TASARIM
- Malzeme kalitesi, iç mimari detaylar
- Özel unsurlar (teras, havuz, akıllı ev vb.)
- Manzara ve çevre kalitesi

BÖLÜM 3 — KONUM & AYRICALIK
- Bölgenin elit statüsü
- Komşuluk ve sosyal çevre
- Yakın mesafedeki premium olanaklar

BÖLÜM 4 — YATIRIM DEĞERİ
- Premium segment değer artış tarihçesi
- Kira getirisi (üst segment kiracı profili)
- Uluslararası alıcı ilgisi

BÖLÜM 5 — ÖZEL GÖRÜŞME DAVETİ
- Kalabalığa değil, size özel sunum
- Özel ziyaret organizasyonu teklifi
- İletişim

Dil: Zarif, gururla sahip olunan bir şeyi anlatan ton.`,

  portfoy_satmak_guven_odakli: `Alıcının şüphelerini gideren, şeffaf süreç anlatan, güven inşa eden 4 bölümlü sunum.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi}

BÖLÜM 1 — SORULARINIZI BİLİYORUZ
- Alıcının aklındaki 5 soru ve cevabı:
  "Gizli bir sorun var mı?", "Fiyat pazarlık payı var mı?",
  "Tapu temiz mi?", "Bölge değer kaybeder mi?" vb.

BÖLÜM 2 — ŞEFFAF MÜLK RAPORU
- Mülkün artıları ve eksileri (dürüstçe)
- Eksiler için çözüm önerileri
- Bağımsız ekspertiz bilgisi

BÖLÜM 3 — GÜVENLİ SATIN ALMA SÜRECİ
- Tapu kontrolü, borç sorgulama süreci
- Danışmanın sağladığı hukuki destek
- Satın alma sonrası destek

BÖLÜM 4 — REFERANSLAR & GARANTİ
- Danışmanın referansları
- Hizmet garantisi
- İletişim`,

  portfoy_satmak_minimalist: `Alıcıya 3 şeyi anlat: mülk ne, neden değerli, nasıl alınır.

MÜLK BİLGİLERİ:
{mulkBilgileri}

DANIŞMAN: {danismanAdi}

BÖLÜM 1 — MÜLK
- Tip, konum, fiyat. 3 cümle.

BÖLÜM 2 — NEDEN BU MÜLK?
- 3 madde, her biri 1 cümle.

BÖLÜM 3 — NASIL ALINIR?
- 3 adım. Telefon numarası.

200 kelime limiti. Görseller konuşsun, metin desteklesin.`,
};

export function buildSunumPrompt(params: SunumPromptParams): string {
  const key = `${params.amac}_${params.sunumStili}`;
  const basePrompt = PROMPTS[key] || PROMPTS.portfoy_almak_detayli_analiz;
  const temaEki = getTemaTalimat(params.tema);

  const mulkText = formatMulkBilgileri(params.mulk);
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

  prompt += `\n\nYANITI JSON FORMATINDA VER:
{
  "baslik": "Ana başlık (maks 60 karakter)",
  "altBaslik": "Alt başlık (opsiyonel)",
  "heroAciklama": "Hero bölümü açıklaması (2-3 cümle)",
  "bolgeler": [
    {
      "baslik": "Bölüm başlığı",
      "icerik": "Bölüm içeriği (2-3 paragraf)",
      "tip": "text|stats|list|quote|comparison",
      "altBolge": [
        { "baslik": "Alt başlık", "icerik": "Alt içerik", "tip": "text" }
      ]
    }
  ]
}`;

  return prompt;
}

export { getTemaTalimat, formatMulkBilgileri };
