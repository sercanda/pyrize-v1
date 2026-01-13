# =============================================================
# SUPABASE CONFIGURATION
# =============================================================
SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# =============================================================
# AI API CONFIGURATION
# =============================================================

# OpenRouter API (Öncelikli - Önerilen)
# Ücretsiz hesap: https://openrouter.ai
# Model: x-ai/grok-4.1-fast (ücretsiz)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Google Gemini API (Fallback)
# Ücretsiz API key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Groq API (Market Analizi için)
# API key: https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here

# Fal AI (Görsel İşleme / Virtual Staging için)
# API key: https://fal.ai/dashboard/keys
FAL_KEY=your_fal_key_here

# ÖNEMLİ: En az BİRİNİ ekleyin!
# Her ikisi de yoksa template-only mode aktif olur
# (AI destekli içerik üretimi çalışmaz)

# =============================================================
# APPLICATION CONFIGURATION
# =============================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# =============================================================
# PDF GENERATION (GOTENBERG)
# =============================================================
# Gotenberg URL for server-side PDF rendering
# Local development: docker compose up gotenberg -d → http://localhost:3001
# Production: Deploy Gotenberg on Railway/Render and set URL here
#
# Railway ile ücretsiz Gotenberg kurulumu:
# 1. https://railway.app adresine git ve GitHub ile giriş yap
# 2. "New Project" → "Deploy from Docker Image"
# 3. Image: gotenberg/gotenberg:8
# 4. Environment Variables: Boş bırak
# 5. Settings → Networking → Generate Domain
# 6. Oluşan URL'yi buraya ekle (örn: https://gotenberg-xxx.up.railway.app)
#
GOTENBERG_URL=http://localhost:3001
