"use client";

import { useState } from "react";
import { Task, PRIORITY_COLORS } from "@/types/kanban";
import { formatTaskTime } from "@/lib/kanban/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const PRIORITY_DOTS: Record<string, string> = {
  urgent: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-blue-400",
  none: "bg-slate-500",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const dragDistance = Math.abs(e.clientX - dragStartPos.x) + Math.abs(e.clientY - dragStartPos.y);
    if (dragDistance < 5) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="group cursor-grab active:cursor-grabbing rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 transition-all hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${PRIORITY_DOTS[task.priority] || PRIORITY_DOTS.none}`} />
        <h3 className="line-clamp-1 text-sm font-medium text-slate-200 group-hover:text-white">
          {task.title}
        </h3>
      </div>
      <p className="mt-1 pl-4 text-xs text-slate-500">
        {formatTaskTime(task.dueDate)}
      </p>
    </div>
  );
}
