import { MulkBilgileri } from '@/types';

// xlsx sadece server-side kullanılacak
let XLSX: any = null;
if (typeof window === 'undefined') {
  try {
    XLSX = require('xlsx');
  } catch (e) {
    // xlsx yoksa sadece JSON kullanılacak
  }
}

// NUTS2 Bölge Mapping - İl/İlçe'den bölge koduna
const IL_TO_NUTS2: Record<string, string> = {
  // TR10 - İstanbul
  'istanbul': 'TR10',

  // TR51 - Ankara
  'ankara': 'TR51',

  // TR31 - İzmir
  'izmir': 'TR31',

  // TR21 - Tekirdağ
  'edirne': 'TR21',
  'kırklareli': 'TR21',
  'tekirdağ': 'TR21',
  'tekirdag': 'TR21',

  // TR22 - Balıkesir
  'balıkesir': 'TR22',
  'balikesir': 'TR22',
  'çanakkale': 'TR22',
  'canakkale': 'TR22',

  // TR32 - Aydın
  'aydın': 'TR32',
  'aydin': 'TR32',
  'denizli': 'TR32',
  'muğla': 'TR32',
  'mugla': 'TR32',

  // TR33 - Manisa
  'afyonkarahisar': 'TR33',
  'afyon': 'TR33',
  'kütahya': 'TR33',
  'kutahya': 'TR33',
  'manisa': 'TR33',
  'uşak': 'TR33',
  'usak': 'TR33',

  // TR41 - Bursa
  'bursa': 'TR41',
  'eskişehir': 'TR41',
  'eskisehir': 'TR41',
  'bilecik': 'TR41',

  // TR42 - Kocaeli
  'bolu': 'TR42',
  'kocaeli': 'TR42',
  'sakarya': 'TR42',
  'yalova': 'TR42',
  'düzce': 'TR42',
  'duzce': 'TR42',

  // TR52 - Konya
  'konya': 'TR52',
  'karaman': 'TR52',

  // TR61 - Antalya
  'antalya': 'TR61',
  'burdur': 'TR61',
  'isparta': 'TR61',

  // TR62 - Adana
  'adana': 'TR62',
  'mersin': 'TR62',
  'içel': 'TR62',
  'icel': 'TR62',

  // TR63 - Hatay
  'hatay': 'TR63',
  'kahramanmaraş': 'TR63',
  'kahramanmaras': 'TR63',
  'osmaniye': 'TR63',

  // TR7 - Kayseri
  'nevşehir': 'TR7',
  'nevsehir': 'TR7',
  'niğde': 'TR7',
  'nigde': 'TR7',
  'kırıkkale': 'TR7',
  'kirikkale': 'TR7',
  'kırşehir': 'TR7',
  'kirsehir': 'TR7',
  'aksaray': 'TR7',
  'kayseri': 'TR7',
  'sivas': 'TR7',
  'yozgat': 'TR7',

  // TR8 - Samsun
  'zonguldak': 'TR8',
  'karabük': 'TR8',
  'karabuk': 'TR8',
  'bartın': 'TR8',
  'bartin': 'TR8',
  'kastamonu': 'TR8',
  'çankırı': 'TR8',
  'cankiri': 'TR8',
  'sinop': 'TR8',
  'samsun': 'TR8',
  'tokat': 'TR8',
  'çorum': 'TR8',
  'corum': 'TR8',
  'amasya': 'TR8',

  // TR9 - Trabzon
  'trabzon': 'TR9',
  'ordu': 'TR9',
  'giresun': 'TR9',
  'rize': 'TR9',
  'artvin': 'TR9',
  'gümüşhane': 'TR9',
  'gumushane': 'TR9',

  // TRA - Erzurum
  'erzurum': 'TRA',
  'erzincan': 'TRA',
  'bayburt': 'TRA',
  'ağrı': 'TRA',
  'agri': 'TRA',
  'kars': 'TRA',
  'ığdır': 'TRA',
  'igdir': 'TRA',
  'ardahan': 'TRA',

  // TRB - Malatya
  'malatya': 'TRB',
  'elazığ': 'TRB',
  'elazig': 'TRB',
  'bingöl': 'TRB',
  'bingol': 'TRB',
  'tunceli': 'TRB',
  'van': 'TRB',
  'muş': 'TRB',
  'mus': 'TRB',
  'bitlis': 'TRB',
  'hakkari': 'TRB',

  // TRC - Gaziantep
  'gaziantep': 'TRC',
  'adıyaman': 'TRC',
  'adiyaman': 'TRC',
  'kilis': 'TRC',
  'şanlıurfa': 'TRC',
  'sanliurfa': 'TRC',
  'diyarbakır': 'TRC',
  'diyarbakir': 'TRC',
  'mardin': 'TRC',
  'batman': 'TRC',
  'şırnak': 'TRC',
  'sirnak': 'TRC',
  'siirt': 'TRC',
};

// JSON'dan veri okuma ve cache
let kfeDataCache: Record<string, any> | null = null;

/**
 * JSON dosyasından KFE verilerini yükler ve cache'ler
 */
function loadKFEData(): Record<string, any> {
  if (kfeDataCache) {
    return kfeDataCache;
  }

  try {
    // Node.js ortamında (server-side)
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');

      // Önce JSON dosyasını dene
      const jsonPath = path.join(process.cwd(), 'src', 'lib', 'utils', 'kfe-data.json');
      if (fs.existsSync(jsonPath)) {
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        kfeDataCache = JSON.parse(jsonData);
        return kfeDataCache ?? {};
      }

      // JSON yoksa Excel'i dene (fallback)
      const excelPath = path.join(process.cwd(), 'src', 'lib', 'utils', 'EVDS.xlsx');
      if (fs.existsSync(excelPath)) {
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        kfeDataCache = parseExcelData(data);
        return kfeDataCache;
      }

      console.warn('KFE veri dosyası bulunamadı. JSON veya Excel dosyası gerekli.');
      return {};
    } else {
      // Browser ortamında - API endpoint kullanılmalı
      console.warn('Browser ortamında KFE verisi yüklenemiyor. API endpoint kullanın.');
      return {};
    }
  } catch (error) {
    console.error('KFE verisi yüklenirken hata:', error);
    return {};
  }
}

/**
 * Excel verisini parse eder ve kullanılabilir formata çevirir
 */
function parseExcelData(data: any[][]): Record<string, any> {
  const result: Record<string, any> = {};

  if (!data || data.length === 0) {
    return result;
  }

  // İlk satır header olmalı
  const headers = data[0] || [];
  const dateColumnIndex = headers.findIndex((h: any) =>
    typeof h === 'string' && (h.toLowerCase().includes('tarih') || h.toLowerCase().includes('date'))
  );

  // Her sütun bir veri serisi
  for (let colIndex = 1; colIndex < headers.length; colIndex++) {
    const seriesCode = headers[colIndex];
    if (!seriesCode || typeof seriesCode !== 'string') continue;

    const seriesData: Array<{ tarih: string; deger: number }> = [];

    // Veri satırlarını oku
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      if (!row || row.length <= colIndex) continue;

      const tarih = dateColumnIndex >= 0 ? row[dateColumnIndex] : null;
      const deger = row[colIndex];

      if (tarih && (typeof deger === 'number' || (typeof deger === 'string' && deger.trim()))) {
        const numericValue = typeof deger === 'number' ? deger : parseFloat(deger);
        if (!isNaN(numericValue)) {
          seriesData.push({
            tarih: String(tarih),
            deger: numericValue,
          });
        }
      }
    }

    if (seriesData.length > 0) {
      result[seriesCode] = seriesData;
    }
  }

  return result;
}

/**
 * İl/İlçe bilgisinden NUTS2 bölge kodunu bulur
 */
export function getNUTS2RegionCode(konum: string | undefined): string {
  if (!konum) return 'TR'; // Default: Türkiye geneli

  const normalized = konum
    .toLowerCase()
    .trim()
    .replace(/[ıİ]/g, 'i')
    .replace(/[şŞ]/g, 's')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c');

  // Virgülle ayrılmış konum bilgisi (örn: "İstanbul, Kadıköy")
  const parts = normalized.split(',').map(p => p.trim());
  const il = parts[0];

  // Direkt eşleşme
  if (IL_TO_NUTS2[il]) {
    return IL_TO_NUTS2[il];
  }

  // Kısmi eşleşme (örn: "istanbul" içinde "istanbul" geçiyor mu?)
  for (const [key, value] of Object.entries(IL_TO_NUTS2)) {
    if (il.includes(key) || key.includes(il)) {
      return value;
    }
  }

  // Bulunamazsa Türkiye geneli
  return 'TR';
}

/**
 * KFE veri serisi kodunu oluşturur
 * @param regionCode NUTS2 bölge kodu (örn: TR10, TR31)
 * @param formula Formül kodu (boş = düzey, -3 = yıllık %, -5 = YTD %)
 */
function getKFESeriesCode(regionCode: string, formula: string = ''): string {
  const baseCode = regionCode === 'TR' ? 'TP.KFE.TR' : `TP.KFE.${regionCode}`;
  return formula ? `${baseCode}${formula}` : baseCode;
}

/**
 * Belirli bir bölge ve formül için KFE verisini getirir
 */
export function getKFEData(regionCode: string, formula: string = ''): Array<{ tarih: string; deger: number }> {
  const data = loadKFEData();
  const seriesCode = getKFESeriesCode(regionCode, formula);
  return data[seriesCode] || [];
}

/**
 * En son KFE değerini getirir
 */
export function getLatestKFEData(regionCode: string, formula: string = ''): number | null {
  const data = getKFEData(regionCode, formula);
  if (data.length === 0) return null;

  // En son tarihli veri
  const sorted = [...data].sort((a, b) => {
    const dateA = new Date(a.tarih);
    const dateB = new Date(b.tarih);
    return dateB.getTime() - dateA.getTime();
  });

  return sorted[0]?.deger ?? null;
}

/**
 * Mülk bilgilerinden KFE verilerini getirir (AI için hazır format)
 */
export function getKFEForProperty(mulk: MulkBilgileri): {
  turkiye: {
    duzey: number | null;
    yillikDegisim: number | null;
    ytdDegisim: number | null;
  };
  bolge: {
    duzey: number | null;
    yillikDegisim: number | null;
    ytdDegisim: number | null;
    regionCode: string;
  };
} {
  const regionCode = getNUTS2RegionCode(mulk.konum);

  return {
    turkiye: {
      duzey: getLatestKFEData('TR', ''),
      yillikDegisim: getLatestKFEData('TR', '-3'),
      ytdDegisim: getLatestKFEData('TR', '-5'),
    },
    bolge: {
      duzey: getLatestKFEData(regionCode, ''),
      yillikDegisim: getLatestKFEData(regionCode, '-3'),
      ytdDegisim: getLatestKFEData(regionCode, '-5'),
      regionCode,
    },
  };
}

/**
 * KFE verisini AI prompt'una uygun formatta metne çevirir
 */
export function formatKFEForPrompt(kfeData: ReturnType<typeof getKFEForProperty>): string {
  const { turkiye, bolge } = kfeData;

  let text = '\n## KONUT FİYAT ENDEKSİ (KFE) VERİLERİ\n\n';
  text += '**Türkiye Geneli:**\n';
  if (turkiye.yillikDegisim !== null) {
    text += `- Son 12 ay fiyat artışı: %${turkiye.yillikDegisim.toFixed(1)}\n`;
  }
  if (turkiye.ytdDegisim !== null) {
    text += `- Yılbaşından bugüne (YTD): %${turkiye.ytdDegisim.toFixed(1)}\n`;
  }

  text += `\n**${bolge.regionCode} Bölgesi:**\n`;
  if (bolge.yillikDegisim !== null) {
    text += `- Son 12 ay fiyat artışı: %${bolge.yillikDegisim.toFixed(1)}\n`;
  }
  if (bolge.ytdDegisim !== null) {
    text += `- Yılbaşından bugüne (YTD): %${bolge.ytdDegisim.toFixed(1)}\n`;
  }

  if (bolge.yillikDegisim !== null && turkiye.yillikDegisim !== null) {
    const fark = bolge.yillikDegisim - turkiye.yillikDegisim;
    const durum = fark > 0 ? 'yüksek' : 'düşük';
    text += `\n**Karşılaştırma:** Bölge performansı Türkiye ortalamasından **${Math.abs(fark).toFixed(1)} puan ${durum}**.\n`;
  }

  text += '\nBu verileri "Veriye Dayalı Piyasa Analizi" bölümünde kullan. Rakamsal verileri doğru şekilde sunum içeriğine entegre et.\n';

  return text;
}

