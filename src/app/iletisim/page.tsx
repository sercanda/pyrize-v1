import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function IletisimPage() {
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
          <Link href="/fiyatlandirma" className="text-slate-300 hover:text-white transition-colors">
            Fiyatlandırma
          </Link>
          <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/iletisim" className="text-white font-semibold transition-colors">
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
            İletişim
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
            Sorularınız mı var? Bizimle iletişime geçin
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          {/* Contact Form */}
          <section>
            <div className="bg-transparent p-8 rounded-lg border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Bize Ulaşın</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-300">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24d6a4]"
                    placeholder="Adınız ve soyadınız"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24d6a4]"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-slate-300">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24d6a4]"
                    placeholder="Mesaj konusu"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-slate-300">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24d6a4] resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#24d6a4] text-page-bg font-semibold py-3 px-6 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gönder
                </button>
              </form>
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <div className="space-y-8">
              <div className="bg-transparent p-8 rounded-lg border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#24d6a4]/20 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-[#24d6a4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">E-posta</h3>
                      <p className="text-slate-400">info@pyrize.com</p>
                      <p className="text-slate-400">destek@pyrize.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#24d6a4]/20 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-[#24d6a4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Telefon</h3>
                      <p className="text-slate-400">+90 (212) 555 0123</p>
                      <p className="text-slate-400">Çalışma Saatleri: 09:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#24d6a4]/20 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-[#24d6a4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Adres</h3>
                      <p className="text-slate-400">İstanbul, Türkiye</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-transparent p-8 rounded-lg border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Sosyal Medya</h2>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-white/5 p-3 rounded-lg border border-white/20 hover:bg-[#24d6a4] hover:border-[#24d6a4] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <span className="text-white">in</span>
                  </a>
                  <a
                    href="#"
                    className="bg-white/5 p-3 rounded-lg border border-white/20 hover:bg-[#24d6a4] hover:border-[#24d6a4] transition-colors"
                    aria-label="Twitter"
                  >
                    <span className="text-white">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className="bg-white/5 p-3 rounded-lg border border-white/20 hover:bg-[#24d6a4] hover:border-[#24d6a4] transition-colors"
                    aria-label="Instagram"
                  >
                    <span className="text-white">IG</span>
                  </a>
                </div>
              </div>

              <div className="bg-transparent p-8 rounded-lg border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Yardım Merkezi</h2>
                <p className="text-slate-400 mb-4">
                  Sık sorulan sorularınızın cevaplarını bulmak için yardım merkezimizi ziyaret edin.
                </p>
                <Link
                  href="/fiyatlandirma"
                  className="text-[#24d6a4] hover:underline font-semibold"
                >
                  SSS sayfasına git →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10 mt-16">
        <p className="text-sm text-slate-400">© 2025 PYRIZE. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

