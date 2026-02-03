# FunnelBuilder - Emlak Sunum Oluşturucu

AI destekli profesyonel emlak sunum sayfaları oluşturma platformu.

## Özellikler

- ✅ **AI Destekli İçerik**: xAI Grok 4.1 Fast ile otomatik sunum içeriği oluşturma
- ✅ **3 Farklı Uzunluk**: Kısa, Orta ve Uzun sunum seçenekleri
- ✅ **5 Farklı Tema**: Sıcak & Samimi, Kurumsal, Modern, Lüks, Minimalist
- ✅ **Çoklu Mülk Türü**: Daire, Arsa, Villa, Ticari, Kompleks, Ofis
- ✅ **İki Amaç**: Portföy almak veya satmak için optimize edilmiş içerikler
- ✅ **Detaylı Değerleme Modülü**: Kurumsal + Detaylı Analiz kombinasyonunda isteğe bağlı pazar analizi ve emsal girişi
- ✅ **Veriye Dayalı Piyasa Analizi**: Endeksa, Zingat, Emlakjet, Sahibinden'den otomatik market verisi toplama ve cache sistemi
- ✅ **Responsive Tasarım**: Mobil uyumlu, profesyonel görünüm

## Teknoloji Stack

- **Frontend**: Next.js 16 + TypeScript + TailwindCSS
- **AI**: xAI Grok 4.1 Fast (OpenRouter üzerinden)
- **Upload**: react-dropzone ile sürükle-bırak dosya yönetimi
- **Database**: Supabase (yakında)
- **Deployment**: Vercel

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env.local dosyasını oluştur
cp .env.example .env.local

# API anahtarlarını ekle (.env.local içinde)
# - GEMINI_API_KEY
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# Dev sunucusunu başlat
npm run dev

# Build al
npm run build
npm start
```

## API Anahtarları

`.env.local` dosyasına eklemeniz gerekenler:

```env
# OpenRouter API (Öncelikli - Grok 4.1 Fast kullanılıyor)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Gemini API (Fallback - opsiyonel)
GEMINI_API_KEY=your_gemini_api_key_here

FAL_KEY=your_fal_ai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=your_admin_email@example.com

# Market Analysis CRON (optional, for scheduled data refresh)
CRON_SECRET=your-random-secret-token-here
```

> **AI Model:** Proje şu anda **xAI Grok 4.1 Fast (free)** modelini OpenRouter üzerinden kullanmaktadır. Model adı: `x-ai/grok-4.1-fast:free`

> `FAL_KEY` yalnızca backend tarafında kullanılmaktadır. Fal.ai isteklerini frontend yerine `src/app/api/images/furnish/route.ts` sunucu endpointi üzerinden yönlendirerek anahtarınızı güvenli tutabilirsiniz.

## Market Analysis Module

This app includes a **Data-Driven Market Analysis** module that automatically scrapes real estate market data from multiple sources (Endeksa, Zingat, Emlakjet, Sahibinden) and caches it in the database.

### Features
- Automatic cache (48 hours)
- Multi-source scraping with Playwright
- Background refresh for stale data
- Integrated into presentation creation flow

See [docs/market-analysis.md](docs/market-analysis.md) for detailed documentation.

### Database Migration

Run the Supabase migration to create the market analysis cache table:

```bash
# Apply migration via Supabase Dashboard or CLI
supabase/migrations/001_market_analysis.sql
```

## Kullanım

1. Ana sayfadan kayıt olun
2. Dashboard'a gidin ve "Yeni Sunum" oluşturun
3. Adım adım bilgileri doldurun:
   - Danışman bilgileri
   - Gayrimenkul detayları
   - Sunum tercihleri (amaç, uzunluk, tema)
   - Kurumsal + Detaylı Analiz + Portföy Almak seçildiğinde opsiyonel Detaylı Değerleme Raporu alanlarını doldurun
4. AI otomatik olarak profesyonel içerik oluşturur
5. Oluşturulan sunumu görüntüleyin, paylaşın veya PDF'e indirin

## Sayfa Yapısı

```
/                       # Ana sayfa (landing)
/auth/login            # Giriş
/auth/register         # Kayıt
/dashboard             # Dashboard (sunum listesi)
/dashboard/olustur     # Yeni sunum oluşturma
/sunum/[id]           # Sunum görüntüleme
```

## PDF Export (Local)

PDF export özelliği server-side Puppeteer kullanarak çalışır. **Local Windows ortamında** çalışması için:

### Gereksinimler

1. **Google Chrome kurulu olmalı** (veya Chromium)
   - Varsayılan yollar:
     - `C:\Program Files\Google\Chrome\Application\chrome.exe`
     - `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

2. **Puppeteer bağımlılıkları:**
   ```bash
   pnpm install
   # Puppeteer otomatik olarak Chromium indirir (ilk kurulumda)
   ```

3. **Eğer Chrome farklı bir yerdeyse:**
   ```bash
   # .env.local dosyasına ekle:
   PUPPETEER_EXECUTABLE_PATH=C:\Path\To\Chrome\chrome.exe
   ```

### Doğrulama

PDF export butonuna tıkladığınızda:
- ✅ PDF indirilmeli
- ✅ İçerik boş olmamalı
- ✅ Türkçe karakterler doğru görünmeli
- ✅ Layout kayması olmamalı

**Sorun giderme:**
- "ICU hatası" alıyorsanız → Chrome kurulu olduğundan emin olun
- "Browser launch failed" → `PUPPETEER_EXECUTABLE_PATH` environment variable'ını kontrol edin
- PDF boş geliyorsa → Console'da hata loglarını kontrol edin

## Yakında

- 💬 Chat editör (sunum düzenleme)
- 🗄️ Supabase entegrasyonu
- 👤 Kullanıcı profili
- 📊 Analitikler

## Güvenlik Standartları

Tüm API entegrasyonları için **security PRD**’de tanımlanan ilkelere uymamız gerekir (proxy mimarisi, rate-limit, harcama limiti, secret taraması vb.). Ayrıntılar: [`docs/security/README.md`](docs/security/README.md).

## Lisans

MIT
