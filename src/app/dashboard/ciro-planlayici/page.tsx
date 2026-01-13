"use client";

import { useState } from "react";
import {
    Calculator,
    Target,
    TrendingUp,
    Users,
    CalendarDays,
    Building2,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Lightbulb
} from "lucide-react";
import { MagneticCard } from "@/components/ui/MagneticCard";

type Step = 1 | 2 | 3 | 4;

export default function CiroPlanlayiciPage() {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    // Step 1: Revenue Target
    const [targetRevenue, setTargetRevenue] = useState<string>("300000"); // Monthly Target
    const [commissionRate, setCommissionRate] = useState<string>("2.0"); // %
    const [avgPropertyPrice, setAvgPropertyPrice] = useState<string>("5000000"); // Average Price

    // Step 2: Current Performance
    const [activeListings, setActiveListings] = useState<string>("10");
    const [avgMonthlySales, setAvgMonthlySales] = useState<string>("1");
    const [creditEligibleRatio, setCreditEligibleRatio] = useState<string>("50"); // %
    const [salesCycleDays, setSalesCycleDays] = useState<string>("60");

    // Step 3: Conversion Rates
    const [listingConvRate, setListingConvRate] = useState<string>("20"); // Listings -> Sales
    const [clientConvRate, setClientConvRate] = useState<string>("5"); // Clients -> Sales

    // Results & AI
    const [results, setResults] = useState<any>(null);
    const [aiInsights, setAiInsights] = useState<any>(null);

    const calculateResults = async () => {
        setLoading(true);
        setAnalyzing(true);

        // Parse inputs
        const inputs = {
            targetRevenue: parseFloat(targetRevenue) || 0,
            commissionRate: parseFloat(commissionRate) || 0,
            avgPropertyPrice: parseFloat(avgPropertyPrice) || 0,
            currentActiveListings: parseInt(activeListings) || 0,
            avgMonthlySales: parseFloat(avgMonthlySales) || 0,
            creditEligibleRatio: parseFloat(creditEligibleRatio) || 0,
            avgSalesCycleDays: parseInt(salesCycleDays) || 0,
            listingConversionRate: parseFloat(listingConvRate) || 0,
            clientConversionRate: parseFloat(clientConvRate) || 0,
            clientConvRate: parseFloat(clientConvRate) || 0,
            meetingConversionRate: 25, // Default assumption
            creditBonusCoefficient: 1.2
        };

        try {
            // AI Call (which implicitly re-calculates or we can do local calc too)
            const response = await fetch('/api/ai/revenue-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            });

            // We can do client side calculation for immediate feedback
            const revPerSale = inputs.avgPropertyPrice * (inputs.commissionRate / 100);
            const reqSales = revPerSale > 0 ? Math.ceil(inputs.targetRevenue / revPerSale) : 0;
            const reqListings = inputs.listingConversionRate > 0 ? Math.ceil(reqSales / (inputs.listingConversionRate / 100)) : 0;
            const reqClients = inputs.clientConversionRate > 0 ? Math.ceil(reqSales / (inputs.clientConversionRate / 100)) : 0;
            const reqMeetings = Math.ceil(reqClients / 0.25); // Assumed 25% meeting conv

            setResults({
                reqSales,
                reqListings,
                reqClients,
                reqMeetings,
                revPerSale
            });

            if (response.ok) {
                const data = await response.json();
                setAiInsights(data);
            }
        } catch (e) {
            console.error("Calculation error", e);
        } finally {
            setLoading(false);
            setAnalyzing(false);
            setStep(4);
        }
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white md:text-4xl flex items-center gap-3">
                    <Calculator className="h-8 w-8 text-cyan-400" />
                    Ciro Planlayıcı
                </h1>
                <p className="mt-2 text-slate-400">
                    Hedeflediğiniz aylık ciroya ulaşmak için yapmanız gereken aktiviteleri hesaplayın ve yapay zeka destekli öneriler alın.
                </p>
            </header>

            {/* Progress Steps */}
            <div className="mb-8 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-cyan-500' : 'bg-white/10'}`}
                    />
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Step 1: Targets */}
                    {step === 1 && (
                        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-lg font-semibold text-white flex items-center gap-2">
                                <Target className="h-5 w-5 text-cyan-400" />
                                Adım 1: Hedef Belirleme
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Aylık Ciro Hedefi (TL)</label>
                                    <input
                                        type="number"
                                        value={targetRevenue}
                                        onChange={(e) => setTargetRevenue(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="Örn: 300000"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Ortalama Satış Fiyatı</label>
                                        <input
                                            type="number"
                                            value={avgPropertyPrice}
                                            onChange={(e) => setAvgPropertyPrice(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="Örn: 5000000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Komisyon Oranı (%)</label>
                                        <input
                                            type="number"
                                            value={commissionRate}
                                            onChange={(e) => setCommissionRate(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="2.0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400"
                            >
                                Devam Et <ArrowRight className="h-4 w-4" />
                            </button>
                        </section>
                    )}

                    {/* Step 2: Performance */}
                    {step === 2 && (
                        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-cyan-400" />
                                Adım 2: Mevcut Performans
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Aktif Portföy Sayısı</label>
                                        <input
                                            type="number"
                                            value={activeListings}
                                            onChange={(e) => setActiveListings(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Ortalama Aylık Satış</label>
                                        <input
                                            type="number"
                                            value={avgMonthlySales}
                                            onChange={(e) => setAvgMonthlySales(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Krediye Uygunluk (%)</label>
                                        <input
                                            type="number"
                                            value={creditEligibleRatio}
                                            onChange={(e) => setCreditEligibleRatio(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Ort. Satış Süresi (Gün)</label>
                                        <input
                                            type="number"
                                            value={salesCycleDays}
                                            onChange={(e) => setSalesCycleDays(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="60"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/10"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400"
                                >
                                    Devam Et <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Step 3: Conversions */}
                    {step === 3 && (
                        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-lg font-semibold text-white flex items-center gap-2">
                                <Users className="h-5 w-5 text-cyan-400" />
                                Adım 3: Dönüşüm Oranları
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Portföy -&gt; Satış (%)</label>
                                        <input
                                            type="number"
                                            value={listingConvRate}
                                            onChange={(e) => setListingConvRate(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="20"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Her 5 portföyden kaçı satılıyor?</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Müşteri -&gt; Satış (%)</label>
                                        <input
                                            type="number"
                                            value={clientConvRate}
                                            onChange={(e) => setClientConvRate(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="5"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Her 20 alıcıdan kaçı alım yapıyor?</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/10"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={calculateResults}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? "Hesaplanıyor..." : "Planı Oluştur"}
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Step 4: Results Dashboard */}
                    {step === 4 && results && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Sonuç Planınız</h2>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                                >
                                    Yeni Yeniden Hesapla
                                </button>
                            </div>

                            {/* AI Insights Card */}
                            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-indigo-500/5 p-6 md:p-8">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Lightbulb className="w-32 h-32 text-indigo-400" />
                                </div>

                                <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-200 mb-4">
                                    <Lightbulb className="h-5 w-5" />
                                    Pyrize AI Analizi
                                </h3>

                                {analyzing ? (
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="flex-1 space-y-4 py-1">
                                            <div className="h-4 bg-indigo-400/20 rounded w-3/4"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-indigo-400/20 rounded"></div>
                                                <div className="h-4 bg-indigo-400/20 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 relative z-10">
                                        <p className="text-slate-300 leading-relaxed italic">
                                            &quot;{aiInsights?.analysis || "Analiz yükleniyor..."}&quot;
                                        </p>
                                        <div className="space-y-2">
                                            {aiInsights?.recommendations?.map((rec: string, i: number) => (
                                                <div key={i} className="flex items-start gap-3 bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/10">
                                                    <CheckCircle2 className="h-5 w-5 text-indigo-400 mt-0.5" />
                                                    <span className="text-sm text-indigo-100">{rec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Numeric Blocks */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <MagneticCard>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition shadow-lg">
                                        <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Hedef Ciro</p>
                                        <p className="text-2xl font-bold text-white">{formatCurrency(parseFloat(targetRevenue))}</p>
                                        <p className="text-xs text-slate-500 mt-2">Aylık hedef</p>
                                    </div>
                                </MagneticCard>

                                <MagneticCard>
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 hover:border-cyan-400/40 transition shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs uppercase tracking-wider text-cyan-200 mb-2">Gereken Satış</p>
                                            <Target className="h-4 w-4 text-cyan-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white">{results.reqSales}</p>
                                        <p className="text-xs text-cyan-200/60 mt-2">
                                            Satış / Ay (<span className="text-white">{formatCurrency(results.revPerSale)}</span> ort. komisyon)
                                        </p>
                                    </div>
                                </MagneticCard>

                                <MagneticCard>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/30 transition shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Gereken Portföy</p>
                                            <Building2 className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white">{results.reqListings}</p>
                                        <p className="text-xs text-slate-500 mt-2">Yeni portföy alınmalı</p>
                                    </div>
                                </MagneticCard>

                                <MagneticCard>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Gereken Görüşme</p>
                                            <CalendarDays className="h-4 w-4 text-amber-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white">{results.reqMeetings}</p>
                                        <p className="text-xs text-slate-500 mt-2">Müşteri toplantısı</p>
                                    </div>
                                </MagneticCard>
                            </div>


                        </div>
                    )}

                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Nasıl Çalışır?</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-slate-400">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">1</span>
                                Hedef cironuzu ve ortalama satış fiyatlarını girin.
                            </li>
                            <li className="flex gap-3 text-sm text-slate-400">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">2</span>
                                Mevcut performans ve dönüşüm oranlarınızı belirtin.
                            </li>
                            <li className="flex gap-3 text-sm text-slate-400">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">3</span>
                                Sistem gereken aktivite hacmini hesaplar ve AI önerileri sunar.
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-200 leading-relaxed">
                                <strong>İpucu:</strong> Krediye uygunluk oranı düşükse (%40 altı), satış döngüsünün uzayacağını unutmayın. Nakit alıcı bulmak daha zordur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
