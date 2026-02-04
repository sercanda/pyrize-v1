<<<<<<< HEAD
# Cursor Prompt: 5 Farklı Funnel Şablonu Oluşturma

## 🎯 GÖREV

Mevcut emlak sunum uygulamasına **5 görsel olarak farklı funnel şablonu** ekle. Her şablon aynı veri yapısını kullanacak ama görsel tasarımı tamamen farklı olacak. İçerikler AI (Gemini) ile dinamik olarak üretilecek ve düzenlenebilir olacak.

---

## 📋 MEVCUT DURUM

- **Proje:** Next.js 16 + TypeScript + TailwindCSS
- **Dosya Yapısı:** `src/lib/templates/funnel-templates.ts` - Şablon verileri var
- **Sunum Sayfası:** `src/app/sunum/[id]/page.tsx` - Şu an tek bir tasarım gösteriyor
- **AI Entegrasyonu:** `src/lib/ai/gemini-service.ts` - Gemini API entegre
- **Marka Renkleri:** `#57B6B2` (turkuaz), `#223BA1` (koyu mavi)

**Sorun:** 5 şablon var ama hepsi aynı görünüyor. Her şablonun kendine özgü CSS/Tailwind stilleri olmalı.

---

## ✅ YAPILMASI GEREKENLER

### 1. ŞABLON COMPONENT'LERİ OLUŞTUR

Her şablon için ayrı React component oluştur:

```
src/components/templates/
├── Template1DetailedAnalysis.tsx    # Referans: bedirhanhaci-arsa-sunum.vercel.app
├── Template2QuickSale.tsx
├── Template3Premium.tsx
├── Template4Trust.tsx
└── Template5Minimalist.tsx
```

**Her component:**
- `SunumData` prop'u alır
- Kendi özel Tailwind CSS sınıflarını kullanır
- Responsive olmalı (mobil + desktop)
- Aynı veri yapısını farklı şekilde render eder

---

### 2. ŞABLON TASARIM FARKLILIKLARI

#### **Template 1: Detaylı Analiz** (`detailed_analysis`)
**Referans:** `https://bedirhanhaci-arsa-sunum.vercel.app/`

**Tasarım Özellikleri:**
- Hero: Büyük başlık, gradient overlay (siyah → kırmızı → mavi), arka plan resmi
- Problem Kartları: Kırmızı gradient arka plan (#DC2626 → #991B1B), beyaz text, hover'da yukarı kalkma
- Çözüm Kartları: Yeşil gradient (#ECFDF5 → #D1FAE5), beyaz arka plan, yeşil border
- Timeline: Mavi-kırmızı gradient arka plan, numaralı circle'lar, timeline çizgisi
- Lokasyon Analizi: Gri arka plan, mavi accent, investment box mavi gradient
- Renkler: Kırmızı (#E31E24), Mavi (#1B3B6F), Yeşil (#10B981)
- Font: Poppins (bold başlıklar), Inter (gövde)

**Bölümler:**
1. Hero (gizli banner + büyük başlık)
2. 5 Problem Kartı (kırmızı)
3. 3 Çözüm Kartı (yeşil/beyaz)
4. Danışman Hakkında (istatistikler grid)
5. 6 Adım Timeline
6. Lokasyon Analizi
7. Hedef Kitle (persona kartları)
8. Pazarlama Stratejisi
9. FAQ (accordion)
10. Testimonial Kartları
11. Garantiler
12. Final CTA (gradient butonlar)

---

#### **Template 2: Hızlı Satış** (`quick_sale`)

**Tasarım Özellikleri:**
- Hero: Yeşil arka plan, büyük "HIZLI SATIŞ" başlığı, fiyat vurgusu
- Kartlar: Minimal, büyük iconlar, yeşil accent
- CTA: Çok büyük butonlar, WhatsApp öncelikli
- Renkler: Yeşil (#10B981), Koyu Yeşil (#047857), Sarı accent (#FCD34D)
- Tipografi: Büyük fontlar, bold, az text

**Bölümler:**
1. Hero (yeşil, fiyat vurgusu)
2. 3 Ana Avantaj (büyük kartlar)
3. Fiyat Detayı (büyük font)
4. Hızlı İletişim (2 büyük CTA butonu)

---

#### **Template 3: Premium** (`premium`)

**Tasarım Özellikleri:**
- Hero: Siyah arka plan, altın text, büyük görseller
- Kartlar: Minimal, çok beyaz alan, altın border
- Tipografi: Serif font (Playfair Display gibi), büyük başlıklar
- Renkler: Siyah (#1F2937), Altın (#D4AF37), Beyaz
- Genel: Lüks hissi, prestij vurgusu, az renk

**Bölümler:**
1. Hero (siyah, altın accent)
2. Özellikler (grid, minimal kartlar)
3. Lokasyon (büyük görsel)
4. Eksklüzif Görüşme (altın buton)

---

#### **Template 4: Güven Odaklı** (`trust`)

**Tasarım Özellikleri:**
- Hero: Mavi gradient, güven rozetleri
- Kartlar: Açık mavi arka plan, beyaz kartlar, mavi border
- Testimonial: Çok testimonial kartı (5+ tane)
- Garantiler: Mavi box'lar, check iconlar
- Renkler: Mavi (#3B82F6), Koyu Mavi (#1E40AF), Açık Mavi (#60A5FA)
- Tipografi: Açık, okunabilir, güven verici

**Bölümler:**
1. Hero (mavi, güven rozetleri)
2. Şeffaf Süreç (timeline, mavi)
3. 5+ Testimonial (grid)
4. Garantiler (mavi box'lar)
5. Detaylı FAQ
6. İletişim

---

#### **Template 5: Minimalist** (`minimalist`)

**Tasarım Özellikleri:**
- Hero: Beyaz arka plan, siyah text, çok beyaz alan
- Kartlar: İnce border, minimal gölge, sade
- Tipografi: Modern sans-serif, büyük point sizes
- Renkler: Siyah, Beyaz, Tek accent renk (#57B6B2)
- Genel: Çok beyaz alan, öz bilgi, grid layout

**Bölümler:**
1. Hero (beyaz, siyah text)
2. 3 Key Point (minimal kartlar)
3. Detaylar (grid)
4. İletişim (sade buton)

---

### 3. TEMPLATE RENDERER OLUŞTUR

**Dosya:** `src/components/templates/TemplateRenderer.tsx`

```typescript
'use client';

import { SunumData } from '@/types';
import Template1DetailedAnalysis from './Template1DetailedAnalysis';
import Template2QuickSale from './Template2QuickSale';
import Template3Premium from './Template3Premium';
import Template4Trust from './Template4Trust';
import Template5Minimalist from './Template5Minimalist';

interface Props {
  data: SunumData;
}

export default function TemplateRenderer({ data }: Props) {
  const templateId = data.istek?.template || 'detailed_analysis';

  switch (templateId) {
    case 'detayli_analiz':
    case 'detailed_analysis':
      return <Template1DetailedAnalysis data={data} />;
    
    case 'hizli_satis':
    case 'quick_sale':
      return <Template2QuickSale data={data} />;
    
    case 'premium_sunum':
    case 'premium':
      return <Template3Premium data={data} />;
    
    case 'guven_odakli':
    case 'trust':
      return <Template4Trust data={data} />;
    
    case 'minimalist':
      return <Template5Minimalist data={data} />;
    
    default:
      return <Template1DetailedAnalysis data={data} />;
  }
}
```

---

### 4. SUNUM SAYFASINI GÜNCELLE

**Dosya:** `src/app/sunum/[id]/page.tsx`

**Değişiklikler:**
1. Tüm render mantığını kaldır
2. `TemplateRenderer` component'ini kullan
3. `sunumData`'yı prop olarak geç

```typescript
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export default function SunumPage() {
  // ... mevcut kod ...
  
  if (pageLoading || !sunumData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        {/* ... mevcut header kodu ... */}
      </div>

      {/* Template Renderer */}
      <TemplateRenderer data={sunumData} />
    </div>
  );
}
```

---

### 5. ŞABLON ÖNİZLEME SİSTEMİ

**Form'da şablon seçerken thumbnail göster:**

**Dosya:** `src/app/dashboard/olustur/page.tsx`

Şu bölümü güncelle:

```typescript
const TEMPLATES = [
  {
    value: "detayli_analiz",
    label: "Detaylı Analiz",
    desc: "Kapsamlı analiz, 6 adım sistem, tüm detaylar",
    thumbnail: "/templates/detailed-analysis-preview.png", // Ekle
    previewUrl: "/preview/detailed_analysis" // Ekle
  },
  // ... diğerleri
];

// Template seçiminde thumbnail göster
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {TEMPLATES.map(template => (
    <div
      key={template.value}
      onClick={() => setSecenekler({ ...secenekler, template: template.value })}
      className={`
        relative cursor-pointer border-2 rounded-xl overflow-hidden
        transition-all hover:scale-105
        ${secenekler.template === template.value 
          ? 'border-[#57B6B2] ring-4 ring-[#57B6B2]/20' 
          : 'border-gray-300'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 relative">
        <Image
          src={template.thumbnail || '/placeholder.png'}
          alt={template.label}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{template.label}</h3>
        <p className="text-sm text-gray-600">{template.desc}</p>
        
        {/* Preview Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(template.previewUrl, '_blank');
          }}
          className="mt-2 text-[#57B6B2] text-sm font-semibold"
        >
          👁️ Önizle
        </button>
      </div>
    </div>
  ))}
</div>
```

---

### 6. MOBİL/DESKTOP UYUM SEÇENEĞİ

**Form'a ekle:**

```typescript
const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');

// Template seçiminden sonra ekle:
<div className="mb-6">
  <label className="block text-sm font-medium mb-2">
    Görünüm
  </label>
  <div className="flex gap-4">
    <button
      onClick={() => setDeviceView('desktop')}
      className={`px-4 py-2 rounded-lg ${
        deviceView === 'desktop' 
          ? 'bg-[#57B6B2] text-white' 
          : 'bg-gray-200'
      }`}
    >
      💻 Masaüstü
    </button>
    <button
      onClick={() => setDeviceView('mobile')}
      className={`px-4 py-2 rounded-lg ${
        deviceView === 'mobile' 
          ? 'bg-[#57B6B2] text-white' 
          : 'bg-gray-200'
      }`}
    >
      📱 Mobil
    </button>
  </div>
</div>
```

**Template component'lerinde responsive sınıflar kullan:**

```typescript
// Her şablon zaten responsive olmalı
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Kartlar */}
</div>
```

---

### 7. AI İÇERİK ÜRETİMİNİ İYİLEŞTİR

**Dosya:** `src/lib/ai/gemini-service.ts`

**`buildEnhancementPrompt` fonksiyonunu güncelle:**

```typescript
function buildEnhancementPrompt(istek: SunumOlusturmaIstegi, templateSunum: SunumIcerik): string {
  const { mulk, tema, amac, danisman } = istek;
  const templateId = istek.template || 'detayli_analiz';

  return `
Sen profesyonel bir emlak sunum yazarlısın. Verilen template yapısını koruyarak içeriği ${mulk.konum} bölgesindeki ${mulk.tur} için özelleştiriyorsun.

━━━━━━━━━━━━━━━━━━━━━━━━━
GAYRİMENKUL DETAYLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━
📍 MÜLK TÜRÜ: ${mulk.tur}
📍 KONUM: ${mulk.konum}
💰 FİYAT: ${mulk.fiyat.toLocaleString('tr-TR')} TL
${mulk.metrekare ? `📏 METREKARE: ${mulk.metrekare} m²` : ''}
${mulk.odaSayisi ? `🚪 ODA SAYISI: ${mulk.odaSayisi}` : ''}
${mulk.kat ? `🏢 KAT: ${mulk.kat}` : ''}
${mulk.yas ? `📅 BİNA YAŞI: ${mulk.yas}` : ''}
${mulk.krediyeUygun ? '✅ KREDİYE UYGUN' : ''}
${mulk.cevreOzellikleri && mulk.cevreOzellikleri.length > 0 
  ? `🌐 ÇEVRE: ${mulk.cevreOzellikleri.join(', ')}` 
  : ''}
${mulk.avantajlar && mulk.avantajlar.length > 0 
  ? `⭐ AVANTAJLAR: ${mulk.avantajlar.join(', ')}` 
  : ''}
${mulk.aciklama ? `📝 AÇIKLAMA: ${mulk.aciklama}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
DANIŞMAN BİLGİLERİ:
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 DANIŞMAN: ${danisman.adSoyad}
📞 TELEFON: ${danisman.telefon}
📧 EMAIL: ${danisman.email}
${danisman.deneyim ? `💼 DENEYİM: ${danisman.deneyim} yıl` : ''}
${danisman.referans ? `🏆 REFERANS: ${danisman.referans}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
ŞABLON: ${templateId}
━━━━━━━━━━━━━━━━━━━━━━━━━
${templateId === 'detayli_analiz' ? `
Bu şablon DETAYLI ANALİZ için:
- 5 problem kartı (kırmızı tonlar, zarar vurgusu)
- 3 çözüm kartı (yeşil/beyaz, fayda vurgusu)
- 6 adım timeline (süreç)
- Lokasyon analizi (${mulk.konum} özel)
- Hedef kitle segmentasyonu
- Pazarlama stratejisi
` : ''}

${templateId === 'hizli_satis' ? `
Bu şablon HIZLI SATIŞ için:
- Kısa, etkili içerik
- Fiyat vurgusu
- Büyük CTA butonları
- Minimal text
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
GÖREV:
━━━━━━━━━━━━━━━━━━━━━━━━━
1. Template yapısını KORU (bolge tipleri, altBolge yapıları aynı kalacak)
2. Sadece baslik ve icerik alanlarını GÜNCELLE
3. ${mulk.konum} için gerçekçi lokasyon bilgileri kullan
4. ${mulk.fiyat.toLocaleString('tr-TR')} TL fiyatına göre yatırım analizi yap
5. ${mulk.tur} için özel avantajları vurgula
6. ${tema} temasına uygun dil tonu kullan
7. ${amac === 'portfoy_almak' ? 'Satıcıya güven ver' : 'Alıcıyı ikna et'}

━━━━━━━━━━━━━━━━━━━━━━━━━
ÇIKTI FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━
Aynı JSON yapısını koru. Sadece içerikleri zenginleştir.

\`\`\`json
{
  "bolgeler": [
    {
      "tip": "problemler",
      "baslik": "...",
      "icerik": "...",
      "altBolge": [
        {
          "baslik": "...",
          "icerik": "...",
          "tip": "text"
        }
      ]
    }
  ]
}
\`\`\`
`;
}
```

---

### 8. HER ŞABLON İÇİN ÖRNEK COMPONENT

**Template 1 Örneği (Detaylı Analiz):**

```typescript
'use client';

import { SunumData } from '@/types';
import Image from 'next/image';

interface Props {
  data: SunumData;
}

export default function Template1DetailedAnalysis({ data }: Props) {
  const { icerik, istek } = data;
  const { mulk, danisman } = istek;

  const heroBolge = icerik.bolgeler?.find((b: any) => b.tip === 'hero');
  const problemBolge = icerik.bolgeler?.find((b: any) => b.tip === 'problemler');
  const cozumBolge = icerik.bolgeler?.find((b: any) => b.tip === 'cozum');

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Referans tasarım */}
      {heroBolge && (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          {mulk.fotograflar && mulk.fotograflar[0] && (
            <Image
              src={mulk.fotograflar[0]}
              alt="Hero"
              fill
              className="object-cover z-0"
              priority
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent z-10" />
          
          {/* Top Banner */}
          <div className="absolute top-0 left-0 right-0 bg-black/50 p-2 text-xs text-white text-center tracking-widest z-20">
            🔒 Gizli • Sadece Sizin İçin • {mulk.konum}
          </div>

          {/* Content */}
          <div className="relative z-30 text-center max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white mb-6 leading-tight drop-shadow-2xl">
              {heroBolge.baslik || `Arsanızın Gerçek Değerini Biliyor musunuz?`}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {heroBolge.heroAciklama || icerik.heroAciklama}
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 text-white font-semibold">
              Ücretsiz Analiz • Sıfır Risk • %100 Garantili
            </div>
          </div>
        </section>
      )}

      {/* PROBLEM SECTION - Kırmızı Kartlar */}
      {problemBolge && problemBolge.altBolge && (
        <section className="bg-gray-900 py-16 md:py-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12">
            {problemBolge.baslik || 'Mülkünüzü Satarken Karşılaşacağınız 5 Büyük Sorun'}
          </h2>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemBolge.altBolge.map((problem: any, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white border-2 border-red-500/20 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-xl font-bold mb-3">
                  {idx + 1}. {problem.baslik}
                </h3>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {problem.icerik}
                </p>
                {problem.kayip && (
                  <div className="bg-black/30 rounded-lg p-3 text-sm font-semibold">
                    Kayıp: {problem.kayip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SOLUTION SECTION - Yeşil/Beyaz Kartlar */}
      {cozumBolge && cozumBolge.altBolge && (
        <section className="bg-white py-16 md:py-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            {cozumBolge.baslik || 'Peki Ya Bu Sorunların Hiçbiri Olmasaydı?'}
          </h2>
          <p className="text-center text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {cozumBolge.icerik || 'Size özel hazırladığım profesyonel satış sistemi ile...'}
          </p>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {cozumBolge.altBolge.map((solution: any, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-500 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">
                  {solution.baslik}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {solution.icerik}
                </p>
                {solution.fayda && (
                  <div className="bg-green-500 text-white rounded-lg p-3 text-sm font-semibold">
                    💰 {solution.fayda}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Diğer bölümler... */}
      {/* Timeline, Lokasyon, vb. */}
    </div>
  );
}
```

---

## 📝 ADIM ADIM UYGULAMA

1. **`src/components/templates/` klasörünü oluştur**
2. **5 template component dosyasını oluştur**
3. **`TemplateRenderer.tsx` oluştur**
4. **`src/app/sunum/[id]/page.tsx`'i güncelle** (TemplateRenderer kullan)
5. **Her template için özel Tailwind stillerini yaz**
6. **Form'da template seçimini iyileştir** (thumbnail + önizleme)
7. **AI prompt'unu şablon bazlı yap**

---

## 🎨 RENK ŞEMALARI ÖZET

| Şablon | Primary | Secondary | Accent |
|--------|---------|-----------|--------|
| Detaylı Analiz | #E31E24 (Kırmızı) | #1B3B6F (Mavi) | #FFB81C (Sarı) |
| Hızlı Satış | #10B981 (Yeşil) | #047857 (Koyu Yeşil) | #FCD34D (Sarı) |
| Premium | #1F2937 (Siyah) | #D4AF37 (Altın) | #FFFFFF (Beyaz) |
| Güven | #3B82F6 (Mavi) | #1E40AF (Koyu Mavi) | #60A5FA (Açık Mavi) |
| Minimalist | #000000 (Siyah) | #FFFFFF (Beyaz) | #57B6B2 (Turkuaz) |

---

## ✅ KONTROL LİSTESİ

- [ ] 5 template component oluşturuldu
- [ ] Her template farklı görsel tasarıma sahip
- [ ] TemplateRenderer çalışıyor
- [ ] Sunum sayfası TemplateRenderer kullanıyor
- [ ] Responsive tasarım (mobil + desktop)
- [ ] AI içerik üretimi şablon bazlı
- [ ] Form'da template seçimi + önizleme var
- [ ] Her şablon kendi renk şemasına sahip
- [ ] Referans tasarım (bedirhanhaci) uygulandı

---

## 🚀 BAŞLAMAK İÇİN

Cursor'a şunu söyle:

"Bu prompt'u oku ve 5 farklı funnel şablonu oluştur. Her şablon için ayrı component yaz. TemplateRenderer ile seçimi yap. Sunum sayfasını güncelle."
=======
# Cursor Prompt: 5 Farklı Funnel Şablonu Oluşturma

## 🎯 GÖREV

Mevcut emlak sunum uygulamasına **5 görsel olarak farklı funnel şablonu** ekle. Her şablon aynı veri yapısını kullanacak ama görsel tasarımı tamamen farklı olacak. İçerikler AI (Gemini) ile dinamik olarak üretilecek ve düzenlenebilir olacak.

---

## 📋 MEVCUT DURUM

- **Proje:** Next.js 16 + TypeScript + TailwindCSS
- **Dosya Yapısı:** `src/lib/templates/funnel-templates.ts` - Şablon verileri var
- **Sunum Sayfası:** `src/app/sunum/[id]/page.tsx` - Şu an tek bir tasarım gösteriyor
- **AI Entegrasyonu:** `src/lib/ai/gemini-service.ts` - Gemini API entegre
- **Marka Renkleri:** `#57B6B2` (turkuaz), `#223BA1` (koyu mavi)

**Sorun:** 5 şablon var ama hepsi aynı görünüyor. Her şablonun kendine özgü CSS/Tailwind stilleri olmalı.

---

## ✅ YAPILMASI GEREKENLER

### 1. ŞABLON COMPONENT'LERİ OLUŞTUR

Her şablon için ayrı React component oluştur:

```
src/components/templates/
├── Template1DetailedAnalysis.tsx    # Referans: bedirhanhaci-arsa-sunum.vercel.app
├── Template2QuickSale.tsx
├── Template3Premium.tsx
├── Template4Trust.tsx
└── Template5Minimalist.tsx
```

**Her component:**
- `SunumData` prop'u alır
- Kendi özel Tailwind CSS sınıflarını kullanır
- Responsive olmalı (mobil + desktop)
- Aynı veri yapısını farklı şekilde render eder

---

### 2. ŞABLON TASARIM FARKLILIKLARI

#### **Template 1: Detaylı Analiz** (`detailed_analysis`)
**Referans:** `https://bedirhanhaci-arsa-sunum.vercel.app/`

**Tasarım Özellikleri:**
- Hero: Büyük başlık, gradient overlay (siyah → kırmızı → mavi), arka plan resmi
- Problem Kartları: Kırmızı gradient arka plan (#DC2626 → #991B1B), beyaz text, hover'da yukarı kalkma
- Çözüm Kartları: Yeşil gradient (#ECFDF5 → #D1FAE5), beyaz arka plan, yeşil border
- Timeline: Mavi-kırmızı gradient arka plan, numaralı circle'lar, timeline çizgisi
- Lokasyon Analizi: Gri arka plan, mavi accent, investment box mavi gradient
- Renkler: Kırmızı (#E31E24), Mavi (#1B3B6F), Yeşil (#10B981)
- Font: Poppins (bold başlıklar), Inter (gövde)

**Bölümler:**
1. Hero (gizli banner + büyük başlık)
2. 5 Problem Kartı (kırmızı)
3. 3 Çözüm Kartı (yeşil/beyaz)
4. Danışman Hakkında (istatistikler grid)
5. 6 Adım Timeline
6. Lokasyon Analizi
7. Hedef Kitle (persona kartları)
8. Pazarlama Stratejisi
9. FAQ (accordion)
10. Testimonial Kartları
11. Garantiler
12. Final CTA (gradient butonlar)

---

#### **Template 2: Hızlı Satış** (`quick_sale`)

**Tasarım Özellikleri:**
- Hero: Yeşil arka plan, büyük "HIZLI SATIŞ" başlığı, fiyat vurgusu
- Kartlar: Minimal, büyük iconlar, yeşil accent
- CTA: Çok büyük butonlar, WhatsApp öncelikli
- Renkler: Yeşil (#10B981), Koyu Yeşil (#047857), Sarı accent (#FCD34D)
- Tipografi: Büyük fontlar, bold, az text

**Bölümler:**
1. Hero (yeşil, fiyat vurgusu)
2. 3 Ana Avantaj (büyük kartlar)
3. Fiyat Detayı (büyük font)
4. Hızlı İletişim (2 büyük CTA butonu)

---

#### **Template 3: Premium** (`premium`)

**Tasarım Özellikleri:**
- Hero: Siyah arka plan, altın text, büyük görseller
- Kartlar: Minimal, çok beyaz alan, altın border
- Tipografi: Serif font (Playfair Display gibi), büyük başlıklar
- Renkler: Siyah (#1F2937), Altın (#D4AF37), Beyaz
- Genel: Lüks hissi, prestij vurgusu, az renk

**Bölümler:**
1. Hero (siyah, altın accent)
2. Özellikler (grid, minimal kartlar)
3. Lokasyon (büyük görsel)
4. Eksklüzif Görüşme (altın buton)

---

#### **Template 4: Güven Odaklı** (`trust`)

**Tasarım Özellikleri:**
- Hero: Mavi gradient, güven rozetleri
- Kartlar: Açık mavi arka plan, beyaz kartlar, mavi border
- Testimonial: Çok testimonial kartı (5+ tane)
- Garantiler: Mavi box'lar, check iconlar
- Renkler: Mavi (#3B82F6), Koyu Mavi (#1E40AF), Açık Mavi (#60A5FA)
- Tipografi: Açık, okunabilir, güven verici

**Bölümler:**
1. Hero (mavi, güven rozetleri)
2. Şeffaf Süreç (timeline, mavi)
3. 5+ Testimonial (grid)
4. Garantiler (mavi box'lar)
5. Detaylı FAQ
6. İletişim

---

#### **Template 5: Minimalist** (`minimalist`)

**Tasarım Özellikleri:**
- Hero: Beyaz arka plan, siyah text, çok beyaz alan
- Kartlar: İnce border, minimal gölge, sade
- Tipografi: Modern sans-serif, büyük point sizes
- Renkler: Siyah, Beyaz, Tek accent renk (#57B6B2)
- Genel: Çok beyaz alan, öz bilgi, grid layout

**Bölümler:**
1. Hero (beyaz, siyah text)
2. 3 Key Point (minimal kartlar)
3. Detaylar (grid)
4. İletişim (sade buton)

---

### 3. TEMPLATE RENDERER OLUŞTUR

**Dosya:** `src/components/templates/TemplateRenderer.tsx`

```typescript
'use client';

import { SunumData } from '@/types';
import Template1DetailedAnalysis from './Template1DetailedAnalysis';
import Template2QuickSale from './Template2QuickSale';
import Template3Premium from './Template3Premium';
import Template4Trust from './Template4Trust';
import Template5Minimalist from './Template5Minimalist';

interface Props {
  data: SunumData;
}

export default function TemplateRenderer({ data }: Props) {
  const templateId = data.istek?.template || 'detailed_analysis';

  switch (templateId) {
    case 'detayli_analiz':
    case 'detailed_analysis':
      return <Template1DetailedAnalysis data={data} />;
    
    case 'hizli_satis':
    case 'quick_sale':
      return <Template2QuickSale data={data} />;
    
    case 'premium_sunum':
    case 'premium':
      return <Template3Premium data={data} />;
    
    case 'guven_odakli':
    case 'trust':
      return <Template4Trust data={data} />;
    
    case 'minimalist':
      return <Template5Minimalist data={data} />;
    
    default:
      return <Template1DetailedAnalysis data={data} />;
  }
}
```

---

### 4. SUNUM SAYFASINI GÜNCELLE

**Dosya:** `src/app/sunum/[id]/page.tsx`

**Değişiklikler:**
1. Tüm render mantığını kaldır
2. `TemplateRenderer` component'ini kullan
3. `sunumData`'yı prop olarak geç

```typescript
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export default function SunumPage() {
  // ... mevcut kod ...
  
  if (pageLoading || !sunumData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        {/* ... mevcut header kodu ... */}
      </div>

      {/* Template Renderer */}
      <TemplateRenderer data={sunumData} />
    </div>
  );
}
```

---

### 5. ŞABLON ÖNİZLEME SİSTEMİ

**Form'da şablon seçerken thumbnail göster:**

**Dosya:** `src/app/dashboard/olustur/page.tsx`

Şu bölümü güncelle:

```typescript
const TEMPLATES = [
  {
    value: "detayli_analiz",
    label: "Detaylı Analiz",
    desc: "Kapsamlı analiz, 6 adım sistem, tüm detaylar",
    thumbnail: "/templates/detailed-analysis-preview.png", // Ekle
    previewUrl: "/preview/detailed_analysis" // Ekle
  },
  // ... diğerleri
];

// Template seçiminde thumbnail göster
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {TEMPLATES.map(template => (
    <div
      key={template.value}
      onClick={() => setSecenekler({ ...secenekler, template: template.value })}
      className={`
        relative cursor-pointer border-2 rounded-xl overflow-hidden
        transition-all hover:scale-105
        ${secenekler.template === template.value 
          ? 'border-[#57B6B2] ring-4 ring-[#57B6B2]/20' 
          : 'border-gray-300'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 relative">
        <Image
          src={template.thumbnail || '/placeholder.png'}
          alt={template.label}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{template.label}</h3>
        <p className="text-sm text-gray-600">{template.desc}</p>
        
        {/* Preview Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(template.previewUrl, '_blank');
          }}
          className="mt-2 text-[#57B6B2] text-sm font-semibold"
        >
          👁️ Önizle
        </button>
      </div>
    </div>
  ))}
</div>
```

---

### 6. MOBİL/DESKTOP UYUM SEÇENEĞİ

**Form'a ekle:**

```typescript
const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');

// Template seçiminden sonra ekle:
<div className="mb-6">
  <label className="block text-sm font-medium mb-2">
    Görünüm
  </label>
  <div className="flex gap-4">
    <button
      onClick={() => setDeviceView('desktop')}
      className={`px-4 py-2 rounded-lg ${
        deviceView === 'desktop' 
          ? 'bg-[#57B6B2] text-white' 
          : 'bg-gray-200'
      }`}
    >
      💻 Masaüstü
    </button>
    <button
      onClick={() => setDeviceView('mobile')}
      className={`px-4 py-2 rounded-lg ${
        deviceView === 'mobile' 
          ? 'bg-[#57B6B2] text-white' 
          : 'bg-gray-200'
      }`}
    >
      📱 Mobil
    </button>
  </div>
</div>
```

**Template component'lerinde responsive sınıflar kullan:**

```typescript
// Her şablon zaten responsive olmalı
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Kartlar */}
</div>
```

---

### 7. AI İÇERİK ÜRETİMİNİ İYİLEŞTİR

**Dosya:** `src/lib/ai/gemini-service.ts`

**`buildEnhancementPrompt` fonksiyonunu güncelle:**

```typescript
function buildEnhancementPrompt(istek: SunumOlusturmaIstegi, templateSunum: SunumIcerik): string {
  const { mulk, tema, amac, danisman } = istek;
  const templateId = istek.template || 'detayli_analiz';

  return `
Sen profesyonel bir emlak sunum yazarlısın. Verilen template yapısını koruyarak içeriği ${mulk.konum} bölgesindeki ${mulk.tur} için özelleştiriyorsun.

━━━━━━━━━━━━━━━━━━━━━━━━━
GAYRİMENKUL DETAYLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━
📍 MÜLK TÜRÜ: ${mulk.tur}
📍 KONUM: ${mulk.konum}
💰 FİYAT: ${mulk.fiyat.toLocaleString('tr-TR')} TL
${mulk.metrekare ? `📏 METREKARE: ${mulk.metrekare} m²` : ''}
${mulk.odaSayisi ? `🚪 ODA SAYISI: ${mulk.odaSayisi}` : ''}
${mulk.kat ? `🏢 KAT: ${mulk.kat}` : ''}
${mulk.yas ? `📅 BİNA YAŞI: ${mulk.yas}` : ''}
${mulk.krediyeUygun ? '✅ KREDİYE UYGUN' : ''}
${mulk.cevreOzellikleri && mulk.cevreOzellikleri.length > 0 
  ? `🌐 ÇEVRE: ${mulk.cevreOzellikleri.join(', ')}` 
  : ''}
${mulk.avantajlar && mulk.avantajlar.length > 0 
  ? `⭐ AVANTAJLAR: ${mulk.avantajlar.join(', ')}` 
  : ''}
${mulk.aciklama ? `📝 AÇIKLAMA: ${mulk.aciklama}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
DANIŞMAN BİLGİLERİ:
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 DANIŞMAN: ${danisman.adSoyad}
📞 TELEFON: ${danisman.telefon}
📧 EMAIL: ${danisman.email}
${danisman.deneyim ? `💼 DENEYİM: ${danisman.deneyim} yıl` : ''}
${danisman.referans ? `🏆 REFERANS: ${danisman.referans}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
ŞABLON: ${templateId}
━━━━━━━━━━━━━━━━━━━━━━━━━
${templateId === 'detayli_analiz' ? `
Bu şablon DETAYLI ANALİZ için:
- 5 problem kartı (kırmızı tonlar, zarar vurgusu)
- 3 çözüm kartı (yeşil/beyaz, fayda vurgusu)
- 6 adım timeline (süreç)
- Lokasyon analizi (${mulk.konum} özel)
- Hedef kitle segmentasyonu
- Pazarlama stratejisi
` : ''}

${templateId === 'hizli_satis' ? `
Bu şablon HIZLI SATIŞ için:
- Kısa, etkili içerik
- Fiyat vurgusu
- Büyük CTA butonları
- Minimal text
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
GÖREV:
━━━━━━━━━━━━━━━━━━━━━━━━━
1. Template yapısını KORU (bolge tipleri, altBolge yapıları aynı kalacak)
2. Sadece baslik ve icerik alanlarını GÜNCELLE
3. ${mulk.konum} için gerçekçi lokasyon bilgileri kullan
4. ${mulk.fiyat.toLocaleString('tr-TR')} TL fiyatına göre yatırım analizi yap
5. ${mulk.tur} için özel avantajları vurgula
6. ${tema} temasına uygun dil tonu kullan
7. ${amac === 'portfoy_almak' ? 'Satıcıya güven ver' : 'Alıcıyı ikna et'}

━━━━━━━━━━━━━━━━━━━━━━━━━
ÇIKTI FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━
Aynı JSON yapısını koru. Sadece içerikleri zenginleştir.

\`\`\`json
{
  "bolgeler": [
    {
      "tip": "problemler",
      "baslik": "...",
      "icerik": "...",
      "altBolge": [
        {
          "baslik": "...",
          "icerik": "...",
          "tip": "text"
        }
      ]
    }
  ]
}
\`\`\`
`;
}
```

---

### 8. HER ŞABLON İÇİN ÖRNEK COMPONENT

**Template 1 Örneği (Detaylı Analiz):**

```typescript
'use client';

import { SunumData } from '@/types';
import Image from 'next/image';

interface Props {
  data: SunumData;
}

export default function Template1DetailedAnalysis({ data }: Props) {
  const { icerik, istek } = data;
  const { mulk, danisman } = istek;

  const heroBolge = icerik.bolgeler?.find((b: any) => b.tip === 'hero');
  const problemBolge = icerik.bolgeler?.find((b: any) => b.tip === 'problemler');
  const cozumBolge = icerik.bolgeler?.find((b: any) => b.tip === 'cozum');

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Referans tasarım */}
      {heroBolge && (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          {mulk.fotograflar && mulk.fotograflar[0] && (
            <Image
              src={mulk.fotograflar[0]}
              alt="Hero"
              fill
              className="object-cover z-0"
              priority
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent z-10" />
          
          {/* Top Banner */}
          <div className="absolute top-0 left-0 right-0 bg-black/50 p-2 text-xs text-white text-center tracking-widest z-20">
            🔒 Gizli • Sadece Sizin İçin • {mulk.konum}
          </div>

          {/* Content */}
          <div className="relative z-30 text-center max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white mb-6 leading-tight drop-shadow-2xl">
              {heroBolge.baslik || `Arsanızın Gerçek Değerini Biliyor musunuz?`}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {heroBolge.heroAciklama || icerik.heroAciklama}
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 text-white font-semibold">
              Ücretsiz Analiz • Sıfır Risk • %100 Garantili
            </div>
          </div>
        </section>
      )}

      {/* PROBLEM SECTION - Kırmızı Kartlar */}
      {problemBolge && problemBolge.altBolge && (
        <section className="bg-gray-900 py-16 md:py-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12">
            {problemBolge.baslik || 'Mülkünüzü Satarken Karşılaşacağınız 5 Büyük Sorun'}
          </h2>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemBolge.altBolge.map((problem: any, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white border-2 border-red-500/20 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-xl font-bold mb-3">
                  {idx + 1}. {problem.baslik}
                </h3>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {problem.icerik}
                </p>
                {problem.kayip && (
                  <div className="bg-black/30 rounded-lg p-3 text-sm font-semibold">
                    Kayıp: {problem.kayip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SOLUTION SECTION - Yeşil/Beyaz Kartlar */}
      {cozumBolge && cozumBolge.altBolge && (
        <section className="bg-white py-16 md:py-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            {cozumBolge.baslik || 'Peki Ya Bu Sorunların Hiçbiri Olmasaydı?'}
          </h2>
          <p className="text-center text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {cozumBolge.icerik || 'Size özel hazırladığım profesyonel satış sistemi ile...'}
          </p>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {cozumBolge.altBolge.map((solution: any, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-500 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">
                  {solution.baslik}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {solution.icerik}
                </p>
                {solution.fayda && (
                  <div className="bg-green-500 text-white rounded-lg p-3 text-sm font-semibold">
                    💰 {solution.fayda}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Diğer bölümler... */}
      {/* Timeline, Lokasyon, vb. */}
    </div>
  );
}
```

---

## 📝 ADIM ADIM UYGULAMA

1. **`src/components/templates/` klasörünü oluştur**
2. **5 template component dosyasını oluştur**
3. **`TemplateRenderer.tsx` oluştur**
4. **`src/app/sunum/[id]/page.tsx`'i güncelle** (TemplateRenderer kullan)
5. **Her template için özel Tailwind stillerini yaz**
6. **Form'da template seçimini iyileştir** (thumbnail + önizleme)
7. **AI prompt'unu şablon bazlı yap**

---

## 🎨 RENK ŞEMALARI ÖZET

| Şablon | Primary | Secondary | Accent |
|--------|---------|-----------|--------|
| Detaylı Analiz | #E31E24 (Kırmızı) | #1B3B6F (Mavi) | #FFB81C (Sarı) |
| Hızlı Satış | #10B981 (Yeşil) | #047857 (Koyu Yeşil) | #FCD34D (Sarı) |
| Premium | #1F2937 (Siyah) | #D4AF37 (Altın) | #FFFFFF (Beyaz) |
| Güven | #3B82F6 (Mavi) | #1E40AF (Koyu Mavi) | #60A5FA (Açık Mavi) |
| Minimalist | #000000 (Siyah) | #FFFFFF (Beyaz) | #57B6B2 (Turkuaz) |

---

## ✅ KONTROL LİSTESİ

- [ ] 5 template component oluşturuldu
- [ ] Her template farklı görsel tasarıma sahip
- [ ] TemplateRenderer çalışıyor
- [ ] Sunum sayfası TemplateRenderer kullanıyor
- [ ] Responsive tasarım (mobil + desktop)
- [ ] AI içerik üretimi şablon bazlı
- [ ] Form'da template seçimi + önizleme var
- [ ] Her şablon kendi renk şemasına sahip
- [ ] Referans tasarım (bedirhanhaci) uygulandı

---

## 🚀 BAŞLAMAK İÇİN

Cursor'a şunu söyle:

"Bu prompt'u oku ve 5 farklı funnel şablonu oluştur. Her şablon için ayrı component yaz. TemplateRenderer ile seçimi yap. Sunum sayfasını güncelle."
>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
