"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Package,
  Calendar,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";

// Placeholder veri - sonra Supabase'den gelecek
const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 89,
  totalCreditsSold: 15420,
  totalRevenue: 3425000,
  feedbacksCount: 234,
  creditsUsed: 8920,
};

const mockUsers = [
  {
    id: "1",
    name: "Mehmet Yılmaz",
    email: "mehmet@example.com",
    creditsUsed: 45,
    creditsRemaining: 5,
    subscriptionType: "Premium",
    subscriptionEnd: "2025-02-15",
    status: "active",
    joinedDate: "2024-01-10",
  },
  {
    id: "2",
    name: "Ayşe Demirel",
    email: "ayse@example.com",
    creditsUsed: 120,
    creditsRemaining: 30,
    subscriptionType: "Sınırsız",
    subscriptionEnd: "2025-03-20",
    status: "active",
    joinedDate: "2023-11-05",
  },
  {
    id: "3",
    name: "Can Çakan",
    email: "can@example.com",
    creditsUsed: 8,
    creditsRemaining: 2,
    subscriptionType: "Kredi Paketi",
    subscriptionEnd: null,
    status: "inactive",
    joinedDate: "2025-01-20",
  },
];

const mockFeedbacks = [
  {
    id: "1",
    userName: "Mehmet Yılmaz",
    email: "mehmet@example.com",
    message: "Harika bir platform! Fotoğraf düzenleme özelliği çok başarılı.",
    rating: 5,
    date: "2025-01-15",
    status: "new",
  },
  {
    id: "2",
    userName: "Ayşe Demirel",
    email: "ayse@example.com",
    message: "Kredi sistemi biraz pahalı olabilir, ama kalite mükemmel.",
    rating: 4,
    date: "2025-01-14",
    status: "read",
  },
  {
    id: "3",
    userName: "Can Çakan",
    email: "can@example.com",
    message: "Admin paneli çok kullanışlı, teşekkürler!",
    rating: 5,
    date: "2025-01-13",
    status: "responded",
  },
];

const statCards = [
  {
    label: "Toplam Kullanıcı",
    value: mockStats.totalUsers.toLocaleString("tr-TR"),
    icon: Users,
    change: "+12%",
    trend: "up",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Aktif Abonelikler",
    value: mockStats.activeSubscriptions.toString(),
    icon: Package,
    change: "+5",
    trend: "up",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Toplam Kredi Satışı",
    value: mockStats.totalCreditsSold.toLocaleString("tr-TR"),
    icon: CreditCard,
    change: "+8%",
    trend: "up",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Toplam Gelir",
    value: `${(mockStats.totalRevenue / 1000).toFixed(0)}K ₺`,
    icon: TrendingUp,
    change: "+15%",
    trend: "up",
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Kullanılan Kredi",
    value: mockStats.creditsUsed.toLocaleString("tr-TR"),
    icon: CreditCard,
    change: "+23%",
    trend: "up",
    color: "from-indigo-500 to-blue-500",
  },
  {
    label: "Geri Bildirimler",
    value: mockStats.feedbacksCount.toString(),
    icon: MessageSquare,
    change: "+7",
    trend: "up",
    color: "from-rose-500 to-pink-500",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedTab, setSelectedTab] = useState<"overview" | "users" | "feedback">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Admin yetkilendirme kontrolü - Cookie'den kontrol ediyoruz
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth");
        const data = await response.json();
        
        if (data.authorized === true) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          setShowLogin(true);
        }
      } catch (error) {
        setIsAuthorized(false);
        setShowLogin(true);
      }
    };

    checkAuth();
  }, []);

  // Login işlemi
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await response.json();

      if (data.authorized === true || data.success === true) {
        setIsAuthorized(true);
        setShowLogin(false);
        // Sayfayı yenile ki middleware cookie'yi görebilsin
        window.location.reload();
      } else {
        setLoginError(data.error || "Erişim reddedildi");
      }
    } catch (error) {
      setLoginError("Giriş yapılırken bir hata oluştu");
    }
  };

  // Logout işlemi
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthorized(false);
      setShowLogin(true);
      router.push("/dashboard");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Yetkilendirme kontrolü yapılırken loading göster
  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 animate-pulse text-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Login formu göster
  if (showLogin || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-cyan-400/40 bg-white/5 p-8 shadow-[0_25px_60px_rgba(6,12,28,0.35)]">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-cyan-400" />
            <h1 className="mt-6 text-2xl font-bold text-white">Admin Paneli Girişi</h1>
            <p className="mt-3 text-sm text-slate-300">
              Bu sayfaya yalnızca geliştirici erişebilir
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-semibold text-white mb-2">
                Admin E-posta
              </label>
              <input
                id="adminEmail"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-2xl border border-white/15 bg-[#061126]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {loginError && (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#DBE64C] px-5 py-3 text-sm font-semibold text-page-bg shadow-[0_0_24px_rgba(219,230,76,0.35)] transition hover:opacity-90"
            >
              Giriş Yap
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Dashboard'a Dön
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            E-posta adresiniz .env.local dosyasındaki ADMIN_EMAIL ile eşleşmelidir
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedbacks = mockFeedbacks.filter(
    (fb) =>
      fb.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Admin Paneli</h1>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Platform istatistikleri, müşteri yönetimi ve geri bildirimler
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white">
            <Download className="h-4 w-4" />
            Rapor İndir
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200 transition hover:border-rose-400/60 hover:bg-rose-500/20"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-white/10">
        {[
          { id: "overview", label: "Genel Bakış" },
          { id: "users", label: "Müşteriler" },
          { id: "feedback", label: "Geri Bildirimler" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
            className={`px-4 py-2 text-sm font-medium transition ${
              selectedTab === tab.id
                ? "border-b-2 border-cyan-400 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stat.color} p-6 shadow-[0_25px_60px_rgba(6,12,28,0.35)]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        stat.trend === "up" ? "text-emerald-200" : "text-rose-200"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/80">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(6,12,28,0.35)]">
              <h2 className="text-lg font-semibold text-white">Son Aktiviteler</h2>
              <div className="mt-4 space-y-4">
                {[
                  { action: "Yeni abonelik", user: "Mehmet Yılmaz", time: "2 saat önce" },
                  { action: "Kredi paketi satın alındı", user: "Ayşe Demirel", time: "5 saat önce" },
                  { action: "Geri bildirim gönderildi", user: "Can Çakan", time: "1 gün önce" },
                ].map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{activity.action}</p>
                      <p className="text-xs text-slate-400">{activity.user}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(6,12,28,0.35)]">
              <h2 className="text-lg font-semibold text-white">Abonelik Durumu</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Aktif Abonelikler</span>
                  <span className="text-lg font-semibold text-white">
                    {mockStats.activeSubscriptions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Bu Ay Bitiyor</span>
                  <span className="text-lg font-semibold text-amber-400">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Son 30 Gün Yeni</span>
                  <span className="text-lg font-semibold text-emerald-400">+23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === "users" && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Müşteri ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-[#061126]/80 px-4 py-2 pl-10 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white">
              <Filter className="h-4 w-4" />
              Filtrele
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_rgba(6,12,28,0.35)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Kullanılan Kredi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Abonelik
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Kayıt Tarihi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{user.creditsUsed}</p>
                          <p className="text-xs text-slate-400">Kalan: {user.creditsRemaining}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.subscriptionType}
                          </p>
                          {user.subscriptionEnd && (
                            <p className="text-xs text-slate-400">
                              <Calendar className="mr-1 inline h-3 w-3" />
                              {new Date(user.subscriptionEnd).toLocaleDateString("tr-TR")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === "active" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-400">
                            <XCircle className="h-3 w-3" />
                            Pasif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(user.joinedDate).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {selectedTab === "feedback" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Geri bildirim ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-[#061126]/80 px-4 py-2 pl-10 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* Feedbacks List */}
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(6,12,28,0.35)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{feedback.userName}</p>
                        <p className="text-xs text-slate-400">{feedback.email}</p>
                      </div>
                      <div className="flex text-amber-300">
                        {Array.from({ length: feedback.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{feedback.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(feedback.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="ml-4">
                    {feedback.status === "new" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                        <Clock className="h-3 w-3" />
                        Yeni
                      </span>
                    )}
                    {feedback.status === "read" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-400">
                        Okundu
                      </span>
                    )}
                    {feedback.status === "responded" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Yanıtlandı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

