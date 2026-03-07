# PYRIZE-V1 — Kod Editörü İçin Detaylı Görev Promptu

> Bu dosyayı CLAUDE.md ile birlikte Cursor / Claude Code editörüne ver.
> Editörden bu iki dosyayı okuyup sıralı olarak uygulamasını iste.

---

## BAĞLAM

Sen PYRIZE-V1 adlı bir Next.js 16 + TypeScript + Supabase projesinde çalışıyorsun. Bu, Türk emlak danışmanları için AI destekli profesyonel mülk sunumu (funnel) oluşturan bir SaaS platformudur.

CLAUDE.md dosyasını oku ve projenin tüm yapısını, sorunlarını ve hedeflerini kavra. Ardından aşağıdaki görevleri sırasıyla uygula.

---

## ÖNCELİKLİ SORUNLAR VE ÇÖZÜMLERİ

---

### GÖREV 1 — PDF EXPORT TAMAMEN YENİDEN YAZ

**Sorun:** `/api/pdf/route.ts` Puppeteer ile web DOM'unu alıyor. Funnel bölümleri A4 sayfalarına düzgün bölünmüyor, kaymalar oluyor, animasyonlar PDF'e geçmiyor.

**İstenen Çözüm:**

#### 1A — `@react-pdf/renderer` kütüphanesini entegre et

```bash
npm install @react-pdf/renderer
npm install --save-dev @types/react-pdf
```

#### 1B — Her sunum şablonu için PDF bileşeni oluştur

Dosya: `src/components/pdf/[TemplateName]PDF.tsx`

Her PDF bileşeni şunu yapmalı:
- `@react-pdf/renderer`'dan `Document`, `Page`, `View`, `Text`, `Image` import et
- A4 boyut: `size="A4"` (595 × 842 pt)
- Her funnel bölümü ayrı `<Page>` olacak
- Şablon renklerine uygun stil kullan

```typescript
// Örnek yapı — tüm şablonlar için implement et
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

interface PDFProps {
  data: PresentationData;
  theme: ThemeConfig;
}

export const ModernTemplatePDF = ({ data, theme }: PDFProps) => (
  <Document>
    {/* Sayfa 1: Kapak */}
    <Page size="A4" style={styles.page}>
      <View style={styles.hero}>
        {data.agentLogo && <Image src={data.agentLogo} style={styles.logo} />}
        <Text style={styles.title}>{data.propertyTitle}</Text>
        <Text style={styles.subtitle}>{data.propertyAddress}</Text>
        {data.mainPhoto && <Image src={data.mainPhoto} style={styles.heroImage} />}
      </View>
    </Page>

    {/* Sayfa 2: Mülk Detayları */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mülk Özellikleri</Text>
        {/* Özellikler grid */}
      </View>
    </Page>

    {/* Sayfa 3: Piyasa Analizi — sadece Kurumsal+Detaylı seçilmişse */}
    {data.hasDetailedValuation && (
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Piyasa Analizi</Text>
          {/* Emsal mülkler tablosu */}
        </View>
      </Page>
    )}

    {/* Sayfa 4: Danışman Profili */}
    <Page size="A4" style={styles.page}>
      <View style={styles.agentSection}>
        <Text style={styles.sectionTitle}>Neden {data.agentName}?</Text>
      </View>
    </Page>

    {/* Sayfa 5: İletişim CTA */}
    <Page size="A4" style={styles.page}>
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Hemen İletişime Geçin</Text>
        <Text>{data.agentPhone}</Text>
        <Text>{data.agentEmail}</Text>
      </View>
    </Page>
  </Document>
);
```

#### 1C — PDF API endpoint'ini güncelle

Dosya: `src/app/api/pdf/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { withSecurity } from '@/lib/security/withSecurity';
import { getPDFTemplate } from '@/components/pdf';

async function handler(req: NextRequest) {
  const body = await req.json();
  const { presentationId, templateId } = body;

  // Supabase veya localStorage'dan veriyi çek
  const data = await getPresentationData(presentationId);
  
  // Şablona uygun PDF bileşenini seç
  const PDFComponent = getPDFTemplate(templateId);
  
  // PDF oluştur
  const buffer = await renderToBuffer(<PDFComponent data={data} />);
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="sunum-${presentationId}.pdf"`,
    },
  });
}

export const POST = withSecurity(handler, {
  rateLimit: { requests: 5, window: '1m' }
});
```

#### 1D — Puppeteer'ı kaldır veya sadece fallback olarak tut

Eğer `@react-pdf/renderer` ile tüm şablonlar tamamlanmışsa Puppeteer bağımlılığını `package.json`'dan kaldır. Docker image boyutu önemli ölçüde küçülür.

---

### GÖREV 2 — DOCKERFILE VE COOLIFY DEPLOY DÜZELTMESİ

**Sorun:** Hetzner'a Coolify üzerinden deploy edilemiyor. Chromium binary eksik, standalone output yok, memory limiti sorunları var.

#### 2A — Dockerfile'ı komple yeniden yaz

Dosya: `Dockerfile`

```dockerfile
# Aşama 1: Bağımlılıkları yükle
FROM node:20-alpine AS deps
WORKDIR /app

# Türkçe font desteği ve PDF için gerekli paketler
RUN apk add --no-cache \
    libc6-compat \
    fontconfig \
    font-noto \
    font-noto-extra

COPY package*.json ./
RUN npm ci --only=production

# Aşama 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Aşama 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user güvenlik
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./

# Font dosyaları (Türkçe karakter için)
COPY --from=builder /app/public/fonts ./public/fonts

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**NOT:** `@react-pdf/renderer` kullanıldığında Puppeteer'a gerek kalmaz, Chromium install'u Dockerfile'dan kalkabilir.

#### 2B — next.config.js'e standalone ekle

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Docker için ZORUNLU
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Mevcut konfigürasyonlar...
};

module.exports = nextConfig;
```

#### 2C — Health check endpoint ekle

Dosya: `src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

#### 2D — docker-compose.yml güncelle

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
```

---

### GÖREV 3 — SUNUM ŞABLONLARINI PDF'E UYUMLU HALE GETİR

**Sorun:** 14 şablon var ama hiçbirinde PDF render metodu yok. Web render ile PDF render ayrı olmalı.

#### 3A — Şablon interface'ini güncelle

Dosya: `src/types/templates.ts`

```typescript
export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;         // Önizleme görseli
  theme: ThemeConfig;
  sections: SectionConfig[]; // Funnel bölüm sırası

  // Web render — mevcut component
  WebComponent: React.ComponentType<TemplateProps>;

  // PDF render — YENİ eklenecek
  PDFComponent: React.ComponentType<TemplateProps>; // @react-pdf/renderer
}

export interface SectionConfig {
  id: string;
  type: 'hero' | 'stats' | 'features' | 'gallery' | 'valuation' | 'agent' | 'cta' | 'market';
  title: string;
  required: boolean;
  pdfPageBreak: boolean;     // PDF'de bu bölümden önce sayfa kır
  conditions?: {             // Hangi seçeneklerde gösterilsin
    analysisType?: string[];
    purpose?: string[];
  };
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  fontFamily: string;
  style: 'modern' | 'corporate' | 'luxury' | 'warm' | 'minimal';
}
```

#### 3B — PDF bileşen factory'si oluştur

Dosya: `src/components/pdf/index.ts`

```typescript
import { ModernTemplatePDF } from './ModernTemplatePDF';
import { KurumsalTemplatePDF } from './KurumsalTemplatePDF';
import { LuksTemplatePDF } from './LuksTemplatePDF';
import { SicakSamimiTemplatePDF } from './SicakSamimiTemplatePDF';
import { MinimalistTemplatePDF } from './MinimalistTemplatePDF';

const PDF_TEMPLATES = {
  modern: ModernTemplatePDF,
  kurumsal: KurumsalTemplatePDF,
  luks: LuksTemplatePDF,
  sicak: SicakSamimiTemplatePDF,
  minimalist: MinimalistTemplatePDF,
};

export function getPDFTemplate(templateId: string) {
  return PDF_TEMPLATES[templateId] ?? PDF_TEMPLATES.modern;
}
```

#### 3C — Mevcut her şablon için PDF versiyonu yaz

Her şablon için `src/components/pdf/[Ad]TemplatePDF.tsx` oluştur. Aşağıdaki A4 sayfa planını kullan:

```
Tüm Şablonlar — Zorunlu Sayfalar:
  Sayfa 1: Kapak (logo + ana görsel + mülk başlığı + adres)
  Sayfa 2: Mülk Özellikleri (m², oda, kat, fiyat + özellikler grid)
  Sayfa 3: Fotoğraf Galerisi (en fazla 4 fotoğraf, 2×2 grid)
  Sayfa 4: Danışman Profili (foto, ad, unvan, referanslar, neden ben?)
  Sayfa 5: İletişim CTA (telefon, e-posta, adres, QR opsiyonel)

Kurumsal + Detaylı seçildiğinde EK Sayfalar:
  Sayfa 3A: Piyasa Analizi (endeks verisi, fiyat trendi grafiği)
  Sayfa 3B: Emsal Mülkler Tablosu (adres, m², fiyat, fiyat/m²)
  Sayfa 3C: Değerleme Özeti (hedef fiyat aralığı, öneri)
```

---

### GÖREV 4 — YENİ 5 ŞABLON EKLE (AI STÜDİO KALİTESİNDE)

**Bağlam:** Mevcut şablonlar temel düzeyde. Google AI Studio ile tasarlanmış gibi kaliteli, farklılaşmış şablonlar isteniyor.

Her yeni şablon hem web hem PDF render içermelidir.

#### Eklenecek Şablonlar:

**Şablon 6 — "Prestige" (Ultra Lüks)**
- Koyu lacivert + altın sarısı
- Büyük tam sayfa görseller
- Serif tipografi (Playfair Display)
- Hedef: Villalar, rezidanslar, 10M+ TL mülkler

**Şablon 7 — "Metro" (Modern Şehirci)**
- Siyah + neon turuncu
- Data-heavy layout
- Büyük istatistik sayıları ön planda
- Hedef: İstanbul merkez daireler

**Şablon 8 — "Yatırımcı" (Kurumsal Analitik)**
- Gri + mavi
- Tablolar, grafikler, ROI hesabı ön planda
- Spreadsheet-like düzen
- Hedef: Yatırımcı sunumları, ticari mülkler

**Şablon 9 — "Sıfır Arazi" (Arsa Odaklı)**
- Toprak tonları (kahve, bej, yeşil)
- İmar durumu, parsel bilgisi için özel bölümler
- Harita entegrasyonu (statik)
- Hedef: Arsa portföyleri

**Şablon 10 — "Dijital Native" (Gen-Z / Sosyal)**
- Gradient mor-pembe
- Social proof bölümü (follower sayısı, paylaşım)
- Story format (dikey tasarım da destekler)
- Hedef: Genç alıcılar, küçük daireler

Her şablon için:
```typescript
// src/components/templates/[Ad]Template.tsx — Web
// src/components/pdf/[Ad]TemplatePDF.tsx — PDF
// src/templates/index.ts — Kayıt
```

---

### GÖREV 5 — AI İÇERİK ÜRETIMINI ŞABLONA GÖRE ÖZELLEŞTIR

**Sorun:** Şu an tek bir AI prompt her şablon için aynı içeriği üretiyor. Her şablon ve amaç kombinasyonu için özel prompt kullanılmalı.

#### 5A — Prompt factory oluştur

Dosya: `src/lib/ai/prompts/presentationPrompts.ts`

```typescript
interface PromptContext {
  purpose: 'buy' | 'sell';      // Portföy almak | satmak
  templateId: string;
  analysisType: 'general' | 'corporate' | 'detailed';
  propertyType: string;
  length: 'short' | 'medium' | 'long';
}

export function buildPresentationPrompt(
  data: PresentationData,
  context: PromptContext
): string {
  const basePrompt = `
Sen profesyonel bir Türk emlak danışmanısın.
Aşağıdaki mülk için ${context.purpose === 'buy' ? 'mülk sahibini ikna etmek' : 'potansiyel alıcıları ikna etmek'} amacıyla
${context.length === 'short' ? '3' : context.length === 'medium' ? '5' : '7'} bölümlük profesyonel bir sunum hazırla.

MÜLK BİLGİLERİ:
- Tip: ${data.propertyType}
- Adres: ${data.address}
- Alan: ${data.area} m²
- Fiyat: ${data.price} TL
- Özellikler: ${data.features.join(', ')}

DANIŞMAN: ${data.agentName} / ${data.agentCompany}

SUNUM TARZI: ${getStyleGuide(context.templateId)}

${context.analysisType === 'detailed' ? getDetailedValuationSection(data) : ''}

Her bölüm için şu formatta JSON döndür:
{
  "sections": [
    {
      "id": "hero",
      "headline": "...",     // Güçlü başlık
      "subheadline": "...", // Alt başlık
      "body": "...",        // Ana metin (${getLengthGuide(context.length)})
      "cta": "..."          // Eylem çağrısı (sadece son bölümde)
    }
  ]
}
  `;

  return basePrompt;
}

function getStyleGuide(templateId: string): string {
  const guides = {
    luks: 'Ağdalı, prestijli, duygusal. "Hayalinizdeki yaşam" vurgusu.',
    kurumsal: 'Profesyonel, veri odaklı, güven inşa eden. Rakamlar ve kanıtlar ön planda.',
    modern: 'Dinamik, kısa cümleler, aksiyon odaklı. Teknik özellikler net.',
    sicak: 'Samimi, ev sıcaklığı, komşuluk vurgusu. Duygusal bağ kur.',
    minimalist: 'Sade, özlü, gereksiz söz yok. Her kelime değer taşımalı.',
    prestige: 'Elit, benzersiz, ayrıcalık vurgusu. Sınırlı erişim hissi ver.',
    metro: 'Kentsel, modern, yatırım değeri ön planda. Konum avantajları.',
    yatirimci: 'Analitik, ROI odaklı, kısa vadeli getiri hesapları.',
    arazi: 'İmar bilgisi, parsel detayları, gelecek potansiyeli vurgusu.',
    dijital: 'Enerjik, emoji kullanabilirsin, trend referansları.',
  };
  return guides[templateId] ?? guides.modern;
}
```

#### 5B — AI endpoint'ini güncelle

`/api/ai/generate/route.ts` içinde:
- `buildPresentationPrompt()` kullan
- Şablon bilgisini request body'den al
- Dönen JSON'ı validate et

---

### GÖREV 6 — AUTH ENTEGRASYONU TAMAMLA

**Sorun:** Supabase auth stub durumda. Korumalı route'lar çalışmıyor.

#### 6A — Supabase Auth helper'ı oluştur

Dosya: `src/lib/supabase/auth.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Client component için
export const createClient = () => createClientComponentClient();

// Server component için
export const createServerClient = () =>
  createServerComponentClient({ cookies });
```

#### 6B — middleware.ts'i aktif et

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Korumalı route'lar
  const protectedPaths = ['/dashboard', '/sunum'];
  const isProtected = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/sunum/:path*'],
};
```

---

### GÖREV 7 — GÜVENLİK HARDENING

#### 7A — Rate limiter'ı güçlendir

`src/lib/security/rateLimiter.ts`:

```typescript
// Plan bazlı rate limiting
const LIMITS = {
  anonymous: { requests: 3, window: '1h' },
  free: { requests: 10, window: '1d' },
  pro: { requests: 100, window: '1d' },
  enterprise: { requests: 1000, window: '1d' },
};
```

#### 7B — Input sanitization ekle

Her AI endpoint'ine girdi temizleme ekle:

```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string' ? DOMPurify.sanitize(value) : value,
    ])
  );
}
```

#### 7C — API key exposure kontrolü

`.env.example` dosyasında tüm key'lerin backend-only olanlarını işaretle:

```bash
# ⚠️ BACKEND ONLY — NEXT_PUBLIC_ prefix'i ASLA ekleme
OPENROUTER_API_KEY=
FAL_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=

# ✅ Frontend'e güvenli
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## UYGULAMA SIRASI

Aşağıdaki sırayla uygula — her görev tamamlandıktan sonra build al ve test et:

```
[1] Görev 2 — Dockerfile + next.config.js (deploy önce çalışmalı)
[2] Görev 1 — PDF export (@react-pdf/renderer ile)
[3] Görev 3 — Mevcut şablonlara PDF render ekle
[4] Görev 5 — AI prompt factory
[5] Görev 6 — Auth entegrasyonu
[6] Görev 7 — Güvenlik
[7] Görev 4 — Yeni şablonlar (diğerleri stable olduktan sonra)
```

---

## TEST SENARYOLARI

Her görev sonrası şu testleri çalıştır:

```bash
# 1. Build başarılı mı?
npm run build

# 2. Type hatası var mı?
npx tsc --noEmit

# 3. Lint temiz mi?
npm run lint

# 4. Docker build?
docker build -t pyrize-test .
docker run -p 3000:3000 pyrize-test

# 5. Health check?
curl http://localhost:3000/api/health

# 6. PDF endpoint?
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -d '{"presentationId":"test-1","templateId":"modern"}'
```

---

## BAŞARILI ÇIKTI KRİTERLERİ

### PDF Export
- [ ] Her funnel adımı ayrı A4 sayfasında
- [ ] Sayfa kayması yok
- [ ] Türkçe karakterler doğru (İ, Ö, Ü, Ş, Ç, Ğ)
- [ ] Logo ve görseller doğru konumda
- [ ] 5 sayfayı geçmeyen standart sunum
- [ ] Kurumsal+Detaylı seçilince 8 sayfa olabilir
- [ ] Dosya boyutu < 5 MB

### Deploy (Coolify/Hetzner)
- [ ] `docker build` hatasız tamamlanıyor
- [ ] Container başlıyor ve health check geçiyor
- [ ] Environment variable'lar Coolify'dan okunuyor
- [ ] `https://your-domain.com` erişilebilir
- [ ] SSL sertifikası çalışıyor

### Genel
- [ ] Tüm 5 tema seçeneği PDF'e dönüştürülebiliyor
- [ ] AI içerik üretimi < 15 saniye
- [ ] Mobil görünüm bozulmuyor
- [ ] Rate limiting çalışıyor

---

*Bu prompt, CLAUDE.md ile birlikte kullanılmalıdır.*
*PYRIZE-V1 — Mart 2026*
