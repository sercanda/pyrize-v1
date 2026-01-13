"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Task, TaskStatusColumn } from "@/types/kanban";
import { loadTasksFromStorage, saveTasksToStorage } from "@/lib/kanban/storage";
import { getTaskColumn } from "@/lib/kanban/utils";
import { SAMPLE_TASKS } from "@/lib/kanban/sample-data";

interface KanbanContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newColumn: TaskStatusColumn) => void;
  refreshColumns: () => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loaded = loadTasksFromStorage();
    if (loaded.length === 0) {
      // Initialize with sample data if storage is empty
      saveTasksToStorage(SAMPLE_TASKS);
      setTasks(SAMPLE_TASKS);
    } else {
      setTasks(loaded);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      statusColumn: getTaskColumn(taskData as Task),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updated = { ...task, ...updates };
          // Auto-update column if due date changed
          if (updates.dueDate) {
            updated.statusColumn = getTaskColumn(updated);
          }
          return updated;
        }
        return task;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const moveTask = useCallback((taskId: string, newColumn: TaskStatusColumn) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, statusColumn: newColumn } : task))
    );
  }, []);

  const refreshColumns = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        statusColumn: getTaskColumn(task),
      }))
    );
  }, []);

  return (
    <KanbanContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        refreshColumns,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within KanbanProvider");
  }
  return context;
}

