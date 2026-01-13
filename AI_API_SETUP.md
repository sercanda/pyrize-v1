<<<<<<< HEAD
# AI API Konfigürasyonu

## Mevcut Durum

Proje şu anda **OpenRouter** ve **Google Gemini** API'lerini destekliyor.

## API Key Ekleme

Yeni AI API key'inizi eklemek için `.env.local` dosyasını oluşturun veya güncelleyin:

```env
# OpenRouter API (Öncelikli)
OPENROUTER_API_KEY=your_new_openrouter_api_key_here

# Google Gemini API (Fallback)
GEMINI_API_KEY=your_gemini_api_key_here
```

## API Kullanım Sırası

1. **OpenRouter** (öncelikli) - `OPENROUTER_API_KEY` varsa kullanılır
2. **Google Gemini** (fallback) - OpenRouter yoksa kullanılır
3. **Mock Mode** - Her ikisi de yoksa template verileri kullanılır

## Yeni API Ekleme

Yeni bir AI API eklemek için `src/lib/ai/gemini-service.ts` dosyasını düzenleyin:

1. Yeni API key'i environment variable olarak ekleyin
2. API çağrısı yapan fonksiyonu güncelleyin
3. Hata yönetimi ekleyin

## Not

API key'lerinizi asla commit etmeyin. `.env.local` dosyası `.gitignore` içinde olmalıdır.

=======
# AI API Konfigürasyonu

## Mevcut Durum

Proje şu anda **OpenRouter** ve **Google Gemini** API'lerini destekliyor.

## API Key Ekleme

Yeni AI API key'inizi eklemek için `.env.local` dosyasını oluşturun veya güncelleyin:

```env
# OpenRouter API (Öncelikli)
OPENROUTER_API_KEY=your_new_openrouter_api_key_here

# Google Gemini API (Fallback)
GEMINI_API_KEY=your_gemini_api_key_here
```

## API Kullanım Sırası

1. **OpenRouter** (öncelikli) - `OPENROUTER_API_KEY` varsa kullanılır
2. **Google Gemini** (fallback) - OpenRouter yoksa kullanılır
3. **Mock Mode** - Her ikisi de yoksa template verileri kullanılır

## Yeni API Ekleme

Yeni bir AI API eklemek için `src/lib/ai/gemini-service.ts` dosyasını düzenleyin:

1. Yeni API key'i environment variable olarak ekleyin
2. API çağrısı yapan fonksiyonu güncelleyin
3. Hata yönetimi ekleyin

## Not

API key'lerinizi asla commit etmeyin. `.env.local` dosyası `.gitignore` içinde olmalıdır.

>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
