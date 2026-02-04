"use client";

import { Task, Column as ColumnType, TaskStatusColumn } from "@/types/kanban";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

export function Column({ column, tasks, onTaskClick, onAddTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.key,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex min-w-[320px] flex-col rounded-2xl border border-white/10 bg-white/5"
    >
      <div
        className={`flex items-center justify-between rounded-t-2xl ${column.color} px-4 py-3`}
      >
        <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-white">
          {column.title}
        </h2>
        <button
          onClick={onAddTask}
          className="rounded-lg bg-white/10 p-1.5 text-white transition hover:bg-white/20"
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-xs text-slate-400">
            Görev yok
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))
        )}
      </div>
    </div>
  );
}

