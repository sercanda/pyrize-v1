<<<<<<< HEAD
# ChatGPT Prompt: Emlak Sunum Sayfası Oluşturucu Projesi

## PROJE ÖZETİ

Next.js 16 + TypeScript + TailwindCSS ile geliştirilmekte olan bir **Emlak Danışmanları için Sunum Sayfası Oluşturucu** web uygulaması. Bu bir satış sayfası (funnel) değil, **güven veren ve bilgilendirici sunum sayfaları** oluşturmak için tasarlanmıştır.

**Teknoloji Stack:**
- Frontend: Next.js 16, TypeScript, TailwindCSS
- AI: Google Gemini 2.0 Flash API (API Key: AIzaSyCnLuhATWedW6vlBkM6-G4QDlxja6PAs1E)
- Backend: Next.js API Routes
- Database: Supabase (yakında entegre edilecek)
- PDF Export: html2pdf.js

**Marka Renkleri:**
- Ana renk: `#57B6B2` (turkuaz)
- İkincil renk: `#223BA1` (koyu mavi)
- Arka plan: Siyah + gradient (özellikle #223BA1 tonları)

---

## MEVCUT DURUM (Yapılanlar)

### ✅ Tamamlanan Özellikler:

1. **Ana Sayfa (Landing Page)**
   - Marka renkleri ile tasarım
   - Gradient arka plan
   - Hizmet açıklamaları

2. **Sunum Oluşturma Formu** (`/dashboard/olustur`)
   - Danışman bilgileri (ad, telefon, email, deneyim, referans)
   - Mülk bilgileri (tür, konum, fiyat, metrekare, oda sayısı, kat, yaş, krediye uygun, çevre özellikleri, avantajlar, açıklama)
   - Sunum amaç seçimi (portföy almak / portföy satmak)
   - Sunum uzunluğu (kısa, orta, uzun)
   - Tema seçimi (sıcak & samimi, kurumsal, modern, lüks, minimalist)
   - Template seçimi (5 farklı template: detayli_analiz, hizli_satis, premium_sunum, guven_odakli, minimalist)

3. **Template Sistemi** (`src/lib/templates/funnel-templates.ts`)
   - 5 farklı template yapısı tanımlı
   - Her template kendi bölge yapısına sahip
   - Template'ler şu bölgeleri içeriyor:
     - `hero`: Ana başlık ve giriş
     - `problemler`: Sorunlar bölümü (kırmızı kartlar)
     - `cozum`: Çözüm bölümü (yeşil/beyaz kartlar)
     - `process`: 6 adım süreç (timeline)
     - `location_analysis`: Lokasyon analizi
     - `target_audience`: Hedef kitle
     - `marketing`: Pazarlama stratejisi
     - `faq`: Sık sorulan sorular
     - `timing`: Zamanlama
     - `guarantee`: Garantiler
     - `testimonial`: Referanslar
     - `cta`: İletişim çağrısı

4. **Gemini AI Entegrasyonu** (`src/lib/ai/gemini-service.ts`)
   - Template yapısını koruyarak içerik zenginleştirme
   - Mülk bilgilerine göre dinamik içerik üretimi
   - Tema ve amaç odaklı metin üretimi
   - Prompt sisteminde detaylı gayrimenkul ve danışman bilgileri kullanılıyor

5. **Sunum Sayfası** (`/sunum/[id]`)
   - Dinamik içerik gösterimi
   - Responsive tasarım (mobil ve web için)
   - PDF indirme özelliği
   - Link paylaşma özelliği
   - localStorage ile veri saklama (geçici çözüm)

6. **Type Definitions** (`src/types/index.ts`)
   - Mülk türleri, sunum amaçları, uzunluklar, temalar için type tanımları
   - Sunum içeriği ve bölge yapıları için interface'ler

---

## İSTENEN ÖZELLİKLER (Henüz Tam Çalışmıyor)

### 🎯 Ana İstekler:

1. **5 Farklı Template Tasarımı**
   - **Template 1 - Detaylı Analiz**: Profesyonel sunum tasarımı
     - Çok detaylı analiz bölümleri
     - 6 adım süreç sistemi
     - Lokasyon analizi, hedef kitle, pazarlama stratejisi gibi ekstra bölümler
     - Hero section'da büyük başlık, gradient overlay
     - Problem kartları (kırmızı tonlar)
     - Çözüm kartları (yeşil/beyaz)
     - Timeline süreç gösterimi
   
   - **Template 2 - Hızlı Satış**: Kısa ve etkili, hızlı karar odaklı
   
   - **Template 3 - Premium Sunum**: Lüks hissi, prestij vurgusu
   
   - **Template 4 - Güven Odaklı**: Güven inşası, sosyal kanıt, şeffaflık
   
   - **Template 5 - Minimalist**: Sade, net, öz bilgi

2. **Dinamik İçerik Üretimi**
   - Girilen mülk bilgilerine göre AI içeriği özelleştirmeli
   - Konum bilgisine göre bölge analizi eklemeli
   - Fiyat bilgisine göre yatırım değerlemesi yapmalı
   - Mülk türüne göre (arsa, daire, villa, vb.) özel içerik üretmeli
   - Danışman bilgilerini içeriğe entegre etmeli
   - Tema ve amaç (portföy almak/satmak) göre dil tonunu ayarlamalı

3. **Mobil ve Web Uyumluluğu**
   - Responsive tasarım (mobil, tablet, desktop)
   - Layout kaymaları olmamalı
   - Tüm elementler ekran boyutuna göre uyumlu olmalı
   - Font boyutları, padding, margin değerleri responsive olmalı
   - Grid yapıları mobilde 1 kolon, desktop'ta çok kolon olmalı

4. **Template Farklılıkları**
   - Her template görsel olarak farklı olmalı
   - Farklı renk şemaları, layout yapıları, tipografi stilleri
   - Template'ler arasında geçiş yapıldığında görsel farklılık net olmalı

5. **PDF ve Paylaşım**
   - PDF export çalışır durumda (html2pdf.js)
   - Her sunum için benzersiz URL (`/sunum/[slug]`)
   - Link paylaşma özelliği

---

## MEVCUT SORUNLAR

### ❌ Kritik Sorunlar:

1. **Template'ler Aynı Görünüyor**
   - 5 template seçeneği var ama görsel olarak hepsi aynı görünüyor
   - Template'ler arasında görsel farklılık yok
   - Sadece içerik yapısı değişiyor, tasarım aynı kalıyor

2. **Dinamik İçerik Çalışmıyor**
   - AI (Gemini) içerik üretiyor ama girilen bilgilere göre özelleşmiyor
   - Mülk konumu, fiyatı, özellikleri içerikte yansımıyor
   - Template içeriği statik kalıyor

3. **Responsive Tasarım Sorunları**
   - Mobil ve web uyum sorunları var
   - Layout kaymaları mevcut
   - Bazı elementler mobilde düzgün görünmüyor
   - Padding, margin değerleri responsive değil

4. **Template Yapısı Eksik**
   - Detaylı profesyonel tasarım gerekiyor
   - Hero section tasarımı eksik/yanlış
   - Problem/çözüm kartları düzgün tasarlanmamış
   - Timeline süreç gösterimi tam çalışmıyor

---

## TASARIM STANDARTLARI

Her sunum şu bölümleri içermelidir:
- Hero section: Büyük başlık, gradient overlay, arka plan resmi
- Problem bölümü: Kırmızı tonlarda kartlar, sorunlar listesi
- Çözüm bölümü: Yeşil/beyaz kartlar, avantajlar
- 6 adım süreç: Timeline görseli, adım adım açıklamalar
- Lokasyon analizi: Harita, bölge bilgileri
- Hedef kitle: Kime hitap edildiği
- Pazarlama stratejisi: Nasıl pazarlanacak
- FAQ: Sık sorulan sorular
- Zamanlama: Süreç zaman çizelgesi
- Garantiler: Güven unsurları
- CTA: İletişim bilgileri

---

## YAPILMASI GEREKENLER

### 🔧 Acil Düzeltmeler:

1. **Template Tasarımlarını Farklılaştır**
   - Her template için farklı CSS stilleri
   - Farklı renk şemaları
   - Farklı layout yapıları
   - Farklı tipografi stilleri

2. **Gemini AI Prompt'unu İyileştir**
   - Girilen tüm mülk bilgilerini prompt'a ekle
   - Konum bilgisine göre bölge analizi iste
   - Fiyat bilgisine göre yatırım analizi iste
   - Mülk özelliklerini içeriğe entegre et
   - AI'dan gelen içeriği template yapısına doğru şekilde yerleştir

3. **Responsive Düzenlemeler**
   - Tüm component'lerde responsive utility class'ları ekle
   - Mobil için özel padding/margin değerleri
   - Grid yapılarını responsive yap
   - Font boyutlarını responsive yap

4. **Referans Tasarımı Uygula**
   - Hero section'ı referans gibi tasarla
   - Problem/çözüm kartlarını referans gibi yap
   - Timeline tasarımını referans gibi uygula
   - Genel layout'u referans linkteki gibi düzenle

---

## TEKNİK DETAYLAR

### Dosya Yapısı:
```
src/
├── app/
│   ├── dashboard/
│   │   └── olustur/page.tsx      # Sunum oluşturma formu
│   └── sunum/[id]/page.tsx       # Sunum görüntüleme sayfası
├── lib/
│   ├── ai/
│   │   └── gemini-service.ts     # Gemini AI entegrasyonu
│   ├── templates/
│   │   └── funnel-templates.ts   # Template tanımları
│   └── pdf-generator.ts          # PDF export
└── types/
    └── index.ts                  # TypeScript type tanımları
```

### Önemli Kod Bölümleri:

1. **Template Seçimi**: `src/lib/templates/funnel-templates.ts`
   - `generateSunumFromTemplate()` fonksiyonu template'e göre içerik üretir

2. **AI İçerik Üretimi**: `src/lib/ai/gemini-service.ts`
   - `sunumOlustur()` fonksiyonu Gemini API'yi çağırır
   - `buildEnhancementPrompt()` fonksiyonu detaylı prompt oluşturur

3. **Sunum Görüntüleme**: `src/app/sunum/[id]/page.tsx`
   - localStorage'dan veri yükler
   - Template'e göre farklı render edilmeli (şu an hepsi aynı)

---

## İSTEDİĞİN SONUÇ

**Kullanıcı şunu istiyor:**
- 5 farklı görsel tasarıma sahip template
- Girilen bilgilere göre dinamik içerik üretimi
- Mobil ve web uyumlu, responsive tasarım
- Referans linkteki gibi profesyonel görünüm
- Her template'in kendine özgü tasarımı

**Şu an olan:**
- 5 template var ama görsel olarak aynı
- İçerik statik kalıyor
- Responsive sorunları var
- Template'ler referans linkteki gibi değil

---

## SONUÇ

Lütfen bu projeyi analiz et ve:
1. Template'leri görsel olarak farklılaştır
2. AI içerik üretimini girilen bilgilere göre özelleştir
3. Responsive tasarım sorunlarını çöz
4. Referans linkteki gibi profesyonel tasarım uygula
5. Her template için özel CSS/stil dosyaları oluştur

Her adımı detaylı açıkla ve kod değişikliklerini göster.
=======
# ChatGPT Prompt: Emlak Sunum Sayfası Oluşturucu Projesi

## PROJE ÖZETİ

Next.js 16 + TypeScript + TailwindCSS ile geliştirilmekte olan bir **Emlak Danışmanları için Sunum Sayfası Oluşturucu** web uygulaması. Bu bir satış sayfası (funnel) değil, **güven veren ve bilgilendirici sunum sayfaları** oluşturmak için tasarlanmıştır.

**Teknoloji Stack:**
- Frontend: Next.js 16, TypeScript, TailwindCSS
- AI: Google Gemini 2.0 Flash API (API Key: AIzaSyCnLuhATWedW6vlBkM6-G4QDlxja6PAs1E)
- Backend: Next.js API Routes
- Database: Supabase (yakında entegre edilecek)
- PDF Export: html2pdf.js

**Marka Renkleri:**
- Ana renk: `#57B6B2` (turkuaz)
- İkincil renk: `#223BA1` (koyu mavi)
- Arka plan: Siyah + gradient (özellikle #223BA1 tonları)

---

## MEVCUT DURUM (Yapılanlar)

### ✅ Tamamlanan Özellikler:

1. **Ana Sayfa (Landing Page)**
   - Marka renkleri ile tasarım
   - Gradient arka plan
   - Hizmet açıklamaları

2. **Sunum Oluşturma Formu** (`/dashboard/olustur`)
   - Danışman bilgileri (ad, telefon, email, deneyim, referans)
   - Mülk bilgileri (tür, konum, fiyat, metrekare, oda sayısı, kat, yaş, krediye uygun, çevre özellikleri, avantajlar, açıklama)
   - Sunum amaç seçimi (portföy almak / portföy satmak)
   - Sunum uzunluğu (kısa, orta, uzun)
   - Tema seçimi (sıcak & samimi, kurumsal, modern, lüks, minimalist)
   - Template seçimi (5 farklı template: detayli_analiz, hizli_satis, premium_sunum, guven_odakli, minimalist)

3. **Template Sistemi** (`src/lib/templates/funnel-templates.ts`)
   - 5 farklı template yapısı tanımlı
   - Her template kendi bölge yapısına sahip
   - Template'ler şu bölgeleri içeriyor:
     - `hero`: Ana başlık ve giriş
     - `problemler`: Sorunlar bölümü (kırmızı kartlar)
     - `cozum`: Çözüm bölümü (yeşil/beyaz kartlar)
     - `process`: 6 adım süreç (timeline)
     - `location_analysis`: Lokasyon analizi
     - `target_audience`: Hedef kitle
     - `marketing`: Pazarlama stratejisi
     - `faq`: Sık sorulan sorular
     - `timing`: Zamanlama
     - `guarantee`: Garantiler
     - `testimonial`: Referanslar
     - `cta`: İletişim çağrısı

4. **Gemini AI Entegrasyonu** (`src/lib/ai/gemini-service.ts`)
   - Template yapısını koruyarak içerik zenginleştirme
   - Mülk bilgilerine göre dinamik içerik üretimi
   - Tema ve amaç odaklı metin üretimi
   - Prompt sisteminde detaylı gayrimenkul ve danışman bilgileri kullanılıyor

5. **Sunum Sayfası** (`/sunum/[id]`)
   - Dinamik içerik gösterimi
   - Responsive tasarım (mobil ve web için)
   - PDF indirme özelliği
   - Link paylaşma özelliği
   - localStorage ile veri saklama (geçici çözüm)

6. **Type Definitions** (`src/types/index.ts`)
   - Mülk türleri, sunum amaçları, uzunluklar, temalar için type tanımları
   - Sunum içeriği ve bölge yapıları için interface'ler

---

## İSTENEN ÖZELLİKLER (Henüz Tam Çalışmıyor)

### 🎯 Ana İstekler:

1. **5 Farklı Template Tasarımı**
   - **Template 1 - Detaylı Analiz**: Profesyonel sunum tasarımı
     - Çok detaylı analiz bölümleri
     - 6 adım süreç sistemi
     - Lokasyon analizi, hedef kitle, pazarlama stratejisi gibi ekstra bölümler
     - Hero section'da büyük başlık, gradient overlay
     - Problem kartları (kırmızı tonlar)
     - Çözüm kartları (yeşil/beyaz)
     - Timeline süreç gösterimi
   
   - **Template 2 - Hızlı Satış**: Kısa ve etkili, hızlı karar odaklı
   
   - **Template 3 - Premium Sunum**: Lüks hissi, prestij vurgusu
   
   - **Template 4 - Güven Odaklı**: Güven inşası, sosyal kanıt, şeffaflık
   
   - **Template 5 - Minimalist**: Sade, net, öz bilgi

2. **Dinamik İçerik Üretimi**
   - Girilen mülk bilgilerine göre AI içeriği özelleştirmeli
   - Konum bilgisine göre bölge analizi eklemeli
   - Fiyat bilgisine göre yatırım değerlemesi yapmalı
   - Mülk türüne göre (arsa, daire, villa, vb.) özel içerik üretmeli
   - Danışman bilgilerini içeriğe entegre etmeli
   - Tema ve amaç (portföy almak/satmak) göre dil tonunu ayarlamalı

3. **Mobil ve Web Uyumluluğu**
   - Responsive tasarım (mobil, tablet, desktop)
   - Layout kaymaları olmamalı
   - Tüm elementler ekran boyutuna göre uyumlu olmalı
   - Font boyutları, padding, margin değerleri responsive olmalı
   - Grid yapıları mobilde 1 kolon, desktop'ta çok kolon olmalı

4. **Template Farklılıkları**
   - Her template görsel olarak farklı olmalı
   - Farklı renk şemaları, layout yapıları, tipografi stilleri
   - Template'ler arasında geçiş yapıldığında görsel farklılık net olmalı

5. **PDF ve Paylaşım**
   - PDF export çalışır durumda (html2pdf.js)
   - Her sunum için benzersiz URL (`/sunum/[slug]`)
   - Link paylaşma özelliği

---

## MEVCUT SORUNLAR

### ❌ Kritik Sorunlar:

1. **Template'ler Aynı Görünüyor**
   - 5 template seçeneği var ama görsel olarak hepsi aynı görünüyor
   - Template'ler arasında görsel farklılık yok
   - Sadece içerik yapısı değişiyor, tasarım aynı kalıyor

2. **Dinamik İçerik Çalışmıyor**
   - AI (Gemini) içerik üretiyor ama girilen bilgilere göre özelleşmiyor
   - Mülk konumu, fiyatı, özellikleri içerikte yansımıyor
   - Template içeriği statik kalıyor

3. **Responsive Tasarım Sorunları**
   - Mobil ve web uyum sorunları var
   - Layout kaymaları mevcut
   - Bazı elementler mobilde düzgün görünmüyor
   - Padding, margin değerleri responsive değil

4. **Template Yapısı Eksik**
   - Detaylı profesyonel tasarım gerekiyor
   - Hero section tasarımı eksik/yanlış
   - Problem/çözüm kartları düzgün tasarlanmamış
   - Timeline süreç gösterimi tam çalışmıyor

---

## TASARIM STANDARTLARI

Her sunum şu bölümleri içermelidir:
- Hero section: Büyük başlık, gradient overlay, arka plan resmi
- Problem bölümü: Kırmızı tonlarda kartlar, sorunlar listesi
- Çözüm bölümü: Yeşil/beyaz kartlar, avantajlar
- 6 adım süreç: Timeline görseli, adım adım açıklamalar
- Lokasyon analizi: Harita, bölge bilgileri
- Hedef kitle: Kime hitap edildiği
- Pazarlama stratejisi: Nasıl pazarlanacak
- FAQ: Sık sorulan sorular
- Zamanlama: Süreç zaman çizelgesi
- Garantiler: Güven unsurları
- CTA: İletişim bilgileri

---

## YAPILMASI GEREKENLER

### 🔧 Acil Düzeltmeler:

1. **Template Tasarımlarını Farklılaştır**
   - Her template için farklı CSS stilleri
   - Farklı renk şemaları
   - Farklı layout yapıları
   - Farklı tipografi stilleri

2. **Gemini AI Prompt'unu İyileştir**
   - Girilen tüm mülk bilgilerini prompt'a ekle
   - Konum bilgisine göre bölge analizi iste
   - Fiyat bilgisine göre yatırım analizi iste
   - Mülk özelliklerini içeriğe entegre et
   - AI'dan gelen içeriği template yapısına doğru şekilde yerleştir

3. **Responsive Düzenlemeler**
   - Tüm component'lerde responsive utility class'ları ekle
   - Mobil için özel padding/margin değerleri
   - Grid yapılarını responsive yap
   - Font boyutlarını responsive yap

4. **Referans Tasarımı Uygula**
   - Hero section'ı referans gibi tasarla
   - Problem/çözüm kartlarını referans gibi yap
   - Timeline tasarımını referans gibi uygula
   - Genel layout'u referans linkteki gibi düzenle

---

## TEKNİK DETAYLAR

### Dosya Yapısı:
```
src/
├── app/
│   ├── dashboard/
│   │   └── olustur/page.tsx      # Sunum oluşturma formu
│   └── sunum/[id]/page.tsx       # Sunum görüntüleme sayfası
├── lib/
│   ├── ai/
│   │   └── gemini-service.ts     # Gemini AI entegrasyonu
│   ├── templates/
│   │   └── funnel-templates.ts   # Template tanımları
│   └── pdf-generator.ts          # PDF export
└── types/
    └── index.ts                  # TypeScript type tanımları
```

### Önemli Kod Bölümleri:

1. **Template Seçimi**: `src/lib/templates/funnel-templates.ts`
   - `generateSunumFromTemplate()` fonksiyonu template'e göre içerik üretir

2. **AI İçerik Üretimi**: `src/lib/ai/gemini-service.ts`
   - `sunumOlustur()` fonksiyonu Gemini API'yi çağırır
   - `buildEnhancementPrompt()` fonksiyonu detaylı prompt oluşturur

3. **Sunum Görüntüleme**: `src/app/sunum/[id]/page.tsx`
   - localStorage'dan veri yükler
   - Template'e göre farklı render edilmeli (şu an hepsi aynı)

---

## İSTEDİĞİN SONUÇ

**Kullanıcı şunu istiyor:**
- 5 farklı görsel tasarıma sahip template
- Girilen bilgilere göre dinamik içerik üretimi
- Mobil ve web uyumlu, responsive tasarım
- Referans linkteki gibi profesyonel görünüm
- Her template'in kendine özgü tasarımı

**Şu an olan:**
- 5 template var ama görsel olarak aynı
- İçerik statik kalıyor
- Responsive sorunları var
- Template'ler referans linkteki gibi değil

---

## SONUÇ

Lütfen bu projeyi analiz et ve:
1. Template'leri görsel olarak farklılaştır
2. AI içerik üretimini girilen bilgilere göre özelleştir
3. Responsive tasarım sorunlarını çöz
4. Referans linkteki gibi profesyonel tasarım uygula
5. Her template için özel CSS/stil dosyaları oluştur

Her adımı detaylı açıkla ve kod değişikliklerini göster.
>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
