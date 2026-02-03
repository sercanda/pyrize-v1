"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Rocket,
  ArrowRight,
  PlayCircle,
  Users,
  CheckCircle2,
  Star,
  TrendingUp,
  FileText,
  BarChart3,
  Layout,
  Calendar,
  Image,
  Smartphone,
} from "lucide-react";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { GlassCard } from "@/components/ui/glass";
import GradientText from "@/components/ui/GradientText";
import CardNav from "@/components/ui/CardNav";
import type { CardNavItem } from "@/components/ui/CardNav";
import HeroOrbBackground from "@/components/ui/HeroOrbBackground";
import RotatingBlurSlogans from "@/components/RotatingBlurSlogans";

/* ───────────────────────────────────────────────────────────
   DATA
─────────────────────────────────────────────────────────── */
const heroMessage = {
  title: "2 dakikada hazır sunum, onay süresi yarıya iner",
  description: "",
  sub: "",
};

const heroWords = ["2 dakikada", "hazır", "sunum", "onay", "yarıya", "iner"];

const statHighlights = [
  { label: "Hazırlık süresi", value: "2 dk", change: "-88%", tone: "positive" },
  { label: "Onay süresi", value: "-%50", change: "daha hızlı", tone: "positive" },
  { label: "Toplantı dönüşümü", value: "+%42", change: "net akış", tone: "positive" },
];

const whoFor = [
  {
    title: "Bu sistem sizin için",
    description: "Danışmanlar, ajanslar, satış ekipleri ve kurumsal sunum hazırlayanlar",
    icon: CheckCircle2,
    accent: "from-emerald-500/20 via-transparent to-cyan-500/10",
  },
  {
    title: "Bu sistem sizin için değil",
    description: "Tek seferlik sunum yapanlar, tasarımcı arayanlar, manuel süreçten memnun olanlar",
    icon: X,
    accent: "from-rose-500/20 via-transparent to-rose-500/5",
  },
];

const problems = [
  "Sunumlar dağınık, müşteri güveni düşüyor",
  "PDF ve mobil ayrı hazırlanıyor, hatalar çıkıyor",
  "Onay süresi uzuyor, fırsatlar kaçıyor",
  "Toplantıda hikaye net akmıyor, revizyonlar zaman kaybettiriyor",
];

const whyOldMethodsFail = [
  "Manuel hazırlık saatler alıyor, toplantı öncesi stres artıyor",
  "İki farklı format tutarsız oluyor, müşteri kafası karışıyor",
  "Her seferinde sıfırdan yazmak gerekiyor, standart yok",
  "Revizyonlar gecikiyor, onay süreci uzuyor",
];

const whyThisWorks = [
  "Tek form, 2 dakika, hazır sunum",
  "Mobil ve PDF aynı anda çıkar, tutarlılık garantili",
  "Her bölüm net başlık ve fayda ile hazır gelir",
  "Revizyonlar anında yapılır, onay süresi yarıya iner",
];

const processSteps = [
  {
    step: "01",
    title: "Formu doldur",
    description: "Mülk, danışman ve hedef bilgilerini gir.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Hazır olur",
    description: "Metin, analiz ve tasarım hazır gelir.",
    icon: CheckCircle2,
  },
  {
    step: "03",
    title: "Paylaş",
    description: "Mobil link ve PDF aynı anda hazır, hemen gönder.",
    icon: Rocket,
  },
];

const gains = [
  {
    icon: TrendingUp,
    title: "Hazırlık süresi %88 azalır",
    description: "2 dakikada hazır sunum, saatler yerine dakikalar.",
  },
  {
    icon: CheckCircle2,
    title: "Onay süresi yarıya iner",
    description: "Net akış sayesinde müşteri daha hızlı karar verir.",
  },
  {
    icon: BarChart3,
    title: "Toplantı dönüşümü %42 artar",
    description: "Tutarlı sunum ve net hikaye daha fazla onay getirir.",
  },
  {
    icon: ShieldCheck,
    title: "Revizyonlar anında yapılır",
    description: "Veri değişince içerik saniyeler içinde güncellenir.",
  },
  {
    icon: Users,
    title: "Ekip standardı oluşur",
    description: "Herkes aynı kalitede sunum hazırlar, müşteriye tek ses gider.",
  },
  {
    icon: Rocket,
    title: "Mobil ve PDF tutarlı kalır",
    description: "Aynı içerik her iki formatta da aynı, hata riski yok.",
  },
];

const productFeatures = [
  {
    icon: FileText,
    title: "Dakikalar Değil, Net Bir Akışta Hazır Sunum",
    description: "Sunum oluşturma süreci tek bir panelde tamamlanır. Mobil ve PDF formatları aynı içerikten üretilir, tutarlılık garantilidir.",
  },
  {
    icon: Users,
    title: "CRM ve Müşteri Takibi",
    description: "Sunumlar ve müşteriler aynı yerde takip edilir. Her sunumun hangi müşteriyle ilişkili olduğu görünür, ayrı araçlara gerek yoktur.",
  },
  {
    icon: Calendar,
    title: "Takvim ve Süreç Yönetimi",
    description: "Toplantılar ve süreç adımları tek panelde görünür. Sunum hazırlama ile ilgili takip işlemleri manuel değildir.",
  },
  {
    icon: Image,
    title: "AI Destekli Fotoğraf İyileştirme",
    description: "Sunumlarda kullanılacak görselleri iyileştirme desteği. Ayrı bir araç değil, sunum akışının bir parçasıdır.",
  },
  {
    icon: Smartphone,
    title: "Mobil ve PDF Tutarlılığı",
    description: "Tek içerik, birden fazla format. Aynı sunum hem mobil görünümde hem PDF'te aynı bilgileri gösterir.",
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

const clients = ["COLDWELL", "RE/MAX", "Keller Williams", "ERA", "Sotheby's", "Compass"];

const cardNavItems: CardNavItem[] = [
  {
    label: "Ürün İçinde Neler Var",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Dakikalar Değil, Net Bir Akışta Hazır Sunum", href: "/#product-features", ariaLabel: "Hızlı sunum oluşturma" },
      { label: "CRM ve Müşteri Takibi", href: "/#product-features", ariaLabel: "CRM ve müşteri takibi" },
      { label: "Takvim ve Süreç Yönetimi", href: "/#product-features", ariaLabel: "Takvim ve süreç yönetimi" },
      { label: "AI Destekli Fotoğraf İyileştirme", href: "/#product-features", ariaLabel: "Fotoğraf iyileştirme" },
      { label: "Mobil ve PDF Tutarlılığı", href: "/#product-features", ariaLabel: "Mobil ve PDF tutarlılığı" }
    ]
  },
  {
    label: "Kazanımlar",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Hazırlık süresi %88 azalır", href: "/#gains", ariaLabel: "Hazırlık süresi kazanımı" },
      { label: "Onay süresi yarıya iner", href: "/#gains", ariaLabel: "Onay süresi kazanımı" },
      { label: "Toplantı dönüşümü %42 artar", href: "/#gains", ariaLabel: "Dönüşüm kazanımı" },
      { label: "Revizyonlar anında yapılır", href: "/#gains", ariaLabel: "Revizyon kazanımı" },
      { label: "Ekip standardı oluşur", href: "/#gains", ariaLabel: "Ekip standardı kazanımı" },
      { label: "Mobil ve PDF tutarlı kalır", href: "/#gains", ariaLabel: "Tutarlılık kazanımı" }
    ]
  },
  {
    label: "Blog",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Son Yazılar", href: "/blog", ariaLabel: "Blog yazılarını görüntüle" },
      { label: "Kategoriler", href: "/blog", ariaLabel: "Blog kategorileri" }
    ]
  },
  {
    label: "Hakkımızda",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [
      { label: "Şirket", href: "/hakkimizda", ariaLabel: "Şirket hakkında bilgi" },
      { label: "Ekip", href: "/hakkimizda", ariaLabel: "Ekip bilgisi" }
    ]
  },
  {
    label: "İletişim",
    bgColor: "#1a0f2e",
    textColor: "#fff",
    links: [
      { label: "Email", href: "/iletisim", ariaLabel: "Email ile iletişime geç" },
      { label: "Destek", href: "/iletisim", ariaLabel: "Destek al" }
    ]
  },
  {
    label: "Hesap",
    bgColor: "#0f0819",
    textColor: "#fff",
    links: [
      { label: "Giriş Yap", href: "/auth/login", ariaLabel: "Hesabına giriş yap" },
      { label: "Kayıt Ol", href: "/auth/register", ariaLabel: "Yeni hesap oluştur" },
      { label: "Dashboard", href: "/dashboard", ariaLabel: "Dashboard'a git" }
    ]
  }
];

/* ───────────────────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────────────────── */
function AnimatedHeadline({ words }: { words: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="word-animate"
          style={{ animationDelay: `${idx * 0.07}s` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = true;
  const profile = {
    name: "Ece Yılmaz",
    email: "ece@pyrize.app",
    role: "Broker Owner",
    avatarUrl: "",
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white antialiased">
      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND EFFECTS - Subtle
      ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
          CARD NAVBAR
      ═══════════════════════════════════════════════════════════ */}
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
            HERO SECTION - VengeanceUI Esintisi
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 md:pt-32 pb-14 md:pb-20 overflow-hidden">
          <HeroOrbBackground />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="space-y-8 relative z-10 hero-animate">
              <div className="space-y-6">
                <RotatingBlurSlogans supportingText="AI destekli emlak sunum platformu." />
              </div>

              <div className="pt-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg"
                >
                  İlk Sunumunu Oluştur
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                {statHighlights.map((stat, idx) => (
                  <GlassCard key={stat.label} className="p-4 bg-white/[0.06] border-white/15 floating-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className={`text-xs ${stat.tone === "positive" ? "text-emerald-300" : "text-slate-400"}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pan" style={{ width: idx === 0 ? "82%" : idx === 1 ? "68%" : "54%" }} />
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="relative fade-up-2">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-cyan-500/15 via-teal-500/10 to-indigo-500/10" />
              <GlassCard className="p-6 md:p-8 relative overflow-hidden tilt-card">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(45,212,191,0.28),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.22),transparent_35%)]" />
                <div className="relative">
                  <p className="text-xs text-cyan-200/80 mb-2">Canlı önizleme</p>
                  <h3 className="text-2xl font-semibold text-white mb-4">Mobil + PDF birlikte</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Hazırlık süresi</span>
                        <span className="text-emerald-300">2 dk</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Onay süresi</span>
                        <span className="text-emerald-300">-50%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Toplantı dönüşümü</span>
                        <span className="text-emerald-300">+42%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Logo Marquee */}
          <div className="mt-12">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
              <div className="marquee-track py-4">
                {clients.concat(clients).map((client, idx) => (
                  <span
                    key={`${client}-${idx}`}
                    className="mx-6 text-sm tracking-[0.18em] text-slate-300 uppercase whitespace-nowrap"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            KİMLER İÇİN / KİMLER İÇİN DEĞİL
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Bu sistem kimler için
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 fade-up-2">
              {whoFor.map((item, i) => (
                <GlassCard key={i} className="p-6 md:p-8 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-30`} />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 border border-white/20 mb-4">
                      <item.icon className={`w-6 h-6 ${i === 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            GERÇEK PROBLEM
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Gerçek problem
              </h2>
            </div>

            <GlassCard className="p-6 md:p-8 fade-up-2">
              <ul className="space-y-4">
                {problems.map((problem, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span className="text-lg">{problem}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            NEDEN ESKİ YÖNTEMLER İŞE YARAMIYOR
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Neden eski yöntemler işe yaramıyor
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 fade-up-2">
              {whyOldMethodsFail.map((reason, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                    <p className="text-slate-200">{reason}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            BU SİSTEM NEDEN DAHA HIZLI VE NET
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Bu sistem neden daha hızlı ve net
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 fade-up-2">
              {whyThisWorks.map((reason, i) => (
                <GlassCard key={i} className="p-6 border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <p className="text-white text-lg">{reason}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            HOW IT WORKS - 3 STEPS
        ═══════════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <p className="text-sm text-cyan-400/80 mb-3 font-medium">
                Nasıl Çalışır?
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                3 adımda sonuç
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 fade-up-2">
              {processSteps.map((step, i) => (
                <GlassCard key={i} className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/5 border border-white/10 mb-6">
                    <step.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="text-xs font-semibold text-cyan-400/70 mb-3 tracking-wider uppercase">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SOMUT KAZANIMLAR
        ═══════════════════════════════════════════════════════════ */}
        <section id="gains" className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Somut kazanımlar
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up-2">
              {gains.map((gain, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 mb-4">
                    <gain.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {gain.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{gain.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            ÜRÜN İÇİNDE NELER VAR
        ═══════════════════════════════════════════════════════════ */}
        <section id="product-features" className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Ürün İçinde Neler Var
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up-2">
              {productFeatures.map((feature, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 mb-4">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-12 text-center fade-up-2">
              <p className="text-xl font-semibold text-white">
                Sunum hazırlama artık ayrı bir görev değil.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Sosyal kanıt
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 fade-up-2">
              {testimonials.map((t, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">"{t.comment}"</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRICING
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Fiyatlandırma
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                İlk sunumunuz hazır değilse para iade. Risk sizde değil, bizde.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 fade-up-2">
              {pricingPlans.map((plan, i) => (
                <GlassCard
                  key={i}
                  className={`p-6 md:p-8 ${plan.popular ? "border-cyan-500/30 ring-1 ring-cyan-500/20" : ""}`}
                >
                  {plan.popular && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
                      <Star className="w-3 h-3" />
                      Popüler
                    </div>
                  )}
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
                  <p className="text-sm text-cyan-400 mb-4 font-medium">
                    {plan.credits}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-emerald-300 mb-6 pb-4 border-b border-white/10">
                    {plan.guarantee}
                  </p>
                  <Link
                    href="/auth/register"
                    className={`block w-full text-center rounded-lg py-3 font-semibold transition-all ${
                      plan.popular
                        ? "bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
                        : "bg-white/10 border border-white/20 text-white hover:bg-white/15"
                    }`}
                  >
                    Başla
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8 md:p-12 text-center" hover={false}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                İlk sunumunu şimdi oluştur
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                2 dakikada hazır sunum, onay süresi yarıya iner. İlk sunumunuz hazır değilse para iade.
              </p>
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-white text-slate-900 px-8 py-4 text-base font-semibold hover:bg-slate-100 transition-all shadow-lg"
              >
                İlk Sunumunu Oluştur
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          GLASS FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-white/[0.01] backdrop-blur-xl border-t border-white/[0.05]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} PYRIZE. Tüm hakları saklıdır.</p>
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