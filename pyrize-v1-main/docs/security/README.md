# API Güvenlik Standartları (security.prd)

Bu doküman, projedeki tüm servislerin uyması gereken minimum güvenlik ve maliyet kontrolü prensiplerini özetler. Kaynağı `security.prd.zip` içerisinde gelen PRD’dir ve sprint planlarına referans olması için buraya kalıcı olarak taşınmıştır.

## 🎯 Amaç
- İstemci tarafında (frontend, mobil, CLI vb.) hiçbir gizli anahtar (`API_KEY`, `SECRET`, `TOKEN`) bulunmamalı.
- Beklenmedik fatura artışlarının ve API kötüye kullanımının önüne geçilmeli.
- Ekstra vendor kilidi veya ağır alt yapılar kurmadan hafif ve izlenebilir çözümler tercih edilmeli.

## 🔒 Temel Kurallar
1. **İstemcide gizli anahtar yok:** Tüm anahtarlar yalnızca backend/proxy ortam değişkenlerinde tutulur.
2. **İş kuralları backend’de çalışır:** “Kredi düş”, “kullanıcıyı güncelle”, “ödemeyi doğrula” gibi işlemler istemci tarafında yapılamaz.
3. **Proxy mimarisi zorunlu:** Tüm üçüncü parti API çağrıları `Client → Backend → Provider` akışıyla yapılır. Doğrudan istemci → sağlayıcı çağrısı yasak.
4. **UUID/GUID kullanıcı kimlikleri:** `1, 2, 3…` gibi artan ID’ler yerine `46d11d86-25ab-4364-9644-28e888bd6574` formatı kullanılır.
5. **Harcama limiti (cap):** Günlük/aylık harcama limiti (ör. $10/gün) tanımlanır. Limit aşıldığında işlem sessizce reddedilir (`402 Limit Exceeded`).
6. **Token/payload sınırı:** Örneğin her istekte maksimum 2.000 token veya 200 KB veri.
7. **IP ve kullanıcı bazlı rate limit:** Örneğin IP başına 60 req/dk, kullanıcı başına 30 req/dk. Limit aşılırsa `429 Too Many Requests`.
8. **Secret rotasyonu:** API anahtarları 30–60 günde bir yenilenir; gerektiğinde manuel olarak kolayca iptal edilebilir olmalıdır.
9. **Build sırasında secret taraması:** Deploy öncesi `secret-scan ./src` benzeri bir tarama çalıştırılır; secret bulunursa build kırılır.
10. **Minimum loglama:** Loglar yalnızca gerekli alanları (istek tipi, IP, kullanıcı ID) içerir; ekstra izleme/alert sistemi şart değildir.

## ⚙️ Sistem Akışı (Özet)
1. **İstemci** `POST /api/do-action` gibi bir endpoint’e istekte bulunur.
2. **Backend**
   - Giriş payload’unu doğrular (`MAX_PAYLOAD`).
   - IP/kullanıcı rate limit kontrolü.
   - `estimateCost()` ile tahmini maliyet hesaplar.
   - Kullanıcının kalan bütçesini kontrol eder.
   - Limit aşılmadıysa sağlayıcıya çağrı yapar, gerçekleşen maliyeti düşer.
3. **Yanıt** sonucunda hata veya başarı durumu döner. Ekstra alert gerekmez.

```python
def handle_request(user, payload):
    if len(payload) > MAX_PAYLOAD:
        return 400  # Request too large

    if rate_limit_exceeded(user) or rate_limit_exceeded(ip):
        return 429  # Too many requests

    cost = estimate_cost(payload)

    if user.remaining_budget < cost:
        return 402  # Limit exceeded

    reserve_budget(user, cost)
    result, actual_cost = call_provider(payload)
    finalize_charge(user, actual_cost)
    return result
```

## Şimdiki Durum & Yapılacaklar
- [x] PRD dokümanı repoya dahil edildi.
- [x] Rate limit + payload sınırı + günlük harcama limiti için `withSecurity` wrapper’ı oluşturuldu ve kritik API’lere uygulandı (`/api/sunum/olustur`, `/api/sunum/duzenle`, `/api/ai/field`, `/api/lokasyon/analiz`).
- [x] CI pipeline’ına gitleaks tabanlı secret taraması eklendi (`.github/workflows/secret-scan.yml`).
- [ ] ENV rehberine (örn. `docs/ENVIRONMENT.md`) bu standartlara referans verilmeli.

> Not: CI/CD veya deploy pipeline’larında “geliştirici/QA” ortamı ile prod ortamı için limit değerleri ayrı konfigüre edilmelidir. PRD’deki limitler taban seviye öneridir; iş ihtiyacına göre güncellenebilir, ancak özde tüm kurallar (proxy, secrets, rate limit vb.) korunmalıdır.

