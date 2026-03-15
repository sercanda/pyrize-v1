"use client";

import { useState } from "react";
import {
    Calculator,
    ChevronDown,
    ChevronUp,
    Percent,
    Home,
    KeyRound,
} from "lucide-react";

const KDV_ORAN = 0.20;

export default function KomisyonPage() {
    const [tip, setTip] = useState<"satis" | "kira">("satis");
    const [bedel, setBedel] = useState<string>("");
    const [yasal, setYasal] = useState(false);

    const bedelNum = parseFloat(bedel.replace(/\./g, "").replace(",", ".")) || 0;

    const fmt = (n: number) =>
        new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

    let hesap: { label: string; value: number; muted?: boolean }[] = [];

    if (tip === "satis" && bedelNum > 0) {
        const komisyon = bedelNum * 0.02;
        const kdv = komisyon * KDV_ORAN;
        const toplam = komisyon + kdv;
        hesap = [
            { label: "Alıcı Komisyonu (%2)", value: komisyon },
            { label: "KDV (%20)", value: kdv, muted: true },
            { label: "Alıcı Toplam", value: toplam },
            { label: "Satıcı Komisyonu (%2)", value: komisyon },
            { label: "KDV (%20)", value: kdv, muted: true },
            { label: "Satıcı Toplam", value: toplam },
            { label: "Toplam Komisyon (KDV dahil)", value: toplam * 2 },
        ];
    } else if (tip === "kira" && bedelNum > 0) {
        const komisyon = bedelNum;
        const kdv = komisyon * KDV_ORAN;
        const toplam = komisyon + kdv;
        const pay = toplam / 2;
        hesap = [
            { label: "1 Aylık Kira Komisyonu", value: komisyon },
            { label: "KDV (%20)", value: kdv, muted: true },
            { label: "Toplam Komisyon", value: toplam },
            { label: "Kiracı Payı (½)", value: pay },
            { label: "Kiraya Veren Payı (½)", value: pay },
        ];
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 md:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white md:text-4xl flex items-center gap-3">
                    <Calculator className="h-8 w-8 text-[#DBE64C]" />
                    Komisyon Hesaplama
                </h1>
                <p className="mt-2 text-slate-400">
                    Satış veya kiralama komisyonunu anında hesaplayın. Yasal sınırlar ve KDV dahil.
                </p>
            </header>

            {/* Tip Toggle */}
            <div className="mb-8 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                    onClick={() => setTip("satis")}
                    className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition ${
                        tip === "satis" ? "bg-[#DBE64C] text-[#001F3F]" : "text-slate-400 hover:text-white"
                    }`}
                >
                    <Home className="h-4 w-4" />
                    Satış Komisyonu
                </button>
                <button
                    onClick={() => setTip("kira")}
                    className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition ${
                        tip === "kira" ? "bg-[#DBE64C] text-[#001F3F]" : "text-slate-400 hover:text-white"
                    }`}
                >
                    <KeyRound className="h-4 w-4" />
                    Kiralama Komisyonu
                </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Input */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        {tip === "satis" ? "Satış Bedeli (₺)" : "Aylık Kira Bedeli (₺)"}
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={bedel}
                        onChange={(e) => setBedel(e.target.value.replace(/[^0-9,]/g, ""))}
                        placeholder={tip === "satis" ? "Örn: 5000000" : "Örn: 25000"}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-lg text-white placeholder-slate-500 focus:border-[#DBE64C]/50 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/30"
                    />
                    {bedelNum > 0 && (
                        <p className="mt-2 text-sm text-slate-500">
                            {new Intl.NumberFormat("tr-TR").format(bedelNum)} ₺
                        </p>
                    )}

                    {/* Yasal Bilgi Paneli */}
                    <button
                        onClick={() => setYasal(!yasal)}
                        className="mt-6 flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
                    >
                        {yasal ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        Yasal Bilgi (Yönetmelik Md.20)
                    </button>
                    {yasal && (
                        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/80">
                            <p className="font-semibold text-amber-300 mb-2">Taşınmaz Ticareti Yönetmeliği Md.20</p>
                            <ul className="space-y-1.5 list-disc list-inside">
                                <li>Satışta: Alıcıdan ve satıcıdan ayrı ayrı en fazla <strong>%2 + KDV</strong></li>
                                <li>Kiralamada: Kiracı ve kiraya verenden en fazla <strong>1 aylık kira + KDV</strong></li>
                                <li>KDV oranı: <strong>%20</strong> (2025 itibarıyla)</li>
                                <li>Bu oranlar yasal üst sınırdır; daha düşük alınabilir</li>
                            </ul>
                        </div>
                    )}

                    {/* Bilgi kutusu */}
                    <div className="mt-6 rounded-xl border border-[#DBE64C]/20 bg-[#DBE64C]/[0.03] p-4">
                        <div className="flex items-start gap-3">
                            <Percent className="h-5 w-5 text-[#DBE64C] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-white mb-1">
                                    {tip === "satis" ? "Satış Komisyonu Nasıl Hesaplanır?" : "Kira Komisyonu Nasıl Hesaplanır?"}
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {tip === "satis"
                                        ? "Satış bedelinin %2'si alıcıdan, %2'si satıcıdan ayrı ayrı alınır. Her iki tarafa da KDV (%20) eklenir. Toplam komisyon satış bedelinin yaklaşık %4.8'idir."
                                        : "1 aylık kira bedeli komisyon olarak alınır ve üzerine KDV (%20) eklenir. Bu tutar kiracı ve kiraya veren arasında eşit bölünür."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div>
                    {hesap.length > 0 ? (
                        <div className="space-y-2.5">
                            {hesap.map((h, i) => {
                                const isLast = i === hesap.length - 1;
                                const isTotal = h.label.includes("Toplam");
                                return (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-between rounded-xl px-5 py-3 ${
                                            isLast
                                                ? "border-2 border-[#DBE64C]/30 bg-[#DBE64C]/10"
                                                : isTotal
                                                ? "border border-white/10 bg-white/5"
                                                : "border border-white/5 bg-white/[0.02]"
                                        }`}
                                    >
                                        <span className={`text-sm ${h.muted ? "text-slate-500" : isLast ? "font-bold text-[#DBE64C]" : "text-slate-300"}`}>
                                            {h.label}
                                        </span>
                                        <span className={`font-semibold tabular-nums ${isLast ? "text-lg text-[#DBE64C]" : h.muted ? "text-slate-500" : "text-white"}`}>
                                            {fmt(h.value)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-sm text-slate-500">
                            <div className="text-center">
                                <Calculator className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                                <p>Bedel girin, komisyon anında hesaplansın.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
