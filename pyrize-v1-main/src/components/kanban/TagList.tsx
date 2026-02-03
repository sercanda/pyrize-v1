"use client";

interface TagListProps {
  tags: string[];
  maxVisible?: number;
}

export function TagList({ tags, maxVisible = 3 }: TagListProps) {
  const visible = tags.slice(0, maxVisible);
  const remaining = tags.length - maxVisible;

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-cyan-200"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
          +{remaining}
        </span>
      )}
    </div>
  );
}

