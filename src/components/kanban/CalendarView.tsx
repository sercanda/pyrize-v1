"use client";

import { useMemo, useState } from "react";
import { Task } from "@/types/kanban";
import { useKanban } from "@/contexts/KanbanContext";
import { PRIORITY_COLORS } from "@/types/kanban";

interface CalendarViewProps {
  onTaskClick: (task: Task) => void;
}

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export function CalendarView({ onTaskClick }: CalendarViewProps) {
  const { tasks } = useKanban();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0

  const monthDays = useMemo(() => {
    const days: Array<{ day: number; tasks: Task[] }> = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getFullYear() === year &&
          taskDate.getMonth() === month &&
          taskDate.getDate() === i
        );
      });
      days.push({ day: i, tasks: dayTasks });
    }
    return days;
  }, [tasks, year, month, daysInMonth]);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return [];
    return monthDays.find((d) => d.day === selectedDay)?.tasks || [];
  }, [selectedDay, monthDays]);

  const monthName = currentMonth.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
            >
              ←
            </button>
            <h2 className="text-xl font-bold text-white capitalize">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          {DAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px]" />
          ))}
          {monthDays.map(({ day, tasks: dayTasks }) => {
            const isSelected = selectedDay === day;
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayClick(day)}
                className={`relative flex min-h-[100px] flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-2 text-left text-slate-200 transition hover:border-cyan-400/60 hover:text-white ${
                  isSelected ? "ring-2 ring-cyan-400/60" : ""
                } ${isToday ? "bg-cyan-500/10" : ""}`}
              >
                <span className={`text-sm font-semibold ${isToday ? "text-cyan-200" : ""}`}>
                  {day}
                </span>
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      className={`cursor-pointer rounded px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition hover:opacity-80 ${PRIORITY_COLORS[task.priority] || "bg-white/10 text-slate-300"}`}
                    >
                      {task.title.slice(0, 15)}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-slate-400">+{dayTasks.length - 3} daha</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedDay && selectedDayTasks.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              {selectedDay}. Gün • {selectedDayTasks.length} Görev
            </h3>
            <div className="space-y-2">
              {selectedDayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  <p className="font-semibold text-white">{task.title}</p>
                  {task.description && (
                    <p className="mt-1 text-xs text-slate-300">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

