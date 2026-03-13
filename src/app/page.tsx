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
  Users,
  Zap,
  X,
  Clock,
  MessageSquare,
  Lock,
  RefreshCw,
  Building2,
} from "lucide-react";
import CardNav from "@/components/ui/CardNav";
import type { CardNavItem } from "@/components/ui/CardNav";
import HeroOrbBackground from "@/components/ui/HeroOrbBackground";
import { FAQAccordion } from "@/components/landing/FAQAccordion";

/* ───────────────────────────────────────────────────────────
   DATA
─────────────────────────────────────────────────────────── */

const clients = ["COLDWELL", "RE/MAX", "Keller Williams", "ERA", "Sotheby's", "Compass"];

const cardNavItems: CardNavItem[] = [
  {
    label: "Özellikler",
    bgColor: "#001832",
    textColor: "#F6F7ED",
    links: [
      { label: "Nasıl Çalışır?", href: "/#nasil-calisir", ariaLabel: "Nasıl çalışır" },
      { label: "AI Sunum Stili", href: "/#sablonlar", ariaLabel: "Şablonlar" },
      { label: "CRM ve Takip", href: "/#ozellikler", ariaLabel: "CRM" },
      { label: "Anında Revizyon", href: "/#ozellikler", ariaLabel: "Revizyon" },
    ],
  },
  {
    label: "Fiyatlandırma",
    bgColor: "#001832",
    textColor: "#F6F7ED",
    links: [
      { label: "Planları Gör", href: "/#fiyatlandirma", ariaLabel: "Fiyatlandırma" },
    ],
  },
  {
    label: "Blog",
    bgColor: "#001832",
    textColor: "#F6F7ED",
    links: [
      { label: "Son Yazılar", href: "/blog", ariaLabel: "Blog" },
    ],
  },
  {
    label: "Hesap",
    bgColor: "#001832",
    textColor: "#F6F7ED",
    links: [
      { label: "Giriş Yap", href: "/auth/login", ariaLabel: "Giriş yap" },
      { label: "Kayıt Ol", href: "/auth/register", ariaLabel: "Kayıt ol" },
      { label: "Dashboard", href: "/dashboard", ariaLabel: "Dashboard" },
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Formu doldur",
    description: "Mülk, danışman ve hedef bilgilerini 2 dakikada gir.",
    icon: FileText,
  },
  {
    step: "02",
    title: "AI üretir",
    description: "Grok 4.1 metin, analiz ve tasarımı saniyeler içinde hazırlar.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Paylaş ve kapat",
    description: "Mobil link ve PDF aynı anda hazır — WhatsApp'a gönder, müşteriyi al.",
    icon: Rocket,
  },
];

const templateStyles = [
  {
    name: "Detaylı Analiz",
    desc: "Değerleme raporu + piyasa verisi",
    pages: "5 sayfa",
    color: "#1E488F",
  },
  {
    name: "Hızlı Satış",
    desc: "FOMO + aciliyet odaklı",
    pages: "3 sayfa",
    color: "#00804C",
  },
  {
    name: "Premium",
    desc: "Lüks ton, aspirasyonel",
    pages: "5 sayfa",
    color: "#4a1d6b",
  },
  {
    name: "Güven Odaklı",
    desc: "Sosyal kanıt + garanti",
    pages: "4 sayfa",
    color: "#7c3d0f",
  },
  {
    name: "Minimalist",
    desc: "Sade, net, hızlı karar",
    pages: "3 sayfa",
    color: "#1a3a4a",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI ile Otomatik İçerik",
    desc: "Grok 4.1 ile uzman seviye Türkçe copy — başlık, açıklama, ikna metni hepsi dahil.",
  },
  {
    icon: Building2,
    title: "5 Sunum Stili",
    desc: "Portföy almak veya satmak için ayrı stratejiler. Her mülk tipine uygun.",
  },
  {
    icon: FileText,
    title: "Mobil + PDF Birlikte",
    desc: "Tek tıkla hem WhatsApp linki hem A4 PDF. Müşteri ne isterse o.",
  },
  {
    icon: Users,
    title: "CRM Entegrasyonu",
    desc: "Müşteriler, sunumlar, görevler — tek panelde. Ayrı araç, ayrı ücret yok.",
  },
  {
    icon: Zap,
    title: "Anında Revizyon",
    desc: "Fiyat değişti mi? 10 saniyede güncelle. Müşteriyi bekleten revizyon devri bitti.",
  },
  {
    icon: Lock,
    title: "Güvenli Paylaşım",
    desc: "Supabase şifrelemesi, KVKK uyumlu. Müşteri verilerin güvende.",
  },
];

const personas = [
  {
    icon: "🆕",
    title: "Yeni Danışman",
    pain: "Her müşteriyle farklı format — hiç standart yok",
    gain: "İlk müşteriyle profesyonelce tanış",
    stats: "2 dk'da hazır ilk sunum",
  },
  {
    icon: "💼",
    title: "Deneyimli Danışman",
    pain: "Haftada 10+ mülk — hazırlık için zaman kalmıyor",
    gain: "Portföyünü 3× hızla sun",
    stats: "%78 daha hızlı hazırlık",
  },
  {
    icon: "🏢",
    title: "Ekip Lideri",
    pain: "Ekibin sunumları tutarsız, kalite kontrol zor",
    gain: "Tüm ekip aynı standartta",
    stats: "Tek platformda tüm ekip",
  },
];

const faqs = [
  {
    q: "AI içerik ne kadar kaliteli?",
    a: "xAI Grok 4.1 Fast modeli kullanıyoruz — Türkçe emlak sektörü için özel prompt mimarisi ile. Çıkan metinler gerçek danışmanların yazdığı sunumlarla karşılaştırıldığında fark edilemiyor.",
  },
  {
    q: "Mülk bilgilerim güvende mi?",
    a: "Supabase altyapısı ile AES-256 şifreleme, Türkiye sunucuları, KVKK uyumlu. Verileriniz asla üçüncü taraflarla paylaşılmaz.",
  },
  {
    q: "İptal edebilir miyim?",
    a: "1 tık, 0 ceza. Dashboard'dan 30 saniyede iptal — sonraki dönem ücret kesilmez, kalan krediler kullanılabilir.",
  },
  {
    q: "Gerçekten 2 dakika mı sürüyor?",
    a: "Ortalama tamamlanma süresi 90 saniye. Formu doldur, AI üretirken çay iç, sunum hazır.",
  },
  {
    q: "PDF ve mobil aynı anda mı çıkıyor?",
    a: "Evet. Sunum oluşturulduğu anda hem paylaşılabilir mobil link hem indirilebilir A4 PDF hazır. Ek işlem yok.",
  },
];

const testimonials = [
  {
    name: "Mehmet A.",
    role: "Kıdemli Danışman, RE/MAX",
    avatar: "MA",
    comment: "Haftada 12-15 mülk sunuyorum. Eskiden hazırlık için sabahları 1-2 saat harcıyordum. PYRIZE ile bu süre 15 dakikaya indi. Müşterilerimin %90'ı 'çok profesyoneldi' diyor.",
  },
  {
    name: "Selin K.",
    role: "Ofis Sahibi, 8 Danışman Ekibi",
    avatar: "SK",
    comment: "Ekibimin sunum kalitesi standart hale geldi. Yeni danışmanlar bile 3 günde kurumsal görünümlü sunum yapıyor. Müşteri şikayetleri sıfıra indi.",
  },
  {
    name: "Tarık D.",
    role: "Yeni Danışman, 6 aylık",
    avatar: "TD",
    comment: "Bu işe 6 ay önce başladım. PYRIZE olmadan bu kadar hızlı büyüyemezdim. İlk ay 3 portföy aldım — hepsinde PYRIZE sunumu kullandım.",
  },
];

const pricingPlans = [
  {
    title: "Freemium",
    price: "0",
    period: "",
    credits: "60 kredi/ay",
    desc: "Başlamak için ideal",
    features: [
      "Her sunum: 3 kredi",
      "Tüm şablonlar",
      "Mobil link",
      "PDF export",
    ],
    cta: "Ücretsiz Başla",
    popular: false,
    highlight: false,
  },
  {
    title: "Başlangıç",
    price: "249",
    period: "/ay",
    credits: "300 kredi/ay",
    desc: "Aktif danışmanlar için",
    features: [
      "Her sunum: 3 kredi (~100 sunum)",
      "CRM modülü",
      "Öncelikli destek",
      "Performans raporu",
    ],
    cta: "Başla",
    popular: false,
    highlight: false,
  },
  {
    title: "Profesyonel",
    price: "449",
    period: "/ay",
    credits: "800 kredi/ay",
    desc: "Büyüyen ekipler için",
    features: [
      "Her sunum: 3 kredi (~266 sunum)",
      "Ekip yönetimi",
      "Özel şablon düzenleme",
      "API erişimi",
    ],
    cta: "Başla",
    popular: true,
    highlight: true,
  },
  {
    title: "Sınırsız",
    price: "899",
    period: "/ay",
    credits: "Sınırsız",
    desc: "Ajanslar ve büyük ekipler",
    features: [
      "Sınırsız sunum",
      "White-label seçeneği",
      "Dedicated destek",
      "Özel entegrasyonlar",
    ],
    cta: "İletişime Geç",
    popular: false,
    highlight: false,
  },
];

/* ───────────────────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#001F3F] text-[#F6F7ED] font-dm-sans overflow-x-hidden">

      {/* Navigation */}
      <CardNav
        logo="/logo.svg"
        logoAlt="PYRIZE Logo"
        items={cardNavItems}
        baseColor="rgba(0, 24, 50, 0.96)"
        menuColor="#F6F7ED"
        buttonBgColor="#DBE64C"
        buttonTextColor="#001F3F"
        ease="power3.out"
      />

      <main>

        {/* ═══════════════════════════════════════════════════════════
            1 · HERO
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          <HeroOrbBackground />

          {/* Subtle blue gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#001F3F] via-transparent to-[#001F3F] opacity-60" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DBE64C]/30 bg-[#DBE64C]/10 px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#DBE64C]" />
              <span className="text-sm text-[#DBE64C] font-medium">AI Destekli Emlak Sunum Platformu</span>
            </div>

            {/* Headline */}
            <h1 className="font-instrument italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F6F7ED] leading-[1.1] mb-6">
              Rakipleriniz bugün{" "}
              <span className="not-italic text-[#DBE64C]">3 sunum</span>{" "}
              hazırladı.
              <br />
              Siz henüz 0&apos;dasınız.
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-xl text-[#F6F7ED]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Türkiye&apos;nin en hızlı emlak sunum aracı.{" "}
              <strong className="text-[#F6F7ED]">2 dakika.</strong>{" "}
              Form doldur. Müşterin al.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#DBE64C] text-[#001F3F] font-bold text-lg hover:bg-[#c9d441] transition-all shadow-[0_0_32px_rgba(219,230,76,0.35)] hover:shadow-[0_0_48px_rgba(219,230,76,0.5)] hover:-translate-y-0.5"
              >
                Şimdi Ücretsiz Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#nasil-calisir"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-[#F6F7ED]/20 text-[#F6F7ED]/70 hover:text-[#F6F7ED] hover:border-[#F6F7ED]/40 transition-all text-sm"
              >
                Nasıl çalışır?
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#F6F7ED]/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#74C365]" />
                Kredi kartı gerekmez
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#74C365]" />
                60 ücretsiz kredi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#74C365]" />
                2 dakikada sunum
              </span>
            </div>
          </div>

          {/* Count-up stats */}
          <div className="relative z-10 mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            {[
              { num: "3.200+", label: "sunum oluşturuldu" },
              { num: "%78", label: "daha hızlı hazırlık" },
              { num: "500+", label: "aktif danışman" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold text-[#DBE64C]">{stat.num}</div>
                <div className="text-xs text-[#F6F7ED]/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2 · LOGO MARQUEE
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-10 border-y border-[#1E488F]/30 bg-[#001832]">
          <div className="container mx-auto px-4">
            <p className="text-xs text-[#F6F7ED]/30 text-center uppercase tracking-[0.2em] mb-6">
              Danışmanların güvendiği markalar
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#001832] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#001832] to-transparent z-10 pointer-events-none" />
              <div className="marquee-track py-2">
                {clients.concat(clients).map((client, idx) => (
                  <span
                    key={`${client}-${idx}`}
                    className="mx-10 text-sm tracking-[0.2em] text-[#F6F7ED]/40 uppercase whitespace-nowrap"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3 · PROBLEM / PAIN
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                Tanıdık geliyor mu?
              </p>
              <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED] mb-4">
                Hâlâ Excel&apos;de mi<br />hazırlıyorsunuz?
              </h2>
              <p className="text-[#F6F7ED]/60 text-lg">
                Türkiye&apos;deki danışmanların %73&apos;ü bu sorunlardan en az ikisini yaşıyor.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Clock,
                  pain: "Sabah 9'da randevu var, gece 2'ye kadar sunum hazırlıyorsunuz",
                  detail: "Ortalama hazırlık süresi: 3-4 saat",
                },
                {
                  icon: MessageSquare,
                  pain: "Müşteri PDF'i açmıyor, WhatsApp'ta kaybolup gidiyor",
                  detail: "PDF açılma oranı: %23",
                },
                {
                  icon: RefreshCw,
                  pain: "Her mülk için sıfırdan başlıyorsunuz — şablon yok, standart yok",
                  detail: "Her sunum için 45 dk tasarım",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <X className="w-5 h-5 text-red-400 shrink-0" />
                    <span className="text-xs text-red-400 font-medium uppercase tracking-wide">Sorun {i + 1}</span>
                  </div>
                  <p className="text-[#F6F7ED] font-medium mb-3 leading-snug">{item.pain}</p>
                  <p className="text-xs text-red-400/70">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Pivot */}
            <div className="text-center rounded-2xl border border-[#DBE64C]/30 bg-[#DBE64C]/5 p-8">
              <p className="text-xl md:text-2xl font-instrument italic text-[#F6F7ED] mb-2">
                &ldquo;Ya bütün bunlar <span className="text-[#DBE64C] not-italic font-bold">2 dakika</span> sürseydi?&rdquo;
              </p>
              <p className="text-[#F6F7ED]/50 text-sm">PYRIZE&apos;yi kuran danışmanın sorduğu soru buydu.</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            4 · NASIL ÇALIŞIR
        ═══════════════════════════════════════════════════════════ */}
        <section id="nasil-calisir" className="bg-[#001832] py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                  Nasıl Çalışır?
                </p>
                <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED]">
                  3 adımda sunum hazır
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {processSteps.map((step, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl border border-[#1E488F]/40 bg-[#1E488F]/10 p-8 text-center"
                  >
                    <div className="text-5xl font-bold text-[#DBE64C]/20 mb-4 font-instrument">
                      {step.step}
                    </div>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#DBE64C]/10 border border-[#DBE64C]/20 mb-5">
                      <step.icon className="w-6 h-6 text-[#DBE64C]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#F6F7ED] mb-2">{step.title}</h3>
                    <p className="text-[#F6F7ED]/60 leading-relaxed text-sm">{step.description}</p>
                    {i < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-[#1E488F]">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            5 · ŞABLON SHOWCASE
        ═══════════════════════════════════════════════════════════ */}
        <section id="sablonlar" className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                5 Sunum Stili
              </p>
              <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED] mb-4">
                Her mülk, doğru stratejiyle
              </h2>
              <p className="text-[#F6F7ED]/60 max-w-xl mx-auto">
                Portföy almak mı, satmak mı? Her amaç için ayrı pazarlama psikolojisi.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {templateStyles.map((tmpl, i) => (
                <div
                  key={i}
                  className="group rounded-2xl p-5 border border-white/10 hover:border-[#DBE64C]/40 transition-all cursor-pointer hover:-translate-y-1"
                  style={{ backgroundColor: tmpl.color + "33" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                    style={{ backgroundColor: tmpl.color }}
                  >
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#F6F7ED] text-sm mb-1">{tmpl.name}</h3>
                  <p className="text-[#F6F7ED]/50 text-xs mb-3 leading-snug">{tmpl.desc}</p>
                  <span className="text-[10px] text-[#DBE64C]/70 border border-[#DBE64C]/20 rounded-full px-2 py-0.5">
                    {tmpl.pages}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            6 · ÖZELLİKLER
        ═══════════════════════════════════════════════════════════ */}
        <section id="ozellikler" className="bg-[#001832] py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                  Özellikler
                </p>
                <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED]">
                  Rakiplerinizden fark yaratan<br />her özellik dahil
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#1E488F]/30 bg-[#1E488F]/10 p-6 hover:border-[#DBE64C]/30 transition-all group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#DBE64C]/10 border border-[#DBE64C]/20 mb-4 group-hover:bg-[#DBE64C]/20 transition-colors">
                      <feat.icon className="w-5 h-5 text-[#DBE64C]" />
                    </div>
                    <h3 className="font-semibold text-[#F6F7ED] mb-2">{feat.title}</h3>
                    <p className="text-sm text-[#F6F7ED]/60 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            7 · PERSONALAR
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                Kim İçin?
              </p>
              <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED]">
                Hangi danışmansınız?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {personas.map((persona, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#1E488F]/40 bg-gradient-to-b from-[#1E488F]/15 to-transparent p-7"
                >
                  <div className="text-4xl mb-4">{persona.icon}</div>
                  <h3 className="font-instrument italic text-xl text-[#F6F7ED] mb-4">{persona.title}</h3>

                  <div className="mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-[#F6F7ED]/60">{persona.pain}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#74C365] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#F6F7ED]">{persona.gain}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#DBE64C]/10 border border-[#DBE64C]/20 px-3 py-2 text-center">
                    <span className="text-xs text-[#DBE64C] font-semibold">{persona.stats}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            8 · İTİRAZ ENGELLEME (FAQ)
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-[#001832] py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                  Aklınızdaki Sorular
                </p>
                <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED]">
                  &ldquo;Ama ya...&rdquo; diyorsanız
                </h2>
              </div>

              <FAQAccordion items={faqs} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            9 · SOSYAL KANIT
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                Gerçek Sonuçlar
              </p>
              <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED]">
                500+ danışman zaten<br />kullanıyor
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#1E488F]/40 bg-[#1E488F]/10 p-6"
                >
                  <div className="flex text-[#DBE64C] mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-[#F6F7ED]/80 text-sm leading-relaxed mb-6">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E488F] to-[#DBE64C]/50 flex items-center justify-center text-xs font-bold text-[#F6F7ED]">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[#F6F7ED] text-sm">{t.name}</p>
                      <p className="text-xs text-[#F6F7ED]/50">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            10 · FİYATLANDIRMA
        ═══════════════════════════════════════════════════════════ */}
        <section id="fiyatlandirma" className="bg-[#001832] py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-sm text-[#DBE64C] font-medium uppercase tracking-wider mb-3">
                  Fiyatlandırma
                </p>
                <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED] mb-4">
                  Bugün başlayın, yarın büyüyün
                </h2>
                <p className="text-[#F6F7ED]/60 max-w-xl mx-auto">
                  Tüm planlarda aynı AI kalitesi. Fark sadece kapasite.
                </p>
              </div>

              {/* Guarantee banner */}
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#74C365]/30 bg-[#74C365]/10 px-6 py-4 mb-10 max-w-2xl mx-auto">
                <ShieldCheck className="w-5 h-5 text-[#74C365] shrink-0" />
                <p className="text-sm text-[#F6F7ED]">
                  <strong className="text-[#74C365]">7 gün para iade garantisi.</strong>{" "}
                  İlk sunumunuz 48 saatte hazır değilse tam iade.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingPlans.map((plan, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-6 relative overflow-hidden ${
                      plan.highlight
                        ? "border-2 border-[#DBE64C]/60 bg-gradient-to-b from-[#DBE64C]/10 to-[#1E488F]/20"
                        : "border border-[#1E488F]/30 bg-[#1E488F]/10"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-[#DBE64C] px-2.5 py-1 text-[10px] font-bold text-[#001F3F]">
                        <Star className="w-3 h-3 fill-current" />
                        Popüler
                      </div>
                    )}
                    <h3 className="font-semibold text-[#F6F7ED] text-lg mb-1">{plan.title}</h3>
                    <p className="text-xs text-[#F6F7ED]/40 mb-4">{plan.desc}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-[#F6F7ED]">₺{plan.price}</span>
                      <span className="text-[#F6F7ED]/50 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-sm text-[#DBE64C] mb-5 font-medium">{plan.credits}</p>
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#F6F7ED]/70">
                          <CheckCircle2 className="w-4 h-4 text-[#00804C] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/register"
                      className={`block w-full text-center rounded-xl py-3 text-sm font-semibold transition-all ${
                        plan.highlight
                          ? "bg-[#DBE64C] text-[#001F3F] hover:bg-[#c9d441] shadow-[0_0_24px_rgba(219,230,76,0.3)]"
                          : "bg-[#1E488F]/30 border border-[#1E488F]/50 text-[#F6F7ED] hover:bg-[#1E488F]/50"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            11 · FINAL CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl border border-[#DBE64C]/30 bg-gradient-to-b from-[#DBE64C]/10 to-[#1E488F]/10 p-12 md:p-20">
              <h2 className="font-instrument italic text-3xl md:text-5xl text-[#F6F7ED] mb-4">
                Bir sunum.<br />
                İki dakika.<br />
                <span className="text-[#DBE64C] not-italic">Müşterin kazanılmış.</span>
              </h2>
              <p className="text-[#F6F7ED]/60 text-lg mb-10 max-w-xl mx-auto">
                Yarın sabah rakipleriniz 3 sunum hazırlarken siz 4. müşteriyle görüşüyor olacaksınız.
              </p>
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2.5 px-10 py-5 rounded-xl bg-[#DBE64C] text-[#001F3F] font-bold text-lg hover:bg-[#c9d441] transition-all shadow-[0_0_48px_rgba(219,230,76,0.4)] hover:shadow-[0_0_64px_rgba(219,230,76,0.6)] hover:-translate-y-1"
              >
                Ücretsiz Hesap Aç
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-[#F6F7ED]/40 mt-4">
                60 ücretsiz kredi · Kredi kartı gerekmez · 2 dakikada ilk sunum
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E488F]/30 bg-[#001832]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-instrument italic text-lg text-[#F6F7ED] mb-1">PYRIZE</p>
              <p className="text-xs text-[#F6F7ED]/40">
                &copy; {new Date().getFullYear()} PYRIZE. Tüm hakları saklıdır.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#F6F7ED]/50">
              <Link href="/gizlilik" className="hover:text-[#F6F7ED] transition-colors">
                Gizlilik
              </Link>
              <Link href="/kvkk" className="hover:text-[#F6F7ED] transition-colors">
                KVKK
              </Link>
              <Link href="/iletisim" className="hover:text-[#F6F7ED] transition-colors">
                Destek
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
