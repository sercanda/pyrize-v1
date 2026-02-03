# Veriye Dayalı Piyasa Analizi Modülü

## Genel Bakış

Bu modül, emlak sunumlarında kullanılmak üzere otomatik piyasa verisi toplama ve analiz sistemidir. Endeksa, Zingat, Emlakjet ve Sahibinden gibi platformlardan web scraping yaparak canlı piyasa verileri toplar ve veritabanında cache'ler.

## Özellikler

- ✅ **Otomatik Cache Sistemi**: Veriler 48 saat boyunca cache'lenir
- ✅ **Multi-Source Scraping**: 4 farklı kaynaktan veri toplama
- ✅ **Background Refresh**: Eski veriler arka planda otomatik güncellenir
- ✅ **Playwright Stealth Mode**: Bot tespitini önlemek için gelişmiş teknikler
- ✅ **TypeScript + Type Safety**: Tam tip güvenliği

## Veritabanı Yapısı

```sql
market_analysis_cache
├── id (UUID)
├── location (TEXT) - Unique
├── province, district, neighborhood (TEXT)
├── sqm_avg (NUMERIC) - Ortalama m² fiyatı
├── six_month_trend (NUMERIC[]) - Son 6 ay trend
├── sale_duration_days (INTEGER) - Ortalama satış süresi
├── demand_change_percent (NUMERIC) - Talep değişimi %
├── active_listings_count (INTEGER) - Aktif ilan sayısı
├── data_source (TEXT[]) - Veri kaynakları
├── scrape_status (TEXT) - 'pending' | 'success' | 'failed' | 'partial'
├── last_updated (TIMESTAMPTZ)
└── created_at (TIMESTAMPTZ)
```

## Kullanım

### API Endpoints

#### 1. Market Analysis Getir

```bash
GET /api/market-analysis?location=Kadıköy&forceRefresh=false
```

**Query Parameters:**
- `location` (required): Bölge adı (örn: "Kadıköy", "Beşiktaş")
- `province` (optional): İl
- `district` (optional): İlçe
- `neighborhood` (optional): Mahalle
- `forceRefresh` (optional): Cache'i atla ve yeniden scrape et
- `maxAgeHours` (optional): Cache max yaşı (default: 48)

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "Kadıköy",
    "sqm_avg": 28500,
    "six_month_trend": [27000, 27500, 28000, 28200, 28300, 28500],
    "sale_duration_days": 45,
    "demand_change_percent": 12.5,
    "active_listings_count": 234,
    "data_source": ["endeksa", "zingat", "emlakjet"],
    "scrape_status": "success",
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Manual Refresh

```bash
POST /api/market-analysis
Content-Type: application/json

{
  "location": "Kadıköy",
  "province": "İstanbul",
  "district": "Kadıköy",
  "neighborhood": "Moda"
}
```

#### 3. CRON Job - Stale Data Refresh

```bash
POST /api/market-analysis/cron
Authorization: Bearer <CRON_SECRET>
```

**Environment Variables:**
```env
CRON_SECRET=your-secret-token-here
```

## Sunum Entegrasyonu

Sunum oluşturma sırasında otomatik olarak market analizi çekilir:

```typescript
// src/app/api/sunum/olustur/route.ts
const marketData = await marketAnalysisService.getMarketAnalysis({
  location: body.mulk.konum,
  forceRefresh: false
});

const icerik = await sunumOlustur(body, body.template, marketData);
```

Market verileri AI prompt'una eklenir ve "Veriye Dayalı Piyasa Analizi" bölümünde kullanılır.

## Scraping Servisleri

### EndeksaScraper
- URL: `https://www.endeksa.com/tr/fiyat-endeksi/{location}`
- Veriler: m² ortalama fiyat, trend, talep değişimi

### ZingatScraper
- URL: `https://www.zingat.com/fiyat-endeksi/{location}`
- Veriler: m² fiyat, trend chart, aktif ilan sayısı

### EmlakjetScraper
- URL: `https://www.emlakjet.com/konut/{location}`
- Veriler: Ortalama fiyat (listing'lerden), satış süresi

### SahibindenScraper
- URL: `https://www.sahibinden.com/satilik-konut?query_text={location}`
- Veriler: Ortalama fiyat, aktif ilan sayısı

## Playwright Konfigürasyonu

### Stealth Mode
- Custom User-Agent
- Navigator properties override
- Automation detection bypass
- Headless mode (production'da true, development'ta false)

### Development
```typescript
headless: false // Browser'ı görebilirsiniz
```

### Production
```typescript
headless: true // Arka planda çalışır
```

## Cache Mantığı

1. **Cache Hit**: Veri 48 saatten yeni ise → direkt döner
2. **Stale Cache**: Veri 48 saatten eski ise → eski veriyi döner, background refresh başlatır
3. **No Cache**: Veri yoksa → scraping başlar, cache'e kaydedilir

## CRON Job Kurulumu

### Vercel Cron
`vercel.json`:
```json
{
  "crons": [{
    "path": "/api/market-analysis/cron",
    "schedule": "0 2 * * *"
  }]
}
```

### External Cron Service
- Cron-job.org
- EasyCron
- GitHub Actions

**Cron Expression**: `0 2 * * *` (Her gün saat 02:00)

## Hata Yönetimi

- Scraping başarısız olursa → Placeholder veri kullanılır
- Tüm kaynaklar başarısız olursa → `scrape_status: 'failed'`
- Bazı kaynaklar başarılı → `scrape_status: 'partial'`
- Tüm kaynaklar başarılı → `scrape_status: 'success'`

## Performans

- **Cache Hit**: ~50ms
- **Cache Miss (Scraping)**: ~30-60 saniye
- **Background Refresh**: Async, blocking değil

## Güvenlik

- Rate limiting (2 saniye aralık)
- CRON endpoint token koruması
- User-Agent rotation
- Error logging

## Gelecek İyileştirmeler

- [ ] Proxies desteği
- [ ] CAPTCHA bypass
- [ ] Daha fazla veri kaynağı
- [ ] Real-time webhook güncellemeleri
- [ ] Machine learning tabanlı trend tahmini

