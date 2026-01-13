import { Task, TaskStatusColumn } from "@/types/kanban";

export function getTaskColumn(task: Task): TaskStatusColumn {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  if (taskDate < today) {
    return "overdue";
  } else if (taskDate.getTime() === today.getTime()) {
    return "today";
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return "tomorrow";
  } else if (taskDate >= tomorrow && taskDate < nextWeek) {
    return "nextWeek";
  } else if (taskDate >= nextWeek && taskDate < nextMonth) {
    return "nextMonth";
  } else {
    return "nextMonth";
  }
}

export function formatTaskTime(dueDate: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (taskDate.getTime() === today.getTime()) {
    return `Bugün ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (taskDate.getTime() === tomorrow.getTime()) {
    return `Yarın ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
  }

  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

