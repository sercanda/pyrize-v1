<<<<<<< HEAD
# API Key Kurulum Rehberi

## xAI Grok 4.1 Fast (Free) Modeli Kullanımı

Proje şu anda **xAI Grok 4.1 Fast (free)** modelini OpenRouter üzerinden kullanmaktadır.

## Adım 1: OpenRouter API Key Alın

1. [OpenRouter.ai](https://openrouter.ai/) sitesine gidin
2. Hesap oluşturun veya giriş yapın
3. [API Keys](https://openrouter.ai/keys) sayfasına gidin
4. "Create Key" butonuna tıklayın
5. API key'inizi kopyalayın

## Adım 2: .env.local Dosyasına Ekleyin

Proje kök dizininde `.env.local` dosyasını oluşturun veya açın:

```env
# OpenRouter API Key (ZORUNLU)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Gemini API (Opsiyonel - fallback için)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Adım 3: Dosyayı Kaydedin

`.env.local` dosyasını kaydedin. Bu dosya `.gitignore` içinde olduğu için git'e commit edilmeyecektir.

## Adım 4: Sunucuyu Yeniden Başlatın

Değişikliklerin etkili olması için development sunucusunu yeniden başlatın:

```bash
# Ctrl+C ile durdurun, sonra:
npm run dev
```

## Model Bilgileri

- **Model**: `x-ai/grok-4.1-fast:free`
- **Provider**: OpenRouter
- **Context Window**: 2,000,000 token
- **Fiyat**: Ücretsiz (free tier)
- **Özellikler**: 
  - Agentic tool calling
  - Reasoning desteği (opsiyonel)
  - 2M context window

## Kullanım Sırası

1. **OpenRouter** (öncelikli) - `OPENROUTER_API_KEY` varsa kullanılır
2. **Google Gemini** (fallback) - OpenRouter yoksa kullanılır
3. **Mock Mode** - Her ikisi de yoksa template verileri kullanılır

## Sorun Giderme

### API Key Çalışmıyor
- `.env.local` dosyasının proje kök dizininde olduğundan emin olun
- API key'in başında/sonunda boşluk olmadığından emin olun
- Sunucuyu yeniden başlattığınızdan emin olun

### Model Bulunamadı Hatası
- OpenRouter hesabınızın aktif olduğundan emin olun
- API key'inizin geçerli olduğundan emin olun
- Model adının `x-ai/grok-4.1-fast:free` olduğunu kontrol edin

## Notlar

- API key'lerinizi asla commit etmeyin
- `.env.local` dosyası `.gitignore` içinde olmalıdır
- Production ortamında environment variable'ları hosting sağlayıcınız üzerinden ayarlayın

=======
# API Key Kurulum Rehberi

## xAI Grok 4.1 Fast (Free) Modeli Kullanımı

Proje şu anda **xAI Grok 4.1 Fast (free)** modelini OpenRouter üzerinden kullanmaktadır.

## Adım 1: OpenRouter API Key Alın

1. [OpenRouter.ai](https://openrouter.ai/) sitesine gidin
2. Hesap oluşturun veya giriş yapın
3. [API Keys](https://openrouter.ai/keys) sayfasına gidin
4. "Create Key" butonuna tıklayın
5. API key'inizi kopyalayın

## Adım 2: .env.local Dosyasına Ekleyin

Proje kök dizininde `.env.local` dosyasını oluşturun veya açın:

```env
# OpenRouter API Key (ZORUNLU)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Gemini API (Opsiyonel - fallback için)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Adım 3: Dosyayı Kaydedin

`.env.local` dosyasını kaydedin. Bu dosya `.gitignore` içinde olduğu için git'e commit edilmeyecektir.

## Adım 4: Sunucuyu Yeniden Başlatın

Değişikliklerin etkili olması için development sunucusunu yeniden başlatın:

```bash
# Ctrl+C ile durdurun, sonra:
npm run dev
```

## Model Bilgileri

- **Model**: `x-ai/grok-4.1-fast:free`
- **Provider**: OpenRouter
- **Context Window**: 2,000,000 token
- **Fiyat**: Ücretsiz (free tier)
- **Özellikler**: 
  - Agentic tool calling
  - Reasoning desteği (opsiyonel)
  - 2M context window

## Kullanım Sırası

1. **OpenRouter** (öncelikli) - `OPENROUTER_API_KEY` varsa kullanılır
2. **Google Gemini** (fallback) - OpenRouter yoksa kullanılır
3. **Mock Mode** - Her ikisi de yoksa template verileri kullanılır

## Sorun Giderme

### API Key Çalışmıyor
- `.env.local` dosyasının proje kök dizininde olduğundan emin olun
- API key'in başında/sonunda boşluk olmadığından emin olun
- Sunucuyu yeniden başlattığınızdan emin olun

### Model Bulunamadı Hatası
- OpenRouter hesabınızın aktif olduğundan emin olun
- API key'inizin geçerli olduğundan emin olun
- Model adının `x-ai/grok-4.1-fast:free` olduğunu kontrol edin

## Notlar

- API key'lerinizi asla commit etmeyin
- `.env.local` dosyası `.gitignore` içinde olmalıdır
- Production ortamında environment variable'ları hosting sağlayıcınız üzerinden ayarlayın

>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
