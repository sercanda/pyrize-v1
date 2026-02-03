<<<<<<< HEAD
# SpecPulse Kullanım Rehberi

## ✅ Kurulum Tamamlandı!

SpecPulse başarıyla kuruldu ve projenize entegre edildi.

## 🚀 Hızlı Başlangıç

### SpecPulse Komutlarını Çalıştırma

SpecPulse PATH'te olmadığı için, komutları çalıştırmak için tam yolu kullanmanız gerekiyor:

```powershell
# SpecPulse versiyonunu kontrol et
C:\Users\90546\AppData\Local\Programs\Python\Python314\Scripts\specpulse.exe --version

# Veya kısayol script'i kullan (specpulse.ps1)
.\specpulse.ps1 --version
```

### Temel Komutlar

```powershell
# Yeni bir feature başlat
.\specpulse.ps1 pulse feature-name

# Specification oluştur
.\specpulse.ps1 spec "Feature açıklaması"

# Plan oluştur
.\specpulse.ps1 plan

# Task'ları göster
.\specpulse.ps1 task

# Task'ları çalıştır
.\specpulse.ps1 execute all

# Durum kontrolü
.\specpulse.ps1 status
```

## 📁 Oluşturulan Klasörler

SpecPulse şu klasörleri oluşturdu:

- `.specpulse/` - Ana SpecPulse klasörü
  - `specs/` - Specification'lar
  - `plans/` - Planlar
  - `tasks/` - Task'lar
  - `memory/` - Hafıza ve notlar
  - `templates/` - Şablonlar
  - `cache/` - Cache dosyaları
  - `docs/` - Dokümantasyon

- `.cursor/commands/` - Cursor AI komutları

## 🔧 PATH'e Ekleme (Opsiyonel)

SpecPulse'u PATH'e eklemek için:

1. **Sistem Özellikleri** → **Gelişmiş** → **Ortam Değişkenleri**
2. **Sistem Değişkenleri** altında **Path**'i seç
3. **Düzenle** → **Yeni**
4. Şu yolu ekle:
   ```
   C:\Users\90546\AppData\Local\Programs\Python\Python314\Scripts
   ```
5. **Tamam** → **Tamam** → **Tamam**
6. PowerShell'i yeniden başlat

PATH'e ekledikten sonra direkt `specpulse` komutunu kullanabilirsiniz.

## 📚 Daha Fazla Bilgi

- **GitHub:** https://github.com/specpulse/specpulse
- **Website:** https://specpulse.xyz
- **Dokümantasyon:** `.specpulse/docs/` klasöründe

## 🎯 Örnek Kullanım Senaryosu

```powershell
# 1. Yeni bir feature başlat
.\specpulse.ps1 pulse yeni-ozellik

# 2. Specification oluştur
.\specpulse.ps1 spec "Kullanıcı profil sayfası oluştur"

# 3. Plan oluştur
.\specpulse.ps1 plan

# 4. Task'ları görüntüle
.\specpulse.ps1 task

# 5. Task'ları çalıştır
.\specpulse.ps1 execute all

# 6. Durum kontrolü
.\specpulse.ps1 status
```

## ⚠️ Not

SpecPulse komutları Cursor AI ile entegre çalışır. Cursor'da `/sp-*` komutlarını kullanabilirsiniz:
- `/sp-pulse` - Yeni feature başlat
- `/sp-spec` - Specification oluştur
- `/sp-plan` - Plan oluştur
- `/sp-task` - Task'ları göster
- `/sp-execute` - Task'ları çalıştır
- `/sp-status` - Durum kontrolü

=======
# SpecPulse Kullanım Rehberi

## ✅ Kurulum Tamamlandı!

SpecPulse başarıyla kuruldu ve projenize entegre edildi.

## 🚀 Hızlı Başlangıç

### SpecPulse Komutlarını Çalıştırma

SpecPulse PATH'te olmadığı için, komutları çalıştırmak için tam yolu kullanmanız gerekiyor:

```powershell
# SpecPulse versiyonunu kontrol et
C:\Users\90546\AppData\Local\Programs\Python\Python314\Scripts\specpulse.exe --version

# Veya kısayol script'i kullan (specpulse.ps1)
.\specpulse.ps1 --version
```

### Temel Komutlar

```powershell
# Yeni bir feature başlat
.\specpulse.ps1 pulse feature-name

# Specification oluştur
.\specpulse.ps1 spec "Feature açıklaması"

# Plan oluştur
.\specpulse.ps1 plan

# Task'ları göster
.\specpulse.ps1 task

# Task'ları çalıştır
.\specpulse.ps1 execute all

# Durum kontrolü
.\specpulse.ps1 status
```

## 📁 Oluşturulan Klasörler

SpecPulse şu klasörleri oluşturdu:

- `.specpulse/` - Ana SpecPulse klasörü
  - `specs/` - Specification'lar
  - `plans/` - Planlar
  - `tasks/` - Task'lar
  - `memory/` - Hafıza ve notlar
  - `templates/` - Şablonlar
  - `cache/` - Cache dosyaları
  - `docs/` - Dokümantasyon

- `.cursor/commands/` - Cursor AI komutları

## 🔧 PATH'e Ekleme (Opsiyonel)

SpecPulse'u PATH'e eklemek için:

1. **Sistem Özellikleri** → **Gelişmiş** → **Ortam Değişkenleri**
2. **Sistem Değişkenleri** altında **Path**'i seç
3. **Düzenle** → **Yeni**
4. Şu yolu ekle:
   ```
   C:\Users\90546\AppData\Local\Programs\Python\Python314\Scripts
   ```
5. **Tamam** → **Tamam** → **Tamam**
6. PowerShell'i yeniden başlat

PATH'e ekledikten sonra direkt `specpulse` komutunu kullanabilirsiniz.

## 📚 Daha Fazla Bilgi

- **GitHub:** https://github.com/specpulse/specpulse
- **Website:** https://specpulse.xyz
- **Dokümantasyon:** `.specpulse/docs/` klasöründe

## 🎯 Örnek Kullanım Senaryosu

```powershell
# 1. Yeni bir feature başlat
.\specpulse.ps1 pulse yeni-ozellik

# 2. Specification oluştur
.\specpulse.ps1 spec "Kullanıcı profil sayfası oluştur"

# 3. Plan oluştur
.\specpulse.ps1 plan

# 4. Task'ları görüntüle
.\specpulse.ps1 task

# 5. Task'ları çalıştır
.\specpulse.ps1 execute all

# 6. Durum kontrolü
.\specpulse.ps1 status
```

## ⚠️ Not

SpecPulse komutları Cursor AI ile entegre çalışır. Cursor'da `/sp-*` komutlarını kullanabilirsiniz:
- `/sp-pulse` - Yeni feature başlat
- `/sp-spec` - Specification oluştur
- `/sp-plan` - Plan oluştur
- `/sp-task` - Task'ları göster
- `/sp-execute` - Task'ları çalıştır
- `/sp-status` - Durum kontrolü

>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
