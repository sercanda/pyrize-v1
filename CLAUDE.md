# CLAUDE.md — PYRIZE-V1 Proje Kılavuzu

> Bu dosya, AI kod editörlerinin (Cursor, Claude Code vb.) projeyi doğru anlaması ve tutarlı geliştirme yapması için hazırlanmıştır. Her oturumda bu dosyayı oku.

---

## 1. PROJE KİMLİĞİ

**Ad:** PYRIZE-V1 (FunnelBuilder)
**Tür:** AI destekli gayrimenkul sunum/funnel oluşturucu SaaS platformu
**Hedef Kullanıcı:** Türk emlak danışmanları
**Temel Değer Önerisi:** 2 dakikada AI ile profesyonel mülk sunumu oluştur, paylaş veya PDF olarak indir
**Dil:** Türkçe (UI + içerik)
**Durum:** Beta — auth stub, CRM/Kanban localStorage, PDF export hatalı

---

## 2. TEKNOLOJİ YIĞINI

| Katman | Teknoloji | Versiyon / Not |
|---|---|---|
| Framework | Next.js (App Router) | 16.0.1 |
| UI | React + TypeScript | 18 |
| Stil | Tailwind CSS | glassmorphism efektleri |
| Animasyon | Motion, GSAP, OGL (WebGL) | |
| Veritabanı | Supabase (PostgreSQL) | auth henüz stub |
| Local State | localStorage + React Context | CRM, Kanban |
| AI - Ana | OpenRouter → xAI Grok 4.1 Fast | `x-ai/grok-4.1-fast:free` |
| AI - Fallback | Google Gemini | |
| AI - Hız | Groq | |
| Görsel İşleme | FAL AI | backend-only |
| DnD | @dnd-kit | |
| Grafik | Recharts | |
| Excel Export | XLSX | |
| PDF Export | Puppeteer (server-side) | **HATALI — düzeltilmeli** |
| Deployment | Docker + Coolify + Hetzner | sorunlu |
| Scraping | Playwright | market analizi |

---

## 3. PROJE KLASÖR YAPISI

```
pyrize-v1/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing sayfası
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Sunum listesi
│   │   │   ├── olustur/page.tsx        # Çok adımlı sunum formu (ANA MODÜL)
│   │   │   ├── crm/page.tsx            # Pipeline yönetimi
│   │   │   └── todo/page.tsx           # Kanban görev yönetimi
│   │   ├── sunum/[id]/page.tsx         # Sunum görüntüleme (web + mobil)
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── generate/route.ts   # Ana içerik üretimi
│   │       │   ├── analyze/route.ts    # Mülk analizi
│   │       │   ├── audience/route.ts   # Hedef kitle belirleme
│   │       │   └── content/route.ts    # İçerik güncelleme
│   │       ├── pdf/route.ts            # PDF export (Puppeteer) — HATALI
│   │       ├── images/
│   │       │   └── furnish/route.ts    # FAL AI görsel işleme
│   │       └── market-data/route.ts    # Piyasa verisi cache
│   ├── components/
│   │   ├── templates/                  # 14+ sunum şablonu
│   │   │   ├── ModernTemplate.tsx
│   │   │   ├── KurumsalTemplate.tsx
│   │   │   ├── LuksTemplate.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   ├── forms/
│   │   └── ui/
│   ├── lib/
│   │   ├── security/
│   │   │   ├── rateLimiter.ts
│   │   │   ├── budgetTracker.ts
│   │   │   └── withSecurity.ts         # Tüm AI endpoint'leri bununla sarılı
│   │   ├── supabase/
│   │   ├── ai/
│   │   └── pdf/                        # PDF yardımcı fonksiyonlar
│   └── contexts/
│       ├── CRMContext.tsx
│       └── KanbanContext.tsx
├── supabase/
│   └── migrations/
│       └── 001_market_analysis.sql
├── docs/
│   ├── security/README.md
│   └── market-analysis.md
├── Dockerfile
├── docker-compose.yml
├── server.js                           # Custom Express server (port 3000)
├── middleware.ts                       # Next.js middleware
└── next.config.js
```

---

## 4. SUNUM OLUŞTURMA AKIŞI (KRİTİK MODÜL)

### 4.1 Çok Adımlı Form (`/dashboard/olustur`)

Kullanıcı aşağıdaki adımları tamamlar:

```
Adım 1: AMAÇ SEÇİMİ
  - Portföy Almak (mülk sahiplerini ikna etmek)
  - Portföy Satmak (alıcıları ikna etmek)

Adım 2: MÜLK TİPİ
  - Daire / Arsa / Villa / Ticari / Kompleks / Ofis

Adım 3: SUNUM TERCİHLERİ
  - Uzunluk: Kısa | Orta | Uzun
  - Tema: Sıcak&Samimi | Kurumsal | Modern | Lüks | Minimalist
  - Analiz tipi: Genel | Kurumsal | Kurumsal+Detaylı (Detaylı Değerleme Raporu)

Adım 4: DANIŞMAN BİLGİLERİ
  - Ad, soyad, telefon, e-posta, ofis adı, logo

Adım 5: GAYRIMENKUL DETAYLARI
  - Adres, m², oda sayısı, kat, bina yaşı, fiyat
  - Özellikler (balkon, otopark, havuz vb.)
  - Fotoğraflar (drag-drop)

Adım 6: (Opsiyonel - Kurumsal+Detaylı seçilirse)
  - Emsal mülkler (manuel giriş)
  - Piyasa analizi notu
  - Hedef fiyat aralığı

→ AI İşleme (OpenRouter/Grok)
→ Şablon + İçerik birleşimi
→ Sunum oluşturuldu → /sunum/[id]
```

### 4.2 Funnel Mantığı

Her sunum funnel şeklinde tasarlanmıştır:
- Her "sayfa/bölüm" bir funnel adımına karşılık gelir
- Web/mobil görünümde: scroll ile ilerleyen tek sayfa (sorunsuz çalışıyor)
- PDF görünümde: Her funnel adımı = 1 A4 sayfa (HATALI — kaymalar var)

### 4.3 Şablonlar

14+ şablon bulunmaktadır. Her şablon:
- Tema renklerini ve tipografiyi tanımlar
- Funnel bölüm sırasını tanımlar
- Hem web render hem PDF render desteklemeli (ŞU AN PDF DESTEKLEMIYOR)

---

## 5. BİLİNEN SORUNLAR (ÖNCELİKLİ FİX LİSTESİ)

### 🔴 KRİTİK — PDF Export Sorunu

**Sorun:** PDF indirme yapıldığında sayfalarda kaymalar oluyor, funnel adımları doğru sayfalanmıyor.

**Kök Neden Analizi:**
- Puppeteer, web DOM'unu olduğu gibi yakalar → scroll-based layout A4'e uymuyor
- CSS `page-break` kuralları uygulanmıyor
- Glassmorphism ve WebGL efektleri Puppeteer'da render edilmiyor
- Dinamik yüklenen içerikler PDF'e geçmiyor

**Çözüm Yaklaşımı:**
```
1. PDF-specific CSS class'ları ekle: `.pdf-mode`
2. Her funnel bölümü için `page-break-before: always` uygula
3. Puppeteer launch'a `--no-sandbox`, `--disable-dev-shm-usage` ekle
4. PDF render öncesi: animasyonları devre dışı bırak, WebGL'i kapat
5. A4 boyutunu sabit tut: 794px × 1123px (96 DPI)
6. `waitUntil: 'networkidle0'` + `setTimeout(2000)` ile içerik bekle
7. Alternatif: @react-pdf/renderer ile sunucu tarafında PDF üret
```

**Hedef Çıktı:**
- Her funnel adımı = 1 A4 sayfası (veya içeriğe göre 2)
- Toplam sayfa sayısı sabit ve öngörülebilir
- Türkçe karakterler doğru
- Logo ve görseller yerinde

### 🔴 KRİTİK — Coolify/Hetzner Deploy Sorunu

**Sorun:** Docker ile Coolify üzerinden Hetzner'a deploy edilemiyor.

**Olası Nedenler:**
- `server.js` custom Express server Dockerfile'da doğru çalışmıyor
- Puppeteer için Chromium binary eksik Docker image'ında
- Environment variable'lar Coolify'da set edilmemiş
- Port binding sorunu (server.js → 3000)
- Node memory limiti aşılıyor

**Çözüm Yaklaşımı:**
```dockerfile
# Dockerfile'a ekle:
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-noto \
    fonts-noto-cjk \
    --no-install-recommends

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROMIUM_FLAGS="--no-sandbox --disable-dev-shm-usage"
```

### 🟡 ORTA — Auth Stub

**Durum:** Supabase auth entegrasyonu tamamlanmamış. Login/register sayfaları var ama korumalı route'lar tam çalışmıyor.

**Yapılacak:**
- `middleware.ts` → auth kontrolü aktif et
- Supabase session management tamamla
- Protected routes: `/dashboard/*`, `/sunum/*` (kendi sunumu için)

### 🟡 ORTA — CRM/Kanban localStorage Limiti

**Durum:** Veriler localStorage'da, kullanıcı tarayıcıyı temizlerse veri kaybolur.

**Yapılacak:** Auth tamamlandıktan sonra Supabase'e migrate et.

---

## 6. AI ENTEGRASYONLARı

### 6.1 Endpoint Listesi

```
POST /api/ai/generate     → Sunum içeriği üretimi (ana endpoint)
POST /api/ai/analyze      → Mülk analizi ve değerleme
POST /api/ai/audience     → Hedef kitle belirleme
POST /api/ai/content      → Mevcut içerik güncelleme
```

### 6.2 Güvenlik Katmanı

Tüm AI endpoint'leri `withSecurity` middleware ile sarılıdır:
- Rate limiting (per-user, per-IP)
- Budget tracking (AI harcama limiti)
- Input validation
- Error sanitization

```typescript
// Her AI route bu şekilde export edilmeli:
export const POST = withSecurity(handler, {
  rateLimit: { requests: 10, window: '1m' },
  budget: { maxCost: 0.05 }
});
```

### 6.3 Model Hiyerarşisi

```
1. OpenRouter → x-ai/grok-4.1-fast:free  (birincil)
2. Google Gemini                           (fallback)
3. Groq                                    (hız gerektiren işlemler)
```

---

## 7. ŞABLON SİSTEMİ

### 7.1 Şablon Yapısı

Her şablon bileşeni şu interface'i implement etmeli:

```typescript
interface PresentationTemplate {
  id: string;
  name: string;           // Türkçe ad
  theme: ThemeConfig;     // Renkler, fontlar
  sections: Section[];    // Funnel bölümleri
  render: (data: PresentationData) => JSX.Element;
  renderPDF: (data: PresentationData) => JSX.Element; // PDF özel render
}

interface Section {
  id: string;
  type: SectionType;      // hero | stats | features | gallery | cta | map | agent
  pageBreak: boolean;     // PDF'de sayfa kırılımı burada mı?
  minHeight: string;      // A4'te minimum yükseklik
}
```

### 7.2 Mevcut Şablonlar

| Şablon | Tema | Uygun Amaç |
|---|---|---|
| Modern | Koyu, minimal | Satış |
| Kurumsal | Lacivert, profesyonel | Satış + Alım |
| Lüks | Gold, premium | Yüksek değerli mülkler |
| Sıcak&Samimi | Turuncu, davetkar | Portföy almak |
| Minimalist | Beyaz, temiz | Tüm amaçlar |

### 7.3 Yeni Şablon Ekleme

```
1. src/components/templates/[AdTemplate].tsx oluştur
2. Template interface'ini implement et
3. renderPDF() metodunu mutlaka yaz
4. src/components/templates/index.ts'e kayıt et
5. /dashboard/olustur formuna seçenek olarak ekle
```

---

## 8. PDF EXPORT MİMARİSİ (HEDEF DURUM)

### 8.1 Mevcut Sorunlu Akış
```
Kullanıcı → PDF butonu → /api/pdf → Puppeteer(URL'yi aç) → PDF → İndir
                                     ↑ SORUN BURADA
```

### 8.2 Hedef Akış (Düzeltilmiş)

**Seçenek A — Puppeteer Fix (Kısa Vadeli)**
```
Kullanıcı → PDF butonu
  → Frontend: document.body.classList.add('pdf-mode')
  → Animasyonlar durdur, WebGL kapat
  → /api/pdf endpoint çağır
  → Puppeteer: ?mode=pdf param ile sayfayı aç
  → CSS: .pdf-mode bölümlere page-break uygula
  → PDF generate, indir
```

**Seçenek B — React PDF (Uzun Vadeli, Önerilen)**
```
Kullanıcı → PDF butonu
  → /api/pdf/generate → PresentationData al
  → @react-pdf/renderer ile PDF component render et
  → Her Section = <Page> (A4)
  → Stream olarak döndür → indir
```

### 8.3 A4 Sayfa Şeması

```
┌─────────────────────────┐  ← Sayfa 1: Hero / Kapak
│  Logo + Başlık          │  794px × 1123px
│  Ana Görsel             │
│  Mülk Özeti             │
└─────────────────────────┘
┌─────────────────────────┐  ← Sayfa 2: Mülk Detayları
│  Özellikler Tablosu     │
│  İstatistikler          │
└─────────────────────────┘
┌─────────────────────────┐  ← Sayfa 3: Piyasa Analizi
│  Fiyat Karşılaştırması  │  (Kurumsal+Detaylı seçilmişse)
│  Emsal Mülkler          │
└─────────────────────────┘
┌─────────────────────────┐  ← Sayfa 4: Neden Ben?
│  Danışman Profili       │
│  Referanslar            │
└─────────────────────────┘
┌─────────────────────────┐  ← Sayfa 5: CTA
│  İletişim               │
│  QR Kod (opsiyonel)     │
└─────────────────────────┘
```

---

## 9. GÜVENLİK GEREKSİNİMLERİ

### 9.1 API Güvenliği

```typescript
// Tüm AI endpoint'leri zorunlu:
- withSecurity() middleware
- Rate limiting: 10 req/dakika (free), 60 req/dakika (pro)
- Budget cap: $0.05/istek, $5/gün/kullanıcı
- Input sanitization: XSS temizleme
- Output validation: AI çıktısı parse edilmeli, direkt DOM'a yazılmamalı
```

### 9.2 Ortam Değişkenleri (Zorunlu)

```bash
# .env.local — ASLA git'e commit etme
OPENROUTER_API_KEY=
GEMINI_API_KEY=
FAL_KEY=                          # Backend only
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Backend only
NEXT_PUBLIC_APP_URL=
ADMIN_EMAIL=
CRON_SECRET=
PUPPETEER_EXECUTABLE_PATH=        # Docker'da: /usr/bin/chromium
```

### 9.3 Docker/Coolify Güvenliği

```yaml
# docker-compose.yml — production
environment:
  - NODE_ENV=production
  - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
  - PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
security_opt:
  - no-new-privileges:true
read_only: false  # Puppeteer tmp dosyası yazıyor
tmpfs:
  - /tmp
```

---

## 10. DEPLOYMENT (COOLIFY + HETZNER)

### 10.1 Dockerfile Gereksinimleri

```dockerfile
FROM node:20-alpine AS base

# Puppeteer için Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto \
    font-noto-cjk

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Build stage...
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
```

### 10.2 next.config.js (Output Standalone)

```javascript
module.exports = {
  output: 'standalone',  // Docker için zorunlu
  // ...
}
```

### 10.3 Coolify Konfigürasyonu

```
Build Pack: Dockerfile
Port: 3000
Health Check: GET /api/health
Environment Variables: Tüm .env değerleri Coolify dashboard'dan girilmeli
```

---

## 11. KOD KALİTESİ KURALLARI

### 11.1 TypeScript

```typescript
// ✅ Doğru: Tip tanımlamalı
interface PresentationData {
  id: string;
  createdAt: Date;
  // ...
}

// ❌ Yanlış: any kullanma
const data: any = fetchData();
```

### 11.2 Component Yapısı

```
- Her şablon kendi dosyasında
- Props interface'i dosyanın başında
- PDF render methodu ayrı export
- Server/Client component ayrımına dikkat et (Next.js App Router)
```

### 11.3 API Route'ları

```typescript
// Her route:
import { withSecurity } from '@/lib/security/withSecurity';

async function handler(req: Request) {
  // implementation
}

export const POST = withSecurity(handler, config);
```

### 11.4 Error Handling

```typescript
// AI endpoint'lerinde zorunlu:
try {
  const result = await callAI(prompt);
  return Response.json({ success: true, data: result });
} catch (error) {
  console.error('[AI Error]', error);
  return Response.json(
    { success: false, error: 'AI servisi geçici olarak kullanılamıyor' },
    { status: 503 }
  );
}
```

---

## 12. TEST STRATEJİSİ

```
playwright.config.ts mevcut — E2E testler yazılabilir

Öncelikli test senaryoları:
1. Sunum oluşturma akışı (tüm adımlar)
2. PDF export — her şablonda
3. Mobil görünüm — 375px, 768px
4. AI timeout senaryosu
5. Auth flow (tamamlandığında)
```

---

## 13. ROADMAP

### Faz 1 — Kritik Düzeltmeler (ŞUANDA)
- [ ] PDF export düzelt (Puppeteer CSS + page-break)
- [ ] Dockerfile düzelt (Chromium + standalone)
- [ ] Coolify deploy çalıştır

### Faz 2 — Auth & Veri
- [ ] Supabase auth tam entegrasyon
- [ ] CRM/Kanban → Supabase migrate
- [ ] Protected routes

### Faz 3 — Şablon Genişletme
- [ ] Her şablon için ayrı PDF render
- [ ] Yeni 5 şablon (Google AI Studio ile tasarım)
- [ ] Şablon önizleme sistemi

### Faz 4 — Özellikler
- [ ] Chat editör (sunum düzenleme)
- [ ] QR kod ile paylaşım
- [ ] Analitikler (görüntülenme, tıklama)
- [ ] WhatsApp/e-posta paylaşım entegrasyonu

---

## 14. SIKÇA YAPILAN HATALAR — YAPMA

```
❌ FAL_KEY'i frontend'e expose etme
❌ AI endpoint'ini withSecurity olmadan export etme
❌ localStorage'a hassas kullanıcı verisi yazma
❌ PDF render için web DOM animasyonlarını aktif bırakma
❌ Puppeteer'ı root user ile çalıştırma
❌ next.config.js'de output: 'standalone' olmadan Docker build
❌ Supabase service role key'ini client'a gönderme
❌ any tipi kullanma (TypeScript strict mode açık)
```

---

## 15. HIZLI KOMUTLAR

```bash
# Geliştirme
npm run dev                    # localhost:3000

# Build & Test
npm run build
npm start

# Docker local
docker-compose up --build

# Supabase migration
supabase db push

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

*Son Güncelleme: Mart 2026 | Proje: PYRIZE-V1*
