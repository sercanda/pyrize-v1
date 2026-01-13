import { formatPriceRange } from "@/lib/utils/price";

export const mockSunumlar = [
  {
    id: "1",
    baslik: "Atakum Deniz Kenarında Lüks Villa",
    tarih: new Date("2025-01-15"),
    mulkTuru: "villa",
    fiyat: 4500000,
    durum: "aktif",
  },
  {
    id: "2",
    baslik: "Merkezi Lokasyonda Ticari Arsa",
    tarih: new Date("2025-01-10"),
    mulkTuru: "ticari",
    fiyat: 12000000,
    durum: "aktif",
  },
  {
    id: "3",
    baslik: "Modern Daire - Manzaralı",
    tarih: new Date("2025-01-05"),
    mulkTuru: "daire",
    fiyat: 850000,
    durum: "taslak",
  },
] as const;

export const crmStats = [
  {
    label: "Yeni Lead",
    value: 5,
    hint: "+2 bugün",
    accent: "from-cyan-500/20 to-teal-500/10 text-cyan-200",
  },
  {
    label: "Takipte",
    value: 11,
    hint: "Son 7 gün",
    accent: "from-amber-500/20 to-orange-500/10 text-amber-200",
  },
  {
    label: "Teklif Aşaması",
    value: 4,
    hint: "%60 dönüş",
    accent: "from-purple-500/20 to-indigo-500/10 text-purple-200",
  },
  {
    label: "Kapanışa Hazır",
    value: 2,
    hint: "Bu hafta",
    accent: "from-emerald-500/20 to-lime-500/10 text-emerald-200",
  },
] as const;

export const crmPipeline = [
  {
    stage: "İlk Temas",
    count: 12,
    detail: "Yeni gelen lead'ler",
    eta: "Bugün 3 çağrı planlı",
  },
  {
    stage: "Görüşme Planlandı",
    count: 7,
    detail: "Ziyaret & online sunum",
    eta: "Sonraki 48 saat",
  },
  {
    stage: "Teklif Bekleniyor",
    count: 5,
    detail: "Değerleme gönderildi",
    eta: "Takip 2 gün sonra",
  },
  {
    stage: "Sözleşme Aşaması",
    count: 3,
    detail: "Ön protokol hazır",
    eta: "Bu hafta kapanış",
  },
] as const;

export const crmReminders = [
  {
    time: "Bugün • 14:30",
    title: "Portföy Sunumu",
    description: "Suadiye villa yetkilendirme görüşmesi",
  },
  {
    time: "Bugün • 17:00",
    title: "Takip Araması",
    description: "E-Ticaret deposu için teklif hatırlatma",
  },
  {
    time: "Yarın • 10:00",
    title: "Değerleme Teslimi",
    description: "Şişli ofis için PDF rapor gönder",
  },
] as const;

export const formatDashboardPrice = (sunum: any) => {
  if (sunum?.istek?.mulk) {
    const range = formatPriceRange(sunum.istek.mulk);
    if (range) return range;
  }
  if (typeof sunum?.fiyat === "number") {
    return `${sunum.fiyat.toLocaleString("tr-TR")} TL`;
  }
  return "Fiyat belirtilmedi";
};

export type TaskStatus = "pending" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "meeting" | "offer" | "price_update" | "call";

export interface CrmTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  customerId?: string | null;
  presentationId?: string | null;
  createdAt: string;
}

export const mockTasks: CrmTask[] = [
  {
    id: "task-1",
    title: "Görüşme Planla",
    description: "Ayşe Demir ile portföy yetkilendirme görüşmesi",
    dueDate: "2025-01-18T09:30:00.000Z",
    status: "pending",
    priority: "high",
    type: "meeting",
    customerId: "c1",
    presentationId: "1",
    createdAt: "2025-01-10T07:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Teklif Gönder",
    description: "Mehmet Kaya için fiyat teklifi",
    dueDate: "2025-01-19T13:00:00.000Z",
    status: "pending",
    priority: "medium",
    type: "offer",
    customerId: "c2",
    presentationId: "2",
    createdAt: "2025-01-11T09:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Fiyat Güncelle",
    description: "Selin Aksoy için piyasa verilerini güncelle",
    dueDate: "2025-01-21T15:30:00.000Z",
    status: "pending",
    priority: "low",
    type: "price_update",
    customerId: "c3",
    presentationId: "3",
    createdAt: "2025-01-12T08:30:00.000Z",
  },
];

