# Form Verilerinin Funnel'a Etki Etme Yapısı

Bu dokümantasyon, form üzerinden girilen verilerin AI (Gemini) tarafından funnel içeriğine nasıl dönüştürüldüğünü açıklar.

## 📊 Veri Akış Şeması

```
FORM (olustur/page.tsx)
    ↓
API Route (/api/sunum/olustur)
    ↓
gemini-service.ts (sunumOlustur)
    ↓
buildEnhancementPrompt (Prompt Oluşturma)
    ↓
OpenRouter/Gemini API
    ↓
JSON Response Parse
    ↓
Template Merge (baseTemplate + AI Response)
    ↓
FUNNEL OUTPUT (TemplateRenderer)
```

## 🔄 Form Verilerinin İşlenme Süreci

### 1. Form'dan Veri Toplama (`olustur/page.tsx`)

#### Detaylı Değerleme Verileri (Piyasa Analiz Raporu)

```typescript
// Form State
const [detayliDegerleme, setDetayliDegerleme] = useState({
  marketSnapshots: [
    { title: "", value: "", trend: "", trendLabel: "" }
  ],
  comparables: [
    { address: "", status: "Satıldı", price: "", size: "", pricePerSqm: "" }
  ],
  estimatedValueRange: ""
});

// Submit İşlemi (handleSubmit)
let detayliDegerlemePayload: any = undefined;
if (detayliDegerlemeAktif) {
  // Market Snapshots işleme
  const snapshots = detayliDegerleme.marketSnapshots
    .map((snapshot) => {
      // Validasyon ve temizleme
      if (!title || !value) return null;
      return {
        title: snapshot.title.trim(),
        value: snapshot.value.trim(),
        trend: snapshot.trend, // "up" | "down" | "stable"
        trendLabel: snapshot.trendLabel.trim()
      };
    })
    .filter(Boolean);

  // Comparables işleme
  const comparables = detayliDegerleme.comparables
    .map((comp) => {
      if (!address || !price) return null;
      return {
        address: comp.address.trim(),
        status: comp.status, // "Satıldı" | "Satışta"
        price: comp.price.trim(),
        size: comp.size.trim(),
        pricePerSqm: comp.pricePerSqm.trim()
      };
    })
    .filter(Boolean);

  // Payload oluşturma
  if (snapshots.length || comparables.length || estimatedValueRange) {
    detayliDegerlemePayload = {
      ...(snapshots.length ? { marketSnapshots: snapshots } : {}),
      ...(comparables.length ? { comparables } : {}),
      ...(estimatedValueRange ? { estimatedValueRange } : {})
    };
  }
}

// API'ye gönderim
const requestData = {
  // ... diğer veriler
  detayliDegerleme: detayliDegerlemePayload,
  detayliDegerlemeAktif: detayliDegerlemeAktif && !!detayliDegerlemePayload
};
```

### 2. API Route İşleme (`/api/sunum/olustur/route.ts`)

```typescript
// Request body'den verileri al
const body: any = await request.json();

// sunumOlustur fonksiyonuna gönder
const icerik = await sunumOlustur(body, body.template);
```

### 3. Prompt Oluşturma (`gemini-service.ts` - `buildEnhancementPrompt`)

#### Detaylı Değerleme Verilerinin Prompt'a Eklenmesi

```typescript
// 828-889. satırlar arası
const valuationSnapshotsText =
  istek.detayliDegerleme?.marketSnapshots
    ?.filter((snapshot) => snapshot && (snapshot.title || snapshot.value))
    .map((snapshot) => {
      const title = snapshot.title || "Göstergesi";
      const value = snapshot.value ? `: ${snapshot.value}` : "";
      const trend = 
        snapshot.trend === "up" ? " (Trend: Yükselişte)" :
        snapshot.trend === "down" ? " (Trend: Düşüşte)" :
        snapshot.trend === "stable" ? " (Trend: Dengede)" : "";
      const trendLabel = snapshot.trendLabel ? ` • ${snapshot.trendLabel}` : "";
      return `- ${title}${value}${trend}${trendLabel}`;
    })
    .join("\n") || "";

const valuationComparablesText =
  istek.detayliDegerleme?.comparables
    ?.filter((comp) => comp && (comp.address || comp.price))
    .map((comp) => {
      return `- ${comp.address || "Emsal"} | ${comp.status} | Fiyat: ${comp.price} | Alan: ${comp.size || "-"} | m²: ${comp.pricePerSqm || "-"}`;
    })
    .join("\n") || "";

const valuationEstimatedText = 
  istek.detayliDegerleme?.estimatedValueRange
    ? `Tahmini Değer Aralığı: ${istek.detayliDegerleme.estimatedValueRange}`
    : "";

// Prompt'a ekleme
if (hasDetayliDegerleme) {
  sections.push(
    formatPromptSection(
      "DETAYLI DEĞERLEME VERİLERİ",
      valuationSections.join("\n\n")
    )
  );
}
```

### 4. Gemini System Prompt'a Yönlendirme

```typescript
// System prompt'a eklenen yönlendirme (269-285. satırlar)
const systemPrompt = `Sen profesyonel bir emlak sunum yazarlısın...

5. DETAYLI DEĞERLEME RAPORU: ${hasDetayliDegerleme ? `
Kullanıcı form üzerinden "Piyasa Analiz Raporu" sekmesini doldurmuş.
Bu verileri MUTLAKA kullan:

- Piyasa Göstergeleri: Verilen marketSnapshots verilerini "Detaylı Değerleme Raporu" bölümünde göster
- Emsal Mülkler: Verilen comparables verilerini tablo formatında göster
- Tahmini Değer: estimatedValueRange değerini vurgula

Bu veriler "regional_comparison" tipinde bir bölge olarak funnel'a eklenmeli.
Kurumsal tema seçildiyse, bu bölüm hero'dan sonra gösterilmeli.
` : 'Detaylı değerleme verisi yok, bu bölümü oluşturma.'}`;
```

### 5. Template'e Entegrasyon (`funnel-templates.ts`)

```typescript
// detayliAnalizTemplate.generateBolgeler içinde
...(detayliDegerlemeAktif && detayliDegerleme ? [{
  tip: "regional_comparison" as const,
  baslik: "DETAYLI DEĞERLEME RAPORU",
  icerik: detayliDegerleme.estimatedValueRange || "...",
  altBolge: [
    ...(detayliDegerleme.marketSnapshots?.map(snapshot => ({
      baslik: snapshot.title,
      icerik: `${snapshot.value}${snapshot.trendLabel ? ` | ${snapshot.trendLabel}` : ''}`,
      tip: "stats" as const
    })) || []),
    ...(detayliDegerleme.comparables?.map(comp => ({
      baslik: comp.address,
      icerik: `${comp.status} | ${comp.price}${comp.size ? ` | ${comp.size}` : ''}${comp.pricePerSqm ? ` | ${comp.pricePerSqm}` : ''}`,
      tip: "comparison" as const
    })) || [])
  ]
}] : []),
```

### 6. Template Render (`TemplateCorporateDetailedAnalysis.tsx`)

```typescript
// RegionalComparisonSection component'i
const RegionalComparisonSection: React.FC<{
  valuationData?: DetayliDegerlemeVerisi;
}> = ({ valuationData }) => {
  // marketSnapshots -> Kartlar olarak göster
  // comparables -> Tablo olarak göster
  // estimatedValueRange -> Vurgulu göster
};
```

## 🎯 Gemini'ye Yönlendirme Kuralları

### Detaylı Değerleme Verileri İçin Özel Talimatlar

Gemini'ye gönderilen prompt'ta şu kurallar belirtilir:

1. **Veri Kullanımı**: Form'dan gelen tüm değerleme verileri MUTLAKA kullanılmalı
2. **Bölüm Konumu**: "Detaylı Değerleme Raporu" hero bölümünden sonra gösterilmeli
3. **Format**: 
   - Market Snapshots → Kart formatında göster
   - Comparables → Tablo formatında göster
   - Estimated Value → Vurgulu göster
4. **Tema Uyumu**: Kurumsal tema seçildiyse, profesyonel ve veri odaklı dil kullan

## 📝 Form Alanlarının Funnel'a Etkisi

| Form Alanı | Funnel Bölümü | Prompt Yönlendirmesi |
|------------|---------------|---------------------|
| `detayliDegerleme.marketSnapshots` | Detaylı Değerleme Raporu → Piyasa Göstergeleri | `formatPromptSection("DETAYLI DEĞERLEME VERİLERİ")` |
| `detayliDegerleme.comparables` | Detaylı Değerleme Raporu → Emsal Mülkler | Tablo formatında göster |
| `detayliDegerleme.estimatedValueRange` | Detaylı Değerleme Raporu → Tahmini Değer | Vurgulu göster |
| `mulk.konumAvantajlari` | Konum Avantajları bölümü | `formatPromptSection("KONUM AVANTAJLARI")` |
| `mulk.kullanimPotansiyeli` | Kullanım Potansiyeli bölümü | `formatPromptSection("KULLANIM POTANSİYELİ")` |
| `mulk.aciklama` | Tüm bölümlere entegre | `formatPromptSection("EK AÇIKLAMA")` |
| `locationAnalysis` | Konum Analizi bölümü | `formatPromptSection("BÖLGE ANALİZİ")` |

## 🔧 Yeni Form Alanı Eklemek İçin

1. **Form State'e Ekle** (`olustur/page.tsx`)
```typescript
const [yeniAlan, setYeniAlan] = useState("");
```

2. **Request Data'ya Ekle** (`handleSubmit`)
```typescript
const requestData = {
  // ...
  yeniAlan: yeniAlan || undefined
};
```

3. **Prompt'a Ekle** (`buildEnhancementPrompt`)
```typescript
if (istek.yeniAlan) {
  sections.push(
    formatPromptSection(
      "YENİ ALAN BAŞLIĞI",
      `${istek.yeniAlan}\n\n⚠️ ÖNEMLİ: Bu bilgiyi [BÖLÜM ADI] bölümünde kullan.`
    )
  );
}
```

4. **System Prompt'a Yönlendirme Ekle** (`sunumOlustur`)
```typescript
const systemPrompt = `...
6. YENİ ALAN: ${istek.yeniAlan ? `"${istek.yeniAlan}" bilgisini [BÖLÜM ADI] bölümünde kullan.` : ''}
`;
```

5. **Template'e Entegre Et** (`funnel-templates.ts`)
```typescript
{
  tip: "yeni_bolge_tipi",
  baslik: "YENİ BÖLÜM BAŞLIĞI",
  icerik: yeniAlan || fallbackIcerik
}
```

6. **Template Component'te Render Et** (`Template*.tsx`)
```typescript
{yeniAlan && (
  <section>
    {/* Yeni bölüm render */}
  </section>
)}
```

## 🎨 Prompt Formatı

Tüm form verileri `formatPromptSection` fonksiyonu ile formatlanır:

```typescript
function formatPromptSection(title: string, content: string): string {
  return `\n\n=== ${title} ===\n${content}\n`;
}
```

Bu format Gemini'nin verileri daha iyi anlamasını sağlar.

