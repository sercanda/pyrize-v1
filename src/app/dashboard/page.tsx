"use client";

import Link from "next/link";
import { crmStats, formatDashboardPrice } from "./data";
import { useSunumlar } from "./hooks/useSunumlar";
import { useTasks } from "./hooks/useTasks";
import { MagneticCard } from "@/components/ui/MagneticCard";

export default function DashboardHomePage() {
  const { sunumlar } = useSunumlar();
  const { tasks } = useTasks();
  const upcomingTasks = [...tasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Ana Sayfa</h1>
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
            <h2 className="text-lg font-semibold text-white">Son Sunumlar</h2>
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
                <p className="text-sm font-semibold text-[#57B6B2]">
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
            <h2 className="text-lg font-semibold text-white">Yapılacaklar</h2>
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
        <h2 className="text-lg font-semibold text-white">Metrikler</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {crmStats.map((stat) => (
            <MagneticCard key={stat.label} enableMagnetism={true}>
              <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stat.accent} p-5 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]`}>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-300">{stat.hint}</p>
              </div>
            </MagneticCard>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
              Toplam Sunum
            </h3>
            <p className="mt-3 text-3xl font-bold text-white">{sunumlar.length}</p>
          </div>
        </MagneticCard>
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
              Aktif Sunum
            </h3>
            <p className="mt-3 text-3xl font-bold text-white">
              {sunumlar.filter((s) => s.durum === "aktif").length}
            </p>
          </div>
        </MagneticCard>
        <MagneticCard enableMagnetism={true}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(6,12,28,0.35)] transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
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
