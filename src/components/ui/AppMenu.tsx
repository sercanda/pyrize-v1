'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';

interface AppMenuProps {
  items: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    destructive?: boolean;
  }[];
  trigger?: React.ReactNode;
}

export function AppMenu({ items, trigger }: AppMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {trigger ?? <MoreVertical className="h-4 w-4" />}
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="z-50 min-w-[160px] rounded-xl border border-white/[0.08] bg-[#0d1631] py-1 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl focus:outline-none"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <MenuItem key={item.label}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                }}
                className={[
                  'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                  item.destructive
                    ? 'text-red-400 data-[focus]:bg-red-500/10 data-[focus]:text-red-300'
                    : 'text-slate-300 data-[focus]:bg-white/[0.08] data-[focus]:text-white',
                ].join(' ')}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </button>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
