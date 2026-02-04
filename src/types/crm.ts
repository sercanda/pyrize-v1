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

