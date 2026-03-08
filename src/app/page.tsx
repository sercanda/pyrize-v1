"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
  Rocket,
  FileText,
  TrendingUp,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass";
import CardNav from "@/components/ui/CardNav";
import type { CardNavItem } from "@/components/ui/CardNav";
import HeroOrbBackground from "@/components/ui/HeroOrbBackground";
import RotatingBlurSlogans from "@/components/RotatingBlurSlogans";

/* ───────────────────────────────────────────────────────────
   DATA
─────────────────────────────────────────────────────────── */
const clients = ["COLDWELL", "RE/MAX", "Keller Williams", "ERA", "Sotheby's", "Compass"];

const processSteps = [
  {
    step: "01",
    title: "Formu doldur",
    description: "Mülk, danışman ve hedef bilgilerini gir.",
    icon: FileText,
  },
  {
    step: "02",
    title: "AI üretir",
    description: "Metin, analiz ve tasarım saniyeler içinde hazır.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Paylaş",
    description: "Mobil link ve PDF aynı anda hazır, hemen gönder.",
    icon: Rocket,
  },
];

const keyBenefits = [
  {
    icon: Sparkles,
    title: "2 Dakikada Hazır Sunum",
    description: "Form doldur, AI içeriği üretsin. Mobil ve PDF aynı anda hazır.",
    stat: "%88",
    statLabel: "daha hızlı hazırlama",
  },
  {
    icon: TrendingUp,
    title: "Toplantı Dönüşümü Artar",
    description: "Net akış ve tutarlı sunum ile müşteri daha hızlı karar verir.",
    stat: "+%42",
    statLabel: "daha fazla onay",
  },
  {
    icon: ShieldCheck,
    title: "Anında Revizyon",
    description: "Veri değişince içerik saniyeler içinde güncellenir, bekleme yok.",
    stat: "-%50",
    statLabel: "onay süresi",
  },
  {
    icon: BarChart3,
    title: "CRM ve Takip Birlikte",
    description: "Müşteriler, sunumlar ve görevler tek panelde. Ayrı araç gereksiz.",
    stat: "1",
    statLabel: "tek platform",
  },
];

const testimonials = [
  {
    name: "Danışman ekipleri",
    role: "500+ aktif kullanıcı",
    avatar: "DE",
    comment: "Sunum hazırlığı standart hale geldi, toplantılar daha kısa sürüyor.",
  },
  {
    name: "Ajanslar",
    role: "Müşteri teslimi",
    avatar: "AJ",
    comment: "Mobil ve PDF tutarlı olduğu için revizyon ihtiyacı azalıyor.",
  },
  {
    name: "Satış ekipleri",
    role: "Haftalık kullanım",
    avatar: "SE",
    comment: "Onay süresi yarıya indi, daha fazla müşteriye ulaşıyoruz.",
  },
];

const pricingPlans = [
  {
    title: "Başlangıç",
    price: "320",
    credits: "5 sunum",
    features: ["Her sunum: 2 kredi", "Mobil + PDF birlikte", "Kurumsal şablonlar"],
    popular: false,
    guarantee: "İlk sunumunuz hazır değilse para iade",
  },
  {
    title: "Büyüme",
    price: "580",
    credits: "10 sunum",
    features: ["İki kat kapasite", "Performans raporları", "Öncelikli destek"],
    popular: true,
    guarantee: "İlk sunumunuz hazır değilse para iade",
  },
  {
    title: "Sınırsız",
    price: "35",
    credits: "Sınırsız",
    features: ["Tüm şablonlar", "Sınırsız sunum", "Ekip yönetimi"],
    popular: false,
    isMonthly: true,
    guarantee: "İlk sunumunuz hazır değilse para iade",
  },
];

const cardNavItems: CardNavItem[] = [
  {
    label: "Özellikler",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Nasıl Çalışır?", href: "/#nasil-calisir", ariaLabel: "Nasıl çalışır" },
      { label: "2 Dakikada Hazır Sunum", href: "/#ozellikler", ariaLabel: "Hızlı sunum" },
      { label: "CRM ve Müşteri Takibi", href: "/#ozellikler", ariaLabel: "CRM" },
      { label: "Anında Revizyon", href: "/#ozellikler", ariaLabel: "Revizyon" },
    ],
  },
  {
    label: "Fiyatlandırma",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Planları Gör", href: "/#fiyatlandirma", ariaLabel: "Fiyatlandırma" },
    ],
  },
  {
    label: "Blog",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Son Yazılar", href: "/blog", ariaLabel: "Blog" },
    ],
  },
  {
    label: "Hakkımızda",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [
      { label: "Şirket", href: "/hakkimizda", ariaLabel: "Şirket" },
      { label: "İletişim", href: "/iletisim", ariaLabel: "İletişim" },
    ],
  },
  {
    label: "Hesap",
    bgColor: "#0f0819",
    textColor: "#fff",
    links: [
      { label: "Giriş Yap", href: "/auth/login", ariaLabel: "Giriş yap" },
      { label: "Kayıt Ol", href: "/auth/register", ariaLabel: "Kayıt ol" },
      { label: "Dashboard", href: "/dashboard", ariaLabel: "Dashboard" },
    ],
  },
];

/* ───────────────────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white antialiased">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Navigation */}
      <CardNav
        logo="/logo.svg"
        logoAlt="PYRIZE Logo"
        items={cardNavItems}
        baseColor="rgba(15, 23, 42, 0.95)"
        menuColor="#fff"
        buttonBgColor="#06b6d4"
        buttonTextColor="#fff"
        ease="power3.out"
      />

      <main>
        {/* ═══════════════════════════════════════════════════════════
            HERO — Tam ekran, ortalanmış, anında değer önerisi
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          <HeroOrbBackground />

          <div className="relative z-10 max-w-4xl mx-auto text-center hero-animate">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/[0.12] px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">AI Destekli Emlak Sunum Platformu</span>
            </div>

            {/* Rotating Slogans */}
            <RotatingBlurSlogans
              className="mb-6"
              supportingText=""
            />

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Formu doldur, 2 dakikada profesyonel sunum hazır.
              <br className="hidden sm:block" />
              Mobil link ve PDF aynı anda.
            </p>

            {/* CTA */}
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition-all shadow-lg shadow-white/10"
            >
              Ücretsiz Dene
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>500+ emlak danışmanının tercihi</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            LOGO MARQUEE
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-slate-500 text-center uppercase tracking-[0.2em] mb-4">
            Güvendikleri markalar
          </p>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />
            <div className="marquee-track py-4">
              {clients.concat(clients).map((client, idx) => (
                <span
                  key={`${client}-${idx}`}
                  className="mx-8 text-sm tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            NASIL ÇALIŞIR — 3 adım
        ═══════════════════════════════════════════════════════════ */}
        <section id="nasil-calisir" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 fade-up">
              <p className="text-sm text-cyan-400 font-medium uppercase tracking-wider mb-3">
                Nasıl Çalışır?
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                3 adımda sonuç
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 fade-up">
              {processSteps.map((step, i) => (
                <GlassCard key={i} className="p-8 text-center relative">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-emerald-400 mb-4">
                    {step.step}
                  </div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.05] border border-white/10 mb-5">
                    <step.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            NEDEN PYRIZE — 4 fayda kartı
        ═══════════════════════════════════════════════════════════ */}
        <section id="ozellikler" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 fade-up">
              <p className="text-sm text-cyan-400 font-medium uppercase tracking-wider mb-3">
                Neden PYRIZE?
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Somut sonuçlar
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 fade-up">
              {keyBenefits.map((benefit, i) => (
                <GlassCard key={i} className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10">
                      <benefit.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-cyan-400">{benefit.stat}</div>
                      <div className="text-xs text-slate-500">{benefit.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SOSYAL KANIT
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 fade-up">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Kullanıcıların deneyimi
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 fade-up">
              {testimonials.map((t, i) => (
                <GlassCard key={i} className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FİYATLANDIRMA
        ═══════════════════════════════════════════════════════════ */}
        <section id="fiyatlandirma" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 fade-up">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Basit fiyatlandırma
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                İlk sunumunuz hazır değilse para iade. Risk sizde değil, bizde.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 fade-up">
              {pricingPlans.map((plan, i) => (
                <GlassCard
                  key={i}
                  className={`p-6 md:p-8 relative overflow-hidden ${
                    plan.popular ? "border-cyan-500/30 ring-1 ring-cyan-500/20" : ""
                  }`}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
                      <div className="relative inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
                        <Star className="w-3 h-3" />
                        Popüler
                      </div>
                    </>
                  )}
                  <div className={plan.popular ? "relative" : ""}>
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {plan.title}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.isMonthly ? (
                        <span className="text-slate-400 ml-2 text-lg">/ ay</span>
                      ) : (
                        <span className="text-slate-400 ml-2 text-lg">TL</span>
                      )}
                    </div>
                    <p className="text-sm text-cyan-400 mb-5 font-medium">
                      {plan.credits}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/register"
                      className={`block w-full text-center rounded-xl py-3 font-semibold transition-all ${
                        plan.popular
                          ? "bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
                          : "bg-white/10 border border-white/20 text-white hover:bg-white/15"
                      }`}
                    >
                      Başla
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SON CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-10 md:p-16 text-center" hover={false}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                İlk sunumunu şimdi oluştur
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                2 dakikada hazır sunum, onay süresi yarıya iner.
              </p>
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-white text-slate-900 px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all shadow-lg shadow-white/10"
              >
                Ücretsiz Dene
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/[0.01] backdrop-blur-xl border-t border-white/[0.05]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} PYRIZE. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/gizlilik" className="hover:text-white transition-colors">
              Gizlilik
            </Link>
            <Link href="/kvkk" className="hover:text-white transition-colors">
              KVKK
            </Link>
            <Link href="/iletisim" className="hover:text-white transition-colors">
              Destek
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
