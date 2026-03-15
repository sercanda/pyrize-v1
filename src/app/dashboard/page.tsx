"use client";

import Link from "next/link";
import { useMemo } from "react";
import { crmStats, formatDashboardPrice } from "./data";
import { useSunumlar } from "./hooks/useSunumlar";
import { useTasks } from "./hooks/useTasks";
import { useCRMDeals } from "@/hooks/useCRMDeals";
import { DEAL_STAGES } from "@/types/crm";
import type { DealStage } from "@/types/crm";
import { MagneticCard } from "@/components/ui/MagneticCard";

export default function DashboardHomePage() {
  const { sunumlar } = useSunumlar();
  const { tasks } = useTasks();
  const { deals } = useCRMDeals();

  const dealsByStage = useMemo(() => {
    const map: Record<DealStage, { count: number; value: number }> = {
      lead: { count: 0, value: 0 }, meeting: { count: 0, value: 0 },
      offer: { count: 0, value: 0 }, contract: { count: 0, value: 0 },
      closed: { count: 0, value: 0 }, lost: { count: 0, value: 0 },
    };
    deals.forEach((d) => { if (map[d.stage]) { map[d.stage].count++; map[d.stage].value += Number(d.value) || 0; } });
    return map;
  }, [deals]);
  const upcomingTasks = [...tasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-3xl font-extrabold text-white md:text-4xl tracking-tight"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Ana Sayfa
          </h1>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            CRM özetiniz, son sunumlar ve pipeline metrikleri tek ekranda.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/sunumlar"
            className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
          >
            Sunumlara Git
          </Link>
          <Link
            href="/dashboard/todo"
            className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
          >
            To-Do
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>Son Sunumlar</h2>
            <Link
              href="/dashboard/sunumlar"
              className="text-xs uppercase tracking-[0.3em] text-cyan-200 transition hover:text-cyan-100"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {sunumlar.slice(0, 3).map((sunum) => (
              <div
                key={sunum.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <div>
                  <p className="font-semibold text-white">{sunum.baslik}</p>
                  <p className="text-xs text-slate-400">
                    {sunum.tarih.toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#DBE64C]">
                  {formatDashboardPrice(sunum)}
                </p>
              </div>
            ))}
          </div>
          </div>
        </MagneticCard>

        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>Yapılacaklar</h2>
            <Link
              href="/dashboard/todo"
              className="text-xs uppercase tracking-[0.3em] text-cyan-200 transition hover:text-cyan-100"
            >
              To-Do Sayfası
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {upcomingTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
                Henüz görev eklenmedi. To-Do sayfasından yeni görev oluşturabilirsiniz.
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{task.title}</p>
                    <span className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                      {task.priority === "high"
                        ? "Acil"
                        : task.priority === "medium"
                        ? "Orta"
                        : "Düşük"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(task.dueDate).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {task.description && (
                    <p className="mt-2 text-xs text-slate-300 line-clamp-2">{task.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
          </div>
        </MagneticCard>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>Metrikler</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {crmStats.map((stat) => (
            <MagneticCard key={stat.label} enableMagnetism={true}>
              <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stat.accent} p-5 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]`}>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-montserrat)" }}>{stat.value}</p>
              <p className="mt-2 text-xs text-slate-300">{stat.hint}</p>
              </div>
            </MagneticCard>
          ))}
        </div>
      </section>

      {/* Pipeline Özeti */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>Pipeline</h2>
          <Link href="/dashboard/crm?tab=firsatlar" className="text-xs uppercase tracking-[0.3em] text-cyan-200 transition hover:text-cyan-100">
            Tümünü Gör
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DEAL_STAGES.filter((s) => s.key !== "lost").map((stage) => {
            const data = dealsByStage[stage.key];
            return (
              <Link
                key={stage.key}
                href="/dashboard/crm?tab=firsatlar"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.07] hover:border-white/20"
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${stage.color}`}>
                  {stage.title}
                </span>
                <p className="mt-1.5 text-2xl font-bold text-white tabular-nums">{data.count}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {data.value > 0
                    ? new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 1 }).format(data.value) + " ₺"
                    : "—"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400" style={{ fontFamily: "var(--font-montserrat)" }}>
              Toplam Sunum
            </h3>
            <p className="mt-3 text-3xl font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-montserrat)" }}>{sunumlar.length}</p>
          </div>
        </MagneticCard>
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400" style={{ fontFamily: "var(--font-montserrat)" }}>
              Aktif Sunum
            </h3>
            <p className="mt-3 text-3xl font-bold text-white">
              {sunumlar.filter((s) => s.durum === "aktif").length}
            </p>
          </div>
        </MagneticCard>
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400" style={{ fontFamily: "var(--font-montserrat)" }}>
              Toplam Değer
            </h3>
            <p className="mt-3 text-3xl font-bold text-white">
              {sunumlar
                .reduce((sum, s) => sum + (s.fiyat ?? 0), 0)
                .toLocaleString("tr-TR")} {" "}
              TL
            </p>
          </div>
        </MagneticCard>
      </section>
    </div>
  );
}
