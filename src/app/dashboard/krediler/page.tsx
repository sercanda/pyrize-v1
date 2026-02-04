"use client";

import { useMemo, useState } from "react";
import { Flame, Sparkles } from "lucide-react";

type CreditPackage = {
  id: string;
  credits: number;
  priceUSD: number;
  priceTRY?: number;
  flashSale?: boolean;
  bonusCredits?: number;
};

type Plan = {
  id: string;
  name: string;
  priceUSD: number;
  duration: string;
  features: string[];
  popular?: boolean;
};

// Kredi paketleri: 50'den başlayıp artan
const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "credits-50",
    credits: 50,
    priceUSD: 5,
  },
  {
    id: "credits-100",
    credits: 100,
    priceUSD: 10,
  },
  {
    id: "credits-200",
    credits: 200,
    priceUSD: 20,
  },
  {
    id: "credits-500",
    credits: 500,
    bonusCredits: 50,
    priceUSD: 50,
    flashSale: true,
  },
  {
    id: "credits-1000",
    credits: 1000,
    bonusCredits: 200,
    priceUSD: 100,
    flashSale: true,
  },
  {
    id: "credits-2000",
    credits: 2000,
    bonusCredits: 400,
    priceUSD: 200,
    flashSale: true,
  },
  {
    id: "credits-5000",
    credits: 5000,
    bonusCredits: 1000,
    priceUSD: 600,
    flashSale: true,
  },
  {
    id: "credits-10000",
    credits: 10000,
    bonusCredits: 2000,
    priceUSD: 1200,
    flashSale: true,
  },
];

const PLANS: Plan[] = [
  {
    id: "plan-unlimited",
    name: "Sınırsız Plan",
    priceUSD: 30,
    duration: "30 gün",
    features: [
      "Sınırsız sunum oluşturma",
      "Sınırsız fotoğraf düzenleme",
      "Tüm premium özellikler",
      "Öncelikli destek",
    ],
    popular: true,
  },
];

// Kredi maliyetleri
export const CREDIT_COSTS = {
  SUNUM_OLUSTURMA: 25,
  FOTO_DUZENLEME: 3,
} as const;

type TabType = "credits" | "plans";

export default function CreditPackagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("credits");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // TODO: Supabase'den gerçek bakiye ve plan verilerini çek
  const { credits, unlimitedUntil } = useMemo(() => {
    return {
      credits: 125,
      unlimitedUntil: null as string | null,
    };
  }, []);

  const hasUnlimitedPlan =
    Boolean(unlimitedUntil) && unlimitedUntil && new Date(unlimitedUntil) > new Date();

  async function handlePurchase(id: string, type: "credit" | "plan") {
    setIsProcessing(id);
    try {
      // TODO: `/api/billing/checkout` endpointine istek at
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Satın alma simülasyonu:", type, id);
    } finally {
      setIsProcessing(null);
    }
  }

  const totalCredits = (pkg: CreditPackage) =>
    pkg.credits + (pkg.bonusCredits || 0);

  const usdToTry = (usd: number) => Math.round(usd * 35);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Kredi & Planlar
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 md:text-base">
            Sunum oluşturma ve fotoğraf düzenleme için kredi paketleri veya
            sınırsız plan.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-4 text-sm text-white shadow-[0_18px_40px_rgba(14,165,233,0.35)]">
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-cyan-300" />
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-cyan-200">
                Mevcut Kredi
              </span>
              <p className="text-2xl font-bold text-cyan-200">{credits}</p>
            </div>
          </div>
          {hasUnlimitedPlan && (
            <p className="mt-1 text-xs text-cyan-100/80">
              Sınırsız plan aktif (Bitiş:{" "}
              {new Date(unlimitedUntil!).toLocaleDateString("tr-TR")})
            </p>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="mt-8 flex gap-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab("credits")}
          className={`relative pb-3 text-sm font-semibold transition ${
            activeTab === "credits"
              ? "text-cyan-300"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Kredi
          {activeTab === "credits" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`relative pb-3 text-sm font-semibold transition ${
            activeTab === "plans"
              ? "text-cyan-300"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Planlar
          {activeTab === "plans" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400" />
          )}
        </button>
      </nav>

      {/* Credit Policy Note */}
      {activeTab === "credits" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
          <p>
            Not: Krediler üyelikle değiştirilemez, iade edilemez, transfer
            edilemez veya çekilemez. 2 yıl geçerlilik süresi.
            <button className="ml-1 text-cyan-300 hover:text-cyan-200 hover:underline">
              Kredi Politikası
            </button>
          </p>
        </div>
      )}

      {/* Credits Tab */}
      {activeTab === "credits" && (
        <section className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(5,12,28,0.35)] transition-all hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(14,165,233,0.2)]"
              >
                {/* Flame icon background */}
                <div className="pointer-events-none absolute bottom-0 right-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Flame className="h-32 w-32 text-cyan-400" />
                </div>

                {pkg.flashSale && (
                  <div className="mb-3 inline-flex w-fit rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                    Flash Sale
                  </div>
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">
                    {totalCredits(pkg).toLocaleString("tr-TR")}
                  </span>
                </div>

                {pkg.bonusCredits && (
                  <p className="mt-1 text-xs text-slate-400">
                    Toplam: {pkg.credits.toLocaleString("tr-TR")} +{" "}
                    {pkg.bonusCredits.toLocaleString("tr-TR")} Bonus
                  </p>
                )}

                <p className="mt-4 text-2xl font-bold text-cyan-300">
                  {usdToTry(pkg.priceUSD).toLocaleString("tr-TR")} TL
                </p>

                <button
                  onClick={() => handlePurchase(pkg.id, "credit")}
                  disabled={isProcessing === pkg.id}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition-all hover:border-cyan-300/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing === pkg.id ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      İşleniyor...
                    </>
                  ) : (
                    "Satın Al"
                  )}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <section className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-8 shadow-[0_25px_60px_rgba(6,12,28,0.35)] transition-all ${
                  plan.popular
                    ? "border-cyan-400/60 bg-gradient-to-br from-cyan-600/20 via-[#0b1229] to-[#050b1d] shadow-[0_30px_80px_rgba(14,165,233,0.35)]"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                    Popüler
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-cyan-300">
                      {usdToTry(plan.priceUSD).toLocaleString("tr-TR")} TL
                    </span>
                    <span className="text-sm text-slate-400"> / {plan.duration}</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3 text-sm text-slate-300">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 text-cyan-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id, "plan")}
                  disabled={isProcessing === plan.id}
                  className={`mt-auto inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-[0_8px_32px_rgba(14,165,233,0.4)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(14,165,233,0.5)]"
                      : "border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 hover:border-cyan-300/60 hover:bg-cyan-500/20"
                  }`}
                >
                  {isProcessing === plan.id ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      İşleniyor...
                    </>
                  ) : (
                    "Planı Aktifleştir"
                  )}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Credit Usage Info */}
      <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Kredi Kullanım Bilgisi
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Sunum Oluşturma
            </p>
            <p className="mt-2 text-2xl font-bold text-cyan-300">
              {CREDIT_COSTS.SUNUM_OLUSTURMA} kredi
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Her sunum oluşturma işlemi
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Fotoğraf Düzenleme
            </p>
            <p className="mt-2 text-2xl font-bold text-cyan-300">
              {CREDIT_COSTS.FOTO_DUZENLEME} kredi
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Her AI fotoğraf düzenleme işlemi
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
