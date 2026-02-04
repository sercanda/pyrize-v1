import React from "react";

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  variant?: "default" | "selected";
}

export function TagBadge({ tag, onRemove, variant = "default" }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] transition ${
        variant === "selected"
          ? "border border-cyan-400/40 bg-cyan-500/20 text-cyan-200"
          : "border border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
      }`}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full hover:bg-cyan-500/30"
        >
          ×
        </button>
      )}
    </span>
  );
}

