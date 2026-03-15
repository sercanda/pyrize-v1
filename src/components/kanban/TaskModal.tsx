"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Task, TaskPriority, TaskStatusColumn, PRIORITY_LABELS, COLUMNS } from "@/types/kanban";
import { useKanban } from "@/contexts/KanbanContext";
import {
  X, Calendar, Flag, LayoutGrid, Tag, ChevronDown,
  Image as ImageIcon, Link as LinkIcon, Plus, Upload
} from "lucide-react";
import type { DBCustomer, DBDeal } from "@/types/crm";
import { DanismanBilgileri } from "@/types";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  defaultColumn?: TaskStatusColumn;
}

const PROFILES_STORAGE_KEY = 'pyrize.consultantProfiles.v1';
const AVAILABLE_LABELS = ["acil", "yeni", "tasarım", "tadilat", "mobilya", "mutfak", "onay", "belge", "fotoğraf", "tanıtım", "sözleşme", "yarın", "plan", "aydınlatma"];

type ConsultantProfile = DanismanBilgileri & { id: string; label: string };

function generateAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

const PRIORITY_DOT: Record<TaskPriority, string> = {
  urgent: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-blue-400",
  low: "bg-slate-400",
  none: "bg-transparent",
};

export function TaskModal({ task, isOpen, onClose, defaultColumn }: TaskModalProps) {
  const { addTask, updateTask } = useKanban();
  const [savedProfiles, setSavedProfiles] = useState<ConsultantProfile[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [crmCustomers, setCrmCustomers] = useState<DBCustomer[]>([]);
  const [crmDeals, setCrmDeals] = useState<DBDeal[]>([]);
  const labelsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    statusColumn: defaultColumn || ("today" as TaskStatusColumn),
    priority: "medium" as TaskPriority,
    labels: [] as string[],
    commentsCount: 0,
    assignedUsers: [] as Array<{ id: string; avatar: string; name: string }>,
    customerId: "",
    customerName: "",
    dealId: "",
    dealTitle: "",
  });

  // Load saved profiles
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (stored) {
      try { setSavedProfiles(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // Load CRM data
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/crm/customers").then((r) => r.ok ? r.json() : []).then(setCrmCustomers).catch(() => {});
    fetch("/api/crm/deals").then((r) => r.ok ? r.json() : []).then(setCrmDeals).catch(() => {});
  }, [isOpen]);

  // Close labels dropdown on outside click
  useEffect(() => {
    if (!showLabels) return;
    const handler = (e: MouseEvent) => {
      if (labelsRef.current && !labelsRef.current.contains(e.target as Node)) setShowLabels(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLabels]);

  // Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    multiple: false,
    noClick: true,
  });

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImageUrl(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddLink = () => {
    const url = prompt("Bağlantı URL'sini girin:");
    if (url?.trim()) {
      setFormData((prev) => ({
        ...prev,
        description: prev.description ? `${prev.description}\n[${url}](${url})` : `[${url}](${url})`,
      }));
    }
  };

  // Fill form on edit
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 16),
        statusColumn: task.statusColumn,
        priority: task.priority,
        labels: task.labels,
        commentsCount: task.commentsCount,
        assignedUsers: task.assignedUsers.map((u) => ({ id: u.id, avatar: u.avatar, name: u.name || u.id })),
        customerId: task.customerId || "",
        customerName: task.customerName || "",
        dealId: task.dealId || "",
        dealTitle: task.dealTitle || "",
      });
      setImageUrl(task.imageUrl || null);
      if (task.customerId || task.dealId || task.assignedUsers.length > 0 || task.imageUrl) {
        setShowAdvanced(true);
      }
    } else {
      setFormData({
        title: "", description: "",
        dueDate: new Date().toISOString().slice(0, 16),
        statusColumn: defaultColumn || "today",
        priority: "medium",
        labels: [], commentsCount: 0, assignedUsers: [],
        customerId: "", customerName: "", dealId: "", dealTitle: "",
      });
      setImageUrl(null);
      setImageFile(null);
      setShowAdvanced(false);
    }
  }, [task, defaultColumn]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: new Date(formData.dueDate).toISOString(),
      statusColumn: formData.statusColumn,
      priority: formData.priority,
      labels: formData.labels,
      commentsCount: formData.commentsCount,
      assignedUsers: formData.assignedUsers.map((u) => ({ id: u.id, avatar: u.avatar })),
      imageUrl: imageUrl || undefined,
      customerId: formData.customerId || undefined,
      customerName: formData.customerName || undefined,
      dealId: formData.dealId || undefined,
      dealTitle: formData.dealTitle || undefined,
    };

    if (task) { updateTask(task.id, taskData); } else { addTask(taskData); }
    onClose();
  };

  const toggleLabel = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.includes(label) ? prev.labels.filter((l) => l !== label) : [...prev.labels, label],
    }));
  };

  const addCustomLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData((prev) => ({ ...prev, labels: [...prev.labels, newLabel.trim()] }));
      setNewLabel("");
    }
  };

  const toggleUser = (profile: ConsultantProfile) => {
    const user = { id: profile.id, avatar: profile.profilFotografi || generateAvatarUrl(profile.adSoyad), name: profile.adSoyad };
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.some((u) => u.id === user.id)
        ? prev.assignedUsers.filter((u) => u.id !== user.id)
        : [...prev.assignedUsers, user],
    }));
  };

  const addTempUser = () => {
    if (!newUserName.trim()) return;
    const tempUser = { id: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`, avatar: generateAvatarUrl(newUserName.trim()), name: newUserName.trim() };
    setFormData((prev) => ({ ...prev, assignedUsers: [...prev.assignedUsers, tempUser] }));
    setNewUserName("");
    setShowAddUserModal(false);
  };

  const hasCRM = crmCustomers.length > 0 || crmDeals.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0a1128]/95 backdrop-blur-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-base font-semibold text-white">
            {task ? "Görevi Düzenle" : "Yeni Görev"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-5">
          {/* Title */}
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="mt-3 w-full bg-transparent text-lg font-medium text-white placeholder-white/20 focus:outline-none"
            placeholder="Görev başlığı..."
            required
            autoFocus
          />

          {/* Description */}
          <div {...getRootProps()} className="relative mt-2">
            <input {...getInputProps()} />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={`w-full resize-none bg-transparent text-sm text-slate-300 placeholder-white/15 focus:outline-none ${isDragActive ? "opacity-30" : ""}`}
              rows={2}
              placeholder={isDragActive ? "Fotoğrafı bırakın..." : "Açıklama ekle..."}
            />
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-cyan-400/50 bg-cyan-500/5">
                <Upload className="h-5 w-5 text-cyan-300" />
              </div>
            )}
          </div>

          {/* Uploaded image preview */}
          {imageUrl && (
            <div className="relative mt-2 rounded-lg overflow-hidden border border-white/10">
              <Image src={imageUrl} alt="Görev fotoğrafı" width={400} height={160} className="w-full h-36 object-cover" unoptimized />
              <button type="button" onClick={() => { setImageUrl(null); setImageFile(null); }} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white/80 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="my-3 border-t border-white/[0.06]" />

          {/* Quick options row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date */}
            <label className="group flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white cursor-pointer">
              <Calendar className="h-3.5 w-3.5" />
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="bg-transparent text-xs text-slate-300 focus:outline-none w-[140px] [&::-webkit-calendar-picker-indicator]:invert"
                required
              />
            </label>

            {/* Priority */}
            <div className="relative">
              <select
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}
                className="appearance-none flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] pl-3 pr-7 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white cursor-pointer focus:outline-none [&>option]:bg-[#0a1128] [&>option]:text-white"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label || "Yok"}</option>
                ))}
              </select>
              <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${PRIORITY_DOT[formData.priority]}`} />
              <Flag className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
            </div>

            {/* Column */}
            <div className="relative">
              <select
                value={formData.statusColumn}
                onChange={(e) => setFormData((prev) => ({ ...prev, statusColumn: e.target.value as TaskStatusColumn }))}
                className="appearance-none flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] pl-7 pr-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white cursor-pointer focus:outline-none [&>option]:bg-[#0a1128] [&>option]:text-white"
              >
                {COLUMNS.map((col) => (
                  <option key={col.key} value={col.key}>{col.title}</option>
                ))}
              </select>
              <LayoutGrid className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>

            {/* Labels toggle */}
            <div className="relative" ref={labelsRef}>
              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition ${
                  formData.labels.length > 0
                    ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                {formData.labels.length > 0 ? formData.labels.length : "Etiket"}
              </button>

              {/* Labels dropdown */}
              {showLabels && (
                <div className="absolute left-0 top-full mt-1.5 z-10 w-64 rounded-xl border border-white/[0.08] bg-[#0a1128] p-3 shadow-xl">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {AVAILABLE_LABELS.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
                          formData.labels.includes(label)
                            ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30"
                            : "bg-white/5 text-slate-400 border border-transparent hover:bg-white/10"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomLabel(); } }}
                      placeholder="Özel etiket..."
                      className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/30"
                    />
                    <button type="button" onClick={addCustomLabel} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-400 hover:text-white hover:bg-white/10">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected labels preview */}
          {formData.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {formData.labels.map((label) => (
                <span
                  key={label}
                  onClick={() => toggleLabel(label)}
                  className="rounded-md bg-cyan-500/15 px-2 py-0.5 text-[11px] text-cyan-300 cursor-pointer hover:bg-cyan-500/25 transition"
                >
                  {label} <X className="inline h-2.5 w-2.5 ml-0.5" />
                </span>
              ))}
            </div>
          )}

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            {showAdvanced ? "Daha az seçenek" : "Daha fazla seçenek"}
          </button>

          {/* Advanced section */}
          {showAdvanced && (
            <div className="mt-3 space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              {/* Photo & Link buttons */}
              <div className="flex gap-2">
                <button type="button" onClick={handleImageUpload} className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:border-white/20 transition">
                  <ImageIcon className="h-3.5 w-3.5" /> Fotoğraf
                </button>
                <button type="button" onClick={handleAddLink} className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:border-white/20 transition">
                  <LinkIcon className="h-3.5 w-3.5" /> Bağlantı
                </button>
              </div>

              {/* CRM */}
              {hasCRM && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-wider">CRM Bağlantısı</p>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.customerId}
                      onChange={(e) => {
                        const customer = crmCustomers.find((c) => c.id === e.target.value);
                        setFormData((prev) => ({ ...prev, customerId: e.target.value, customerName: customer?.name || "" }));
                      }}
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/30 [&>option]:bg-[#0a1128] [&>option]:text-white"
                    >
                      <option value="">Müşteri seç...</option>
                      {crmCustomers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select
                      value={formData.dealId}
                      onChange={(e) => {
                        const deal = crmDeals.find((d) => d.id === e.target.value);
                        setFormData((prev) => ({ ...prev, dealId: e.target.value, dealTitle: deal?.title || "" }));
                      }}
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/30 [&>option]:bg-[#0a1128] [&>option]:text-white"
                    >
                      <option value="">Fırsat seç...</option>
                      {crmDeals.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Assigned Users */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Kişiler</p>
                  <button type="button" onClick={() => setShowAddUserModal(true)} className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition">
                    <Plus className="h-3 w-3" /> Yeni
                  </button>
                </div>

                {formData.assignedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.assignedUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, assignedUsers: prev.assignedUsers.filter((u) => u.id !== user.id) }));
                        }}
                        className="flex items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-200 hover:bg-cyan-500/20 transition"
                      >
                        <img src={user.avatar} alt={user.name} className="h-4 w-4 rounded-full" />
                        {user.name}
                        <X className="h-2.5 w-2.5" />
                      </button>
                    ))}
                  </div>
                )}

                {savedProfiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {savedProfiles.filter((p) => !formData.assignedUsers.some((u) => u.id === p.id)).map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => toggleUser(profile)}
                        className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400 hover:border-white/20 hover:text-white transition"
                      >
                        <img src={profile.profilFotografi || generateAvatarUrl(profile.adSoyad)} alt={profile.adSoyad} className="h-4 w-4 rounded-full" />
                        {profile.adSoyad}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-slate-400 hover:bg-white/5 transition">
              İptal
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="rounded-lg bg-[#DBE64C] px-5 py-2 text-xs font-semibold text-[#001F3F] shadow-[0_0_16px_rgba(219,230,76,0.2)] transition hover:opacity-90 disabled:opacity-40"
            >
              {task ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>

        {/* Add User Mini Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-xs rounded-xl border border-white/[0.08] bg-[#0a1128] p-5 shadow-2xl">
              <h3 className="text-sm font-semibold text-white mb-3">Yeni Kişi</h3>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTempUser(); } }}
                placeholder="İsim..."
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/30"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => { setShowAddUserModal(false); setNewUserName(""); }} className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition">
                  İptal
                </button>
                <button type="button" onClick={addTempUser} disabled={!newUserName.trim()} className="rounded-lg bg-[#DBE64C] px-3 py-1.5 text-xs font-semibold text-[#001F3F] disabled:opacity-40 transition hover:opacity-90">
                  Ekle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
