"use client";

import { useState } from "react";
import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from "@/types/kanban";
import { formatTaskTime } from "@/lib/kanban/utils";
import { AvatarGroup } from "./AvatarGroup";
import { TagList } from "./TagList";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

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
      className="group cursor-grab active:cursor-grabbing rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-cyan-300/40 hover:bg-white/10 hover:shadow-lg"
    >
      {task.imageUrl && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <Image
            src={task.imageUrl}
            alt={task.title}
            width={300}
            height={150}
            className="h-32 w-full object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="space-y-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-cyan-200">
          {task.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{formatTaskTime(task.dueDate)}</span>
          {task.priority !== "none" && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${PRIORITY_COLORS[task.priority]}`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
          )}
        </div>

        {task.labels.length > 0 && <TagList tags={task.labels} />}

        {/* CRM Bağlantı Badge'i */}
        {(task.customerName || task.dealTitle) && (
          <div className="flex flex-wrap gap-1.5">
            {task.customerName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {task.customerName}
              </span>
            )}
            {task.dealTitle && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {task.dealTitle}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <AvatarGroup users={task.assignedUsers} />
          {task.commentsCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{task.commentsCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

