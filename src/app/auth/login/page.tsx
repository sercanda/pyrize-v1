"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PyrizeLogo } from "@/components/ui/PyrizeLogo";
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    callbackError === "callback_failed"
      ? "E-posta doğrulama başarısız oldu. Lütfen tekrar deneyin."
      : ""
  );
  const [success, setSuccess] = useState(
    searchParams.get("confirmed") === "true"
      ? "E-postanız doğrulandı! Giriş yapabilirsiniz."
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowResend(false);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("E-posta veya şifre hatalı.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin.");
          setShowResend(true);
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Supabase URL") || msg.includes("Anon Key")) {
        setError("Supabase yapılandırması eksik. Lütfen yöneticiyle iletişime geçin.");
      } else {
        setError("Giriş başarısız: " + (msg || "Bilinmeyen hata. Lütfen tekrar deneyin."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.resend({ type: "signup", email });
      setSuccess("Doğrulama e-postası tekrar gönderildi.");
      setShowResend(false);
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {/* Mobile logo */}
      <div className="md:hidden text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <PyrizeLogo variant="dark" className="h-7" />
        </Link>
      </div>

      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Hoş geldiniz
        </h1>
        <p className="text-white/40 text-sm mb-8">
          Hesabınıza giriş yapın
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-red-200 text-sm">{error}</span>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="mt-2 flex items-center gap-1.5 text-xs text-[#C9A96E] hover:text-[#E8D5A3] transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Gönderiliyor..." : "Doğrulama e-postasını tekrar gönder"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-[#DBE64C]/10 border border-[#DBE64C]/20 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-[#DBE64C] flex-shrink-0" />
              <span className="text-[#DBE64C] text-sm">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]/30 transition-all"
              placeholder="ornek@email.com"
              required
            />
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
          <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]/30 transition-all"
              placeholder="Şifrenizi girin"
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

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C9A96E] focus:ring-[#C9A96E]/30"
              />
              <span className="text-xs text-white/40">Beni hatırla</span>
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-[#C9A96E]/70 hover:text-[#C9A96E] transition-colors">
              Şifremi unuttum
            </Link>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
          <button
            type="submit"
            disabled={loading}
            className="group w-full py-3.5 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#030822] rounded-xl font-semibold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#030822]/30 border-t-[#030822] rounded-full animate-spin" />
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }} className="mt-8 text-center">
        <p className="text-white/30 text-sm">
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className="text-[#C9A96E] font-medium hover:text-[#E8D5A3] transition-colors">
            Kayıt Ol
          </Link>
        </p>
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.35 }} className="mt-6 text-center">
        <Link href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">
          Ana Sayfaya Dön
        </Link>
      </motion.div>
    </>
  );
}
