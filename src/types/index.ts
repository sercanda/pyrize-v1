export type MulkTuru =
  | "daire"
  | "arsa"
  | "villa"
  | "ticari"
  | "kompleks"
  | "ofis";

export type SunumAmaci =
  | "portfoy_almak"  // Yeni satıcıyı etkilemek
  | "portfoy_satmak"; // Müşteriye sunum yapmak

export type SunumUzunlugu =
  | "kisa"   // Tek bakışta bilgi sunumu
  | "orta"   // Hikayeleştirilmiş sunum
  | "uzun";  // Detaylı analiz ve güven inşası

export type TemaTuru =
  | "modern"        // Dinamik, çağdaş
  | "kurumsal"      // Profesyonel, güvenilir
  | "luks";         // Prestijli, yüksek standart

export type SunumStili =
  | "detayli_analiz"   // Analiz ve kapsamlı içerik
  | "hizli_satis"      // Hızlı karar odaklı içerik
  | "premium_sunum"    // Premium, lüks sunum
  | "guven_odakli"     // Güven ve danışman odaklı içerik
  | "minimalist";      // Sade, öz, temiz sunum

export type SunumTuru =
  | "normal_sunum"     // Normal portföy sunumu
  | "haftalik_rapor";  // Haftalık performans raporu

export interface DanismanBilgileri {
  adSoyad: string;
  telefon: string;
  email: string;
  unvan?: string;             // Consultant title for templates (e.g., "Gayrimenkul Danışmanı")
  profilFotografi?: string;   // URL veya base64
  ofisLogosu?: string;        // URL veya base64
  deneyim?: string;
  oduller?: string;           // Ödüller ve başarılar
  referans?: string;
  ofisAdi?: string;           // RE/MAX, Zeren Gayrimenkul, Coldwell Banker vs.
}

export interface MulkBilgileri {
  tur: MulkTuru;
  konum: string;
  fiyat?: number;
  fiyatMin?: number;
  fiyatMax?: number;
  metrekare?: number;
  odaSayisi?: string;
  cephe?: string;
  kat?: string;
  yas?: string;
  krediyeUygun?: 'uygun' | 'uygun_degil' | 'kismen';
  cevreOzellikleri?: string[];
  avantajlar?: string[];
  aciklama?: string;
  konumAvantajlari?: string; // KONUM AVANTAJLARI alanı
  kullanimPotansiyeli?: string; // KULLANIM POTANSİYELİ alanı
  fotograflar?: string[]; // Mülk fotoğrafları (base64 veya URL)
  ilanNo?: string; // İlan numarası
}

export interface MarkaRenkleri {
  primary: string;      // Ana renk (CTA, vurgular)
  secondary: string;    // İkincil renk (başlıklar, hover)
  accent: string;       // Vurgu rengi (özel elementler)
}

export type ReklamPlatformu = 'google' | 'instagram' | 'facebook' | 'tiktok';

export interface HaftalikRaporVerisi {
  // Genel Bilgiler
  raporBasligi: string;
  mulkAdi?: string;
  portfoyAdi?: string;
  haftaBaslangic: Date | string;
  haftaBitis: Date | string;
  danismanAdi: string;
  musteriAdi?: string;

  // Sahibinden / İlan Performans Verileri
  sahibindenIlanUrl?: string;
  toplamGoruntulenme: number;
  haftalikGoruntulenme: number;
  toplamFavoriSayisi: number;
  haftalikFavoriArtisi: number;
  toplamMesajSayisi: number;
  toplamAramaSayisi: number;

  // Reklam Performansı (Meta / Google)
  reklamPlatformu?: ReklamPlatformu;
  harcananButce: number;              // ₺
  goruntulenmeImpressions: number;
  tiklanmaSayisi: number;
  erisimReach: number;
  tiklanmaOraniCTR: number;           // %
  tiklanmaBasiMaliyetCPC: number;     // ₺
  formDolduranKisiSayisi: number;
  whatsappTiklamaSayisi: number;
  arayanKisiSayisi: number;
  realMusteriDonusu: number;          // Gerçek potansiyel müşteri / sıcak lead

  // Fiziksel Geri Dönüşler
  yerindeGosterimSayisi: number;
  demoZiyaretSayisi: number;
  yapilanTeklifSayisi: number;
  ciddiAliciSayisi: number;
  redOlanTeklifSayisi: number;

  // Satıcı / Müşteri Geri Bildirimi
  saticiYorumu?: string;
  potansiyelAliciGeriBildirimleri?: string;
  gorulenAnaProblemler?: string;

  // API Entegrasyonuna Açık Alanlar
  googleAdsCampaignId?: string;
  metaAdsCampaignId?: string;

  // AI Destekli Otomatik Alanlar (oluşturulacak)
  aiPerformansYorumu?: string;
  aiStratejiOnerisi?: string;
  aiHaftalikOzet?: string;

  // Eski alanlar (geriye dönük uyumluluk için)
  goruntulenmeSayisi?: number;        // toplamGoruntulenme ile birleştirilecek
  erisim?: number;                     // erisimReach ile birleştirilecek
  reklamGeriDonusleri?: number;       // realMusteriDonusu ile birleştirilecek
  ilgiOrani?: number;                  // tiklanmaOraniCTR ile birleştirilecek
  raporTarihi?: Date;
}

export interface SunumOlusturmaIstegi {
  sunumTuru?: SunumTuru;            // Normal sunum veya haftalık rapor
  danisman: DanismanBilgileri;
  mulk: MulkBilgileri;
  amac: SunumAmaci;
  uzunluk: SunumUzunlugu;
  tema: TemaTuru;
  sunumStili?: SunumStili;
  markaRenkleri?: MarkaRenkleri;
  locationAnalysis?: string; // AI tarafından oluşturulan bölge analizi
  detayliDegerleme?: DetayliDegerlemeVerisi;
  haftalikRapor?: HaftalikRaporVerisi; // Haftalık rapor verileri
}

// Funnel bölüm tipleri
export type BolgeTipi =
  | "hero"
  | "problemler"
  | "cozum"
  | "process"
  | "testimonial"
  | "guarantee"
  | "location_analysis"
  | "location_advantages" // KONUM AVANTAJLARI
  | "usage_potential" // KULLANIM POTANSİYELİ
  | "marketing_strategy" // TANITIM STRATEJİSİ
  | "value_plan" // TAHMİNİ DEĞER & SATIM PLANI
  | "ad_channels" // REKLAM KANALLARI
  | "contact_24_7" // 7/24 İletişim
  | "timing_urgency" // Zaman Kaybı = Para Kaybı
  | "market_opportunity" // Piyasa Fırsatı
  | "target_audience"
  | "marketing"
  | "faq"
  | "timing"
  | "cta"
  | "regional_comparison" // Detaylı Değerleme Raporu
  | "market_analysis" // Veriye Dayalı Piyasa Analizi
  | "urgency" // Aciliyet/FOMO mesajı (hızlı satış)
  | "quick_highlights" // Hızlı vurgu noktaları (hızlı satış)
  | "lifestyle" // Yaşam tarzı vizyonu (premium)
  | "exclusive_offer" // VIP/özel teklif (premium)
  | "testimonials" // Sosyal kanıt/referanslar (güven odaklı)
  | "guarantees"; // Garantiler (güven odaklı)

export interface Bolge {
  tip: BolgeTipi;
  baslik: string;
  icerik: string;
  altBolge?: {
    baslik: string;
    icerik: string;
    tip: "text" | "stats" | "list" | "quote" | "comparison";
  }[];
}

export interface SunumIcerik {
  baslik: string;
  altBaslik?: string;
  heroAciklama: string;
  bolgeler?: Bolge[];
  cti?: {
    baslik: string;
    aciklama: string;
  };
  ozellikler?: string[];
  detayliDegerleme?: DetayliDegerlemeVerisi;
}

export type DegerlemeTrend = "up" | "down" | "stable";

export interface DetayliDegerlemeSnapshot {
  title: string;
  value: string;
  trend?: DegerlemeTrend;
  trendLabel?: string;
}

export type DetayliDegerlemeDurum = "Satıldı" | "Satışta";

export interface DetayliDegerlemeComparable {
  address: string;
  status: DetayliDegerlemeDurum;
  price: string;
  size?: string;
  pricePerSqm?: string;
}

export interface DetayliDegerlemeVerisi {
  marketSnapshots?: DetayliDegerlemeSnapshot[];
  comparables?: DetayliDegerlemeComparable[];
  estimatedValueRange?: string;
}

export interface OlusturulanSunum {
  id: string;
  slug: string;
  olusturmaTarihi: Date;
  istek: SunumOlusturmaIstegi;
  icerik: SunumIcerik;
  html?: string;
  publicUrl: string;
}

export interface SunumDuzenlemeKomutu {
  sunumId: string;
  komut: string;
  // Örnekler: "daha kısa hale getir", "lokasyon vurgusu ekle", "daha kurumsal dil kullan"
}

