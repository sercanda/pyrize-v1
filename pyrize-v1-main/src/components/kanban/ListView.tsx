"use client";

import { useMemo } from "react";
import { Task } from "@/types/kanban";
import { useKanban } from "@/contexts/KanbanContext";
import { formatTaskTime } from "@/lib/kanban/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/types/kanban";
import { AvatarGroup } from "./AvatarGroup";
import { TagList } from "./TagList";
import Image from "next/image";

interface ListViewProps {
  onTaskClick: (task: Task) => void;
  searchQuery?: string;
}

export function ListView({ onTaskClick, searchQuery = "" }: ListViewProps) {
  const { tasks } = useKanban();

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.labels.some((label) => label.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [filteredTasks]);

  return (
    <div className="space-y-3">
      {sortedTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-xs text-slate-400">
          {searchQuery ? "Arama sonucu bulunamadı" : "Görev bulunamadı"}
        </div>
      ) : (
        sortedTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-cyan-300/40 hover:bg-white/10"
          >
            <div className="flex items-start gap-4">
              {task.imageUrl && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={task.imageUrl}
                    alt={task.title}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white group-hover:text-cyan-200">{task.title}</h3>
                  {task.priority !== "none" && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${PRIORITY_COLORS[task.priority]}`}
                    >
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="line-clamp-2 text-sm text-slate-300">{task.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{formatTaskTime(task.dueDate)}</span>
                  <div className="flex items-center gap-3">
                    {task.labels.length > 0 && <TagList tags={task.labels} />}
                    <AvatarGroup users={task.assignedUsers} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

