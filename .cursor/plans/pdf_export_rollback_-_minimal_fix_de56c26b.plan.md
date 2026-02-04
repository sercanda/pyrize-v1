---
name: PDF Export Rollback - Minimal Fix
overview: "PDF export sistemindeki son eklenen pdf-mode/pagination müdahalelerini kaldırarak önceki düzgün çalışan haline geri döndürmek. Sadece minimal, güvenli iyileştirmeler (printBackground: true, büyük wrapper'lara break-inside: avoid, animation/transition none) kalacak."
todos:
  - id: remove-pdf-mode-css
    content: src/app/pdf-mode.css dosyasını tamamen sil
    status: completed
  - id: remove-pdf-mode-from-page
    content: src/app/sunum/[id]/page.tsx'den pdf-mode desteğini kaldır (import, state, body class, conditional render)
    status: completed
    dependencies:
      - remove-pdf-mode-css
  - id: remove-pdf-page-wrappers
    content: Template1DetailedAnalysis.tsx'den pdf-page wrapper'larını kaldır (data-pdf-page attribute'ları ve className'ler)
    status: completed
  - id: minimal-print-css
    content: /api/export-pdf route'unda minimal print CSS inject et (sadece animation/transition none + büyük wrapper'lara break-inside)
    status: completed
  - id: remove-viewport-force
    content: API route'undan viewport zorlamasını ve data-pdf-ready wait'ini kaldır
    status: completed
    dependencies:
      - minimal-print-css
---

# PDF

Export Rollback + Minimal Fix Plan

## Hedef

PDF export'i önceki düzgün çalışan haline geri döndürmek. Son eklenen pdf-mode/pagination müdahaleleri kaldırılacak, sadece minimal güvenli iyileştirmeler kalacak.

## Yapılacak Değişiklikler

### 1. PDF Mode CSS Dosyasını Kaldır

**Dosya:** `src/app/pdf-mode.css`

- **Aksiyon:** Dosyayı tamamen sil
- **Sebep:** Tüm pdf-mode müdahaleleri (page container, clamp, compact mode, vb.) kaldırılacak

### 2. Sunum Sayfasından PDF Mode Desteğini Kaldır

**Dosya:** `src/app/sunum/[id]/page.tsx`

- **Kaldırılacaklar:**
- `import "@/app/pdf-mode.css";` (satır 9)
- `isPdfMode` state ve URL search params kontrolü (satır 36, 43-66)
- PDF mode için body class ekleme/kaldırma kodları
- PDF mode'da header gizleme bloğu (satır 241-256)
- `pdf-mode` className'leri (satır 248, 341, 351)
- `data-pdf-ready` attribute'ları
- **Bırakılacaklar:**
- `handleDownload` fonksiyonu `/api/export-pdf` endpoint'ini kullanmaya devam edecek (Windows ICU fix için gerekli)

### 3. Template'ten PDF Page Wrapper'larını Kaldır

**Dosya:** `src/components/templates/Template1DetailedAnalysis.tsx`

- **Kaldırılacaklar:**
- `data-pdf-page="1-5"` attribute'ları ve `className="pdf-page avoid-break"` class'ları
- 5 adet `<div data-pdf-page="X" className="pdf-page avoid-break">` wrapper'ları ve kapanış tag'leri
- Sadece wrapper div'leri kaldırılacak, içerikler olduğu gibi kalacak

### 4. Export-PDF Route'unda Minimal Print CSS Inject

**Dosya:** `src/app/api/export-pdf/route.ts`

- **Değiştirilecek:** `page.goto` sonrası CSS inject kısmı
- **Yeni CSS (minimal):**
  ```css
        @media print {
    * {
            animation: none !important;
            transition: none !important;
          }
          
          /* Sadece büyük wrapper'lara break-inside */
          section, .hero, .profile {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
  ```




- **Kaldırılacaklar:**
- `@page` size override
- `color: black` zorlamaları
- `background: #fff` override'ları
- Font family zorlamaları
- Card, grid, text block'lara break-inside
- `print-color-adjust` (arka planlar için yeterli, ekstra gerek yok)
- **PDF ayarları:**
- `printBackground: true` (kalacak)
- `format: 'A4'` (kalacak)
- `preferCSSPageSize: true` (kalacak)
- `margin: 0mm` (kalacak - pdf-page padding olmadığı için)
- **Kaldırılacaklar:**
- `data-pdf-ready` selector wait (artık gerek yok)
- Viewport zorlaması (varsayılan viewport kullanılacak)

### 5. (Opsiyonel) Eski /api/pdf Route'unu Güncelle

**Dosya:** `src/app/api/pdf/route.ts`

- **Not:** Bu route şu an kullanılmıyor ama varsa gelecekte kullanılabilir
- **Aksiyon:** Aynı minimal CSS yaklaşımını burada da uygula (eğer route kullanılıyorsa)

## Doğrulama

- PDF düzgün görünmeli (arka planlar, renkler, layout korunmalı)
- Sayfa sayısı doğal olarak düşmeli (zorlamadan)
- Bölümler kaymamalı (büyük wrapper'lara break-inside sayesinde)
- Animasyonlar/transitions kapalı olmalı

## Notlar