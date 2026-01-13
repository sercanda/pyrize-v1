"use client";

import { useMemo } from "react";
import { Task } from "@/types/kanban";
import { useKanban } from "@/contexts/KanbanContext";
import { formatTaskTime } from "@/lib/kanban/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/types/kanban";
import { AvatarGroup } from "./AvatarGroup";

interface PlannerViewProps {
  onTaskClick: (task: Task) => void;
}

export function PlannerView({ onTaskClick }: PlannerViewProps) {
  const { tasks } = useKanban();

  const groupedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const groups = {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[],
    };

    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      if (taskDate < today) {
        groups.overdue.push(task);
      } else if (taskDate.toDateString() === today.toDateString()) {
        groups.today.push(task);
      } else if (taskDate.toDateString() === tomorrow.toDateString()) {
        groups.tomorrow.push(task);
      } else if (taskDate < nextWeek) {
        groups.thisWeek.push(task);
      } else {
        groups.later.push(task);
      }
    });

    return groups;
  }, [tasks]);

  const sections = [
    { key: "overdue", title: "Süresi Geçti", tasks: groupedTasks.overdue, color: "text-red-200" },
    { key: "today", title: "Bugün", tasks: groupedTasks.today, color: "text-blue-200" },
    { key: "tomorrow", title: "Yarın", tasks: groupedTasks.tomorrow, color: "text-green-200" },
    { key: "thisWeek", title: "Bu Hafta", tasks: groupedTasks.thisWeek, color: "text-cyan-200" },
    { key: "later", title: "Daha Sonra", tasks: groupedTasks.later, color: "text-slate-300" },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className={`mb-4 text-lg font-semibold ${section.color}`}>
            {section.title} ({section.tasks.length})
          </h3>
          <div className="space-y-3">
            {section.tasks.length === 0 ? (
              <p className="text-xs text-slate-400">Görev yok</p>
            ) : (
              section.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-cyan-300/40 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white group-hover:text-cyan-200">
                          {task.title}
                        </h4>
                        {task.priority !== "none" && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${PRIORITY_COLORS[task.priority]}`}
                          >
                            {PRIORITY_LABELS[task.priority]}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="mb-2 text-sm text-slate-300">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{formatTaskTime(task.dueDate)}</span>
                        <AvatarGroup users={task.assignedUsers} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

