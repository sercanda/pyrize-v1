"use client";

import { useState } from "react";
import { CustomerStage, STAGES, RequestType, REQUEST_TYPE_LABELS } from "@/types/crm";
import { X, ChevronDown } from "lucide-react";

interface FilterBarProps {
  selectedStages: CustomerStage[];
  selectedTypes: RequestType[];
  selectedTags: string[];
  availableTags: string[];
  onStageToggle: (stage: CustomerStage) => void;
  onTypeToggle: (type: RequestType) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  selectedStages,
  selectedTypes,
  selectedTags,
  availableTags,
  onStageToggle,
  onTypeToggle,
  onTagToggle,
  onClearFilters,
}: FilterBarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const hasActiveFilters = selectedStages.length > 0 || selectedTypes.length > 0 || selectedTags.length > 0;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => toggleSection("stage")}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
        >
          <span>Aşama</span>
          {selectedStages.length > 0 && (
            <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-200">
              {selectedStages.length}
            </span>
          )}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${expandedSection === "stage" ? "rotate-180" : ""}`}
          />
        </button>

        <button
          onClick={() => toggleSection("type")}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
        >
          <span>Tip</span>
          {selectedTypes.length > 0 && (
            <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-200">
              {selectedTypes.length}
            </span>
          )}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${expandedSection === "type" ? "rotate-180" : ""}`}
          />
        </button>

        {availableTags.length > 0 && (
          <button
            onClick={() => toggleSection("tag")}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
          >
            <span>Etiket</span>
            {selectedTags.length > 0 && (
              <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-200">
                {selectedTags.length}
              </span>
            )}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${expandedSection === "tag" ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
          >
            <X className="h-3 w-3" />
            Temizle
          </button>
        )}
      </div>

      {expandedSection === "stage" && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
          {STAGES.map((stage) => (
            <button
              key={stage.key}
              onClick={() => onStageToggle(stage.key)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                selectedStages.includes(stage.key)
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {stage.title}
            </button>
          ))}
        </div>
      )}

      {expandedSection === "type" && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
          {Object.entries(REQUEST_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              onClick={() => onTypeToggle(type as RequestType)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                selectedTypes.includes(type as RequestType)
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {expandedSection === "tag" && availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                selectedTags.includes(tag)
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

