"use client";

import { useState, useEffect } from "react";
import { Customer, ActivityType, ACTIVITY_TYPE_LABELS, REQUEST_TYPE_LABELS, STAGES } from "@/types/crm";
import { useCRM } from "@/contexts/CRMContext";
import { X, Phone, Mail, DollarSign, MapPin, FileText, Plus, Upload, Trash2 } from "lucide-react";
import { ActivityTimeline } from "./ActivityTimeline";
import { TagBadge } from "./TagBadge";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "profile" | "notes" | "activities" | "files" | "properties";

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerDetailModalProps) {
  const { updateCustomer, addActivity, addFile, removeFile } = useCRM();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    stage: "newLead" as Customer["stage"],
    tags: [] as string[],
    budgetMin: 0,
    budgetMax: 0,
    interestAreas: [] as string[],
    requestType: "buy" as Customer["requestType"],
    notes: "",
  });
  const [newTag, setNewTag] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newNote, setNewNote] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("note");
  const [activityDescription, setActivityDescription] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          addFile(customer!.id, {
            id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            url: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    multiple: true,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        stage: customer.stage,
        tags: customer.tags,
        budgetMin: customer.budgetMin,
        budgetMax: customer.budgetMax,
        interestAreas: customer.interestAreas,
        requestType: customer.requestType,
        notes: customer.notes,
      });
      setEditMode(false);
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSave = () => {
    updateCustomer(customer.id, formData);
    setEditMode(false);
  };

  const handleAddActivity = () => {
    if (!activityDescription.trim()) return;
    addActivity(customer.id, {
      type: activityType,
      description: activityDescription,
    });
    setActivityDescription("");
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addArea = () => {
    if (newArea.trim() && !formData.interestAreas.includes(newArea.trim())) {
      setFormData((prev) => ({ ...prev, interestAreas: [...prev.interestAreas, newArea.trim()] }));
      setNewArea("");
    }
  };

  const removeArea = (area: string) => {
    setFormData((prev) => ({ ...prev, interestAreas: prev.interestAreas.filter((a) => a !== area) }));
  };

  const formatBudget = () => {
    if (customer.budgetMin === 0 && customer.budgetMax === 0) return "Belirtilmemiş";
    if (customer.budgetMin === customer.budgetMax) {
      return `${(customer.budgetMin / 1000000).toFixed(1)}M ₺`;
    }
    return `${(customer.budgetMin / 1000000).toFixed(1)}M - ${(customer.budgetMax / 1000000).toFixed(1)}M ₺`;
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "profile", label: "Profil" },
    { id: "notes", label: "Notlar" },
    { id: "activities", label: "Aktiviteler" },
    { id: "files", label: "Dosyalar" },
    { id: "properties", label: "İlgili Mülkler" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#050b1d] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10">
                <Image
                  src={customer.assignedAgent.avatar}
                  alt={customer.assignedAgent.name || "Agent"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
                <p className="text-sm text-slate-400">{REQUEST_TYPE_LABELS[customer.requestType]}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                {STAGES.find((s) => s.key === customer.stage)?.title}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-200"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "profile" && (
            <div className="space-y-4">
              {editMode ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">Ad Soyad</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">Telefon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">E-posta</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">Aşama</label>
                      <select
                        value={formData.stage}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stage: e.target.value as Customer["stage"] }))}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none [&>option]:bg-[#050b1d] [&>option]:text-white"
                      >
                        {STAGES.map((stage) => (
                          <option key={stage.key} value={stage.key}>
                            {stage.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">İstek Tipi</label>
                      <select
                        value={formData.requestType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, requestType: e.target.value as Customer["requestType"] }))}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none [&>option]:bg-[#050b1d] [&>option]:text-white"
                      >
                        {Object.entries(REQUEST_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">Min Bütçe (₺)</label>
                      <input
                        type="number"
                        value={formData.budgetMin || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, budgetMin: Number(e.target.value) }))}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">Max Bütçe (₺)</label>
                      <input
                        type="number"
                        value={formData.budgetMax || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: Number(e.target.value) }))}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">Etiketler</label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Etiket ekle..."
                        className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">İlgi Alanları</label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.interestAreas.map((area) => (
                        <span
                          key={area}
                          className="flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeArea(area)}
                            className="hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArea();
                          }
                        }}
                        placeholder="Bölge ekle..."
                        className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addArea}
                        className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditMode(false)}
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-lg bg-[#DBE64C] px-4 py-2 text-sm font-semibold text-page-bg shadow-lg transition hover:opacity-90"
                    >
                      Kaydet
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                      <Phone className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Telefon</p>
                        <p className="font-semibold text-white">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">E-posta</p>
                        <p className="font-semibold text-white">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Bütçe</p>
                        <p className="font-semibold text-white">{formatBudget()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">İlgi Alanları</p>
                        <p className="font-semibold text-white">
                          {customer.interestAreas.length > 0 ? customer.interestAreas.join(", ") : "Belirtilmemiş"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {customer.tags.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-300">Etiketler</p>
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.map((tag) => (
                          <TagBadge key={tag} tag={tag} />
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    Düzenle
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <textarea
                value={editMode ? formData.notes : customer.notes}
                onChange={(e) => {
                  if (editMode) {
                    setFormData((prev) => ({ ...prev, notes: e.target.value }));
                  } else {
                    updateCustomer(customer.id, { notes: e.target.value });
                  }
                }}
                rows={10}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                placeholder="Notlarınızı buraya yazın..."
              />
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex gap-2">
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none [&>option]:bg-[#050b1d] [&>option]:text-white"
                  >
                    {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    placeholder="Aktivite açıklaması..."
                    className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={handleAddActivity}
                    disabled={!activityDescription.trim()}
                    className="rounded-lg bg-[#DBE64C] px-4 py-2 text-sm font-semibold text-page-bg shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ActivityTimeline activities={customer.activities} />
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:border-cyan-400"
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-300">Dosya yüklemek için tıklayın veya sürükleyin</p>
              </div>
              {customer.files.length > 0 && (
                <div className="space-y-2">
                  {customer.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <span className="text-sm text-white">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(customer.id, file.id)}
                        className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "properties" && (
            <div className="space-y-4">
              {customer.properties.length > 0 ? (
                customer.properties.map((property) => (
                  <div
                    key={property.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{property.title}</h4>
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                        %{property.match} Eşleşme
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-xs text-slate-400">
                  İlgili mülk bulunmuyor
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

