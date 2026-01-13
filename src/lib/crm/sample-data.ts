import { Customer, AssignedAgent } from "@/types/crm";
import { generateAvatarUrl } from "@/lib/kanban/utils";

const agents: AssignedAgent[] = [
  { id: "agent-1", avatar: generateAvatarUrl("Ayşe Yılmaz"), name: "Ayşe Yılmaz" },
  { id: "agent-2", avatar: generateAvatarUrl("Mehmet Demir"), name: "Mehmet Demir" },
  { id: "agent-3", avatar: generateAvatarUrl("Selin Kaya"), name: "Selin Kaya" },
];

const now = new Date();
const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const addHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Ahmet Özkan",
    phone: "+90 532 123 45 67",
    email: "ahmet.ozkan@example.com",
    stage: "newLead",
    tags: ["villa", "yüksek bütçe"],
    budgetMin: 5000000,
    budgetMax: 8000000,
    interestAreas: ["Bodrum", "Çeşme"],
    requestType: "buy",
    notes: "Yazlık villa arıyor, denize yakın olmalı",
    lastActivity: addHours(-2).toISOString(),
    assignedAgent: agents[0],
    properties: [
      { id: "p1", title: "Bodrum Villa - Deniz Manzaralı", match: 95 },
      { id: "p2", title: "Çeşme Villa - Bahçeli", match: 88 },
    ],
    activities: [
      {
        id: "a1",
        type: "call",
        description: "İlk telefon görüşmesi yapıldı",
        date: addHours(-2).toISOString(),
      },
    ],
    files: [],
  },
  {
    id: "c2",
    name: "Zeynep Arslan",
    phone: "+90 554 987 65 43",
    email: "zeynep.arslan@example.com",
    stage: "firstContact",
    tags: ["daire", "merkez"],
    budgetMin: 2000000,
    budgetMax: 3500000,
    interestAreas: ["Kadıköy", "Beşiktaş"],
    requestType: "buy",
    notes: "3+1 daire, merkezi konumda, okula yakın",
    lastActivity: addHours(-5).toISOString(),
    assignedAgent: agents[1],
    properties: [
      { id: "p3", title: "Kadıköy 3+1 Daire", match: 92 },
    ],
    activities: [
      {
        id: "a2",
        type: "message",
        description: "WhatsApp üzerinden bilgi paylaşıldı",
        date: addHours(-5).toISOString(),
      },
      {
        id: "a3",
        type: "call",
        description: "İlk görüşme tamamlandı",
        date: addDays(-1).toISOString(),
      },
    ],
    files: [],
  },
  {
    id: "c3",
    name: "Can Yıldız",
    phone: "+90 530 765 43 21",
    email: "can.yildiz@example.com",
    stage: "analysis",
    tags: ["ofis", "ticari"],
    budgetMin: 1000000,
    budgetMax: 2000000,
    interestAreas: ["Şişli", "Levent"],
    requestType: "rent",
    notes: "Ofis kiralama, minimum 100m², toplu taşıma erişimi önemli",
    lastActivity: addDays(-1).toISOString(),
    assignedAgent: agents[2],
    properties: [
      { id: "p4", title: "Levent Ofis - 120m²", match: 85 },
      { id: "p5", title: "Şişli Ofis - 150m²", match: 78 },
    ],
    activities: [
      {
        id: "a4",
        type: "note",
        description: "İhtiyaç analizi formu dolduruldu",
        date: addDays(-1).toISOString(),
      },
      {
        id: "a5",
        type: "call",
        description: "Detaylı görüşme yapıldı",
        date: addDays(-2).toISOString(),
      },
    ],
    files: [],
  },
  {
    id: "c4",
    name: "Elif Şahin",
    phone: "+90 555 111 22 33",
    email: "elif.sahin@example.com",
    stage: "presentation",
    tags: ["arsa", "yatırım"],
    budgetMin: 3000000,
    budgetMax: 5000000,
    interestAreas: ["Beylikdüzü", "Büyükçekmece"],
    requestType: "invest",
    notes: "Yatırım amaçlı arsa, imar durumu önemli",
    lastActivity: addDays(-3).toISOString(),
    assignedAgent: agents[0],
    properties: [
      { id: "p6", title: "Beylikdüzü Arsa - 500m²", match: 90 },
    ],
    activities: [
      {
        id: "a6",
        type: "presentation",
        description: "Sunum hazırlandı ve gönderildi",
        date: addDays(-3).toISOString(),
      },
      {
        id: "a7",
        type: "file",
        description: "İmar durumu belgesi paylaşıldı",
        date: addDays(-4).toISOString(),
      },
    ],
    files: [
      { id: "f1", name: "imar_durumu.pdf", url: "#" },
    ],
  },
  {
    id: "c5",
    name: "Burak Kılıç",
    phone: "+90 533 444 55 66",
    email: "burak.kilic@example.com",
    stage: "offer",
    tags: ["villa", "satış"],
    budgetMin: 0,
    budgetMax: 0,
    interestAreas: ["Antalya"],
    requestType: "sell",
    notes: "Villa satışı, müşteri teklif bekliyor",
    lastActivity: addDays(-4).toISOString(),
    assignedAgent: agents[1],
    properties: [],
    activities: [
      {
        id: "a8",
        type: "note",
        description: "Teklif hazırlandı",
        date: addDays(-4).toISOString(),
      },
    ],
    files: [],
  },
  {
    id: "c6",
    name: "Deniz Aydın",
    phone: "+90 536 777 88 99",
    email: "deniz.aydin@example.com",
    stage: "contract",
    tags: ["daire", "satın alma"],
    budgetMin: 2500000,
    budgetMax: 3000000,
    interestAreas: ["Ataşehir"],
    requestType: "buy",
    notes: "Sözleşme hazırlığı devam ediyor",
    lastActivity: addDays(-5).toISOString(),
    assignedAgent: agents[2],
    properties: [
      { id: "p7", title: "Ataşehir 2+1 Daire", match: 98 },
    ],
    activities: [
      {
        id: "a9",
        type: "note",
        description: "Sözleşme taslağı hazırlandı",
        date: addDays(-5).toISOString(),
      },
    ],
    files: [
      { id: "f2", name: "sozlesme_taslagi.pdf", url: "#" },
    ],
  },
  {
    id: "c7",
    name: "Gamze Çelik",
    phone: "+90 537 999 00 11",
    email: "gamze.celik@example.com",
    stage: "won",
    tags: ["daire", "kiralama"],
    budgetMin: 15000,
    budgetMax: 20000,
    interestAreas: ["Nişantaşı"],
    requestType: "rent",
    notes: "Kiralama işlemi tamamlandı",
    lastActivity: addDays(-7).toISOString(),
    assignedAgent: agents[0],
    properties: [
      { id: "p8", title: "Nişantaşı 1+1 Daire", match: 100 },
    ],
    activities: [
      {
        id: "a10",
        type: "note",
        description: "Sözleşme imzalandı",
        date: addDays(-7).toISOString(),
      },
    ],
    files: [
      { id: "f3", name: "kiralama_sozlesmesi.pdf", url: "#" },
    ],
  },
];

