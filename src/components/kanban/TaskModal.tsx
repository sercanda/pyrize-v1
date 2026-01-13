"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskPriority, TaskStatusColumn, PRIORITY_LABELS, COLUMNS } from "@/types/kanban";
import { useKanban } from "@/contexts/KanbanContext";
import { X, Plus, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";
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

type ConsultantProfile = DanismanBilgileri & {
  id: string;
  label: string;
};

function generateAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

export function TaskModal({ task, isOpen, onClose, defaultColumn }: TaskModalProps) {
  const { addTask, updateTask } = useKanban();
  const [savedProfiles, setSavedProfiles] = useState<ConsultantProfile[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    statusColumn: defaultColumn || ("today" as TaskStatusColumn),
    priority: "medium" as TaskPriority,
    labels: [] as string[],
    commentsCount: 0,
    assignedUsers: [] as Array<{ id: string; avatar: string; name: string }>,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: ConsultantProfile[] = JSON.parse(stored);
        setSavedProfiles(parsed);
      } catch (error) {
        console.warn("Kayıtlı profiller okunamadı:", error);
      }
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
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
        reader.onload = (event) => {
          setImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddLink = () => {
    const url = prompt("Bağlantı URL'sini girin:");
    if (url && url.trim()) {
      const linkText = `[${url}](${url})`;
      setFormData((prev) => ({
        ...prev,
        description: prev.description ? `${prev.description}\n${linkText}` : linkText,
      }));
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setImageFile(null);
  };

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
        assignedUsers: task.assignedUsers.map((u) => ({
          id: u.id,
          avatar: u.avatar,
          name: u.name || u.id,
        })),
      });
      setImageUrl(task.imageUrl || null);
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: new Date().toISOString().slice(0, 16),
        statusColumn: defaultColumn || ("today" as TaskStatusColumn),
        priority: "medium",
        labels: [],
        commentsCount: 0,
        assignedUsers: [],
      });
      setImageUrl(null);
      setImageFile(null);
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
      assignedUsers: formData.assignedUsers.map((u) => ({
        id: u.id,
        avatar: u.avatar,
      })),
      imageUrl: imageUrl || undefined,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const toggleLabel = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  const addCustomLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }));
      setNewLabel("");
    }
  };

  const toggleUser = (profile: ConsultantProfile) => {
    const user = {
      id: profile.id,
      avatar: profile.profilFotografi || generateAvatarUrl(profile.adSoyad),
      name: profile.adSoyad,
    };

    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.some((u) => u.id === user.id)
        ? prev.assignedUsers.filter((u) => u.id !== user.id)
        : [...prev.assignedUsers, user],
    }));
  };

  const toggleTempUser = (user: { id: string; avatar: string; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.some((u) => u.id === user.id)
        ? prev.assignedUsers.filter((u) => u.id !== user.id)
        : [...prev.assignedUsers, user],
    }));
  };

  const addTempUser = () => {
    if (!newUserName.trim()) return;

    const tempUser = {
      id: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      avatar: generateAvatarUrl(newUserName.trim()),
      name: newUserName.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      assignedUsers: [...prev.assignedUsers, tempUser],
    }));

    setNewUserName("");
    setShowAddUserModal(false);
  };

  // Seçili kullanıcıları ayır (kayıtlı vs geçici)
  const selectedUsers = formData.assignedUsers;
  const selectedSavedProfileIds = new Set(
    selectedUsers.filter((u) => !u.id.startsWith("temp_")).map((u) => u.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#050b1d] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">
          {task ? "Görevi Düzenle" : "Yeni Görev"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Başlık *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              placeholder="Görev başlığı..."
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-300">Açıklama</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  title="Fotoğraf Yükle"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Fotoğraf
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  title="Bağlantı Ekle"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  Bağlantı
                </button>
              </div>
            </div>
            <div
              {...getRootProps()}
              className={`relative rounded-lg border-2 border-dashed transition ${
                isDragActive
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <input {...getInputProps()} />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg bg-transparent px-4 py-2 text-white placeholder-slate-500 focus:outline-none"
                rows={3}
                placeholder={isDragActive ? "Fotoğrafı buraya bırakın..." : "Görev açıklaması..."}
              />
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/10">
                  <div className="flex flex-col items-center gap-2 text-cyan-200">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Fotoğrafı bırakın</span>
                  </div>
                </div>
              )}
            </div>
            {imageUrl && (
              <div className="mt-3 relative group">
                <div className="relative rounded-lg overflow-hidden border border-white/20 bg-white/5">
                  <Image
                    src={imageUrl}
                    alt="Görev fotoğrafı"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white transition hover:bg-red-500"
                    title="Fotoğrafı Kaldır"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Tarih *</label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Sütun</label>
              <select
                value={formData.statusColumn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, statusColumn: e.target.value as TaskStatusColumn }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none [&>option]:bg-[#050b1d] [&>option]:text-white"
              >
                {COLUMNS.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Öncelik</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none [&>option]:bg-[#050b1d] [&>option]:text-white"
            >
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-[#050b1d] text-white">
                  {label || "Yok"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Etiketler</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {AVAILABLE_LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    formData.labels.includes(label)
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                      : "border-white/20 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomLabel();
                  }
                }}
                placeholder="Yeni etiket ekle..."
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomLabel}
                className="flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <Plus className="h-4 w-4" />
                Etiket Ekle
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-300">Kişi Ekle</label>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                Yeni Kişi
              </button>
            </div>

            {/* Seçili Kullanıcılar */}
            {selectedUsers.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedUsers.map((user) => {
                  const isTemp = user.id.startsWith("temp_");
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        if (isTemp) {
                          toggleTempUser(user);
                        } else {
                          const profile = savedProfiles.find((p) => p.id === user.id);
                          if (profile) toggleUser(profile);
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-500/30"
                    >
                      <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                      <span>{user.name}</span>
                      <X className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Kayıtlı Profiller */}
            {savedProfiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedProfiles.map((profile) => {
                  const isSelected = selectedSavedProfileIds.has(profile.id);
                  const avatarUrl = profile.profilFotografi || generateAvatarUrl(profile.adSoyad);
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => toggleUser(profile)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                          : "border-white/20 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                      }`}
                    >
                      <img src={avatarUrl} alt={profile.adSoyad} className="h-5 w-5 rounded-full object-cover" />
                      <span>{profile.adSoyad}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {savedProfiles.length === 0 && selectedUsers.length === 0 && (
              <p className="text-xs text-slate-400">
                Kayıtlı profil yok. Yeni kişi eklemek için yukarıdaki butona tıklayın.
              </p>
            )}
          </div>

          {/* Yeni Kişi Ekleme Modalı */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#050b1d] p-6 shadow-2xl">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUserName("");
                  }}
                  className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="mb-4 text-xl font-bold text-white">Yeni Kişi Ekle</h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">İsim *</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTempUser();
                        }
                      }}
                      placeholder="Kişi adı..."
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddUserModal(false);
                        setNewUserName("");
                      }}
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={addTempUser}
                      disabled={!newUserName.trim()}
                      className="rounded-lg bg-[#24d6a4] px-4 py-2 text-sm font-semibold text-page-bg shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#24d6a4] px-6 py-2 text-sm font-semibold text-page-bg shadow-lg transition hover:opacity-90"
            >
              {task ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
