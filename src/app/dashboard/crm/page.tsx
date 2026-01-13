"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Filter, SortAsc } from "lucide-react";
import { crmPipeline } from "../data";
import { MagneticCard } from "@/components/ui/MagneticCard";

type DealRecord = {
  id: string;
  company: string;
  stage: string;
  nextMeeting: string;
  value: number;
  connection: string;
  contact: string;
  owner: string;
  tags?: string[];
};

const INITIAL_DEALS: DealRecord[] = [
  {
    id: "deal-1",
    company: "OpenAI - Loft Portföy",
    stage: "Portföy Tanıtımı",
    nextMeeting: "Gelecek Ay",
    value: 705000,
    connection: "Güçlü • Tom",
    contact: "Steven Walsh",
    owner: "Ece",
    tags: ["Teknoloji", "Sıcak"],
  },
  {
    id: "deal-2",
    company: "Stripe - Ticari Ofis",
    stage: "Detay Paylaşıldı",
    nextMeeting: "30 dk sonra",
    value: 1520500,
    connection: "Zayıf • Julia",
    contact: "Lori Simpson",
    owner: "Mert",
    tags: ["Ofis", "Yatırım"],
  },
  {
    id: "deal-3",
    company: "Gong - Villa",
    stage: "Demo Tur",
    nextMeeting: "Çarşamba",
    value: 450000,
    connection: "Güçlü • Nick",
    contact: "Katherine Terry",
    owner: "Ece",
    tags: ["Villa"],
  },
  {
    id: "deal-4",
    company: "Figma - Premium Konut",
    stage: "Genişleme",
    nextMeeting: "Yarın",
    value: 430500,
    connection: "Çok Güçlü • Jodie",
    contact: "Sharon Ortiz",
    owner: "Selin",
    tags: ["Konut", "Lüks"],
  },
  {
    id: "deal-5",
    company: "Superhuman - Residence",
    stage: "Teklif",
    nextMeeting: "Gelecek Hafta",
    value: 650000,
    connection: "İletişim Yok",
    contact: "Bethany Garza",
    owner: "Ece",
    tags: ["Residence"],
  },
  {
    id: "deal-6",
    company: "Dropbox - Göktürk Villa",
    stage: "Kapanış",
    nextMeeting: "3 Saat Sonra",
    value: 1205000,
    connection: "Zayıf • Jack",
    contact: "Chelsea Wright",
    owner: "Mert",
    tags: ["Villa", "Sıcak"],
  },
];

const stageColors: Record<string, string> = {
  "Portföy Tanıtımı": "bg-amber-500/15 text-amber-200",
  "Detay Paylaşıldı": "bg-blue-500/15 text-blue-200",
  "Demo Tur": "bg-teal-500/15 text-teal-200",
  Genişleme: "bg-purple-500/15 text-purple-200",
  Teklif: "bg-cyan-500/15 text-cyan-200",
  Kapanış: "bg-emerald-500/15 text-emerald-200",
};

const STAGE_OPTIONS = [
  "Portföy Tanıtımı",
  "Detay Paylaşıldı",
  "Demo Tur",
  "Genişleme",
  "Teklif",
  "Kapanış",
];

const connectionTone = (connection: string) => {
  if (connection.toLowerCase().includes("çok güçlü")) return "text-emerald-300";
  if (connection.toLowerCase().includes("güçlü")) return "text-cyan-200";
  if (connection.toLowerCase().includes("zayıf")) return "text-amber-200";
  return "text-slate-300";
};

export default function DashboardCrmPage() {
  const [deals, setDeals] = useState<DealRecord[]>([...INITIAL_DEALS]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(deals[0]?.id ?? null);

  const selectedDeal = useMemo(
    () => deals.find((deal) => deal.id === selectedDealId) ?? null,
    [deals, selectedDealId]
  );

  const totalValue = useMemo(
    () => deals.reduce((sum, row) => sum + row.value, 0),
    [deals]
  );

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStageChange = (id: string, stage: string) => {
    setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, stage } : deal)));
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">CRM Tablosu</h1>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Satış sürecindeki tüm portföyleri tablo görünümünden yönetin, ekibinizle anlık olarak güncelleyin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white">
            <Filter className="h-4 w-4" /> Filtrele
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white">
            <SortAsc className="h-4 w-4" /> Sırala
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#24d6a4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-page-bg shadow-[0_0_18px_rgba(36,214,164,0.35)] transition hover:opacity-90">
            + Yeni Deal
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            {selectedRows.length > 0 ? (
              <span>{selectedRows.length} kayıt seçildi</span>
            ) : (
              <span>Tüm Deals • {deals.length} kayıt</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <span>
              Toplam Pipeline: <strong className="text-white">{totalValue.toLocaleString("tr-TR")} TL</strong>
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              <BadgeCheck className="h-3.5 w-3.5 text-cyan-200" /> Grup Notu
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[900px] divide-y divide-white/10 text-sm text-slate-200">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3 text-left">Portföy</th>
                <th className="px-4 py-3 text-left">Aşama</th>
                <th className="px-4 py-3 text-left">Sonraki Aksiyon</th>
                <th className="px-4 py-3 text-left">Portföy Değeri</th>
                <th className="px-4 py-3 text-left">İlişki</th>
                <th className="px-4 py-3 text-left">Sorumlu</th>
                <th className="px-4 py-3 text-left">İletişim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {deals.map((row) => {
                const isSelected = selectedDealId === row.id;
                return (
                  <tr
                    key={row.id}
                    className={`transition hover:bg-white/5 ${isSelected ? "bg-white/10" : ""}`}
                    onClick={() => setSelectedDealId(row.id)}
                  >
                    <td className="px-4 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="h-4 w-4 cursor-pointer rounded border-white/30 bg-transparent text-cyan-400 focus:ring-cyan-400"
                      />
                    </td>
                    <td className="px-4 py-4 align-middle cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{row.company}</span>
                        {row.tags && row.tags.length > 0 && (
                          <span className="mt-1 text-xs text-slate-400">
                            {row.tags.join(" • ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <select
                        value={row.stage}
                        onChange={(event) => handleStageChange(row.id, event.target.value)}
                        className="rounded-full border border-white/20 bg-[#0b1328] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      >
                        {STAGE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 align-middle text-slate-300">{row.nextMeeting}</td>
                    <td className="px-4 py-4 align-middle font-semibold text-white">
                      {row.value.toLocaleString("tr-TR")}
                      <span className="ml-1 text-xs text-slate-400">TL</span>
                    </td>
                    <td className={`px-4 py-4 align-middle text-sm ${connectionTone(row.connection)}`}>
                      {row.connection}
                    </td>
                    <td className="px-4 py-4 align-middle text-slate-200">{row.owner}</td>
                    <td className="px-4 py-4 align-middle text-slate-300">{row.contact}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedDeal && (
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Deal Detayı</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Seçtiğiniz kayıt üzerinde hızlı düzenlemeler yapabilirsiniz.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">
              {selectedRows.length > 0 ? `${selectedRows.length} kayıt seçili` : selectedDeal.stage}
            </span>
          </header>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <MagneticCard enableMagnetism={true}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Portföy</h3>
                <p className="mt-2 text-sm text-white">{selectedDeal.company}</p>
                {selectedDeal.tags && (
                  <p className="mt-1 text-xs text-slate-300">{selectedDeal.tags.join(" • ")}</p>
                )}
              </div>
            </MagneticCard>
            <MagneticCard enableMagnetism={true}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">İlişki</h3>
                <p className={`mt-2 text-sm ${connectionTone(selectedDeal.connection)}`}>
                  {selectedDeal.connection}
                </p>
                <p className="text-xs text-slate-400">İletişim: {selectedDeal.contact}</p>
              </div>
            </MagneticCard>
            <MagneticCard enableMagnetism={true}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Görüşme</h3>
                <input
                  type="text"
                  value={selectedDeal.nextMeeting}
                  onChange={(event) =>
                    setDeals((prev) =>
                      prev.map((deal) =>
                        deal.id === selectedDeal.id ? { ...deal, nextMeeting: event.target.value } : deal
                      )
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </MagneticCard>
            <MagneticCard enableMagnetism={true}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Sorumlu</h3>
                <input
                  type="text"
                  value={selectedDeal.owner}
                  onChange={(event) =>
                    setDeals((prev) =>
                      prev.map((deal) =>
                        deal.id === selectedDeal.id ? { ...deal, owner: event.target.value } : deal
                      )
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </MagneticCard>
          </div>
        </section>
      )}

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Pipeline Özetleri</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Aşamaya göre deal adedi ve beklenen aksiyon süreleri
            </p>
          </div>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {crmPipeline.map((stage) => (
            <MagneticCard key={stage.stage} enableMagnetism={true}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stage.stage}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{stage.count}</p>
              <p className="mt-2 text-xs text-slate-400">{stage.detail}</p>
              <p className="mt-1 text-xs text-cyan-200">{stage.eta}</p>
              </div>
            </MagneticCard>
          ))}
        </div>
      </section>
    </div>
  );
}

