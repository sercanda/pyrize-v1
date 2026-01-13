"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverEvent } from "@dnd-kit/core";
import { Task, TaskStatusColumn, COLUMNS } from "@/types/kanban";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { useKanban } from "@/contexts/KanbanContext";
import { useState } from "react";

interface BoardWrapperProps {
  onTaskClick: (task: Task) => void;
  onAddTask: (column?: TaskStatusColumn) => void;
}

export function BoardWrapper({ onTaskClick, onAddTask }: BoardWrapperProps) {
  const { tasks, moveTask } = useKanban();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatusColumn | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByColumn = COLUMNS.reduce(
    (acc, column) => {
      acc[column.key] = tasks.filter((task) => task.statusColumn === column.key);
      return acc;
    },
    {} as Record<TaskStatusColumn, Task[]>
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over && COLUMNS.some((col) => col.key === over.id)) {
      setOverColumn(over.id as TaskStatusColumn);
    } else {
      setOverColumn(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverColumn(null);

    if (!over) return;

    const taskId = active.id as string;
    const newColumn = over.id as TaskStatusColumn;

    if (COLUMNS.some((col) => col.key === newColumn)) {
      moveTask(taskId, newColumn);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <div
            key={column.key}
            data-column-id={column.key}
            className={overColumn === column.key ? "ring-2 ring-cyan-400 rounded-2xl" : ""}
          >
            <Column
              column={column}
              tasks={tasksByColumn[column.key]}
              onTaskClick={onTaskClick}
              onAddTask={() => onAddTask(column.key)}
            />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

