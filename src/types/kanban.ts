export type TaskStatusColumn = "overdue" | "today" | "tomorrow" | "nextWeek" | "nextMonth";
export type TaskPriority = "low" | "medium" | "high" | "urgent" | "none";

export interface AssignedUser {
  id: string;
  avatar: string;
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  statusColumn: TaskStatusColumn;
  priority: TaskPriority;
  labels: string[];
  commentsCount: number;
  assignedUsers: AssignedUser[];
  createdAt: string;
  imageUrl?: string;
  // CRM bağlantıları
  customerId?: string;
  customerName?: string;
  dealId?: string;
  dealTitle?: string;
}

export interface Column {
  key: TaskStatusColumn;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { key: "overdue", title: "Süresi Geçti", color: "bg-red-500" },
  { key: "today", title: "Bugün İçinde", color: "bg-blue-400" },
  { key: "tomorrow", title: "Yarın", color: "bg-green-500" },
  { key: "nextWeek", title: "Gelecek Hafta", color: "bg-blue-500" },
  { key: "nextMonth", title: "Gelecek Ay", color: "bg-sky-400" },
];

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "bg-red-500/20 text-red-200 border-red-400/40",
  high: "bg-orange-500/20 text-orange-200 border-orange-400/40",
  medium: "bg-blue-500/20 text-blue-200 border-blue-400/40",
  low: "bg-gray-500/20 text-gray-200 border-gray-400/40",
  none: "bg-transparent text-transparent border-transparent",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "Acil",
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
  none: "",
};

