# Kredi Bazlı Ücretlendirme Taslağı

## Genel Bakış
- **Ürünler**  
  - `Sunum Oluşturma` → 2 kredi  
  - `Fotoğraf Düzenleme / Oda Doldurma` → 1 kredi  
  - `Sınırsız Erişim` → 30 USD (≈ güncel kurla TL)
- **Paketler (Kredi)**  
  - `5 kredi` → 300 TL  
  - `10 kredi` → 550 TL  
  - Gerektiğinde dinamik fiyat listesine yeni paket eklenebilir.

## Veri Modeli Önerisi (Supabase / Postgres)

### Tablo: `users`
| Alan             | Tip          | Açıklama                               |
|------------------|--------------|----------------------------------------|
| `id`             | uuid (PK)    | Supabase Auth ile uyumlu kimlik        |
| `email`          | text         | Kullanıcı e-postası                    |
| `credits`        | int          | Aktif kredi bakiyesi                   |
| `unlimited_until`| timestamptz  | Sınırsız plan bitiş tarihi (nullable)  |
| `created_at`     | timestamptz  | Sistem kayıt tarihi                    |

### Tablo: `credit_packages`
| Alan        | Tip         | Açıklama                          |
|-------------|-------------|-----------------------------------|
| `id`        | uuid (PK)   | Paket kimliği                     |
| `name`      | text        | Görünen paket adı (örn. 5 Kredi)  |
| `credits`   | int         | Paket kredi adedi                 |
| `price_try` | numeric     | TL fiyatı                         |
| `is_active` | boolean     | Paket satışta mı                  |
| `sort_order`| int         | UI sıralaması                     |
| `created_at`| timestamptz | Oluşturulma tarihi                |

### Tablo: `transactions`
| Alan             | Tip         | Açıklama                                                |
|------------------|-------------|---------------------------------------------------------|
| `id`             | uuid (PK)   | İşlem kimliği                                          |
| `user_id`        | uuid        | `users.id` FK                                           |
| `type`           | text        | `purchase`, `spend`, `refund`                          |
| `credits_delta`  | int         | Artı/eksi kredi değişimi                               |
| `amount_try`     | numeric     | Ödeme tutarı (TL, yalnızca purchase)                   |
| `payment_ref`    | text        | Ödeme sağlayıcısı referansı (ör. Iyzico/Stripe id)     |
| `meta`           | jsonb       | İşlemle ilgili ek veriler (ör. sunum id, paket id)     |
| `created_at`     | timestamptz | İşlem zamanı                                            |

### Tablo: `unlimited_plans`
| Alan             | Tip         | Açıklama                                      |
|------------------|-------------|-----------------------------------------------|
| `id`             | uuid (PK)   | Plan kimliği                                  |
| `user_id`        | uuid        | `users.id` FK                                 |
| `status`         | text        | `active`, `canceled`, `expired`               |
| `started_at`     | timestamptz | Başlangıç tarihi                              |
| `expires_at`     | timestamptz | Bitiş tarihi                                  |
| `payment_ref`    | text        | Abonelik ödeme referansı                      |
| `created_at`     | timestamptz | Kayıt tarihi                                  |

> Not: Sınırsız plan için sadece `users.unlimited_until` alanı kullanılacaksa `unlimited_plans` tablosu opsiyoneldir; ancak abonelik geçmişini saklamak için tavsiye edilir.

## API Akışı (Next.js App Routes)
- `POST /api/billing/checkout` → Paket veya sınırsız plan seçimini ödeme sağlayıcısına yönlendirir; beklenen parametre: `packageId` veya `planType`.
- `POST /api/billing/webhook` → Ödeme sağlayıcıdan gelen onay/iptal bildirimlerini işleyip `transactions` tablosuna kayıt ve kredi güncellemesi yapar.
- `GET /api/billing/balance` → Kullanıcının mevcut kredi ve sınırsız durumunu döner.
- `POST /api/usage/sunum` → Sunum üretmeden önce kredi kontrolü, yettiğinde 2 kredi düşüp işlem geçmişine kayıt.
- `POST /api/usage/image` → Fotoğraf düzenleme için kredi kontrolü, 1 kredi düşme işlemi.

## UI Akışı (Dashboard)
- **Kredi Durumu Banner**: En üstte “Mevcut kredi: X” ve “Sınırsız erişim: aktif/pasif” bilgisi.  
- **Paket Kartları**: `5 kredi`, `10 kredi`, `Sınırsız (30 USD)` kartları ve “Satın Al” butonları.  
- **İşlem Geçmişi Tablosu**: Son 10 hareket (paket satın alma, kullanım).  
- **Kullanım Ekranları**: Sunum veya fotoğraf işlemine girildiğinde yeterli kredi yoksa modal ile “Kredi satın al” yönlendirmesi.

## Ödeme Entegrasyonu
- Stripe (USD) veya Iyzico/PayTR (TL) arasından seçim yapılmalı.  
- Webhook doğrulaması için `SIGNING_SECRET` değerleri `.env`’e eklenmeli.  
- Başarılı ödeme sonrası:  
  - Kredi paketinde `users.credits += package.credits`.  
  - Sınırsız pakette `users.unlimited_until = now + 30 gün`.  
  - Tüm aksiyonlar `transactions` ve opsiyonel `unlimited_plans` tablosuna yazılır.

## Hatırlatmalar
- Çoklu cihaz desteği için kredi bakiyesini frontend’de değil backend’de doğrula.  
- Fal.ai kullanımı öncesi kredi düşümünü tetikle; servis başarısız olursa `transactions`’a ters kayıt (refund) at.  
- Son kullanıcıya fiyatları TL göster, USD plan için kur bilgisini açıklamada belirt.

