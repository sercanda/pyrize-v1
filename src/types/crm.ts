export type CustomerStage =
  | "newLead"
  | "firstContact"
  | "analysis"
  | "presentation"
  | "offer"
  | "contract"
  | "won"
  | "lost";

export type RequestType = "buy" | "sell" | "rent" | "invest";

export type ActivityType = "call" | "message" | "note" | "file" | "presentation";

export interface AssignedAgent {
  id: string;
  avatar: string;
  name?: string;
}

export interface Property {
  id: string;
  title: string;
  match: number; // 0-100
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  date: string; // ISO string
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: CustomerStage;
  tags: string[];
  budgetMin: number;
  budgetMax: number;
  interestAreas: string[];
  requestType: RequestType;
  notes: string;
  lastActivity: string; // ISO string
  assignedAgent: AssignedAgent;
  properties: Property[];
  activities: Activity[];
  files: FileAttachment[];
}

export interface Stage {
  key: CustomerStage;
  title: string;
  color: string;
}

export const STAGES: Stage[] = [
  { key: "newLead", title: "Yeni Lead", color: "bg-blue-600/20" },
  { key: "firstContact", title: "İlk Temas Yapıldı", color: "bg-cyan-600/20" },
  { key: "analysis", title: "İhtiyaç Analizi", color: "bg-indigo-600/20" },
  { key: "presentation", title: "Sunum / Gösterim", color: "bg-purple-600/20" },
  { key: "offer", title: "Teklif - Pazarlık", color: "bg-orange-600/20" },
  { key: "contract", title: "Sözleşme Hazırlığı", color: "bg-yellow-600/20" },
  { key: "won", title: "Kazanıldı", color: "bg-green-600/20" },
  { key: "lost", title: "Kaybedildi", color: "bg-red-600/20" },
];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  buy: "Satın Alma",
  sell: "Satış",
  rent: "Kiralama",
  invest: "Yatırım",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: "Arama",
  message: "Mesaj",
  note: "Not",
  file: "Dosya",
  presentation: "Sunum",
};

// ========================
// Supabase CRM Tipleri
// ========================

export type ContactType = "buyer" | "seller" | "tenant" | "investor";
export type PropertyType = "sale" | "rent";
export type PropertyStatus = "available" | "sold" | "rented" | "pending";
export type DealStage = "lead" | "meeting" | "offer" | "contract" | "closed" | "lost";
export type DBActivityType = "call" | "email" | "meeting" | "note" | "presentation";
export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "todo" | "inprogress" | "done";

export interface DBCustomer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string | null;
  tags: string[];
  notes: string | null;
  type: ContactType;
  city: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface DBProperty {
  id: string;
  title: string;
  address: string | null;
  city: string | null;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  customer_id: string | null;
  notes: string | null;
  images: string[];
  room_count: string | null;
  area_sqm: number | null;
  floor_info: string | null;
  building_age: number | null;
  features: string[];
  created_at: string;
  updated_at: string;
  user_id: string | null;
  // Joined
  customer?: DBCustomer | null;
}

export interface DBDeal {
  id: string;
  title: string;
  customer_id: string | null;
  property_id: string | null;
  stage: DealStage;
  value: number;
  expected_close_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  // Joined
  customer?: DBCustomer | null;
  property?: DBProperty | null;
}

export interface DBActivity {
  id: string;
  type: DBActivityType;
  customer_id: string | null;
  property_id: string | null;
  deal_id: string | null;
  description: string | null;
  date: string;
  created_at: string;
  user_id: string | null;
  // Joined
  customer?: DBCustomer | null;
  deal?: DBDeal | null;
}

export interface DBTodo {
  id: string;
  title: string;
  description: string | null;
  priority: TodoPriority;
  status: TodoStatus;
  due_date: string | null;
  customer_id: string | null;
  deal_id: string | null;
  property_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  // Joined
  customer?: DBCustomer | null;
  deal?: DBDeal | null;
}

export interface DBPresentation {
  id: string;
  title: string;
  purpose: string | null;
  style: string | null;
  theme: string | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealStageInfo {
  key: DealStage;
  title: string;
  color: string;
  bgColor: string;
}

export const DEAL_STAGES: DealStageInfo[] = [
  { key: "lead", title: "Lead", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  { key: "meeting", title: "Görüşme", color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  { key: "offer", title: "Teklif", color: "text-amber-400", bgColor: "bg-amber-500/20" },
  { key: "contract", title: "Sözleşme", color: "text-purple-400", bgColor: "bg-purple-500/20" },
  { key: "closed", title: "Kapandı", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  { key: "lost", title: "Kaybedildi", color: "text-red-400", bgColor: "bg-red-500/20" },
];

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  buyer: "Alıcı",
  seller: "Satıcı",
  tenant: "Kiracı",
  investor: "Yatırımcı",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: "Müsait",
  sold: "Satıldı",
  rented: "Kiralandı",
  pending: "Beklemede",
};

export const PROPERTY_STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "available", label: "Müsait" },
  { value: "pending", label: "Beklemede" },
  { value: "sold", label: "Satıldı" },
  { value: "rented", label: "Kiralandı" },
];

export const TODO_PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

export const TODO_PRIORITY_COLORS: Record<TodoPriority, string> = {
  low: "bg-slate-500/20 text-slate-300",
  medium: "bg-amber-500/20 text-amber-300",
  high: "bg-red-500/20 text-red-300",
};

export const TODO_STATUS_LABELS: Record<TodoStatus, string> = {
  todo: "Yapılacak",
  inprogress: "Devam Ediyor",
  done: "Tamamlandı",
};

export const DB_ACTIVITY_TYPE_LABELS: Record<DBActivityType, string> = {
  call: "Arama",
  email: "E-posta",
  meeting: "Görüşme",
  note: "Not",
  presentation: "Sunum",
};

export interface CRMDashboardStats {
  activeCustomers: number;
  openDeals: number;
  openDealsValue: number;
  closedThisMonth: number;
  closedThisMonthValue: number;
  upcomingTodos: number;
  totalProperties: number;
  recentActivities: DBActivity[];
}

