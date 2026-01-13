"use client";

import { useMemo } from "react";
import { Task, COLUMNS } from "@/types/kanban";
import { useKanban } from "@/contexts/KanbanContext";
import { formatTaskTime } from "@/lib/kanban/utils";
import { PRIORITY_COLORS } from "@/types/kanban";

interface GanttViewProps {
  onTaskClick: (task: Task) => void;
}

export function GanttView({ onTaskClick }: GanttViewProps) {
  const { tasks } = useKanban();

  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    COLUMNS.forEach((col) => {
      grouped[col.key] = tasks.filter((t) => t.statusColumn === col.key);
    });
    return grouped;
  }, [tasks]);

  const allDates = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach((task) => {
      const date = new Date(task.dueDate).toISOString().split("T")[0];
      dates.add(date);
    });
    return Array.from(dates).sort();
  }, [tasks]);

  const dateCount = allDates.length;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `200px repeat(${dateCount}, minmax(120px, 1fr))`,
          }}
        >
          {/* Header */}
          <div className="sticky left-0 z-10 rounded-lg border border-white/10 bg-white/5 p-3 font-semibold text-white">
            Görev / Tarih
          </div>
          {allDates.map((date) => (
            <div
              key={date}
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs font-semibold text-slate-300"
            >
              {new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
            </div>
          ))}

          {/* Tasks */}
          {COLUMNS.map((column) => (
            <div key={column.key} className="contents">
              <div className="sticky left-0 z-10 rounded-lg border border-white/10 bg-white/5 p-3 font-medium text-white">
                {column.title}
              </div>
              {allDates.map((date) => {
                const dayTasks = tasksByColumn[column.key].filter((task) => {
                  const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
                  return taskDate === date;
                });

                return (
                  <div
                    key={date}
                    className="rounded-lg border border-white/10 bg-white/5 p-2"
                  >
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`mb-1 cursor-pointer rounded px-2 py-1 text-xs transition hover:opacity-80 ${PRIORITY_COLORS[task.priority] || "bg-white/10 text-slate-300"}`}
                      >
                        {task.title.slice(0, 20)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

