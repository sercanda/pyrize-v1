"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resending, setResending] = useState(false);

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
      const { data, error: authError } = await supabase.auth.signUp({
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

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setRegisteredEmail(formData.email);
        setConfirmationSent(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Supabase URL") || msg.includes("Anon Key")) {
        setError("Supabase yapılandırması eksik. Lütfen yöneticiyle iletişime geçin.");
      } else {
        setError("Kayıt başarısız: " + (msg || "Bilinmeyen hata. Lütfen tekrar deneyin."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.resend({ type: "signup", email: registeredEmail });
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  };

  if (confirmationSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Mobile logo */}
        <div className="md:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>PYRIZE</span>
            <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
          </Link>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-[#24d6a4]/10 border border-[#24d6a4]/20 flex items-center justify-center mx-auto mb-6"
        >
          <Mail className="w-9 h-9 text-[#24d6a4]" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          E-postanızı doğrulayın
        </h1>
        <p className="text-white/50 text-sm mb-2">
          Aşağıdaki adrese bir doğrulama bağlantısı gönderdik:
        </p>
        <p className="text-[#C9A96E] font-medium mb-8">{registeredEmail}</p>

        <div className="bg-white/[0.03] border border-[#C9A96E]/10 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 text-left">
            <CheckCircle className="w-5 h-5 text-[#24d6a4] mt-0.5 flex-shrink-0" />
            <p className="text-white/60 text-sm leading-relaxed">
              Gelen kutunuzu kontrol edin ve bağlantıya tıklayarak hesabınızı aktifleştirin. Spam klasörünü de kontrol etmeyi unutmayın.
            </p>
          </div>
        </div>

        <button
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-2 text-sm text-[#C9A96E] hover:text-[#E8D5A3] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
          {resending ? "Gönderiliyor..." : "Tekrar gönder"}
        </button>

        <div className="mt-8">
          <Link href="/auth/login" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            Giriş sayfasına dön
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Mobile logo */}
      <div className="md:hidden text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>PYRIZE</span>
          <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
        </Link>
      </div>

      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Hesap oluşturun
        </h1>
        <p className="text-white/40 text-sm mb-8">
          Ücretsiz başlayın, kredi kartı gerekmez
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-200 text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <label htmlFor="name" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Ad Soyad
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]/30 transition-all"
              placeholder="Ahmet Yılmaz"
              required
            />
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
          <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]/30 transition-all"
              placeholder="ornek@email.com"
              required
            />
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]/30 transition-all"
              placeholder="En az 8 karakter"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Şifre Tekrar
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-11 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]/30 transition-all"
              placeholder="Şifrenizi tekrar girin"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#C9A96E] focus:ring-[#C9A96E]/30"
              required
            />
            <label htmlFor="terms" className="text-xs text-white/40 leading-relaxed">
              <Link href="/terms" className="text-[#C9A96E]/70 hover:text-[#C9A96E] transition-colors">
                Kullanım şartları
              </Link>{" "}
              ve{" "}
              <Link href="/privacy" className="text-[#C9A96E]/70 hover:text-[#C9A96E] transition-colors">
                Gizlilik politikası
              </Link>
              &apos;nı kabul ediyorum
            </label>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.35 }}>
          <button
            type="submit"
            disabled={loading}
            className="group w-full py-3.5 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#030822] rounded-xl font-semibold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#030822]/30 border-t-[#030822] rounded-full animate-spin" />
            ) : (
              <>
                Kayıt Ol
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }} className="mt-8 text-center">
        <p className="text-white/30 text-sm">
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/login" className="text-[#C9A96E] font-medium hover:text-[#E8D5A3] transition-colors">
            Giriş Yap
          </Link>
        </p>
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.45 }} className="mt-6 text-center">
        <Link href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">
          Ana Sayfaya Dön
        </Link>
      </motion.div>
    </>
  );
}
