"use client";

import { Activity, ACTIVITY_TYPE_LABELS } from "@/types/crm";
import { Phone, MessageSquare, FileText, File, Presentation } from "lucide-react";

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "call":
      return <Phone className={iconClass} />;
    case "message":
      return <MessageSquare className={iconClass} />;
    case "note":
      return <FileText className={iconClass} />;
    case "file":
      return <File className={iconClass} />;
    case "presentation":
      return <Presentation className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-xs text-slate-400">
        Aktivite bulunmuyor
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-300/40"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-200">
            <ActivityIcon type={activity.type} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{ACTIVITY_TYPE_LABELS[activity.type]}</p>
              <span className="text-xs text-slate-400">
                {new Date(activity.date).toLocaleString("tr-TR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

