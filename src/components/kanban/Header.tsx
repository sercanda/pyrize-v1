"use client";

import { useState } from "react";
import { Search, Settings, Star, ChevronDown } from "lucide-react";
import { useKanban } from "@/contexts/KanbanContext";

type ViewMode = "list" | "planner" | "gantt" | "dueDate" | "calendar";

interface HeaderProps {
  onNewTask: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const FILTER_TABS: Array<{ id: ViewMode; label: string }> = [
  { id: "list", label: "Liste" },
  { id: "planner", label: "Planlayıcı" },
  { id: "gantt", label: "Gantt" },
  { id: "dueDate", label: "Son Tarih" },
  { id: "calendar", label: "Takvim" },
];

export function Header({ onNewTask, viewMode, onViewModeChange, searchQuery = "", onSearchChange }: HeaderProps) {
  const { tasks } = useKanban();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const overdueCount = tasks.filter((t) => t.statusColumn === "overdue").length;
  const commentsCount = tasks.reduce((sum, t) => sum + t.commentsCount, 0);

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchQuery(value);
    }
  };

  const currentSearchQuery = onSearchChange ? searchQuery : localSearchQuery;

  return (
    <div className="mb-6 space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">Görevler</h1>
          <Star className="h-5 w-5 text-yellow-400" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewTask}
            className="flex items-center gap-2 rounded-lg bg-[#DBE64C] px-4 py-2 text-sm font-semibold text-page-bg shadow-lg transition hover:opacity-90"
          >
            YENİ GÖREV
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <span>Devam ediyor</span>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-200">
              {tasks.filter((t) => t.statusColumn !== "overdue" && t.statusColumn !== "nextMonth").length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={currentSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Ara..."
                className="w-64 rounded-lg border border-white/10 bg-white/5 px-10 py-2 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewModeChange(tab.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              viewMode === tab.id
                ? "bg-cyan-500/20 text-cyan-200"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-4">
          {overdueCount > 0 && (
            <button className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-200">
              Süresi geçen
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold">
                {overdueCount}
              </span>
            </button>
          )}

          {commentsCount > 0 && (
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
              Yorumlar
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-200">
                {commentsCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

