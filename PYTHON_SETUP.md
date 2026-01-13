<<<<<<< HEAD
# Python ve SpecPulse Kurulum Rehberi

## 1. Python Kurulumu (Windows)

### Yöntem 1: Python.org'dan İndirme (Önerilen)

1. **Python İndir:**
   - https://www.python.org/downloads/ adresine git
   - "Download Python 3.12.x" butonuna tıkla (en son sürüm)

2. **Kurulum:**
   - İndirilen `.exe` dosyasını çalıştır
   - ⚠️ **ÖNEMLİ:** "Add Python to PATH" seçeneğini işaretle
   - "Install Now" butonuna tıkla
   - Kurulum tamamlanana kadar bekle

3. **Kurulumu Doğrula:**
   - Yeni bir PowerShell/Terminal penceresi aç
   - Şu komutu çalıştır:
     ```bash
     python --version
     ```
   - Python 3.12.x gibi bir sürüm numarası görmelisin

### Yöntem 2: Microsoft Store'dan Kurulum

1. Microsoft Store'u aç
2. "Python 3.12" veya "Python 3.11" ara
3. "Python Software Foundation" tarafından yayınlananı seç
4. "Get" veya "Install" butonuna tıkla
5. Kurulum tamamlanana kadar bekle

## 2. SpecPulse Kurulumu

Python kurulduktan sonra:

```bash
# SpecPulse'u kur
pip install specpulse

# Kurulumu doğrula
specpulse --version
```

## 3. Projeye Entegrasyon

```bash
# Proje dizininde SpecPulse'u başlat
cd D:\pyrize
specpulse init --here --ai claude

# Veya Cursor AI için
specpulse init --here --ai cursor
```

## 4. Kullanım

SpecPulse komutları:

```bash
# Yeni bir feature başlat
/sp-pulse feature-name

# Specification oluştur
/sp-spec "Feature açıklaması"

# Plan oluştur
/sp-plan

# Task'ları göster
/sp-task

# Task'ları çalıştır
/sp-execute all

# Durum kontrolü
/sp-status
```

## Sorun Giderme

### Python bulunamıyor hatası:
- PowerShell'i **yönetici olarak** aç
- Python'u yeniden kur ve "Add to PATH" seçeneğini işaretle
- Bilgisayarı yeniden başlat

### pip bulunamıyor hatası:
```bash
python -m ensurepip --upgrade
python -m pip install --upgrade pip
```

### SpecPulse kurulum hatası:
```bash
python -m pip install --upgrade pip
pip install specpulse
```

=======
# Python ve SpecPulse Kurulum Rehberi

## 1. Python Kurulumu (Windows)

### Yöntem 1: Python.org'dan İndirme (Önerilen)

1. **Python İndir:**
   - https://www.python.org/downloads/ adresine git
   - "Download Python 3.12.x" butonuna tıkla (en son sürüm)

2. **Kurulum:**
   - İndirilen `.exe` dosyasını çalıştır
   - ⚠️ **ÖNEMLİ:** "Add Python to PATH" seçeneğini işaretle
   - "Install Now" butonuna tıkla
   - Kurulum tamamlanana kadar bekle

3. **Kurulumu Doğrula:**
   - Yeni bir PowerShell/Terminal penceresi aç
   - Şu komutu çalıştır:
     ```bash
     python --version
     ```
   - Python 3.12.x gibi bir sürüm numarası görmelisin

### Yöntem 2: Microsoft Store'dan Kurulum

1. Microsoft Store'u aç
2. "Python 3.12" veya "Python 3.11" ara
3. "Python Software Foundation" tarafından yayınlananı seç
4. "Get" veya "Install" butonuna tıkla
5. Kurulum tamamlanana kadar bekle

## 2. SpecPulse Kurulumu

Python kurulduktan sonra:

```bash
# SpecPulse'u kur
pip install specpulse

# Kurulumu doğrula
specpulse --version
```

## 3. Projeye Entegrasyon

```bash
# Proje dizininde SpecPulse'u başlat
cd D:\pyrize
specpulse init --here --ai claude

# Veya Cursor AI için
specpulse init --here --ai cursor
```

## 4. Kullanım

SpecPulse komutları:

```bash
# Yeni bir feature başlat
/sp-pulse feature-name

# Specification oluştur
/sp-spec "Feature açıklaması"

# Plan oluştur
/sp-plan

# Task'ları göster
/sp-task

# Task'ları çalıştır
/sp-execute all

# Durum kontrolü
/sp-status
```

## Sorun Giderme

### Python bulunamıyor hatası:
- PowerShell'i **yönetici olarak** aç
- Python'u yeniden kur ve "Add to PATH" seçeneğini işaretle
- Bilgisayarı yeniden başlat

### pip bulunamıyor hatası:
```bash
python -m ensurepip --upgrade
python -m pip install --upgrade pip
```

### SpecPulse kurulum hatası:
```bash
python -m pip install --upgrade pip
pip install specpulse
```

>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
