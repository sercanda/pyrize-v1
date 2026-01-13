import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Emlak Pazarlamasında Dijital Dönüşüm: 2025 Trendleri",
      excerpt:
        "Emlak sektöründe dijital pazarlama stratejileri ve yapay zeka kullanımının önemi hakkında detaylı bir inceleme.",
      author: "PYRIZE Ekibi",
      date: "15 Ocak 2025",
      category: "Pazarlama",
      image: "https://picsum.photos/600/400?random=1",
      readTime: "5 dk"
    },
    {
      id: 2,
      title: "AI Destekli Sunum Sayfaları ile Satış Oranınızı Artırın",
      excerpt:
        "Yapay zeka teknolojisi ile oluşturulan profesyonel sunum sayfalarının satış sürecinize etkisi ve başarı hikayeleri.",
      author: "PYRIZE Ekibi",
      date: "12 Ocak 2025",
      category: "Teknoloji",
      image: "https://picsum.photos/600/400?random=2",
      readTime: "7 dk"
    },
    {
      id: 3,
      title: "Gayrimenkul Yatırımcıları İçin Portföy Yönetimi Rehberi",
      excerpt:
        "Gayrimenkul yatırımcılarının portföylerini daha etkili yönetmeleri için ipuçları ve stratejiler.",
      author: "PYRIZE Ekibi",
      date: "10 Ocak 2025",
      category: "Yatırım",
      image: "https://picsum.photos/600/400?random=3",
      readTime: "6 dk"
    },
    {
      id: 4,
      title: "Müşteri Güvenini Kazanmanın 5 Altın Kuralı",
      excerpt:
        "Emlak danışmanlarının müşterilerine güven verirken dikkat etmesi gereken noktalar ve best practice'ler.",
      author: "PYRIZE Ekibi",
      date: "8 Ocak 2025",
      category: "İş Geliştirme",
      image: "https://picsum.photos/600/400?random=4",
      readTime: "4 dk"
    },
    {
      id: 5,
      title: "Mobil Uyumlu Sunum Sayfalarının Önemi",
      excerpt:
        "Mobil cihazlardan erişimin artması ile birlikte responsive tasarımın emlak sektöründeki kritik rolü.",
      author: "PYRIZE Ekibi",
      date: "5 Ocak 2025",
      category: "Teknoloji",
      image: "https://picsum.photos/600/400?random=5",
      readTime: "5 dk"
    },
    {
      id: 6,
      title: "2025'te Emlak Sektöründe Beklenen Değişiklikler",
      excerpt:
        "Yeni yılla birlikte emlak sektöründe yaşanması beklenen teknolojik ve pazarlama trendleri.",
      author: "PYRIZE Ekibi",
      date: "3 Ocak 2025",
      category: "Sektör",
      image: "https://picsum.photos/600/400?random=6",
      readTime: "8 dk"
    }
  ];

  const categories = ["Tümü", "Pazarlama", "Teknoloji", "Yatırım", "İş Geliştirme", "Sektör"];

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
          <Link href="/blog" className="text-white font-semibold transition-colors">
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
            Blog
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
            Emlak sektöründe güncel haberler, ipuçları ve rehberler
          </p>
        </section>

        {/* Categories Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full transition-colors ${
                  category === "Tümü"
                    ? "bg-[#24d6a4] text-page-bg font-semibold"
                    : "bg-transparent border border-white/20 text-slate-300 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-transparent rounded-lg border border-white/20 overflow-hidden hover:border-[#24d6a4] transition-colors group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#24d6a4] text-page-bg px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} okuma</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#24d6a4] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{post.author}</span>
                    <span className="text-[#24d6a4] font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                      Devamını Oku →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-20 max-w-3xl mx-auto">
          <div className="bg-transparent p-8 rounded-lg border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Bültenimize Abone Olun</h2>
            <p className="text-slate-400 mb-6">
              En son haberler, ipuçları ve özel içeriklerden haberdar olun
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24d6a4]"
              />
              <button className="bg-[#24d6a4] text-page-bg font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity">
                Abone Ol
              </button>
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

