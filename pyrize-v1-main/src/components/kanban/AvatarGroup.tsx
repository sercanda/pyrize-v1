"use client";

import { AssignedUser } from "@/types/kanban";
import Image from "next/image";

interface AvatarGroupProps {
  users: AssignedUser[];
  maxVisible?: number;
}

export function AvatarGroup({ users, maxVisible = 2 }: AvatarGroupProps) {
  const visible = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  return (
    <div className="flex -space-x-2">
      {visible.map((user) => (
        <div
          key={user.id}
          className="relative h-6 w-6 rounded-full border-2 border-[#050b1d] overflow-hidden bg-white/10"
          title={user.name || user.id}
        >
          <Image
            src={user.avatar}
            alt={user.name || user.id}
            width={24}
            height={24}
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
      {remaining > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#050b1d] bg-white/10 text-[10px] font-semibold text-slate-300">
          +{remaining}
        </div>
      )}
    </div>
  );
}

