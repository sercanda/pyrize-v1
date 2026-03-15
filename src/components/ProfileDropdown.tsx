'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type MenuItem =
  | { type: 'link'; label: string; description?: string; href: string; icon: React.ComponentType<{ className?: string }> }
  | { type: 'action'; label: string; description?: string; icon: React.ComponentType<{ className?: string }>; onClick: () => void };

interface ProfileDropdownProps {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

const menuItems = (onLogout?: () => void): MenuItem[] => [
  {
    type: 'link',
    label: 'Profil Ayarları',
    description: 'Kişisel bilgilerinizi düzenleyin',
    href: '/dashboard/profil',
    icon: Settings,
  },
  {
    type: 'link',
    label: 'Dashboard',
    description: 'Sunumlarınızı yönetin',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    type: 'action',
    label: 'Çıkış Yap',
    description: 'Oturumunuzu sonlandırın',
    icon: LogOut,
    onClick: onLogout || (() => Promise.resolve()),
  },
];

const getInitials = (name: string) => {
  if (!name) return 'PR';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export function ProfileDropdown({ name, email, role, avatarUrl, onLogout }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  const items = menuItems(onLogout);

  return (
    <div className="relative z-[1000]" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-left text-xs font-medium uppercase tracking-[0.35em] text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#DBE64C]/30 bg-[#DBE64C]/10 text-sm font-semibold text-[#DBE64C]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </span>
        <span className="hidden md:flex flex-col leading-tight tracking-normal text-left normal-case">
          <span
            className="text-sm font-semibold text-white hover:text-cyan-200"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
              router.push('/dashboard');
            }}
          >
            {name}
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">
            {role || 'Premier Üye'}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-300 transition group-hover:text-white ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-[60] mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#040b1f]/95 backdrop-blur-xl shadow-[0_25px_60px_rgba(8,16,32,0.45)]"
        >
          <div className="border-b border-white/10 bg-white/5 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#DBE64C]/30 bg-[#DBE64C]/10 text-lg font-semibold text-[#DBE64C]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{name}</p>
                {email ? (
                  <p className="text-xs text-slate-400">{email}</p>
                ) : (
                  <p className="text-xs text-slate-400">premium kullanıcı</p>
                )}
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 p-2" aria-label="Profil menüsü">
            {items.map((item) => {
              const Icon = item.icon;
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl px-3.5 py-3 text-left transition hover:bg-white/8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-200 transition group-hover:bg-cyan-500/20">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="flex-1">
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      {item.description && (
                        <span className="block text-xs text-slate-400">{item.description}</span>
                      )}
                    </span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className="group flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left transition hover:bg-white/8"
                >
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-200 transition group-hover:bg-rose-500/20">
                    <item.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="flex-1">
                    <span className="text-sm font-medium text-white">{item.label}</span>
                    {item.description && (
                      <span className="block text-xs text-slate-400">{item.description}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

