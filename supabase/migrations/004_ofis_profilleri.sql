-- Ofis Profilleri tablosu
CREATE TABLE IF NOT EXISTS ofis_profilleri (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,

  -- Ofis Bilgileri
  ofis_adi TEXT NOT NULL,
  ofis_logo_url TEXT,
  adres TEXT,
  ilce TEXT,
  sehir TEXT,
  telefon TEXT,
  email TEXT,
  website TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  whatsapp TEXT,

  -- Danışman Bilgileri
  danisan_adi TEXT NOT NULL,
  danisan_foto_url TEXT,
  danisan_unvan TEXT,
  danisan_biyografi TEXT,
  deneyim_yili INTEGER,
  uzmanlik_alanlari TEXT[] DEFAULT '{}',
  calisma_bolgesi TEXT[] DEFAULT '{}',

  -- İstatistikler
  toplam_satis INTEGER DEFAULT 0,
  bu_yil_satis INTEGER DEFAULT 0,
  mutlu_musteri INTEGER DEFAULT 0,
  ortalama_satis_suresi INTEGER,
  toplam_portfoy_degeri BIGINT,

  -- Ekip
  ekip_uyeleri JSONB DEFAULT '[]',

  -- Ayarlar
  yayinda BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE ofis_profilleri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi profilini yönetir"
  ON ofis_profilleri FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Herkes yayındaki profili görebilir"
  ON ofis_profilleri FOR SELECT
  USING (yayinda = true);

-- Ofis Portföyleri tablosu
CREATE TABLE IF NOT EXISTS ofis_portfoyleri (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ofis_id UUID REFERENCES ofis_profilleri(id) ON DELETE CASCADE,

  baslik TEXT NOT NULL,
  aciklama TEXT,
  mulk_tipi TEXT,
  durum TEXT DEFAULT 'satilik',
  fiyat BIGINT,
  fiyat_birimi TEXT DEFAULT 'TL',

  adres TEXT,
  ilce TEXT,
  sehir TEXT,

  alan_m2 INTEGER,
  oda_sayisi TEXT,
  kat INTEGER,
  bina_yasi INTEGER,

  kapak_foto_url TEXT,
  foto_urls TEXT[] DEFAULT '{}',

  one_cikar BOOLEAN DEFAULT false,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ofis_portfoyleri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ofis sahibi portföyünü yönetir"
  ON ofis_portfoyleri FOR ALL
  USING (
    ofis_id IN (
      SELECT id FROM ofis_profilleri WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Herkes aktif portföyü görebilir"
  ON ofis_portfoyleri FOR SELECT
  USING (aktif = true);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_ofis_profilleri_slug ON ofis_profilleri(slug);
CREATE INDEX IF NOT EXISTS idx_ofis_profilleri_user_id ON ofis_profilleri(user_id);
CREATE INDEX IF NOT EXISTS idx_ofis_portfoyleri_ofis_id ON ofis_portfoyleri(ofis_id);
