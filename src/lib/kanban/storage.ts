import { Task } from "@/types/kanban";

const STORAGE_KEY = "pyrize_kanban_tasks_v1";

export function loadTasksFromStorage(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load tasks from storage:", error);
    return [];
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to storage:", error);
  }
}

