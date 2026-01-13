/**
 * ZIP Template Normalizer
 * 
 * Google AI Studio'dan export edilen ZIP dosyalarındaki tasarım kaymalarını düzeltir.
 * Tüm ZIP template'leri normalize ederek sabit bir layout yapısına göre düzenler.
 */

export interface ZipNormalizationConfig {
  // Layout düzeltmeleri
  fixLayout: boolean;
  // Stil normalizasyonu
  normalizeStyles: boolean;
  // Responsive düzeltmeleri
  fixResponsive: boolean;
  // Font normalizasyonu
  normalizeFonts: boolean;
  // Renk normalizasyonu
  normalizeColors: boolean;
}

const DEFAULT_CONFIG: ZipNormalizationConfig = {
  fixLayout: true,
  normalizeStyles: true,
  fixResponsive: true,
  normalizeFonts: true,
  normalizeColors: true,
};

/**
 * ZIP içindeki HTML/CSS dosyalarını normalize eder
 */
export function normalizeZipContent(
  content: string,
  filePath: string,
  config: Partial<ZipNormalizationConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let normalized = content;

  // Sadece HTML ve CSS dosyalarını işle
  if (filePath.endsWith('.html') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    normalized = normalizeHtmlContent(normalized, finalConfig);
  } else if (filePath.endsWith('.css') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    normalized = normalizeCssContent(normalized, finalConfig);
  }

  return normalized;
}

/**
 * HTML içeriğini normalize eder
 */
function normalizeHtmlContent(html: string, config: ZipNormalizationConfig): string {
  let normalized = html;

  if (config.fixLayout) {
    // Container yapısını düzelt
    normalized = normalized.replace(
      /<div\s+class="[^"]*container[^"]*">/gi,
      '<div className="container mx-auto px-4 sm:px-6 lg:px-8">'
    );

    // Section yapısını düzelt
    normalized = normalized.replace(
      /<section\s+class="[^"]*section[^"]*">/gi,
      '<section className="py-12 md:py-16 lg:py-20">'
    );

    // Print break'leri ekle
    normalized = normalized.replace(
      /<section/gi,
      '<section className="print:break-inside-avoid"'
    );
  }

  if (config.normalizeStyles) {
    // Tailwind class'larını normalize et
    normalized = normalized.replace(/class=/gi, 'className=');
    
    // Inline style'ları temizle (Tailwind kullanılacak)
    normalized = normalized.replace(
      /\s+style="[^"]*"/gi,
      ''
    );
  }

  if (config.fixResponsive) {
    // Responsive breakpoint'leri ekle
    normalized = normalized.replace(
      /className="([^"]*w-full[^"]*)"/gi,
      'className="$1 print:w-full"'
    );
  }

  return normalized;
}

/**
 * CSS içeriğini normalize eder
 */
function normalizeCssContent(css: string, config: ZipNormalizationConfig): string {
  let normalized = css;

  if (config.normalizeFonts) {
    // Font family'leri normalize et
    normalized = normalized.replace(
      /font-family:\s*[^;]+;/gi,
      "font-family: system-ui, -apple-system, sans-serif;"
    );
  }

  if (config.normalizeColors) {
    // Renk değerlerini normalize et (dark theme için)
    normalized = normalized.replace(
      /background:\s*#[0-9a-fA-F]{3,6}/gi,
      (match) => {
        // Dark theme'e uygun renkler
        if (match.includes('#fff') || match.includes('#FFF') || match.includes('white')) {
          return 'background: rgb(2 6 23)'; // slate-950
        }
        return match;
      }
    );
  }

  if (config.fixLayout) {
    // Print media query'leri ekle
    if (!normalized.includes('@media print')) {
      normalized += `
@media print {
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  @page {
    size: A4;
    margin: 0;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  .print\\:break-inside-avoid {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  .print\\:break-after-page {
    break-after: page;
    page-break-after: always;
  }
}
`;
    }
  }

  return normalized;
}

/**
 * ZIP dosyasındaki tüm dosyaları normalize eder
 */
export async function normalizeZipFile(
  zipFile: File,
  config: Partial<ZipNormalizationConfig> = {}
): Promise<File> {
  // Bu fonksiyon client-side'da çalışacak
  // Server-side için ayrı bir implementasyon gerekebilir
  
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(zipFile);
  const normalizedZip = new JSZip();

  // Tüm dosyaları normalize et
  for (const [path, file] of Object.entries(zip.files)) {
    if (!file.dir) {
      const content = await file.async('string');
      const normalized = normalizeZipContent(content, path, config);
      normalizedZip.file(path, normalized);
    } else {
      normalizedZip.folder(path);
    }
  }

  // Yeni ZIP dosyası oluştur
  const blob = await normalizedZip.generateAsync({ type: 'blob' });
  return new File([blob], zipFile.name, { type: 'application/zip' });
}


