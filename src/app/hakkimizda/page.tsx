import Link from "next/link";

export default function HakkimizdaPage() {
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
          <Link href="/hakkimizda" className="text-white font-semibold transition-colors">
            Hakkımızda
          </Link>
          <Link href="/fiyatlandirma" className="text-slate-300 hover:text-white transition-colors">
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
            Hakkımızda
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
            PYRIZE ile emlak sektöründe dijital dönüşümü başlatın
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Misyonumuz</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6 text-center">
              PYRIZE, emlak danışmanları ve yatırımcılar için AI destekli, profesyonel sunum sayfaları
              oluşturarak sektörde dijitalleşmeyi hızlandırmayı hedefliyor. Müşterilerinize en etkili
              şekilde portföy sunabilmeniz için güçlü araçlar sağlıyoruz.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed text-center">
              Satış odaklı değil, bilgilendirme ve güven inşası odaklı yaklaşımımızla, emlak sektöründe
              şeffaflığı artırmayı ve tüm taraflar için daha iyi bir deneyim yaratmayı amaçlıyoruz.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-transparent p-6 rounded-lg border border-white/20 text-center">
              <span className="material-symbols-outlined text-[#3A7DFF] text-4xl mb-4 block">
                verified
              </span>
              <h3 className="font-semibold text-xl text-white mb-3">Güvenilirlik</h3>
              <p className="text-slate-400">
                Şeffaf ve güvenilir bir platform sunuyoruz. Tüm verileriniz güvende ve gizliliğiniz korunuyor.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-white/20 text-center">
              <span className="material-symbols-outlined text-[#3A7DFF] text-4xl mb-4 block">
                innovation
              </span>
              <h3 className="font-semibold text-xl text-white mb-3">İnovasyon</h3>
              <p className="text-slate-400">
                Yapay zeka teknolojilerini kullanarak emlak sektöründe yenilikçi çözümler sunuyoruz.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-white/20 text-center">
              <span className="material-symbols-outlined text-[#3A7DFF] text-4xl mb-4 block">
                groups
              </span>
              <h3 className="font-semibold text-xl text-white mb-3">Müşteri Odaklılık</h3>
              <p className="text-slate-400">
                İhtiyaçlarınızı anlıyor ve sürekli gelişen bir platform sunuyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Neden PYRIZE?</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-transparent p-6 rounded-lg border border-white/20">
              <h3 className="font-semibold text-xl text-white mb-3">AI Destekli İçerik</h3>
              <p className="text-slate-300">
                Yapay zeka teknolojisi ile saniyeler içinde profesyonel, etkileyici sunum sayfaları
                oluşturun. Mülk türü, konum ve fiyat bilgilerinize göre özelleştirilmiş içerikler.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-white/20">
              <h3 className="font-semibold text-xl text-white mb-3">Zaman Tasarrufu</h3>
              <p className="text-slate-300">
                Manuel olarak saatlerce harcayacağınız sunum hazırlama sürecini dakikalara indirin.
                Daha fazla müşteriye odaklanın, daha fazla satış yapın.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-white/20">
              <h3 className="font-semibold text-xl text-white mb-3">Profesyonel Görünüm</h3>
              <p className="text-slate-300">
                Kurumsal görünümlü, modern tasarımlarla müşterilerinize güven verin. Kendi markanızı
                yansıtan özelleştirilebilir temalar.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <div className="bg-transparent p-8 rounded-lg border border-white/20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Bize Katılın</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              PYRIZE ile emlak sunumlarınızı bir üst seviyeye taşıyın
            </p>
            <Link
              href="/auth/register"
              className="bg-[#DBE64C] text-page-bg font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity inline-block"
            >
              Ücretsiz Başlayın
            </Link>
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

