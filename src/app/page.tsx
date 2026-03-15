"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Zap,
  Brain,
  BarChart2,
  Eye,
  MessageSquare,
  RefreshCw,
  Clock,
  Palette,
  TrendingDown,
  Home,
  Instagram,
  Linkedin,
  Youtube,
  Shield,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { Marquee } from "@/components/magicui/marquee";
import { Meteors } from "@/components/magicui/meteors";
import HeroOrbBackground from "@/components/ui/HeroOrbBackground";
import { PyrizeLogo } from "@/components/ui/PyrizeLogo";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const navLinks = [
  { label: "Nasıl Çalışır", href: "#nasil-calisir" },
  { label: "Özellikler", href: "#ozellikler" },
  { label: "Fiyatlandırma", href: "#fiyatlandirma" },
];

const clients = [
  "COLDWELL BANKER",
  "RE/MAX",
  "KELLER WILLIAMS",
  "ERA",
  "SOTHEBY'S",
  "CENTURY 21",
  "COMPASS",
  "REDFIN",
];

const heroStats = [
  { value: 2, suffix: " dk", label: "Sunum Hazırlık" },
  { value: 88, suffix: "%", label: "Daha Hızlı" },
  { value: 42, suffix: "%", label: "Dönüşüm Artışı", prefix: "+" },
  { value: 50, suffix: "%", label: "Onay Süresi", prefix: "-" },
];

const avatars = [
  { initials: "AK", bg: "#DBE64C", text: "#001F3F" },
  { initials: "BY", bg: "#74C365", text: "#001F3F" },
  { initials: "OZ", bg: "#1E488F", text: "#F6F7ED" },
  { initials: "SE", bg: "#00804C", text: "#F6F7ED" },
];

const painCards = [
  {
    icon: "⏰",
    title: "Saatler gidiyor",
    desc: "Her mülk için ortalama 45-90 dakika sunum hazırlığı. Haftada 5 mülk = 1 tam iş günü kayıp.",
  },
  {
    icon: "🎨",
    title: "Amatör görünüm",
    desc: "Tutarsız, markanıza uymayan sunumlar alıcıda güvensizlik yaratır. Her mülk için sıfırdan başlamak zaman ve fırsat kaybıdır.",
  },
  {
    icon: "📉",
    title: "Düşük dönüşüm",
    desc: "Müşteri sunumdan etkilenmezse, toplantı sonrası sesini duymuyor. Rakip kazanıyor.",
  },
  {
    icon: "🏠",
    title: "FSBO fırsatı",
    desc: "Sahibinden satan portföylere profesyonel sunum hazırlayan danışman rakiplerinden sıyrılır. Alıcı güveni ve pazarlık gücü fark yaratır.",
  },
];

const steps = [
  {
    num: "01",
    title: "Formu Doldur",
    desc: "Mülk bilgileri, fotoğraflar, fiyat ve hedef kitle bilgilerini gir. 60 saniye sürer.",
  },
  {
    num: "02",
    title: "AI Üretir",
    desc: "Yapay zeka satış metni, bölge analizi ve görsel tasarımı saniyeler içinde hazırlar.",
  },
  {
    num: "03",
    title: "Gönder & Kapat",
    desc: "PDF indir veya mobil link paylaş. Sunum anında hazır — dakikalar içinde müşterine ulaş.",
  },
];

const funnelSteps = [
  { emoji: "📸", title: "Mülk Bilgileri & Fotoğraflar", sub: "Temel veriler girilir", width: "100%" },
  { emoji: "🤖", title: "AI İçerik Üretimi", sub: "Satış metni, analiz, karşılaştırma", width: "84%" },
  { emoji: "🎨", title: "Profesyonel Sunum", sub: "Sunum hazır", width: "68%" },
  { emoji: "📊", title: "Paylaş & Kapanışa Hazırlan", sub: "Link, PDF veya doğrudan gönder", width: "52%" },
  { emoji: "✅", title: "Satış Kapama", sub: "Teklif toplama & onay", width: "40%", highlight: true },
];

const features = [
  {
    icon: Zap,
    title: "2 Dakikada Hazır Sunum",
    desc: "Form doldur, AI satış metni ve tasarımı üretsin. Mobil ve PDF aynı anda hazır. Bekleme yok.",
    tag: "ZAMAN TASARRUFU",
    large: false,
  },
  {
    icon: Brain,
    title: "AI Sunum Skoru",
    desc: "Her sunumun ikna gücünü 0-100 arası puanla. Nereleri güçlendireceğini gör, skoru yükselt.",
    tag: "YENİ",
    large: false,
  },
  {
    icon: BarChart2,
    title: "Rakip Analizi",
    desc: "Bölgedeki benzer mülkleri otomatik karşılaştır. \"Sizin mülkünüz neden daha iyi?\" bölümü hazır.",
    tag: "SATIŞ GÜCÜ",
    large: false,
  },
  {
    icon: Eye,
    title: "Sunum Performansı",
    desc: "Sunumunuzu kaç potansiyel alıcının incelediğini görün. Hangi mülkler daha çok ilgi çekiyor, analiz edin.",
    tag: "İÇGÖRÜ",
    large: false,
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Entegrasyonu",
    desc: "Fotoğrafları WhatsApp'tan at, bot sunum üretsin. Türkiye'nin en çok kullandığı kanal, direkt orda ol.",
    tag: "YAKINDA",
    large: false,
  },
  {
    icon: RefreshCw,
    title: "Anında Revizyon",
    desc: "Fiyat değişti? Veri güncelle, sunum saniyeler içinde yeniden üretilsin. Müşteriye hep güncel git.",
    tag: "VERİMLİLİK",
    large: false,
  },
];

const objections = [
  {
    q: "Zaten sunum araçları kullanıyorum, neden değiştireyim?",
    a: "Genel tasarım araçları emlak satışı için optimize değil. Her mülk için sıfırdan başlıyorsun, satış metni yazıyorsun, düzen oluşturuyorsun. Pyrize'da mülk bilgilerini giriyorsun — AI satışa özel metin, bölge analizi ve tasarımı 2 dakikada üretiyor.",
  },
  {
    q: "Müşterilerim sunuma bakmıyor ki",
    a: "Çünkü sunumun mobilde açılmıyor, 10 sayfalık PDF'i kimse indirmiyor. Pyrize sunumları mobil öncelikli, tek linkle açılıyor. İkna gücü yüksek, okunabilir format satış fırsatını kaçırmana izin vermiyor.",
  },
  {
    q: "AI sunumlar yapay görünüyor",
    a: "Genel AI araçları evet. Ama Pyrize emlak satışına özel eğitildi. Bölge verileri, karşılaştırmalı analiz, gerçek fotoğraflar — müşterin bunun AI olduğunu anlamaz, sadece profesyonel olduğunu görür.",
  },
  {
    q: "Çok pahalı olmaz mı?",
    a: "Bir sunumun maliyeti kahve parasından az. Ama o sunumla kapattığın satış komisyonu binlerce lira. ROI hesabını yap: Haftada 5 sunum × dönüşüm artışı = aylık gelir farkı. İlk sunumun ücretsiz, kendin gör.",
  },
];

const testimonials = [
  {
    quote:
      "Toplantıya gitmeden önce 2dk'da sunum hazırlıyorum. Müşteriler 'çok profesyonel' diyor. Rakiplerim hâlâ Word kullanıyor.",
    name: "Ahmet K.",
    role: "RE/MAX Danışmanı, İstanbul",
    initials: "AK",
    bg: "#DBE64C",
    text: "#001F3F",
  },
  {
    quote:
      "Ekip olarak sunum standardımız oluştu. Herkes aynı kalitede çıktı veriyor. Onay süresi yarıya indi.",
    name: "Büşra Y.",
    role: "Emlak Ofis Yöneticisi, Ankara",
    initials: "BY",
    bg: "#74C365",
    text: "#001F3F",
  },
  {
    quote:
      "Evimi sahibinden satıyordum. Pyrize ile hazırladığım sunumu gören alıcılar 'emlakçı mısınız?' diye sordu. 3 gün içinde teklif aldım.",
    name: "Selim E.",
    role: "FSBO Satıcı, İzmir",
    initials: "SE",
    bg: "#1E488F",
    text: "#F6F7ED",
  },
];

const pricingPlans = [
  {
    name: "Başlangıç",
    price: "₺249",
    period: "tek seferlik",
    sub: "Pyrize'ı test et, ilk satışını kapat.",
    features: [
      "100 AI kredi",
      "5 profesyonel sunum şablonu",
      "PDF + Mobil link",
      "Temel müşteri takibi",
      "Watermark yok",
    ],
    cta: "Başla",
    popular: false,
  },
  {
    name: "Profesyonel",
    price: "₺449",
    period: "/ ay",
    sub: "Ciddi satış yapanlar için. 2x kapasite.",
    features: [
      "400 AI kredi / ay",
      "Tüm premium şablonlar",
      "AI Sunum Skoru",
      "Rakip analizi",
      "Detaylı performans raporları",
      "Öncelikli destek",
    ],
    cta: "En Popüler — Başla",
    popular: true,
  },
  {
    name: "Sınırsız",
    price: "₺899",
    period: "/ ay",
    sub: "Ekipler ve yoğun danışmanlar için.",
    features: [
      "Sınırsız sunum",
      "Tüm premium şablonlar",
      "Ekip yönetimi & CRM",
      "WhatsApp entegrasyonu",
      "API erişimi",
    ],
    cta: "Başla",
    popular: false,
  },
];

const footerLinks = {
  Platform: [
    { label: "Nasıl Çalışır", href: "#nasil-calisir" },
    { label: "Özellikler", href: "#ozellikler" },
    { label: "Fiyatlandırma", href: "#fiyatlandirma" },
    { label: "Blog", href: "#" },
  ],
  Destek: [
    { label: "SSS", href: "#" },
    { label: "İletişim", href: "#" },
    { label: "KVKK", href: "#" },
    { label: "Gizlilik", href: "#" },
  ],
};

/* ─────────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
      style={{ color: "#DBE64C" }}
    >
      {children}
    </p>
  );
}

function GradientDivider() {
  return (
    <div
      className="w-full h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(219,230,76,0.15), transparent)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-[#F6F7ED] antialiased"
      style={{ background: "#001F3F", fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
    >
      {/* ── 1. NAV ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(0,31,63,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(219,230,76,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <PyrizeLogo variant="dark" className="h-6" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "#8A9BB5" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#DBE64C")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#8A9BB5")
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm transition-colors"
              style={{ color: "#8A9BB5" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F6F7ED")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8A9BB5")}
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
              style={{
                background: "#DBE64C",
                color: "#001F3F",
              }}
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen((v) => !v)}
            style={{ color: "#F6F7ED" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
            style={{ background: "rgba(0,21,43,0.98)" }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm py-2 border-b"
                style={{ color: "#F6F7ED", borderColor: "rgba(255,255,255,0.08)" }}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/auth/register"
              className="mt-2 text-center text-sm font-semibold px-5 py-3 rounded-lg"
              style={{ background: "#DBE64C", color: "#001F3F" }}
              onClick={() => setMobileOpen(false)}
            >
              Ücretsiz Başla
            </Link>
          </div>
        )}
      </header>

      {/* ── 2. HERO ────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden text-center"
        style={{ background: "#001F3F" }}
      >
        {/* WebGL Orb Background */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroOrbBackground />
        </div>

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(30,72,143,0.25) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* Badge */}
          <BlurFade delay={0} inView>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-semibold"
              style={{
                borderColor: "rgba(219,230,76,0.35)",
                color: "#DBE64C",
                background: "rgba(219,230,76,0.06)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-[pulse-dot_2s_ease-in-out_infinite]"
                style={{ background: "#DBE64C" }}
              />
              <AnimatedShinyText className="text-xs font-semibold" style={{ color: "#DBE64C" } as React.CSSProperties}>
                AI Destekli Satış Motoru
              </AnimatedShinyText>
            </div>
          </BlurFade>

          {/* H1 */}
          <BlurFade delay={0.15} inView>
            <div
              className="flex flex-col items-center gap-3 mb-6"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              }}
            >
              {/* Satır 1 — soluk intro */}
              <p
                className="font-semibold tracking-wide uppercase"
                style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)", color: "#8A9BB5", letterSpacing: "0.25em" }}
              >
                Emlakçıların
              </p>

              {/* Satır 2 — stat kutusu + devam */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span
                  className="inline-flex items-center px-4 py-1.5 rounded-xl border font-black animate-glow-pulse"
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    borderColor: "#DBE64C",
                    background: "rgba(219,230,76,0.1)",
                    color: "#DBE64C",
                    lineHeight: 1.1,
                  }}
                >
                  %73&apos;ü
                </span>
                <span
                  className="font-extrabold tracking-tight"
                  style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", color: "#F6F7ED", lineHeight: 1.1 }}
                >
                  Sunum Yüzünden
                </span>
              </div>

              {/* Satır 3 — shiny vurgu */}
              <AnimatedShinyText
                className="font-black tracking-tight"
                style={
                  {
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    color: "#F6F7ED",
                    lineHeight: 1.1,
                    "--shiny-width": "100px",
                  } as React.CSSProperties
                }
              >
                Satış Kaybediyor.
              </AnimatedShinyText>
            </div>

            <div
              className="h-px w-14 rounded-full mx-auto mb-6"
              style={{ background: "#DBE64C", opacity: 0.6 }}
            />
          </BlurFade>

          {/* Subtitle */}
          <BlurFade delay={0.3} inView>
            <p
              className="mb-10 max-w-[560px] leading-relaxed"
              style={{ color: "#8A9BB5", fontSize: "1.1rem" }}
            >
              Mülk bilgilerini gir.{" "}
              <strong style={{ color: "#F6F7ED" }}>
                AI satışa özel sunum ve funnel üretsin.
              </strong>{" "}
              2 dakikada profesyonel sunum hazır. Gönder, kapat.
            </p>
          </BlurFade>

          {/* CTA Buttons */}
          <BlurFade delay={0.45} inView>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(219,230,76,0.4)]"
                style={{ background: "#DBE64C", color: "#001F3F" }}
              >
                İlk Sunumunu 2dk&apos;da Oluştur
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#nasil-calisir"
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm border transition-all duration-200"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#F6F7ED",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#DBE64C")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
                }
              >
                Nasıl Çalışır?
              </Link>
            </div>
          </BlurFade>

          {/* Social Proof */}
          <BlurFade delay={0.55} inView>
            <div className="flex items-center gap-3 mb-12">
              <div className="flex -space-x-2">
                {avatars.map((a) => (
                  <div
                    key={a.initials}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                    style={{
                      background: a.bg,
                      color: a.text,
                      borderColor: "#001F3F",
                    }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#8A9BB5" }}>
                <strong style={{ color: "#F6F7ED" }}>500+</strong> emlak
                danışmanı aktif kullanıyor
              </p>
            </div>
          </BlurFade>

          {/* Stat Bar */}
          <BlurFade delay={0.65} inView>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border"
              style={{
                borderColor: "rgba(219,230,76,0.2)",
                background: "rgba(219,230,76,0.1)",
              }}
            >
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center px-6 py-5"
                  style={{ background: "rgba(0,21,43,0.7)" }}
                >
                  <div
                    className="text-3xl font-bold mb-1 flex items-baseline gap-0.5"
                    style={{
                      fontFamily: "var(--font-instrument), Georgia, serif",
                      color: "#DBE64C",
                    }}
                  >
                    {s.prefix && <span>{s.prefix}</span>}
                    <NumberTicker value={s.value} />
                    <span>{s.suffix}</span>
                  </div>
                  <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: "#8A9BB5" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      <GradientDivider />

      {/* ── MARQUEE ────────────────────────────────────────── */}
      <section
        className="py-8 overflow-hidden"
        style={{ background: "rgba(0,21,43,0.5)" }}
      >
        <p
          className="text-center text-xs uppercase tracking-[0.3em] mb-6"
          style={{ color: "#8A9BB5" }}
        >
          Türkiye&apos;nin önde gelen emlak ağlarında kullanılıyor
        </p>
        <Marquee pauseOnHover repeat={3} className="[--duration:30s]">
          {clients.map((c) => (
            <span
              key={c}
              className="mx-8 text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(246,247,237,0.3)" }}
            >
              {c}
            </span>
          ))}
        </Marquee>
      </section>

      <GradientDivider />

      {/* ── 3. PROBLEM / PAIN ──────────────────────────────── */}
      <section
        id="problem"
        className="py-24 px-6"
        style={{ background: "#00152B" }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <BlurFade inView delay={0}>
            <SectionLabel>GERÇEK</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", color: "#F6F7ED" }}
            >
              Dakikalar içinde
              <br />
              <span style={{ color: "#DBE64C" }}>profesyonel sunum.</span>
              <br />
              Her mülke özel.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#8A9BB5" }}>
              Müşterin karşına profesyonel bir sunumla çıkan rakibini seçiyor.
              Sen ise hâlâ PowerPoint&apos;te font değiştiriyorsun. Bu bir
              sunum sorunu değil,{" "}
              <strong style={{ color: "#F6F7ED" }}>bir satış sorunu.</strong>
            </p>
          </BlurFade>

          {/* Right — Pain Cards */}
          <div className="flex flex-col gap-4">
            {painCards.map((card, i) => (
              <BlurFade key={card.title} inView delay={i * 0.1}>
                <div
                  className="flex gap-4 p-5 rounded-xl border-l-4 border border-transparent transition-transform duration-200 hover:translate-x-1.5"
                  style={{
                    borderLeftColor: "#ef4444",
                    borderColor: "rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{card.icon}</span>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: "#F6F7ED" }}>
                      {card.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#8A9BB5" }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── 4. NASIL ÇALIŞIR ───────────────────────────────── */}
      <section
        id="nasil-calisir"
        className="py-24 px-6"
        style={{ background: "#001F3F" }}
      >
        <div className="max-w-7xl mx-auto">
          <BlurFade inView delay={0} className="text-center mb-16">
            <SectionLabel>NASIL ÇALIŞIR</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              3 adım.{" "}
              <em style={{ color: "#DBE64C" }}>2 dakika.</em>
              <br />
              Profesyonel sunum.
            </h2>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
              style={{
                background:
                  "linear-gradient(to right, rgba(219,230,76,0.15), rgba(219,230,76,0.35), rgba(219,230,76,0.15))",
              }}
            />

            {steps.map((s, i) => (
              <BlurFade key={s.num} inView delay={i * 0.15}>
                <MagicCard
                  className="p-8 rounded-2xl border h-full"
                  gradientColor="#1E488F"
                  gradientOpacity={0.5}
                >
                  <div
                    style={{
                      borderColor: "rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                    className="border rounded-2xl p-8 h-full"
                  >
                    <p
                      className="text-6xl font-bold mb-4 leading-none select-none"
                      style={{
                        fontFamily: "var(--font-instrument), Georgia, serif",
                        color: "rgba(219,230,76,0.18)",
                      }}
                    >
                      {s.num}
                    </p>
                    <h3 className="text-xl font-bold mb-3" style={{ color: "#F6F7ED" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#8A9BB5" }}>
                      {s.desc}
                    </p>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>

          {/* Mid CTA */}
          <BlurFade inView delay={0.4} className="text-center mt-14">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#DBE64C", color: "#001F3F" }}
            >
              İlk Sunumunu Şimdi Oluştur
              <ArrowRight size={16} />
            </Link>
          </BlurFade>
        </div>
      </section>

      <GradientDivider />

      {/* ── 5. AI SATIŞ FUNNELI ────────────────────────────── */}
      <section
        id="funnel"
        className="py-24 px-6"
        style={{ background: "#00152B" }}
      >
        <div className="max-w-3xl mx-auto">
          <BlurFade inView delay={0} className="text-center mb-14">
            <SectionLabel>AI SATIŞ FUNNELI</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Sunum değil,
              <br />
              <em style={{ color: "#DBE64C" }}>satış makinesi</em> oluştur.
            </h2>
          </BlurFade>

          <div className="flex flex-col items-center gap-1">
            {funnelSteps.map((f, i) => (
              <BlurFade key={f.title} inView delay={i * 0.1} className="w-full flex justify-center">
                <div
                  className="relative rounded-xl border px-6 py-4 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    width: f.width,
                    borderColor: f.highlight
                      ? "rgba(219,230,76,0.5)"
                      : "rgba(255,255,255,0.07)",
                    background: f.highlight
                      ? "rgba(219,230,76,0.08)"
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  {f.highlight && (
                    <BorderBeam
                      size={60}
                      duration={4}
                      colorFrom="#DBE64C"
                      colorTo="#74C365"
                      borderWidth={2}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{f.emoji}</span>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: f.highlight ? "#DBE64C" : "#F6F7ED" }}
                      >
                        {f.title}
                      </p>
                      <p className="text-xs" style={{ color: "#8A9BB5" }}>
                        {f.sub}
                      </p>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          <BlurFade inView delay={0.6} className="text-center mt-10">
            <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "#8A9BB5" }}>
              Tek bir formdan{" "}
              <strong style={{ color: "#DBE64C" }}>komple satış süreci</strong>{" "}
              çıkar. Sunumun sonunda müşteri direkt teklif bırakabilir. Klasik
              sunum → funnel farkı budur.
            </p>
          </BlurFade>
        </div>
      </section>

      <GradientDivider />

      {/* ── 6. ÖZELLİKLER ─────────────────────────────────── */}
      <section
        id="ozellikler"
        className="py-24 px-6"
        style={{ background: "#001F3F" }}
      >
        <div className="max-w-7xl mx-auto">
          <BlurFade inView delay={0} className="text-center mb-16">
            <SectionLabel>ÖZELLİKLER</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Rakiplerinin bilmediği
              <br />
              <em style={{ color: "#DBE64C" }}>bilmediği</em> silahların.
            </h2>
          </BlurFade>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <BlurFade key={f.title} inView delay={i * 0.08}>
                <MagicCard
                  className="rounded-2xl h-full"
                  gradientColor="#1E488F"
                  gradientOpacity={0.45}
                >
                  <div
                    className="relative rounded-2xl border p-7 h-full overflow-hidden group"
                    style={{
                      borderColor: "rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    {/* Top beam on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "#DBE64C" }}
                    />
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(219,230,76,0.1)" }}
                      >
                        <f.icon size={20} style={{ color: "#DBE64C" }} />
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: "rgba(219,230,76,0.1)",
                          color: "#DBE64C",
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ color: "#F6F7ED" }}>
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#8A9BB5" }}>
                      {f.desc}
                    </p>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── 7. İTİRAZ KIRMA ───────────────────────────────── */}
      <section
        id="itirazlar"
        className="py-24 px-6"
        style={{ background: "#00152B" }}
      >
        <div className="max-w-3xl mx-auto">
          <BlurFade inView delay={0} className="mb-12">
            <SectionLabel>İTİRAZLAR</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              &ldquo;Ama ben zaten...&rdquo;
              <br />
              diyeceksen,{" "}
              <em style={{ color: "#DBE64C" }}>dur.</em>
            </h2>
          </BlurFade>

          <BlurFade inView delay={0.2}>
            <Accordion type="single" collapsible className="space-y-3">
              {objections.map((obj, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-xl border px-6 overflow-hidden"
                  style={{
                    borderColor: "rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <AccordionTrigger
                    className="text-left font-semibold text-sm py-5 hover:no-underline"
                    style={{ color: "#F6F7ED" }}
                  >
                    {obj.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-sm leading-relaxed pb-5"
                    style={{ color: "#8A9BB5" }}
                  >
                    {obj.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </BlurFade>
        </div>
      </section>

      <GradientDivider />

      {/* ── 8. TESTİMONIALS ───────────────────────────────── */}
      <section
        id="kullanicilar"
        className="py-24 px-6"
        style={{ background: "#001F3F" }}
      >
        <div className="max-w-7xl mx-auto">
          <BlurFade inView delay={0} className="text-center mb-14">
            <SectionLabel>KULLANICILAR</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Onlar zaten{" "}
              <em style={{ color: "#DBE64C" }}>kapıyor.</em>
            </h2>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <BlurFade key={t.name} inView delay={i * 0.12}>
                <MagicCard
                  className="rounded-2xl h-full"
                  gradientColor="#1E488F"
                  gradientOpacity={0.4}
                >
                  <div
                    className="relative rounded-2xl border p-8 h-full"
                    style={{
                      borderColor: "rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    {/* Big quote mark */}
                    <span
                      className="absolute top-4 left-6 text-7xl font-serif leading-none select-none pointer-events-none"
                      style={{ color: "rgba(219,230,76,0.1)" }}
                    >
                      "
                    </span>
                    <p
                      className="text-sm leading-relaxed mb-6 pt-4 relative z-10"
                      style={{ color: "#D1D8E0" }}
                    >
                      {t.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: t.bg, color: t.text }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "#F6F7ED" }}>
                          {t.name}
                        </p>
                        <p className="text-xs" style={{ color: "#8A9BB5" }}>
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── 9. FİYATLANDIRMA ──────────────────────────────── */}
      <section
        id="fiyatlandirma"
        className="py-24 px-6"
        style={{ background: "#00152B" }}
      >
        <div className="max-w-7xl mx-auto">
          <BlurFade inView delay={0} className="text-center mb-16">
            <SectionLabel>FİYATLANDIRMA</SectionLabel>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Bir kahve parası.
              <br />
              <em style={{ color: "#DBE64C" }}>Binlerce lira</em> dönüşüm.
            </h2>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {pricingPlans.map((plan, i) => (
              <BlurFade key={plan.name} inView delay={i * 0.12}>
                <div className="relative h-full">
                  {/* Popular badge */}
                  {plan.popular && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                      style={{ background: "#DBE64C", color: "#001F3F" }}
                    >
                      EN POPÜLER
                    </div>
                  )}

                  <div
                    className="relative rounded-2xl border p-8 h-full flex flex-col overflow-hidden"
                    style={{
                      borderColor: plan.popular
                        ? "rgba(219,230,76,0.4)"
                        : "rgba(255,255,255,0.07)",
                      background: plan.popular
                        ? "linear-gradient(145deg, rgba(219,230,76,0.06), rgba(0,21,43,0.8))"
                        : "rgba(255,255,255,0.03)",
                    }}
                  >
                    {plan.popular && (
                      <BorderBeam
                        size={80}
                        duration={5}
                        colorFrom="#DBE64C"
                        colorTo="#74C365"
                        borderWidth={2}
                      />
                    )}

                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-1" style={{ color: "#F6F7ED" }}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span
                          className="text-4xl font-bold"
                          style={{
                            fontFamily: "var(--font-instrument), Georgia, serif",
                            color: plan.popular ? "#DBE64C" : "#F6F7ED",
                          }}
                        >
                          {plan.price}
                        </span>
                        <span className="text-sm" style={{ color: "#8A9BB5" }}>
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "#8A9BB5" }}>
                        {plan.sub}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm">
                          <CheckCircle2
                            size={16}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: "#DBE64C" }}
                          />
                          <span style={{ color: "#D1D8E0" }}>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/auth/register"
                      className="block text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
                      style={
                        plan.popular
                          ? { background: "#DBE64C", color: "#001F3F" }
                          : {
                              background: "transparent",
                              color: "#DBE64C",
                              border: "1px solid rgba(219,230,76,0.35)",
                            }
                      }
                    >
                      {plan.cta} →
                    </Link>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Guarantee */}
          <BlurFade inView delay={0.4} className="text-center mt-10">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border"
              style={{
                borderColor: "rgba(219,230,76,0.2)",
                background: "rgba(219,230,76,0.04)",
              }}
            >
              <Shield size={16} style={{ color: "#DBE64C" }} />
              <p className="text-sm">
                <strong style={{ color: "#DBE64C" }}>30 gün iade garantisi:</strong>{" "}
                <span style={{ color: "#8A9BB5" }}>
                  Pyrize&apos;dan memnun kalmazsan, ödediğin tutarı iade ediyoruz — soru sormadan.
                </span>
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      <GradientDivider />

      {/* ── 10. FINAL CTA ──────────────────────────────────── */}
      <section
        className="relative py-40 px-6 overflow-hidden text-center"
        style={{ background: "#00152B" }}
      >
        {/* Meteors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Meteors number={18} />
        </div>

        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(219,230,76,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <BlurFade inView delay={0}>
            <h2
              className="text-4xl md:text-6xl font-bold mb-5 leading-tight"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Rakibin şu an
              <br />
              <em style={{ color: "#DBE64C" }}>sunum hazırlıyor.</em>
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.15}>
            <p className="text-base mb-10" style={{ color: "#8A9BB5" }}>
              Sen de 2 dakikada hazırla. Ya da izlemeye devam et.
            </p>
          </BlurFade>
          <BlurFade inView delay={0.3}>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(219,230,76,0.35)]"
              style={{ background: "#DBE64C", color: "#001F3F" }}
            >
              İlk Sunumunu Şimdi Oluştur
              <ArrowRight size={18} />
            </Link>
          </BlurFade>
        </div>
      </section>

      <GradientDivider />

      {/* ── 11. FOOTER ─────────────────────────────────────── */}
      <footer
        className="py-16 px-6"
        style={{
          background: "#001F3F",
          borderTop: "1px solid rgba(219,230,76,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <PyrizeLogo variant="dark" className="h-6" />
            </div>
            <p
              className="text-sm leading-relaxed max-w-[280px]"
              style={{ color: "#8A9BB5" }}
            >
              Emlakçının AI satış silahı. 2 dakikada profesyonel sunum, satış
              funneli ve müşteri takibi — tek platformda.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="transition-colors"
                  style={{ color: "#8A9BB5" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#DBE64C")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A9BB5")}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                style={{ color: "#DBE64C" }}
              >
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors"
                      style={{ color: "#8A9BB5" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F6F7ED")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#8A9BB5")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#8A9BB5",
          }}
        >
          <span>© 2026 PYRIZE. Tüm hakları saklıdır.</span>
          <span>Samsun, Türkiye&apos;den ❤️ ile</span>
        </div>
      </footer>
    </div>
  );
}
