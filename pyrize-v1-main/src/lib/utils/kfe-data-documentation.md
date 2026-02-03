# KFE (Konut Fiyat Endeksi) Veri Kodları Dokümantasyonu

Bu dokümantasyon, TCMB EVDS'den alınan Konut Fiyat Endeksi (KFE) veri kodlarının anlamlarını açıklar.

## Veri Serisi Formatı

Her veri serisi şu formatta kodlanmıştır:
- `TP.KFE.{BÖLGE}-{FORMÜL}`

### Bölge Kodları (NUTS2)

| Kod | Bölge | İller |
|-----|-------|-------|
| `TR` | Türkiye Geneli | Tüm Türkiye |
| `TR10` | İstanbul | İstanbul |
| `TR51` | Ankara | Ankara |
| `TR31` | İzmir | İzmir |
| `TR21` | Tekirdağ | Edirne, Kırklareli, Tekirdağ |
| `TR22` | Balıkesir | Balıkesir, Çanakkale |
| `TR32` | Aydın | Aydın, Denizli, Muğla |
| `TR33` | Manisa | Afyonkarahisar, Kütahya, Manisa, Uşak |
| `TR41` | Bursa | Bursa, Eskişehir, Bilecik |
| `TR42` | Kocaeli | Bolu, Kocaeli, Sakarya, Yalova, Düzce |
| `TR52` | Konya | Konya, Karaman |
| `TR61` | Antalya | Antalya, Burdur, Isparta |
| `TR62` | Adana | Adana, Mersin |
| `TR63` | Hatay | Hatay, Kahramanmaraş, Osmaniye |
| `TR7` | Kayseri | Nevşehir, Niğde, Kırıkkale, Kırşehir, Aksaray, Kayseri, Sivas, Yozgat |
| `TR8` | Samsun | Zonguldak, Karabük, Bartın, Kastamonu, Çankırı, Sinop, Samsun, Tokat, Çorum, Amasya |
| `TR9` | Trabzon | Trabzon, Ordu, Giresun, Rize, Artvin, Gümüşhane |
| `TRA` | Erzurum | Erzurum, Erzincan, Bayburt, Ağrı, Kars, Iğdır, Ardahan |
| `TRB` | Malatya | Malatya, Elazığ, Bingöl, Tunceli, Van, Muş, Bitlis, Hakkari |
| `TRC` | Gaziantep | Gaziantep, Adıyaman, Kilis, Şanlıurfa, Diyarbakır, Mardin, Batman, Şırnak, Siirt |

### Formül Kodları

| Kod | Formül Adı | Açıklama | Kullanım Önerisi |
|-----|------------|----------|------------------|
| (boş) | Düzey | Endeks değeri (2023=100 bazlı) | ✅ **ÖNERİLEN** - Grafikler için ideal |
| `-1` | Önceki Döneme Göre Yüzde Değişim | Bir önceki aya göre % değişim | ⚠️ Kısa vadeli, volatil |
| `-2` | Fark | Bir önceki döneme göre mutlak fark | ❌ Kullanmayın |
| `-3` | Yıllık Yüzde Değişim | Geçen yılın aynı ayına göre % değişim | ✅ **ÖNERİLEN** - Pazarlama için en güçlü |
| `-4` | Yıllık Fark | Geçen yılın aynı ayına göre mutlak fark | ❌ Kullanmayın |
| `-5` | Bir Önceki Yıl Sonuna Göre Yüzde Değişim | Yılbaşından bugüne % değişim (YTD) | ✅ **ÖNERİLEN** - Yıl performansı için |
| `-6` | Bir Önceki Yıl Sonuna Göre Fark | Yılbaşından bugüne mutlak fark | ❌ Kullanmayın |
| `-7` | Hareketli Ortalama | Yumuşatılmış trend | ✅ Grafiklerde destekleyici |
| `-8` | Hareketli Toplam | Toplam değer | ❌ Kullanmayın |

## Örnek Veri Serileri

### Türkiye Geneli
- `TP.KFE.TR` - Türkiye geneli endeks düzeyi
- `TP.KFE.TR-3` - Türkiye geneli yıllık % değişim
- `TP.KFE.TR-5` - Türkiye geneli yılbaşından bugüne % değişim

### İstanbul
- `TP.KFE.TR10` - İstanbul endeks düzeyi
- `TP.KFE.TR10-3` - İstanbul yıllık % değişim
- `TP.KFE.TR10-5` - İstanbul yılbaşından bugüne % değişim

### Diğer Bölgeler
Aynı format tüm bölgeler için geçerlidir.

## Kullanım Senaryoları

### Senaryo 1: Sunum İçin Veri Çekme
```typescript
// Mülk konumu: "İstanbul, Kadıköy"
// Çekilecek veriler:
// - TP.KFE.TR (Türkiye geneli düzey)
// - TP.KFE.TR-3 (Türkiye geneli yıllık %)
// - TP.KFE.TR10 (İstanbul düzey)
// - TP.KFE.TR10-3 (İstanbul yıllık %)
// - TP.KFE.TR10-5 (İstanbul YTD %)
```

### Senaryo 2: AI Prompt'una Veri Enjeksiyonu
```typescript
const kfeData = {
  turkiye: {
    duzey: 125.4,
    yillikDegisim: 18.4,
    ytdDegisim: 9.2
  },
  bolge: {
    duzey: 132.1,
    yillikDegisim: 22.1,
    ytdDegisim: 11.5
  }
};

// AI prompt'una:
// "İstanbul bölgesinde konut fiyatları son 12 ayda %22.1 artmıştır. 
// Bu artış, Türkiye genel ortalamasından (%18.4) yüksek bir performans göstermektedir."
```

## Notlar

- Tüm endeksler **2023=100** bazlıdır
- Veriler **aylık** frekanstadır
- Son güncel veri için TCMB EVDS'i kontrol edin
- Excel dosyası güncel tutulmalıdır

