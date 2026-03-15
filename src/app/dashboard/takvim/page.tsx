"use client";

import { FormEvent, useMemo, useState } from "react";
import { crmReminders, TaskPriority, TaskType } from "../data";
import { useTasks } from "../hooks/useTasks";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const priorityColors: Record<TaskPriority, string> = {
  high: "bg-red-500/25 text-red-200",
  medium: "bg-blue-500/25 text-blue-200",
  low: "bg-amber-500/25 text-amber-200",
};

const typeLabels: Record<TaskType, string> = {
  meeting: "Görüşme",
  offer: "Teklif",
  price_update: "Fiyat Güncelle",
  call: "Arama",
};

const currentMonth = new Date().toISOString().slice(0, 7);

export default function DashboardTakvimPage() {
  const { tasks, loading, refresh } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as TaskPriority,
    type: "meeting" as TaskType,
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthDays = useMemo(
    () => Array.from({ length: 31 }).map((_, i) => i + 1),
    []
  );

  const reminderMap = useMemo(() => {
    const map = new Map<number, { title: string; description?: string; priority: TaskPriority }[]>();

    crmReminders.forEach((reminder, idx) => {
      const day = (idx * 5 + 1) % 30 || 1;
      const list = map.get(day) || [];
      list.push({
        title: reminder.title,
        description: reminder.description,
        priority: idx % 2 === 0 ? "high" : "medium",
      });
      map.set(day, list);
    });

    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      const day = taskDate.getDate();
      const list = map.get(day) || [];
      list.push({
        title: task.title,
        description: task.description,
        priority: task.priority,
      });
      map.set(day, list);
    });

    return map;
  }, [tasks]);

  const upcomingTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5),
    [tasks]
  );

  const selectedDayItems = useMemo(() => {
    if (!selectedDay) return [];
    return reminderMap.get(selectedDay) || [];
  }, [selectedDay, reminderMap]);

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const prefillDate = `${currentMonth}-${String(day).padStart(2, "0")}T09:00`;
    setFormState((prev) => ({ ...prev, dueDate: prefillDate }));
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formState.title || !formState.dueDate) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          dueDate: new Date(formState.dueDate).toISOString(),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Görev kaydedilemedi");
      }
      await refresh();
      setFormState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        type: "meeting",
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Takvim ve Görevler</h1>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Yaklaşan görüşmeleri, teklifleri ve hatırlatmaları planlayın.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedDay(null);
            setShowForm((prev) => !prev);
          }}
          className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
        >
          {showForm ? "Formu Kapat" : "Yeni Görev"}
        </button>
      </section>

      {showForm && (
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(6,12,28,0.35)]">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Görev Başlığı *
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Tarih *
              </label>
              <input
                type="datetime-local"
                value={formState.dueDate}
                onChange={(e) => setFormState((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Öncelik
              </label>
              <select
                value={formState.priority}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))
                }
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Görev Türü
              </label>
              <select
                value={formState.type}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, type: e.target.value as TaskType }))
                }
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
              >
                <option value="meeting">Görüşme</option>
                <option value="offer">Teklif</option>
                <option value="price_update">Fiyat Güncelle</option>
                <option value="call">Arama</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Açıklama
              </label>
              <textarea
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#0b1328] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 hover:border-cyan-300/60 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#DBE64C] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-page-bg shadow-[0_0_15px_rgba(219,230,76,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Kaydediliyor..." : "Görevi Kaydet"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(6,12,28,0.35)]">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Ocak 2025</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Günlere tıklayarak görev planlayın
            </p>
          </div>
          <div className="flex gap-2 text-xs uppercase tracking-[0.3em] text-slate-300">
            <span className="rounded-full bg-red-500/30 px-3 py-1 text-red-200">Acil</span>
            <span className="rounded-full bg-blue-500/30 px-3 py-1 text-blue-200">Görüşme</span>
            <span className="rounded-full bg-amber-500/30 px-3 py-1 text-amber-200">Hatırlatma</span>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          {DAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 text-sm">
          {monthDays.map((day) => {
            const reminders = reminderMap.get(day) || [];
            const isMarked = reminders.length > 0;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDaySelect(day)}
                className={`flex min-h-[6.5rem] flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-left text-slate-200 transition hover:border-cyan-400/60 hover:text-white ${
                  isMarked ? "ring-2 ring-cyan-400/60" : ""
                } ${isSelected ? "outline outline-2 outline-cyan-300" : ""}`}
              >
                <span className="text-base font-semibold">{day}</span>
                <div className="space-y-1">
                  {reminders.map((item, idx) => (
                    <span
                      key={`${item.title}-${idx}`}
                      className={`block rounded-lg px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                        priorityColors[item.priority ?? "medium"]
                      }`}
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selectedDay && (
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_55px_rgba(6,12,28,0.35)]">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            {selectedDay}. Gün • Günlük Özeti
          </h3>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {selectedDayItems.length === 0 ? (
              <p className="text-xs text-slate-400">Bu gün için planlanan görev bulunmuyor.</p>
            ) : (
              selectedDayItems.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="font-semibold text-white">{item.title}</p>
                  {item.description && <p className="text-xs text-slate-300">{item.description}</p>}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_55px_rgba(6,12,28,0.35)]">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Yaklaşan Görevler</h2>
          {loading && (
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Yükleniyor...
            </span>
          )}
        </header>
        <div className="mt-5 space-y-3">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              <div>
                <p className="font-semibold text-white">{task.title}</p>
                <p className="text-xs text-slate-400">
                  {new Date(task.dueDate).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  • {typeLabels[task.type]}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.3em] ${priorityColors[task.priority]}`}
              >
                {task.priority === "high"
                  ? "Acil"
                  : task.priority === "medium"
                  ? "Orta"
                  : "Düşük"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

