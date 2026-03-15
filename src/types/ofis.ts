export interface EkipUyesi {
  id: string;
  ad: string;
  unvan: string;
  foto_url?: string;
  telefon?: string;
  email?: string;
  uzmanlik?: string;
  linkedin_url?: string;
}

export interface OfisPortfoy {
  id: string;
  ofis_id: string;
  baslik: string;
  aciklama?: string;
  mulk_tipi?: string;
  durum: 'satilik' | 'kiralik' | 'satildi';
  fiyat?: number;
  fiyat_birimi: string;
  adres?: string;
  ilce?: string;
  sehir?: string;
  alan_m2?: number;
  oda_sayisi?: string;
  kat?: number;
  bina_yasi?: number;
  kapak_foto_url?: string;
  foto_urls: string[];
  one_cikar: boolean;
  aktif: boolean;
  created_at: string;
}

export interface OfisProfili {
  id: string;
  user_id: string;
  slug: string;

  // Ofis Bilgileri
  ofis_adi: string;
  ofis_logo_url?: string;
  adres?: string;
  ilce?: string;
  sehir?: string;
  telefon?: string;
  email?: string;
  website?: string;
  instagram_url?: string;
  linkedin_url?: string;
  whatsapp?: string;

  // Danışman Bilgileri
  danisan_adi: string;
  danisan_foto_url?: string;
  danisan_unvan?: string;
  danisan_biyografi?: string;
  deneyim_yili?: number;
  uzmanlik_alanlari: string[];
  calisma_bolgesi: string[];

  // İstatistikler
  toplam_satis: number;
  bu_yil_satis: number;
  mutlu_musteri: number;
  ortalama_satis_suresi?: number;
  toplam_portfoy_degeri?: number;

  // Ekip
  ekip_uyeleri: EkipUyesi[];

  // Ayarlar
  yayinda: boolean;
  created_at: string;
  updated_at: string;
}

export type OfisProfilFormData = Omit<OfisProfili, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
