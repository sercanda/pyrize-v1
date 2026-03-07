"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Bu e-posta adresi zaten kayıtlı.");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/onboarding");
    } catch (err) {
      setError("Kayıt başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <span className="logo-text font-bold text-3xl uppercase tracking-tight">
              PYRIZE
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Kayıt Ol</h1>
          <p className="text-gray-300">Ücretsiz hesap oluşturun</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-100 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2] focus:border-transparent"
                  placeholder="Ahmet Yılmaz"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2] focus:border-transparent"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2] focus:border-transparent"
                  placeholder="En az 8 karakter"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2] focus:border-transparent"
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 bg-white/5 border-white/20 rounded focus:ring-[#57B6B2]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                <Link href="/terms" className="text-[#57B6B2] hover:underline">
                  Kullanım şartları
                </Link> ve{" "}
                <Link href="/privacy" className="text-[#57B6B2] hover:underline">
                  Gizlilik politikası
                </Link>nı kabul ediyorum
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#57B6B2] text-white rounded-lg font-semibold hover:bg-[#4a9d99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Zaten hesabınız var mı?{" "}
              <Link href="/auth/login" className="text-[#57B6B2] font-semibold hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

