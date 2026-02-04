"use client";

import { useState, useEffect } from "react";
import { Customer, CustomerStage, RequestType, STAGES, REQUEST_TYPE_LABELS, AssignedAgent } from "@/types/crm";
import { useCRM } from "@/contexts/CRMContext";
import { X } from "lucide-react";
import { generateAvatarUrl } from "@/lib/kanban/utils";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: CustomerStage;
}

const agents: AssignedAgent[] = [
  { id: "agent-1", avatar: generateAvatarUrl("Ayşe Yılmaz"), name: "Ayşe Yılmaz" },
  { id: "agent-2", avatar: generateAvatarUrl("Mehmet Demir"), name: "Mehmet Demir" },
  { id: "agent-3", avatar: generateAvatarUrl("Selin Kaya"), name: "Selin Kaya" },
];

export function CreateCustomerModal({ isOpen, onClose, defaultStage }: CreateCustomerModalProps) {
  const { addCustomer } = useCRM();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    stage: (defaultStage || "newLead") as CustomerStage,
    tags: [] as string[],
    budgetMin: 0,
    budgetMax: 0,
    interestAreas: [] as string[],
    requestType: "buy" as RequestType,
    notes: "",
    assignedAgent: agents[0],
  });
  const [newTag, setNewTag] = useState("");
  const [newArea, setNewArea] = useState("");

  useEffect(() => {
    if (defaultStage) {
      setFormData((prev) => ({ ...prev, stage: defaultStage }));
    }
  }, [defaultStage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) return;

    addCustomer({
      ...formData,
      tags: formData.tags,
      interestAreas: formData.interestAreas,
      properties: [],
    });

    setFormData({
      name: "",
      phone: "",
      email: "",
      stage: defaultStage || "newLead",
      tags: [],
      budgetMin: 0,
      budgetMax: 0,
      interestAreas: [],
      requestType: "buy",
      notes: "",
      assignedAgent: agents[0],
    });
    onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#050b1d] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">Yeni Müşteri Ekle</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Ad Soyad *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Telefon *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">E-posta *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Aşama</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData((prev) => ({ ...prev, stage: e.target.value as CustomerStage }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, requestType: e.target.value as RequestType }))}
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
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                min="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Max Bütçe (₺)</label>
              <input
                type="number"
                value={formData.budgetMax || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Etiketler</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
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
                Ekle
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
                Ekle
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Atanan Ajan</label>
            <select
              value={formData.assignedAgent.id}
              onChange={(e) => {
                const agent = agents.find((a) => a.id === e.target.value);
                if (agent) setFormData((prev) => ({ ...prev, assignedAgent: agent }));
              }}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none [&>option]:bg-[#050b1d] [&>option]:text-white"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              placeholder="Müşteri hakkında notlar..."
            />
          </div>

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
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

