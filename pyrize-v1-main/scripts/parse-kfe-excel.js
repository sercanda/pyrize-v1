const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excel dosyasını oku
const excelPath = path.join(__dirname, '..', 'src', 'lib', 'utils', 'EVDS.xlsx');
const outputPath = path.join(__dirname, '..', 'src', 'lib', 'utils', 'kfe-data.json');

if (!fs.existsSync(excelPath)) {
  console.error('EVDS.xlsx dosyası bulunamadı:', excelPath);
  process.exit(1);
}

console.log('Excel dosyası okunuyor...');
const workbook = XLSX.readFile(excelPath);

// Tüm sheet'leri işle
const allData = {};

workbook.SheetNames.forEach((sheetName) => {
  console.log(`Sheet işleniyor: ${sheetName}`);
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

  if (data.length === 0) {
    console.log(`  ⚠️ Sheet boş: ${sheetName}`);
    return;
  }

  console.log(`  📊 Toplam ${data.length} satır bulundu`);
  console.log(`  📋 İlk satır örneği:`, data[0]?.slice(0, 5));

  // İlk satır header
  const headers = data[0] || [];
  console.log(`  📝 Header sayısı: ${headers.length}`);
  
  // Tarih sütununu bul
  const dateColumnIndex = headers.findIndex((h) => {
    if (!h) return false;
    const hStr = String(h).toLowerCase();
    return hStr.includes('tarih') || hStr.includes('date') || hStr.includes('time');
  });

  // Her sütun bir veri serisi
  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const seriesCode = headers[colIndex];
    if (!seriesCode) continue;

    let seriesCodeStr = String(seriesCode).trim();
    
    // "TP KFE TR" formatını "TP.KFE.TR" formatına çevir
    if (seriesCodeStr.includes('TP') && seriesCodeStr.includes('KFE')) {
      seriesCodeStr = seriesCodeStr.replace(/\s+/g, '.').replace(/TP\.KFE/gi, 'TP.KFE');
    }
    
    // TP.KFE ile başlayan sütunları al
    if (!seriesCodeStr || !seriesCodeStr.toUpperCase().startsWith('TP.KFE')) {
      continue;
    }

    const seriesData = [];

    // Veri satırlarını oku
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      if (!row || row.length <= colIndex) continue;

      let tarih = null;
      if (dateColumnIndex >= 0 && row[dateColumnIndex]) {
        // Excel tarih formatını parse et
        const excelDate = row[dateColumnIndex];
        if (typeof excelDate === 'number') {
          // Excel serial date
          const date = XLSX.SSF.parse_date_code(excelDate);
          tarih = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        } else {
          tarih = String(excelDate);
        }
      }

      const deger = row[colIndex];

      if (tarih && (typeof deger === 'number' || (typeof deger === 'string' && deger.trim()))) {
        const numericValue = typeof deger === 'number' ? deger : parseFloat(String(deger).replace(/,/g, '.'));
        if (!isNaN(numericValue) && isFinite(numericValue)) {
          seriesData.push({
            tarih,
            deger: numericValue,
          });
        }
      }
    }

    if (seriesData.length > 0) {
      allData[seriesCodeStr] = seriesData;
      console.log(`  ✓ ${seriesCodeStr}: ${seriesData.length} kayıt`);
    }
  }
});

// JSON'a kaydet
fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2), 'utf-8');
console.log(`\n✅ Veri başarıyla parse edildi ve kaydedildi: ${outputPath}`);
console.log(`📊 Toplam ${Object.keys(allData).length} veri serisi işlendi.`);

