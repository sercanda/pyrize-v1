import Link from "next/link";

export default function FiyatlandirmaPage() {
  const plans = [
    {
      name: "Başlangıç",
      price: "₺0",
      period: "Süresiz",
      description: "Kişisel kullanım için ideal",
      features: [
        "5 funnel sayfası",
        "Temel AI içerik üretimi",
        "PDF indirme",
        "Mobil/Desktop görünüm",
        "Email desteği"
      ],
      popular: false
    },
    {
      name: "Profesyonel",
      price: "₺299",
      period: "aylık",
      description: "Küçük işletmeler için",
      features: [
        "Sınırsız funnel sayfası",
        "Gelişmiş AI içerik üretimi",
        "PDF indirme",
        "Mobil/Desktop görünüm",
        "Özel marka renkleri",
        "Öncelikli email desteği",
        "Analitik raporlar"
      ],
      popular: true
    },
    {
      name: "Kurumsal",
      price: "Özel",
      period: "fiyat",
      description: "Büyük ekipler için",
      features: [
        "Sınırsız funnel sayfası",
        "Premium AI içerik üretimi",
        "PDF indirme",
        "Mobil/Desktop görünüm",
        "Özel marka entegrasyonu",
        "7/24 telefon desteği",
        "Gelişmiş analitik",
        "Özel API erişimi",
        "Dedike hesap yöneticisi"
      ],
      popular: false
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-page-bg text-slate-300 font-sans antialiased">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="logo-text font-bold text-xl uppercase tracking-tight">
            PYRIZE
          </span>
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors">
            Anasayfa
          </Link>
          <Link href="/hakkimizda" className="text-slate-300 hover:text-white transition-colors">
            Hakkımızda
          </Link>
          <Link href="/fiyatlandirma" className="text-white font-semibold transition-colors">
            Fiyatlandırma
          </Link>
          <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/iletisim" className="text-slate-300 hover:text-white transition-colors">
            İletişim
          </Link>
        </nav>
        <Link
          href="/auth/login"
          className="bg-white text-page-bg font-semibold py-2 px-4 rounded-md text-sm hover:bg-slate-200 transition-colors"
        >
          Giriş Yap
        </Link>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-20 relative overflow-hidden mb-16">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 opacity-70"></div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight max-w-4xl mx-auto relative z-10">
            Fiyatlandırma
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
            İhtiyacınıza uygun planı seçin, hemen başlayın
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-transparent p-8 rounded-lg border ${
                  plan.popular
                    ? "border-[#DBE64C] border-2 scale-105"
                    : "border-white/20"
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#DBE64C] text-page-bg px-4 py-1 rounded-full text-sm font-semibold">
                      En Popüler
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period !== "Süresiz" && plan.period !== "fiyat" && (
                      <span className="text-slate-400">/{plan.period}</span>
                    )}
                    {plan.period === "fiyat" && (
                      <span className="text-slate-400 text-lg block mt-2">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="material-symbols-outlined text-[#DBE64C] mr-3 mt-0.5">
                        check_circle
                      </span>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Kurumsal" ? "/iletisim" : "/auth/register"}
                  className={`block w-full text-center py-3 px-6 rounded-md font-semibold transition-colors ${
                    plan.popular
                      ? "bg-[#DBE64C] text-page-bg hover:opacity-90"
                      : "bg-transparent text-white border border-white/20 hover:bg-white/10"
                  }`}
                >
                  {plan.name === "Kurumsal" ? "İletişime Geçin" : "Başlayın"}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-6">
            <div className="bg-transparent p-6 rounded-lg border border-white/20">
              <h3 className="font-semibold text-xl text-white mb-2">
                Ücretsiz planın limiti nedir?
              </h3>
              <p className="text-slate-300">
                Ücretsiz plan ile 5 funnel sayfası oluşturabilirsiniz. Tüm temel özelliklere erişim
                sağlarsınız.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-white/20">
              <h3 className="font-semibold text-xl text-white mb-2">
                İstediğim zaman plan değiştirebilir miyim?
              </h3>
              <p className="text-slate-300">
                Evet, hesabınızdan istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz.
                Değişiklikler anında geçerli olur.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-white/20">
              <h3 className="font-semibold text-xl text-white mb-2">
                Ödeme nasıl yapılır?
              </h3>
              <p className="text-slate-300">
                Kredi kartı, banka kartı veya havale ile ödeme yapabilirsiniz. Tüm ödemeler güvenli
                ödeme altyapımız üzerinden işlenir.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10 mt-16">
        <p className="text-sm text-slate-400">© 2025 PYRIZE. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

