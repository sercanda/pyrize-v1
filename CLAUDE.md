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

## 7. ŞABLON SİSTEMİ (Unified Template Mimarisi)

### 7.1 Genel Mimari

Sistem **5 sunum stili × 3 tema** kombinasyonunu destekler. Her stil farklı funnel yapısına, pazarlama psikolojisine ve stile özel component'lere sahiptir. Temalar görsel katmandır — aynı stil farklı temalarda farklı renk/tipografi kullanır.

**Temel Akış:**
```
Form → sunumStili + tema seçimi → AI prompt (stilGuides + bolgeTalimatlari)
  → funnel-templates.ts (generateBolgeler) → mapSunumData.ts (theme inject)
  → Unified Template (TemplateHizliSatis vb.) → Section Components (theme-aware)
  → Web render + PDF render (.pdf-render-mode + .pdf-theme-light)
```

### 7.2 Temalar (ThemeConfig)

**Dosya:** `src/components/templates/shared/themeConfig.ts`

| Tema | isDark | Arka Plan | Başlıklar | Accent |
|------|--------|-----------|-----------|--------|
| **Modern** | true | slate-950 (koyu) | slate-200 | indigo-400 |
| **Kurumsal** | false | white (açık) | slate-900 | blue-700 |
| **Lüks** | true | stone-950 (koyu) | stone-200 | amber-400 |

`ThemeConfig` interface: `isDark`, `bgPrimary`, `bgSurface`, `bgCard`, `bgOverlay`, `textPrimary`, `textSecondary`, `textAccent`, `accentText`, `accentBg`, `borderColor`, `borderAccent`, `gradientFrom/Via/To`, `selectionBg/Text`

Tüm section component'leri `theme: ThemeConfig` prop alır, hardcoded renkler yerine `theme.bgCard`, `theme.textAccent` vb. kullanır. Koşullu stiller: `theme.isDark ? 'dark-class' : 'light-class'`

### 7.3 Sunum Stilleri & Funnel Yapıları

| Stil | Sayfa | Funnel Yapısı | Özel Component'ler | Pazarlama Psikolojisi |
|------|-------|---------------|--------------------|-----------------------|
| **Detaylı Analiz** | 5 | Hero+Değerleme → Konum → Satış Sistemi → Avantajlar → FAQ+Danışman | — | AIDA + Veri Otoritesi |
| **Hızlı Satış** | 3 | Hero+Urgency+Highlights → Değerleme+Süreç(3) → Danışman+FAQ(3) | `UrgencyBannerSection`, `QuickHighlightsSection` | FOMO + Kayıp Korkusu |
| **Premium** | 5 | Hero → Değerleme+Lifestyle → Konum+Avantaj(3) → ExclusiveOffer+Süreç → Danışman+FAQ | `LifestyleSection`, `ExclusiveOfferSection` | Aspirasyon + Elitizm |
| **Güven Odaklı** | 4 | Hero+Danışman → Testimonial+Avantaj → Süreç+Değerleme → Garanti+FAQ | `TestimonialSection`, `GuaranteeSection` | Güven Piramidi + Risk Tersine Çevirme |
| **Minimalist** | 3 | Hero+CompactSummary → Avantajlar(3) → Danışman | `CompactSummarySection` | Hick's Law + Netlik |

### 7.4 Dosya Yapısı

```
src/components/templates/
├── shared/
│   ├── themeConfig.ts              # ThemeConfig interface + 3 tema tanımı
│   └── mapSunumData.ts             # DB verisi → MappedTemplateData (theme inject)
├── unified/
│   ├── TemplateDetayliAnaliz.tsx    # 5 sayfa, referans template
│   ├── TemplateHizliSatis.tsx       # 3 sayfa, aciliyet odaklı
│   ├── TemplatePremium.tsx          # 5 sayfa, lüks ton
│   ├── TemplateGuvenOdakli.tsx      # 4 sayfa, güven öncelikli
│   └── TemplateMinimalist.tsx       # 3 sayfa, sade
├── portfoy-almak-detayli-analiz-modern-new/components/
│   ├── HeroSection.tsx              # theme-aware
│   ├── RegionalComparisonSection.tsx
│   ├── PropertyFeaturesSection.tsx
│   ├── SalesStrategySection.tsx
│   ├── LocationAdvantagesSection.tsx
│   ├── ConsultantTrustSection.tsx
│   ├── FAQSection.tsx
│   ├── CTASection.tsx
│   ├── UsagePotentialSection.tsx
│   ├── UrgencyBannerSection.tsx     # Hızlı Satış özel
│   ├── QuickHighlightsSection.tsx   # Hızlı Satış özel
│   ├── LifestyleSection.tsx         # Premium özel
│   ├── ExclusiveOfferSection.tsx    # Premium özel
│   ├── TestimonialSection.tsx       # Güven Odaklı özel
│   ├── GuaranteeSection.tsx         # Güven Odaklı özel
│   └── CompactSummarySection.tsx    # Minimalist özel
└── TemplateRenderer.tsx             # Stil → unified template router

src/lib/
├── templates/
│   └── funnel-templates.ts          # 5 template, generateBolgeler (stile özel bolge tipleri)
├── ai/prompts/
│   ├── styleGuides.ts               # Pazarlama psikolojisi + stil/tema kombinasyon rehberleri
│   ├── presentationPrompts.ts       # AI prompt builder + stile özel bolge talimatları
│   ├── purposeGuides.ts             # Amaç bazlı (portföy almak/satmak)
│   └── lengthConfig.ts              # Uzunluk (kısa/orta/uzun)
```

### 7.5 Stile Özel Bolge Tipleri

`BolgeTipi` (types/index.ts) — template'ler tarafından kullanılan bölge tipleri:

| Bolge Tipi | Kullanıldığı Stil | Amaç |
|-----------|-------------------|------|
| `urgency` | Hızlı Satış | FOMO/kıtlık mesajı |
| `quick_highlights` | Hızlı Satış | Tek bakışta avantaj kartları |
| `lifestyle` | Premium | Aspirasyonel yaşam vizyonu |
| `exclusive_offer` | Premium | VIP davet, özel gösterim |
| `testimonials` | Güven Odaklı | Sosyal kanıt, başarı hikayeleri |
| `guarantees` | Güven Odaklı | Sıfır risk garantileri |

### 7.6 PDF Tema Desteği

- Koyu temalar (modern, lüks): `.pdf-render-mode` kuralları uygulanır
- Açık tema (kurumsal): Wrapper'a `pdf-theme-light` class eklenir
- `.pdf-render-mode.pdf-theme-light` kuralları: opacity bg'ler transparan kalır, metin koyu kalır
- CSS: `src/app/sunum/[id]/print/print.css`

### 7.7 Yeni Component Ekleme

```
1. src/components/templates/.../components/[AdSection].tsx oluştur
2. theme: ThemeConfig prop ekle, hardcoded renk KULLANMA
3. İlgili unified template'e import et ve doğru sayfaya yerleştir
4. types/index.ts'te BolgeTipi'ne yeni tip ekle (gerekiyorsa)
5. mapSunumData.ts'te yeni bolge tipini extract et
6. funnel-templates.ts'te ilgili template'in generateBolgeler'ine ekle
7. presentationPrompts.ts'te AI talimatlarına ekle
```

---

## 8. PDF EXPORT MİMARİSİ

### 8.1 Mevcut Çalışan Akış (Gotenberg)
```
Kullanıcı → PDF butonu → /api/pdf → Gotenberg (headless Chromium)
  → /sunum/[id]/print sayfasını render et (emulatedMediaType: 'screen')
  → .pdf-render-mode wrapper → CSS page-break kuralları
  → Koyu tema: standart kurallar | Açık tema: .pdf-theme-light kuralları
  → PDF → İndir
```

### 8.2 PDF Print Route
**Dosya:** `src/app/sunum/[id]/print/page.tsx`
- Server-side Supabase fetch → `TemplateRenderer` render
- `.pdf-render-mode` wrapper (tüm PDF CSS kuralları bu prefix ile)
- Açık temada `.pdf-theme-light` class eklenir

### 8.3 PDF CSS Kuralları
**Dosya:** `src/app/sunum/[id]/print/print.css`
- `@page { size: A4; margin: 0; }` — sayfa boyutu
- `.pdf-render-mode [data-pdf-page]` — sayfa kırılımları (break-after: page)
- `.pdf-render-mode.pdf-theme-light` — açık tema (kurumsal) için özel kurallar
- Animasyonlar, backdrop-blur, opacity bg'ler, letter-spacing düzeltmeleri

### 8.4 Önemli Notlar
- Gotenberg `emulatedMediaType: 'screen'` kullanır → Tailwind `print:` class'ları aktif OLMAZ
- Tüm PDF override'ları `.pdf-render-mode` prefix ile yapılmalı
- `data-pdf-page` attribute'u sayfa kırılımlarını kontrol eder
- Koyu temada opacity bg'ler solid'e çevrilir, açık temada transparan kalır

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

## 16. CRM MODÜLÜ

### 16.1 Supabase Tabloları

| Tablo | Açıklama |
|-------|----------|
| `customers` | Müşteriler (mevcut, genişletildi: type, city, source, user_id) |
| `properties` | Mülkler (satılık/kiralık, müşteriye bağlı) |
| `deals` | Fırsatlar/Pipeline (lead → meeting → offer → contract → closed) |
| `activities` | Aktiviteler (arama, email, görüşme, not, sunum) |
| `todos` | Görevler (müşteri/fırsat/mülk bağlantılı) |
| `presentations` | Sunumlar (mevcut, customer_id ile müşteriye bağlı) |

Migration: `supabase/migrations/003_crm_integration.sql`
Her tablo `user_id` ile kullanıcıya bağlı (RLS aktif).

### 16.2 API Routes

```
GET/POST   /api/crm/customers         → Müşteri listele/oluştur
GET/PUT/DEL /api/crm/customers/[id]   → Müşteri detay/güncelle/sil
GET/POST   /api/crm/properties         → Mülk listele/oluştur
GET/PUT/DEL /api/crm/properties/[id]   → Mülk detay/güncelle/sil
GET/POST   /api/crm/deals              → Fırsat listele/oluştur
GET/PUT/DEL /api/crm/deals/[id]        → Fırsat detay/güncelle/sil
GET/POST   /api/crm/activities          → Aktivite listele/oluştur
GET/POST   /api/crm/todos              → Görev listele/oluştur
GET/PUT/DEL /api/crm/todos/[id]        → Görev detay/güncelle/sil
GET        /api/crm/dashboard           → Dashboard istatistikleri
GET        /api/crm/presentations       → Sunumları listele (customer_id filtreli)
```

### 16.3 Sayfa Yapısı

- **CRM:** `/dashboard/crm` → Tab navigasyonlu tek sayfa
  - Dashboard, Müşteriler, Mülkler, Fırsatlar (Pipeline), Aktiviteler
- **Görevler:** `/dashboard/todo` → Mevcut kanban + CRM bağlantı alanları
- Bileşenler: `src/components/crm-v2/`
- Hooks: `src/hooks/useCRM*.ts`

### 16.4 CRM-Sunum Entegrasyonu

- Sunum oluşturulunca `customers` + `presentations` + `activities` tablosuna yazılır
- `CustomerSlideOver` → "Sunumlar" sekmesinde bağlı sunumlar listelenir
- `integration.ts` → Sunum oluşturulunca aktivite kaydı eklenir

### 16.5 CRM-Todo Entegrasyonu

- Görev eklerken müşteri ve fırsat seçilebilir
- `TaskCard` üzerinde CRM bağlantı badge'leri gösterilir
- CRM müşteri panelinde bağlı görevler listelenir

---

*Son Güncelleme: Mart 2026 | Proje: PYRIZE-V1*
